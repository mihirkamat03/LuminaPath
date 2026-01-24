
const firebaseConfig = {
    apiKey: "AIzaSyDVPC-bqN691qzIfT8B_mWxs4WJskgX7-U",
    authDomain: "luminapath-d25d4.firebaseapp.com",
    projectId: "luminapath-d25d4",
    storageBucket: "luminapath-d25d4.firebasestorage.app",
    messagingSenderId: "147151629612",
    appId: "1:147151629612:web:5f70cc0804913628c65089"
};

// Initialize only if not already initialized
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();
const db = firebase.database();

// 2. Listen for User Login/Logout State
auth.onAuthStateChanged((user) => {
    const authBtn = document.getElementById('auth-btn');
    const profileLink = document.getElementById('profile-link');
    
    if (user) {
        // --- USER IS LOGGED IN ---
        if (authBtn) {
            authBtn.innerText = "Logout";
            authBtn.href = "#";
            authBtn.onclick = logoutUser; // Attach logout function
        }
        if (profileLink) {
            profileLink.style.display = "inline-block"; // Show Profile link
        }
        
        // If we are on the Profile Page, load user data
        if (window.location.pathname.includes("profile.html")) {
            loadProfileData(user);
        }

    } else {
        // --- USER IS LOGGED OUT ---
        if (authBtn) {
            authBtn.innerText = "Register";
            authBtn.href = "register.html";
            authBtn.onclick = null;
        }
        if (profileLink) {
            profileLink.style.display = "none"; // Hide Profile link
        }

        // Redirect to login if trying to access profile while logged out
        if (window.location.pathname.includes("profile.html")) {
            window.location.href = "register.html";
        }
    }
});

// 3. Logout Function
function logoutUser() {
    auth.signOut().then(() => {
        alert("Logged out successfully");
        window.location.href = "index.html";
    }).catch((error) => {
        console.error("Logout Error:", error);
    });
}

// 4. Load Profile Data (For Profile Page)
function loadProfileData(user) {
    const nameEl = document.getElementById('user-name');
    const emailEl = document.getElementById('user-email');
    const welcomeEl = document.getElementById('welcome-msg');
    
    // Set basic info from Auth
    if (emailEl) emailEl.innerText = user.email;

    // Fetch custom data (Username) from Realtime Database
    db.ref('users/' + user.uid).once('value').then((snapshot) => {
        const data = snapshot.val();
        if (data && data.username) {
            if (nameEl) nameEl.innerText = data.username;
            if (welcomeEl) welcomeEl.innerText = `Welcome back, ${data.username.split(' ')[0]}!`;
        } else {
            if (nameEl) nameEl.innerText = "Lumina User";
        }
    });
}