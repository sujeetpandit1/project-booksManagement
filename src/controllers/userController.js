const userModel = require('../models/userModel')
const jwt = require('jsonwebtoken')
const { isValid, isValidRequest, isValidPhone, isValidPassword, isValidEmail, checkPincode, removeSpace } = require('../validators/userValidation')

//--------user created--------//
const createUser = async function (req, res) {
    try {
        let { title, name, phone, email, password, address } = req.body
        let userObj = {}

        if (!isValidRequest(req.body)) {
            return res.status(400).send({ status: false, message: "please enter valid request" })
        }

        if (!title) {
            return res.status(400).send({ status: false, message: "title is missing" })
        }

        if (!isValid(title)) {
            return res.status(400).send({status: false, message: "please give valid title input" })
        } 
        
        if (title.trim() != ("Mr" || "Mrs" || "Miss")) {
            return res.status(400).send({status: false, message: "please give valid title input, only Mr, Mrs, Miss allowed"})
        }
        userObj.title = removeSpace(title)

        if (!name) {
            return res.status(400).send({ status: false, message: "name is missing" })
        }

        if (!isValid(name)) {
            return res.status(400).send({status: false, message : "please give valid name input"})
        }
        userObj.name = removeSpace(name) 
        
        if (!phone) {
            return res.status(400).send({ status: false, message: "phone is missing" })
        }

        if (!isValidPhone(phone)) {
            return res.status(400).send({ status: false, message: "please enter valid phone number" })
        }

        let checkPhone = await userModel.findOne({ phone: phone })
        if (checkPhone) {
            return res.status(400).send({ status: false, message: "please enter unique phone number" })
        }
        userObj.phone = phone
        
        if (!email) {
            return res.status(400).send({ status: false, message: "email is missing" })
        }

        if (!isValidEmail(email)) {
            return res.status(400).send({ status: false, message: "please enter valid email" })
        }

        let checkEmail = await userModel.findOne({ email: email })
        if (checkEmail) {
            return res.status(400).send({ status: false, message: "please enter unique email" })
        }
        userObj.email = email

        if (!password) {
            return res.status(400).send({ status: false, message: "password is missing" })
        }

        if (!isValidPassword(password)) {
            return res.status(400).send({ status: false, message: "please enter a valid password. Password should have Minimum eight characters, at least one uppercase letter, one lowercase letter, one special character, and one number, no space allowed" });
        }
        userObj.password = password

        if (!checkPincode(address.pincode)) {
            return res.status(400).send({ status: false, message: "please enter valid pincode" })
        }

        address.street = removeSpace(address.street)
        address.city = removeSpace(address.city)
        userObj.address = address
        
        // let createUser = await userModel.create(userObj)
        return res.status(201).send({ status: true, message: "success", data: userObj })
    } catch (error) {
        console.log(error);
        return res.status(500).send({ status: false, message: error.message })
    }
}

//--------login user--------//
const loginUser = async function (req, res) {
    try {
        let { email, password } = req.body

        if (!isValidRequest(req.body)) {
            return res.status(400).send({ status: false, message: 'please enter valid request' })
        }

        //validation Start
        if (!email) {
            return res.status(400).send({status: false, message : "email is missing"})
        }

        if (!isValid(email)) {
            return res.status(400).send({ status: false, message: "please give valid email input" })
        }
        
        if (!password) {
            return res.status(400).send({status: false, message : "password is missing"})
        }

        if (!isValid(password)) {
            return res.status(400).send({ status: false, message: "password give valid password input" })
        }

        let user = await userModel.findOne({ email: email, password: password })
        if (!user) {
            return res.status(404).send({ status: false, message: "invalid credentials" })
        }

        //it's token time

        let token = jwt.sign({
            userId: user._id.toString(),
            batch: "Room-28",
            organization: "BookManagement",
        }, "functioup-radon28")

        res.setHeader('x-api-key', token)
        return res.status(200).send({ status: true, message: "success", data: token })

    } catch (error) {
        console.log(error);
        return res.status(500).send({ status: false, message: error.message })

    }
}

module.exports = { createUser, loginUser }


