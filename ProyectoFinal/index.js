import { initServer } from './configs/app.js'
import { connect } from './configs/mongo.js'
import User from './src/user/user.model.js'
import Category from './src/category/category.model.js'
import { encrypt } from './src/utils/validator.js'

const userDefualt = async()=>{
    try {
        let existUser = await User.findOne()
        if(!existUser){
            const newUser = new User({
                name: "Josué",
                surname: "Noj",
                username: "josunoj",
                email: "josue@gmail.com",
                password: "kinalitoIN6AV",
                address: "6A Avenida 13-54, Cdad. de Guatemala 01007",
                phone: "65986532",
                role: "ADMIN"

            })
            newUser.password = await encrypt(newUser.password)
            await newUser.save()
            console.log('User default created', newUser)
        }
        return console.log('User default exists')
    } catch (error) {
        console.error(error)
        return error
    }
}

const categoryDeafualt = async()=>{
    try {
        let existCategory = await Category.findOne()
        if(!existCategory){
            let newCategory = new Category({
                name: 'Default',
                description: 'Categoria no establecida'
            })
            await newCategory.save()
            console.log('Category default created', newCategory)
        }
        return console.log('Category default exists')
    } catch (error) {
        console.error(error)
        return error
    }
}
categoryDeafualt()
userDefualt()
initServer()
connect()