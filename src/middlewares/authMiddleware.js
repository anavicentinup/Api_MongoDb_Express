import jwt from 'jsonwebtoken'
import { configDotenv } from 'dotenv';
configDotenv()

//CREANDO MI PROPIO MIDDLEWARE ...
const AuthMidleware= (req, res, next) => {
    const headers = req.headers.authorization //recupero el token jwt

    if (!headers || !headers.startsWith("Bearer ")) {
        return res.status(401).json({ message: "estas desautorizado para acceder" })
    }
    const token = headers.split(" ")[1]//lo separo de la palabra bearer

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRETKEY) //verifico si coicide con el token que envie
        req.userLogger = decoded//si el token es valido, entonces guardo la info del usuario en el request para poder usarla en las rutas protegidas
        next()
    } catch (error) {
        console.log(error)
        res.status(401).json({ error: error.message })
    }
}

export {AuthMidleware}