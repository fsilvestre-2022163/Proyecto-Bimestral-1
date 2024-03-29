'use strict' 

import { Schema, model} from 'mongoose'
const productSchema = Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true 
    },
    stock: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    sellcount:{
        type: Number,
        default: 0
    },
    category: {
        type: Schema.ObjectId,
        ref: 'category',
        required: true
    }
    
},{
    versionKey: false
})

export default model('product', productSchema)