/**
 * CRDPH pipeline simulator — a real, deterministic, client-side data-cleaning
 * engine used by the homepage demo. Pure functions, no imports, no network:
 * nothing the visitor pastes ever leaves their browser.
 *
 * Pipeline: tolerant parse → merge duplicate ids → normalize each field →
 * score. Every transformation is rule-based and explainable (see below).
 */

export const MAX_INPUT_CHARS = 100_000;
export const MAX_ROWS = 2_000;

export type CleanRecord = {
  id: string;
  organization: string;
  amount_usd: number;
  status: string;
  phone_cleaned: string;
  /** Share of the four validated fields that passed without imputation (0–1). */
  quality_score: number;
  flags: string[];
};

export type PipelineStats = {
  inputRows: number;
  outputRows: number;
  duplicatesStripped: number;
  fieldsFixed: number;
};

export type PipelineResult =
  | { ok: true; records: CleanRecord[]; stats: PipelineStats }
  | { ok: false; error: string };

export const SAMPLE_INPUT = `[
  {"id": 101, "client_name": "  Northwind_Logistics_Juba ", "amount": " $12,500.00 ", "status": "PENDING_ERR", "phone": "09123--MISSING"},
  {"id": 102, "client_name": "CONTOSO_BANK_SS", "amount": "45000USD", "status": "APPROVED", "phone": "211920001100"},
  {"id": 101, "client_name": "  Northwind_Logistics_Juba ", "amount": " $12,500.00 ", "status": "PENDING_ERR"}, // Duplicate row
  {"id": 104, "client_name": "FabrikamTelecom_EA", "amount": "  N/A ", "status": "UNKNOWN_VAL"}
]`;

/* ------------------------------------------------------------------ parsing */

/** Pass 1: remove // and block comments, leaving string contents untouched. */
function stripComments(text: string): string {
  let out = '';
  let inString = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];

    if (inString) {
      out += ch;
      if (ch === '\\') {
        out += next ?? '';
        i++;
      } else if (ch === '"') {
        inString = false;
      }
      continue;
    }
    if (ch === '"') {
      inString = true;
      out += ch;
    } else if (ch === '/' && next === '/') {
      while (i < text.length && text[i] !== '\n') i++;
      out += '\n';
    } else if (ch === '/' && next === '*') {
      i += 2;
      while (i < text.length && !(text[i] === '*' && text[i + 1] === '/')) i++;
      i++; // skip the closing '/'
    } else {
      out += ch;
    }
  }
  return out;
}

/** Pass 2 (run on comment-free text): drop commas that directly precede ] or }. */
function stripTrailingCommas(text: string): string {
  let out = '';
  let inString = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];

    if (inString) {
      out += ch;
      if (ch === '\\') {
        out += text[i + 1] ?? '';
        i++;
      } else if (ch === '"') {
        inString = false;
      }
      continue;
    }
    if (ch === '"') {
      inString = true;
      out += ch;
      continue;
    }
    if (ch === ',') {
      let j = i + 1;
      while (j < text.length && /\s/.test(text[j])) j++;
      if (text[j] === ']' || text[j] === '}') continue;
    }
    out += ch;
  }
  return out;
}

/**
 * Makes "almost JSON" (comments, trailing commas — typical of text copied from
 * spreadsheets, logs and docs) parseable. Two passes so that a trailing comma
 * followed by a comment is handled correctly.
 */
export function relaxJson(text: string): string {
  return stripTrailingCommas(stripComments(text));
}

/* -------------------------------------------------------- field normalizers */

const NAME_ALIASES: Record<string, string> = {
  ss: 'South Sudan',
  moh: 'Ministry of Health',
  ea: 'East Africa',
};

export function normalizeName(raw: unknown): string {
  const original = typeof raw === 'string' ? raw : raw == null ? '' : String(raw);
  const trimmed = original.trim();
  if (!trimmed) return '';
  const allCaps = trimmed === trimmed.toUpperCase();

  return trimmed
    .split(/[\s_]+/)
    .filter(Boolean)
    .map((token) => {
      const alias = NAME_ALIASES[token.toLowerCase()];
      if (alias) return alias;
      let word = token.replace(/([a-z])([A-Z])/g, '$1 $2'); // FabrikamTelecom → Fabrikam Telecom
      if (allCaps && word.length > 3) word = word[0] + word.slice(1).toLowerCase(); // CONTOSO → Contoso
      return word;
    })
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Returns null when no number can be recovered (caller imputes 0 and flags it). */
export function parseAmount(raw: unknown): number | null {
  if (typeof raw === 'number') return Number.isFinite(raw) ? round2(raw) : null;
  if (typeof raw !== 'string') return null;
  const s = raw.trim();
  if (!s || /^(n\/?a|null|none|-+)$/i.test(s)) return null;
  const cleaned = s.replace(/[^0-9.\-]/g, '');
  if (!/\d/.test(cleaned)) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? round2(n) : null;
}

const KNOWN_STATUSES = new Set(['APPROVED', 'PENDING', 'REJECTED', 'VALIDATED']);

export function normalizeStatus(raw: unknown): { value: string; recognized: boolean } {
  const s = String(raw ?? '')
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, '_')
    .replace(/_ERR$/, '');
  return KNOWN_STATUSES.has(s) ? { value: s, recognized: true } : { value: 'NEEDS_REVIEW', recognized: false };
}

