<<<<<<< HEAD

const firebaseConfig = {
    apiKey: "AIzaSyDVPC-bqN691qzIfT8B_mWxs4WJskgX7-U",
    authDomain: "luminapath-d25d4.firebaseapp.com",
    projectId: "luminapath-d25d4",
    storageBucket: "luminapath-d25d4.firebasestorage.app",
    messagingSenderId: "147151629612",
    appId: "1:147151629612:web:5f70cc0804913628c65089"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();
const db = firebase.database();

auth.onAuthStateChanged((user) => {
    const authBtn = document.getElementById('auth-btn');
    const profileLink = document.getElementById('profile-link');
    
    if (user) {
        if (authBtn) {
            authBtn.innerText = "Logout";
            authBtn.href = "#";
            authBtn.onclick = logoutUser;
        }
        if (profileLink) {
            profileLink.style.display = "inline-block"; 
        }
        
        if (window.location.pathname.includes("profile.html")) {
            loadProfileData(user);
        }

    } else {
        if (authBtn) {
            authBtn.innerText = "Register";
            authBtn.href = "register.html";
            authBtn.onclick = null;
        }
        if (profileLink) {
            profileLink.style.display = "none"; 
        }

        if (window.location.pathname.includes("profile.html")) {
            window.location.href = "register.html";
        }
    }
});

// Logout Function
function logoutUser() {
    auth.signOut().then(() => {
        alert("Logged out successfully");
        window.location.href = "index.html";
    }).catch((error) => {
        console.error("Logout Error:", error);
    });
}

function loadProfileData(user) {
    const nameEl = document.getElementById('user-name');
    const emailEl = document.getElementById('user-email');
    const welcomeEl = document.getElementById('welcome-msg');
    
    if (emailEl) emailEl.innerText = user.email;

    db.ref('users/' + user.uid).once('value').then((snapshot) => {
        const data = snapshot.val();
        if (data && data.username) {
            if (nameEl) nameEl.innerText = data.username;
            if (welcomeEl) welcomeEl.innerText = `Welcome back, ${data.username.split(' ')[0]}!`;
        } else {
            if (nameEl) nameEl.innerText = "Lumina User";
        }
    });
=======

const firebaseConfig = {
    apiKey: "AIzaSyDVPC-bqN691qzIfT8B_mWxs4WJskgX7-U",
    authDomain: "luminapath-d25d4.firebaseapp.com",
    projectId: "luminapath-d25d4",
    storageBucket: "luminapath-d25d4.firebasestorage.app",
    messagingSenderId: "147151629612",
    appId: "1:147151629612:web:5f70cc0804913628c65089"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();
const db = firebase.database();

auth.onAuthStateChanged((user) => {
    const authBtn = document.getElementById('auth-btn');
    const profileLink = document.getElementById('profile-link');
    
    if (user) {
        if (authBtn) {
            authBtn.innerText = "Logout";
            authBtn.href = "#";
            authBtn.onclick = logoutUser;
        }
        if (profileLink) {
            profileLink.style.display = "inline-block"; 
        }
        
        if (window.location.pathname.includes("profile.html")) {
            loadProfileData(user);
        }

    } else {
        if (authBtn) {
            authBtn.innerText = "Register";
            authBtn.href = "register.html";
            authBtn.onclick = null;
        }
        if (profileLink) {
            profileLink.style.display = "none"; 
        }

        if (window.location.pathname.includes("profile.html")) {
            window.location.href = "register.html";
        }
    }
});

// Logout Function
function logoutUser() {
    auth.signOut().then(() => {
        alert("Logged out successfully");
        window.location.href = "index.html";
    }).catch((error) => {
        console.error("Logout Error:", error);
    });
}

function loadProfileData(user) {
    const nameEl = document.getElementById('user-name');
    const emailEl = document.getElementById('user-email');
    const welcomeEl = document.getElementById('welcome-msg');
    
    if (emailEl) emailEl.innerText = user.email;

    db.ref('users/' + user.uid).once('value').then((snapshot) => {
        const data = snapshot.val();
        if (data && data.username) {
            if (nameEl) nameEl.innerText = data.username;
            if (welcomeEl) welcomeEl.innerText = `Welcome back, ${data.username.split(' ')[0]}!`;
        } else {
            if (nameEl) nameEl.innerText = "Lumina User";
        }
    });
>>>>>>> a2027aae10bd744b1f1e9650888ad512b325176b
}