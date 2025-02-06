function seterror(id, error) {
    var element = document.getElementById(id);
    element.parentElement.getElementsByClassName('formerror')[0].innerHTML = error;
}

function validateLoginForm() {
    var returnval = true;
    var errors = document.getElementsByClassName('formerror');

    for (let item of errors) {
        item.innerHTML = "";
    }

    var email = document.forms['LoginForm']["email"].value;
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        seterror("email", "*Enter a valid email address");
        returnval = false;
    }

    var password = document.forms['LoginForm']["password"].value;
    if (password.length < 6) {
        seterror("password", "*Password must be at least 6 characters long");
        returnval = false;
    }

    return returnval;
}

document.getElementById('email').oninput = function () {
    var emailInput = document.getElementById('email').value;
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailInput)) {
        seterror("email", "*Enter a valid email address");
    } else {
        seterror("email", ""); 
    }
};

document.getElementById('password').oninput = function () {
    var passwordInput = document.getElementById('password').value;
    if (passwordInput.length < 6) {
        seterror("password", "*Password must be at least 6 characters");
    } else {
        seterror("password", "");
    }
};