export class ValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "error de validacion";
    }
}

export class NotFoundError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "Error no encontrado";
    }
}

export class DatabaseError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "Error de DB";
    }
}
