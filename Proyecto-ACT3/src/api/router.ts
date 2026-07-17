import * as http from "http";
import { actualizarProducto, agregarProducto, buscarProducto, eliminarProducto, listarProductos } from "../services/productoService";
import { eliminarCliente, actualizarCliente, agregarCliente, buscarCliente, listarClientes } from "../services/clientesService";

function enviarError(res: http.ServerResponse, error: any) {
    let errorType = "UnknownError";
    let statusCode = 400;
    let message = "Ocurrió un error inesperado.";
    
    if (error instanceof Error) {
        errorType = error.name;
        message = error.message;
        if (errorType === "NotFoundError") {
            statusCode = 404;
        }
    } else if (typeof error === "string") {
        errorType = "ValidationError";
        message = error;
    }
    
    res.writeHead(statusCode, {
        "Content-Type": "application/json"
    });
    res.end(JSON.stringify({ errorType, message }));
}
 
export async function router(req : http.IncomingMessage, res : http.ServerResponse){

    try {
        const partes = req.url?.split("/");
 
        // |***-------------- ***--- endpoints para productos ---*** -----------------***|
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
                    
                    const id = p.id_producto !== undefined ? p.id_producto : p.id;
                    const nombre = p.nombre_producto || p.nombre;
                    const stock = p.cantidad !== undefined ? p.cantidad : p.stock;
                    const estado = p.estado_venta || p.estado;
                    const codigo = p.codigo_producto !== undefined ? p.codigo_producto : p.codigo;
     
                    const result = await (agregarProducto as any)(
                        Number(id),
                        nombre,
                        Number(p.precio),
                        Number(stock),
                        p.categoria,
                        estado,
                        Number(p.descuento),
                        codigo !== undefined ? Number(codigo) : 0
                    );
     
                    if (typeof result === "string") {
                        enviarError(res, result);
                        return;
                    }
     
                    res.writeHead(201, {
                        "Content-Type": "application/json"
                    });
                    res.end(JSON.stringify(result));
                } catch (error) {
                    enviarError(res, error);
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
                    enviarError(res, error);
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

        // |***-------------- ***--- endpoints para clientes ---*** -----------------***|
        if(req.url === "/clientes" && req.method === "GET"){
            res.writeHead(200, {
                "Content-Type":"application/json"
            });
            res.end(JSON.stringify(await listarClientes()));
            return;
        }
        
        if(req.url === "/clientes" && req.method === "POST"){
            let body = "";
     
            req.on("data",(chunk) =>{
                body += chunk;
            });
     
            req.on("end", async () =>{
                try {
                    const p = JSON.parse(body);
     
                    const result = await agregarCliente(
                        Number(p.id),
                        p.nombre,
                        p.apellido,
                        p.direccion,
                        Number(p.telefono),
                        p.tipo,
                        Number(p.dpi),
                        p.correo
                    );
     
                    if (typeof result === "string") {
                        enviarError(res, result);
                        return;
                    }
     
                    res.writeHead(201, {
                        "Content-Type": "application/json"
                    });
                    res.end(JSON.stringify(result));
                } catch (error) {
                    enviarError(res, error);
                }
            });
            return;
        }
        
        if(partes?.length === 3 && partes[1] === "clientes" && req.method === "GET"){
            const id = Number(partes[2]);
            const c = await buscarCliente(id);
     
            if(!c){
                res.writeHead(404, {
                    "Content-Type": "application/json"
                });
                res.end(JSON.stringify({ error : "EL id no existe"}));
                return;
            }
     
            res.writeHead(200,{
                "Content-Type":"application/json"
            });
            res.end(JSON.stringify(c));
            return;
        }
        
        if(partes?.length === 3 && partes[1] === "clientes" && req.method === "PUT"){
            const id = Number(partes[2]);
            let body = "";
     
            req.on("data", (chunk) =>{
                body += chunk;
            });
     
            req.on("end", async () =>{
                try {
                    const p = JSON.parse(body);
                    const result = await actualizarCliente(id, p.nombre, p.apellido, p.direccion, p.telefono, p.tipo, p.dpi, p.correo);
     
                    res.writeHead(200,{
                        "Content-Type":"application/json"
                    });
                    res.end(JSON.stringify(result));
                } catch (error) {
                    enviarError(res, error);
                }
            });
            return;
        }
        
        if(partes?.length === 3 && partes[1] === "clientes" && req.method === "DELETE"){
            const id = Number(partes[2]);
            const result = await eliminarCliente(id);
     
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
    } catch (error) {
        enviarError(res, error);
    }
}