import { readFile, writeFile } from "fs/promises";

export async function leerClientes() {
    try {
        const data = await readFile("./src/data/clientes.json", "utf8");
        return JSON.parse(data);
    } catch (error: any) {
        if (error.code === "ENOENT") {
            await writeFile("./src/data/clientes.json", "[]", "utf8");
            return "El archivo no existe, creando uno nuevo...";
        }

        if (error instanceof SyntaxError) {
            console.error("El archivo contiene un JSON inválido.");
            return "";
        }

        console.error(error.message);
        return "";
    }
}

export async function leerProductos() {
    try {
        const data = await readFile("./src/data/producto.json", "utf8");
        return JSON.parse(data);
    } catch (error: any) {
        if (error.code === "ENOENT") {
            await writeFile("./src/data/producto.json", "[]", "utf8");
            return "El archivo no existe, creando uno nuevo...";
        }

        if (error instanceof SyntaxError) {
            console.error("El archivo contiene un JSON inválido.");
            return "";
        }

        console.error(error.message);
        return "";
    }
}
