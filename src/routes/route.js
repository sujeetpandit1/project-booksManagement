const express = require('express');
const router = express.Router();
const {createUser, loginUser}= require('../controllers/userController')
const bookController= require('../controllers/bookController')
const {validateUser, authentication, authorisation} = require('../middlewares/commonMiddlewares')

//user api
router.post('/register', validateUser, createUser)
router.post('/login', loginUser)

// //books api
// router.post('/books', bookController.createBooks)
// router.get('/books', bookController.booksByQuery)










module.exports = router;