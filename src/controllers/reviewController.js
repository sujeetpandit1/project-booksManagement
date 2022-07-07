const reviewModel = require('../models/reviewModel');
const bookModel = require('../models/bookModel')
const ObjectId = require('mongoose').Types.ObjectId;
const { isValid, isValidRequest, removeSpace } = require('../validators/userValidation');
const { findOneAndUpdate } = require('../models/reviewModel');

const createReview = async function (req, res) {

    try {
        let { bookId, reviewedBy, reviewedAt, rating, review, isDeleted } = req.body
        let objReview = {}

        let id = req.params.bookId

        if (!id) {
            return res.status(400).send({ status: false, message: "id in path param is missing" })
        }

        if (!isValidRequest(req.body)) {
            return res.status(400).send({ status: false, message: "please enter valid request" })
        }

        if (!bookId) {
            return res.status(400).send({ status: false, message: "bookId is missing" })
        }

        if (!ObjectId.isValid(bookId) || !ObjectId.isValid(id)) {
            return res.status(400).send({ status: false, message: "please enter valid objectId" })
        }

        let checkBook = await bookModel.findOne({ _id: bookId })

        if (checkBook.isDeleted == true) {
            return res.status(400).send({ status: false, message: "Cannot add review, Book has been already deleted" })
        }

        if (!checkBook) {
            return res.status(404).send({ status: false, message: "no such book exists" })
        }
        objReview.bookId = bookId

        if (reviewedBy) {
        reviewedBy = removeSpace(reviewedBy)
        }
        objReview.reviewedBy = reviewedBy

        if (!reviewedAt) {
            return res.status(400).send({ status: false, message: "reviewedAt is missing" })
        }
        objReview.reviewedAt = reviewedAt

        if (!rating && rating == undefined) {
            return res.status(400).send({ status: false, message: "rating is missing" })
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).send({ status: false, message: "please rate between 1 to 5 only" })
        }
        objReview.rating = rating

        objReview.review = removeSpace(review)

        if (isDeleted == true) {
            return res.status(400).send({ status: false, message: "you are not allowed to delete the same review while creating it" })
        }

        let savedData = await reviewModel.create(objReview)
        if (savedData != false) {
         await bookModel.findOneAndUpdate({ _id: bookId }, { $inc: {reviews : 1} }, { new: true })
        }
        return res.status(201).send({ status: true, message: "success", data: savedData })
    } catch (error) {
        console.log(error);
        return res.status(500).send({ status: false, message: error.message })
    }
}

// reviewedBy me default ka kya krna h guest ka ?

module.exports = { createReview }