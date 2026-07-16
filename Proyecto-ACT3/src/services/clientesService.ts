import { Cliente } from "../models/clientes";
import { ClienteRepository } from "../data/clienteRepository";
import { validarCliente } from "../validator/validations";
import { NotFoundError } from "../errors/customErrors";

const repository = new ClienteRepository();
 
export async function listarCliente(): Promise<Cliente[] | string> {
    return repository.obtenerTodos();
}

export async function listarClientes(): Promise<Cliente[]> {
    return repository.obtenerTodos();
}
 
export async function buscarCliente(id: number): Promise<Cliente | null> {
    return repository.buscarPorId(id);
}
 
export async function crearCliente(nuevoCliente: Cliente): Promise<void> {
    validarCliente(nuevoCliente);
    const clientes = await repository.obtenerTodos();
    nuevoCliente.id_cliente = clientes.length > 0 ? Math.max(...clientes.map(c => c.id_cliente)) + 1 : 1;
    clientes.push(nuevoCliente);
    await repository.guardar(clientes);
}

export async function agregarCliente(
    id: number,
    nombre: string,
    apellido: string,
    direccion: string,
    telefono: number,
    tipo: any,
    dpi: number,
    correo: string
): Promise<Cliente | string> {
    const clientes = await repository.obtenerTodos();
    if (clientes.some(c => c.id_cliente === id)) {
        return "El ID del cliente ya existe.";
    }

    const nuevo: Cliente = {
        id_cliente: id,
        nombre_cliente: nombre,
        apellido_cliente: apellido,
        direccion_cliente: direccion,
        telefono_cliente: telefono,
        tipo_cliente: tipo,
        dpi_cliente: dpi,
        correo_cliente: correo
    };

    validarCliente(nuevo);

    clientes.push(nuevo);
    await repository.guardar(clientes);
    return nuevo;
}
 
export async function actualizarCliente(
    id: number,
    nombreOrDatos: string | Partial<Cliente>,
    apellido?: string,
    direccion?: string,
    telefono?: number,
    tipo?: any,
    dpi?: number,
    correo?: string
): Promise<boolean | Cliente> {
    const clientes = await repository.obtenerTodos();
    if (id <= 0) {
        throw new NotFoundError("El ID del cliente debe ser mayor que 0.");
    }
 
    const index = clientes.findIndex(c => c.id_cliente === id);
    if (index === -1) {
        throw new NotFoundError(`No se encontró el cliente con ID ${id}.`);
    }
 
    let actualizarDatos: Partial<Cliente> = {};

    if (typeof nombreOrDatos === "object" && nombreOrDatos !== null) {
        actualizarDatos = nombreOrDatos;
    } else {
        if (nombreOrDatos !== undefined) actualizarDatos.nombre_cliente = nombreOrDatos;
        if (apellido !== undefined) actualizarDatos.apellido_cliente = apellido;
        if (direccion !== undefined) actualizarDatos.direccion_cliente = direccion;
        if (telefono !== undefined) actualizarDatos.telefono_cliente = telefono;
        if (tipo !== undefined) actualizarDatos.tipo_cliente = tipo;
        if (dpi !== undefined) actualizarDatos.dpi_cliente = dpi;
        if (correo !== undefined) actualizarDatos.correo_cliente = correo;
    }

    clientes[index] = { ...clientes[index], ...actualizarDatos };
    await repository.guardar(clientes);

    if (typeof nombreOrDatos === "object" && nombreOrDatos !== null) {
        return true;
    } else {
        return clientes[index];
    }
}
 
export async function eliminarClientePorId(id: number): Promise<boolean> {
    const clientes = await repository.obtenerTodos();
    if (id <= 0) return false;
 
    const index = clientes.findIndex(c => c.id_cliente === id);
    if (index === -1) {
      return false;
    }
 
    clientes.splice(index, 1);
    await repository.guardar(clientes);
    return true;
}
 
export async function eliminarCliente(id: number): Promise<string> {
    const result = await eliminarClientePorId(id);
    if (!result) {
        throw new NotFoundError(`No se encontró el cliente con ID ${id}.`);
    }
    return "Cliente eliminado correctamente.";
}