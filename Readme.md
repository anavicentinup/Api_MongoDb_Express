# API REST - Gestión de Usuarios y Productos

Proyecto backend desarrollado con Node.js, Express y MongoDB que implementa autenticación mediante JWT, control de acceso por roles, validación de datos con Zod y gestión de productos asociados a usuarios.

La aplicación sigue el patrón de arquitectura MVC (Model - View - Controller) y permite registrar usuarios, iniciar sesión, administrar perfiles y gestionar productos de forma segura.

## Tecnologías utilizadas

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT (JSON Web Token)
* BcryptJS
* Zod
* Dotenv
* Express Rate Limit

---

## Arquitectura MVC

```text
src
│
├── config
│   └── mongoDbConection.js
│
├── controllers
│   ├── authControllers.js
│   └── productControllers.js
│
├── middlewares
│   ├── authMiddleware.js
│   └── limiterMiddleware.js
│
├── models
│   ├── userModel.js
│   └── productModel.js
│
├── routes
│   ├── authRoutes.js
│   └── productRoutes.js
│
├── test
│
├── validations
│   ├── userValidation.js
│   └── productValidation.js
│
└── app.js

---

## Instalación

Clonar repositorio: git clone "https://github.com/anavicentinup/Api_MongoDb_Express.git"

Instalar dependencias: npm install

Crear archivo `.env`

```env
PORT=3000

URI_MONGO_DB=mongodb://localhost:27017/proyecto

JWT_SECRETKEY=tu_clave_secreta
```

Ejecutar servidor: "npm run dev"

---
| Acción                   | User | Admin  |
| ------------------------ | ---- | -----  |
| Registrarse              | ✅    | ✅     |
| Login                    | ✅    | ✅     |
| Ver perfil               | ✅    | ✅     |
| Modificar perfil         | ✅    | ✅     |
| Cambiar contraseña       | ✅    | ✅     |
| Crear producto           | ✅    | ❌     |
| Editar producto propio   | ✅    | ❌     |
| Eliminar producto propio | ✅    | ❌     |
| Ver productos propios    | ✅    | ❌     |
| Ver todos los productos  | ❌    | ✅     |
| Ver usuarios registrados | ❌    | ✅     |



-------------------------------
Rutas de Autenticación
Método	Ruta	                  Función
POST	/api/auth/register	      Registrar usuario
POST	/api/auth/login	          Iniciar sesión
GET	  /api/auth/users	          Obtener todos los usuarios (Admin)
GET	  /api/auth/usuario	        Obtener usuario logueado
PUT	  /api/auth/update	        Actualizar perfil
PUT	  /api/auth/updatePassword	Cambiar contraseña

Rutas de Productos

Método	Ruta	Función
GET	    /api/products/productPublic	    Obtener productos públicos
GET	    /api/products	                  Obtener productos propios
GET	    /api/products/:id              	Obtener producto por ID
POST    /api/products	                  Crear producto
PUT	    /api/products/:id	              Actualizar producto
DELETE	/api/products/:id	              Eliminar producto


-------------------------------
Ejemplos de Requests: 
Login
POST /auth/login
{
  "email": "usuario@gmail.com",
  "password": "Abc1234!"
}
--------------------------------
Crear producto
POST /products
{
  "name": "Crema Facial",
  "price": 3500,
  "category": "Cosmeticos",
  "stock": 10
}

             Query Params
-category:Filtrar por categoría
-name:	Filtrar por nombre
-minPrice:	Precio mínimo
-maxPrice:	Precio máximo
-available:	Disponibilidad
-page:	Número de página
-limit:	Cantidad de resultados por página

Ejemplos de Query Params: 

Buscar por categoría: (http://localhost:3001/api/products/productPublic?category=camisetas)

Buscar por nombre: http://localhost:3001/api/products/productPublic?name=chipa

Filtrar por disponibilidad: http://localhost:3001/api/products/productPublic?available=true

Filtrar por rango de precios: 
http://localhost:3001/api/products/productPublic?minPrice=1000&maxPrice=5000

Paginación:
http://localhost:3001/api/products/productPublic?page=2&limit=5

Combinar filtros
http://localhost:3001/api/products/productPublic?category=camisetas&minPrice=10000&maxPrice=25000&page=1&limit=3
