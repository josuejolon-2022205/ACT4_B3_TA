import * as http from "http";
import { actualizarProducto, agregarProducto, buscarProducto, eliminarProducto, listarProductos } from "../services/productoService";
import { eliminarCliente } from "../services/clientesService";
 
export async function routerProducto(req : http.IncomingMessage, res : http.ServerResponse){
 
    const partes = req.url?.split("/");
 
    if(req.url === "/productos" && req.method === "GET"){
        res.writeHead(200, {
            "Content-Type":"application/json"
        });
        res.end(JSON.stringify(await listarProductos()));
        return;
    }
    
    if(req.url === "/productos" && req.method === "POST"){
        let body = "";
 
        req.on("data",(chunk) =>{
            body += chunk;
        });
 
        req.on("end", async () =>{
            try {
                const p = JSON.parse(body);
 
                const result = await agregarProducto(
                    Number(p.id),
                    p.nombre,
                    Number(p.precio),
                    Number(p.stock),
                    p.categoria,
                    p.estado,
                    Number(p.descuento)
                );
 
                if (typeof result === "string") {
                    res.writeHead(400, {
                        "Content-Type": "application/json"
                    });
                    res.end(JSON.stringify({ error: result }));
                    return;
                }
 
                res.writeHead(201, {
                    "Content-Type": "application/json"
                });
                res.end(JSON.stringify(result));
            } catch (error) {
                res.writeHead(400, {
                    "Content-Type": "application/json"
                });
                res.end(JSON.stringify({ error: error instanceof Error ? error.message : "JSON inválido o error en la solicitud." }));
            }
        });
        return;
    }
    
    if(partes?.length === 3 && partes[1] === "productos" && req.method === "GET"){
        const id = Number(partes[2]);
        const p = await buscarProducto(id);
 
        if(!p){
            res.writeHead(404, {
                "Content-Type": "application/json"
            });
            res.end(JSON.stringify({ error : "EL id no existe"}));
            return;
        }
 
        res.writeHead(200,{
            "Content-Type":"application/json"
        });
        res.end(JSON.stringify(p));
        return;
    }
    
    if(partes?.length === 3 && partes[1] === "productos" && req.method === "PUT"){
        const id = Number(partes[2]);
        let body = "";
 
        req.on("data", (chunk) =>{
            body += chunk;
        });
 
        req.on("end", async () =>{
            try {
                const p = JSON.parse(body);
                const result = await actualizarProducto(id, p.nombre, p.precio, p.stock, p.categoria, p.estado, p.descuento);
 
                res.writeHead(200,{
                    "Content-Type":"application/json"
                });
                res.end(JSON.stringify(result));
            } catch (error) {
                res.writeHead(400, {
                    "Content-Type": "application/json"
                });
                res.end(JSON.stringify({ error: "Error al procesar la actualización" }));
            }
        });
        return;
    }
    
    if(partes?.length === 3 && partes[1] === "productos" && req.method === "DELETE"){
        const id = Number(partes[2]);
        const result = await eliminarProducto(id);
 
        res.writeHead(200, {
            "Content-Type": "text/plain"
        });
        res.end(result);
        return;
    }
    
    res.writeHead(404, {
        "Content-Type":"application/json"
    });
    res.end(JSON.stringify({ error : "No se encontro la ruta" }));
}