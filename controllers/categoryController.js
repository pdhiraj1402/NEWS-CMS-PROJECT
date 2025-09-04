const categoryModel = require('../models/Category');
const createError = require("../utils/error-message");

const allcategory = async (req, res, next) => {
    try{
        const categories = await categoryModel.find();
        res.render('admin/categories', {categories, role:req.role});
    }
    catch(error)
    {
        next(error);
    }
};

const addCategoryPage = async (req, res) => {
    res.render('admin/categories/create', {role:req.role});
};

const addCategory = async (req, res, next) => {
    try {
        console.log(req.body);
        await categoryModel.create(req.body);
        res.redirect('/admin/category');
    } catch (error) {
        // res.status(400).send(error);
        next(error);
    }
};

const updateCategoryPage = async (req, res, next) => { 
    const id = req.params.id;
    console.log(id);
    try{
        
        const category = await categoryModel.findById(id);
        if(!category){
            // return res.status(404).send('Category not found');
            return next(createError('Category Not Found', 404));
        }
        res.render('admin/categories/update', {category, role:req.role});
    }
    catch(error){
        // res.status(500).send('Internal Server Error');
        next(error);
    }
};

const updateCategory = async (req, res, next) => { 
    try{
        const id = req.params.id;
        const {name, description} = req.body;
        const category = await categoryModel.findByIdAndUpdate(id, req.body);
        if(!category){
            // return res.status(404).send('Category not found');
            return next(createError('Category Not Found', 404));
        }
        res.redirect('/admin/category');
    }
    catch(error){
        // res.status(500).send('Internal Server Error');
        next(error);
    }
};

const deleteCategory = async (req, res, next) => {
    try{
        const id = req.params.id;
        const category = await categoryModel.findByIdAndDelete(id);
        if(!category){
            // return res.status(404).send('Category not found');
            return next(createError('Category Not Found', 404));
        }
        res.json({success:true});
    }catch(err){
        // res.status(500).send('Internal Server Error');
        next(error);
    }
};

module.exports = {
    allcategory,
    addCategoryPage,
    addCategory,
    updateCategoryPage,
    updateCategory,
    deleteCategory
};