import { server } from "./api/server";
import { menu } from "./menu/menu";

server.on("listening", () => {
    menu();
});