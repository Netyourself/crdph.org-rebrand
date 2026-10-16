/**
 * Single source of truth for brand identity. Every page title, header,
 * footer, metadata block, email subject and payment description reads from
 * here — a future rebrand should only need to edit this file (plus copy).
 *
 */
export const brand = {
  acronym: "CRDPH",
  name: "Computational Research and Data Processing Hub",
  tagline:
    "Powering Enterprise Decisions through AI, Data Pipelines, and Hyperautomation",
  description:
    "CRDPH — the Computational Research and Data Processing Hub — designs AI, data-pipeline, and hyperautomation solutions that turn raw enterprise data into trusted, decision-ready intelligence.",
  domain: "crdph.org",
  email: "info@crdph.org, lab@netyourself.net",
  phone: "+211928776163",
  phoneDisplay: "+211 92 877 6163",
  location: "Juba, South Sudan",
} as const;

/** "CRDPH — Computational Research and Data Processing Hub" */
export const brandLockup = `${brand.acronym} — ${brand.name}`;
