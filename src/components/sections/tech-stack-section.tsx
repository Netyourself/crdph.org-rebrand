import { Container } from '@/components/container';
import { SectionHeading } from './section-heading';
import { techStack } from '@/data/tech-stack';

export function TechStackSection() {
  return (
    <section id="techstack" className="section scroll-mt-20">
      <Container>
        <SectionHeading eyebrow="Ecosystem" title="Enterprise Architecture & Integration Stack" />
        <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:mt-14 lg:grid-cols-6">
          {techStack.map((tech) => {
            const Icon = tech.icon;
            return (
              <li key={tech.name} className="glass glass-hover rounded-xl p-5 text-center">
                <Icon size={30} className={`mx-auto ${tech.color}`} aria-hidden="true" />
                <p className="mt-3 text-sm font-bold text-white">{tech.name}</p>
                <p className="mt-1 font-mono text-[11px] text-gray-400">{tech.role}</p>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
