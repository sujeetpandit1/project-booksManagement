const mongoose = require('mongoose')

const isValid = function (value) {
    if (typeof value === "undefined" || typeof value === null) return false
    if (typeof value === "string" && value.trim().length == 0) return false
    return true 
}

// const isValid = function (value) {
//     if (typeof value == "number" || typeof value == "boolean" || value == null ) return false
//     if (typeof value === "string" && value.trim().length == 0) return false
//     return true 
// }

const removeSpace = function (value) {
    let check = value.split(" ").filter(abc => abc).join(" ")
     return check
}

const isValidObjectId = function (value) {
    let ObjectId = mongoose.Schema.Types.ObjectId
    return ObjectId.isValid(value)
}

const isValidPhone = function (value) {
    return /^[6789][0-9]{9}$/.test(value)
}

const isValidRequest = function (value) {
    if (Object.keys(value).length == 0 ) return false
    return true
}

const isValidEmail = function(value) {
    return /^([0-9a-z]([-_\\.]*[0-9a-z]+)*)@([a-z]([-_\\.]*[a-z]+)*)[\\.]([a-z]{2,9})+$/.test(value);
}

const isValidPassword = function (password) {
    return /^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,15}$/.test(password) 
}

const checkPincode = function (value) {
    return /^[123456789][0-9]{5}$/.test(value)
}

module.exports = {isValid, isValidRequest,isValidPhone,isValidObjectId, isValidPassword, removeSpace, isValidEmail,  checkPincode}