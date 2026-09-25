import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // GitHub Pages project site needs this base path
  base: process.env.GITHUB_PAGES === 'true' ? '/fear2safe-life-bridge/' : '/',
})
