import Link from 'next/link';
import { Container } from '@/components/container';
import { HeroBanner, type HeroSlide } from '@/components/hero-banner';
import { PipelineCanvas } from '@/components/pipeline-canvas';
import { heroStats } from '@/data/marketing';
import { brand } from '@/config/brand';

export function HeroSection({ slides }: { slides: HeroSlide[] }) {
  // "Powering Enterprise Decisions" + "through" + highlighted remainder
  const [lead, highlight] = brand.tagline.split(' through ');

  return (
    // Stacking (do not change): section = relative + isolate; slider = absolute z-0; content = relative z-10
    <section className="relative isolate overflow-hidden pb-14 pt-10 sm:pb-20 sm:pt-16 lg:pb-24 lg:pt-24">
      <HeroBanner slides={slides} />
      <Container className="relative z-10">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="space-y-6 sm:space-y-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 font-mono text-[11px] font-medium text-cyan-300 sm:text-xs">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75 motion-reduce:animate-none" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-500" />
              </span>
              Enterprise AI &amp; Data Processing Hub
            </span>

            <h1 className="break-words text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl xl:text-6xl">
              {lead} through <span className="text-gradient">{highlight}</span>
            </h1>

            <p className="max-w-xl text-base leading-relaxed text-gray-300 sm:text-lg">
              {brand.acronym} builds high-performance computational infrastructure for developing markets and
              emerging economies. We transform unstructured, messy data into real-time clean streams, automated
              workflows, and decision-ready AI intelligence for NGOs, Fintechs, Supply Chains, and Public
              Institutions.
            </p>

            <dl className="grid max-w-md grid-cols-3 gap-4 border-t border-gray-800 pt-6">
              {heroStats.map((stat) => (
                <div key={stat.label} className="flex flex-col-reverse">
                  <dt className="mt-1 text-[11px] leading-snug text-gray-400 sm:text-xs">{stat.label}</dt>
                  <dd className={`text-2xl font-black sm:text-3xl ${stat.color}`}>{stat.value}</dd>
                </div>
              ))}
            </dl>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/#simulator" className="btn-gradient w-full sm:w-auto">
                Test Interactive Simulator
              </Link>
              <Link href="/#audit" className="btn-outline w-full sm:w-auto">
                Request Data Audit
              </Link>
            </div>
          </div>

          <PipelineCanvas />
        </div>
      </Container>
    </section>
  );
}
