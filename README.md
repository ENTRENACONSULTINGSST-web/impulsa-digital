# IMPULSA DIGITAL — Tarjeta de Presentación Interactiva
**Entrena Consulting SAS**

## Requerimientos cubiertos
| # | Requerimiento | Solución |
|---|---|---|
| 1 | Usarse en móvil | Diseño responsive mobile-first con Tailwind |
| 2 | Compartir tarjeta | Botón "Compartir por WhatsApp" genera URL con tarjeta codificada en Base64. QR descargable. |
| 3 | URL de GitHub | Deploy automático a GitHub Pages con GitHub Actions |
| 4 | Código técnico y simple | SPA pura en React + Vite. Sin backend. Sin base de datos. |

## Instalación local

```bash
npm install
npm run dev
# Abre http://localhost:5173/impulsa-digital/
```

## Deploy en GitHub Pages

### Paso 1 — Crear repositorio
```
https://github.com/new → nombre: impulsa-digital
```

### Paso 2 — Ajustar nombre del repo en vite.config.ts
```ts
base: '/impulsa-digital/',   // ← nombre exacto de tu repo
```

### Paso 3 — Subir código
```bash
git init
git add .
git commit -m "feat: tarjeta digital Entrena Consulting"
git remote add origin https://github.com/TU_USUARIO/impulsa-digital.git
git push -u origin main
```

### Paso 4 — Activar GitHub Pages
GitHub → Settings → Pages → Source: **GitHub Actions**

### Paso 5 — URL pública
```
https://TU_USUARIO.github.io/impulsa-digital/
```

## Cómo funciona el compartir
1. Editor llena los datos → botón **Compartir por WhatsApp** copia la URL
2. La URL incluye `?card=BASE64` con todos los datos de la tarjeta
3. Cualquier persona que abra ese enlace ve la tarjeta en modo micrositio móvil
4. El QR también apunta a esa misma URL

## Estructura
```
src/
├── components/
│   ├── InteractiveCard.tsx   # Tarjeta móvil interactiva
│   ├── QRCodeTab.tsx         # Generador de QR
│   └── OptimizedImageTab.tsx # Exportador de imagen PNG
├── types/index.ts            # CompanyCardData, THEME_PRESETS
├── utils/index.ts            # serializeCard, deserializeCard
├── App.tsx                   # Editor principal
└── main.tsx
```

## Sin servidor (Gemini IA opcional)
Esta versión no requiere servidor ni API keys.  
Si deseas restaurar el asistente IA de Gemini, agrega `server.ts` y las variables de entorno.
