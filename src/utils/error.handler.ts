/**
 * utils/error.handler.ts — Normaliza respuestas de error HTTP
 *
 * Responsabilidad:
 * - Responder de forma consistente ante errores de negocio/técnicos.
 * - Centralizar logging y estructura de salida.
 */

import type { Response } from 'express'
import type { HttpErrorStatus } from '../types/types.js'

export function handleHttp(
  res: Response,
  message: string,
  status: HttpErrorStatus = 500,
  error?: unknown
) {
  // Log consolidado para debugging/observabilidad
  if (error) console.error('[ERROR]', message, error)

  return res.status(status).json({
    ok: false,
    message,
    // En prod podrías ocultar `details`
    details: error instanceof Error ? error.message : error ?? null
  })
}
