import { Container } from '@/components/container';
import { AuditRequestForm } from './audit-request-form';

export function AuditSection() {
  return (
    <section id="audit" className="section scroll-mt-20">
      <Container className="max-w-3xl">
        <div className="glass rounded-3xl p-5 shadow-2xl sm:p-10">
          <div className="mb-8 text-center">
            <p className="font-mono text-xs font-semibold uppercase tracking-widest text-cyan-400 sm:text-sm">Get Started</p>
            <h2 className="mt-3 text-2xl font-extrabold text-white sm:text-3xl">Request a Data Pipeline Audit</h2>
            <p className="mt-3 text-sm text-gray-400 sm:text-base">
              Speak with our computational engineers to clean your datasets or automate enterprise workflows.
            </p>
          </div>
          <AuditRequestForm />
        </div>
      </Container>
    </section>
  );
}
