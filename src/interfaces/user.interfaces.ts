/**
 * interfaces/user.interfaces.ts — Define el contrato de datos para un usuario.
 * Garantiza que servicios y controladores trabajen con la misma forma.
 */
export interface IUser {
  document: string
  name: string
  email: string
  phone: string
  address: string
}
