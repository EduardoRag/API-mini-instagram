const express = require('express');
const users = require('../controllers/users');
const login = require('../controllers/login');
const posts = require('../controllers/posts');
const validateToken = require('../middlewares/validateToken');

const route = express();

// Register
route.post('/register', users.register);

// Login
route.post('/login', login);

// Middleware
route.use(validateToken);

// Get and update profile 
route.get('/profile', users.getUser);
route.put('/profile', users.updateProfile);

// Posts
route.post('/posts', posts.newPost);

module.exports = route;