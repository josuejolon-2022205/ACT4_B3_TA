import { Producto } from "../models/producto";
import { leerProductos } from "../utils/reader";
import { escribirProductos } from "../utils/writer";
import { validarProducto } from "../utils/validaciones";

export async function listarProducto(): Promise<Producto[] | string> {
    return leerProductos();
}

export async function buscarProducto(id: number): Promise<Producto | null> {
    const productos: Producto[] = await leerProductos();
    return productos.find(p => p.id_producto === id) || null;
}

export async function crearProducto(nuevoProducto: Producto): Promise<void> {
    validarProducto(nuevoProducto);
    const productos: Producto[] = await leerProductos();
    nuevoProducto.id_producto = productos.length > 0 ? Math.max(...productos.map(p => p.id_producto)) + 1 : 1;
    productos.push(nuevoProducto);
    await escribirProductos(productos);
}

export async function actualizarProducto(id: number, actualizarDatos: Partial<Producto>): Promise<boolean> {
    const productos: Producto[] = await leerProductos();
    if (id <= 0) return false;

    const index = productos.findIndex(p => p.id_producto === id);
    if (index === -1) {
        return false;
    }

    productos[index] = { ...productos[index], ...actualizarDatos };
    await escribirProductos(productos);
    return true;
}

export async function eliminarProductoPorId(id: number): Promise<boolean> {
    const productos: Producto[] = await leerProductos();
    if (id <= 0) return false;

    const index = productos.findIndex(p => p.id_producto === id);
    if (index === -1) {
        return false;
    }

    productos.splice(index, 1);
    await escribirProductos(productos);
    return true;
}

export const calcularSubtotal = (montos: number[]): number =>
    montos.reduce((acumulado, monto) => acumulado + monto, 0);

export const calcularIVA = (subtotal: number, tasaIVA: number): number =>
    subtotal * tasaIVA;

export const calcularTotalFinal = (subtotal: number, iva: number): number =>
    subtotal + iva;

export async function calcularVentaProducto(id: number, IVA: number = 0.12): Promise<void> {
    const productos: Producto[] = await leerProductos();
    const producto = productos.find(p => p.id_producto === id);

    if (!producto) {
        console.log("El producto no existe.");
        return;
    }

    const subtotal = calcularSubtotal([producto.precio]);
    const iva = calcularIVA(subtotal, IVA);
    const total = calcularTotalFinal(subtotal, iva);

    console.log("|----- resumen de venta ------|");
    console.log("|-- ID: " + producto.id_producto);
    console.log("|-- subtotal: " + subtotal);
    console.log("|-- iva: " + iva);
    console.log("|-- total: " + total);
}