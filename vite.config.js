import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// `base` is set for GitHub Pages project-site hosting (https://<user>.github.io/babyclerk/).
// If you deploy to Vercel/Netlify or a custom domain, change this back to '/'.
export default defineConfig({
  plugins: [react()],
  base: process.env.DEPLOY_TARGET === 'gh-pages' ? '/babyclerk/' : '/',
})
