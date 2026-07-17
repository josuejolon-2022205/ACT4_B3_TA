import * as http from "http";
import { router } from "./router"; 

const port = 3000;

export const server = http.createServer(async (req, res) => {
    await router(req, res);
});

server.listen(port, () => {
    console.log("-----------------------------------")
    console.log("Servidor en http://localhost:" + port);
    console.log("-----------------------------------")
});