import { z } from "zod"

const productSchemaZod = z.object({
    name: z.string("El nombre del producto debe existir")
        .trim("El nombre del producto no puede contener espacios al inicio o al final")
        .min(3, "El nombre del producto debe tener al menos 3 caracteres")
        .max(100),
    price: z.number("El precio del producto debe ser un número")
        .positive("El precio del producto debe ser un número positivo")
        .min(0, "El precio del producto no puede ser negativo")
        .default(0),
    category: z.string("La categoría del producto debe existir")
        .trim("La categoría del producto no puede contener espacios al inicio o al final")
        .min(5, "La categoría del producto debe tener al menos 5 caracteres")
        .max(50)
        .regex(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]+$/, "La categoría del producto solo puede contener letras, números y espacios"),
    stock: z.number("El stock del producto debe ser un número")
        .int("El stock del producto debe ser un número entero")
        .min(0, "El stock del producto no puede ser negativo")
        .default(0),
})

const productUpdateSchemaZod = z.object({
    name: z.string("El nombre del producto debe existir")
        .trim("El nombre del producto no puede contener espacios al inicio o al final")
        .min(3, "El nombre del producto debe tener al menos 3 caracteres")
        .max(100)
        .regex(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]+$/, "El nombre del producto solo puede contener letras, números y espacios")
        ,
    price: z.number("El precio del producto debe ser un número")
        .positive("El precio del producto debe ser un número positivo")
        .min(0, "El precio del producto no puede ser negativo")
        .default(0)
        ,
    category: z.string("La categoría del producto debe existir")
        .trim("La categoría del producto no puede contener espacios al inicio o al final")
        .min(5, "La categoría del producto debe tener al menos 5 caracteres")
        .max(50)
        .regex(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]+$/, "La categoría del producto solo puede contener letras, números y espacios")
        ,
    stock: z.number("El stock del producto debe ser un número")
        .int("El stock del producto debe ser un número entero")
        .min(0, "El stock del producto no puede ser negativo")
        .default(0)

}).partial()


export { productSchemaZod, productUpdateSchemaZod }