const express = require('express');
const router = express.Router();

const articleController = require('../controllers/articleController');
const categoryController = require('../controllers/categoryController');
const commentController = require('../controllers/commentController');
const userController = require('../controllers/userController');
const isLoggedIn = require('../middleware/isLoggedin');
const isAdmin = require('../middleware/isAdmin');
const upload = require('../middleware/multer');
const isValid = require('../middleware/validation');


//  Login Routes
router.get('/', userController.loginPage);
router.post('/index', isValid.loginValidation, userController.adminLogin);
router.get('/logout', userController.logout);
router.get('/dashboard', isLoggedIn, userController.dashboard);
router.get('/settings', isLoggedIn, isAdmin, userController.settings);
router.post('/save-settings', isLoggedIn, isAdmin, upload.single('website_logo'), userController.saveSettings);

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
router.get('/update-category/:id', isLoggedIn, isAdmin, categoryController.updateCategoryPage);
router.post('/update-category/:id', isLoggedIn, isAdmin, categoryController.updateCategory);
router.delete('/delete-category/:id', isLoggedIn, isAdmin, categoryController.deleteCategory);

//  Article CRUD Routes
router.get('/article', isLoggedIn, articleController.allArticle);
router.get('/add-article', isLoggedIn,  articleController.addArticlePage);
router.post('/add-article', isLoggedIn, upload.single('image'), articleController.addArticle);
router.get('/update-article/:id', isLoggedIn, articleController.updateArticlePage);
router.post('/update-article/:id', isLoggedIn, upload.single('image'), articleController.updateArticle);
router.delete('/delete-article/:id', isLoggedIn, articleController.deleteArticle);

//  Comment Routes
router.get('/comments', isLoggedIn, commentController.allComments);

// 404 Error Middleware
router.use(isLoggedIn, (req, res, next) => 
    { 
        const message = 'Page Not Found';
        res.status(404).render('admin/404', {role:req.role, message});
    }
);

// 500 Error Middleware
router.use(isLoggedIn, (err, req, res, next) => { 
    const message = 'Page Not Found';
    const status = err.status || 500;
    const view = status === 404 ? 'admin/404' : 'admin/500'
    res.status(status).render(view, {
        role:req.role, 
        message: err.message || 'Internal Server Error'
    });
});

module.exports = router;