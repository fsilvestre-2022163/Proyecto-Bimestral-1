'use strict'

import express from 'express'
import { validateJwt, isAdmin, } from '../middlewares/validate.jwt.js'
import {deleteP, get, mostSold, save, searchProduct, update} from '../product/product.controller.js'

const api = express.Router()

api.post('/save',[validateJwt, isAdmin], save)
api.get('/get',[validateJwt], get)
api.post('/searchProduct',[validateJwt], searchProduct)
api.get('/mostSold',[validateJwt], mostSold)
api.put('/update/:id',[validateJwt, isAdmin], update)
api.delete('/delete/:id',[validateJwt, isAdmin], deleteP)

export default api
