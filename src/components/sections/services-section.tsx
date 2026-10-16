import { Check } from 'lucide-react';
import { Container } from '@/components/container';
import { SectionHeading } from './section-heading';
import { accentClasses, services, stageLabels } from '@/data/services';

export function ServicesSection() {
  return (
    <section id="services" className="section scroll-mt-20">
      <Container>
        <SectionHeading eyebrow="Core Pillars" title="Enterprise Data & Automation Capabilities">
          Built specifically for high-impact environments, poor connectivity zones, and complex operational
          datasets in emerging markets.
        </SectionHeading>

        <div className="mt-10 grid gap-5 sm:mt-14 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => {
            const Icon = service.icon;
            const accent = accentClasses[service.accent];
            return (
              <article key={service.slug} className="glass glass-hover flex flex-col rounded-2xl p-6">
                <div className="flex items-start justify-between gap-3">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl border ${accent.iconBox}`}>
                    <Icon size={22} aria-hidden="true" />
                  </div>
                  <span className="rounded-full border border-gray-700 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide text-gray-400">
                    {stageLabels[service.stage]}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-bold text-white">{service.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-400">{service.summary}</p>
                <ul className="mt-5 space-y-2 border-t border-gray-800 pt-4 text-sm text-gray-300">
                  {service.capabilities.map((c) => (
                    <li key={c} className="flex items-start gap-2">
                      <Check size={16} className={`mt-0.5 shrink-0 ${accent.check}`} aria-hidden="true" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
