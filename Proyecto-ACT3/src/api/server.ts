import * as http from "http";
import { routerProducto } from "./router"; 

const port = 3000;

const server = http.createServer(async (req, res) => {
    await routerProducto(req, res);
});

server.listen(port, () => {
    console.log("-----------------------------------")
    console.log("Servidor en http://localhost:" + port);
    console.log("-----------------------------------")
});