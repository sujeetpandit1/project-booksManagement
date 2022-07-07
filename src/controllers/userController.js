const userModel = require('../models/userModel.js');

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


module.exports.createUser = createUser;