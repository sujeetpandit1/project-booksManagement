const reviewModel = require('../models/reviewModel');
const bookModel = require('../models/bookModel')
const { isValid, isValidRequest, isValidObjectId, removeSpace } = require('../validators/userValidation');


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

        if (!isValidObjectId(bookId) || !isValidObjectId(id)) {
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


const updateReview = async function (req, res) {
    try {
        let { review, rating, reviewedBy } = req.body
        if (!(review || rating || reviewedBy)) {
            return res 
            .status(400)
            .send({ status: false, message: 'review , rating and reviewedBy, Only these update are allowed' });
          }
        let data = req.body;
        if (!isValidRequest(req.body)) {
            return res.status(400).send({ status: false, message: "please enter details to update" })
        }
        let reviewId = req.params.reviewId;
        if (!reviewId) {
            return res.status(400).send({ status: false, message: "id in path param is missing" })
        }

        let updatedreview = await reviewModel.find({isDeleted: false,})
            .findOneAndUpdate({ _id: reviewId },
            {$set: {review:review,rating:rating,reviewedBy:reviewedBy,reviewedAt: Date.now()}},
            { new: true });
        if (updatedreview.isDeleted == true) {
            return res.status(400).send({ status: false, message: "Cannot update review, Book has been already deleted" })
            }
     
        return res
        .status(200)
        .send({ status: true, msg: "true", data: updatedreview });
      } catch (err) {
        res.status(500).send({ status: false, msg: "Error", error: err.message });
      }
    };


    
const deleteReview = async function (req,res){
    try{
        let bookId = req.params.bookId
        let reviewId = req.params.reviewId

        if(! validator.isValidObjectId(bookId)){
           return res.status(400).send({status:false, message:`${bookId} is not a valid book id `})
        }

        if(! validator.isValidObjectId(reviewId)){
            return res.status(400).send({status:false, message:`${reviewId} is not a valid review id `})
        }

        let checkBookId = await bookModel .findOne({_id:bookId,isDeleted:false})

        if(!checkBookId){
             return res.status(404).send({status:false,message:"book does not found"})
        }

         let checkReviewId = await reviewModel.findOne({_id:reviewId, bookId:bookId, isDeleted:false})
        
        if(!checkReviewId){
            return res.status(404).send({status:false,message:"review with this book id is does not exist"})
         }

        let update = await reviewModel.findOneAndUpdate({_id:reviewId}, {isDeleted:true}, {new:true})
        let updateReviewCountDerease = await bookModel .findOneAndUpdate({_id:bookId},{reviews:checkBookId.reviews-1},{new:true})

         return res.status(200).send({status:true, message:"Review sucessfully Deleted",update,updateReviewCountDerease})

    }
    catch(error){
        res.status(500).send({status:false, error:error.message});
    }
}




module.exports = { createReview, updateReview, deleteReview }