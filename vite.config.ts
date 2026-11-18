import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
export default defineConfig({plugins:[react(),VitePWA({registerType:'prompt',includeAssets:['icons/*.png','fonts/*.woff2','art/*.webp'],manifest:{name:'Lumio | لومیو',short_name:'Lumio',description:'A little paper world for daily habits',theme_color:'#fff9ee',background_color:'#fff9ee',display:'standalone',start_url:'/',scope:'/',icons:[{src:'/icons/lumio-192.png',sizes:'192x192',type:'image/png'},{src:'/icons/lumio-512.png',sizes:'512x512',type:'image/png'}]},workbox:{globPatterns:['**/*.{js,css,html,ico,png,svg,webp,woff2}'],maximumFileSizeToCacheInBytes:8000000}})]});
