const categoryModel = require("../models/Category");
const newsModel = require("../models/News");
const userModel = require("../models/User");
const fs = require("fs");
const path = require("path");
const createError = require("../utils/error-message");
const {validationResult} = require("express-validator");

const allArticle = async (req, res, next) => {
  try{
    let articles;
    if(req.role==="admin"){
      articles = await newsModel.find()
                        .populate('category', 'name')
                        .populate('author', 'fullname');
    }
    else{
      articles = await newsModel.find({author:req.id})
                        .populate('category', 'name')
                        .populate('author', 'fullname');
    }
    res.render("admin/article", {role:req.role, articles});
  }
  catch(error){
    // console.error(error);
    // res.status(500).send('Server Error');
    next(error);
  }
};

const addArticlePage = async (req, res) => {
  const categories = await categoryModel.find();
  res.render("admin/article/create", {role:req.role, categories, errors:0});
};

const addArticle = async (req, res, next) => {

  const errors = validationResult(req);
  if(!errors.isEmpty()){
      const categories = await categoryModel.find();
      return res.render("admin/article/create", {
          role:req.role,
          categories,
          errors:errors.array()
      });
  }
 
  try{
    const {title, content, category} = req.body;
    const article = new newsModel({
      title,
      content,
      category,
      author:req.id,
      image:req.file.filename
    }); 

    await article.save();
    res.redirect('/admin/article');
  }
  catch(error){
    // res.status(500).send('Internal Server Error');
    next(error);
  }
};

const updateArticlePage = async (req, res, next) => {
  const id = req.params.id;
  try{
    const article = await newsModel.findById(id)
                                    .populate('category', 'name')
                                    .populate('author', 'fullname');
    if(!article){
      // return res.status(404).send('Article Not Found');
      // const error = new Error('Article Not Found'); 
      // error.status = 404;
      // return next(error);
      return next(createError('Article Not Found', 404));
    }
    if(req.role === "author"){
      if(req.id !== article.author._id){
        // return res.status(401).send('Unauthorized');
        return next(createError('Unauthorized', 401));
      }
    }
    const categories = await categoryModel.find();
    res.render("admin/article/update", {role:req.role, article, categories, errors:0});
  }
  catch(error){
    // res.status(500).send('Internal Server Error');
    next(error);
  }
};

const updateArticle = async (req, res, next) => {
  const id = req.params.id;
  const errors = validationResult(req);
  if(!errors.isEmpty()){
      const article = await newsModel.findById(id)
                                      .populate('category', 'name')
                                      .populate('author', 'fullname');
      const categories = await categoryModel.find();
      return res.render("admin/article/update", {
          role:req.role,
          article,
          categories,
          errors:errors.array()
      });
  }

  try{
    const {title, content, category} = req.body;
    const article = await newsModel.findById(id);
    if(!article){
      // return res.status(404).send('Article Not Found');
      return next(createError('Article Not Found', 404));
    }
    if(req.role === "author"){
      if(req.id != article.author._id){
        // return res.status(401).send('Unauthorized');
        return next(createError('Unauthorized', 401));
      }
    }
    article.title = title;
    article.content = content;
    article.category = category;
    if(req.file){
      const imagePath = path.join(__dirname, "../public/uploads", article.image);
      fs.unlinkSync(imagePath);
      article.image = req.file.filename
    }
    await article.save();
    res.redirect('/admin/article');
  }
  catch(error){
    // res.status(500).send('Internal Server Error');
    next(error);
  }
};

const deleteArticle = async (req, res, next) => {
  try{
    const id = req.param.id;
    const article = await newsModel.findById(id);
    if(!article){
      // return res.status(404).send('Article Not Found');
      return next(createError('Article Not Found', 404));
    }    
    if(req.role === "author"){
      if(req.id != article.author._id){
        // return res.status(401).send('Unauthorized');
        return next(createError('Unauthorized', 401));
      }
    }
    try{
      const imagePath = path.join(__dirname, "../public/uploads", article.image);
      fs.unlinkSync(imagePath);
    }
    catch(error){
      console.log('Error Deleting image:', error)
    };
   
    await article.deleteOne();
    res.json({success:true})
  }
  catch(error){
    res.status(500).send('Internal Server Error');
    next(error);
  }
};

module.exports = {
  allArticle,
  addArticlePage,
  addArticle,
  updateArticlePage,
  updateArticle,
  deleteArticle,
};
