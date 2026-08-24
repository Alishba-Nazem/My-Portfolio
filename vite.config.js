import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

/* Vercel runs everything in /api as a serverless function, but `vite dev` does not.
   Without this the chat widget hits Vite's SPA fallback, gets HTML back, and looks
   broken locally. This mounts the same handler on the dev server. */
function devApiRoutes(env) {
  return {
    name: 'dev-api-routes',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api/chat', async (req, res) => {
        // The handler reads process.env, so surface .env values to it in dev.
        if (env.GROQ_API_KEY) process.env.GROQ_API_KEY = env.GROQ_API_KEY

        try {
          const body = await new Promise((resolve) => {
            let raw = ''
            req.on('data', (c) => { raw += c })
            req.on('end', () => {
              try { resolve(raw ? JSON.parse(raw) : {}) } catch { resolve({}) }
            })
          })

          const { default: handler } = await server.ssrLoadModule('/api/chat.js')

          await handler({ method: req.method, body }, {
            status(code) { res.statusCode = code; return this },
            json(payload) {
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify(payload))
            },
          })
        } catch (err) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: err.message }))
        }
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return { plugins: [react(), devApiRoutes(env)] }
})
