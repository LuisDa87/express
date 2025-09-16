/**
 * routes/index.ts — Cargador dinámico de rutas
 *
 * Objetivo:
 * - Autodescubrir y montar módulos de ruta ubicados en `src/routes/`.
 * - Cada archivo de ruta debe exportar `export const router = Router()`.
 * - El nombre de archivo define el path base (books.ts => /books).
 *
 * ¿Cómo funciona?
 * - Usa `import.meta.url` + `fileURLToPath` para obtener __dirname en ESM.
 * - Lee los archivos del directorio con `readdirSync(PATH_ROUTER)`.
 * - Ignora `index.ts` (este archivo) y filtra válidos.
 * - Hace `await import()` dinámico de cada módulo. Como estamos en ESM/NodeNext,
 *   construimos la URL con `pathToFileURL` y `join`.
 * - Verifica que el módulo exporte `router` y que sea una función (middleware).
 * - Monta cada router en `router.use('/<cleanName>', module.router)`.
 *
 * Ventajas:
 * - No necesitas registrar rutas a mano; solo crea el archivo en `routes/`.
 * - Mantiene el `app.ts` limpio y desacoplado de rutas específicas.
 *
 * Precauciones:
 * - Asegúrate de que cada archivo exporte exactamente `export const router = Router()`.
 * - Evita dejar archivos que no sean rutas (ej: .map, .d.ts) dentro de `routes/`.
 */


import { Router } from 'express'
import { readdirSync } from 'fs'
import { fileURLToPath, pathToFileURL } from 'url'
import { dirname, join } from 'path'

export const router = Router()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const PATH_ROUTER = join(__dirname)
const cleanFileName = (f: string) => f.split('.').shift()!

export async function initRoutes() {
  for (const fileName of readdirSync(PATH_ROUTER)) {
    const cleanName = cleanFileName(fileName)
    if (cleanName === 'index') continue

    const moduleUrl = pathToFileURL(join(PATH_ROUTER, fileName)).href
    const mod = await import(moduleUrl)

    // Asegura que exista y sea “middleware”
    const route = (mod.router ?? mod.default?.router)
    if (route && typeof route === 'function') {
      router.use(`/${cleanName}`, route)
    } else {
      console.warn(`⚠️  Saltando ${fileName}: no exporta 'router'`)
    }
  }
}

