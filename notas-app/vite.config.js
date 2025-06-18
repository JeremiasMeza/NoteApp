import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Configuración básica para Capacitor
  build: {
    // Configuración mínima pero efectiva
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false, // Desactivar sourcemaps por ahora
    target: 'es2015',
    
    // Configuración básica de rollup
    rollupOptions: {
      output: {
        manualChunks: undefined // Simplificar el chunking
      }
    }
  },
  
  // Servidor de desarrollo
  server: {
    host: true,
    port: 5173
  }
})