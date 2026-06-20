import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    host: true,        // Expose on all network interfaces (LAN + any browser)
    port: 5555,
    strictPort: false, // Auto-find next port if 5173 is busy
    open: true         // Auto-open in browser on start
  }
})
