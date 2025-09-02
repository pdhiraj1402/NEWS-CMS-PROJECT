const express = require('express');
const router = express.Router();

const articleController = require('../controllers/articleController');
const categoryController = require('../controllers/categoryController');
const commentController = require('../controllers/commentController');
const userController = require('../controllers/userController');
const isLoggedIn = require('../middleware/isLoggedin');
const isAdmin = require('../middleware/isAdmin');


//  Login Routes
router.get('/', userController.loginPage);
router.post('/index', userController.adminLogin);
router.get('/logout', userController.logout);
router.get('/dashboard', isLoggedIn, userController.dashboard);
router.get('/settings', isLoggedIn, isAdmin, userController.settings);

//  User CRUD Routes
router.get('/users', isLoggedIn, isAdmin, userController.allUser);
router.get('/add-user', isLoggedIn, isAdmin, userController.addUserPage);
router.post('/add-user', isLoggedIn, isAdmin, userController.addUser);
router.get('/update-user/:id', isLoggedIn, isAdmin, userController.updateUserPage);
router.post('/update-user/:id', isLoggedIn, isAdmin, userController.updateUser);
router.delete('/delete-user/:id', isLoggedIn, isAdmin, userController.deleteUser);

//  Category CRUD Routes
router.get('/category', isLoggedIn, isAdmin, categoryController.allcategory);
router.get('/add-category', isLoggedIn, isAdmin, categoryController.addCategoryPage);
router.post('/add-category', isLoggedIn, isAdmin, categoryController.addCategory);
router.get('/update-category', isLoggedIn, isAdmin, categoryController.updateCategoryPage);
router.post('/update-category', isLoggedIn, isAdmin, categoryController.updateCategory);
router.delete('/delete-category/:id', isLoggedIn, isAdmin, categoryController.deleteCategory);

//  Article CRUD Routes
router.get('/article', isLoggedIn, articleController.allArticle);
router.get('/add-article', isLoggedIn, articleController.addArticlePage);
router.post('/add-article', isLoggedIn, articleController.addArticle);
router.get('/update-article', isLoggedIn, articleController.updateArticlePage);
router.post('/update-article', isLoggedIn, articleController.updateArticle);
router.delete('/delete-article/:id', isLoggedIn, articleController.deleteArticle);

//  Comment Routes
router.get('/comments', isLoggedIn, commentController.allComments);

module.exports = router;