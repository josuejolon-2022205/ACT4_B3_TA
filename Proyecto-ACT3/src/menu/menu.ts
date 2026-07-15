import { rl } from "../utils/readline"
import { menuCliente } from "./menuCliente"
import { menuProducto } from "./menuProducto"

export async function menu() {
    let salir = false;

    while (!salir) {
        console.log("\n|***--------  MENU PRINCIPAL  ---------***|")
        console.log("|------------------------------------------|")
        console.log("|***- 1. menu cliente               ----***|")
        console.log("|***- 2. menu producto              ----***|")
        console.log("|***- 0. salir                      ----***|")
        console.log("|------------------------------------------|")

        const opcion = await rl.question("ingrese una opcion: ");

        switch (opcion) {
            case "1":
                await menuCliente();
                break;

            case "2":
                await menuProducto();
                break;

            case "0":
                console.log("adios");
                salir = true;
                break;

            default:
                console.log("La opcion no existe.");
        }
    }

    rl.close();
}