const userModel = require("../models/User");
const categoryModel = require("../models/Category");
const articleModel = require("../models/Article");
const settingModel = require("../models/Setting");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
dotenv.config();

const loginPage = async (req, res) => {
  res.render("admin/login", { layout: false });
};

const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await userModel.findOne({ username });
    if (!user) {
      return res.status(401).send("Invalid username or password1");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        return res.status(401).send("Invalid username or password");
    }
    console.log(user);
    const jwtData = { id: user._id, fullname: user.fullname , role: user.role };
    const token = jwt.sign(jwtData, process.env.JWT_SECRET, {expiresIn: "1h"});
    res.cookie("token", token, { httpOnly: true, maxAge: 60 * 60 * 1000 });
    res.redirect("/admin/dashboard");
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
};

const logout = async (req, res) => {
  res.clearCookie("token");
  res.redirect("/admin/");
};

const dashboard = async (req, res) => {
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
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
};

const settings = async (req, res) => {
  try{
    const Settings = await settingModel.findOne();
    res.render("admin/settings", {role:req.role, Settings});
  }catch(error){
    console.error(error);
    res.status(500).send('Internal Server Error');
  };
};

const saveSettings = async (req, res) => {
  const {website_title, footer_description} = req.body;
  const website_logo = req.file ? req.file.filename : null;
  try{
    const settings  = await settingModel.findOneAndUpdate(
      {},
      {website_title, website_logo, footer_description},
      {new:true, upsert:true}
    );
    res.redirect("admin/settings");
  }catch(error){
    console.error(error);
    res.status(500).send('Internal Server Error');
  };
  
};

const allUser = async (req, res) => {
  try {
    const users = await userModel.find();
    res.render("admin/users", {users, role:req.role});
  } catch (err) {
    console.error('Error While fetching the users:', err);
    res.status(500).send('Failed to get the users');
  }
};

const addUserPage = async (req, res) => {
  res.render("admin/users/create", {role:req.role});
};

const addUser = async (req, res) => {
  try {
    await userModel.create(req.body);
    res.redirect('/admin/users');
  } catch (err) {
    console.error('Error adding user:', err);
    res.status(500).send('Failed to add user');
  }
};

const updateUserPage = async (req, res) => {
    try{
        const id = req.params.id;
        const user = await userModel.findById(id);
        if(!user){
            return res.status(404).send('User not found');
        }
        res.render("admin/users/update", {user, role:req.role});
    }catch(err){
        res.status(500).send('Internal Server Error');
    }
};

const updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const {fullname, password, role} = req.body;
    const user = await userModel.findById(id);
    if(!user){
      return res.status(404).send('User not found');
    }

    user.fullname = fullname || user.fullname;
    if(password){
      user.password = password;
    }
    user.role = role || user.role;
    await user.save();
    res.redirect('/admin/users');
  } catch (err) {
    res.status(500).send('Internal Server Error');
  }
};


const deleteUser = async (req, res) => {
    try{
        const id = req.params.id;
        const user = await userModel.findByIdAndDelete(id);
        if(!user){
            return res.status(404).send('User not found');
        }
        res.json({success:true});
    }catch(err){
        res.status(500).send('Internal Server Error');
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
