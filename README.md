# CRDPH — Computational Research and Data Processing Hub

> **Powering Enterprise Decisions through AI, Data Pipelines, and Hyperautomation**

Website and lightweight CMS for **CRDPH**, a data/AI startup. A dark, single-page
marketing site (Next.js 14 App Router) with an interactive data-cleaning
simulator, a target-markets explorer and a "Request a Data Pipeline Audit" form,
plus a small admin CMS and a `/pay` page.

## What's on the site

| Section / route | What it is                                                                                                                    |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `/` **Hero**    | Headline, stats, animated pipeline canvas, optional rotating background images managed in `/admin/banners`                    |
| `/#services`    | Four pillars: Data Cleansing, Data Pipelines, AI & Predictive Analytics, Hyperautomation                                      |
| `/#simulator`   | **Working** data-cleaning demo (see below)                                                                                    |
| `/#markets`     | **Target markets** (NGOs & UN bodies, Banking & Fintech, Logistics & Telecom, Public Sector) — replaces the old Partners page |
| `/#techstack`   | Architecture & integration stack                                                                                              |
| `/#audit`       | Audit-request form → saved in the database + emailed (Resend)                                                                 |
| `/pay`          | Invoice / engagement-deposit payments via Stripe and PayPal (`noindex`)                                                       |
| `/admin`        | CMS: dashboard, hero banners, audit requests, users & roles, account                                                          |

## Stack

Next.js 14 · TypeScript · Tailwind CSS · Prisma + Postgres (local Docker in dev, Supabase
in production) · NextAuth v5 · Cloudinary (hero banner uploads) · Stripe + PayPal ·
Resend · Zod + react-hook-form · lucide-react.

## The pipeline simulator

`src/lib/pipeline-simulator.ts` is a real, deterministic, **client-side** engine (nothing
pasted is uploaded). It tolerates "almost JSON" (comments, trailing commas), merges rows
with the same `id`, then normalizes each record: organization names (separators, camelCase,
ALL-CAPS, small alias table such as `SS → South Sudan`), amounts (`"$12,500.00"`,
`"45000USD"` → numbers; unreadable → `0` and flagged), statuses (`_ERR` suffix stripped;
unknown → `NEEDS_REVIEW`) and `+211` phone numbers (malformed numbers are flagged, never
silently "fixed"). Each record gets a `quality_score` (share of the four fields that
validated without imputation) and a `flags` list. Limits: 100k characters / 2,000 rows.

```bash
npm test      # 10 unit tests (node:test via tsx) in tests/
```

## Mobile responsiveness

Mobile-first Tailwind throughout: single-column stacking below `sm`, 2/4-column grids above;
a dropdown mobile menu (44px+ targets, Escape to close); `text-base` inputs on phones to
prevent iOS focus-zoom; horizontally scrollable code/JSON panes; a canvas that is HiDPI-aware,
resizes with its container, scales particle count to area, pauses off-screen and renders a still
frame under `prefers-reduced-motion`; decorative glow orbs hidden on small screens. The CMS
sidebar collapses into a scrollable top bar, and wide tables scroll horizontally.

## Brand configuration

`src/config/brand.ts` is the single source of truth (name, acronym, tagline, contact details).
The acronym stays **`CRDPH`** (casing preserved): the `crdph/*` Cloudinary folders, the
`crdph` Postgres user/db in `docker-compose.yml`, the package name and `@crdph.org`
addresses are intentionally unchanged.

## Local development

```bash
npm install
cp .env.example .env
npm run db:up                # local Postgres via docker-compose
npx prisma migrate dev
npm run seed                 # first admin + placeholder hero banners
npm run dev                  # http://localhost:3000 · CMS at /admin
```

## Database: local vs. production

`DATABASE_URL` (runtime) and `DIRECT_URL` (migrations). Locally both point at `localhost:5432`.
On Supabase: `DATABASE_URL` = pooled "Transaction" string (port 6543, `?pgbouncer=true`),
`DIRECT_URL` = direct/"Session" string (port 5432); URL-encode special characters in the
password. Free projects pause after a week of inactivity ("Can't reach database server").

## CMS, users and roles

`ADMIN` and `EDITOR` can manage banners and audit requests and change their own password
(`/admin/account`). Only `ADMIN` can create users, change roles and delete users
(`/admin/users`), with guardrails (no self-deletion/demotion, never remove the last admin).
Create users **in the app** — it bcrypt-hashes passwords; rows typed into the Supabase table
editor store plaintext and can never log in. Auth hardening: `trustHost: true`, a server-side
redirect in `admin/layout.tsx`, and `requireSession()` / `requireAdminRole()` inside every
mutating server action. Set `AUTH_SECRET` and `AUTH_URL` in production.

## Hero slider (do not alter the stacking)

`HeroSection` → section `relative isolate`, `HeroBanner` `absolute inset-0 z-0
pointer-events-none` (positive z-index; negative would paint behind the section), content
`relative z-10`, plus a constant dark scrim so text stays readable over any image. With no
active banners the hero shows the plain tech background.

## Cloudinary

Used for hero-banner uploads. Set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_SECRET`, and the
public pair `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` / `NEXT_PUBLIC_CLOUDINARY_API_KEY` (the API
_key_ is public by design; the _secret_ never leaves the server). Uploads are signed by
`/api/cloudinary/sign` (login required).

## Payments

Stripe Checkout (`/api/checkout`) and PayPal Buttons, with an optional invoice reference
(Stripe metadata / PayPal `custom_id`). Both show a clear "not configured" state until keys are
set. Add a Stripe webhook (`checkout.session.completed`) before taking live payments.

## Project structure

```
src/app/(site)/        public site: layout (dark theme), page.tsx (sections), pay/
src/app/admin/         CMS (own layout; no public header/footer)
src/app/api/           auth, checkout, cloudinary/sign, contact (audit requests)
src/components/        header, footer, mobile-nav, pipeline-canvas, hero-banner, sections/*
src/data/              services (pipeline-stage models), markets, tech-stack, marketing, audit-options
src/lib/               pipeline-simulator, validations, db, cloudinary, require-admin
src/config/brand.ts    brand identity
prisma/                schema.prisma, seed.ts
tests/                 simulator unit tests
migration-scripts/     01–04 legacy PHP/MySQL migration · 05 rebrand cleanup
docs/legacy-brand/     archived previous-brand logos
```
