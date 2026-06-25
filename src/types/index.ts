export interface CompanyCardData {
  businessName: string;
  representativeName: string;
  role: string;
  slogan: string;
  whatsappMessage: string;
  phone: string;
  whatsapp: string;
  email: string;
  website: string;
  address: string;
  instagram: string;
  linkedin: string;
  facebook: string;
  theme: string;
  accentColor: string;
  badgeText: string;
  logoUrl?: string;
  services: string[];
}

export type ThemePreset = {
  id: string;
  name: string;
  bgClass: string;
  cardClass: string;
  textClass: string;
  accentColor: string;
  gradientFrom: string;
  gradientTo: string;
};

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: "cosmic-charcoal",
    name: "SST Confiable (Claro)",
    bgClass: "bg-slate-50 text-slate-900",
    cardClass: "bg-white border-2 border-emerald-600/35 shadow-2xl shadow-emerald-900/10",
    textClass: "text-slate-700",
    accentColor: "#059669",
    gradientFrom: "from-emerald-500",
    gradientTo: "to-teal-600",
  },
  {
    id: "emerald-modern",
    name: "SST Preventiva (Oscuro Pro)",
    bgClass: "bg-slate-950 text-slate-50",
    cardClass: "bg-zinc-900 border-2 border-emerald-500/50 shadow-2xl shadow-emerald-950/30",
    textClass: "text-zinc-200",
    accentColor: "#10b981",
    gradientFrom: "from-emerald-400",
    gradientTo: "to-teal-500",
  },
  {
    id: "creative-amber",
    name: "Seguridad Industrial (Ámbar)",
    bgClass: "bg-amber-50/50 text-amber-950",
    cardClass: "bg-white border-2 border-amber-600/40 shadow-xl shadow-amber-900/5",
    textClass: "text-amber-900/90",
    accentColor: "#d97706",
    gradientFrom: "from-amber-500",
    gradientTo: "to-orange-600",
  },
  {
    id: "minimalist-clean",
    name: "Consultor Técnico (Azul)",
    bgClass: "bg-slate-50 text-slate-900",
    cardClass: "bg-white border-2 border-slate-300 shadow-xl shadow-slate-200/50",
    textClass: "text-slate-700",
    accentColor: "#1d4ed8",
    gradientFrom: "from-blue-600",
    gradientTo: "to-indigo-600",
  },
  {
    id: "editorial-plum",
    name: "SST Salud Ocupacional",
    bgClass: "bg-rose-50/40 text-stone-900",
    cardClass: "bg-white border-2 border-rose-500/30 shadow-xl shadow-rose-950/5",
    textClass: "text-stone-700",
    accentColor: "#e11d48",
    gradientFrom: "from-rose-500",
    gradientTo: "to-purple-600",
  },
];

export interface AISuggestionResponse {
  slogans: string[];
  bios: string[];
  ctas: string[];
}
