import { Sparkles, Workflow, Brain, Cog, type LucideIcon } from "lucide-react";

/**
 * Enterprise data-pipeline domain models.
 *
 * Every CRDPH capability is anchored to the stage of the data pipeline where
 * it creates the most value. Content lives in code (static, SSG); promote it to a
 * Prisma model if staff need to edit it in /admin.
 */
export type PipelineStage =
  "ingest" | "transform" | "model" | "automate" | "deliver";

export const stageLabels: Record<PipelineStage, string> = {
  ingest: "Ingest",
  transform: "Transform",
  model: "Model",
  automate: "Automate",
  deliver: "Deliver",
};

export type Accent = "cyan" | "blue" | "violet" | "emerald";

/** Full literal class names so Tailwind can detect them at build time. */
export const accentClasses: Record<
  Accent,
  { iconBox: string; check: string; activeBorder: string }
> = {
  cyan: {
    iconBox: "border-cyan-500/30 bg-cyan-500/10 text-cyan-400",
    check: "text-cyan-400",
    activeBorder: "border-cyan-500",
  },
  blue: {
    iconBox: "border-blue-500/30 bg-blue-500/10 text-blue-400",
    check: "text-blue-400",
    activeBorder: "border-blue-500",
  },
  violet: {
    iconBox: "border-violet-500/30 bg-violet-500/10 text-violet-400",
    check: "text-violet-400",
    activeBorder: "border-violet-500",
  },
  emerald: {
    iconBox: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
    check: "text-emerald-400",
    activeBorder: "border-emerald-500",
  },
};

export type Service = {
  slug: string;
  title: string;
  summary: string;
  capabilities: string[];
  stage: PipelineStage;
  accent: Accent;
  icon: LucideIcon;
};

export const services: Service[] = [
  {
    slug: "data-cleansing",
    title: "Automated Data Cleansing",
    summary:
      "Intelligent deduplication, error correction, OCR for paper surveys, and automatic schema normalization for messy field spreadsheets.",
    capabilities: [
      "Messy Excel/CSV Cleaners",
      "OCR Document Parsing",
      "Anomaly & Outlier Spotting",
    ],
    stage: "transform",
    accent: "cyan",
    icon: Sparkles,
  },
  {
    slug: "data-pipelines",
    title: "Resilient Data Pipelines",
    summary:
      "Fault-tolerant ETL/ELT pipelines engineered to work across unstable local connectivity and hybrid cloud architectures.",
    capabilities: [
      "Real-time & Batch Ingestion",
      "Offline-first Local Caching",
      "Cloud Sync (AWS/Azure/GCP)",
    ],
    stage: "ingest",
    accent: "blue",
    icon: Workflow,
  },
  {
    slug: "ai-predictive-analytics",
    title: "AI & Predictive Analytics",
    summary:
      "Custom machine learning models, specialized LLM agents, and intuitive executive dashboards for donor and corporate reporting.",
    capabilities: [
      "Local Language LLM Fine-tuning",
      "Predictive Risk Analytics",
      "Executive Decision Dashboards",
    ],
    stage: "model",
    accent: "violet",
    icon: Brain,
  },
  {
    slug: "hyperautomation",
    title: "Enterprise Hyperautomation",
    summary:
      "End-to-end Robotic Process Automation (RPA) to eliminate manual paper workflows, double-entry, and slow reconciliations.",
    capabilities: [
      "Financial Reconciliation Bot",
      "Paperless Approval Workflows",
      "ERP & API Integrations",
    ],
    stage: "automate",
    accent: "emerald",
    icon: Cog,
  },
];
