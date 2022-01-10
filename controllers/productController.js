const { Product, Category } = require('../models')
const rupiahFormatter = require('../utils/rupiahFormatter')

exports.add = async (req, res) => {
    const { title, price, stock, CategoryId } = req.body;
    const {role} = req.user
    
    if (role !== 'admin') {
        return res.status(403).json({
            status: 'Forbidden',
            message: 'User unauthorized'
        })
    }

    try {
        //mencari category dengan id tersebut
        const category = await Category.findByPk(CategoryId)

        //jika tidak ada maka tampilkan error not found
        if (category === null) {
            return res.status(404).json({
                status: 'Not Found',
                message: 'Category not found'
            })
        }

        //membuat product dengan data tersebut
        const product = await Product.create({title, price, stock, CategoryId,})

        return res.status(201).json({
            product: {
                id: product.dataValues.id,
                title: product.dataValues.title,
                price: rupiahFormatter(product.dataValues.price),
                stock: product.dataValues.stock,
                CategoryId: product.dataValues.CategoryId,
                createdAt: product.dataValues.createdAt,
                updatedAt: product.dataValues.updatedAt,
            }
        })


    } catch (error) {
        // jika terjadi error sequelize terjadi
        // maka tampilkan respon error
        if (error.name.includes("Sequelize")) {
            const err = error.errors
            const errorList = err.map(d => {
                let obj = {}
                obj[d.path] = d.message
                return obj;
            })
    
            return res.status(400).json({
                status: 'Data Error',
                message: errorList
            });
        }
    
        //jika terjadi server error
        //maka kembalikan respon tersebut
        return res.status(500).json({
            status: 'Server Error',
            message: error.message
        })
    }
}

exports.show = async (req, res) => {
    try {
        const products = await Product.findAll();

        products.forEach((product) => {
            product.price = rupiahFormatter(product.price)
        })

        return res.status(200).json({
            products
        })
    } catch (error) {
        //jika terjadi server error
        //maka kembalikan respon tersebut
        return res.status(500).json({
            status: 'Server Error',
            message: error.message
        })
    }
}

exports.edit = async (req, res) => {
    const {price:newPrice, stock:newStock, title:newTitle} = req.body
    const {role} = req.user
    const {productId} = req.params

    if (role !== "admin") {
        return res.status(403).json({
            status: 'Forbidden',
            message: 'User unauthorized'
        })
    }

    try {
        const product = await Product.findByPk(productId)

        if (product === null) {
            return res.status(404).json({
                status: "Not Found",
                message: "Product not found"
            })
        }

        const newProduct = await product.set({
            price: newPrice,
            stock: newStock,
            title: newTitle,
        })

        const result = await newProduct.save()
        result.price = rupiahFormatter(result.price)


        return res.status(200).json({
            product: result
        })
    } catch (error) {
        // jika terjadi error sequelize terjadi
        // maka tampilkan respon error
        if (error.name.includes("Sequelize")) {
            const err = error.errors
            const errorList = err.map(d => {
                let obj = {}
                obj[d.path] = d.message
                return obj;
            })
    
            return res.status(400).json({
                status: 'Data Error',
                message: errorList
            });
        }
    
        //jika terjadi server error
        //maka kembalikan respon tersebut
        return res.status(500).json({
            status: 'Server Error',
            message: error.message
        })       
    }
}

exports.editCategoryId = async (req, res) => {
    const {CategoryId:newCategoryId} = req.body
    const {productId} = req.params
    const {role} = req.user

    if (role !== "admin") {
        return res.status(403).json({
            status: "Forbidden",
            message: "User unauthorized"
        })
    }

    try {
        const product = await Product.findByPk(productId)
        
        if (product === null) {
            return res.status(404).json({
                status: 'Not Found',
                message: 'Product not found',
            })
        }

        const category = await Category.findByPk(newCategoryId)

        if (category === null) {
            return res.status(404).json({
                status: 'Not Found',
                message: 'Category not found',
            })
        }

        const newProduct = await product.set({
            CategoryId: newCategoryId
        })

        const result = await newProduct.save()
        result.price = rupiahFormatter(result.price)
        
        return res.status(200).json({
            product: result    
        })
    } catch (error) {
        // jika terjadi error sequelize terjadi
        // maka tampilkan respon error
        if (error.name.includes("Sequelize")) {
            const err = error.errors
            const errorList = err.map(d => {
                let obj = {}
                obj[d.path] = d.message
                return obj;
            })
    
            return res.status(400).json({
                status: 'Data Error',
                message: errorList
            });
        }
    
        //jika terjadi server error
        //maka kembalikan respon tersebut
        return res.status(500).json({
            status: 'Server Error',
            message: error.message
        })
    }
}