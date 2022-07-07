/*-----------------------------------------------USER VALIDATION */

//title validation
function isValidTitle(x){
    if(!x) return false;
    if(typeof x !== "string") return false;
    x = x.trim;
    if(x!=="Mr" || x!=="Mrs" || x!=="Miss") return false;
    return true
}

//name validation
function isValidName(x){
    if(!x || typeof x !== "string") return false;
    const regEx = /^\s*[a-zA-Z]+(\.[a-zA-Z\s]+)*[a-zA-Z\s]{2,64}\s*$/ ;
    return regEx.test(x);
}
// console.log(isValidName("ibrahim khan  "))
// console.log(isValidName("abc ..def"))

//phone no. validation
function isValidPhone(x){
    const regEx = /^\s*(\+[9][1][\-]?)?[6789][0-9]{9}\s*$/;
    return regEx.test(x);
}
// console.log(isValidPhone("8792518031"))
// console.log(isValidPhone("+91-8792518031"))

//email validation
function isValidEmail(x){
    const regEx = /^\s*[a-zA-Z][a-zA-Z0-9]*([-\.\_\+][a-zA-Z0-9]+)*\@[a-zA-Z]+(\.[a-zA-Z]{2,5})*\s*$/;
    return regEx.test(x)
}
// console.log(isValidEmail("ibrah-i.m_9+38@nit.gov.ac.in"))
// console.log(isValidEmail("qemsiw+58marqfwf17cw@sharklasers.com"))

//password validation
function isValidPassword(x){
    const regEx = /^\s*(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,15}\s*$/    ;
    return regEx.test(x);
}
// console.log(isValidPassword("The12345@!@#"))


function isValidAddress(x){
    if(typeof x !== "object") return false;
    if(Object.keys(x).length === 0) return false;
    return true
}

function isValidStreet(x){
    if(typeof x !== "string") return false;
    const regEx = /^\s*([\w]+([\s\.\-\:\,][a-zA-Z0-9]+)*){2,64}\s*$/
    return regEx.test(x);
}
// console.log(isValidStreet("ttt:56"))//true

//city calidation
function isValidCity(x){
    return isValidStreet(x);
}
// console.log(isValidCity("ttt:56, a"))//true


//pincode validation
function isValidPincode(x){
    if(typeof x !== "string") return false;
    const regEx = /^\s*[123456789][0-9]{5}\s*$/
    return regEx.test(x);
}
// console.log(isValidPincode("041226"))//false

//remove spaces
function removeSpaces(x){
    return x.split(" ").filter((y)=> y ).join(" ")
}
// console.log(removeSpaces("  r  emove      spaces  "))


//convert to upperacse
function trimAndUpperCase(x){
    x = x.split(" ").filter((y)=> y )
    return x.map((y)=> y.charAt(0).toUpperCase() + y.slice(1)).join(" ")
}


module.exports = {
                isValidTitle,
                isValidName,
                isValidPhone,
                isValidEmail,
                isValidPassword,
                isValidAddress,
                isValidStreet,
                isValidCity,
                isValidPincode,
                removeSpaces,
                trimAndUpperCase
            }