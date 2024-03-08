'use strict'

import { Router } from "express";
import { validateJwt } from '../middlewares/validate.jwt.js'
import { addToCart, remove, update } from "./cart.controller.js";


const api = Router()

api.post('/add', [validateJwt], addToCart)
api.delete('/delete/:id', [validateJwt], remove)
api.put('/update/:id', [validateJwt], update)


export default api