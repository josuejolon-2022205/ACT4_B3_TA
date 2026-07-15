import { categoria_producto } from "../types/categoriaProducto";
import { estado_venta } from "../types/estadoVenta";

export interface Producto{
    id_producto: number,
    nombre_producto: string,
    codigo_producto: number,
    cantidad: number,
    precio: number,
    categoria : categoria_producto,
    estado_venta : estado_venta,
    descuento: number



}