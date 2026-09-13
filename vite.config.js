import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

function localApiPlugin() {
  return {
    name: 'local-api-handler',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        // Strip query parameters for route matching
        const pathname = req.url.split('?')[0];
        if (pathname === '/api/community-signup' || pathname === '/project-astitva/api/community-signup') {
          try {
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

            if (req.method === 'GET') {
              await handler(req, res);
              return;
            }

            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', async () => {
              try {
                req.body = body ? JSON.parse(body) : {};
              } catch {
                req.body = body;
              }
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

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  Object.assign(process.env, env);

  return {
    base: process.env.VERCEL ? '/' : '/project-astitva/',
    plugins: [react(), localApiPlugin()],
    server: {
      host: true,
      cors: true,
      allowedHosts: true,
    },
  };
})
