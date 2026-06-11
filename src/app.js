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

server.use(express.json())
server.use(cors())
server.use("/api/products", AuthMidleware, ProductsRouter)
server.use("/api/auth", AuthRouter)
server.get("/", (request, response) => {
    
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