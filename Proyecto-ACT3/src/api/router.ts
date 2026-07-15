
import * as http from "http";
import { listarProducto, crearProducto } from "../services/productoService";


export async function routerProducto(req: http.IncomingMessage, res: http.ServerResponse ) {

    if (req.url === "/productos" && req.method === "GET") {
        res.writeHead(200, {
            "Content-Type": "application/json"
        });

        res.end(JSON.stringify(await listarProducto()));
        return;
    }

    if (req.url === "/productos" && req.method === "POST") {

        let body = "";

        req.on("data", chunk => {
            body += chunk;
        });

        req.on("end", () => {

            const producto = JSON.parse(body);

            res.writeHead(201, {
                "Content-Type": "application/json"
            });

            res.end(JSON.stringify(crearProducto(producto)));
        });

        return;
    }

    res.writeHead(404, {
        "Content-Type": "application/json"
    });

    res.end(JSON.stringify({
        error: "No se encontró la ruta"
    }));
}