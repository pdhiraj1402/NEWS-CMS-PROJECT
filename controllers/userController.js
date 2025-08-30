const mongoose = require('mongoose');

const userModel = require('../models/User');

const loginPage = async (req, res) => { 
    res.render('admin/login', {layout:false});
};

const adminLogin = async (req, res) => {

 };
 
const logout = async (req, res) => {

 };

 const dashboard = async (req, res) => {
    res.render('admin/dashboard');
 };

 const settings = async (req, res) => {
    res.render('admin/settings');
 };

const allUser = async (req, res) => {
    res.render('admin/users');
 };

const addUserPage = async (req, res) => {
    res.render('admin/users/create');
 };

const addUser = async (req, res) => {

 };

const updateUserPage = async (req, res) => {
    res.render('admin/update');
 };

const updateUser = async (req, res) => { 

};
const deleteUser = async (req, res) => {

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
    settings
};