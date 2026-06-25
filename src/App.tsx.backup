/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Sliders, QrCode, Image, Sparkles, Share2, 
  Link, CheckCircle2, RefreshCw, Upload, Globe, 
  Trash, Plus, Mail, Phone, MessageSquare, MapPin, 
  Instagram, Linkedin, Facebook, ArrowLeft, ExternalLink,
  Crown, Check
} from "lucide-react";
import { CompanyCardData, AISuggestionResponse, THEME_PRESETS, ThemePreset } from "./types/index";
import InteractiveCard from "./components/InteractiveCard";
import QRCodeTab from "./components/QRCodeTab";
import OptimizedImageTab from "./components/OptimizedImageTab";
import { motion } from "motion/react";
import { serializeCard, deserializeCard } from "./utils/index";

export default function App() {
  const [cardData, setCardData] = useState<CompanyCardData>({
    businessName: "Entrena Consulting SAS",
    representativeName: "Camilo Medina",
    role: "Director Comercial",
    slogan: "Our is to deliver tailored solutions that elevate your business, regardless of its size",
    phone: "513208767554",
    whatsapp: "3208767554",
    whatsappMessage: "Hola Camilo, me gustaría agendar una asesoría comercial con Entrena Consulting SAS.",
    email: "entrenaconsulting@gmail.com",
    website: "https://entrenaconsulting.wixsite.com/entrenaconsultingsst",
    address: "Bogota, Colombia",
    linkedin: "linkedin.com/in/entrena-consulting-sas",
    theme: "cosmic-charcoal",
    accentColor: "#059669",
    badgeText: "Consultoría Premium",
    services: ["Auditorias 0312 de 2019", "Planes de Emergencia", "Investigacion de Accidentes"],
    logoUrl: ""
  });

  const [activeTab, setActiveTab] = useState<"interactive-card" | "qr-code" | "image-optimize">("interactive-card");
  const [isSharedMode, setIsSharedMode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Estados del Asistente IA con Gemini
  const [companyType, setCompanyType] = useState("Consultoría Estratégica");
  const [aiTone, setAiTone] = useState("profesional");
  const [aiKeywords, setAiKeywords] = useState("Para el 2030 Entrena Consulting SAS se posicionará en los primeros lugares del mercado nacional consolidándose como una empresa líder en asesoría y consultoría en SGSST");
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestionResponse | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  const [serviceInput, setServiceInput] = useState("");

  // Detectar si venimos por un enlace compartido en query params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cardParam = params.get("card");
    if (cardParam) {
      const decoded = deserializeCard(cardParam);
      if (decoded) {
        setCardData(decoded);
        setIsSharedMode(true);
      }
    }
  }, []);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check if it's an HTML file
      if (file.type === "text/html" || file.name.endsWith(".html") || file.name.endsWith(".htm")) {
        alert("⚠️ No puedes subir un archivo .html como logotipo. Por favor, sube una imagen real del logotipo (PNG, JPG, SVG o WebP).");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          const img = new Image();
          img.onload = () => {
            // Auto resize and compress to max 120x120 pixels to keep base64 extremely compact
            // This ensures it is always saved below 50,000 characters and encoded cleanly in the QR text
            const maxDim = 120;
            let w = img.width;
            let h = img.height;
            if (w > maxDim || h > maxDim) {
              if (w > h) {
                h = Math.round((h * maxDim) / w);
                w = maxDim;
              } else {
                w = Math.round((w * maxDim) / h);
                h = maxDim;
              }
            }
            const canvas = document.createElement("canvas");
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext("2d");
            if (ctx) {
              ctx.drawImage(img, 0, 0, w, h);
              const compressedUrl = canvas.toDataURL("image/png");
              setCardData(prev => ({ ...prev, logoUrl: compressedUrl }));
            } else {
              setCardData(prev => ({ ...prev, logoUrl: reader.result as string }));
            }
          };
          img.src = reader.result;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const addService = () => {
    if (serviceInput.trim().length > 0 && cardData.services.length < 4) {
      setCardData(prev => ({
        ...prev,
        services: [...prev.services, serviceInput.trim()]
      }));
      setServiceInput("");
    }
  };

  const removeService = (index: number) => {
    setCardData(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
    }));
  };

  const handleCopyShareLink = () => {
    const hash = serializeCard(cardData);
    const directUrl = `${window.location.origin}${window.location.pathname}?card=${hash}`;
    navigator.clipboard.writeText(directUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Llamada a nuestro Endpoint server-side de Gemini
  const generateSuggestionsWithGemini = async () => {
    setAiLoading(true);
    setAiError("");
    try {
      const response = await fetch("/api/generate-slogan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: cardData.businessName,
          businessType: companyType,
          keywords: aiKeywords,
          tone: aiTone
        })
      });

      if (!response.ok) {
        throw new Error("No se pudo conectar correctamente con el servicio de IA.");
      }

      const data = await response.json();
      setAiSuggestions(data);
    } catch (e: any) {
      setAiError(e.message || "Ocurrió un error consultando a la IA.");
    } finally {
      setAiLoading(false);
    }
  };

  // Si estamos en el modo de vista de tarjeta compartida (módem microsite)
  if (isSharedMode) {
    const activeThemePreset = THEME_PRESETS.find(t => t.id === cardData.theme) || THEME_PRESETS[0];
    return (
      <div className={`min-h-screen py-10 px-4 flex flex-col items-center justify-center ${activeThemePreset.bgClass} transition-colors duration-500`}>
        {/* Ambient decorative blobs */}
        <div className="absolute top-[10%] left-[10%] w-72 h-72 rounded-full filter blur-[120px] opacity-20 pointer-events-none" style={{ backgroundColor: cardData.accentColor }}></div>

        <div className="w-full max-w-sm relative z-10 space-y-6">
          {/* Header simple card info */}
          <div className="text-center space-y-2 mb-2">
            <h1 className="text-sm font-semibold tracking-widest text-zinc-500 uppercase flex items-center justify-center gap-1.5">
              <Crown className="w-4 h-4 text-amber-500" />
              Tarjeta Comercial Interactiva
            </h1>
          </div>

          <InteractiveCard data={cardData} />

          {/* Action to create yours */}
          <div className="text-center pt-2">
            <button
              onClick={() => {
                // Clear state or remove cardParam to open designer
                window.history.pushState({}, document.title, window.location.pathname);
                setIsSharedMode(false);
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 hover:border-white/20 font-bold text-xs text-white cursor-pointer transition-all shadow-md"
            >
              <ArrowLeft className="w-4 h-4 text-rose-500" />
              <span>Diseñar mi propia Tarjeta Digital</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // EN VISTA DEL PANEL DE DISEÑADOR COMPLETO
  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-zinc-950 text-slate-800 dark:text-zinc-100 font-sans transition-colors duration-300">
      
      {/* HEADER SOPHISTICATED */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-slate-200/60 dark:border-zinc-800/80 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-rose-500/20">
            <Crown className="w-5.5 h-5.5" />
          </div>
          <div>
            <h1 className="text-base font-extrabold tracking-tight">IMPULSA DIGITAL</h1>
            <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono tracking-widest uppercase">
              Creador de Tarjetas de Presentación
            </span>
          </div>
        </div>

        {/* Action Header bar: Share direct copyable link */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyShareLink}
            className="px-4 py-2.5 rounded-xl border border-rose-500 bg-rose-500/5 hover:bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold text-xs flex items-center gap-2 cursor-pointer transition-all shadow-sm"
          >
            {copiedLink ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>¡Copiar Enlace para Compartir!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span>Generar Enlace compatible WhatsApp</span>
              </>
            )}
          </button>
          
          <button 
            onClick={() => {
              // Simular vista como un visitante copiando link con hash
              const hash = serializeCard(cardData);
              window.open(`${window.location.origin}${window.location.pathname}?card=${hash}`, "_blank");
            }}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-800/80 text-zinc-500 dark:text-zinc-400 cursor-pointer transition-all"
            title="Ver vista micrositio móvil externa"
          >
            <ExternalLink className="w-4.5 h-4.5" />
          </button>
        </div>
      </header>

      {/* DASHBOARD CORE */}
      <main className="max-w-7xl mx-auto p-4 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* PANEL IZQUIERDO DE EDICIÓN (6 Col) */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* SECCIÓN 1: DATOS DE EMPRESA Y BIOGRAFÍA */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-200/50 dark:border-zinc-800/80 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-rose-500" />
              1. Identidad de la Empresa y Cargo
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-500">Nombre de la Empresa</label>
                <input
                  type="text"
                  placeholder="Ej: Entrena Consulting"
                  value={cardData.businessName}
                  onChange={(e) => setCardData(prev => ({ ...prev, businessName: e.target.value }))}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 focus:outline-none focus:border-rose-500 focus:bg-white text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-500">Representante / Emprendedor</label>
                <input
                  type="text"
                  placeholder="Ej: Sonia Entrena"
                  value={cardData.representativeName}
                  onChange={(e) => setCardData(prev => ({ ...prev, representativeName: e.target.value }))}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 focus:outline-none focus:border-rose-500 focus:bg-white text-slate-800 dark:text-slate-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-500">Cargo / Posición</label>
                <input
                  type="text"
                  placeholder="Ej: Directora de Ventas"
                  value={cardData.role}
                  onChange={(e) => setCardData(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 focus:outline-none focus:border-rose-500 focus:bg-white text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-500">Eslogan de la Empresa</label>
                <input
                  type="text"
                  placeholder="La propuesta de valor o frase ganadora"
                  value={cardData.slogan}
                  onChange={(e) => setCardData(prev => ({ ...prev, slogan: e.target.value }))}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 focus:outline-none focus:border-rose-500 focus:bg-white text-slate-800 dark:text-slate-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-500">Etiqueta Superior de Tarjeta (Badge)</label>
                <input
                  type="text"
                  placeholder="Ej: Consultoría, Startup, Alimentos"
                  value={cardData.badgeText}
                  onChange={(e) => setCardData(prev => ({ ...prev, badgeText: e.target.value }))}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 focus:outline-none focus:border-rose-500 focus:bg-white text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-500">Subir Logotipo Corporativo (Opcional)</label>
                <div className="flex gap-2 items-center">
                  <label className="cursor-pointer flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-dashed border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-950 text-[11px] font-medium text-zinc-500 hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors flex-1 text-center">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Elegir Logotipo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>
                  {cardData.logoUrl && (
                    <button
                      onClick={() => setCardData(prev => ({ ...prev, logoUrl: "" }))}
                      className="p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 text-rose-500 cursor-pointer transition-colors"
                      title="Quitar logotipo"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ASISTENTE INTELIGENTE: SUGERENCIAS DIGITALES CON IA GEMINI */}
          <div className="bg-gradient-to-tr from-slate-900 via-zinc-900 to-[#1e1124] text-white border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-purple-300 flex items-center gap-2">
                <Sparkles className="w-4.5 h-4.5 text-yellow-400" />
                Asistente de Redacción Profesional (Gemini IA)
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[9px] bg-purple-500/20 text-purple-300 border border-purple-500/20">
                Sugerencias Instantáneas
              </span>
            </div>
            
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              ¿No sabes qué eslogan o llamado de acción usar? Escribe tu tipo comercial e Inteligencia Artificial te redactará propuestas compatibles y diseñadas para redes sociales.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-zinc-400">Tipo de Empresa / Categoría</label>
                <input
                  type="text"
                  placeholder="Ej: Agencia Inmobiliaria Premium"
                  value={companyType}
                  onChange={(e) => setCompanyType(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-zinc-800 bg-zinc-950 focus:outline-none focus:border-purple-500 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-zinc-400">Tono Comunicativo</label>
                <select
                  value={aiTone}
                  onChange={(e) => setAiTone(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-zinc-800 bg-zinc-950 focus:outline-none focus:border-purple-500 text-white"
                >
                  <option value="profesional">Profesional y Confiable</option>
                  <option value="creativo">Creativo y Atrevido</option>
                  <option value="cálido">Cálido y Humano</option>
                  <option value="ejecutivo">Ejecutivo y Dinámico</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-zinc-400">Conceptos o Palabras Clave (Opcional)</label>
              <input
                type="text"
                placeholder="Ej: propiedades de lujo, inversión segura, Madrid"
                value={aiKeywords}
                onChange={(e) => setAiKeywords(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-zinc-800 bg-zinc-950 focus:outline-none focus:border-purple-500 text-white"
              />
            </div>

            <button
              onClick={generateSuggestionsWithGemini}
              disabled={aiLoading}
              className="w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 text-white bg-gradient-to-r from-purple-500 via-pink-600 to-indigo-600 shadow-md hover:shadow-xl transition-all cursor-pointer disabled:opacity-50"
            >
              {aiLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Redactando propuestas estratégicas con IA...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                  <span>Generar Slogans y Textos Corporativos con IA</span>
                </>
              )}
            </button>

            {aiError && (
              <p className="text-[11px] text-rose-400 text-center">{aiError}</p>
            )}

            {/* TABLA DE PROPUESTAS DE IA PARA SELECCIONAR E INTEGRAR */}
            {aiSuggestions && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-t border-zinc-800/80 pt-4 space-y-4"
              >
                {/* 1. Slogan Suggestions */}
                <div className="space-y-2">
                  <span className="text-[10px] tracking-wide font-bold uppercase text-purple-300">Slogans de Alto Impacto (Toca uno para aplicar)</span>
                  <div className="space-y-1.5">
                    {aiSuggestions.slogans.map((slogan, index) => (
                      <button
                        key={index}
                        onClick={() => setCardData(prev => ({ ...prev, slogan }))}
                        className="w-full p-2.5 text-left text-xs bg-zinc-950/80 border border-zinc-800 hover:border-purple-500/60 rounded-xl transition-all cursor-pointer flex items-center justify-between group text-zinc-100"
                      >
                        <span className="italic">"{slogan}"</span>
                        <span className="text-[10px] text-zinc-500 group-hover:text-purple-400 font-mono">Aplicar</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Micro Bio Suggestions */}
                {aiSuggestions.bios && aiSuggestions.bios.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[10px] tracking-wide font-bold uppercase text-purple-300">Mensajes de Presentación</span>
                    <div className="space-y-1.5">
                      {aiSuggestions.bios.map((bio, index) => (
                        <button
                          key={index}
                          onClick={() => setCardData(prev => ({ ...prev, slogan: bio }))}
                          className="w-full p-2.5 text-left text-xs bg-zinc-950/80 border border-zinc-800 hover:border-purple-500/60 rounded-xl transition-all cursor-pointer flex items-center justify-between group text-zinc-100 animate-slideUp"
                        >
                          <span className="truncate max-w-[280px] text-zinc-300">{bio}</span>
                          <span className="text-[10px] text-zinc-500 group-hover:text-purple-400 font-mono shrink-0">Aplicar</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. CTA suggestions */}
                <div className="space-y-2">
                  <span className="text-[10px] tracking-wide font-bold uppercase text-purple-300">Mensajes de WhatsApp / CTA Automáticos</span>
                  <div className="space-y-1.5">
                    {aiSuggestions.ctas.map((cta, index) => (
                      <button
                        key={index}
                        onClick={() => setCardData(prev => ({ ...prev, whatsappMessage: cta }))}
                        className="w-full p-2.5 text-left text-xs bg-zinc-950/80 border border-zinc-800 hover:border-purple-500/60 rounded-xl transition-all cursor-pointer flex items-center justify-between group text-zinc-100"
                      >
                        <span>{cta}</span>
                        <span className="text-[10px] text-zinc-500 group-hover:text-purple-400 font-mono">Usar CTA</span>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* SECCIÓN 2: CANALES DE CONTACTO */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-200/50 dark:border-zinc-800/80 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-500" />
              2. Canales de Contacto Directos
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-500">Móvil / Llamadas</label>
                <input
                  type="tel"
                  placeholder="Ej: +34 600 000 000"
                  value={cardData.phone}
                  onChange={(e) => setCardData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 focus:outline-none focus:border-rose-500 focus:bg-white text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-semibold text-slate-500">WhatsApp (Solo números + código país)</label>
                  <span className="text-[10px] font-mono text-emerald-600 font-bold">Botón interactivo</span>
                </div>
                <input
                  type="text"
                  placeholder="Ej: 34600000000"
                  value={cardData.whatsapp}
                  onChange={(e) => setCardData(prev => ({ ...prev, whatsapp: e.target.value }))}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 focus:outline-none focus:border-rose-500 focus:bg-white text-slate-800 dark:text-slate-100"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-500">Mensaje automático de WhatsApp</label>
              <textarea
                placeholder="El saludo que tu cliente enviará al abrir tu chat..."
                value={cardData.whatsappMessage}
                onChange={(e) => setCardData(prev => ({ ...prev, whatsappMessage: e.target.value }))}
                className="w-full text-xs p-3 h-16 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 focus:outline-none focus:border-rose-500 focus:bg-white text-slate-800 dark:text-slate-100 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-500">Correo Electrónico</label>
                <input
                  type="email"
                  placeholder="ejemplo@empresa.com"
                  value={cardData.email}
                  onChange={(e) => setCardData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 focus:outline-none focus:border-rose-500 focus:bg-white text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-500">Sitio Web</label>
                <input
                  type="text"
                  placeholder="www.tuempresa.com"
                  value={cardData.website}
                  onChange={(e) => setCardData(prev => ({ ...prev, website: e.target.value }))}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 focus:outline-none focus:border-rose-500 focus:bg-white text-slate-800 dark:text-slate-100"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-500">Dirección o Ubicación física</label>
              <input
                type="text"
                placeholder="Madrid, España o Av. Central #400"
                value={cardData.address}
                onChange={(e) => setCardData(prev => ({ ...prev, address: e.target.value }))}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 focus:outline-none focus:border-rose-500 focus:bg-white text-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          {/* SECCIÓN 3: REDES SOCIALES */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-200/50 dark:border-zinc-800/80 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Globe className="w-4 h-4 text-sky-500" />
              3. Enlaces de Redes Sociales
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-500">Instagram</label>
                <input
                  type="text"
                  placeholder="@usuario"
                  value={cardData.instagram}
                  onChange={(e) => setCardData(prev => ({ ...prev, instagram: e.target.value }))}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 focus:outline-none focus:border-rose-500 focus:bg-white text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-500">LinkedIn</label>
                <input
                  type="text"
                  placeholder="usuario-linkedin"
                  value={cardData.linkedin}
                  onChange={(e) => setCardData(prev => ({ ...prev, linkedin: e.target.value }))}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 focus:outline-none focus:border-rose-500 focus:bg-white text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-500">Facebook</label>
                <input
                  type="text"
                  placeholder="nombrepagina"
                  value={cardData.facebook}
                  onChange={(e) => setCardData(prev => ({ ...prev, facebook: e.target.value }))}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 focus:outline-none focus:border-rose-500 focus:bg-white text-slate-800 dark:text-slate-100"
                />
              </div>
            </div>
          </div>

          {/* SECCIÓN 4: PORTFOLIO DE SERVICIOS */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-200/50 dark:border-zinc-800/80 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Crown className="w-4 h-4 text-purple-500" />
              4. Servicios de Especialidad de tu Empresa
            </h3>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
              Añade de 1 a 4 servicios clave para que se enumeren estéticamente dentro de tu micrositio de tarjeta.
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ej: Aplicacion de Baterias de Rieso Psicosocial"
                value={serviceInput}
                onChange={(e) => setServiceInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") addService(); }}
                className="flex-1 text-xs p-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 focus:outline-none focus:border-rose-500 focus:bg-white text-slate-800 dark:text-slate-100"
              />
              <button
                onClick={addService}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 rounded-xl text-xs font-bold font-mono transition-colors cursor-pointer flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                <span>Agregar</span>
              </button>
            </div>

            {/* List badges */}
            <div className="flex flex-wrap gap-2 pt-2">
              {cardData.services.map((service, index) => (
                <span 
                  key={index}
                  className="px-3 py-1.5 rounded-xl border border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/60 text-xs text-slate-700 dark:text-zinc-300 flex items-center gap-1.5"
                >
                  <span>{service}</span>
                  <button 
                    onClick={() => removeService(index)}
                    className="text-rose-500 hover:text-rose-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 p-0.5 rounded-full cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
              {cardData.services.length === 0 && (
                <span className="text-[11px] text-zinc-500 italic">No hay servicios añadidos todavía.</span>
              )}
            </div>
          </div>

          {/* SECCIÓN 5: ESTILO VISUAL / TEMAS */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-200/50 dark:border-zinc-800/80 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-500" />
              5. Plantilla de Diseño de la Tarjeta
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {THEME_PRESETS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setCardData(prev => ({ ...prev, theme: t.id, accentColor: t.accentColor }))}
                  className={`p-3 rounded-xl border text-xs text-left cursor-pointer transition-all flex flex-col justify-between h-20 ${
                    cardData.theme === t.id
                      ? "border-slate-900 dark:border-white bg-slate-50 dark:bg-zinc-900 shadow-sm"
                      : "border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-900/40 bg-transparent text-slate-700 dark:text-zinc-300"
                  }`}
                >
                  <span className="font-bold">{t.name}</span>
                  <div className="flex gap-1.5 items-center mt-2.5">
                    <span className="w-3.5 h-3.5 rounded-full border border-zinc-700" style={{ backgroundColor: t.accentColor }}></span>
                    <span className="text-[10px] text-zinc-400">Modo {t.id === "emerald-modern" ? "Oscuro" : "Claro"}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Custom Palette pick color for accent */}
            <div className="border-t border-slate-100 dark:border-zinc-800 pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Personalizar Color del Acento</span>
                <span className="text-[10px] text-zinc-500">Aplica para botones destacados, bordes y QR.</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={cardData.accentColor}
                  onChange={(e) => setCardData(prev => ({ ...prev, accentColor: e.target.value }))}
                  className="w-8 h-8 rounded-md border border-slate-300 cursor-pointer overflow-hidden p-0"
                />
                <input
                  type="text"
                  value={cardData.accentColor}
                  onChange={(e) => setCardData(prev => ({ ...prev, accentColor: e.target.value }))}
                  className="text-xs p-1.5 w-24 rounded border border-slate-200 dark:border-zinc-700 bg-transparent text-slate-700 dark:text-zinc-300"
                />
              </div>
            </div>
          </div>

        </div>

        {/* PANEL DERECHO DE RETROALIMENTACIÓN E HISTORIAL DE SUGERENCIAS (6 Col) */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* TAB SEGMENTS CONTROL SELECTION */}
          <div className="bg-slate-100 dark:bg-zinc-900 p-1.5 rounded-2xl flex gap-1 border border-slate-250/20">
            <button
              onClick={() => setActiveTab("interactive-card")}
              className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                activeTab === "interactive-card"
                  ? "bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 shadow-sm"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-zinc-300"
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span className="hidden sm:inline">1. Tarjeta Interactiva</span>
              <span className="sm:hidden">Digital</span>
            </button>

            <button
              onClick={() => setActiveTab("qr-code")}
              className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                activeTab === "qr-code"
                  ? "bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 shadow-sm"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-zinc-300"
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span className="hidden sm:inline">2. QR Dinámico</span>
              <span className="sm:hidden">QR</span>
            </button>

            <button
              onClick={() => setActiveTab("image-optimize")}
              className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                activeTab === "image-optimize"
                  ? "bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 shadow-sm"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-zinc-300"
              }`}
            >
              <Image className="w-4 h-4" />
              <span className="hidden sm:inline">3. Exportar Imagen</span>
              <span className="sm:hidden">WhatsApp</span>
            </button>
          </div>

          {/* ACTIVE TAB RENDER VIEWER */}
          <div className="min-h-[450px]">
            {activeTab === "interactive-card" && (
              <div className="space-y-4">
                <div className="text-center sm:text-left px-2">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                    Sugerencia 1: Tarjetas Digitales Interactivas
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Simulación de micrositio móvil adaptable. Los botones son 100% interactivos y simulan llamadas, mensajes de WhatsApp, apertura de correo y enlaces.
                  </p>
                </div>
                
                <InteractiveCard data={cardData} />
              </div>
            )}

            {activeTab === "qr-code" && (
              <div className="space-y-4">
                <div className="text-center sm:text-left px-2">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                    Sugerencia 2: Códigos QR Dinámicos Personalizables
                  </h3>
                </div>
                
                <QRCodeTab cardData={cardData} />
              </div>
            )}

            {activeTab === "image-optimize" && (
              <div className="space-y-4">
                <div className="text-center sm:text-left px-2">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                    Sugerencia 3: Diseños de Imagen para Redes
                  </h3>
                </div>
                
                <OptimizedImageTab cardData={cardData} />
              </div>
            )}
          </div>

        </div>

      </main>

      <footer className="border-t border-slate-200/50 dark:border-zinc-800/80 py-10 mt-16 text-center text-xs text-slate-400 font-mono">
        <p className="max-w-md mx-auto px-4">
          Diseñado con altos estándares de fidelidad comercial, IA Generativa Gemini 3.5, y formatos optimizados para WhatsApp.
        </p>
        <p className="mt-2 text-zinc-500 text-[10px]">
          IMPULSA DIGITAL © {new Date().getFullYear()} • Entrena Consulting Pro
        </p>
      </footer>
    </div>
  );
}

// Simple smartphone icon fallback when lucide isn't responsive
function Smartphone({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <rect width="14" height="20" x="5" y="2" rx="2" ry="2"/>
      <path d="M12 18h.01"/>
    </svg>
  );
}