/** South Sudan numbers: +211 followed by 9 digits (accepts 0-prefixed local form). */
export function normalizePhone(raw: unknown): string | null {
  if (raw == null) return null;
  let digits = String(raw).replace(/\D/g, '');
  if (digits.startsWith('00')) digits = digits.slice(2);
  if (digits.length === 10 && digits.startsWith('0')) digits = '211' + digits.slice(1);
  if (digits.length === 12 && digits.startsWith('211')) {
    return `+211-${digits.slice(3, 6)}-${digits.slice(6, 9)}-${digits.slice(9)}`;
  }
  return null;
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

/* ----------------------------------------------------------------- pipeline */

type RawRow = Record<string, unknown>;

const isBlank = (v: unknown) => v == null || (typeof v === 'string' && v.trim() === '');

export function runPipeline(input: string, idPrefix = 'CRDPH'): PipelineResult {
  if (input.length > MAX_INPUT_CHARS) {
    return { ok: false, error: `Input is too large for the demo (max ${MAX_INPUT_CHARS.toLocaleString()} characters).` };
  }
  if (!input.trim()) return { ok: false, error: 'Paste some JSON records first, or use "Reset Sample Data".' };

  let parsed: unknown;
  try {
    parsed = JSON.parse(relaxJson(input));
  } catch (err) {
    const detail = err instanceof Error ? err.message : 'unknown parse error';
    return { ok: false, error: `Could not parse input as JSON — ${detail}` };
  }

  const rows: unknown[] = Array.isArray(parsed) ? parsed : [parsed];
  if (rows.length > MAX_ROWS) {
    return { ok: false, error: `Too many rows for the demo (max ${MAX_ROWS.toLocaleString()}).` };
  }
  if (rows.some((r) => typeof r !== 'object' || r === null || Array.isArray(r))) {
    return { ok: false, error: 'Every record must be a JSON object, e.g. {"id": 1, "client_name": "…"}.' };
  }

  // 1) Merge duplicates (same id, or identical content when there is no id),
  //    keeping the first non-blank value seen for every field.
  const merged = new Map<string, RawRow>();
  for (const row of rows as RawRow[]) {
    const key = !isBlank(row.id)
      ? `id:${String(row.id).trim()}`
      : `row:${JSON.stringify(row, Object.keys(row).sort())}`;
    const existing = merged.get(key);
    if (!existing) {
      merged.set(key, { ...row });
    } else {
      for (const [field, value] of Object.entries(row)) {
        if (isBlank(existing[field]) && !isBlank(value)) existing[field] = value;
      }
    }
  }
  const duplicatesStripped = rows.length - merged.size;

  // 2) Normalize + validate each merged record.
  let fieldsFixed = 0;
  let seq = 0;
  const records: CleanRecord[] = [];

  for (const raw of merged.values()) {
    seq++;
    const flags: string[] = [];
    let valid = 0;

    const rawName = typeof raw.client_name === 'string' ? raw.client_name : String(raw.client_name ?? '');
    const organization = normalizeName(raw.client_name);
    if (organization) valid++;
    else flags.push('organization_missing');
    if (organization !== rawName) fieldsFixed++;

    const amount = parseAmount(raw.amount);
    if (amount !== null) {
      valid++;
      if (typeof raw.amount !== 'number') fieldsFixed++; // string parsed to a number
    } else {
      flags.push('amount_imputed_zero');
      fieldsFixed++;
    }

    const status = normalizeStatus(raw.status);
    if (status.recognized) valid++;
    else flags.push('status_unrecognized');
    if (status.value !== String(raw.status ?? '')) fieldsFixed++;

    const phone = normalizePhone(raw.phone);
    if (phone) {
      valid++;
      if (phone !== String(raw.phone)) fieldsFixed++;
    } else {
      flags.push(isBlank(raw.phone) ? 'phone_missing' : 'phone_invalid');
      if (!isBlank(raw.phone)) fieldsFixed++;
    }

    records.push({
      id: !isBlank(raw.id) ? `${idPrefix}-${String(raw.id).trim()}` : `${idPrefix}-ROW-${seq}`,
      organization,
      amount_usd: amount ?? 0,
      status: status.value,
      phone_cleaned: phone ?? 'N/A',
      quality_score: round2(valid / 4),
      flags,
    });
  }

  return {
    ok: true,
    records,
    stats: { inputRows: rows.length, outputRows: records.length, duplicatesStripped, fieldsFixed },
  };
}
