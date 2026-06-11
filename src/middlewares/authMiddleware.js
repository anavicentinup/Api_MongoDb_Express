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

export {AuthMidleware}