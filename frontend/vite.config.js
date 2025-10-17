// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import path from 'path'

// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     alias: {
//       '@': path.resolve(__dirname, 'src'),
//     },
//   },
//   server: {
//     host: '0.0.0.0',
//     port: 5173,
//     allowedHosts: [
//       '7b96968f919e.ngrok-free.app',
//     ],
//     proxy: {
//       '/api': {
//         target: 'http://19.77.27.233',
//         changeOrigin: true,
//         secure: false,
//       },
//       '/ngrok': {
//         target: 'https://7b96968f919e.ngrok-free.app',
//         changeOrigin: true,
//         secure: false,
//         rewrite: (path) => path.replace(/^\/ngrok/, ''),
//       },
//     },
//   },
// })

// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import path from "path";
// import { VitePWA } from "vite-plugin-pwa";

// export default defineConfig({
//   plugins: [
//     react(),
//     // 🪄 Tambahkan plugin PWA
//     VitePWA({
//       registerType: "autoUpdate",
//       includeAssets: ["favicon.svg", "favicon.ico", "robots.txt", "apple-touch-icon.png", "src/assets/img/pos.png"],
//       manifest: {
//         name: "Absensi Gembira Houseware",
//         short_name: "Absensi GH",
//         description: "Aplikasi Absensi Karyawan Gembira Houseware",
//         theme_color: "#ffffff",
//         background_color: "#ffffff",
//         display: "standalone",
//         orientation: "portrait",
//         start_url: "/",
//         icons: [
//           {
//             src: "/src/assets/img/pos.png",
//             sizes: "192x192",
//             type: "image/png",
//           },
//           {
//             src: "/src/assets/img/pos.png",
//             sizes: "512x512",
//             type: "image/png",
//           },
//         ],
//       },
//       workbox: {
//         runtimeCaching: [
//           {
//             urlPattern: ({ url }) => url.origin === self.origin,
//             handler: "CacheFirst",
//             options: {
//               cacheName: "static-resources",
//               expiration: {
//                 maxEntries: 50,
//                 maxAgeSeconds: 60 * 60 * 24 * 30, // 30 hari
//               },
//             },
//           },
//         ],
//       },
//     }),
//   ],

//   base: "./", // penting untuk load lokal via ngrok atau ERPNext

//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "src"),
//     },
//   },

//   server: {
//     host: "0.0.0.0",
//     port: 5173,
//     allowedHosts: ["df32133a4515.ngrok-free.app"],
//     proxy: {
//       "/api": {
//         target: "http://19.77.27.233",
//         changeOrigin: true,
//         secure: false,
//       },
//       "/ngrok": {
//         target: "https://df32133a4515.ngrok-free.app",
//         changeOrigin: true,
//         secure: false,
//         rewrite: (path) => path.replace(/^\/ngrok/, ""),
//       },
//     },
//   },
// });


import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  base: '/custom_hrms/', // ⬅️ tambahkan ini
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
        target: 'http://19.77.27.233',
        changeOrigin: true,
        secure: false,
      },
      '/ngrok': {
        target: 'https://erpnext.gembirahouseware.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/ngrok/, ''),
      },
    },
  },
})
