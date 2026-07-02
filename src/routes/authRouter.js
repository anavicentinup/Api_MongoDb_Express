import { Router } from "express"
import { limiterLogin, limiterRegister } from "../middlewares/limiterMiddleware.js";
import { AuthMidleware, UserRolMiddleware } from "../middlewares/authMiddleware.js";
import { changePassword, catchUsuarios, login, usuario, register, updateUser} from '../controllers/authControllers.js'

const AuthRouter = Router()

AuthRouter.post("/register", limiterRegister,register )

AuthRouter.post("/login",limiterLogin, login)

AuthRouter.get("/users", AuthMidleware, UserRolMiddleware(["admin"]), catchUsuarios)

AuthRouter.put("/update", AuthMidleware, UserRolMiddleware(["admin", "user"]),updateUser);

AuthRouter.put("/updatePassword", AuthMidleware, UserRolMiddleware(["user","admin"]),changePassword);

AuthRouter.get("/usuario", AuthMidleware,UserRolMiddleware(["admin", "user"]), usuario)

export { AuthRouter }   