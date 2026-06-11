import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { User } from "../models/userModel.js"
import { configDotenv } from 'dotenv';
configDotenv()

const catchUsuarios = async (request, response) => {
    const userlogged = request.userLogger
    if (!userlogged) return response.status(401).json({ success: false, message: "no podes ver los usuarios porque estas desautorizado" })

    try {
        const users = await User.find()

        const publicDataUsers = users.map(user => ({
            id: user._id,
            email: user.email,
            creado: user.createdAt.toLocaleString("es-AR"),
            actualizado: user.updatedAt.toLocaleString("es-AR")
        }))
        response.status(200).json({
            success: true,
            data: publicDataUsers,
            message: "usuarios traidos correctamente"
        })
    } catch (error) {
        response.status(500).json({ success: false, message: "servidor en mantenimiento" })
    }
    console.log("vieron los usuarios")
}

const register = async (request, response) => {
    try {
        const { body } = request 
        const { username, password, email } = body 

        const foundUser = await User.findOne({ email })
        if (foundUser) {
            return response.status(409).json({ success: false, message: "el email ya esta registrado" })
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
        if (!passwordRegex.test(password)) {
            return response.status(400).json({ success: false, error: "tu contraseña esta mal creada" })
        }
        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await User.create({
            username,
            email,
            password: hashedPassword
        })

        response.status(201).json({
            success: true,
            message: "Usuario creado con éxito",
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                creado: newUser.createdAt.toLocaleString("es-AR"),
                actualizado: newUser.updatedAt.toLocaleString("es-AR")
            }
        })
    } catch (error) {
        response.status(500).json({ success: false, message: error.message })
    }
 console.log("se registro un nuevo usuario")
}

const login = async (request, response) => {
    try {
        const { body, ip } = request 
        const { email, password } = body 
       
        if (!email || !password) {
            return response.status(401).json({ success: false, message: "desautorizado" })
        }
        
        const findUser = await User.findOne({ email })
       
        if (!findUser) {
            return response.status(403).json({ success: false, message: "no estas registrado" })
        }
        const isValid = await bcrypt.compare(password, findUser.password)//comparo la contraseña
        
        if (!isValid) {
            return response.status(403).json({ success: false, message: "no estas corroborado" })
        }

        const payLoad = { id: findUser.id, email: findUser.email, name: findUser.username } 
        const secretKey = process.env.JWT_SECRETKEY
        const options = { expiresIn: "30d" }
        const token = jwt.sign(payLoad, secretKey, options)

        response.status(200).json({ success: true, data: token, message: "login exitoso" })
    }
    catch (error) {
        response.status(500).json({ success: false, data: error.message , message: "error en el servidor" })
    }
    console
}

export { catchUsuarios, login, register }