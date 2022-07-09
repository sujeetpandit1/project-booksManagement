const { default: mongoose } = require("mongoose");
const validator = require('validator');

//title validation
function isBookTitle(x){
    const regEx = /^\s*[a-zA-Z0-9]+(\.[a-zA-Z0-9\s]+)*[a-zA-Z0-9\s]{1,64}\s*$/ ;
    return regEx.test(x);
}

//Excerpt validation
function isBookExcerpt(x){
    const regEx = /^\s*[a-zA-Z0-9]+([\.\_\-][a-zA-Z0-9\s]+)*[\w\s\.\-\,\+\=!@#$%^&*]{2,1024}\s*$/ ;
    return regEx.test(x);
}

//userId validation
//by mongoose.Types.ObjectId.isValid(x)
// console.log(mongoose.Types.ObjectId.isValid("123456789012"))//working fine

/*
Every ISBN consists of thirteen digits and whenever it is printed it is preceded by the letters ISBN. The thirteen-digit number is divided into four parts of variable length, each part separated by a hyphen.

Does the ISBN have any meaning embedded in the numbers?
The four parts of an ISBN are as follows:
Group or country identifier which identifies a national or geographic grouping of publishers;
Publisher identifier which identifies a particular publisher within a group;
Title identifier which identifies a particular title or edition of a title;
Check digit is the single digit at the end of the ISBN which validates the ISBN.

{{ISBN|1-4133-0454-0}}   produces ISBN 1-4133-0454-0
{{ISBN|978-1-4133-0454-1}}   produces ISBN 978-1-4133-0454-1
*/
//ISBN validation
function isISBN(x){
    if(typeof x !== "string") return false
    const regEx = /^\s*([9][7][89][-]?)?[\d][-]?[\d]{4}[-]?[\d]{4}[-]?[\d]\s*$/;
    return regEx.test(x);
}
// console.log(isISBN("9781234567890"))
// console.log(isISBN("1-2345-67890"))
// console.log(isISBN("1-2345-678901"))

//review validation
function isReviewCount(x){
    //review count will be updated by server not by user
}

function isDate(x){
    const reg1 = /^[12][\d]{3}[-][01][\d]-[0123][\d](\s[\d]{2}:[\d]{2}:[\d]{2})?$/
    return reg1.test(x)
}
// console.log(isDate("05-06-1995"))
// console.log(isDate("05-06-1995 22:35:36"))
// console.log(isDate("1995-06-05"))
// console.log(isDate("1995-06-05 22:35:36"))

module.exports = {isBookTitle, isBookExcerpt, isISBN, isDate}


