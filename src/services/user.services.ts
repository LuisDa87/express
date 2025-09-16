/**
 * services/user.services.ts — Capa de acceso a datos para usuarios.
 * Lee y filtra el JSON en `models/users.json` para mantener la persistencia desacoplada.
 */
import { promises as fs } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import type { IUser } from '../interfaces/user.interfaces.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const usersFilePath = join(__dirname, '../models/users.json')

const readUsersFromFile = async (): Promise<IUser[]> => {
  const data = await fs.readFile(usersFilePath, 'utf-8')
  return JSON.parse(data) as IUser[]
}

const writeUsersToFile = async (users: IUser[]) => {
  await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), 'utf-8')
}

/**
 * getUsersService — Retorna todos los usuarios registrados en el JSON.
 * Se usa desde el controlador para responder `GET /users`.
 * Ejemplo: GET http://localhost:3001/users
 */
export const getUsersService = async (): Promise<IUser[]> => {
  return readUsersFromFile()
}

/**
 * getUserByDocumentService — Busca un usuario por su documento único.
 * Devuelve null cuando no existe para permitir respuesta 404.
 * Ejemplo: GET http://localhost:3001/users/1001
 */
export const getUserByDocumentService = async (
  document: string
): Promise<IUser | null> => {
  const users = await readUsersFromFile()
  return users.find(user => user.document === document) ?? null
}

/**
 * createUserService — Inserta un nuevo usuario validando que el documento sea único.
 * Ejemplo: POST http://localhost:3001/users
 */
export const createUserService = async (payload: IUser): Promise<IUser | null> => {
  const users = await readUsersFromFile()
  const exists = users.some(user => user.document === payload.document)
  if (exists) return null

  users.push(payload)
  await writeUsersToFile(users)
  return payload
}

/**
 * updateUserByDocumentService — Reemplaza los datos de un usuario existente.
 * Ejemplo: PUT http://localhost:3001/users/1001
 */
export const updateUserByDocumentService = async (
  document: string,
  payload: IUser
): Promise<IUser | null> => {
  const users = await readUsersFromFile()
  const index = users.findIndex(user => user.document === document)
  if (index === -1) return null

  users[index] = payload
  await writeUsersToFile(users)
  return payload
}

/**
 * deleteUserByDocumentService — Elimina y retorna el usuario encontrado por documento.
 * Ejemplo: DELETE http://localhost:3001/users/1001
 */
export const deleteUserByDocumentService = async (
  document: string
): Promise<IUser | null> => {
  const users = await readUsersFromFile()
  const index = users.findIndex(user => user.document === document)
  if (index === -1) return null

  const [deleted] = users.splice(index, 1)
  await writeUsersToFile(users)
  return deleted
}
