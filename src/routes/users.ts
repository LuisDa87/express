/**
 * routes/users.ts — Define los endpoints HTTP expuestos bajo `/users`.
 * Cada handler delega en el controlador correspondiente para mantener el router liviano.
 */
import { Router, type Request, type Response } from 'express'
import {
  getUsers,
  getUserByDocument,
  createUser,
  updateUserByDocument,
  deleteUserByDocument
} from '../controllers/users.js'

export const router = Router()

// GET /users => listado completo. Ej: GET http://localhost:3001/users
router.get('/', (req: Request, res: Response) => { void getUsers(req, res) })

// GET /users/:document => usuario puntual por documento. Ej: GET http://localhost:3001/users/1001
router.get('/:document', (req: Request, res: Response) => { void getUserByDocument(req, res) })

// POST /users => crear nuevo usuario. Ej: POST http://localhost:3001/users
router.post('/', (req: Request, res: Response) => { void createUser(req, res) })

// PUT /users/:document => actualizar datos. Ej: PUT http://localhost:3001/users/1001
router.put('/:document', (req: Request, res: Response) => { void updateUserByDocument(req, res) })

// DELETE /users/:document => elimina por documento. Ej: DELETE http://localhost:3001/users/1001
router.delete('/:document', (req: Request, res: Response) => { void deleteUserByDocument(req, res) })
