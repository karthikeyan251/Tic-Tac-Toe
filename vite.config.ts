import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/Tic-Tac-Toe/',
  plugins: [react(), tailwindcss()],
  // @ts-ignore vitest config
  test: {
    globals: true,
    environment: 'jsdom',
  },
})

