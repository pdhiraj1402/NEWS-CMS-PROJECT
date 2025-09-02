const categoryModel = require("../models/Category");
const newsModel = require("../models/News");
const userModel = require("../models/User");

const allArticle = async (req, res) => {
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
    res.status(500).send('Server Error');
  }
};

const addArticlePage = async (req, res) => {
  const categories = categoryModel.find();
  res.render("admin/article/create", {role:req.role, categories});
};

const addArticle = async (req, res) => {
  try{
    const {title, content, category} = req.body;
    const article = new newsModel({
      title,
      content,
      category,
      author:req.user.id,
      image:req.file.filename
    });
    await article.save();
    res.redirect('/admin/article');
  }
  catch(error){
    res.status(500).send('Internal Server Error');
  }
};

const updateArticlePage = async (req, res) => {
  try{
    const id = req.param.id;
    const article = await newsModel.findById(id)
                                    .populate('category', 'name')
                                    .populate('author', 'fullname');
    if(!article){
      return res.status(404).send('Article Not Found');
    }
    if(req.role === "author"){
      if(req.id !== article.author._id){
        return res.status(401).send('Unauthorized');
      }
    }
    const categories = await categoryModel.find();
    res.render("admin/article/update", {role:req.role, article, categories});
  }
  catch(error){
    res.status(500).send('Internal Server Error');
  }
};

const updateArticle = async (req, res) => {
  try{
    const id = req.param.id;
    const {title, content, category} = req.body;
    const article = await newsModel.findById(id);
    if(!article){
      return res.status(404).send('Article Not Found');
    }
    if(req.role === "author"){
      if(req.id != article.author._id){
        return res.status(401).send('Unauthorized');
      }
    }
    article.title = title;
    article.content = content;
    article.category = category;
    if(req.file){
      article.image = req.file.filename
    }
    await article.save();
    res.redirect('/admin/article');
  }
  catch(error){
    res.status(500).send('Internal Server Error');
  }
};

const deleteArticle = async (req, res) => {
  try{
    const id = req.param.id;
    const article = await newsModel.findById(id);
    if(!article){
      return res.status(404).send('Article Not Found');
    }    
    if(req.role === "author"){
      if(req.id != article.author._id){
        return res.status(401).send('Unauthorized');
      }
    }
    await article.deleteOne();
    res.json({success:true})
  }
  catch(error){
    res.status(500).send('Internal Server Error');
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
