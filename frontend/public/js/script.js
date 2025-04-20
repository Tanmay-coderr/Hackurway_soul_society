// Simulate login check
function isLoggedIn() {
    return localStorage.getItem("loggedIn") === "true";
}

document.addEventListener("DOMContentLoaded", () => {
    const profileLink = document.getElementById("profile-link");
    
    if (profileLink) {
        profileLink.addEventListener("click", (e) => {
            e.preventDefault();
            if (isLoggedIn()) {
                window.location.href = "profile.html";
            } else {
                window.location.href = "login.html";
            }
        });
    }
});
