import express, { request, response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { configDotenv } from 'dotenv';
import { conectionDb } from './config/mongoDbConection.js';
import { Product } from './models/productModel.js';
import { AuthMidleware } from './middlewares/authMiddleware.js';
import { ProductsRouter } from './routes/productRouter.js';
import { AuthRouter } from './routes/authRouter.js';


configDotenv()
conectionDb()
const server = express()


//permitir que las peticiones post puedan enviar el body en json:
server.use(express.json())// permite que se pueda leer el body de la request
server.use(cors())
server.use("/api/products", AuthMidleware, ProductsRouter)
server.use("/api/auth", AuthRouter)
server.get("/", (request, response) => {
    // comprobando que se conectó a la base de datos antes de responder
    if (mongoose.connection.readyState === 1) {
        return response.status(200).json({
            success: true,
            message: "Api rest con Mongo db y Bruno"
        });
    } else {
        return response.status(500).json({
            success: false,
            message: "Api en mantenimiento"
        });
    }
});

const entorno = "dev"
let PORT = 3000

if (entorno === "dev") {
    PORT = process.env.PORT
}

server.listen(PORT, () => {
    console.log(`Servidor en puerto ${PORT}`)
})

export { server }