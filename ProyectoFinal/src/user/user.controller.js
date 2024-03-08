'use strict'

import User from './user.model.js'
import { encrypt, checkPassword, checkUpdate } from '../utils/validator.js'
import { generateJwt } from '../utils/jwt.js'
import bcrypt from 'bcrypt'

export const register = async (req, res) => {
    try {
        let data = req.body
        data.password = await encrypt(data.password)
        let user = new User(data)
        await user.save()
        return res.send({ message: 'Registered successfully' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error registering user', err })
    }
}

export const login = async (req, res) => {
    try {
        let { username, email, password } = req.body
        let user = await User.findOne({
            $or: [{ username }, { email }]
        })
        if (user && await checkPassword(password, user.password)) {
            let loggedUser = {
                uid: user._id,
                username: user.username,
                name: user.name,
                role: user.role
            }
            let token = await generateJwt(loggedUser)
            return res.send(
                {
                    message: `Welcome ${user.name}`,
                    loggedUser,
                    token
                }
            )
        }
        return res.status(404).send({ message: 'Invalid credentials' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Failed to login' })
    }
}

export const get = async (req, res) => {
    try {
        let user = await User.find();
        res.status(200).send(user);
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error getting Users' })
    }
};

export const deleteUser = async (req, res) => {
    try {
        let { id } = req.params;
        let { password } = req.body;
        // Obtener el usuario a eliminar
        let userToDelete = await User.findById(id);
        if (!userToDelete) return res.status(404).send({ message: 'Account not found and not deleted' });
        // Verificar la contraseña ingresada con la contraseña almacenada
        let passwordMatch = await bcrypt.compare(password, userToDelete.password);
        if (passwordMatch) {
            // Si la contraseña es correcta puede eliminar el usuario
            let deletedUser = await User.findOneAndDelete({ _id: id });
            return res.send({ message: `Account with username ${deletedUser.username} deleted successfully` });
        } else {
            // Contraseña incorrecta
            return res.status(401).send({ message: 'Incorrect password. Account not deleted.' });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Do you wanna delete your account? Put your password' });
    }
};

export const updateUser = async (req, res) => {
    try {
        let { id } = req.params;
        let { role } = req.body;
        let data = req.body

        // Valida que el rol sea válido (ADMIN o CLIENT)
        if (!['ADMIN', 'CLIENT'].includes(role)) {
            return res.status(400).send({ message: 'Rol no válido' });
        }

        // Actualiza el rol del usuario
        let updatedUserRole = await User.findByIdAndUpdate(id, { role }, { new: true });
        let updatedUser = await User.findOneAndUpdate(
            { _id: id },
            data,
            { new: true }
        )
        if (!updatedUser) {
            return res.status(404).send({ message: 'Usuario no encontrado' });
        }
        if (!updatedUserRole) {
            return res.status(404).send({ message: 'Usuario no encontrado' });
        }


        return res.send({ message: 'Rol de usuario actualizado correctamente', user: updatedUser });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error al actualizar el rol del usuario' });
    }
}