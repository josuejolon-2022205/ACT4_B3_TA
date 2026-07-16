import { Cliente } from "../models/clientes";
import { Producto } from "../models/producto";
import { ValidationError } from "../errors/customErrors";
 
export function validarCliente(c: Cliente): void {
    if (!c.nombre_cliente || c.nombre_cliente.trim() === "") {
        throw new ValidationError("El nombre no puede estar vacio.");
    }
    if (!c.apellido_cliente || c.apellido_cliente.trim() === "") {
        throw new ValidationError("El apellido no puede estar vacio.");
    }
    if (typeof c.telefono_cliente !== "number" || isNaN(c.telefono_cliente) || c.telefono_cliente <= 0) {
        throw new ValidationError("El telefono debe ser un numero valido.");
    }
    if (typeof c.dpi_cliente !== "number" || isNaN(c.dpi_cliente) || c.dpi_cliente <= 0) {
        throw new ValidationError("El DPI debe ser un numero valido.");
    }
 
    const correo = c.correo_cliente.toLowerCase();
    if (!correo.includes("@gmail.com") && !correo.includes("@yahoo.com") && !correo.includes("@outlook.com")) {
        throw new ValidationError("El correo debe ser de @gmail.com, @Yahoo.com o @outlook.com.");
    }
}
 
export function validarProducto(p: Producto): void {
    if (!p.nombre_producto || p.nombre_producto.trim() === "") {
        throw new ValidationError("El nombre no puede estar vacio.");
    }
    if (typeof p.codigo_producto !== "number" || isNaN(p.codigo_producto) || p.codigo_producto <= 0) {
        throw new ValidationError("El codigo debe ser un numero valido.");
    }
    if (typeof p.precio !== "number" || isNaN(p.precio) || p.precio <= 0) {
        throw new ValidationError("El precio debe ser mayor a 0.");
    }
    if (typeof p.cantidad !== "number" || isNaN(p.cantidad) || p.cantidad < 0) {
        throw new ValidationError("La cantidad no puede ser negativa.");
    }
}