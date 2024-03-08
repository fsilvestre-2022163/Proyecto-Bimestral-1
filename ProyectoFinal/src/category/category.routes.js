'use strict'

import { Router } from 'express'
import {  deleteCategory, get, save, update } from './category.controller.js'
import { validateJwt, isAdmin} from '../middlewares/validate.jwt.js'


const api = Router()

api.post('/save',[validateJwt, isAdmin], save)
api.put('/update/:id',[validateJwt, isAdmin], update)
api.get('/get', [validateJwt], get)
api.delete('/delete/:id',[validateJwt, isAdmin], deleteCategory)

export default api