const userModel = require('../models/userModel')


const createUser= async function(req, res){
    try {
        let data= req.body
        let createUser=await userModel.create(data)
        res.send({status:true, message: "success" , data:data})
    } catch (error) {
        res.send({status:false, message:err.message})
        
    }
       
    
}

module.exports={createUser}


