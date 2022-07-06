const userModel = require('../models/userModel')
const jwt=require('jsonwebtoken')
// const { isValidRequest } = require('../validators/uservalidation')
const {isValid, isValidRequest, isValidPhone, isValidPassword, isValidEmail,  checkPincode, removeSpace} = require('../validators/userValidation')

//--------user created--------//
const createUser = async function(req, res){
    try {
        let {title, name, phone, email, password, address}= req.body

        if (!isValidRequest(req.body)) {
            return res.status(400).send({status: false, message : "please enter valid request"})
        }
        
        if (!title) {
            return res.status(400).send({status: false, message : "title is missing"})
        }

        if (!isValid(title)) {
            return res.status(400).send({status: false, message : "please enter valid title"})
        }


        if(!(title == "Mr" || title == "Mrs" || title == "Miss")) {
            return res.status(400).send({status: false, message: "title has to be Mr or Mrs or Miss"})
        }

        if (!name) {
            return res.status(400).send({status: false, message : "name is missing"})
        }

        // if (isValid(name)) {
        //     return res.status(400).send({status: false, message : "please give valid input"})
        // }

        // removeSpace(name) 

        if (!phone) {
            return res.status(400).send({status: false, message : "phone is missing"})
        }
        
        if (!isValidPhone(phone)) {
            return res.status(400).send({status: false, message : "please enter valid phone number"})
        }

        let checkPhone = await userModel.findOne({phone: phone})
        if (checkPhone) {
            return res.status(400).send({status : false, message : "please enter unique phone number"}) 
        }

        if (!email) {
            return res.status(400).send({status: false, message : "email is missing"})
        }

        if (!isValidEmail(email)) {
            return res.status(400).send({status: false, message : "please enter valid email"})
        }
       
        let checkEmail = await userModel.findOne({email:email})
        if (checkEmail) {
            return res.status(400).send({status : false, message : "please enter unique email"})
        }

        if (!password) {
            return res.status(400).send({status : false, message : "password is missing"})
        }


        if (!isValidPassword(password)) {
            return res.status(400).send({ status: false, message: "please enter a valid password. Password should have Minimum eight characters, at least one uppercase letter, one lowercase letter, one special character, and one number" });
          }
      

        if (!checkPincode(address.pincode)) {
            return res.status(400).send({status : false, message : "please enter valid pincode"})
        }

        let createUser=await userModel.create(req.body)
        res.status(201).send({status:true, message: "success" , data:createUser})
    } catch (error) {
        console.log(error);
        res.status(500).send({status:false, message:error.message})
    }   
}

//--------login user--------//
const loginUser= async function (req,res){
    try {
        const login=req.body
        if(!isValidRequest(req.body)){
            return res
            .status(400)
            .send({status:false, message: 'please enter valid request'})

        }
        const {email, password}=req.body

        //validation Start
        if(!isValid(email)){
            return res
            .status(400)
            .send({status:false, message: 'email is missing'})
        }
        if(!isValid(password)){
            return res
            .status(400)
            .send({status:false, message: 'password is required'})
        }
        const user=await userModel.findOne({email:email, password:password})
        if(!user){
            return res
            .status(404)
            .send({status:false, message: 'invalid credentials'})
        }

        //it's token time

        const token=jwt.sign({
            userId:user._id.toString(),
            batch:"Room-28",
            organization: "BookManagement",
        },"functioup-radon28")

        res.setHeader('x-api-key', token)
        return res
            .status(200)
            .send({status:true, message: "success", data:token})

    } catch (error) {
        console.log(error);
        res.status(500).send({status:false, message:error.message})
        
    }
}

module.exports={createUser, loginUser}


