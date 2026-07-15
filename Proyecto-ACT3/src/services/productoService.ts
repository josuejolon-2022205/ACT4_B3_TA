import { Producto } from "../models/producto";
import { leerProductos } from "../utils/reader";
import { escribirProductos } from "../utils/writer";
import { validarProducto } from "../validator/validaciones";

export async function listarProducto(): Promise<Producto[] | string> {
    return leerProductos();
}

export async function listarProductos(): Promise<Producto[]> {
    const res = await leerProductos();
    return Array.isArray(res) ? res : [];
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

export async function agregarProducto(
    id: number,
    nombre: string,
    precio: number,
    stock: number,
    categoria: any,
    estado: any,
    descuento: number
): Promise<Producto | string> {
    const productos: Producto[] = await leerProductos();
    if (productos.some(p => p.id_producto === id)) {
        return "El ID del producto ya existe.";
    }

    const nuevo: Producto = {
        id_producto: id,
        nombre_producto: nombre,
        codigo_producto: Math.floor(1000 + Math.random() * 9000),
        cantidad: stock,
        precio: precio,
        categoria: categoria,
        estado_venta: estado,
        descuento: descuento
    };

    try {
        validarProducto(nuevo);
    } catch (e: any) {
        return e.message;
    }

    productos.push(nuevo);
    await escribirProductos(productos);
    return nuevo;
}

export async function actualizarProducto(
    id: number,
    nombreOrDatos: string | Partial<Producto>,
    precio?: number,
    stock?: number,
    categoria?: any,
    estado?: any,
    descuento?: number
): Promise<boolean | Producto> {
    const productos: Producto[] = await leerProductos();
    if (id <= 0) return false;

    const index = productos.findIndex(p => p.id_producto === id);
    if (index === -1) {
        return false;
    }

    let actualizarDatos: Partial<Producto> = {};

    if (typeof nombreOrDatos === "object" && nombreOrDatos !== null) {
        actualizarDatos = nombreOrDatos;
    } else {
        if (nombreOrDatos !== undefined) actualizarDatos.nombre_producto = nombreOrDatos;
        if (precio !== undefined) actualizarDatos.precio = precio;
        if (stock !== undefined) actualizarDatos.cantidad = stock;
        if (categoria !== undefined) actualizarDatos.categoria = categoria;
        if (estado !== undefined) actualizarDatos.estado_venta = estado;
        if (descuento !== undefined) actualizarDatos.descuento = descuento;
    }

    productos[index] = { ...productos[index], ...actualizarDatos };
    await escribirProductos(productos);

    if (typeof nombreOrDatos === "object" && nombreOrDatos !== null) {
        return true;
    } else {
        return productos[index];
    }
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

export async function eliminarProducto(id: number): Promise<string> {
    const result = await eliminarProductoPorId(id);
    return result ? "Producto eliminado correctamente." : "El ID no existe.";
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