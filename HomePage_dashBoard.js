document.addEventListener("DOMContentLoaded", () => {
    // Get the user data from localStorage
    const userData = localStorage.getItem("user");
    
    if (!userData) {
        console.log("No user data found, redirecting to login");
        window.location.href = "SignIn.html";
        return;
    }

    try {
        const user = JSON.parse(userData);
        console.log("Dashboard JS is working, user data:", user);
        
        // Get the username display element
        const usernameDisplay = document.getElementById("username-display");
        
        if (usernameDisplay) {
            // Display the actual username if available, otherwise fallback to email
            const displayName = user.username || user.email.split('@')[0];
            usernameDisplay.textContent = `Welcome, ${displayName}!`;
            usernameDisplay.style.color = '#fff';  // Make it white to match navbar
            usernameDisplay.style.marginLeft = '10px';  // Add some spacing
        } else {
            console.error("username-display element not found");
        }

        // Set username in both places
        document.getElementById("username-display").textContent = user.username;
        document.getElementById("sidebar-username").textContent = user.username;

        // Profile and Sidebar functionality
        const profileContainer = document.getElementById("profileContainer");
        const sidebar = document.getElementById("sidebar");
        const overlay = document.getElementById("overlay");
        const logoutBtn = document.getElementById("logoutBtn");

        // Toggle sidebar when clicking profile
        profileContainer.addEventListener("click", () => {
            sidebar.classList.add("active");
            overlay.classList.add("active");
        });

        // Close sidebar when clicking overlay
        overlay.addEventListener("click", () => {
            sidebar.classList.remove("active");
            overlay.classList.remove("active");
        });

        // Handle logout
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("user");
            window.location.href = "HomePage.html";
        });

        // Close sidebar when clicking outside
        document.addEventListener("click", (e) => {
            if (!sidebar.contains(e.target) && !profileContainer.contains(e.target)) {
                sidebar.classList.remove("active");
                overlay.classList.remove("active");
            }
        });

    } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("user");  // Clear invalid data
        window.location.href = "SignIn.html";
    }
});