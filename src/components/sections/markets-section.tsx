'use client';

import { useRef, useState } from 'react';
import { Check } from 'lucide-react';
import { Container } from '@/components/container';
import { SectionHeading } from './section-heading';
import { markets } from '@/data/markets';
import { accentClasses } from '@/data/services';
import { marketImpact } from '@/data/marketing';

export function MarketsSection() {
  const [activeKey, setActiveKey] = useState(markets[0].key);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const activeIndex = markets.findIndex((m) => m.key === activeKey);
  const active = markets[activeIndex];

  // WAI-ARIA tabs: arrow keys / Home / End move between tabs.
  function onKeyDown(e: React.KeyboardEvent, index: number) {
    const last = markets.length - 1;
    const target =
      e.key === 'ArrowRight' || e.key === 'ArrowDown' ? (index + 1) % markets.length
      : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? (index - 1 + markets.length) % markets.length
      : e.key === 'Home' ? 0
      : e.key === 'End' ? last
      : null;
    if (target === null) return;
    e.preventDefault();
    setActiveKey(markets[target].key);
    tabRefs.current[target]?.focus();
  }

  return (
    <section id="markets" className="section scroll-mt-20">
      <Container>
        <SectionHeading eyebrow="Regional Focus" title="Solutions Tailored for Emerging Markets">
          Solving real operational constraints for key economic sectors across South Sudan and East Africa.
        </SectionHeading>

        <div role="tablist" aria-label="Target markets" className="mt-10 grid gap-3 sm:mt-14 sm:grid-cols-2 lg:grid-cols-4">
          {markets.map((market, i) => {
            const Icon = market.icon;
            const accent = accentClasses[market.accent];
            const selected = market.key === activeKey;
            return (
              <button
                key={market.key}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                role="tab"
                id={`market-tab-${market.key}`}
                aria-selected={selected}
                aria-controls={`market-panel-${market.key}`}
                tabIndex={selected ? 0 : -1}
                type="button"
                onClick={() => setActiveKey(market.key)}
                onKeyDown={(e) => onKeyDown(e, i)}
                className={`glass flex min-h-[64px] items-center gap-3 rounded-xl border p-4 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400 ${
                  selected ? accent.activeBorder : 'border-gray-800 hover:border-cyan-500/50'
                }`}
              >
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${accent.iconBox}`}>
                  <Icon size={18} aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-bold text-white">{market.tabLabel}</span>
                  <span className="block truncate font-mono text-[11px] text-gray-400">{market.tabSub}</span>
                </span>
              </button>
            );
          })}
        </div>

        <div
          role="tabpanel"
          id={`market-panel-${active.key}`}
          aria-labelledby={`market-tab-${active.key}`}
          className="glass mt-5 rounded-2xl p-5 sm:p-8"
        >
          <div className="grid items-center gap-6 md:grid-cols-3">
            <div className="space-y-3 md:col-span-2">
              <h3 className="text-lg font-bold text-white sm:text-xl">{active.title}</h3>
              <p className="text-sm leading-relaxed text-gray-300">{active.description}</p>
              <ul className="flex flex-wrap gap-2 pt-2">
                {active.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 font-mono text-xs text-cyan-300"
                  >
                    <Check size={12} aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-2 rounded-xl border border-gray-800 bg-slate-950 p-5 text-center font-mono">
              <p className="text-xs uppercase text-gray-400">Sector Efficiency Impact</p>
              <p className="text-3xl font-black text-cyan-400">{marketImpact.value}</p>
              <p className="text-[11px] text-gray-400">{marketImpact.label}</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
