import { Cliente } from "../models/clientes";
import { leerClientes } from "../utils/reader";
import { escribirClientes } from "../utils/writer";
import { validarCliente } from "../validator/validaciones"

export async function listarCliente(): Promise<Cliente[] | string> {
    return leerClientes();
}

export async function buscarCliente(id: number): Promise<Cliente | null> {
    const clientes: Cliente[] = await leerClientes();
    return clientes.find(c => c.id_cliente === id) || null;
}

export async function crearCliente(nuevoCliente: Cliente): Promise<void> {
    validarCliente(nuevoCliente);
    const clientes: Cliente[] = await leerClientes();
    nuevoCliente.id_cliente = clientes.length > 0 ? Math.max(...clientes.map(c => c.id_cliente)) + 1 : 1;
    clientes.push(nuevoCliente);
    await escribirClientes(clientes);
}

export async function actualizarCliente(id: number, actualizarDatos: Partial<Cliente>): Promise<boolean> {
    const clientes: Cliente[] = await leerClientes();
    if (id <= 0) return false;

    const index = clientes.findIndex(c => c.id_cliente === id);
    if (index === -1) {
      return false;
    }

    clientes[index] = { ...clientes[index], ...actualizarDatos };
    await escribirClientes(clientes);
    return true;
}

export async function eliminarClientePorId(id: number): Promise<boolean> {
    const clientes: Cliente[] = await leerClientes();
    if (id <= 0) return false;

    const index = clientes.findIndex(c => c.id_cliente === id);
    if (index === -1) {
      return false;
    }

    clientes.splice(index, 1);
    await escribirClientes(clientes);
    return true;
}