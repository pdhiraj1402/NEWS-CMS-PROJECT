const express = require('express');
const router = express.Router();

const articleController = require('../controllers/articleController');
const categoryController = require('../controllers/categoryController');
const commentController = require('../controllers/commentController');
const userController = require('../controllers/userController');

//  Login Routes
router.get('/', userController.loginPage);
router.get('/index', userController.adminLogin);
router.get('/logout', userController.logout);
router.get('/dashboard', userController.dashboard);
router.get('/settings', userController.settings);

//  User CRUD Routes
router.get('/users', userController.allUser);
router.get('/add-user', userController.addUserPage);
router.post('/add-user', userController.addUser);
router.get('/update-user', userController.updateUserPage);
router.post('/update-user', userController.updateUser);
router.get('/delete-user/:id', userController.deleteUser);

//  Category CRUD Routes
router.get('/category', categoryController.allcategory);
router.get('/add-category', categoryController.addCategoryPage);
router.post('/add-category', categoryController.addCategory);
router.get('/update-category', categoryController.updateCategoryPage);
router.post('/update-category', categoryController.updateCategory);
router.get('/delete-category/:id', categoryController.deleteCategory);

//  Article CRUD Routes
router.get('/article', articleController.allArticle);
router.get('/add-article', articleController.addArticlePage);
router.post('/add-article', articleController.addArticle);
router.get('/update-article', articleController.updateArticlePage);
router.post('/update-article', articleController.updateArticle);
router.get('/delete-article/:id', articleController.deleteArticle);

//  Comment Routes
router.get('/comments', commentController.allComments);

module.exports = router;