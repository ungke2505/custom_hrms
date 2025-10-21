// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import path from 'path'

// export default defineConfig({
//   base: '/custom_hrms/',
//   plugins: [react()],
//   resolve: {
//     alias: {
//       '@': path.resolve(__dirname, 'src'),
//     },
//   },
//   server: {
//     host: '0.0.0.0',
//     port: 5173,
//     allowedHosts: ['erpnext.gembirahouseware.com'],
//     proxy: {
//       '/api': {
//         target: 'https://erpnext.gembirahouseware.com',
//         changeOrigin: true,
//         secure: false,
//       },
//       '/ngrok': {
//         target: 'https://erpnext.gembirahouseware.com',
//         changeOrigin: true,
//         secure: false,
//         rewrite: (path) => path.replace(/^\/ngrok/, ''),
//       },
//     },
//   },
// })

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  base: '/custom_hrms/',   // ✅ sangat penting untuk PWA & refresh URL
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: ['erpnext.gembirahouseware.com'],
    proxy: {
      '/api': {
        target: 'https://erpnext.gembirahouseware.com', // ✅ arahkan ke server ERPNext production
        changeOrigin: true,
        secure: true,
      },
    },
  },
  build: {
    outDir: 'dist',
  },
})
