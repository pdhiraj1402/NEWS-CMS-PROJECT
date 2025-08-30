const mongoose = require('mongoose');

const categoryModel = require('../models/Category');
const newsModel = require('../models/News');
const userModel = require('../models/User');
const commentModel = require('../models/Comment');

const index = async (req, res) => { };
const articleByCategories = async (req, res) => { };
const singleArticle = async (req, res) => { };
const search = async (req, res) => { };
const author = async (req, res) => { };
const addComment = async (req, res) => { };

module.exports = {
    index,
    articleByCategories,
    singleArticle,
    search,
    author,
    addComment
};
