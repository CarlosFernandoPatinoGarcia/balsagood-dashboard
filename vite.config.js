import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  serverAllowedHosts: ['localhost', '127.0.0.1', '0.0.0.0', '192.168.1.63', '198.41.200.73']
})
