const jwt=require('jsonwebtoken')
const userModel=require('../models/userModel')
const bookModel=require('../models/bookModel')


/*--------------------------------------------------create books -----------------------------------------------*/
const isValid = function (value) {
    if (typeof value === "undefined" || typeof value === null) return false
    if (typeof value === "string" && value.trim().length == 0) return false
    return true
}

const isValidRequest = function (value) {
    if (Object.keys(value).length == 0) return false
    return true
}
//--------user created--------//

const createBooks = async function (req, res) {
    try {
        let { title, excerpt, userId, ISBN, category, subcategory } = req.body

        if (!isValidRequest(req.body)) {
            return res
                .status(400)
                .send({ status: false, message: "body cannot be blank" })
        }
        if (!title) {
            return res.status(400).send({ status: false, message: "title cannot be blank" })
        }

        if (!isValid(title)) {
            return res
                .status(400)
                .send({ status: false, message: "title is required" })
        }

        if (!excerpt) {
            return res
                .status(400)
                .send({ status: false, message: "excerpt is require" })
        }

        if (userId.length != 24) {
            return res
                .status(400)
                .send({ status: false, message: "userId required" })
        }
        if (!/^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/.test(ISBN)) {
            return res
                .status(400)
                .send({ status: false, message: `ISBN  must be in 13 digit` });
        }
        if (!(/[A-Za-z][A-Za-z0-9_]{1,29}/.test(category))) {
            return res
                .status(400)
                .send({ status: false, message: `category  can not be empty` });

        }
        if (!(/^#?[a-zA-Z0-9 ]+/.test(subcategory))) {
            return res
                .status(400)
                .send({ status: false, message: `subcategory  can not be empty` });
        }
    
        
        let id = await userModel.findOne({ _id: userId }).select({ _id: 1 });
        if(!id){return res.status(404).send({status:false, message:"no such user found with mentioned id"})}
        let books = id._id.toString();
        if (userId == books) {
            let data = req.body;
            let createBooks = await bookModel.create(data);
            let savedData= await bookModel.findOne({title:title}).select({deletedAt:0})
            return res
                .status(201)
                .send({ status: true, message: "success", data: savedData })
        }

    } catch (error) {
        console.log(error);
        res.status(500).send({ status: false, message: error.message })
    }
}











/*--------------------------------------------------------GET BOOKS-------------------------------------------
# 4. GET /books
Returns all books in the collection that aren't deleted. Return only book _id, title, excerpt, userId, category, releasedAt, reviews field. Response example here
Return the HTTP status 200 if any documents are found. The response structure should be like this
If no documents are found then return an HTTP status 404 with a response like this
Filter books list by applying filters. Query param can have any combination of below filters.
By userId
By category
By subcategory example of a query url: books?filtername=filtervalue&f2=fv2
Return all books sorted by book name in Alphabatical order
*/

const booksByQuery = async function(req, res){
    try{
        const {userId, category, subcategory} = req.query;          console.log(req.query)
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




module.exports={createBooks, booksByQuery}