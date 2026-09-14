import { defineConfig } from 'vite'
import angular from '@analogjs/vite-plugin-angular'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import fs from 'fs'

const dataDir = path.resolve(import.meta.dirname, '../../data')

export default defineConfig({
  plugins: [
    angular(),
    tailwindcss(),
    {
      name: 'serve-data',
      configureServer(server) {
        server.middlewares.use('/data', (req, res, next) => {
          const filePath = path.join(dataDir, req.url ?? '')
          fs.readFile(filePath, (err, data) => {
            if (err) return next()
            res.setHeader('Content-Type', 'application/json')
            res.end(data)
          })
        })
      },
    },
  ],
  resolve: {
    alias: { '@': path.resolve(import.meta.dirname, './src') },
  },
  server: { port: 5175 },
})
