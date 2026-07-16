import { Cliente } from "../models/clientes";
import { leerClientes } from "../utils/reader";
import { escribirClientes } from "../utils/writer";
import { DatabaseError } from "../errors/customErrors";

export class ClienteRepository {
    async obtenerTodos(): Promise<Cliente[]> {
        try {
            const data = await leerClientes();
            if (typeof data === "string") {
                return [];
            }
            return Array.isArray(data) ? data : [];
        } catch (error: any) {
            throw new DatabaseError("Error al obtener los clientes: " + error.message);
        }
    }

    async buscarPorId(id: number): Promise<Cliente | null> {
        const clientes = await this.obtenerTodos();
        return clientes.find(c => c.id_cliente === id) || null;
    }

    async guardar(clientes: Cliente[]): Promise<void> {
        try {
            await escribirClientes(clientes);
        } catch (error: any) {
            throw new DatabaseError("Error al guardar los clientes: " + error.message);
        }
    }
}
