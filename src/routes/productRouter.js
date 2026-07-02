import { Router } from "express";
import {getPublicProducts, createProduct, deleteProduct, getProductId, getUserProducts, updateProduct } from "../controllers/productControllers.js";
import { AuthMidleware, checkRole } from "../middlewares/authMiddleware.js";

const ProductsRouter = Router()

ProductsRouter.get("/productPublic", getPublicProducts)

ProductsRouter.use(AuthMidleware)

ProductsRouter.get("/", checkRole(["admin", "user"]),getUserProducts) 

ProductsRouter.get("/:id",checkRole(["user"]), getProductId)

ProductsRouter.post("/",checkRole(["user"]),createProduct)

ProductsRouter.put("/:id",checkRole(["user"]), updateProduct)

ProductsRouter.delete("/:id",checkRole(["user"]),deleteProduct)

export {ProductsRouter}