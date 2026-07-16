import { Producto } from "../models/producto";
import { leerProductos } from "../utils/reader";
import { escribirProductos } from "../utils/writer";
import { DatabaseError } from "../errors/customErrors";

export class ProductoRepository {
    async obtenerTodos(): Promise<Producto[]> {
        try {
            const data = await leerProductos();
            if (typeof data === "string") {
                return [];
            }
            return Array.isArray(data) ? data : [];
        } catch (error: any) {
            throw new DatabaseError("Error al obtener los productos: " + error.message);
        }
    }

    async buscarPorId(id: number): Promise<Producto | null> {
        const productos = await this.obtenerTodos();
        return productos.find(p => p.id_producto === id) || null;
    }

    async guardar(productos: Producto[]): Promise<void> {
        try {
            await escribirProductos(productos);
        } catch (error: any) {
            throw new DatabaseError("Error al guardar los productos: " + error.message);
        }
    }
}
