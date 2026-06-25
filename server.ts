import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API para generación de slogans y CTA mediante Inteligencia Artificial
  app.post("/api/generate-slogan", async (req, res) => {
    try {
      const { businessType, businessName, keywords, tone } = req.body;
      if (!businessType || !businessName) {
        res.status(400).json({ error: "Faltan datos obligatorios (Nombre y Tipo de negocio)." });
        return;
      }

      const prompt = `Actúa como un experto en copy y branding para tarjetas de presentación digitales interactivas optimizadas para redes sociales y WhatsApp.
Nombre de la Empresa: "${businessName}"
Giro / Tipo de Negocio: "${businessType}"
Palabras Clave: "${keywords || "general"}"
Tono: "${tone || "profesional"}"

Genera exactamente el siguiente contenido adaptado para móvil y compatible con WhatsApp:
1. 3 opciones de slogans cortos de alto impacto (máximo 8 palabras por opción).
2. 3 opciones de biografías de marca cortas (máximo 120 caracteres, ideal para redes sociales o estados de WhatsApp).
3. 2 sugerencias de llamados a la acción (CTA) dinámicos para el botón de WhatsApp principal (ejemplo: "Escríbenos por WhatsApp 📲" o "Agendar asesoría gratis 🤝").

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
          responseMimeType: "application/json",
        }
      });

      const responseText = response.text || "{}";
      const cleaned = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
      res.json(JSON.parse(cleaned));
    } catch (error: any) {
      console.error("Error generating slogan:", error);
      res.status(500).json({ error: "Error al generar slogans con IA." });
    }
  });

  // Configuración de Vite/Static Files
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor iniciado en puerto ${PORT}`);
  });
}

startServer();
