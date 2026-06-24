/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  Phone, Mail, Globe, MapPin, Instagram, Linkedin, 
  Facebook, MessageSquare, ExternalLink, ShieldCheck 
} from "lucide-react";
import { CompanyCardData, THEME_PRESETS } from "../types/index";
import { motion } from "motion/react";

interface InteractiveCardProps {
  data: CompanyCardData;
}

export default function InteractiveCard({ data }: InteractiveCardProps) {
  const currentTheme = THEME_PRESETS.find(t => t.id === data.theme) || THEME_PRESETS[0];

  // Force light-theme adaptation if the theme is anything except the dark one
  const isLightTheme = currentTheme.id !== "emerald-modern";

  // Real WhatsApp call URL builder
  const waUrl = data.whatsapp 
    ? `https://wa.me/${data.whatsapp.trim().replace(/[^0-9]/g, "")}?text=${encodeURIComponent(data.whatsappMessage || "Hola, me interesa tu tarjeta de presentación.")}`
    : "#";

  const mailUrl = data.email ? `mailto:${data.email}` : "#";
  const telUrl = data.phone ? `tel:${data.phone}` : "#";
  
  const hasSocials = data.instagram || data.linkedin || data.facebook;

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Container simulating a premium mobile frame */}
      <div className={`relative w-full rounded-[2.5rem] border-[8px] ${isLightTheme ? 'border-zinc-800 bg-zinc-900 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)]' : 'border-slate-800 bg-slate-950 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)]'} p-2.5 pb-4 transition-all duration-300`}>
        {/* Mobile Camera Notch */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-4 bg-zinc-800/80 rounded-full z-10 hidden sm:block"></div>
        
        {/* Screen/Card Area */}
        <div className={`w-full rounded-[2rem] p-5 pt-8 overflow-y-auto max-h-[580px] scrollbar-thin transition-colors duration-500 ${currentTheme.bgClass} flex flex-col justify-between`} style={{ minHeight: "530px" }}>
          
          <div>
            {/* Header Badge */}
            <div className="flex justify-between items-center mb-5">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider self-start ${
                isLightTheme 
                  ? 'bg-emerald-600/10 text-emerald-800 border border-emerald-600/20' 
                  : 'bg-white/10 text-white backdrop-blur-xs'
              }`}>
                {data.badgeText || "Tarjeta Digital"}
              </span>
              <div className={`flex items-center gap-1.5 text-[10px] font-mono font-bold ${isLightTheme ? 'text-emerald-700' : 'text-emerald-400'}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>DISPONIBLE / SST</span>
              </div>
            </div>

            {/* Profile Header Block */}
            <div className="flex flex-col items-center text-center my-3">
              {/* Logo/Avatar */}
              <div className="relative mb-4 group">
                <div className={`absolute -inset-1 rounded-full bg-gradient-to-r ${isLightTheme ? 'from-emerald-500 to-teal-400' : 'from-teal-400 to-rose-400'} blur-xs opacity-60 group-hover:opacity-100 transition duration-300`}></div>
                <div className={`relative w-20 h-20 rounded-full overflow-hidden border-2 bg-zinc-850 flex items-center justify-center ${isLightTheme ? 'border-emerald-600/20 bg-emerald-50/50' : 'border-white/20 bg-zinc-800'}`}>
                  {data.logoUrl ? (
                    <img 
                      src={data.logoUrl} 
                      alt="Logo de la empresa" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span className={`font-sans font-extrabold text-2xl tracking-wider ${isLightTheme ? 'text-emerald-700' : 'text-transparent bg-clip-text bg-gradient-to-tr from-teal-400 to-emerald-400'}`}>
                      {data.businessName ? data.businessName.substring(0, 2).toUpperCase() : "CO"}
                    </span>
                  )}
                </div>
              </div>

              {/* Title & Organization Name */}
              <h2 className={`text-xl font-extrabold tracking-tight mt-1 truncate max-w-full ${isLightTheme ? 'text-slate-900' : 'text-white'}`}>
                {data.businessName || "Nombre de Tu Empresa"}
              </h2>
              
              {data.representativeName && (
                <p className={`text-sm font-semibold mt-1 ${isLightTheme ? 'text-slate-800' : 'text-white/95'}`}>
                  {data.representativeName}
                </p>
              )}
              
              {data.role && (
                <p className={`text-xs font-mono font-bold tracking-wider mt-0.5 uppercase ${isLightTheme ? 'text-emerald-700' : 'text-emerald-400'}`}>
                  {data.role}
                </p>
              )}

              {/* Special Industry/Consulting Badge for SST Context */}
              <div className={`my-4 p-3 rounded-2xl border flex items-center gap-3 w-full transition-all text-left ${
                isLightTheme 
                  ? 'bg-emerald-50/80 border-emerald-500/15 text-emerald-950' 
                  : 'bg-emerald-950/20 border-emerald-500/25 text-emerald-50'
              }`}>
                <div className={`p-2 rounded-xl shrink-0 ${isLightTheme ? 'bg-emerald-100/60' : 'bg-emerald-950/80'} border border-emerald-500/20`}>
                  <ShieldCheck className={`w-5 h-5 ${isLightTheme ? 'text-emerald-700' : 'text-emerald-400'}`} />
                </div>
                <div className="leading-tight">
                  <span className={`text-[8px] font-bold tracking-widest uppercase block ${isLightTheme ? 'text-emerald-800' : 'text-emerald-400'}`}>
                    Área de Consulta
                  </span>
                  <p className={`font-bold text-[11px] ${isLightTheme ? 'text-slate-900' : 'text-zinc-100'}`}>
                    Seguridad y Salud en el Trabajo (SST)
                  </p>
                </div>
              </div>

              {/* Slogan & Bio block */}
              {data.slogan ? (
                <div className={`px-4 py-3 rounded-xl border w-full ${
                  isLightTheme 
                    ? 'bg-slate-100/40 border-slate-250/50 text-slate-700' 
                    : 'bg-black/20 border-white/5 text-slate-300'
                }`}>
                  <p className="text-xs font-sans leading-relaxed italic">
                    "{data.slogan}"
                  </p>
                </div>
              ) : (
                <p className="text-xs text-zinc-500 italic mt-3 px-2">
                  "Genera o edita un slogan dinámico para cautivar a tu público aquí."
                </p>
              )}
            </div>

            {/* Specialties / Service badges */}
            {data.services && data.services.length > 0 && (
              <div className="my-5 flex flex-wrap justify-center gap-1.5">
                {data.services.filter(s => s.trim().length > 0).map((service, index) => (
                  <span 
                    key={index}
                    className={`text-[10px] px-2.5 py-1 rounded-md font-sans font-bold border transition-all ${
                      isLightTheme 
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-500/20 shadow-xs' 
                        : 'bg-emerald-950/40 text-emerald-300 border-emerald-500/35'
                    }`}
                  >
                    ✦ {service}
                  </span>
                ))}
              </div>
            )}

            {/* Quick Action Interactive Buttons */}
            <div className="space-y-2.5 mt-4">
              {/* Main WA Custom Button */}
              {data.whatsapp && (
                <motion.a 
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 px-4 rounded-xl flex items-center justify-between text-white font-bold text-xs shadow-md shadow-emerald-600/10 hover:shadow-lg transition-all border border-emerald-500/20 bg-gradient-to-r from-emerald-600 to-teal-600"
                  id="wa-cta-btn"
                >
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 fill-current text-white shrink-0" />
                    <span>WhatsApp Corporativo</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 opacity-90 text-white shrink-0" />
                </motion.a>
              )}

              {/* Email Button */}
              {data.email && (
                <motion.a 
                  href={mailUrl}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-2.5 px-4 rounded-xl flex items-center gap-3 text-xs border transition-all ${
                    isLightTheme 
                      ? 'border-emerald-600/15 bg-white hover:bg-emerald-50/30 text-slate-900 shadow-sm' 
                      : 'border-white/10 bg-white/5 hover:bg-white/10 active:bg-white/15 text-slate-100'
                  }`}
                >
                  <Mail className="w-4 h-4 shrink-0" style={{ color: currentTheme.accentColor }} />
                  <div className="text-left truncate">
                    <span className={`block text-[8px] uppercase tracking-wider font-extrabold ${isLightTheme ? 'text-slate-500' : 'text-zinc-400'}`}>Escribir Correo</span>
                    <span className="font-bold truncate block">{data.email}</span>
                  </div>
                </motion.a>
              )}

              {/* Call Phone Button */}
              {data.phone && (
                <motion.a 
                  href={telUrl}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-2.5 px-4 rounded-xl flex items-center gap-3 text-xs border transition-all ${
                    isLightTheme 
                      ? 'border-emerald-600/15 bg-white hover:bg-emerald-50/30 text-slate-900 shadow-sm' 
                      : 'border-white/10 bg-white/5 hover:bg-white/10 active:bg-white/15 text-slate-100'
                  }`}
                >
                  <Phone className="w-4 h-4 shrink-0" style={{ color: currentTheme.accentColor }} />
                  <div className="text-left truncate">
                    <span className={`block text-[8px] uppercase tracking-wider font-extrabold ${isLightTheme ? 'text-slate-500' : 'text-zinc-400'}`}>Llamada Directa</span>
                    <span className="font-bold truncate block">{data.phone}</span>
                  </div>
                </motion.a>
              )}

              {/* Website button */}
              {data.website && (
                <motion.a 
                  href={data.website.startsWith("http") ? data.website : `https://${data.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-2.5 px-4 rounded-xl flex items-center gap-3 text-xs border transition-all ${
                    isLightTheme 
                      ? 'border-emerald-600/15 bg-white hover:bg-emerald-50/30 text-slate-900 shadow-sm' 
                      : 'border-white/10 bg-white/5 hover:bg-white/10 active:bg-white/15 text-slate-100'
                  }`}
                >
                  <Globe className="w-4 h-4 shrink-0" style={{ color: currentTheme.accentColor }} />
                  <div className="text-left truncate">
                    <span className={`block text-[8px] uppercase tracking-wider font-extrabold ${isLightTheme ? 'text-slate-500' : 'text-zinc-400'}`}>Sitio Web Oficial</span>
                    <span className="font-bold truncate block">{data.website.replace(/(^\w+:|^)\/\//, '')}</span>
                  </div>
                </motion.a>
              )}

              {/* Location Badge */}
              {data.address && (
                <div className={`py-2 px-4 rounded-xl border flex items-start gap-3 transition-all ${
                  isLightTheme 
                    ? 'bg-white border-emerald-500/15 text-slate-900 shadow-xs' 
                    : 'bg-white/5 border border-white/5 text-slate-100'
                }`}>
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0" style={{ color: currentTheme.accentColor }} />
                  <div className="text-left">
                    <span className={`block text-[8px] uppercase tracking-wider font-extrabold ${isLightTheme ? 'text-slate-500' : 'text-zinc-400'}`}>Ubicación / Dirección</span>
                    <p className={`text-[11px] font-sans leading-snug font-bold ${isLightTheme ? 'text-slate-900' : 'opacity-85'}`}>
                      {data.address}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Social Grid Block / Conexiones Digitales (Evita el apiñamiento) */}
            {hasSocials && (
              <div className={`mt-6 pt-5 border-t ${isLightTheme ? 'border-slate-250/60' : 'border-white/10'}`}>
                <span className={`text-[9px] font-extrabold uppercase tracking-widest block mb-4 text-center ${isLightTheme ? 'text-slate-500' : 'text-zinc-400'}`}>
                  Canales y Redes Digitales
                </span>
                <div className="flex flex-wrap justify-center gap-2.5">
                  {data.linkedin && (
                    <motion.a 
                      href={data.linkedin.startsWith("http") ? data.linkedin : `https://${data.linkedin}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      whileTap={{ scale: 0.95 }}
                      className={`flex-1 min-w-[95px] py-3 px-3 rounded-2xl flex flex-col items-center justify-center text-center transition-all border ${
                        isLightTheme 
                          ? 'border-sky-100 bg-sky-50/50 hover:bg-sky-100/80 text-sky-950 font-bold shadow-xs' 
                          : 'border-sky-500/20 bg-sky-950/20 hover:bg-sky-900/30 text-sky-200'
                      }`}
                    >
                      <Linkedin className="w-4.5 h-4.5 mb-1.5 text-sky-600 shrink-0" />
                      <span className="text-[10px] font-bold block truncate max-w-full">LinkedIn</span>
                    </motion.a>
                  )}
                  {data.instagram && (
                    <motion.a 
                      href={`https://instagram.com/${data.instagram.replace("@", "")}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      whileTap={{ scale: 0.95 }}
                      className={`flex-1 min-w-[95px] py-3 px-3 rounded-2xl flex flex-col items-center justify-center text-center transition-all border ${
                        isLightTheme 
                          ? 'border-pink-100 bg-pink-50/50 hover:bg-pink-100/80 text-pink-950 font-bold shadow-xs' 
                          : 'border-pink-500/20 bg-pink-950/20 hover:bg-pink-900/30 text-pink-200'
                      }`}
                    >
                      <Instagram className="w-4.5 h-4.5 mb-1.5 text-pink-600 shrink-0" />
                      <span className="text-[10px] font-bold block truncate max-w-full">Instagram</span>
                    </motion.a>
                  )}
                  {data.facebook && (
                    <motion.a 
                      href={data.facebook.startsWith("http") ? data.facebook : `https://facebook.com/${data.facebook}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      whileTap={{ scale: 0.95 }}
                      className={`flex-1 min-w-[95px] py-3 px-3 rounded-2xl flex flex-col items-center justify-center text-center transition-all border ${
                        isLightTheme 
                          ? 'border-blue-100 bg-blue-50/50 hover:bg-blue-100/80 text-blue-950 font-bold shadow-xs' 
                          : 'border-blue-500/20 bg-blue-950/20 hover:bg-blue-900/30 text-blue-200'
                      }`}
                    >
                      <Facebook className="w-4.5 h-4.5 mb-1.5 text-blue-600 shrink-0" />
                      <span className="text-[10px] font-bold block truncate max-w-full">Facebook</span>
                    </motion.a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer of the Card */}
          <div className={`mt-8 pt-4 border-t flex items-center justify-between text-[10px] font-mono font-bold ${
            isLightTheme 
              ? 'border-slate-200 text-slate-400' 
              : 'border-white/5 text-zinc-500'
          }`}>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className={`w-4 h-4 ${isLightTheme ? 'text-emerald-700' : 'text-emerald-400'}`} />
              <span>SST Certificado</span>
            </div>
            <span>© {new Date().getFullYear()} IMPULSA</span>
          </div>

        </div>
      </div>
    </div>
  );
}
