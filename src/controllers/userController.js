const { findOne } = require('../models/userModel.js');
const userModel = require('../models/userModel.js');
const jwt = require('jsonwebtoken')


const createUser = async function(req, res){
    try {
        const data = req.body
        const savedUser = await userModel.create(data)
        return res.status(201).send({status:true, data:savedUser});


    } catch (error) {
        console.log(error);
        return res.status(500).send({status:false, message: error.message})
    }
}

const loginUser = async function(req, res){
    try {
        const data = req.body;
        if(Object.keys(data).length === 0) return res.status(400).send({status:false, message: "enter emailId and password"})
        const msg={};
        if(!data.email) msg.emailError = "please enter your email Id"
        if(!data.password) msg.passwordError = "please enter your password"
        if(Object.keys(msg).length > 0) return res.status(400).send({status:false, message: msg})

        const docs = await userModel.findOne({email:data.email});
        if(!docs) return res.status(404).send({status:false, message:"user not found, click on sign UP to create user"});
        const user = await userModel.findOne({email:data.email, password:data.password});
        if(!user) return res.status(401).send({status:false, message:"invalid credentials, useremail or password is incorrect"});

        const token = jwt.sign({userId:user._id, batch:"radon", project:"bookManagement"}, "functionup-radon28");
        res.setHeader("x-api-key", token);
        return res.status(200).send({status:false, message:"login successful", data : {token}})
     
    } catch (error) {
        console.log(error);
        return res.status(500).send({status:false, message: error.message})
    }
}


// //--------user created--------//
// const createUser = async function (req, res) {
//     try {
//         let { title, name, phone, email, password, address } = req.body
//         let userObj = {}

//         if (!isValidRequest(req.body)) {
//             return res.status(400).send({ status: false, message: "please enter valid request" })
//         }

//         if (!title) {
//             return res.status(400).send({ status: false, message: "title is missing" })
//         }

//         if (!isValid(title)) {
//             return res.status(400).send({status: false, message: "please give valid title input" })
//         } 
        
//         if (title.trim() != ("Mr" || "Mrs" || "Miss")) {
//             return res.status(400).send({status: false, message: "please give valid title input, only Mr, Mrs, Miss allowed"})
//         }
//         userObj.title = removeSpace(title)

//         if (!name) {
//             return res.status(400).send({ status: false, message: "name is missing" })
//         }

//         if (!isValid(name)) {
//             return res.status(400).send({status: false, message : "please give valid name input"})
//         }
//         userObj.name = removeSpace(name) 
        
//         if (!phone) {
//             return res.status(400).send({ status: false, message: "phone is missing" })
//         }

//         if (!isValidPhone(phone)) {
//             return res.status(400).send({ status: false, message: "please enter valid phone number" })
//         }

//         let checkPhone = await userModel.findOne({ phone: phone })
//         if (checkPhone) {
//             return res.status(400).send({ status: false, message: "please enter unique phone number" })
//         }
//         userObj.phone = phone
        
//         if (!email) {
//             return res.status(400).send({ status: false, message: "email is missing" })
//         }

//         if (!isValidEmail(email)) {
//             return res.status(400).send({ status: false, message: "please enter valid email" })
//         }

//         let checkEmail = await userModel.findOne({ email: email })
//         if (checkEmail) {
//             return res.status(400).send({ status: false, message: "please enter unique email" })
//         }
//         userObj.email = email

//         if (!password) {
//             return res.status(400).send({ status: false, message: "password is missing" })
//         }

//         if (!isValidPassword(password)) {
//             return res.status(400).send({ status: false, message: "please enter a valid password. Password should have Minimum eight characters, at least one uppercase letter, one lowercase letter, one special character, and one number, no space allowed" });
//         }
//         userObj.password = password

//         if (!checkPincode(address.pincode)) {
//             return res.status(400).send({ status: false, message: "please enter valid pincode" })
//         }

//         address.street = removeSpace(address.street)
//         address.city = removeSpace(address.city)
//         userObj.address = address
        
//         // let createUser = await userModel.create(userObj)
//         return res.status(201).send({ status: true, message: "success", data: userObj })
//     } catch (error) {
//         console.log(error);
//         return res.status(500).send({ status: false, message: error.message })
//     }
// }




module.exports.createUser = createUser;
module.exports.loginUser = loginUser;