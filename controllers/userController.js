const userModel = require("../models/User");
const categoryModel = require("../models/Category");
const articleModel = require("../models/News");
const settingModel = require("../models/Setting");
const createError = require("../utils/error-message");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const {validationResult} = require("express-validator");

dotenv.config();

const loginPage = async (req, res) => {
  res.render("admin/login", {
     layout: false,
     errors:0
  });
};

const adminLogin = async (req, res, next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.render("admin/login", {
         layout: false,  
         errors:errors.array()
    });
  }

  try {
    const { username, password } = req.body;
    const user = await userModel.findOne({ username });
    if (!user) {
      // return res.status(401).send("Invalid username or password");
      return next(createError('Invalid username or password', 401));
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        // return res.status(401).send("Invalid username or password");
        return next(createError('Invalid username or password', 401));
    }
    console.log(user);
    const jwtData = { id: user._id, fullname: user.fullname , role: user.role };
    const token = jwt.sign(jwtData, process.env.JWT_SECRET, {expiresIn: "1h"});
    res.cookie("token", token, { httpOnly: true, maxAge: 60 * 60 * 1000 });
    res.redirect("/admin/dashboard");
  } catch (err) {
    // res.status(500).send("Internal Server Error");
    next(error);
  }
};

const logout = async (req, res) => {
  res.clearCookie("token");
  res.redirect("/admin/");
};

const dashboard = async (req, res, next) => {
    try{
        let articleCount;
        if(req.role === "author"){
          articleCount = await articleModel.countDocuments({author:req.id});
        }
        else{
          articleCount = await articleModel.countDocuments();
        }
        const categoryCount = await categoryModel.countDocuments();
        const userCount = await userModel.countDocuments();
        res.render("admin/dashboard", 
        {
          role:req.role, 
          fullname:req.fullname,
          userCount,
          categoryCount,
          articleCount
        });
    }
    catch(error){
      // console.error(error);
      // res.status(500).send('Internal Server Error');
      next(error);
    }
};

const settings = async (req, res, next) => {
  try{
    const Settings = await settingModel.findOne();
    res.render("admin/settings", {role:req.role, Settings});
  }catch(error){
    // console.error(error);
    // res.status(500).send('Internal Server Error');
    next(error);
  };
};

const saveSettings = async (req, res, next) => {
  const {website_title, footer_description} = req.body;
  const website_logo = req.file ? req.file.filename : null;
  try{
    const settings  = await settingModel.findOneAndUpdate(
      {},
      {website_title, website_logo, footer_description},
      {new:true, upsert:true}
    );
    res.redirect("/admin/settings");
  }catch(error){
    // console.error(error);
    // res.status(500).send('Internal Server Error');
    next(error);
  };
  
};

const allUser = async (req, res, next) => {
  try {
    const users = await userModel.find();
    res.render("admin/users", {users, role:req.role});
  } catch (err) {
    // console.error('Error While fetching the users:', err);
    // res.status(500).send('Failed to get the users');
    next(error);
  }
};

const addUserPage = async (req, res) => {
  res.render("admin/users/create", {role:req.role, errors:0});
};

const addUser = async (req, res, next) => {

  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.render("admin/user/create", {
        role:req.role,
        errors:errors.array()
    });
  }

  try {
    await userModel.create(req.body);
    res.redirect('/admin/users');
  } catch (err) {
    // console.error('Error adding user:', err);
    // res.status(500).send('Failed to add user');
    next(error);
  }
};

const updateUserPage = async (req, res, next) => {
    const id = req.params.id;
    try{
        const user = await userModel.findById(id);
        if(!user){
            // return res.status(404).send('User not found');
            return next(createError('User Not Found', 404));
        }
        res.render("admin/users/update", {user, role:req.role, errors:0});
    }catch(err){
        // res.status(500).send('Internal Server Error');
        next(error);
    }
};

const updateUser = async (req, res, next) => {
  const id = req.params.id;

  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.render("admin/user/update", {
        user:req.body,
        role:req.role,
        errors:errors.array()
    });
  }
  
  try {
    const id = req.params.id;
    const {fullname, password, role} = req.body;
    const user = await userModel.findById(id);
    if(!user){
      // return res.status(404).send('User not found');
      return next(createError('User Not Found', 404));
    }

    user.fullname = fullname || user.fullname;
    if(password){
      user.password = password;
    }
    user.role = role || user.role;
    await user.save();
    res.redirect('/admin/users');
  } catch (err) {
    // res.status(500).send('Internal Server Error');
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
    try{
        const id = req.params.id;
        const user = await userModel.findByIdAndDelete(id);
        if(!user){
            // return res.status(404).send('User not found');
            return next(createError('User Not Found', 404));
        }
        res.json({success:true});
    }catch(err){
        // res.status(500).send('Internal Server Error');
        next(error);
    }    
};

module.exports = {
  loginPage,
  adminLogin,
  logout,
  allUser,
  addUserPage,
  addUser,
  updateUserPage,
  updateUser,
  deleteUser,
  dashboard,
  settings,
  saveSettings
};
