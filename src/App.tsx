/**
 * IMPULSA DIGITAL — Tarjeta de Presentación Interactiva
 * Entrena Consulting SAS
 * GitHub: https://github.com/TU_USUARIO/impulsa-digital
 */

import React, { useState } from "react";
import {
  Sliders, QrCode, Image, Upload, Globe,
  Trash, Plus,
  Linkedin, Facebook, Instagram, Crown, Download,
} from "lucide-react";
import { CompanyCardData, THEME_PRESETS } from "./types/index";
import InteractiveCard from "./components/InteractiveCard";
import QRCodeTab from "./components/QRCodeTab";
import OptimizedImageTab from "./components/OptimizedImageTab";


const DEFAULT_CARD: CompanyCardData = {
  businessName: "Entrena Consulting SAS",
  representativeName: "Camilo Medina",
  role: "Director Comercial",
  slogan: "Our mission is to deliver tailored solutions that elevate your business, regardless of its size",
  phone: "513208767554",
  whatsapp: "3208767554",
  whatsappMessage: "Hola Camilo, me gustaría agendar una asesoría comercial con Entrena Consulting SAS.",
  email: "entrenaconsulting@gmail.com",
  website: "https://entrenaconsulting.wixsite.com/entrenaconsultingsst",
  address: "Bogota, Colombia",
  instagram: "",
  linkedin: "linkedin.com/in/entrena-consulting-sas",
  facebook: "",
  theme: "cosmic-charcoal",
  accentColor: "#059669",
  badgeText: "Consultoría Premium",
  services: ["Auditorias 0312 de 2019", "Planes de Emergencia", "Investigacion de Accidentes"],
  logoUrl: "",
};

// Icono de smartphone inline para no depender de lucide
function Smartphone({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      className={className}>
      <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
      <path d="M12 18h.01" />
    </svg>
  );
}

