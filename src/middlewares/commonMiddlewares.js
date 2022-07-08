const jwt = require('jsonwebtoken');
const { default: mongoose } = require('mongoose');
const userModel = require('../models/userModel.js');
const bookModel = require('../models/bookModel.js');
// const reviewModel = require('../models/reviewModel.js');


const {isValidTitle, isValidName, isValidPhone, isValidEmail, 
    isValidPassword, isValidAddress, isValidStreet, isValidCity, 
    isValidPincode, removeSpaces, trimAndUpperCase, reduceNumber} = require('../validators/userValidation.js');


//validating user datils
const validateUser = async function(req, res, next){
    try{
    const data = req.body;
    if(Object.keys(data).length === 0) return res.status(400).send({status: false, message: "can't create data with empty body"});

    const msg = {};
    if(!data.title)     {msg.titleError = "mandatory title is missing"}
    if(!data.name)      {msg.titleError = "mandatory name is missing"}
    if(!data.phone)     {msg.phoneError = "mandatory phone is missing"}
    if(!data.email)     {msg.emailError = "mandatory email is missing"}
    if(!data.password)  {msg.passwordError = "mandatory password is missing"};
    if(Object.keys(msg).length > 0) return res.status(400).send({status:false, message:msg});

    const invalid = {};
    if(!isValidTitle(data.title))       invalid.titleError = "title is invalid"; 
    if(!isValidName(data.name))         invalid.nameError = "name is invalid"; 
    if(!isValidPhone(data.phone))       invalid.phoneError = "phone is invalid"; 
    if(!isValidEmail(data.email))       invalid.emailError = "email is invalid"; 
    if(!isValidPassword(data.password)) invalid.passwordError = "password is invalid";

    if(data.address && !isValidAddress(data.address)) invalid.addressError = "address is invalid"; 
    if(data.address.street && !isValidStreet(data.address.street)) invalid.streetError = "street is invalid"; 
    if(data.address.city && !isValidCity(data.address.city)) invalid.cityError = "city is invalid"; 
    if(data.address.pincode && !isValidPincode(data.address.pincode)) invalid.pincodeError = "pincode is invalid"; 
    if(Object.keys(invalid).length > 0) return res.status(400).send({status:false, message:invalid});
    
    data.title = removeSpaces(data.title);              //formating data as per standardisation
    data.name = trimAndUpperCase(data.name);
    data.phone = removeSpaces(data.phone);
    data.email = removeSpaces(data.email).toLowerCase();
    if(data.address.street) data.address.street = removeSpaces(data.address.street);
    if(data.address.city) data.address.city = removeSpaces(data.address.city);
    if(data.address.pincode) data.address.pincode = removeSpaces(data.address.pincode);


    const duplicate = {};
    const emailDoc = await userModel.findOne({email: data.email});
    if(emailDoc) duplicate.emailError = `this ${data.email} is already registered`;

    const num = reduceNumber(data.phone)
    const phoneDoc = await userModel.findOne({phone: new RegExp(num + '$')});    
    if(phoneDoc) duplicate.phoneError = `this ${data.phone} is already registered`;
    if(Object.keys(duplicate).length > 0) return res.status(400).send({status:false, message:duplicate});
    next();

    }catch(error){
        console.log(error)
        return res.status(500).send({status:false, message:error.message});
    }
}


//Authentication-IK
const authentication = function(req, res, next){
    try {
        const token = req.headers["x-api-key"];
        if(!token) return res.status(401).send({status:false, message: "token is missing"});    //vald1

        const decoded = jwt.verify(token, "functioup-radon28", ((err, result)=>{                //vald2
        if(err) return res.status(401).send({status:false, message: "Invalid Token"});
        req.headers["decoded"] = decoded        //added this
        next();
        } ));

    } catch (error) {
        console.log(error);
        return res.status(500).send({status:false, message: error.message});
    }

}

//Authorisation-IK
const authorisation = function(req, res, next){
    try {
        const paramsId = req.params;                            
        if(!paramsId) return res.status(400).send({status:false, message: "please enter Id in path end"});  //vald1
        if(!mongoose.Types.ObjectId.isValid(paramsId)) return res.status(400).send({staus:false, message: "enter a valid Id"}); //vald2

        // const decode = jwt.verify(token, "functionup-radon28");
        const loggedInUserId = req.headers.decoded.userId;      //?

        if(loggedInUserId !== paramsId) return res.status(403).send({status:false, message:"You are not authorised to make this request"});
        next();
        
    } catch (error) {
        console.log(error);
        return res.status(500).send({status:false, message: error.message});        
    }
}


module.exports = {validateUser, authentication, authorisation}


