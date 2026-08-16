import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    // Écoute sur localhost par défaut. `host: true` exposerait le serveur
    // de dev à tout le réseau local (wifi partagé, coworking).
    // Pour tester depuis un téléphone : EXPOSE_LAN=1 npm run dev
    host: process.env.EXPOSE_LAN === '1'
  }
})
