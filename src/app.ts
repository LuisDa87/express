/**
 * app.ts — Punto de entrada del servidor Express (ESM / NodeNext)
 *
 * Responsabilidades:
 * - Cargar variables de entorno (dotenv)
 * - Crear la instancia de Express
 * - Configurar middlewares globales (CORS, JSON parser)
 * - Inicializar y montar rutas de forma dinámica (initRoutes + rootRouter)
 * - Exponer endpoints de salud/prueba (ej: /ping)
 * - Levantar el servidor en el puerto indicado por PORT o 3001
 *
 * Flujo:
 *  1) Se importan `initRoutes` y `router` desde `src/routes/index.ts`
 *  2) `await initRoutes()` recorre la carpeta `routes/`, importa cada archivo
 *     y arma un `Router` raíz (rootRouter) con subrutas según el nombre del archivo
 *     (p. ej., books.ts => /books).
 *  3) Se monta `rootRouter` en `app.use('/', rootRouter)`.
 *  4) Se arranca `app.listen(PORT)`.
 *
 * Notas:
 * - Proyecto en modo ESM (package.json: "type": "module", tsconfig: NodeNext).
 * - Importaciones relativas deben incluir extensión `.js` al compilar con NodeNext.
 * - Si agregas middlewares/errores globales, colócalos antes de `listen()`.
 */


import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { router as rootRouter, initRoutes } from './routes/index.js'  // <- .js

const app = express()
const PORT = process.env.PORT ?? 3001

app.use(cors())
app.use(express.json())

// Inicializa rutas dinámicas
await initRoutes()
app.use('/', rootRouter)

app.get('/ping', (_req, res) => res.send('pong'))

app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`)
})
