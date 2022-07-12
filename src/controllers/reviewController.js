const reviewModel = require('../models/reviewModel');
const bookModel = require('../models/bookModel')
const { isValid, isValidObjectId, isValidRequest, removeSpace } = require('../validators/reviewValidation');

/*--------------------CREATE REVIEW-----------------------*/
const createReview = async function (req, res) {

    try {
        let { bookId, reviewedBy, reviewedAt, rating, review, isDeleted } = req.body
        let objReview = {}
        let id = req.params.bookId

        if (!id) {
            return res.status(400).send({ status: false, message: "id in path param is missing" })}

        if (!isValidRequest(req.body)) {
            return res.status(400).send({ status: false, message: "please enter valid request" })}

        if (!bookId) {
            return res.status(400).send({ status: false, message: "bookId is missing" })}

        if (!isValidObjectId(bookId) || !isValidObjectId(id)) {
            return res.status(400).send({ status: false, message: "please enter valid objectId" })}

        let checkBook = await bookModel.findOne({ isDeleted: false, _id: bookId })
        if (!checkBook) {
            return res.status(404).send({ status: false, message: "no such book exists" })}
        
        objReview.bookId = bookId
        if (!isValid(reviewedBy)) {
            return res.status(400).send({ status: false, message: "please give valid input" })}

        if (reviewedBy) {
            reviewedBy = removeSpace(reviewedBy)}
        objReview.reviewedBy = reviewedBy

        if (!reviewedAt) {
            return res.status(400).send({ status: false, message: "reviewedAt is missing" })}

        if (!isValid(reviewedAt)) {
            return res.status(400).send({ status: false, message: "please give valid input in reviewedAt" })}

        objReview.reviewedAt = reviewedAt
        // undefined is because of 0
        if (!rating && rating == undefined) {
            return res.status(400).send({ status: false, message: "rating is missing" })}

        if (rating < 1 || rating > 5) {
            return res.status(400).send({ status: false, message: "please rate between 1 to 5 only" })}

        objReview.rating = rating
        objReview.review = review

        if (isDeleted == true) {
            return res.status(400).send({ status: false, message: "you are not allowed to delete the same review while creating it" })}
        
        let savedData = await reviewModel.create(objReview)
        if (savedData != false) {
            await bookModel.findOneAndUpdate({ _id: bookId }, { $inc: { reviews: 1 } }, { new: true })}
        checkBook._doc["reviewData"] = savedData 
        return res.status(201).send({ status: true, message: "success", data: checkBook })
        } catch (error) {
        console.log(error);
        return res.status(500).send({ status: false, message: error.message })
    }
}

/*--------------------UPDATE REVIEW-----------------------*/
const updateReview = async function (req, res) {
    try {
        let { review, rating, reviewedBy, bookId, reviewedAt, isDeleted } = req.body
        let reviewId = req.params.reviewId;
        let bookParamId = req.params.bookId
        if (!reviewId || !bookParamId) {
            return res.status(400).send({ status: false, message: "BookId or reviewId in path param is missing" })}

        if (!isValidRequest(req.body)) {
            return res.status(400).send({ status: false, message: "please enter details to update" })}

        if (bookId || reviewedAt || isDeleted) {
            return res.status(400).send({ status: false, message: 'review, rating and reviewedBy, Only these update are allowed' });}

        if (!(isValidObjectId(bookParamId) || isValidObjectId(reviewId))) {
            return res.status(400).send({ status: false, message: "please enter valid ObjectId of book and review " })}

        let checkBook = await bookModel.findById(bookParamId)
        if (!checkBook) {
            return res.status(404).send({ status: false, message: "no such book exists" })}

        if (checkBook.isDeleted == true) {
            return res.status(404).send({ status: false, message: "this book is deleted" })}

        let checkReview = await reviewModel.findById(reviewId)
        if (checkReview.isDeleted == true) {
            return res.status(404).send({ status: false, message: "this review is deleted" })}

        if (!checkReview) {
            return res.status(404).send({ status: false, message: "no such review exists" })}

        if (rating < 1 || rating > 5) {
            return res.status(400).send({ status: false, message: "please rate between 1 to 5 only" })}

        let updatedReview = await reviewModel.findOneAndUpdate({ isDeleted: false, _id: reviewId },
            { $set: { review: review, rating: rating, reviewedBy: reviewedBy, reviewedAt: Date.now() } },
            { new: true });
        if (updatedReview.isDeleted == true) {
            return res.status(404).send({ status: false, message: "Cannot update review, Book has been already deleted" })}

        checkBook._doc["reviewData"] = updatedReview
        return res.status(200).send({ status: true, msg: "true", data: checkBook });
        } catch (err) {
        res.status(500).send({ status: false, msg: "Error", error: err.message });
    }
};

/*--------------------DELETE REVIEW-----------------------*/
const deleteReview = async function (req, res) {
    try {
    let bookId = req.params.bookId
    let reviewId = req.params.reviewId

    if (!(bookId || reviewId)) {
        return res.status(400).send({ status: false, message: "bookId or reviewId in path param is missing" })}

    if (!isValidObjectId(bookId)) {
        return res.status(400).send({ status: false, message: `${bookId} is not a valid book id ` })}

    if (!isValidObjectId(reviewId)) {
        return res.status(400).send({ status: false, message: `${reviewId} is not a valid review id ` })}

    let checkBookId = await bookModel.findOne({ _id: bookId, isDeleted: false })
    if (!checkBookId) {
        return res.status(404).send({ status: false, message: "book does not exist or deleted" })}

    let checkReviewId = await reviewModel.findOne({ _id: reviewId, bookId: bookId, isDeleted: false })

    if (!checkReviewId) {
        return res.status(404).send({ status: false, message: "review does not exist or deleted" })}

    let deleteReview = await reviewModel.updateOne({ _id: reviewId }, { isDeleted: true }, { new: true })
    let updateReviewCountDerease = await bookModel.findOneAndUpdate({ _id: bookId }, { reviews: checkBookId.reviews - 1 }, { new: true })

    return res.status(200).send({ status: true, message: "Review sucessfully Deleted", deleteReview })
    }
    catch (error) {
    res.status(500).send({ status: false, error: error.message });
}
}


module.exports = { createReview, updateReview, deleteReview }