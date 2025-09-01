const userModel = require("../models/User");

const loginPage = async (req, res) => {
  res.render("admin/login", { layout: false });
};

const adminLogin = async (req, res) => {};

const logout = async (req, res) => {};

const dashboard = async (req, res) => {
  res.render("admin/dashboard");
};

const settings = async (req, res) => {
  res.render("admin/settings");
};

const allUser = async (req, res) => {
  try {
    const users = await userModel.find();
    res.render("admin/users", {users});
  } catch (err) {
    console.error('Error While fetching the users:', err);
    res.status(500).send('Failed to get the users');
  }
};

const addUserPage = async (req, res) => {
  res.render("admin/users/create");
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
  res.render("admin/users/update");
};

const updateUser = async (req, res) => {};
const deleteUser = async (req, res) => {};

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
};
