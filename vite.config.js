import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// `base` is set for GitHub Pages project-site hosting (https://<user>.github.io/babyclerk/).
// If you deploy to Vercel/Netlify or a custom domain, change this back to '/'.
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['apple-touch-icon.png'],
      manifest: {
        name: 'BabyClerk — Clerkship Study',
        short_name: 'BabyClerk',
        description:
          'Clerkship study companion — flashcards, viva drills, MCQs, and Queen’s rotation guides. Works offline.',
        theme_color: '#0f766e',
        background_color: '#f7f9fa',
        display: 'standalone',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-maskable-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
  base: process.env.DEPLOY_TARGET === 'gh-pages' ? '/babyclerk/' : '/',
})
