const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')
const bookController = require("../controllers/bookController");
const {createReview, updateReview, deleteReview} = require('../controllers/reviewController')

//user api
router.post('/register', userController.createUser)
router.post('/login', userController.loginUser)

//books api
router.post('/books', bookController.createBooks)           //create books
router.get('/books', bookController.booksByQuery)           //get books by query
router.get('/books/:bookId', bookController.getBook)        //get books by Id
router.put("/books/:bookId",  bookController.updateBook)    //update book by Id
router.delete('/books/:bookId', bookController.deleteBook)  //delete book by Id

//review api
router.post('/books/:bookId/review', createReview)
router.put('/books/:bookId/review', updateReview)
router.delete('/books/:bookId/review', deleteReview)







module.exports = router;