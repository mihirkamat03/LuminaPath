const firebaseConfig = {
    apiKey: CONFIG.FIREBASE_API_KEY,
    authDomain: "luminapath-d25d4.firebaseapp.com",
    projectId: "luminapath-d25d4"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();
const db = firebase.database();

auth.onAuthStateChanged((user) => {
    const registerBtn = document.getElementById('auth-btn'); 
    const userDock = document.getElementById('user-dock'); // NEW ID
    
    if (user) {
        // --- LOGGED IN ---
        if (registerBtn) registerBtn.style.display = "none"; 
        if (userDock) userDock.classList.remove('hidden'); // Show the Dock
        
        if (window.location.pathname.includes("profile.html")) {
            loadProfileData(user);
        }

    } else {
        // --- LOGGED OUT ---
        if (registerBtn) registerBtn.style.display = "block"; 
        if (userDock) userDock.classList.add('hidden'); // Hide the Dock

        if (window.location.pathname.includes("profile.html")) {
            window.location.href = "register.html";
        }
    }
});

// --- THE MISSING FUNCTION IS ADDED HERE ---
function loadProfileData(user) {
    // 1. Set Email from Auth
    const emailEl = document.getElementById('user-email');
    if (emailEl) emailEl.innerText = user.email;

    // 2. Fetch Username from Database
    const nameEl = document.getElementById('user-name');
    const welcomeEl = document.getElementById('welcome-msg');

    db.ref('users/' + user.uid).once('value')
        .then((snapshot) => {
            const data = snapshot.val();
            if (data && data.username) {
                if (nameEl) nameEl.innerText = data.username;
                if (welcomeEl) welcomeEl.innerText = `Welcome Back, ${data.username}!`;
            } else {
                if (nameEl) nameEl.innerText = "Lumina User";
            }
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
            if (nameEl) nameEl.innerText = "User";
        });
}

// Logout Function
function logoutUser() {
    auth.signOut().then(() => {
        alert("Logged out successfully");
        window.location.href = "index.html";
    }).catch((error) => {
        console.error("Logout Error:", error);
    });
}