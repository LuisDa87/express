/*
    services/book.service.ts — Capa de acceso a datos para Books
   
    Responsabilidad:
    - Leer el archivo JSON (modelo “persistencia”) y devolver IBook[]
    - Mantiene la lógica de E/S fuera de controladores
 */

import { promises as fs } from 'fs'
import type { IBook } from '../interfaces/book.interfaces.js'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
// Ruta absoluta al JSON con los datos
const filePath = join(__dirname, '../models/books.json')


/*
  BUSCAR un todos los libros

  http://localhost:3001/books

  este ejemplo utilizando get trae todos los libros

*/
export const getBooksService = async (): Promise<IBook[]> => {
  const data = await fs.readFile(filePath, 'utf-8')
  return JSON.parse(data) as IBook[]
}

/*
  BUSCAR un libro por id en el modelo JSON.

  http://localhost:3001/books/3

  este ejemplo utilizando get trae el libro con el id 3 

 */
export const getBookByIdService = async (id: string): Promise<IBook | null> => {
  const data = await fs.readFile(filePath, 'utf-8')
  const books = JSON.parse(data) as IBook[]
  return books.find(b => b.id === id) ?? null
}


/*
  ELIMINAR un libro por id en el modelo JSON.

  http://localhost:3001/books/2
  este comando eliminaria el libro con el id 2 

 */
export const deleteBookByIdService = async (id: string): Promise<IBook | null> => {
  const data = await fs.readFile(filePath, 'utf-8')
  const books = JSON.parse(data) as IBook[]

  const idx = books.findIndex(b => b.id === id) // id es string en tu JSON
  if (idx === -1) return null

  const [deleted] = books.splice(idx, 1)
  await fs.writeFile(filePath, JSON.stringify(books, null, 2), 'utf-8')
  return deleted
}


/*
    createBookService
    
    Crea un libro nuevo y lo guarda en el archivo JSON.
    - Lee el arreglo actual de libros desde models/books.json
    - Genera un id nuevo como string (tomando el mayor id y sumando 1)
    - Agrega el libro al arreglo
    - Escribe el archivo con el arreglo actualizado
    - Devuelve el libro creado
    
    ejemplo de envio post solo poner la URL el codigo le asigna un id 
    http://localhost:3001/books

    {
     "author": "Gilmer Mesa",
     "name": "La Cuadra",
     "owner": "Gilmer Mesa - Espectador Editorial2"
    }
*/


export const createBookService = async (
  payload: Omit<IBook, 'id'> // llega sin id desde el controlador
): Promise<IBook> => {
  //  Leer el archivo y parsear a array
  const data = await fs.readFile(filePath, 'utf-8')
  const books = JSON.parse(data) as IBook[]

  //  Generar un id nuevo como string (ej: "4")
  const nextId =
    (books.reduce((max, b) => Math.max(max, Number(b.id)), 0) + 1).toString()

  // Crear el objeto libro con el nuevo id
  const newBook: IBook = {
    id: nextId,
    author: payload.author,
    name: payload.name,
    owner: payload.owner,
  }

  //  Agregarlo al arreglo y sobrescribir el JSON
  books.push(newBook)
  await fs.writeFile(filePath, JSON.stringify(books, null, 2), 'utf-8')

  // Devolver el libro creado
  return newBook
}

/*
   replaceBookByIdService
   
   Reemplaza (PUT) los datos de un libro existente.
   - Lee el JSON
   - Busca el libro por id
   - Si existe, lo reemplaza con los nuevos valores y guarda el archivo
   - Devuelve el libro actualizado o null si no existe

   ejemplo de envio 
   http://localhost:3001/books/5    debemos especificar el id que queremos editar 

   {
     "author": "Gilmer Mesa",
     "name": "La Cuadra",
     "owner": "Gilmer Mesa - Espectador Editorial2"
   }
   
   
 */
export const replaceBookByIdService = async (
  id: string,
  payload: Omit<IBook, 'id'>   // La ruta contiene el id por ejemplo: http://localhost:3001/books/5
): Promise<IBook | null> => {
  const data = await fs.readFile(filePath, 'utf-8')
  const books = JSON.parse(data) as IBook[]

  const idx = books.findIndex(b => b.id === id)
  if (idx === -1) return null

  const updated: IBook = {
    id,                        // mantenemos el id original
    author: payload.author,
    name: payload.name,
    owner: payload.owner
  }

  books[idx] = updated
  await fs.writeFile(filePath, JSON.stringify(books, null, 2), 'utf-8')

  return updated
}
