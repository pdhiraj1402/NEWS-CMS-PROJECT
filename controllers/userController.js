const mongoose = require('mongoose');

const userModel = require('../models/User');

const loginPage = async (req, res) => { };
const adminLogin = async (req, res) => { };
const logout = async (req, res) => { };

const allUser = async (req, res) => { };
const addUserPage = async (req, res) => { };
const addUser = async (req, res) => { };
const updateUserPage = async (req, res) => { };
const updateUser = async (req, res) => { };
const deleteUser = async (req, res) => { };


module.exports = {
    loginPage,
    adminLogin,
    logout,
    allUser,
    addUserPage,
    addUser,
    updateUserPage,
    updateUser,
    deleteUser
};