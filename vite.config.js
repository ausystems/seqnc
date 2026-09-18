import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';

/* In dev, serve the static demo apps under public/demo/<name>/ at their
   folder URL, the way the production host does. */
function demoDirs() {
  return {
    name: 'seqnc-demo-dirs',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = (req.url || '').split('?')[0];
        /* dev only: the page posts rendered poster stills here and they land in public/ */
        if (url === '/__poster' && req.method === 'POST') {
          let body = '';
          req.on('data', (c) => { body += c; });
          req.on('end', () => {
            try {
              const { name, data } = JSON.parse(body);
              if (!/^[a-z0-9-]+\.(webp|png|jpg)$/.test(name)) throw new Error('bad name');
              const b64 = data.replace(/^data:[^,]+,/, '');
              fs.writeFileSync(path.join(server.config.publicDir, name), Buffer.from(b64, 'base64'));
              res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify({ ok: true, name }));
            } catch (e) { res.statusCode = 400; res.end(String(e && e.message)); }
          });
          return;
        }
        if (/^\/demo\/[a-z]+\/?$/.test(url)) {
          const dir = url.replace(/\/$/, '');
          if (!url.endsWith('/')) { res.statusCode = 302; res.setHeader('Location', dir + '/'); res.end(); return; }
          const file = path.join(server.config.publicDir, dir, 'index.html');
          if (fs.existsSync(file)) { res.setHeader('Content-Type', 'text/html'); res.end(fs.readFileSync(file)); return; }
        }
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), demoDirs()],
  server: { port: Number(process.env.PORT) || 5173, strictPort: !!process.env.PORT },
  preview: { port: Number(process.env.PORT) || 4173 },
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 600, /* three loads in its own chunk on demand */
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three')) return 'three';
          if (id.includes('node_modules/gsap')) return 'gsap';
          if (id.includes('node_modules/react')) return 'react';
          return undefined;
        },
      },
    },
  },
});
