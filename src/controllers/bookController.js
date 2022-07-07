const jwt=require('jsonwebtoken')
const bookModel = require('../models/bookModel')
const ObjectId = require('mongoose').Types.ObjectId;

const getBook = async function (req,res) {
    try {
    let id = req.params.bookId
 
    if (!id) {
        return res.status(400).send({status: false, message: "please give book id in path param"})
    }

    if (!ObjectId.isValid(id)) {
        return res.status(400).send({status: false, message: "please enter valid objectId"})
    }

    if (id.length != 24) {
        return res.status(400).send({status: false, message: "please enter proper length of ObjectId (24)"})
    }

    let savedData = await bookModel.findById(id).select({deletedAt:0, __v:0}) 

    if (savedData.isDeleted == true) {
        return res.status(400).send({status: false, message: "isDeleted key of this book is true (book has been deleted)"})
    }

    if(!savedData) {
        return res.status(404).send({status: false, message: "no such book exists"}) 
    }

    return res.status(200).send({status: true, message: "Books list", data : savedData})
} catch (error) {
    console.log(error);
    return res.status(500).send({ status: false, message: error.message })
}
}


const deleteBook = async function (req, res) {
    try {
        let id = req.params.bookId
 
    if (!id) {
        return res.status(400).send({status: false, message: "please give book id in path param"})
    }

    if (!ObjectId.isValid(id)) {
        return res.status(400).send({status: false, message: "please enter valid objectId"})
    }

    if (id.length != 24) {
        return res.status(400).send({status: false, message: "please enter proper length of ObjectId (24)"})
    }
        let deleteBook = await bookModel.updateOne(
            { _id: id, isDeleted: false }, 
            {$set:  {isDeleted: true}, deletedAt : Date.now()}, 
            { new: true })

            if (deleteBook.modifiedCount == 0) {
                return res.status(400).send({status: false, message: "this book has been deleted already"})
            }

        return res.status(200).send({ status: true, message: "This book is deleted successfully", data: deleteBook, })
    } catch (error) {
        console.log(error);
        return res.status(500).send({ status: false, message: error.message })
    }
}


module.exports = {getBook,deleteBook}