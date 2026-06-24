/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import QRCode from "qrcode";
import { 
  Download, Image, Smartphone, Monitor, Grid, 
  Sparkles, RefreshCw, Layers, CheckCircle2 
} from "lucide-react";
import { CompanyCardData, THEME_PRESETS } from "../types/index";
import { serializeCard } from "../utils/index";

interface OptimizedImageTabProps {
  cardData: CompanyCardData;
}

type SizePreset = {
  id: "whatsapp-status" | "square-post" | "corporate-banner";
  name: string;
  badge: string;
  width: number;
  height: number;
  desc: string;
  aspectClass: string; // Tailwind aspect ratios for mockup preview
};

const SIZE_PRESETS: SizePreset[] = [
  {
    id: "whatsapp-status",
    name: "Estado de WhatsApp / IG Story",
    badge: "9:16 Móvil",
    width: 1080,
    height: 1920,
    desc: "Dimensiones ideales para publicar en estados de WhatsApp, Instagram Stories o enviar verticalmente por chat móvil.",
    aspectClass: "aspect-[9/16] w-52",
  },
  {
    id: "square-post",
    name: "Imagen de Perfil / Post de Catálogo",
    badge: "1:1 Cuadrado",
    width: 1080,
    height: 1080,
    desc: "Formato cuadrado perfecto para imagen de perfil de WhatsApp Business, publicaciones en redes sociales o envíos rápidos.",
    aspectClass: "aspect-square w-64",
  },
  {
    id: "corporate-banner",
    name: "Banner Ejecutivo / LinkedIn",
    badge: "4:3 Horizontal",
    width: 1200,
    height: 900,
    desc: "Orientación horizontal estándar, ideal para compartir en grupos profesionales de LinkedIn, Telegram o correos electrónicos.",
    aspectClass: "aspect-[4/3] w-72",
  }
];

