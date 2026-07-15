import { rl } from "../utils/readline"
import { listarProducto, buscarProducto, crearProducto, actualizarProducto, eliminarProductoPorId, calcularVentaProducto } from "../services/productoService"
import { categoria_producto } from "../types/categoriaProducto"
import { estado_venta } from "../types/estadoVenta"
import { Producto } from "../models/producto"

export async function menuProducto() {
    let volver = false;

    while (!volver) {
        console.log("|***----------***  MENU PRODUCTO  ***-----------***|")
        console.log("|--------------------------------------------------|")
        console.log("|***---- 1. listar productos                ----***|")
        console.log("|***---- 2. buscar producto por id          ----***|")
        console.log("|***---- 3. agregar producto                ----***|")
        console.log("|***---- 4. actualizar producto             ----***|")
        console.log("|***---- 5. eliminar producto               ----***|")
        console.log("|***---- 6. cacular iva del producto        ----***|")
        console.log("|***---- 0. volver al menu principal        ----***|")
        console.log("|--------------------------------------------------|")

        const opcion = await rl.question("ingrese una opcion: ");

        try {
            switch (opcion) {
                case "1": {
                    const lista = await listarProducto();
                    if (typeof lista === "string") {
                        console.log(lista);
                    } else if (lista.length === 0) {
                        console.log("No hay productos bro");
                    } else {
                        console.log("|***=== -------- Lista de Productos -------- ===***|");
                        lista.forEach(producto => console.log(producto));
                    }
                    break;
                }

                case "2": {
                    const id = await rl.question("Ingrese el Id del producto: ");
                    const resultado = await buscarProducto(Number(id));
                    if (resultado) {
                        console.log("Producto encontrado:");
                        console.log(resultado);
                    } else {
                        console.log("Producto no encontrado.");
                    }
                    break;
                }

                case "3": {
                    console.log("|***=== -------- Agregar Producto -------- ===***|");
                    const nombre = await rl.question("Nombre del producto: ");
                    const codigo = await rl.question("Codigo del producto: ");
                    const cantidad = await rl.question("Cantidad: ");
                    const precio = await rl.question("Precio: ");
                    console.log("Categorias: Electrico | electronico | de hogar | comida | informatico | escolar");
                    const cat = await rl.question("Categoria: ");
                    console.log("Estado de venta: pagado | pendiente | cancelada");
                    const estado = await rl.question("Estado de venta: ");
                    const descuento = await rl.question("descuento del producto: ");

                    await crearProducto({
                        id_producto: 0,
                        nombre_producto: nombre,
                        codigo_producto: Number(codigo),
                        cantidad: Number(cantidad),
                        precio: Number(precio),
                        categoria: cat as categoria_producto,
                        estado_venta: estado as estado_venta,
                        descuento: Number(descuento)
                    });
                    console.log("Producto agregado.");
                    break;
                }

                case "4": {
                    const id = await rl.question("id del producto a actualizar: ");
                    const nombre = await rl.question("Nuevo nombre (enter para omitir): ");
                    const codigo = await rl.question("Nuevo codigo (enter para omitir): ");
                    const cantidad = await rl.question("Nueva cantidad (enter para omitir): ");
                    const precio = await rl.question("Nuevo precio (enter para omitir): ");
                    const cat = await rl.question("Nueva categoria (enter para omitir): ");
                    const estado = await rl.question("Nuevo estado de venta (enter para omitir): ");
                    const descuento = await rl.question("Nuevo descuento (enter para omitir): ");

                    const datos: Partial<Producto> = {};
                    if (nombre.trim() !== "") datos.nombre_producto = nombre;
                    if (codigo.trim() !== "") datos.codigo_producto = Number(codigo);
                    if (cantidad.trim() !== "") datos.cantidad = Number(cantidad);
                    if (precio.trim() !== "") datos.precio = Number(precio);
                    if (cat.trim() !== "") datos.categoria = cat as categoria_producto;
                    if (estado.trim() !== "") datos.estado_venta = estado as estado_venta;
                    if (descuento.trim() !== "") datos.descuento = Number(descuento);

                    const actualizado = await actualizarProducto(Number(id), datos as Producto);
                    console.log(actualizado ? "Producto actualizado." : "Producto no encontrado.");
                    break;
                }

                case "5": {
                    const id = await rl.question("id del producto a eliminar : ");
                    const eliminado = await eliminarProductoPorId(Number(id));
                    console.log(eliminado ? "Producto eliminado." : "Producto no encontrado.");
                    break;
                }

                case "6": {
                    const id = await rl.question("id del producto: ");
                    await calcularVentaProducto(Number(id));
                    break;
                }

                case "0":
                    volver = true;
                    break;

                default:
                    console.log("La opcion no existe.");
            }
        } catch (error) {
            console.log("Ocurrió un error:", (error as Error).message);
        }
    }
}