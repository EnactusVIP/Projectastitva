import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  base: process.env.VERCEL ? '/' : '/project-astitva/',
  plugins: [react()],
  server: {
    host: true,
    cors: true,
    allowedHosts: true,
  },
})
