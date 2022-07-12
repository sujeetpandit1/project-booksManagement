const express = require('express');
const router = express.Router();
const {createUser, loginUser}= require('../controllers/userController')
const {getBook, createBooks, booksByQuery, deleteBook, updateBook} = require('../controllers/bookController')
const {createReview, updateReview, deleteReview} = require('../controllers/reviewController')
const {validateUser, validateBooks} = require('../middlewares/commonMiddlewares')
const {authentication, authorisation, authorisationUD} = require('../middlewares/auth')



/*-----------USER API-----------------*/
router.post('/register', validateUser, createUser)
router.post('/login', loginUser)

/*-----------BOOK API-----------------*/
router.post('/books', authentication, validateBooks,  authorisation, createBooks)
router.get('/books', authentication, booksByQuery)
router.get('/books/:bookId', authentication, getBook)
router.put('/books/:bookId', authentication, authorisationUD, updateBook)
router.delete('/books/:bookId', authentication, authorisationUD,  deleteBook)

/*-----------REVIEW API-----------------*/
router.post('/books/:bookId/review', createReview)
router.put('/books/:bookId/review/:reviewId', updateReview)
router.delete('/books/:bookId/review/:reviewId', deleteReview)


module.exports = router;

