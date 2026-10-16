import test from 'node:test';
import assert from 'node:assert/strict';
import {
  SAMPLE_INPUT,
  relaxJson,
  normalizeName,
  parseAmount,
  normalizeStatus,
  normalizePhone,
  runPipeline,
} from '../src/lib/pipeline-simulator';

test('relaxJson strips comments and trailing commas but never touches strings', () => {
  const out = relaxJson('[{"a": "http://x.com, ]", /* c */ "b": 1,}, // tail\n]');
  assert.deepEqual(JSON.parse(out), [{ a: 'http://x.com, ]', b: 1 }]);
});

test('relaxJson respects quotes, comment markers and backslashes inside strings', () => {
  const tricky = 'say "hi" // not a comment, ] and a backslash \\ end';
  const input = `[{"a": ${JSON.stringify(tricky)}}, // trailing note\n]`;
  assert.deepEqual(JSON.parse(relaxJson(input)), [{ a: tricky }]);
});

test('normalizeName handles separators, aliases, camelCase and ALL-CAPS', () => {
  assert.equal(normalizeName('  Northwind_Logistics_Juba '), 'Northwind Logistics Juba');
  assert.equal(normalizeName('CONTOSO_BANK_SS'), 'Contoso Bank South Sudan');
  assert.equal(normalizeName('FabrikamTelecom_EA'), 'Fabrikam Telecom East Africa');
  assert.equal(normalizeName('UNICEF_Juba'), 'UNICEF Juba'); // mixed case: acronyms preserved
  assert.equal(normalizeName(''), '');
});

test('parseAmount recovers numbers from messy strings and rejects junk', () => {
  assert.equal(parseAmount(' $12,500.00 '), 12500);
  assert.equal(parseAmount('45000USD'), 45000);
  assert.equal(parseAmount(7.456), 7.46);
  assert.equal(parseAmount('  N/A '), null);
  assert.equal(parseAmount('abc'), null);
  assert.equal(parseAmount(''), null);
});

test('normalizeStatus strips _ERR and flags unknown values', () => {
  assert.deepEqual(normalizeStatus('PENDING_ERR'), { value: 'PENDING', recognized: true });
  assert.deepEqual(normalizeStatus(' approved '), { value: 'APPROVED', recognized: true });
  assert.deepEqual(normalizeStatus('UNKNOWN_VAL'), { value: 'NEEDS_REVIEW', recognized: false });
  assert.deepEqual(normalizeStatus(undefined), { value: 'NEEDS_REVIEW', recognized: false });
});

test('normalizePhone formats valid +211 numbers and rejects malformed ones', () => {
  assert.equal(normalizePhone('211920001100'), '+211-920-001-100');
  assert.equal(normalizePhone('0920001100'), '+211-920-001-100');
  assert.equal(normalizePhone('+211 920 001 100'), '+211-920-001-100');
  assert.equal(normalizePhone('09123--MISSING'), null);
  assert.equal(normalizePhone('2119200011'), null); // too short — not silently "fixed"
  assert.equal(normalizePhone(undefined), null);
});

test('runPipeline on the sample data: dedupes, normalizes, flags, scores', () => {
  const result = runPipeline(SAMPLE_INPUT);
  assert.ok(result.ok);
  if (!result.ok) return;

  assert.equal(result.stats.inputRows, 4);
  assert.equal(result.stats.outputRows, 3);
  assert.equal(result.stats.duplicatesStripped, 1);

  const [a, b, c] = result.records;
  assert.deepEqual(a, {
    id: 'CRDPH-101',
    organization: 'Northwind Logistics Juba',
    amount_usd: 12500,
    status: 'PENDING',
    phone_cleaned: 'N/A',
    quality_score: 0.75,
    flags: ['phone_invalid'],
  });
  assert.equal(b.organization, 'Contoso Bank South Sudan');
  assert.equal(b.amount_usd, 45000);
  assert.equal(b.phone_cleaned, '+211-920-001-100');
  assert.equal(b.quality_score, 1);
  assert.deepEqual(b.flags, []);
  assert.equal(c.status, 'NEEDS_REVIEW');
  assert.equal(c.amount_usd, 0);
  assert.deepEqual(c.flags, ['amount_imputed_zero', 'status_unrecognized', 'phone_missing']);
  assert.equal(c.quality_score, 0.25);
});

test('duplicates merge missing fields from later rows', () => {
  const result = runPipeline('[{"id":1,"client_name":"A"},{"id":1,"client_name":"A","phone":"211920001100"}]');
  assert.ok(result.ok);
  if (!result.ok) return;
  assert.equal(result.records.length, 1);
  assert.equal(result.records[0].phone_cleaned, '+211-920-001-100');
});

test('rows without ids are deduped by content and still get stable ids', () => {
  const result = runPipeline('[{"client_name":"X"},{"client_name":"X"},{"client_name":"Y"}]');
  assert.ok(result.ok);
  if (!result.ok) return;
  assert.equal(result.stats.duplicatesStripped, 1);
  assert.deepEqual(result.records.map((r) => r.id), ['CRDPH-ROW-1', 'CRDPH-ROW-2']);
});

test('a single object is accepted; bad input returns friendly errors, never throws', () => {
  assert.ok(runPipeline('{"id": 5, "client_name": "Solo"}').ok);

  for (const bad of ['', '   ', '{not json', '[1, 2]', '"text"', 'x'.repeat(100_001)]) {
    const result = runPipeline(bad);
    assert.equal(result.ok, false, `expected failure for ${bad.slice(0, 15)}`);
    if (!result.ok) assert.ok(result.error.length > 0);
  }
});
