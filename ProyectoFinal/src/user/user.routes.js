'use strict'

import express from 'express'
import { validateJwt, isAdmin, } from '../middlewares/validate.jwt.js'
import {register, login, deleteUser, get, updateUser} from './user.controller.js'

const api = express.Router()

api.delete('/delete/:id', [validateJwt] , deleteUser)
api.get('/get',[validateJwt, isAdmin], get)
api.post('/register', register)
api.post('/login', login)
api.put('/update/:id',[validateJwt],updateUser)

export default api
