function validation() {
    // Check Name
    checkname = namevalidation();

    // Check Email
    checkemail = emailvalidation();

    // Check subject
    checksubject = subjectvalidation();

    // Check Phone Number
    checkphone = phonevalidation();

    // All fields are valid
    return checkname && checkemail && checksubject && checkphone;
}

function namevalidation() {
    var name = document.getElementById("inputName").value;
    if (name.length == 0) {
        document.getElementById("nameMsg").innerHTML = "<em>You did not enter your name</em>";
        document.getElementById("nameMsg").classList.add("text-danger");
        document.getElementById("nameMsg").classList.remove("text-success");

        return false;
    }
    else {
        document.getElementById("nameMsg").innerHTML = "<em>Valid</em>";
        document.getElementById("nameMsg").classList.add("text-success");
        document.getElementById("nameMsg").classList.remove("text-danger");

        return true;
    }
}
function emailvalidation() {
    var email = document.getElementById("inputEmail").value;
    var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/i;
    if (!emailPattern.test(email)) {
        document.getElementById("emailMsg").innerHTML = "<em>MUST be a valid email'</em>";
        document.getElementById("emailMsg").classList.add("text-danger");
        document.getElementById("emailMsg").classList.remove("text-success");
        return false;
    }
    else {
        document.getElementById("emailMsg").innerHTML = "<em>Valid</em>";
        document.getElementById("emailMsg").classList.add("text-success");
        document.getElementById("emailMsg").classList.remove("text-danger");

        return true;
    }
}
function subjectvalidation() {
    var subjectcontent = document.getElementById("subject").value;
    // var unitCodePattern = /^[a-zA-Z]{3}\d{3}$/;
    if (subjectcontent == 0) {
        document.getElementById("subjectMsg").innerHTML = "<em>You did not enter anything</em>";
        document.getElementById("subjectMsg").classList.add("text-danger");
        document.getElementById("subjectMsg").classList.remove("text-success");
        return false;
    }
    else {
        document.getElementById("subjectMsg").classList.add("text-success");
        document.getElementById("subjectMsg").classList.remove("text-danger");
        document.getElementById("subjectMsg").innerHTML = "<em>Valid</em>";
        return true;
    }
}
function phonevalidation() {
    var phoneNumber = document.getElementById("inputPhone").value;
    var phoneNumberPattern = /^\d{10}$/;

    if(!phoneNumberPattern.test(phoneNumber))
    {
        var firstNonDigit = phoneNumber.match(/\D/);
        if (firstNonDigit){
            document.getElementById("phoneMsg").innerHTML = `<em>Invalid character '${firstNonDigit}' in phone number</em>`;
            document.getElementById("phoneMsg").classList.add("text-danger");
            document.getElementById("phoneMsg").classList.remove("text-success");
            return false;
        }
        else {
            document.getElementById("phoneMsg").innerHTML = `<em>Phone number MUST HAVE 10 characters</em>`;
            document.getElementById("phoneMsg").classList.add("text-danger");
            document.getElementById("phoneMsg").classList.remove("text-success");
            return false;
        }
    }
    else {
        document.getElementById("phoneMsg").innerHTML = "<em>Valid</em>";
        document.getElementById("phoneMsg").classList.add("text-success");
        document.getElementById("phoneMsg").classList.remove("text-danger");

        return true;
    }
}

