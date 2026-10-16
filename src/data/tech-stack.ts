import { Terminal, Zap, Cloud, Bot, Database, Container, type LucideIcon } from 'lucide-react';

export type TechItem = { name: string; role: string; icon: LucideIcon; color: string };

export const techStack: TechItem[] = [
  { name: 'Python / Pandas', role: 'Data Processing', icon: Terminal, color: 'text-yellow-400' },
  { name: 'Apache Spark', role: 'Distributed ETL', icon: Zap, color: 'text-orange-400' },
  { name: 'AWS / Azure', role: 'Cloud Data Lakes', icon: Cloud, color: 'text-amber-500' },
  { name: 'LangChain / PyTorch', role: 'LLM & ML Models', icon: Bot, color: 'text-violet-400' },
  { name: 'PostgreSQL / Redis', role: 'High Speed DB', icon: Database, color: 'text-blue-400' },
  { name: 'Docker / K8s', role: 'Containerization', icon: Container, color: 'text-sky-400' },
];