export default function OptimizedImageTab({ cardData }: OptimizedImageTabProps) {
  const [selectedSize, setSelectedSize] = useState<"whatsapp-status" | "square-post" | "corporate-banner">("whatsapp-status");
  const [exporting, setExporting] = useState(false);
  const [downloadReady, setDownloadReady] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mockupCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const activePreset = SIZE_PRESETS.find(p => p.id === selectedSize) || SIZE_PRESETS[0];
  const themePreset = THEME_PRESETS.find(t => t.id === cardData.theme) || THEME_PRESETS[0];
  const isDark = cardData.theme === "emerald-modern";

  // Helper to draw the business card on a canvas element
  const drawCardOnCanvas = async (canvas: HTMLCanvasElement, width: number, height: number, isHighRes: boolean = false) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear and size
    canvas.width = width;
    canvas.height = height;

    // Background gradient or solid based on current theme
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    if (cardData.theme === "cosmic-charcoal") { // SST Confiable (Claro)
      gradient.addColorStop(0, "#f8fafc");
      gradient.addColorStop(1, "#f1fdf9"); // Soft mint teal touch
      ctx.fillStyle = gradient;
    } else if (cardData.theme === "emerald-modern") { // SST Preventiva (Oscuro Pro)
      gradient.addColorStop(0, "#09090b");
      gradient.addColorStop(1, "#18181b");
      ctx.fillStyle = gradient;
    } else if (cardData.theme === "creative-amber") { // Seguridad Industrial (Ámbar)
      gradient.addColorStop(0, "#fffbeb");
      gradient.addColorStop(1, "#fef3c7");
      ctx.fillStyle = gradient;
    } else if (cardData.theme === "minimalist-clean") { // Consultor Técnico (Azul)
      gradient.addColorStop(0, "#f8fafc");
      gradient.addColorStop(1, "#eff6ff");
      ctx.fillStyle = gradient;
    } else if (cardData.theme === "editorial-plum") { // SST Salud Ocupacional
      gradient.addColorStop(0, "#fff5f5");
      gradient.addColorStop(1, "#ffe4e6");
      ctx.fillStyle = gradient;
    } else {
      gradient.addColorStop(0, "#f8fafc");
      gradient.addColorStop(1, "#f1f5f9");
      ctx.fillStyle = gradient;
    }
    ctx.fillRect(0, 0, width, height);

    // Decorative futuristic background rings/blobs
    ctx.beginPath();
    ctx.arc(width * 0.8, height * 0.1, Math.min(width, height) * 0.4, 0, 2 * Math.PI);
    ctx.fillStyle = hexToRGBA(cardData.accentColor || "#10b981", 0.08);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(width * 0.2, height * 0.8, Math.min(width, height) * 0.3, 0, 2 * Math.PI);
    ctx.fillStyle = hexToRGBA(cardData.accentColor || "#10b981", 0.05);
    ctx.fill();

    // Draw card borders or frame vectors
    ctx.strokeStyle = hexToRGBA(cardData.accentColor || "#10b981", 0.15);
    ctx.lineWidth = isHighRes ? 8 : 3;
    ctx.strokeRect(width * 0.05, height * 0.05, width * 0.9, height * 0.9);

    // Color Setup
    const isDark = cardData.theme === "emerald-modern";
    const primaryTextColor = isDark ? "#ffffff" : "#0f172a";
    const secondaryTextColor = isDark ? "#94a3b8" : "#475569";
    const accentColor = cardData.accentColor || "#10b981";

    // Text positions and layouts based on Aspect Ratio Preset
    if (selectedSize === "whatsapp-status") {
      // 9:16 Portrait layout
      const logoSize = Math.round(width * 0.14);
      await drawBrandLogo(ctx, width / 2, height * 0.08, logoSize, accentColor, isDark, isHighRes);

      // 1. Header Badge
      ctx.font = `bold ${Math.round(width * 0.03)}px sans-serif`;
      ctx.fillStyle = accentColor;
      ctx.textAlign = "center";
      ctx.fillText((cardData.badgeText || "TARJETA VIRTUAL").toUpperCase(), width / 2, height * 0.16);

      // 2. Company Name
      ctx.font = `bold ${Math.round(width * 0.065)}px sans-serif`;
      ctx.fillStyle = primaryTextColor;
      ctx.fillText(cardData.businessName || "Empresa Digital", width / 2, height * 0.24);

      // 3. Representative & Title
      if (cardData.representativeName) {
        ctx.font = `bold ${Math.round(width * 0.045)}px sans-serif`;
        ctx.fillStyle = primaryTextColor;
        ctx.fillText(cardData.representativeName, width / 2, height * 0.30);
      }

      if (cardData.role) {
        ctx.font = `500 ${Math.round(width * 0.032)}px monospace`;
        ctx.fillStyle = accentColor;
        ctx.fillText(cardData.role.toUpperCase(), width / 2, height * 0.34);
      }

      // 4. Slogan
      if (cardData.slogan) {
        ctx.font = `italic ${Math.round(width * 0.035)}px sans-serif`;
        ctx.fillStyle = secondaryTextColor;
        wrapText(ctx, `"${cardData.slogan}"`, width / 2, height * 0.40, width * 0.75, width * 0.05);
      }

      // 5. QR Code in Central Box
      const qrSize = Math.round(width * 0.4);
      const qrX = (width - qrSize) / 2;
      const qrY = height * 0.52;

      // Draw QR Border Box
      ctx.fillStyle = isDark ? "#1e293b" : "#ffffff";
      ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
      ctx.shadowBlur = 30;
      roundRect(ctx, qrX - 25, qrY - 25, qrSize + 50, qrSize + 50, 40, true, true);
      ctx.shadowBlur = 0; // Reset shadow

      // Draw QR code image
      const qrBase64Text = await generateQRTextContent();
      const qrImg = await loadQRImage(qrBase64Text, accentColor, isDark ? "#ffffff" : "#f1f5f9");
      if (qrImg) {
        ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
      }

      ctx.font = `bold ${Math.round(width * 0.032)}px sans-serif`;
      ctx.fillStyle = primaryTextColor;
      ctx.fillText("ESCANEAR PARA CONTACTO", width / 2, qrY + qrSize + 60);

      // 6. Contact quick info details at the bottom
      ctx.font = `500 ${Math.round(width * 0.032)}px sans-serif`;
      ctx.fillStyle = secondaryTextColor;
      let bottomY = height * 0.84;
      if (cardData.phone) {
        ctx.fillText(`📞 WhatsApp: ${cardData.phone}`, width / 2, bottomY);
        bottomY += width * 0.05;
      }
      if (cardData.email) {
        ctx.fillText(`✉️ Email: ${cardData.email}`, width / 2, bottomY);
        bottomY += width * 0.05;
      }
      if (cardData.website) {
        ctx.fillText(`🌐 Web: ${cardData.website}`, width / 2, bottomY);
      }

    } else if (selectedSize === "square-post") {
      // 1:1 Square layout
      const logoSize = Math.round(width * 0.13);
      await drawBrandLogo(ctx, width * 0.1 + (logoSize / 2), height * 0.11, logoSize, accentColor, isDark, isHighRes);

      // Left side text, right side QR code (or centered design)
      // 1. Company Name
      ctx.font = `bold ${Math.round(width * 0.05)}px sans-serif`;
      ctx.fillStyle = primaryTextColor;
      ctx.textAlign = "left";
      ctx.fillText(cardData.businessName || "Empresa Digital", width * 0.1, height * 0.22);

      // 2. Representative Name
      if (cardData.representativeName) {
        ctx.font = `bold ${Math.round(width * 0.038)}px sans-serif`;
        ctx.fillStyle = primaryTextColor;
        ctx.fillText(cardData.representativeName, width * 0.1, height * 0.29);
      }

      if (cardData.role) {
        ctx.font = `600 ${Math.round(width * 0.025)}px monospace`;
        ctx.fillStyle = accentColor;
        ctx.fillText(cardData.role.toUpperCase(), width * 0.1, height * 0.33);
      }

      // Slogan
      if (cardData.slogan) {
        ctx.font = `italic ${Math.round(width * 0.028)}px sans-serif`;
        ctx.fillStyle = secondaryTextColor;
        wrapText(ctx, `"${cardData.slogan}"`, width * 0.1, height * 0.40, width * 0.42, width * 0.04);
      }

      // Services bullet points
      if (cardData.services && cardData.services.length > 0) {
        let bulletY = height * 0.58;
        ctx.font = `500 ${Math.round(width * 0.024)}px sans-serif`;
        ctx.fillStyle = primaryTextColor;
        ctx.fillText("SERVICIOS CLAVE y ESPECIALIDADES:", width * 0.1, bulletY);
        bulletY += width * 0.04;

        ctx.font = `${Math.round(width * 0.024)}px sans-serif`;
        ctx.fillStyle = secondaryTextColor;
        cardData.services.filter(s => s.trim().length > 0).forEach(service => {
          ctx.fillText(`✦ ${service}`, width * 0.12, bulletY);
          bulletY += width * 0.036;
        });
      }

      // Right Side QR Code
      const qrSize = Math.round(width * 0.36);
      const qrX = width * 0.55;
      const qrY = height * 0.25;

      // QR box background
      ctx.fillStyle = isDark ? "#1e293b" : "#ffffff";
      ctx.shadowColor = "rgba(0, 0, 0, 0.25)";
      ctx.shadowBlur = 25;
      roundRect(ctx, qrX - 20, qrY - 20, qrSize + 40, qrSize + 40, 30, true, true);
      ctx.shadowBlur = 0;

      const qrBase64Text = await generateQRTextContent();
      const qrImg = await loadQRImage(qrBase64Text, accentColor, isDark ? "#ffffff" : "#f1f5f9");
      if (qrImg) {
        ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
      }

      // Scan Call to action on bottom right
      ctx.font = `bold ${Math.round(width * 0.022)}px sans-serif`;
      ctx.fillStyle = primaryTextColor;
      ctx.textAlign = "center";
      ctx.fillText("ESCANEAR CONTACTO VIRTUAL", qrX + (qrSize / 2), qrY + qrSize + 45);

      // Main contacts footer line
      ctx.font = `500 ${Math.round(width * 0.024)}px sans-serif`;
      ctx.fillStyle = secondaryTextColor;
      ctx.textAlign = "center";
      ctx.fillText(`${cardData.phone ? `📞 ${cardData.phone}` : ""}  |  ${cardData.email ? `✉️ ${cardData.email}` : ""}  |  ${cardData.website ? `🌐 ${cardData.website}` : ""}`, width / 2, height * 0.88);

    } else {
      // 4:3 Corporate Banner layout (Widescreen)
      const logoSize = Math.round(width * 0.11);
      await drawBrandLogo(ctx, width * 0.08 + (logoSize / 2), height * 0.11, logoSize, accentColor, isDark, isHighRes);

      ctx.font = `bold ${Math.round(width * 0.04)}px sans-serif`;
      ctx.fillStyle = primaryTextColor;
      ctx.textAlign = "left";
      ctx.fillText(cardData.businessName || "Empresa Digital", width * 0.08, height * 0.22);

      if (cardData.representativeName) {
        ctx.font = `bold ${Math.round(width * 0.032)}px sans-serif`;
        ctx.fillStyle = primaryTextColor;
        ctx.fillText(cardData.representativeName, width * 0.08, height * 0.29);
      }

      if (cardData.role) {
        ctx.font = `600 ${Math.round(width * 0.022)}px monospace`;
        ctx.fillStyle = accentColor;
        ctx.fillText(cardData.role.toUpperCase(), width * 0.08, height * 0.33);
      }

      // Slogan info
      if (cardData.slogan) {
        ctx.font = `italic ${Math.round(width * 0.025)}px sans-serif`;
        ctx.fillStyle = secondaryTextColor;
        wrapText(ctx, `"${cardData.slogan}"`, width * 0.08, height * 0.40, width * 0.48, width * 0.035);
      }

      // Contacts listed on left bottom
      let contY = height * 0.58;
      ctx.font = `500 ${Math.round(width * 0.023)}px sans-serif`;
      ctx.fillStyle = secondaryTextColor;
      if (cardData.phone) {
        ctx.fillText(`📞 WhatsApp: ${cardData.phone}`, width * 0.08, contY);
        contY += width * 0.032;
      }
      if (cardData.email) {
        ctx.fillText(`✉️ Email: ${cardData.email}`, width * 0.08, contY);
        contY += width * 0.032;
      }
      if (cardData.website) {
        ctx.fillText(`🌐 Web: ${cardData.website}`, width * 0.08, contY);
      }

      // Right Side layout block
      const qrSize = Math.round(height * 0.45);
      const qrX = width * 0.62;
      const qrY = height * 0.24;

      ctx.fillStyle = isDark ? "#1e293b" : "#ffffff";
      ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
      ctx.shadowBlur = 20;
      roundRect(ctx, qrX - 15, qrY - 15, qrSize + 30, qrSize + 30, 25, true, true);
      ctx.shadowBlur = 0;

      const qrBase64Text = await generateQRTextContent();
      const qrImg = await loadQRImage(qrBase64Text, accentColor, isDark ? "#ffffff" : "#f1f5f9");
      if (qrImg) {
        ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
      }

      ctx.font = `bold ${Math.round(width * 0.02)}px sans-serif`;
      ctx.fillStyle = primaryTextColor;
      ctx.textAlign = "center";
      ctx.fillText("ESCANEAR TARJETA DIGITAL", qrX + (qrSize / 2), qrY + qrSize + 40);
    }
  };

  // Helper function to load an image safely inside canvas (prevents CORS and base64 issues)
  const loadImg = (url: string | undefined): Promise<HTMLImageElement | null> => {
    return new Promise((resolve) => {
      if (!url) {
        resolve(null);
        return;
      }
      const img = new Image();
      // Only set crossOrigin if it is an external URL, not a base64 string
      if (!url.startsWith("data:")) {
        img.crossOrigin = "anonymous";
      }
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = url;
    });
  };

  // Helper function to draw circular branding logo or initial avatar on canvas
  const drawBrandLogo = async (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    size: number,
    accentColor: string,
    isDark: boolean,
    isHighRes: boolean
  ) => {
    const radius = size / 2;
    const lx = cx - radius;
    const ly = cy - radius;

    // Block 1: shadow + background circle + border ring (no clip active)
    ctx.save();
    ctx.shadowColor = isDark ? "rgba(16, 185, 129, 0.25)" : "rgba(0, 0, 0, 0.15)";
    ctx.shadowBlur = isHighRes ? 24 : 10;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fillStyle = isDark ? "#09090b" : "#ffffff";
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = isHighRes ? 4 : 2;
    ctx.stroke();
    ctx.restore();

    // Block 2: fresh clip path → draw logo PNG or initials inside circle
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius - (isHighRes ? 2 : 1), 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    const logoImg = cardData.logoUrl ? await loadImg(cardData.logoUrl) : null;
    if (logoImg) {
      ctx.drawImage(logoImg, lx, ly, size, size);
    } else {
      ctx.fillStyle = isDark ? "#09090b" : "#ffffff";
      ctx.fillRect(lx, ly, size, size);
      const initials = cardData.businessName ? cardData.businessName.substring(0, 2).toUpperCase() : "CO";
      ctx.font = `bold ${Math.round(size * 0.42)}px sans-serif`;
      ctx.fillStyle = accentColor;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(initials, cx, cy);
    }
    ctx.restore();
  };

  // Helper function to load QR as Image inside canvas
  const loadQRImage = (text: string, fgColor: string, bgColor: string): Promise<HTMLImageElement | null> => {
    return new Promise(async (resolve) => {
      try {
        const url = await QRCode.toDataURL(text, {
          margin: 1,
          width: 320,
          color: {
            dark: fgColor,
            light: bgColor,
          },
          errorCorrectionLevel: "H",
        });
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = url;
      } catch (e) {
        resolve(null);
      }
    });
  };

  // URL link to point QR code to
  const generateQRTextContent = async () => {
    const hash = serializeCard(cardData);
    return `${window.location.origin}${window.location.pathname}?card=${hash}`;
  };

  // Run draws whenever template, configurations, size or details modify
  useEffect(() => {
    // 1. Draw live preview mockup
    if (mockupCanvasRef.current) {
      drawCardOnCanvas(mockupCanvasRef.current, activePreset.width / 3.5, activePreset.height / 3.5);
    }
  }, [cardData, selectedSize]);

  const handleExport = async () => {
    if (!canvasRef.current) return;
    setExporting(true);
    try {
      // 2. Draw high resolution and download
      await drawCardOnCanvas(canvasRef.current, activePreset.width, activePreset.height, true);
      
      const link = document.createElement("a");
      link.download = `Tarjeta_de_Presentacion_Entrena_Consulting_SAS.png`;
      link.href = canvasRef.current.toDataURL("image/png");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error(e);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Sidebar Selector size configuration (6 cols) */}
      <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl space-y-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Layers className="w-5 h-5 text-purple-500" />
            Formatos de Imagen Optimizados
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Exporta tu tarjeta de presentación en formatos perfectamente optimizados con las proporciones recomendadas para WhatsApp y otras redes sociales.
          </p>
        </div>

        {/* Size Preset Selector */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Elegir Formato de Salida
          </label>
          <div className="space-y-2.5">
            {SIZE_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => setSelectedSize(preset.id)}
                className={`w-full p-4 text-left rounded-xl border cursor-pointer transition-all flex items-start justify-between gap-4 ${
                  selectedSize === preset.id
                    ? "border-purple-500 bg-purple-500/5 text-slate-900 dark:text-slate-100"
                    : "border-slate-200 dark:border-zinc-800 bg-transparent hover:bg-slate-50 dark:hover:bg-zinc-800/40 text-slate-700 dark:text-slate-300"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 shrink-0 ${selectedSize === preset.id ? "text-purple-500" : "text-zinc-500"}`}>
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-xs block">{preset.name}</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 block leading-relaxed max-w-sm">
                      {preset.desc}
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] uppercase font-mono font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-500 shrink-0 self-start">
                  {preset.badge}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-xs space-y-2 border border-slate-100 dark:border-zinc-800">
          <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
            Integración de Código QR Automático
          </span>
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-[11px]">
            La imagen generada incrusta automáticamente tu código QR dinámico configurado. Al subir esta imagen a tus estados de WhatsApp o perfiles, tus clientes podrán escanearla e interactuar de inmediato con tus botones.
          </p>
        </div>

        {/* Real Download Trigger Button */}
        <button
          onClick={handleExport}
          disabled={exporting}
          className="w-full py-4 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 text-white bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg shadow-purple-500/10 hover:shadow-xl transition-all cursor-pointer disabled:opacity-60"
        >
          {exporting ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Renderizando Imagen del Servidor...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Exportar y Descargar Imagen (Alta Resolución)</span>
            </>
          )}
        </button>
      </div>

      {/* Exporter Preview Panel (6 cols) */}
      <div className="lg:col-span-6 flex flex-col items-center justify-center space-y-4 w-full">
        <span className="text-[10px] uppercase font-extrabold tracking-widest text-slate-400 dark:text-zinc-500">
          VISTA PREVIA DEL LAYOUT EXPORTABLE
        </span>

        {/* Virtual Canvas Box simulating dimensions container */}
        <div className={`p-6 rounded-[2rem] border transition-all duration-300 flex items-center justify-center min-h-[460px] w-full max-w-sm ${
          !isDark 
            ? "bg-slate-100/90 border-slate-200/80 shadow-xl" 
            : "bg-slate-950 border-slate-800 shadow-2xl"
        }`}>
          <div className="relative flex items-center justify-center">
            {/* The canvas representing simulated mockup sizes */}
            <canvas 
              ref={mockupCanvasRef} 
              className={`rounded-2xl border shadow-lg max-w-full ${activePreset.aspectClass} transition-all duration-300 ${
                !isDark ? 'border-slate-300/85' : 'border-slate-800'
              }`}
            ></canvas>
          </div>
        </div>

        {/* Hidden Master canvas for real high-resolution exports (1080px background size) */}
        <canvas ref={canvasRef} className="hidden"></canvas>
      </div>
    </div>
  );
}

// Utility drawing functions for direct canvas
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number, fill: boolean, stroke: boolean) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  if (fill) ctx.fill();
  if (stroke) ctx.stroke();
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const words = text.split(" ");
  let line = "";
  let currentY = y;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, currentY);
      line = words[n] + " ";
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, currentY);
}

function hexToRGBA(hex: string, alpha: number): string {
  const c = hex.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16) || 244;
  const g = parseInt(c.substring(2, 4), 16) || 63;
  const b = parseInt(c.substring(4, 6), 16) || 94;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
