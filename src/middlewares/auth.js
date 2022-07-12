const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const userModel = require('../models/userModel.js');
const bookModel = require('../models/bookModel.js');

//Authentication-IK
const authentication = function(req, res, next){
    try {
        const token = req.headers["x-api-key"];
        if(!token) return res.status(401).send({status:false, message: "token is missing"});    //vald1

        const decoded = jwt.verify(token, "functionup-radon28", ((err, result)=>{                //vald2
        if(err) return undefined
        else  return result
        }))//session expired msg can be added optionally here

        if (decoded == undefined) { return res.status(401).send({status:false, message: "Invalid Token"}) }
        req["decoded"] = decoded 

        next();

    } catch (error) {
        console.log(error);
        return res.status(500).send({status:false, message: error.message});
    }

}

//Authorisation-to createBook -------------------INCOMPLETE
const authorisation = function(req, res, next){      
    try {
        const userId = req.body.userId;                                              

        if(Object.keys(req.body).length <1) return res.status(400).send({status:false, message:"can't create book with empty details"});   //empty body                  
        if(!userId) return res.status(400).send({status:false, message: "please enter userId"});  //vald1
        if(!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).send({staus:false, message: "enter a valid Id"}); //vald2

        const loggedInUserId = req.decoded.userId;      //?
        console.log(loggedInUserId)

        if(loggedInUserId !== userId) return res.status(403).send({status:false, message:"You are not authorised to make this request"});
        next();
        
    } catch (error) {
        console.log(error);
        return res.status(500).send({status:false, message: error.message});        
    }
}

module.exports = {authentication, authorisation}