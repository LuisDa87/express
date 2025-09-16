/**
 * controllers/books.ts — Lógica de orquestación HTTP para Books
 *
 * Responsabilidad:
 * - Recibir Request/Response.
 * - Invocar servicios de dominio (getBooksService).
 * - Manejar errores con handleHttp.
 *
 * Nota:
 * - Este controlador NO sabe “de dónde” vienen los datos (JSON, DB, API).
 *   Solo orquesta la operación para la capa HTTP.
 */

import type { Request, Response } from 'express'
import { handleHttp } from '../utils/error.handler.js'
import type { HttpErrorStatus } from '../types/types.js'
import { getBooksService, getBookByIdService } from '../services/book.services.js'
import { deleteBookByIdService, createBookService, replaceBookByIdService } from '../services/book.services.js'

export const getBooks = async (_req: Request, res: Response) => {
  let statusCode: HttpErrorStatus = 500
  try {
    const response = await getBooksService()
    return res.json(response)
  } catch (err) {
    return handleHttp(res, 'Something crashed your app', statusCode, err)
  }
}

/**
 * GET /books/:id — retorna un libro por id
 */
export const getBookById = async (req: Request, res: Response) => {
  let statusCode: HttpErrorStatus = 404
  try {
    const { id } = req.params
    if (!id) {
      statusCode = 400
      return handleHttp(res, 'id es requerido', statusCode)
    }

    const book = await getBookByIdService(id)
    if (!book) {
      statusCode = 404
      return handleHttp(res, `Book ${id} no encontrado`, statusCode)
    }

    return res.json(book)
  } catch (err) {
    statusCode = 500
    return handleHttp(res, 'Something crashed your app', statusCode, err)
  }
}

export const deleteBookById = async (req: Request, res: Response) => {
  let statusCode: HttpErrorStatus = 404
  try {
    const { id } = req.params
    if (!id) {
      statusCode = 400
      return handleHttp(res, 'id es requerido', statusCode)
    }

    const deleted = await deleteBookByIdService(id)
    if (!deleted) {
      statusCode = 404
      return handleHttp(res, `Book ${id} no encontrado`, statusCode)
    }

    return res.status(200).json({
      ok: true,
      message: `Book ${id} eliminado`,
      data: deleted
    })
  } catch (err) {
    statusCode = 500
    return handleHttp(res, 'Something crashed your app', statusCode, err)
  }
}

/*
    createBook (POST /books)
    
    Crea un libro con los datos enviados en el body
    Body esperado (JSON):
    {
      "author": "string",
      "name": "string",
      "owner": "string"
    }
   
    Validación mínima:
    - Si falta algún campo, responde 400
    - Si todo viene bien, llama al service, guarda y responde 201 + el libro creado
*/
export const createBook = async (req: Request, res: Response) => {
  // status por defecto si algo falla por datos de entrada
  let statusCode: HttpErrorStatus = 400
  try {
    // 1 Extraer datos del body (si no hay body, req.body será undefined)
    const { author, name, owner } = req.body ?? {}

    // 2 Validación mínima para evitar errores tontos
    if (!author || !name || !owner) {
      return handleHttp(res, 'author, name y owner son requeridos', statusCode)
    }

    // 3 Llamar al servicio que guarda en el JSON
    const created = await createBookService({ author, name, owner })

    // 4 Responder 201 (creado) con el libro nuevo
    return res.status(201).json({
      ok: true,
      message: 'Book creado',
      data: created
    })
  } catch (err) {
    // Si algo inesperado falla, devolvemos 500
    statusCode = 500
    return handleHttp(res, 'Error creando libro', statusCode, err)
  }
}

/*
    updateBookById (PUT /books/:id)
    
    Reemplaza un libro existente
    Body esperado (JSON):
    {
      "author": "string",
      "name": "string",
      "owner": "string"
    }
    Validación mínima si falta algún campo, 400
    Si no existe el libro, 404
*/

export const updateBookById = async (req: Request, res: Response) => {
  let statusCode: HttpErrorStatus = 400
  try {
    const { id } = req.params
    const { author, name, owner } = req.body ?? {}

    if (!id) {
      return handleHttp(res, 'id es requerido', statusCode)
    }
    if (!author || !name || !owner) {
      return handleHttp(res, 'author, name y owner son requeridos', statusCode)
    }

    const updated = await replaceBookByIdService(id, { author, name, owner })
    if (!updated) {
      statusCode = 404
      return handleHttp(res, `Book ${id} no encontrado`, statusCode)
    }

    return res.status(200).json({
      ok: true,
      message: `Book ${id} actualizado`,
      data: updated
    })
  } catch (err) {
    statusCode = 500
    return handleHttp(res, 'Error actualizando libro', statusCode, err)
  }
}
