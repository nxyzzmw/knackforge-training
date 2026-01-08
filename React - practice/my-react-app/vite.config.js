import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: "/kf-training/React%20-%20practice/my-react-app/",
  plugins: [react()],
})
