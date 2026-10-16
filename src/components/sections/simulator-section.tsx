'use client';

import { useEffect, useRef, useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import { Container } from '@/components/container';
import { SectionHeading } from './section-heading';
import { SAMPLE_INPUT, runPipeline, type PipelineResult } from '@/lib/pipeline-simulator';
import { brand } from '@/config/brand';

type Status = 'idle' | 'running' | 'done' | 'error';

const statusStyle: Record<Status, { label: string; className: string }> = {
  idle: { label: 'STATUS: IDLE', className: 'text-gray-400' },
  running: { label: 'PROCESSING…', className: 'animate-pulse text-yellow-400 motion-reduce:animate-none' },
  done: { label: 'STATUS: SUCCESS', className: 'text-emerald-400' },
  error: { label: 'STATUS: ERROR', className: 'text-red-400' },
};

export function SimulatorSection() {
  const [input, setInput] = useState(SAMPLE_INPUT);
  const [status, setStatus] = useState<Status>('idle');
  const [result, setResult] = useState<PipelineResult | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);
  const timer = useRef<number>();

  useEffect(() => () => window.clearTimeout(timer.current), []);

  function run() {
    setStatus('running');
    // Short pause so the "processing" state is visible; the engine itself runs in well under a ms.
    timer.current = window.setTimeout(() => {
      const started = performance.now();
      const res = runPipeline(input, brand.acronym);
      setElapsedMs(performance.now() - started);
      setResult(res);
      setStatus(res.ok ? 'done' : 'error');
    }, 350);
  }

  function reset() {
    window.clearTimeout(timer.current);
    setInput(SAMPLE_INPUT);
    setResult(null);
    setElapsedMs(0);
    setStatus('idle');
  }

  const stats = result?.ok ? result.stats : null;
  const output =
    result == null
      ? '// Click "Run CRDPH Pipeline Engine" to process messy input...'
      : result.ok
        ? JSON.stringify(result.records, null, 2)
        : `// ${result.error}`;

  return (
    <section id="simulator" className="section scroll-mt-20">
      <Container>
        <SectionHeading eyebrow="Interactive Demo" title="Live Pipeline & Data Cleaner Simulator">
          Test how {brand.acronym} algorithms ingest dirty, unformatted data, strip errors, and structure clean
          records in real time. Edit the input or paste your own JSON records.
        </SectionHeading>

        <div className="mt-10 grid gap-4 sm:mt-14 lg:grid-cols-2 lg:gap-6">
          {/* Input */}
          <div className="glass flex flex-col rounded-2xl p-4 sm:p-5">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <label htmlFor="sim-input" className="text-sm font-bold text-white">
                Unstructured Messy Raw Input
              </label>
              <span className="rounded bg-slate-950 px-2 py-1 font-mono text-[11px] text-orange-400">
                Format: Raw JSON / CSV Errors
              </span>
            </div>
            <textarea
              id="sim-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
              wrap="off"
              className="h-64 w-full resize-y overflow-auto whitespace-pre rounded-xl border border-gray-800 bg-slate-950 p-3 font-mono text-base leading-relaxed text-gray-200 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 sm:h-72 sm:text-xs"
            />
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={reset} className="btn-outline w-full !py-3 sm:w-auto">
                <RotateCcw size={16} aria-hidden="true" /> Reset Sample Data
              </button>
              <button
                type="button"
                onClick={run}
                disabled={status === 'running'}
                className="btn-gradient w-full !py-3 sm:flex-1"
              >
                <Play size={16} aria-hidden="true" /> Run {brand.acronym} Pipeline Engine
              </button>
            </div>
          </div>

          {/* Output */}
          <div className="glass flex flex-col rounded-2xl p-4 sm:p-5">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-white">Cleaned &amp; Standardized AI Output</h3>
              <span role="status" aria-live="polite" className={`font-mono text-[11px] font-semibold ${statusStyle[status].className}`}>
                {statusStyle[status].label}
              </span>
            </div>
            <pre
              aria-label="Pipeline output"
              className={`h-64 w-full overflow-auto rounded-xl border border-gray-800 bg-slate-950 p-3 font-mono text-xs leading-relaxed sm:h-72 ${
                result && !result.ok ? 'text-red-300' : result?.ok ? 'text-emerald-300' : 'text-gray-500'
              }`}
            >
              {output}
            </pre>
            <dl className="mt-4 grid grid-cols-3 gap-2 text-center sm:gap-3">
              {[
                { label: 'Duplicates Stripped', value: stats ? String(stats.duplicatesStripped) : '0' },
                { label: 'Fields Fixed', value: stats ? String(stats.fieldsFixed) : '0' },
                { label: 'Engine Time', value: `${elapsedMs < 10 ? elapsedMs.toFixed(1) : Math.round(elapsedMs)} ms` },
              ].map((s) => (
                <div key={s.label} className="flex flex-col-reverse rounded-lg bg-slate-950/70 p-2.5 sm:p-3">
                  <dt className="mt-0.5 text-[10px] uppercase leading-tight text-gray-500">{s.label}</dt>
                  <dd className="font-mono text-base font-bold text-cyan-400 sm:text-lg">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-gray-500">
          This demo runs entirely in your browser — nothing you paste is uploaded or stored.
        </p>
      </Container>
    </section>
  );
}
