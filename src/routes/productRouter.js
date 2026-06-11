import { Router } from "express";
import { createProduct, deleteProduct, getProductId, getProducts, updateProduct } from "../controllers/productControllers.js";

const ProductsRouter = Router()
//-------------------------------PRODUCTOS----------------------------

//BUSCANDO LISTA
ProductsRouter.get("/", getProducts) //aca le digo que cuando me hagan una peticion get a la ruta /products, ejecute la funcion getProducts que esta en el controlador, y esa funcion se encarga de hacer toda la logica de negocio, como buscar los productos en la base de datos, filtrar por el id del usuario logueado, y devolver la respuesta al cliente. De esta forma, el router se encarga solo de definir las rutas y delegar la logica a los controladores, lo cual es una buena practica para mantener el codigo organizado y modular.
//BUSCANDO UNO
ProductsRouter.get("/:id", getProductId)
//AGREGANDO
ProductsRouter.post("/", createProduct)
//ACTUALIZANDO
ProductsRouter.put("/:id", updateProduct)
//BORRANDO
ProductsRouter.delete("/:id", deleteProduct)

export {ProductsRouter}