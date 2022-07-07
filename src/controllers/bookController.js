const jwt=require('jsonwebtoken')
const userModel=require('../models/userModel')
const bookModel=require('../models/bookModel')


const isValid = function (value) {
    if (typeof value === "undefined" || typeof value === null) return false
    if (typeof value === "string" && value.trim().length == 0) return false
    return true
}

const isValidRequest = function (value) {
    if (Object.keys(value).length == 0) return false
    return true
}
//-----------------------------------------------------------create Book---------------------------------------------------------------//

const createBooks = async function (req, res) {
    try {
        let { title, excerpt, userId, ISBN, category, subcategory } = req.body

        if (!isValidRequest(req.body)) {
            return res.status(400).send({ status: false, message: "body cannot be blank" })
        }
        if (!title) {
            return res.status(400).send({ status: false, message: "title cannot be blank" })
        }
        if (!isValid(title)) {
            return res.status(400).send({ status: false, message: "title is required" })
        }
        if (!excerpt) {
            return res.status(400).send({ status: false, message: "excerpt is require" })
        }
        if (userId.length != 24) {
            return res.status(400).send({ status: false, message: "userId required" })
        }
        if (!/^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/.test(ISBN)) {
            return res.status(400).send({ status: false, message: `ISBN  must be in 13 digit` });
        }
        if (!(/[A-Za-z][A-Za-z0-9_]{1,29}/.test(category))) {
            return res.status(400).send({ status: false, message: `category  can not be empty` });
        }
        if (!(/^#?[a-zA-Z0-9 ]+/.test(subcategory))) {
            return res.status(400).send({ status: false, message: `subcategory  can not be empty` });
        }
    
        let id = await userModel.findOne({ _id: userId }).select({ _id: 1 });
        if(!id){return res.status(404).send({status:false, message:"no such user found with mentioned id"})}
        let books = id._id.toString();
        if (userId == books) {
            let data = req.body;
            let createBooks = await bookModel.create(data);
            let savedData= await bookModel.findOne({title:title}).select({deletedAt:0})
            return res.status(201).send({ status: true, message: "success", data: savedData })
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: false, message: error.message })
    }
}

//------------------------------------Get book By id----------------------------------------------------------------------//

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

//------------------------------------------------deleteBook By Id------------------------------------------------------------------//
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


/*--------------------------------------------------------GET BOOKS-------------------------------------------
Returns all books in the collection that aren't deleted. Return only book _id, title, excerpt, userId, category, releasedAt, reviews field.
Query param can have any combination of below filters. By userId, By category, By subcategory. Return all books sorted by book name in Alphabatical order
*/

const booksByQuery = async function(req, res){
    try{
        const {userId, category, subcategory} = req.query;          
        const filters = {isDeleted:false};
        if(userId){filters.userId = userId};
        if(category){filters.category = category};
        if(subcategory){filters.subcategory ={ $all:subcategory.split(",")}};       //{"locations" : { $all : ["New York", "Texas"]}}
    
        if(Object.keys(filters).length === 1) return res.status(400).send({status:false, message: "enter atleast 1 field in query params from userId, category & subCategory"});
    
        const books = await bookModel.find(filters).select({title:1, excerpt:1, userId:1, category:1, releasedAt:1, reviews:1}).sort({title:1});
    
        if(books.length === 0) return res.status(404).send({status:false, message:"No match found"});
    
        return res.status(200).send({status:true, data:books});
    }catch(error){
        console.log(error)
        return res.status(500).send({status:false, message:error.message})
    }

}

//---------------------------------------------updateBook-----------------------------------------------------------------------//
const updateBook = async function (req, res) {

    try {
        let bookID = req.params.bookId 
        if( ! validator.isValidObjectId(bookID)){
            return res.status(400).send({ status: false, message: 'Please enter Valid Book-ID' });
        }

        let book = await bookModel.findOne({_id: bookID, isDeleted: false})
        if(!book ){
            return res.status(404).send({status: false, message: 'Book not Found'})
        }

        let data = req.body
        if(!validator.isValidRequestBody(data)) {
            return res.status(400).send({status: false , Message: 'Invalid request parameters. Please provide Book details'})    
        }

        let {title, excerpt, releasedAt, ISBN, } = data
        if (!(title || excerpt || ISBN || releasedAt)) {
            return res.status(400).send({ status: false, message: 'Wrong keys are Present, Please enter correct updation keys' });
          }
        const duplicateTitle = await bookModel.findOne({ title: title })
        if (duplicateTitle) {
            return res.status(400).send({ status: false, message: "Title is Already Exist " })
        }
         // Check duplicate ISBN
         const duplicateISBN = await bookModel.findOne({ ISBN: ISBN });
         if (duplicateISBN) {
             return res.status(400).send({ status: false, message: "ISBN is already exist" })
         }

        let condition = {_id: bookID , isDeleted: false}
        data = {title, excerpt, releasedAt, ISBN }
        let updatedData = await bookModel.findOneAndUpdate( condition , {$set: data}, {new: true})
        if(!updatedData){
            return res.status(404).send({status: false, message: 'Book with this data not found'})
        }
        return res.status(200).send({ status: true, message: "success", data: updatedData });
    } 
    catch (err) {
        res.status(500).send({status:false , msg: err.message});  
    }
}




module.exports.updateBook=updateBook
module.exports={createBooks, booksByQuery}
module.exports = {getBook,deleteBook}
