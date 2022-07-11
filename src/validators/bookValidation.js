const { default: mongoose } = require("mongoose");
const validator = require('validator');

//title validation
function isBookTitle(x){
    const regEx = /^\s*[a-zA-Z0-9]+(\.[a-zA-Z0-9\s]+)*[a-zA-Z0-9\s]{1,64}\s*$/ ;
    return regEx.test(x);
}

//Excerpt validation
function isExcerpt(x){
    if(!x || typeof x !== "string") return false;
    const regEx = /\s*[a-zA-Z]{2,}\s*/g ;
    return Boolean(x.match(regEx)); 
}


//ISBN validation
function isISBN(x){
    if(typeof x !== "string") return false
    const regEx = /^\s*([9][7][89][-]?)?[\d][-]?[\d]{4}[-]?[\d]{4}[-]?[\d]\s*$/;
    return regEx.test(x);
}


//categroy
function isCategory(x){ return isExcerpt(x)}

//subCategory
function isSubcategory(x){ return isExcerpt(x)}

//review validation
function isReviewCount(x){
    //review count will be updated by server not by user
}

// function isDate(x){
//     const reg1 = /^[12][\d]{3}[-][01][\d]-[0123][\d](\s[\d]{2}:[\d]{2}:[\d]{2})?$/
//     return reg1.test(x)
// }


module.exports = {isBookTitle, isExcerpt, isISBN, isCategory, isSubcategory, isDate}


