/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Download, QrCode, Link, MessageSquare, UserPlus, 
  Globe, Sparkles, RefreshCw, CheckCircle2 
} from "lucide-react";
import { CompanyCardData } from "../types/index";
import { serializeCard } from "../utils/index";

interface QRCodeTabProps {
  cardData: CompanyCardData;
}

export default function QRCodeTab({ cardData }: QRCodeTabProps) {
  const [qrType, setQrType] = useState<"interactive-link" | "whatsapp" | "vcard" | "custom">("interactive-link");
  const [customText, setCustomText] = useState("");
  const [qrColorDark, setQrColorDark] = useState(cardData.accentColor || "#f43f5e");
  const [qrColorLight, setQrColorLight] = useState("#ffffff");
  const [qrMargin, setQrMargin] = useState(2);
  const [qrImage, setQrImage] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Generar el texto/contenido exacto del QR según la opción seleccionada
  const getQRContent = () => {
    switch (qrType) {
      case "interactive-link":
        // Generar URL directa del applet con el hash serializado
        const hash = serializeCard(cardData);
        return `${window.location.origin}${window.location.pathname}?card=${hash}`;
      case "whatsapp":
        const cleanPhone = cardData.whatsapp.trim().replace(/[^0-9]/g, "");
        const cleanMsg = encodeURIComponent(cardData.whatsappMessage || "Hola, he escaneado tu código!");
        return `https://wa.me/${cleanPhone}?text=${cleanMsg}`;
      case "vcard":
        // Formato estándar vCard (VCF) para agregarlo directamente a contactos al escanear
        const vcard = [
          "BEGIN:VCARD",
          "VERSION:3.0",
          `N:${cardData.representativeName || cardData.businessName};;;`,
          `FN:${cardData.representativeName || cardData.businessName}`,
          `ORG:${cardData.businessName}`,
          `TITLE:${cardData.role}`,
          `TEL;TYPE=CELL,VOICE:${cardData.phone || cardData.whatsapp}`,
          `EMAIL;TYPE=PREF,INTERNET:${cardData.email}`,
          `URL:${cardData.website}`,
          `ADR;TYPE=WORK:;;${cardData.address};;;`,
          "END:VCARD"
        ].join("\n");
        return vcard;
      case "custom":
        return customText || "https://google.com";
      default:
        return "https://google.com";
    }
  };

  const generateQRCode = async () => {
    setLoading(true);
    const textToEncode = getQRContent();
    try {
      // @ts-ignore
      const qr = window.qrcode(0, "H");
      qr.addData(textToEncode);
      qr.make();
      const size = 380;
      const cells = qr.getModuleCount();
      const cellSize = Math.floor(size / cells);
      const canvas = document.createElement("canvas");
      const padding = qrMargin * cellSize;
      canvas.width = size + padding * 2;
      canvas.height = size + padding * 2;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = qrColorLight;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = qrColorDark;
      for (let row = 0; row < cells; row++) {
        for (let col = 0; col < cells; col++) {
          if (qr.isDark(row, col)) {
            ctx.fillRect(col * cellSize + padding, row * cellSize + padding, cellSize, cellSize);
          }
        }
      }
      setQrImage(canvas.toDataURL("image/png"));
    } catch (err) {
      console.error("Error generating QR code:", err);
    } finally {
      setLoading(false);
    }
  };

  // Sincronizar color de QR cuando cambia el acento de la tarjeta
  useEffect(() => {
    if (cardData.accentColor && qrColorDark !== "#000000") {
      setQrColorDark(cardData.accentColor);
    }
  }, [cardData.accentColor]);

  // Regenerar QR cuando cambien las configuraciones o datos
  useEffect(() => {
    generateQRCode();
  }, [qrType, customText, qrColorDark, qrColorLight, qrMargin, cardData]);

  const downloadQR = () => {
    if (!qrImage) return;
    const downloadLink = document.createElement("a");
    downloadLink.href = qrImage;
    downloadLink.download = `QR_${cardData.businessName.replace(/\s+/g, "_") || "empresa"}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const copyUrl = () => {
    const url = getQRContent();
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Configuration column (7 cols) */}
      <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl space-y-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <QrCode className="w-5 h-5 text-rose-500" />
            Configurar Código QR Dinámico
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Los códigos QR dinámicos se pueden personalizar estéticamente y dirigen a distintas acciones para tu empresa.
          </p>
        </div>

        {/* QR Content Types selectors */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            1. ¿A dónde dirigirá este Código QR?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Interactive Card link option */}
            <button
              onClick={() => setQrType("interactive-link")}
              className={`p-3 text-left rounded-xl border text-xs font-medium cursor-pointer transition-all flex items-start gap-3 ${
                qrType === "interactive-link"
                  ? "border-rose-500 bg-rose-500/5 text-rose-600 dark:text-rose-400"
                  : "border-slate-200 dark:border-zinc-800 bg-transparent hover:bg-slate-50 dark:hover:bg-zinc-800/40 text-slate-700 dark:text-slate-300"
              }`}
            >
              <Sparkles className="w-4.5 h-4.5 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Tu Tarjeta Digital Interactiva</span>
                <span className="text-[10px] opacity-75 leading-tight block mt-0.5">
                  El cliente escaneará para abrir tu tarjeta digital con todos tus botones interactivos en su móvil.
                </span>
              </div>
            </button>

            {/* vCard Option */}
            <button
              onClick={() => setQrType("vcard")}
              className={`p-3 text-left rounded-xl border text-xs font-medium cursor-pointer transition-all flex items-start gap-3 ${
                qrType === "vcard"
                  ? "border-purple-500 bg-purple-500/5 text-purple-600 dark:text-purple-400"
                  : "border-slate-200 dark:border-zinc-800 bg-transparent hover:bg-slate-50 dark:hover:bg-zinc-800/40 text-slate-700 dark:text-slate-300"
              }`}
            >
              <UserPlus className="w-4.5 h-4.5 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">vCard (Guardar Contacto Directo)</span>
                <span className="text-[10px] opacity-75 leading-tight block mt-0.5">
                  Añade instantáneamente tu nombre, móvil y correo en la agenda del cliente al escanear.
                </span>
              </div>
            </button>

            {/* WA link option */}
            <button
              onClick={() => setQrType("whatsapp")}
              className={`p-3 text-left rounded-xl border text-xs font-medium cursor-pointer transition-all flex items-start gap-3 ${
                qrType === "whatsapp"
                  ? "border-emerald-500 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400"
                  : "border-slate-200 dark:border-zinc-800 bg-transparent hover:bg-slate-50 dark:hover:bg-zinc-800/40 text-slate-700 dark:text-slate-300"
              }`}
            >
              <MessageSquare className="w-4.5 h-4.5 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Chat Directo WhatsApp</span>
                <span className="text-[10px] opacity-75 leading-tight block mt-0.5">
                  El cliente escaneará para abrir un mensaje redactado automáticamente en tu chat.
                </span>
              </div>
            </button>

            {/* Custom URL Option */}
            <button
              onClick={() => setQrType("custom")}
              className={`p-3 text-left rounded-xl border text-xs font-medium cursor-pointer transition-all flex items-start gap-3 ${
                qrType === "custom"
                  ? "border-blue-500 bg-blue-500/5 text-blue-600 dark:text-blue-400"
                  : "border-slate-200 dark:border-zinc-800 bg-transparent hover:bg-slate-50 dark:hover:bg-zinc-800/40 text-slate-700 dark:text-slate-300"
              }`}
            >
              <Link className="w-4.5 h-4.5 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Sitio Web Personalizado</span>
                <span className="text-[10px] opacity-75 leading-tight block mt-0.5">
                  Elige cualquier enlace de tus redes, menús digitales, catálogos o portafolios.
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Custom Input for general link */}
        {qrType === "custom" && (
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-zinc-800 space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Enlace del Código QR</label>
            <input
              type="url"
              placeholder="https://tuempresa.com/catalogo"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              className="w-full text-xs p-3 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500"
            />
          </div>
        )}

        {/* QR Customizations Styling */}
        <div className="border-t border-slate-100 dark:border-zinc-800/80 pt-5 space-y-4">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            2. Personalización Visual del Códgo QR
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Color Picks */}
            <div>
              <label className="text-[11px] block font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                Color del Módulo (Oscuro)
              </label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={qrColorDark}
                  onChange={(e) => setQrColorDark(e.target.value)}
                  className="w-8 h-8 rounded-md border border-slate-300 cursor-pointer overflow-hidden p-0"
                />
                <input
                  type="text"
                  value={qrColorDark}
                  onChange={(e) => setQrColorDark(e.target.value)}
                  className="text-xs p-1.5 w-24 rounded border border-slate-200 dark:border-zinc-700 bg-transparent text-slate-700 dark:text-slate-300"
                />
                <button 
                  onClick={() => setQrColorDark(cardData.accentColor)}
                  className="text-[10px] text-zinc-500 underline cursor-pointer"
                >
                  Usar Acento
                </button>
              </div>
            </div>

            <div>
              <label className="text-[11px] block font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                Color del Fondo (Claro)
              </label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={qrColorLight}
                  onChange={(e) => setQrColorLight(e.target.value)}
                  className="w-8 h-8 rounded-md border border-slate-300 cursor-pointer overflow-hidden p-0"
                />
                <input
                  type="text"
                  value={qrColorLight}
                  onChange={(e) => setQrColorLight(e.target.value)}
                  className="text-xs p-1.5 w-24 rounded border border-slate-200 dark:border-zinc-700 bg-transparent text-slate-700 dark:text-slate-300"
                />
              </div>
            </div>
          </div>

          {/* Margen */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span className="font-medium text-slate-600 dark:text-slate-400">Margen del QR (Padding)</span>
              <span className="font-mono text-zinc-500">{qrMargin}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="6"
              step="1"
              value={qrMargin}
              onChange={(e) => setQrMargin(parseInt(e.target.value))}
              className="w-full accent-rose-500 h-1.5 rounded-lg bg-zinc-200 dark:bg-zinc-800 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Preview and Download column (5 cols) */}
      <div className="lg:col-span-5 flex flex-col items-center">
        <div className="w-full bg-slate-950 rounded-3xl p-6 border border-slate-800 shadow-2xl flex flex-col items-center text-center">
          <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 mb-6 block">
            VISTA PREVIA DE QR DINÁMICO
          </span>

          {/* QR Code Container styled with premium subtle shine */}
          <div className="relative p-6 bg-white rounded-3xl shadow-2xl border border-slate-800/40 flex items-center justify-center max-w-[280px] aspect-square w-full">
            {loading ? (
              <div className="flex flex-col items-center gap-2">
                <RefreshCw className="w-8 h-8 animate-spin text-rose-500" />
                <span className="text-zinc-500 text-xs font-mono">Generando...</span>
              </div>
            ) : qrImage ? (
              <img 
                src={qrImage} 
                alt="Código QR Generado" 
                className="w-full h-full object-contain rounded-xl"
              />
            ) : (
              <span className="text-zinc-400 text-xs">Aguardando contenido...</span>
            )}
            
            {/* Center QR Badge mock */}
            {!loading && qrImage && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md border border-slate-100">
                <QrCode className="w-5 h-5" style={{ color: qrColorDark }} />
              </div>
            )}
          </div>

          <div className="mt-6 w-full space-y-4">
            <p className="text-xs text-zinc-400 font-sans leading-relaxed px-2">
              {qrType === "interactive-link" && "✦ QR escaneable que redirige directamente a tu Micrositio de Tarjeta de Presentación Interactiva."}
              {qrType === "vcard" && "✦ Escanea este código para agregar tus datos de contacto directamente en la agenda de tu cliente."}
              {qrType === "whatsapp" && "✦ Abre de inmediato el chat de WhatsApp corporativo con un mensaje pre-redactado."}
              {qrType === "custom" && `✦ Código QR personalizado apuntando a la dirección URL especificada.`}
            </p>

            {/* Quick URL actions display */}
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-left flex items-center justify-between gap-3 overflow-hidden">
              <div className="truncate text-xs font-mono text-zinc-400 flex-1 pr-2">
                {getQRContent()}
              </div>
              <button
                onClick={copyUrl}
                className="p-1 px-2.5 rounded-md bg-white/5 hover:bg-white/10 active:bg-white/15 text-white/90 text-[10px] font-medium shrink-0 cursor-pointer transition-all flex items-center gap-1.5"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>Copiado</span>
                  </>
                ) : (
                  <>
                    <Link className="w-3 h-3 text-rose-400" />
                    <span>Copiar URL</span>
                  </>
                )}
              </button>
            </div>

            <button
              onClick={downloadQR}
              className="w-full py-3.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 text-white bg-gradient-to-r from-rose-500 to-pink-600 shadow-md hover:shadow-xl transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Descargar Código QR (PNG)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
