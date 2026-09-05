import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        // three only loads when the depth field mounts; keep it out of the main chunk
        manualChunks(id) {
          if (id.includes('node_modules/three') || id.includes('three-lite')) return 'three';
          if (id.includes('node_modules/gsap')) return 'gsap';
          return undefined;
        },
      },
    },
  },
});
