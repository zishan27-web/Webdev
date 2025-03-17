// function seterror(id, error) {
//     var element = document.getElementById(id);
//     element.parentElement.getElementsByClassName('formerror')[0].innerHTML = error;
// }

// function validateSignupForm() {
//     var returnval = true;
//     var errors = document.getElementsByClassName('formerror');

//     for (let item of errors) {
//         item.innerHTML = "";
//     }

//     var username = document.forms['SignupForm']["username"].value;
//     if (username.length < 3 || !/^[A-Za-z\s]*$/.test(username)) {
//         seterror("username", "*Username must be at least 3 characters long and only contain alphabets");
//         returnval = false;
//     }

//     var email = document.forms['SignupForm']["email"].value;
//     var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailPattern.test(email)) {
//         seterror("email", "*Enter a valid email address");
//         returnval = false;
//     }

//     var password = document.forms['SignupForm']["password"].value;
//     if (password.length < 6) {
//         seterror("password", "*Password must be at least 6 characters long");
//         returnval = false;
//     }

//     var confirmPassword = document.forms['SignupForm']["confirm-password"].value;
//     if (confirmPassword !== password) {
//         seterror("confirm-password", "*Passwords do not match");
//         returnval = false;
//     }

//     var profession = document.forms['SignupForm']["profession"].value;
//     if (profession === "Choose profession") {
//         seterror("profession", "*Please select your profession");
//         returnval = false;
//     }

//     var birthdate = document.forms['SignupForm']["birthdate"].value;
//     if (birthdate === "") {
//         seterror("birthdate", "*Please enter your birth date");
//         returnval = false;
//     }

//     var gender = document.forms['SignupForm']["gender"].value;
//     if (!gender) {
//         seterror("gender", "*Please select your gender");
//         returnval = false;
//     }

//     return returnval;
// }

// document.getElementById('username').oninput = function () {
//     var usernameInput = document.getElementById('username').value;
//     if (usernameInput.length < 3 || !/^[A-Za-z\s]*$/.test(usernameInput)) {
//         seterror("username", "*Only alphabets are allowed, and at least 3 characters");
//     } else {
//         seterror("username", "");
//     }
// };

// document.getElementById('email').oninput = function () {
//     var emailInput = document.getElementById('email').value;
//     var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailPattern.test(emailInput)) {
//         seterror("email", "*Enter a valid email address");
//     } else {
//         seterror("email", "");
//     }
// };

// document.getElementById('password').oninput = function () {
//     var passwordInput = document.getElementById('password').value;
//     if (passwordInput.length < 6) {
//         seterror("password", "*Password must be at least 6 characters");
//     } else {
//         seterror("password", "");
//     }
// };

// document.getElementById('confirm-password').oninput = function () {
//     var passwordInput = document.getElementById('password').value;
//     var confirmPasswordInput = document.getElementById('confirm-password').value;
//     if (confirmPasswordInput !== passwordInput) {
//         seterror("confirm-password", "*Passwords do not match");
//     } else {
//         seterror("confirm-password", "");
//     }
// };

// function displayProfession() {
//     const professionDropdown = document.getElementById("profession");
//     const feedbackDiv = document.getElementById("profession-feedback");

//     // Get the selected value
//     const selectedProfession = professionDropdown.value;

//     // Update feedback text
//     if (selectedProfession) {
//         feedbackDiv.textContent = `You selected: ${selectedProfession}`;
//     } else {
//         feedbackDiv.textContent = ""; // Clear feedback if no selection
//     }
// }



document.addEventListener("DOMContentLoaded", () => {
    const signupForm = document.querySelector("form[name='SignupForm']");

    signupForm.addEventListener("submit", async (event) => {
        event.preventDefault(); // Prevent the default form submission

        // Get form data
        const formData = {
            username: document.getElementById("username").value,
            email: document.getElementById("email").value,
            password: document.getElementById("password").value,
            confirmPassword: document.getElementById("confirm-password").value,
            profession: document.getElementById("profession").value,
            birthdate: document.getElementById("birthdate").value,
            gender: document.querySelector("input[name='gender']:checked").value
        };

        console.log("Form data:", formData); // Log form data

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            // Send a POST request to the backend
            const response = await fetch("http://localhost:5000/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            console.log("Response status:", response.status); // Log response status

            const data = await response.json();
            console.log("Response data:", data); // Log response data

            if (!response.ok) {
                throw new Error(data.message || "Signup failed. Please try again.");
            }

            alert(data.message); // "Signup successful!"
            window.location.href = "home.html"; // Redirect to home page after successful signup
        } catch (error) {
            console.error("Error during signup:", error); // Log the full error
            alert(error.message); // Display the error message
        }
    });
});