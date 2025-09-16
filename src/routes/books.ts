/**
 * routes/books.ts — Ejemplo de módulo de rutas
 *
 * Contrato del autoloader:
 * - Debe exportar `export const router = Router()`.
 * - Las rutas definidas aquí quedarán colgadas de `/books` por el autoloader.
 *
 * Contenido:
 * - GET /books => retorna una lista de libros de ejemplo.
 *
 * Cómo agregar más endpoints:
 * - router.get('/:id', ...) para obtener un libro por id
 * - router.post('/', ...) para crear uno nuevo, etc.
 */


/**
 * routes/books.ts — Endpoints HTTP para Books
 *
 * Este archivo expone rutas y delega la lógica al controlador.
 * El autoloader montará este router en /books (por el nombre // NUEVO: DELETE /books/:id
router.delete('/:id', (req: Request, res: Response) => { void deleteBookById(req, res) })del archivo).
 */
import { Router, type Request, type Response } from 'express'
import { getBooks, getBookById } from '../controllers/books.js'
import { deleteBookById } from '../controllers/books.js'
import { createBook } from '../controllers/books.js'
import { updateBookById } from '../controllers/books.js'

export const router = Router()

//  /  consulta para todos los libros 
router.get('/', (req: Request, res: Response) => { void getBooks(req, res) })

//  /:id  para mostrar un libro en especififco por medio del id 
router.get('/:id', (req: Request, res: Response) => { void getBookById(req, res) })

//  DELETE /books/:id
router.delete('/:id', (req: Request, res: Response) => { void deleteBookById(req, res) })

// crear libro
router.post('/', (req: Request, res: Response) => { void createBook(req, res) })


router.put('/:id',   (req: Request, res: Response) => { void updateBookById(req, res) })