'use strict'

import Cart from './cart.model.js'
import Product from '../product/product.model.js'
import mongoose from 'mongoose'


export const createCart = async (id) => {
    try {
        let existingCart = await Cart.findOne({ user: id });
        if (existingCart) {
            console.log('You already have a shopping cart')
            return existingCart
        }
        const newCart = new Cart({
            user: id,
            products: [],
            total: 0
        })
        await newCart.save()
        console.log({ message: 'Shopping cart successfully' })
        return newCart;
    } catch (error) {
        console.error(error)
        throw new Error({ message: 'Error creating shopping cart' })
    }
}

export const addToCart = async (req, res) => {
    try {
        let { product, quantity } = req.body
        let { _id } = req.user
        let price = await Product.findOne({ _id: product })
        let subtotal = quantity * price.price
        subtotal = parseFloat(subtotal.toFixed(2))
        let cart = await Cart.findOne({ user: _id })
        if (!cart) {
            cart = await createCart(_id)
        }
        cart.products.push({
            product: product,
            quantity: quantity,
            price: price.price,
            subtotal: subtotal
        })
        cart.total = cart.products.reduce((total, product) => {
            return total + product.subtotal
        }, 0)
        
        cart.total = parseFloat(cart.total.toFixed(2))
        await cart.save();
        return res.send({ message: 'Product added successfully' })
    } catch (error) {
        console.error(error)
        return res.send({ message: 'Error adding products' })
    }
}

export const remove = async (req, res) => {
    try {
        let { id } = req.params
        let { _id } = req.user
        let producto = await Product.findOne({ _id: id })
        console.log(producto)
        let cart = await Cart.findOne({ user: _id })
        if (!cart) return res.status(404).send({ message: 'You do not have a shopping cart' })
        let ObjectId = mongoose.Types.ObjectId
        let productIndex = cart.products.findIndex(product => product.product.equals(new ObjectId(id)))
        if (productIndex === -1) return res.status(404).send({ message: 'Product not found in shopping cart' })
        cart.products.splice(productIndex, 1)
        cart.total = cart.products.reduce((total, product) => {
            return total + product.subtotal
        }, 0)
        await cart.save()
        return res.send({ message: 'Product removed successfully' })
    } catch (error) {
        console.error(error)
        return res.send({ message: 'Error adding shopping cart' })
    }
}

export const update = async (req, res) => {
    try {
        let { id } = req.params
        let { quantity } = req.body
        let{_id} = req.user
        let cart = await Cart.findOne({user: _id})
        if(!cart){
            return res.status(404).send({message: 'you do not have a shopping cart'})
        }
        let ObjectId = mongoose.Types.ObjectId
        let productIndex = cart.products.findIndex(product => product.product.equals(new ObjectId(id)))
        console.log(productIndex)
        if(productIndex === -1){
            return res.status(404).send({message: 'Product not found in shopping cart'})
        }
        cart.products[productIndex].quantity = quantity
        cart.products[productIndex].total = quantity * cart.products[productIndex].price
        cart.total = cart.products.reduce((total, product) => total + product.subtotal, 0) 
        await cart.save()
        return res.send({message: 'Product quantity updated succesfully', cart})
    } catch (error) {
        console.error(error)
        return res.send({ message: 'Error updating product quantity in cart' })
    }
}