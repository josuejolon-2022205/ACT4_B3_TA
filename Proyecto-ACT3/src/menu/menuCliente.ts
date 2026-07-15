import { rl } from "../utils/readline"
import { listarCliente, buscarCliente, crearCliente, actualizarCliente, eliminarClientePorId } from "../services/clientesService"
import { tipo_cliente } from "../enums/tipoCliente"
import { Cliente } from "../models/clientes"

export async function menuCliente() {
    let volver = false;

    while (!volver) {
        console.log("|***----------*  MENU CLIENTE  -----------***|")
        console.log("|--------------------------------------------|")
        console.log("|***- 1. listar clientes              ----***|")
        console.log("|***- 2. buscar cliente por id        ----***|")
        console.log("|***- 3. agregar cliente              ----***|")
        console.log("|***- 4. actualizar cliente           ----***|")
        console.log("|***- 5. eliminar cliente             ----***|")
        console.log("|***- 0. volver al menu principal     ----***|")
        console.log("|--------------------------------------------|")

        const opcion = await rl.question("ingrese una opcion: ");

        try {
            switch (opcion) {
                case "1": {
                    const lista = await listarCliente();
                    if (typeof lista === "string") {
                        console.log(lista);
                    } else if (lista.length === 0) {
                        console.log("No hay clientes registrados.");
                    } else {
                        console.log("|***=== ------ Lista de Clientes ------ ===***|");
                        lista.forEach(c => console.log(c));
                    }
                    break;
                }

                case "2": {
                    const id = await rl.question("id del cliente: ");
                    const resultado = await buscarCliente(Number(id));
                    if (resultado) {
                        console.log("Cliente encontrado:");
                        console.log(resultado);
                    } else {
                        console.log("el cliente no existe.");
                    }
                    break;
                }

                case "3": {
                    console.log("|***=== ------ Agregar Cliente ------ ===***|");
                    const nombre = await rl.question("Nombre: ");
                    const apellido = await rl.question("Apellido: ");
                    const direccion = await rl.question("Direccion: ");
                    const telefono = await rl.question("Telefono: ");
                    const dpi = await rl.question("DPI: ");
                    const correo = await rl.question("Correo: ");
                    console.log("Tipos de cliente: FRECUENTE, NORMAL, MAYORISTA o NUEVO");
                    const tipo = await rl.question("Tipo de cliente: ");

                    await crearCliente({
                        id_cliente: 0,
                        nombre_cliente: nombre,
                        apellido_cliente: apellido,
                        direccion_cliente: direccion,
                        telefono_cliente: Number(telefono),
                        dpi_cliente: Number(dpi),
                        correo_cliente: correo,
                        tipo_cliente: tipo as tipo_cliente
                    });
                    console.log("Cliente agregado.");
                    break;
                }

                case "4": {
                    const id = await rl.question("id del cliente: ");
                    const nombre = await rl.question("Nuevo nombre (enter para omitir): ");
                    const apellido = await rl.question("Nuevo apellido (enter para omitir): ");
                    const direccion = await rl.question("Nueva direccion (enter para omitir): ");
                    const telefono = await rl.question("Nuevo telefono (enter para omitir): ");
                    const dpi = await rl.question("Nuevo DPI (enter para omitir): ");
                    const correo = await rl.question("Nuevo correo (enter para omitir): ");
                    const tipo = await rl.question("Nuevo tipo de cliente (enter para omitir): ");

                    const datos: Partial<Cliente> = {};
                    if (nombre.trim() !== "") datos.nombre_cliente = nombre;
                    if (apellido.trim() !== "") datos.apellido_cliente = apellido;
                    if (direccion.trim() !== "") datos.direccion_cliente = direccion;
                    if (telefono.trim() !== "") datos.telefono_cliente = Number(telefono);
                    if (dpi.trim() !== "") datos.dpi_cliente = Number(dpi);
                    if (correo.trim() !== "") datos.correo_cliente = correo;
                    if (tipo.trim() !== "") datos.tipo_cliente = tipo as tipo_cliente;

                    const actualizado = await actualizarCliente(Number(id), datos as Cliente);
                    console.log(actualizado ? "Cliente actualizado." : "Cliente no encontrado.");
                    break;
                }

                case "5": {
                    const id = await rl.question("id del cliente: ");
                    const eliminado = await eliminarClientePorId(Number(id));
                    console.log(eliminado ? "Cliente eliminado." : "Cliente no encontrado.");
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