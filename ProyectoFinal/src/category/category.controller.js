'use strict'
import Category from './category.model.js'
import Product from '../product/product.model.js'

export const save = async (req, res) => {
    try {
        let data = req.body
        let category = new Category(data)
        await category.save()
        return res.send({ message: 'Category saved successfully' })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error saving category' })
    }
}
export const get = async (req, res) => {
    try {
        let category = await Category.find();
        res.status(200).send(category);
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error getting Category' })
    }
};

export const update = async (req, res) => {
    try {
        let { id } = req.params
        let data = req.body
        let updateCategory = await Category.findOneAndUpdate(
            { _id: id },
            data,
            { new: true }
        )
        if (!updateCategory) return res.status(404).send({ message: 'Category not found, not update' })
        return res.send({ message: 'Category update successfully', updateCategory })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error updating category' })
    }
}


export const deleteCategory = async (req, res) => {
    try {
        let { id } = req.params;
        // Encuentra la categoría que se va a eliminar
        let deletedCategory = await Category.deleteOne({ _id: id })
        if (!deletedCategory) return res.status(404).send({ message: 'Category not found, not deleted' });
        // Encuentra la categoría predeterminada
        let defaultCategory = await Category.findOne({ name: 'Default' });
        // Mueve los productos de la categoría eliminada a la categoría predeterminada
        await Product.updateMany({ category: id }, { category: defaultCategory._id });
        res.send({ message: 'Successfully deleted Category' });
    } catch (err) {
        console.error(error)
        return res.status(500).send({ message: 'Error deleting category' })
    }
};
