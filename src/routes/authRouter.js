import { Router } from "express"
import { limiterLogin, limiterRegister } from "../middlewares/limiterMiddleware.js";
import { AuthMidleware } from "../middlewares/authMiddleware.js";
import { catchUsuarios, login, register} from '../controllers/authControllers.js'

const AuthRouter = Router()


AuthRouter.get("/users", AuthMidleware, catchUsuarios)
//REGISTRO
AuthRouter.post("/register", limiterRegister,register )
//LOGIN
AuthRouter.post("/login",limiterLogin, login)



export { AuthRouter }   