/**
 * controllers/users.ts — Orquesta la capa HTTP para recursos de usuarios.
 * Válida parámetros y delega en la capa de servicios antes de responder.
 */
import type { Request, Response } from 'express'
import {
  getUsersService,
  getUserByDocumentService,
  createUserService,
  updateUserByDocumentService,
  deleteUserByDocumentService
} from '../services/user.services.js'
import { handleHttp } from '../utils/error.handler.js'
import type { HttpErrorStatus } from '../types/types.js'

/*
   getUsers — Maneja `GET /users` devolviendo el listado completo del servicio.
   Ejemplo: GET http://localhost:3001/users
*/
export const getUsers = async (_req: Request, res: Response) => {
  let statusCode: HttpErrorStatus = 500
  try {
    const users = await getUsersService()
    return res.json(users)
  } catch (error) {
    return handleHttp(res, 'Error consultando usuarios', statusCode, error)
  }
}

/*
   getUserByDocument — Maneja `GET /users/:document` validando el parámetro.
   Responde 400 cuando falta, 404 si no existe, o el usuario cuando lo encuentra.
   Ejemplo: GET http://localhost:3001/users/1001
*/
export const getUserByDocument = async (req: Request, res: Response) => {
  let statusCode: HttpErrorStatus = 400
  try {
    const { document } = req.params
    if (!document) {
      return handleHttp(res, 'document es requerido', statusCode)
    }

    const user = await getUserByDocumentService(document)
    if (!user) {
      statusCode = 404
      return handleHttp(res, `Usuario ${document} no encontrado`, statusCode)
    }

    return res.json(user)
  } catch (error) {
    statusCode = 500
    return handleHttp(res, 'Error obteniendo usuario', statusCode, error)
  }
}

/**
 * createUser — Maneja `POST /users` validando el cuerpo requerido.
 * Ejemplo: POST http://localhost:3001/users
 */
export const createUser = async (req: Request, res: Response) => {
  let statusCode: HttpErrorStatus = 400
  try {
    const { document, name, email, phone, address } = req.body ?? {}
    if (!document || !name || !email || !phone || !address) {
      return handleHttp(res, 'document, name, email, phone y address son requeridos', statusCode)
    }

    const created = await createUserService({ document, name, email, phone, address })
    if (!created) {
      statusCode = 409
      return handleHttp(res, `Usuario ${document} ya existe`, statusCode)
    }

    return res.status(201).json({
      ok: true,
      message: 'Usuario creado',
      data: created
    })
  } catch (error) {
    statusCode = 500
    return handleHttp(res, 'Error creando usuario', statusCode, error)
  }
}

/**
 * updateUserByDocument — Maneja `PUT /users/:document` reemplazando datos completos.
 * Ejemplo: PUT http://localhost:3001/users/1001
 */
export const updateUserByDocument = async (req: Request, res: Response) => {
  let statusCode: HttpErrorStatus = 400
  try {
    const { document } = req.params
    const { name, email, phone, address } = req.body ?? {}

    if (!document) {
      return handleHttp(res, 'document es requerido', statusCode)
    }
    if (!name || !email || !phone || !address) {
      return handleHttp(res, 'name, email, phone y address son requeridos', statusCode)
    }

    const updated = await updateUserByDocumentService(document, {
      document,
      name,
      email,
      phone,
      address
    })
    if (!updated) {
      statusCode = 404
      return handleHttp(res, `Usuario ${document} no encontrado`, statusCode)
    }

    return res.json({
      ok: true,
      message: `Usuario ${document} actualizado`,
      data: updated
    })
  } catch (error) {
    statusCode = 500
    return handleHttp(res, 'Error actualizando usuario', statusCode, error)
  }
}

/**
 * deleteUserByDocument — Maneja `DELETE /users/:document` eliminando el recurso.
 * Ejemplo: DELETE http://localhost:3001/users/1001
 */
export const deleteUserByDocument = async (req: Request, res: Response) => {
  let statusCode: HttpErrorStatus = 400
  try {
    const { document } = req.params
    if (!document) {
      return handleHttp(res, 'document es requerido', statusCode)
    }

    const deleted = await deleteUserByDocumentService(document)
    if (!deleted) {
      statusCode = 404
      return handleHttp(res, `Usuario ${document} no encontrado`, statusCode)
    }

    return res.json({
      ok: true,
      message: `Usuario ${document} eliminado`,
      data: deleted
    })
  } catch (error) {
    statusCode = 500
    return handleHttp(res, 'Error eliminando usuario', statusCode, error)
  }
}
