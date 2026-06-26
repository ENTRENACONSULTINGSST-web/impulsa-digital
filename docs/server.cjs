var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");
var import_dotenv = __toESM(require("dotenv"), 1);
import_dotenv.default.config();
var ai = new import_genai.GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build"
    }
  }
});
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use(import_express.default.json());
  app.post("/api/generate-slogan", async (req, res) => {
    try {
      const { businessType, businessName, keywords, tone } = req.body;
      if (!businessType || !businessName) {
        res.status(400).json({ error: "Faltan datos obligatorios (Nombre y Tipo de negocio)." });
        return;
      }
      const prompt = `Act\xFAa como un experto en copy y branding para tarjetas de presentaci\xF3n digitales interactivas optimizadas para redes sociales y WhatsApp.
Nombre de la Empresa: "${businessName}"
Giro / Tipo de Negocio: "${businessType}"
Palabras Clave: "${keywords || "general"}"
Tono: "${tone || "profesional"}"

Genera exactamente el siguiente contenido adaptado para m\xF3vil y compatible con WhatsApp:
1. 3 opciones de slogans cortos de alto impacto (m\xE1ximo 8 palabras por opci\xF3n).
2. 3 opciones de biograf\xEDas de marca cortas (m\xE1ximo 120 caracteres, ideal para redes sociales o estados de WhatsApp).
3. 2 sugerencias de llamados a la acci\xF3n (CTA) din\xE1micos para el bot\xF3n de WhatsApp principal (ejemplo: "Escr\xEDbenos por WhatsApp \u{1F4F2}" o "Agendar asesor\xEDa gratis \u{1F91D}").

Devuelve la respuesta strictly en formato JSON puro, sin bloques markdown de tipo \`\`\`json. Estructura exacta:
{
  "slogans": ["opcion1", "opcion2", "opcion3"],
  "bios": ["opcion1", "opcion2", "opcion3"],
  "ctas": ["opcion1", "opcion2"]
}`;
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });
      const responseText = response.text || "{}";
      const cleaned = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
      res.json(JSON.parse(cleaned));
    } catch (error) {
      console.error("Error generating slogan:", error);
      res.status(500).json({ error: "Error al generar slogans con IA." });
    }
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor iniciado en puerto ${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
