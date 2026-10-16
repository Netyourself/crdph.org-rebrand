'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check } from 'lucide-react';
import { auditRequestSchema, type AuditRequestValues } from '@/lib/validations';
import { interests, organizationTypes } from '@/data/audit-options';
import { brand } from '@/config/brand';

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-gray-300">{label}</span>
      {children}
      {error && <span className="mt-1 block text-sm text-red-400">{error}</span>}
    </label>
  );
}

export function AuditRequestForm() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AuditRequestValues>({
    resolver: zodResolver(auditRequestSchema),
    defaultValues: { organizationType: organizationTypes[0], interest: interests[0] },
  });

  async function onSubmit(values: AuditRequestValues) {
    setServerError(false);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error('request failed');
      setSubmitted(true);
      reset();
    } catch {
      setServerError(true);
    }
  }

  if (submitted) {
    return (
      <div role="status" className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center">
        <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
          <Check size={20} aria-hidden="true" />
        </span>
        <p className="mt-3 font-semibold text-emerald-300">
          Audit request received! A {brand.acronym} Data Systems Engineer will reach out within 24 hours.
        </p>
        <button type="button" onClick={() => setSubmitted(false)} className="mt-4 text-sm text-gray-400 underline hover:text-white">
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your Full Name" error={errors.name?.message}>
          <input {...register('name')} autoComplete="name" className="input" />
        </Field>
        <Field label="Organization / Enterprise Email" error={errors.email?.message}>
          <input {...register('email')} type="email" autoComplete="email" inputMode="email" className="input" />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Organization Category" error={errors.organizationType?.message}>
          <select {...register('organizationType')} className="input">
            {organizationTypes.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </Field>
        <Field label="Primary Interest" error={errors.interest?.message}>
          <select {...register('interest')} className="input">
            {interests.map((i) => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Project Details / Data Bottlenecks (optional)" error={errors.message?.message}>
        <textarea {...register('message')} rows={4} className="input" />
      </Field>

      {/* Honeypot: hidden from people, bots tend to fill every field. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input id="company" tabIndex={-1} autoComplete="off" {...register('company')} />
      </div>

      {serverError && (
        <p role="alert" className="text-sm text-red-400">
          Something went wrong sending your request. Please email us at{' '}
          <a href={`mailto:${brand.email}`} className="underline">{brand.email}</a>.
        </p>
      )}

      <button type="submit" disabled={isSubmitting} className="btn-gradient w-full">
        {isSubmitting ? 'Submitting…' : 'Submit Audit Request'}
      </button>
    </form>
  );
}
