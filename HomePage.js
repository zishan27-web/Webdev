document.addEventListener("DOMContentLoaded", function () {
    const viewMoreButton = document.querySelector("#viewMoreBtn");
    const blogGrid = document.querySelector(".blog-grid");

    // New blog posts to be added in batches
    const newBlogs = [
        "Blog 9", "Blog 10", "Blog 11", "Blog 12",
        "Blog 13", "Blog 14", "Blog 15", "Blog 16"
    ];

    let batchIndex = 0;
    const batchSize = 4; // Load 4 blogs at a time

    viewMoreButton.addEventListener("click", function () {
        if (batchIndex < newBlogs.length) {
            for (let i = 0; i < batchSize && batchIndex < newBlogs.length; i++, batchIndex++) {
                const blogCard = document.createElement("div");
                blogCard.classList.add("blog-card");
                blogCard.textContent = newBlogs[batchIndex];
                blogGrid.appendChild(blogCard);
            }
        }
    });

    // Dark Mode Toggle
    const darkModeToggle = document.getElementById("darkModeToggle");
    if (localStorage.getItem("darkMode") === "enabled") {
        document.body.classList.add("dark-mode");
        darkModeToggle.innerText = "☀️ Light Mode";
    }

    darkModeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");

        if (document.body.classList.contains("dark-mode")) {
            localStorage.setItem("darkMode", "enabled");
            darkModeToggle.innerText = "☀️ Light Mode";
        } else {
            localStorage.setItem("darkMode", "disabled");
            darkModeToggle.innerText = "🌙 Dark Mode";
        }
    });

    // Image Carousel with Arrow Key Navigation
    const carouselImages = [
        "assets/image1.jpg",
        "assets/image2.jpg",
        "assets/image3.jpg",
        "assets/image4.jpg"
    ];

    let currentImageIndex = 0;
    const carouselElement = document.querySelector(".carousel-image");

    function updateCarousel() {
        carouselElement.src = carouselImages[currentImageIndex];
    }

    // Auto Change Images every 3 seconds
    setInterval(() => {
        currentImageIndex = (currentImageIndex + 1) % carouselImages.length;
        updateCarousel();
    }, 3000);

    // Keyboard Navigation (Left & Right Arrow Keys)
    document.addEventListener("keydown", function (event) {
        if (event.key === "ArrowRight") {
            currentImageIndex = (currentImageIndex + 1) % carouselImages.length;
        } else if (event.key === "ArrowLeft") {
            currentImageIndex = (currentImageIndex - 1 + carouselImages.length) % carouselImages.length;
        }
        updateCarousel();
    });

    // Initial load
    updateCarousel();
});
