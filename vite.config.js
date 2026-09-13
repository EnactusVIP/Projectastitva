import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

function localApiPlugin() {
  return {
    name: 'local-api-handler',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        // Support both /api/community-signup and /project-astitva/api/community-signup
        if (req.url.startsWith('/api/community-signup') || req.url.startsWith('/project-astitva/api/community-signup')) {
          try {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', async () => {
              try {
                req.body = body ? JSON.parse(body) : {};
              } catch {
                req.body = body;
              }

              res.status = (code) => {
                res.statusCode = code;
                return res;
              };
              res.json = (data) => {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(data));
                return res;
              };

              const { default: handler } = await import('./api/community-signup.js');
              await handler(req, res);
            });
          } catch (err) {
            console.error('Local API error:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, message: err.message }));
          }
        } else {
          next();
        }
      });
    },
  };
}

export default defineConfig({
  base: process.env.VERCEL ? '/' : '/project-astitva/',
  plugins: [react(), localApiPlugin()],
  server: {
    host: true,
    cors: true,
    allowedHosts: true,
  },
})
