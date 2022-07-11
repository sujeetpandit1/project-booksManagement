const express = require('express');
const router = express.Router();
const {createUser, loginUser}= require('../controllers/userController')
const bookController= require('../controllers/bookController')
const {validateUser, validateBooks, authentication, authorisation} = require('../middlewares/commonMiddlewares')

//user api
router.post('/register', validateUser, createUser)
router.post('/login', loginUser)

// //books api
router.post('/books', authentication, validateBooks, bookController.createBooks)
// router.get('/books', bookController.booksByQuery)



//review api
router.post('/books/:bookId/review', createReview)
router.put('/books/:bookId/review', updateReview)
router.delete('/books/:bookId/review', deleteReview)







module.exports = router;