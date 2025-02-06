document.addEventListener("DOMContentLoaded", function () {
    const imageUpload = document.getElementById("imageUpload");
    const previewImage = document.getElementById("previewImage");
    const blogForm = document.getElementById("blogForm");
    const blogTitle = document.getElementById("blogTitle");
    const blogContent = document.getElementById("blogContent");

    // Load saved data from localStorage (if available)
    if (localStorage.getItem("previewImage")) {
        previewImage.src = localStorage.getItem("previewImage");
        previewImage.style.display = "block";
    }
    if (localStorage.getItem("blogTitle")) {
        blogTitle.value = localStorage.getItem("blogTitle");
    }
    if (localStorage.getItem("blogContent")) {
        blogContent.value = localStorage.getItem("blogContent");
    }

    // Event listener for image upload
    imageUpload.addEventListener("change", function () {
        const file = imageUpload.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                previewImage.src = e.target.result;
                previewImage.style.display = "block";
                // Save to localStorage
                localStorage.setItem("previewImage", e.target.result);
            };
            reader.readAsDataURL(file);
        }
    });

    // Save text input in localStorage to persist data
    blogTitle.addEventListener("input", function () {
        localStorage.setItem("blogTitle", blogTitle.value);
    });

    blogContent.addEventListener("input", function () {
        localStorage.setItem("blogContent", blogContent.value);
    });

    // Handle form submission
    blogForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent page refresh

        // Get values
        const title = blogTitle.value.trim();
        const content = blogContent.value.trim();

        if (title && content) {
            alert("Blog submitted successfully!");

            // Clear localStorage
            localStorage.removeItem("previewImage");
            localStorage.removeItem("blogTitle");
            localStorage.removeItem("blogContent");

            // Refresh the page
            window.location.reload();
        } else {
            alert("Please fill in all fields before submitting.");
        }
    });
});