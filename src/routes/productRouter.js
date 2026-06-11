import { Router } from "express";
import { createProduct, deleteProduct, getProductId, getProducts, updateProduct } from "../controllers/productControllers.js";

const ProductsRouter = Router()

ProductsRouter.get("/", getProducts) 

ProductsRouter.get("/:id", getProductId)

ProductsRouter.post("/", createProduct)

ProductsRouter.put("/:id", updateProduct)

ProductsRouter.delete("/:id", deleteProduct)

export {ProductsRouter}