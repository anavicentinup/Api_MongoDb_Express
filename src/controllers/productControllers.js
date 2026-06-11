import { Product } from '../models/productModel.js'



const getProducts = async (request, response) => {
    const userlogged = request.userLogger
    if (!userlogged) return response.status(401).json({ error: "no podes ver los productos porque estas desautorizado" })
    try {

        const filterProducts = await Product.find({ userId: userlogged.id }, { userId: 0 })

        const productosFormateados = filterProducts.map(product => {
            const prodIndForm = product.toObject();
            if (prodIndForm.createdAt) {
                prodIndForm.createdAt = new Date(prodIndForm.createdAt).toLocaleString("es-AR");
            }
            if (prodIndForm.updatedAt) {
                prodIndForm.updatedAt = new Date(prodIndForm.updatedAt).toLocaleString("es-AR");
            }
            return prodIndForm;
        });

        response.status(200).json({
            success: true,
            data: productosFormateados,
            message: "productos traidos correctamente"

        })
        
    }
    catch (error) {
        response.status(500).json({
            success: false,
            message: error.message

        })
    }
    console.log("pidieron los productos")
}

const getProductId = async (request, response) => {
    const userlogged = request.userLogger
    if (!userlogged) return response.status(401).json({ error: "no podes buscar porque estas desautorizado" })
    try {
        const id = request.params.id //recupero los params de la ruta, es un objeto propio de express que contiene los parámetros dinámicos de la ruta, en este caso el id del producto.

        const foundProduct = await Product.findOne({
            _id: id,
            userId: userlogged.id
        }, { userId: 0 })//busco el producto por su id y por el id del usuario, para asegurarme que el producto le pertenece al usuario logueado, y le digo que no me traiga el userId porque no es necesario mostrarlo.

        if (!foundProduct) return response.status(404).json({ error: "Producto no encontrado o no te pertenece" })//return implicito de arrow fuction


        response.status(200).json({
            success: true,
            data: {
                ...foundProduct.toObject(),
                createdAt: foundProduct.createdAt.toLocaleString("es-AR"),
                updatedAt: foundProduct.updatedAt.toLocaleString("es-AR")
            },
            message: "producto encontrado efectivamente"
        })
     
    }
    catch (error) {
        response.status(500).json({
            success: false,
            message: error.message
        })
    }
console.log("pidieron un producto por id")
}

const createProduct = async (request, response) => {
    const userlogged = request.userLogger
    if (!userlogged) return response.status(401).json({ success: false, error: "no podes crear porque estas desautorizado" })
    try {
        const body = request.body
        const newProduct = await Product.create({
            name: body.name,
            price: body.price,
            category: body.category,
            stock: body.stock,
            available: body.stock > 0 ? true : false,
            userId: userlogged.id
        })

        const publicDataProduct = {
            id: newProduct._id,
            name: newProduct.name,
            price: newProduct.price,
            category: newProduct.category,
            stock: newProduct.stock,
            available: newProduct.available,
            createdAt: newProduct.createdAt.toLocaleString("es-AR"),
            updatedAt: newProduct.updatedAt.toLocaleString("es-AR")

        }

        response.status(200).json({
            success: true,
            data: publicDataProduct,
            message: "producto creado exitosamente"
        })
        
    } catch (error) {
        response.status(500).json({
            success: false,
            message: error.message
        })
    }
    console.log("crearon un producto")
}

const updateProduct = async (request, response) => {
    const userlogged = request.userLogger
    const id = request.params.id
    const body = request.body
    if (!userlogged) return response.status(401).json({ success: false, error: "desautorizado para actualizar" })
    if (body.stock !== undefined) {
        body.available = body.stock > 0
    }
    try {

        const updatedProduct = await Product.findOneAndUpdate(
            {
                _id: id,
                userId: userlogged.id
            },
            body,
            {
                new: true,
                select: { userId: 0 }
            }
        )

        if (!updatedProduct) return response.status(404).json({ success: false, message: "no se encuentra" })

        response.status(200).json({
            success: true,
            data: {
                ...updatedProduct.toObject(),
                createdAt: updatedProduct.createdAt.toLocaleString("es-AR"),
                updatedAt: updatedProduct.updatedAt.toLocaleString("es-AR")
            },
            message: "producto actualizado correctamente"
        })
    } catch (error) {
        return response.status(500).json({
            success: false,
            message: error.message
        })
    }
    console.log("actualizaron un producto")
}

const deleteProduct = async (request, response) => {
    const userlogged = request.userLogger
    if (!userlogged) return response.status(401).json({ success: false, error: "no podes borrar porque estas desautorizado" })
    try {
        const deletedProduct = await Product.findOneAndDelete({
            _id: request.params.id,
            userId: userlogged.id//tiene q ser el nombre de la db
        }) //podria agregar una proyeccion {userId: 0} para q no se vea el id.

        if (!deletedProduct) return response.status(404).json({ success: false, error: "producto no encontrado o no te pertenece" })
        //otra forma de eliminar el userId del producto borrado, pero no es necesario porque no lo estoy mostrando en la respuesta.
        //  const product = deletedProduct.toObject()
        // delete product.userId

        const publicDataProduct = { ...deletedProduct }

        const publicData = {
            id: deletedProduct._id,
            name: deletedProduct.name,
            price: deletedProduct.price,
            category: deletedProduct.category,
            stock: deletedProduct.stock,
            createdAt: deletedProduct.createdAt.toLocaleString("es-AR"),
            updatedAt: deletedProduct.updatedAt.toLocaleString("es-AR")
        }
        return response.status(200).json({
            success: true,
            product: publicData,
            message: "producto eliminado correctamente"

        })
    }

    catch (error) {
        response.status(500).json({ success: false, message: error.message })
    }
    console.log("borraron un producto")
}

export { getProducts, getProductId, createProduct, updateProduct, deleteProduct }