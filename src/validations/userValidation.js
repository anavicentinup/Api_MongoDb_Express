import { z } from "zod"

const userSchemaZod = z.object({
    username: z.string("El nombre de usuario debe ser un string")
        .trim()
        .min(3, "El nombre de usuario debe tener al menos 3 caracteres")
        .max(20, "El nombre de usuario no puede tener más de 20 caracteres")
        .toLowerCase()
        .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "El nombre de usuario solo puede contener letras y espacios"),
    email: z.string("El email debe ser un string")
        .trim()
        .email("El email no es válido")
        .toLowerCase()
        .refine(email => ["gmail.com", "hotmail.com", "outlook.com", "icloud.com"].includes(email.split("@")[1]),
            { message: "Dominio no permitido" }
        ),
    password: z.string("La contraseña debe ser un string")
        .trim()
        .min(8, "La contraseña debe tener al menos 8 caracteres")
        .max(20, "La contraseña no puede tener más de 20 caracteres")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/, "La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial"),
    role: z.enum(["admin", "user"])
        .default("user")
}).strict()

const userUpdateSchemaZod = z.object({
    username: z.string("El nombre de usuario debe ser un string")
        .trim()
        .min(3, "El nombre de usuario debe tener al menos 3 caracteres")
        .max(20, "El nombre de usuario no puede tener más de 20 caracteres")
        .toLowerCase()
        .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "El nombre de usuario solo puede contener letras y espacios"),
    phone: z.string("El teléfono debe ser un string")
        .trim()
        .regex(/^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/, "El teléfono no es válido"),
    address: z.string("La dirección debe ser un string")
        .trim()
        .min(5, "La dirección debe tener al menos 5 caracteres")
        .max(100, "La dirección no puede tener más de 100 caracteres")
}).strict().partial() 

const changePasswordSchemaZod = z.object({
    currentPassword: z.string().min(8),
    newPassword: z.string()
        .min(8)
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/,
            "Debe tener mayúscula, minúscula, número y símbolo"
        )
}).strict()

export { userSchemaZod, userUpdateSchemaZod , changePasswordSchemaZod}