# API de Gestión de Productos - TP Backend

¡Hola! Este es mi proyecto integrador de Backend para la UTN. Es una API REST desarrollada con Node.js y Express, conectada a una base de datos en la nube con MongoDB Atlas utilizando Mongoose.

## 🚀 Características y Requisitos del TP
La API cuenta con rutas públicas para la autenticación y un conjunto de endpoints privados (protegidos mediante un Middleware de autenticación con JWT) para que cada usuario pueda gestionar únicamente sus propios productos.

- **Estructura:** Arquitectura basada en el patrón MVC (Model-View-Controller).
- **Seguridad:** Rutas protegidas mediante un Token en las cabeceras (Headers) y contraseñas seguras criptográficamente.
- **Base de Datos:** MongoDB Atlas (en la nube) con persistencia de datos reales.
- **Formato:** Respuestas JSON formateadas con fechas amigables configuradas en formato local (`es-AR`).

---

## 🛠️ Tecnologías Utilizadas
* **Node.js** (Entorno de ejecución)
* **Express** (Framework para el servidor y enrutado)
* **MongoDB & Mongoose** (Base de datos NoSQL y ODM)
* **Dotenv** (Gestión de variables de entorno seguras)
* **Cors** (Intercambio de recursos de origen cruzado)
* **Bruno** (Herramienta de pruebas para la API)

---

## 📂 Estructura del Proyecto (MVC)
```text
├── src/
│   ├── config/       # Conexión a MongoDB Atlas
│   ├── controllers/  # Lógica de los endpoints
│   ├── middlewares/  # Control de acceso y verificación de Tokens 
│   ├── models/       # Esquemas de Mongoose (Product, User)
│   ├── routes/       # Definición de rutas (productRouter, authRouter)
│   └─── app.js        # Configuración de Express,
│                        Arranque de la aplicación y base de datos
├── .env.example      # Plantilla de variables de entorno
├── README.md         # Documentación del proyecto
└── package.json      # Dependencias del proyecto

⚙️ Configuración e Instalación Local
1. Clonar o descargar el proyecto e instalar dependencias: npm install
 
2. Configurar las Variables de Entorno:
     Crea un archivo .env en la raíz del proyecto basándote en el archivo .env.example y completa tus credenciales secretas:
       PORT= xxxx
       MONGO_URI=tu_cadena_de_conexion_de_mongo_atlas

3. Iniciar el servidor en modo desarrollo: npm run dev
 

🧪 Colección de Pruebas (Bruno)Para evaluar y probar los endpoints de la API, se incluyeron los archivos de configuración de Bruno directamente dentro de las carpetas de este proyecto.Solo debes abrir la aplicación Bruno, seleccionar "Open Collection" y apuntar a la carpeta del proyecto.Endpoints Disponibles: 


### 🧪 Detalle de la Colección de Pruebas (Endpoints)

| Método      | Endpoint          | Descripción                                         | Tipo de Acceso         | Middleware Auth |

| **POST**  | `/api/auth/register`| Registro de nuevos usuarios en la base de datos.     | **Público**           | ❌ No |
| **POST**  | `/api/auth/login`   | Autenticación de usuarios. Devuelve el Token JWT.    | **Público**           | ❌ No |
| **GET**   | `/api/products`     | Lista únicamente los productos del usuario logueado. | **Privado**           |  Sí |
| **POST**  | `/api/products`     | Crea un nuevo producto asociado al ID del usuario.   | **Privado**           |  Sí |
| **PATCH** | `/api/products/:id` | Modifica un producto(solo si le pertenece al usuario)| **Privado**           |  Sí |
| **DELETE**| `/api/products/:id` | Elimina un producto de la base de datos (solo si le pertenece).| **Privado** |  Sí |

Desarrollado con ❤️ por Anabella Vicentin - 2026.





