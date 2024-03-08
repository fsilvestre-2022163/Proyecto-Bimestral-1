import { Schema, model } from 'mongoose'

const cartSchema = Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        require: true
    },
    products: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: 'product',
            require: true
        },
        quantity: {
            type: Number,
            require: true
        },
        price: {
            type: Number,
            required: true
        },
        subtotal: {
            type: Number,
            required: true
        }

    }],
    total: {
        type: Number,
        require: true
    }

}, {
    versionKey: false
})

export default model('cart', cartSchema)