export default function App() {
  const [cardData, setCardData] = useState<CompanyCardData>(DEFAULT_CARD);
  const [activeTab, setActiveTab] = useState<"interactive-card" | "qr-code" | "image-optimize">("image-optimize");
  const [serviceInput, setServiceInput] = useState("");

  const update = (fields: Partial<CompanyCardData>) =>
    setCardData((prev) => ({ ...prev, ...fields }));

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type === "text/html" || file.name.endsWith(".html")) {
      alert("⚠️ Sube una imagen real: PNG, JPG, SVG o WebP.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") return;
      const img = new Image();
      img.onload = () => {
        const maxDim = 600;
        let w = img.width, h = img.height;
        if (w > maxDim || h > maxDim) {
          if (w > h) { h = Math.round((h * maxDim) / w); w = maxDim; }
          else { w = Math.round((w * maxDim) / h); h = maxDim; }
        }
        const canvas = document.createElement("canvas");
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, w, h);
          update({ logoUrl: canvas.toDataURL("image/png") });
        }
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  const addService = () => {
    if (serviceInput.trim() && cardData.services.length < 4) {
      update({ services: [...cardData.services, serviceInput.trim()] });
      setServiceInput("");
    }
  };

  const removeService = (i: number) =>
    update({ services: cardData.services.filter((_, idx) => idx !== i) });

  // ── VISTA EDITOR ─────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-zinc-950 text-slate-800 dark:text-zinc-100 font-sans">

      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-slate-200/60 dark:border-zinc-800/80 px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
            <Crown className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-extrabold tracking-tight">IMPULSA DIGITAL</div>
            <div className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest hidden sm:block">
              Entrena Consulting SAS
            </div>
          </div>
        </div>
        <button
          onClick={() => setActiveTab("image-optimize")}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer transition-all shadow-md"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Exportar PNG para WhatsApp</span>
          <span className="sm:hidden">Exportar PNG</span>
        </button>
      </header>

      {/* DASHBOARD */}
      <main className="max-w-7xl mx-auto p-4 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

        {/* ── PANEL IZQUIERDO: EDITOR ── */}
        <div className="lg:col-span-6 space-y-5">

          {/* 1. Identidad */}
          <section className="bg-white dark:bg-zinc-900 border border-slate-200/50 dark:border-zinc-800/80 rounded-3xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-rose-500" />
              1. Identidad de la Empresa
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {([
                ["Nombre de la Empresa", "businessName", "text", "Ej: Entrena Consulting"],
                ["Representante", "representativeName", "text", "Ej: Camilo Medina"],
                ["Cargo", "role", "text", "Ej: Director Comercial"],
                ["Eslogan", "slogan", "text", "Propuesta de valor"],
                ["Badge de la Tarjeta", "badgeText", "text", "Ej: Consultoría Premium"],
              ] as [string, keyof CompanyCardData, string, string][]).map(([label, key, type, ph]) => (
                <div key={key} className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-500">{label}</label>
                  <input
                    type={type}
                    placeholder={ph}
                    value={cardData[key] as string}
                    onChange={(e) => update({ [key]: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 focus:outline-none focus:border-rose-500 text-slate-800 dark:text-slate-100"
                  />
                </div>
              ))}

              {/* Logo upload */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-500">Logotipo (PNG/JPG)</label>
                <div className="flex gap-2 items-center">
                  <label className="cursor-pointer flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-dashed border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-950 text-[11px] text-zinc-500 hover:bg-slate-100 transition-colors flex-1">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Elegir Logotipo</span>
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  </label>
                  {cardData.logoUrl && (
                    <button
                      onClick={() => update({ logoUrl: "" })}
                      className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 text-rose-500 cursor-pointer"
                      title="Quitar logotipo"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* 2. Contacto */}
          <section className="bg-white dark:bg-zinc-900 border border-slate-200/50 dark:border-zinc-800/80 rounded-3xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-500" />
              2. Datos de Contacto
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {([
                ["Teléfono / Llamadas", "phone", "tel", "+57 320 876 7554"],
                ["WhatsApp (solo números)", "whatsapp", "text", "573208767554"],
                ["Correo Electrónico", "email", "email", "ejemplo@empresa.com"],
                ["Sitio Web", "website", "text", "www.tuempresa.com"],
                ["Ciudad / Dirección", "address", "text", "Bogotá, Colombia"],
              ] as [string, keyof CompanyCardData, string, string][]).map(([label, key, type, ph]) => (
                <div key={key} className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-500">{label}</label>
                  <input
                    type={type}
                    placeholder={ph}
                    value={cardData[key] as string}
                    onChange={(e) => update({ [key]: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 focus:outline-none focus:border-rose-500 text-slate-800 dark:text-slate-100"
                  />
                </div>
              ))}
              <div className="space-y-1 sm:col-span-2">
                <label className="text-[11px] font-semibold text-slate-500">Mensaje automático de WhatsApp</label>
                <textarea
                  value={cardData.whatsappMessage}
                  onChange={(e) => update({ whatsappMessage: e.target.value })}
                  className="w-full text-xs p-2.5 h-16 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 focus:outline-none focus:border-rose-500 text-slate-800 dark:text-slate-100 resize-none"
                />
              </div>
            </div>
          </section>

          {/* 3. Redes Sociales */}
          <section className="bg-white dark:bg-zinc-900 border border-slate-200/50 dark:border-zinc-800/80 rounded-3xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Globe className="w-4 h-4 text-sky-500" />
              3. Redes Sociales
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {([
                ["Instagram", "instagram", Instagram, "@usuario"],
                ["LinkedIn", "linkedin", Linkedin, "usuario-linkedin"],
                ["Facebook", "facebook", Facebook, "pagina"],
              ] as [string, keyof CompanyCardData, React.ElementType, string][]).map(([label, key, Icon, ph]) => (
                <div key={key} className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                    <Icon className="w-3 h-3" />{label}
                  </label>
                  <input
                    type="text"
                    placeholder={ph}
                    value={cardData[key] as string}
                    onChange={(e) => update({ [key]: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 focus:outline-none focus:border-rose-500 text-slate-800 dark:text-slate-100"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* 4. Servicios */}
          <section className="bg-white dark:bg-zinc-900 border border-slate-200/50 dark:border-zinc-800/80 rounded-3xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Crown className="w-4 h-4 text-purple-500" />
              4. Servicios Clave (máx. 4)
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ej: Auditorías ISO 45001"
                value={serviceInput}
                onChange={(e) => setServiceInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") addService(); }}
                className="flex-1 text-xs p-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 focus:outline-none focus:border-rose-500 text-slate-800 dark:text-slate-100"
              />
              <button
                onClick={addService}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-zinc-950 text-white rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />Agregar
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {cardData.services.map((s, i) => (
                <span key={i} className="px-3 py-1.5 rounded-xl border border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 text-xs text-slate-700 dark:text-zinc-300 flex items-center gap-1.5">
                  {s}
                  <button onClick={() => removeService(i)} className="text-rose-500 hover:text-rose-600 cursor-pointer">×</button>
                </span>
              ))}
              {cardData.services.length === 0 && (
                <span className="text-[11px] text-zinc-500 italic">Sin servicios añadidos.</span>
              )}
            </div>
          </section>

          {/* 5. Tema */}
          <section className="bg-white dark:bg-zinc-900 border border-slate-200/50 dark:border-zinc-800/80 rounded-3xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-500" />
              5. Plantilla de Diseño
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {THEME_PRESETS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => update({ theme: t.id, accentColor: t.accentColor })}
                  className={`p-3 rounded-xl border text-xs text-left cursor-pointer transition-all flex flex-col justify-between h-20 ${
                    cardData.theme === t.id
                      ? "border-slate-900 dark:border-white bg-slate-50 dark:bg-zinc-900 shadow-sm"
                      : "border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-900/40 bg-transparent text-slate-700 dark:text-zinc-300"
                  }`}
                >
                  <span className="font-bold leading-tight">{t.name}</span>
                  <div className="flex gap-1.5 items-center mt-2">
                    <span className="w-3 h-3 rounded-full border border-zinc-400" style={{ backgroundColor: t.accentColor }} />
                    <span className="text-[10px] text-zinc-400">
                      {t.id === "emerald-modern" ? "Oscuro" : "Claro"}
                    </span>
                  </div>
                </button>
              ))}
            </div>
            <div className="border-t border-slate-100 dark:border-zinc-800 pt-3 flex items-center justify-between gap-3">
              <span className="text-xs text-slate-500">Color de acento personalizado</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={cardData.accentColor}
                  onChange={(e) => update({ accentColor: e.target.value })}
                  className="w-8 h-8 rounded-md border border-slate-300 cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  value={cardData.accentColor}
                  onChange={(e) => update({ accentColor: e.target.value })}
                  className="text-xs p-1.5 w-24 rounded border border-slate-200 dark:border-zinc-700 bg-transparent text-slate-700 dark:text-zinc-300"
                />
              </div>
            </div>
          </section>
        </div>

        {/* ── PANEL DERECHO: VISTA PREVIA ── */}
        <div className="lg:col-span-6 space-y-5">

          {/* Tabs */}
          <div className="bg-slate-100 dark:bg-zinc-900 p-1.5 rounded-2xl flex gap-1 border border-slate-200/50">
            {([
              ["interactive-card", Smartphone, "Tarjeta", "Digital"],
              ["qr-code", QrCode, "QR Dinámico", "QR"],
              ["image-optimize", Image, "Exportar Imagen", "WhatsApp"],
            ] as [typeof activeTab, React.ElementType, string, string][]).map(([tab, Icon, label, short]) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                  activeTab === tab
                    ? "bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 shadow-sm"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-zinc-300"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
                <span className="sm:hidden">{short}</span>
              </button>
            ))}
          </div>

          <div className="min-h-[450px]">
            {activeTab === "interactive-card" && (
              <div className="space-y-3">
                <p className="text-[11px] text-slate-500 dark:text-slate-400 px-1">
                  Micrositio móvil. Los botones abren WhatsApp, llamadas y correo reales.
                </p>
                <InteractiveCard data={cardData} />
              </div>
            )}
            {activeTab === "qr-code" && <QRCodeTab cardData={cardData} />}
            {activeTab === "image-optimize" && <OptimizedImageTab cardData={cardData} />}
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-200/50 dark:border-zinc-800/80 py-8 mt-10 text-center text-xs text-slate-400 font-mono">
        <p>IMPULSA DIGITAL © {new Date().getFullYear()} · Entrena Consulting SAS · Bogotá, Colombia</p>
        <p className="mt-1 text-[11px] text-zinc-500">
          <a
            href="https://github.com/TU_USUARIO/impulsa-digital"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-slate-600 transition-colors"
          >
            github.com/TU_USUARIO/impulsa-digital
          </a>
          {" · "}
          <a href="https://entrenaconsulting.wixsite.com/entrenaconsultingsst" target="_blank" rel="noopener noreferrer"
            className="underline hover:text-slate-600 transition-colors">
            entrenaconsulting.wixsite.com
          </a>
        </p>
      </footer>
    </div>
  );
}
