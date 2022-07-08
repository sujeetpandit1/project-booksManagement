function isBookTitle(x){
    const regEx = /^\s*[a-zA-Z0-9]+(\.[a-zA-Z0-9\s]+)*[a-zA-Z0-9\s]{1,64}\s*$/ ;
    return regEx.test(x);
}

function isBookExcerpt(x){
    const regEx = /^\s*[a-zA-Z0-9]+([\.\_\-][a-zA-Z0-9\s]+)*[\w\s\.\-\,\+\=!@#$%^&*]{2,1024}\s*$/ ;
    return regEx.test(x);
}
