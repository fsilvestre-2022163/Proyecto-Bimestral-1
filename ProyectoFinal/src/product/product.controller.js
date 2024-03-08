'use strict'
import Product from './product.model.js'
import Category from '../category/category.model.js'

export const save = async (req, res) => {
    try {
        let data = req.body
        let category = await Category.findOne({ _id: data.category })
        if (!category) return res.status(404).send({ message: 'Category not found' })
        let product = new Product(data)
        await product.save()
        return res.send({ message: 'Product saved successfully' })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error saving Product' })
    }
}

export const get = async (req, res) => {
    try {
        let product = await Product.find();
        res.status(200).send(product);
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error getting Product' })
    }
};


export const update = async (req, res) => {
    try {
        let { id } = req.params
        let data = req.body
        let updateProduct = await Product.findOneAndUpdate(
            { _id: id },
            data,
            { new: true }
        )
        if (!updateProduct) return res.status(404).send({ message: 'Product not found, not update' })
        return res.send({ message: 'Product update successfully', updateProduct })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error updating Product' })
    }
}

export const deleteP = async(req, res)=>{
    try {
        let { id } = req.params
        let deleteProduct = await Product.deleteOne({_id: id})
        if(deleteProduct.deletedCount == 0) return res.status(404).send({message: 'Product not found, not deleted'})
        return res.send({message: 'Deleted prodcut successfully'})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error deleting product'})
    }
}

export const searchProduct = async (req, res)=>{
    try {
        let {category, name} = req.body
        let products
        if(!name){
            products = await Product.find({category: category}).populate('category',['name', 'description'])
            return res.send(products)
        }
        if(!category){
            const product = await Product.find({name: name}).populate('category', ['name', 'description'])
            return res.send(product)
        }
    } catch (err) {
        console.error(err)
        res.status(500).send({message: 'Error Searching products'})
    }
}

export const mostSold = async(req, res) => {
    try {
        let products = await Product.find().sort({ sellCount: -1 }).populate('category', ['name', 'description'])
        return res.send({ message: 'the best seller in order', products})
    } catch (error) {
        console.error(error)
        res.status(500).send({ message: 'Error displaying mostSold' })
    }
}