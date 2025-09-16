/**
 * interfaces/book.interface.ts — Contrato de datos para un Book
 *
 * Separa el “qué es un libro” del “cómo lo obtengo”.
 * Esto permite que servicios/controladores usen tipos consistentes.
 */
export interface IBook {
  id: string
  author: string
  name: string
  owner: string
}
