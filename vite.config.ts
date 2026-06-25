import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Cambia 'impulsa-digital' por el nombre exacto de tu repositorio en GitHub
  base: '/impulsa-digital/',
});
