import jwt from 'jsonwebtoken'
import { configDotenv } from 'dotenv';
configDotenv()

const AuthMidleware= (req, res, next) => {
    const headers = req.headers.authorization 

    if (!headers || !headers.startsWith("Bearer ")) {
        return res.status(401).json({ message: "estas desautorizado para acceder" })
    }
    const token = headers.split(" ")[1]

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRETKEY) 
        req.userLogger = decoded
        next()
    } catch (error) {
        res.status(401).json({ error: error.message })
    }
    console.log("paso por el middleware de autenticacion")
}


const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    const user = req.userLogger;
    if (!user) {
      return res.status(401).json({ success: false, message: "No autorizado" });
    }
    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ success: false, message: "No tenés permisos para esta acción" });
    }
    next();
  };
    console.log("paso por el middleware de rol")
};


const UserRolMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    const user = req.userLogger;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "No autorizado. Debes iniciar sesión."
      });
    }

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: "No tenés rol para esta acción."
      });
    }
    next();
  };
      console.log("paso por el middleware de rol de usuario")
};



export {AuthMidleware, checkRole, UserRolMiddleware}