import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { User } from "../models/userModel.js"
import { configDotenv } from 'dotenv';
import {userSchemaZod, userUpdateSchemaZod} from "../validations/userValidation.js"
import {changePasswordSchemaZod} from "../validations/userValidation.js"
configDotenv()

const catchUsuarios = async (request, response) => {
  const userlogged = request.userLogger
  if (!userlogged) return response.status(401).json({ success: false, message: "no podes ver los usuarios porque estas desautorizado" })

  try {
    const users = await User.find()

    const publicDataUsers = users.map(user => ({
      id: user._id,
      email: user.email,
      role: user.role,
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

    const validacionZod = userSchemaZod.safeParse(request.body)
  if(!validacionZod.success){
    return response.status(400).json({
      success: false,
      message: "Error en validación",
      error: validacionZod.error.issues.map(err => err.message)
    })
  }

  const { username, email, password, role } = validacionZod.data
    const foundUser = await User.findOne({ email })
    if (foundUser) {
      return response.status(409).json({ success: false, message: "el email ya esta registrado" })
    }


    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return response.status(400).json({ success: false, error: "tu contraseña esta mal creada" })
    }
    const hashedPassword = await bcrypt.hash(password, 10)

    const validRoles = ["user", "admin"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ success: false, message: "Rol inválido" });
    }
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role
    })

    response.status(201).json({
      success: true,
      message: "¡Cuenta creada con éxito! Ya podés iniciar sesión 🎉",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
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
      return response.status(403).json({ success: false, message: "no estas autorizado" })
    }
    const isValid = await bcrypt.compare(password, findUser.password)//comparo la contraseña

    if (!isValid) {
      return response.status(403).json({ success: false, message: "no estas autorizado" })
    }

    const payLoad = { id: findUser._id, role: findUser.role, email: findUser.email, username: findUser.username }
    const secretKey = process.env.JWT_SECRETKEY
    const options = { expiresIn: "30d" }
    const token = jwt.sign(payLoad, secretKey, options)
 console.log(payLoad)
    response.json({
      success: true,
      message: "Login exitoso",
      token,
      user: {
        id: findUser._id,
        username: findUser.username,
        email: findUser.email,
        role: findUser.role
      }
     
    });
  }
  catch (error) {
    response.status(500).json({ success: false, data: error.message, message: "error en el servidor" })
  }
  
}

// nueva funcion: Actualizar datos del usuario logueado
const updateUser = async (request, response) => {
  const userlogged = request.userLogger;
  if (!userlogged) {
    return response.status(401).json({ success: false, message: "No autorizado" });
  }

  try {
    const validacionZod = userUpdateSchemaZod.safeParse(request.body);//partial() me permite actualizar algunos campos...con safeparse() valido los datos con mi schema de zod.
    if(!validacionZod.success) {
      return response.status(400).json({
        success: false,
        message: "Error en validación",
        error: validacionZod.error.issues.map(err => err.message)//hago una lista de los errores con el msj personalizado que deje en el schema de zod.
      });
    }
 
    const updatedUser = await User.findByIdAndUpdate(
      userlogged.id,
      validacionZod.data,
      { new: true, select: "-password" }
    );

    if (!updatedUser) {
      return response.status(404).json({ success: false, message: "Usuario no encontrado" });
    }

    response.status(200).json({
      success: true,
      data: {
        id: updatedUser._id,
        role: updatedUser.role,
        username: updatedUser.username,
        email: updatedUser.email,
        phone: updatedUser.phone,
        address: updatedUser.address,
        creado: updatedUser.createdAt.toLocaleString("es-AR"),
        actualizado: updatedUser.updatedAt.toLocaleString("es-AR"),
      },
      message: "Usuario actualizado correctamente",
    });
  } catch (error) {
    response.status(500).json({ success: false, message: error.message });
  }
  console.log("actualizaron un usuario");
};
//nueva funcion: cambiar contraseña del usuario logueado
const changePassword = async (req, res) => {
  const userlogged = req.userLogger;

  if (!userlogged) {
    return res.status(401).json({ success: false, message: "No autorizado" });
  }

  try {
    const validacionZod = changePasswordSchemaZod.safeParse(req.body);

    if (!validacionZod.success) {
      return res.status(400).json({
        success: false,
        error: validacionZod.error.issues.map(e => e.message)
      });
    }

    const { currentPassword, newPassword } = validacionZod.data;

    // 🔥 1. buscar usuario con password real
    const user = await User.findById(userlogged.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }

    // 🔥 2. comparar contraseña actual
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "La contraseña actual es incorrecta"
      });
    }

    // 🔥 3. hashear nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 🔥 4. guardar
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Contraseña actualizada correctamente"
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
//nueva funcion: obtener datos del usuario logueado
const usuario = async (req, res) => {
  const userlogged = req.userLogger;
  try {
    const user = await User.findById(req.userLogger.id).select("-password");

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { catchUsuarios, login, register, updateUser, usuario, changePassword }