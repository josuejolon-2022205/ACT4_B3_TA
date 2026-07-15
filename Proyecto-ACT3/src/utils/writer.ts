import { writeFile } from "fs/promises";
import { Cliente } from "../models/clientes";
import { Producto } from "../models/producto";

export async function escribirClientes(clientes: Cliente[]) {
    try {
        await writeFile("./src/data/clientes.json", JSON.stringify(clientes, null, 2));
    } catch (error) {
        console.error("Error al escribir el archivo de clientes:", error);
    }
}

export async function escribirProductos(productos: Producto[]) {
    try {
        await writeFile("./src/data/producto.json", JSON.stringify(productos, null, 2));
    } catch (error) {
        console.error("Error al escribir el archivo de productos:", error);
    }
}
