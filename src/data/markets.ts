import {
  Globe,
  Landmark,
  Truck,
  Building2,
  type LucideIcon,
} from "lucide-react";
import type { Accent } from "./services";

/**
 * Target markets
 */
export type Market = {
  key: string;
  tabLabel: string;
  tabSub: string;
  title: string;
  description: string;
  features: string[];
  accent: Accent;
  icon: LucideIcon;
};

export const markets: Market[] = [
  {
    key: "ngo",
    tabLabel: "NGOs & UN Bodies",
    tabSub: "Monitoring & Evaluation",
    title: "Humanitarian & NGO Field Monitoring",
    description:
      "International agencies and UN partners collect vast volumes of field surveys across remote regions. CRDPH cleans unstandardized enumerator spreadsheets, standardizes beneficiary records, and automates donor reporting dashboards.",
    features: [
      "Offline Survey Data Deduplication",
      "Multi-county Aggregation Pipelines",
      "Automated Grant & Donor Dashboards",
    ],
    accent: "cyan",
    icon: Globe,
  },
  {
    key: "fintech",
    tabLabel: "Banking & Fintech",
    tabSub: "Reconciliation & OCR",
    title: "Banking, Microfinance & Enterprise Fintech",
    description:
      "Financial institutions require real-time transaction reconciliation and OCR document processing. CRDPH builds fault-tolerant pipelines to verify customer identity docs, automate reconciliation between legacy core systems, and detect anomaly transactions.",
    features: [
      "OCR Automated ID & Form Extraction",
      "Inter-bank System Reconciliation Bots",
      "Fraud Detection & Risk Stream AI",
    ],
    accent: "blue",
    icon: Landmark,
  },
  {
    key: "telecom",
    tabLabel: "Logistics & Telecom",
    tabSub: "Stream Processing",
    title: "Logistics, Supply Chain & Telecommunications",
    description:
      "High-frequency operational data requires fast processing. We build streaming pipelines that monitor fleet location, store inventory balances, and automate re-ordering alerts without manual human intervention.",
    features: [
      "Real-time Stream Ingestion",
      "Supply Chain Inventory Hyperautomation",
      "API Gateway Integration",
    ],
    accent: "violet",
    icon: Truck,
  },
  {
    key: "public",
    tabLabel: "Public Sector",
    tabSub: "Paperless E-Gov",
    title: "Public Sector & E-Governance",
    description:
      "Transition public ministries from paper-heavy manual systems to secure, interoperable digital databases. Our algorithms clean legacy archives and digitize public records with strict data governance.",
    features: [
      "Paperless Ministerial Workflows",
      "Secure Inter-departmental Data Hubs",
      "Public Health & Census Analytics",
    ],
    accent: "emerald",
    icon: Building2,
  },
];
