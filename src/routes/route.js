const express = require('express');
const router = express.Router();
const userController= require('../controllers/userController')
const bookController= require('../controllers/bookController')


router.post('/register', userController.createUser)
router.post('/login', userController.loginUser)

//books api
router.post('/books', bookController.createBooks)
router.get('/books', bookController.booksByQuery)










module.exports = router;