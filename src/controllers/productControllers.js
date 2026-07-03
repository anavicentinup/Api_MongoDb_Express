import { Product } from '../models/productModel.js'
import { productSchemaZod, productUpdateSchemaZod } from '../validations/productValidation.js'

const getProductId = async (request, response) => {
    const userlogged = request.userLogger
    try {
        const id = request.params.id

        const foundProduct = await Product.findOne({
            _id: id,
            userId: userlogged.id
        },
            { userId: 0 })
        if (!foundProduct) return response.status(404).json({ error: "Producto no encontrado o no te pertenece" })

        console.log("pidieron un producto por id")

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
            data: error.message,
            message: "error al buscar el producto"
        })
        console.log("pidieron un producto por id")
    }
}

const createProduct = async (request, response) => {
    const userlogged = request.userLogger
    try {
        const validacionZod = productSchemaZod.safeParse(request.body);
        if (!validacionZod.success) {
            return response.status(400).json({
                success: false,
                errors: validacionZod.error.issues.map(err => err.message)
            })
        }

        const body = validacionZod.data;

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
        console.log("crearon un producto")
        response.status(200).json({
            success: true,
            data: publicDataProduct,
            message: "producto creado exitosamente"
        })

    } catch (error) {
        response.status(500).json({
            success: false,
            data: error.message,
            message: "error al crear el producto"
        })
    }

}

const updateProduct = async (request, response) => {
    const userlogged = request.userLogger
    const id = request.params.id

    try {
        const validacionZod = productUpdateSchemaZod.safeParse(request.body);
        if (!validacionZod.success) {
            return response.status(400).json({
                success: false,
                errors: validacionZod.error.errors.map(err => err.message)
            })
        }
        const body = validacionZod.data;
        if (body.stock !== undefined) {
            body.available = body.stock > 0
        }

        const updatedProduct = await Product.findOneAndUpdate(
            {
                _id: id,
                userId: userlogged.id
            },
            body,
            {
                returnDocument: 'after',
                select: { userId: 0 }
            }
        )

        if (!updatedProduct) return response.status(404).json({ success: false, message: "no existe ese producto" })

        const publicData = {
            id: updatedProduct._id,
            name: updatedProduct.name,
            price: updatedProduct.price,
            category: updatedProduct.category,
            stock: updatedProduct.stock,
            available: updatedProduct.available,
            createdAt: updatedProduct.createdAt.toLocaleString("es-AR"),
            updatedAt: updatedProduct.updatedAt.toLocaleString("es-AR")
        };
        console.log("actualizaron un producto")
        response.status(200).json({
            success: true,
            data: publicData,
            message: "producto actualizado correctamente"
        })
    } catch (error) {
        return response.status(500).json({
            success: false,
            data: error.message,
            message: "error al actualizar el producto"
        })
    }
}

const deleteProduct = async (request, response) => {
    const userlogged = request.userLogger

    try {
        const deletedProduct = await Product.findOneAndDelete({
            _id: request.params.id,
            userId: userlogged.id
        })

        if (!deletedProduct) return response.status(404).json({ success: false, error: "producto no encontrado o no te pertenece" })

        const publicData = {
            id: deletedProduct._id,
            name: deletedProduct.name,
            price: deletedProduct.price,
            category: deletedProduct.category,
            stock: deletedProduct.stock,
            createdAt: deletedProduct.createdAt.toLocaleString("es-AR"),
            updatedAt: deletedProduct.updatedAt.toLocaleString("es-AR")
        }

        console.log("pidieron eliminar un producto")
        return response.status(200).json({
            success: true,
            product: publicData,
            message: "producto eliminado correctamente"
        })
    }

    catch (error) {
        response.status(500).json({ success: false, data: error.message, message: "error al eliminar el producto" })
    }
}

const getUserProducts = async (request, response) => {
    const userlogged = request.userLogger
    try {
        const { category, name, minPrice, maxPrice, available, page = 1, limit = 10 } = request.query;
        let filterProducts = {}

        if (userlogged.role !== "admin") {
            filterProducts.userId = userlogged.id;
        }

        if (category) {
            const categoryDecoded = decodeURIComponent(category);
            filterProducts.category = { $regex: categoryDecoded, $options: "i" };
        }
        if (name) {
            filterProducts.name = { $regex: name, $options: "i" };
        }
        if (minPrice && maxPrice) {
            filterProducts.price = { $gte: Number(minPrice), $lte: Number(maxPrice) };
        }
        if (available) {
            filterProducts.available = available === "true";
        }

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        const products = await Product.find(filterProducts, { userId: 0 })
            .skip(skip)
            .limit(limitNum);

        const total = await Product.countDocuments(filterProducts);

        const publicData = products.map(product => ({
            id: product._id,
            name: product.name,
            price: product.price,
            category: product.category,
            stock: product.stock,
            available: product.available,
            createdAt: product.createdAt.toLocaleString("es-AR"),
            updatedAt: product.updatedAt.toLocaleString("es-AR")
        }));
        console.log("pidieron los productos")
        response.status(200).json({
            success: true,
            data: publicData,
            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(total / limitNum)
            },
            message: "productos traidos correctamente"
        })

    }
    catch (error) {
        response.status(500).json({
            success: false,
            data: error.message,
            message: "error al traer los productos"
        })
    }
}

const getPublicProducts = async (request, response) => {
    try {
        const { category, name, minPrice, maxPrice, available, page = 1, limit = 10 } = request.query;
        let filterProducts = {};
        if (category) {
            const categoryDecoded = decodeURIComponent(category);//decodeURIComponent: funcion js nativa para decodificar caracteres especiales en la URL.
            filterProducts.category = {
                $regex: categoryDecoded,
                $options: "i"// me toma MAY y MIN
            };
        }
        if (name) {
            filterProducts.name = { $regex: name, $options: 'i' };
        }

        if (minPrice && maxPrice) {
            filterProducts.price = {
                $gte: Number(minPrice),
                $lte: Number(maxPrice)
            }
        }

        if (available) {
            filterProducts.available = available === 'true';
        }

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        const products = await Product.find(filterProducts, { userId: 0 })
            .skip(skip)
            .limit(limitNum);

        const total = await Product.countDocuments(filterProducts);

        const productosFormateados = products.map((product) => {
            const prod = product.toObject();

            if (prod.createdAt) {
                prod.createdAt = new Date(prod.createdAt).toLocaleString("es-AR");
            }

            if (prod.updatedAt) {
                prod.updatedAt = new Date(prod.updatedAt).toLocaleString("es-AR");
            }

            return prod;
        });
        console.log("pidieron productos públicos");
        response.status(200).json({
            success: true,
            data: productosFormateados,
            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(total / limitNum)
            },
            message: "productos públicos obtenidos correctamente",
        });
    } catch (error) {
        response.status(500).json({
            success: false,
            data: error.message,
            message: "error al obtener productos públicos",
        });
    }
};

export { getPublicProducts, getUserProducts, getProductId, createProduct, updateProduct, deleteProduct }