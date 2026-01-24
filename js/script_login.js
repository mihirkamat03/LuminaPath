<<<<<<< HEAD
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const slider = document.querySelector('.toggle-slider');
const btns = document.querySelectorAll('.toggle-btn');

function showLogin() {
    loginForm.style.transform = "translateX(0)";
    signupForm.style.transform = "translateX(400px)";
    loginForm.classList.remove('hidden');
    signupForm.classList.add('hidden');

    slider.style.left = "0";
    btns[0].classList.add('active');
    btns[1].classList.remove('active');
}

function showSignup() {
    loginForm.style.transform = "translateX(-400px)";
    signupForm.style.transform = "translateX(0)";
    loginForm.classList.add('hidden');
    signupForm.classList.remove('hidden');

    slider.style.left = "50%";
    btns[0].classList.remove('active');
    btns[1].classList.add('active');
}


const firebaseConfig = {
    apiKey: "AIzaSyDVPC-bqN691qzIfT8B_mWxs4WJskgX7-U",
    authDomain: "luminapath-d25d4.firebaseapp.com",
    projectId: "luminapath-d25d4",
    storageBucket: "luminapath-d25d4.firebasestorage.app",
    messagingSenderId: "147151629612",
    appId: "1:147151629612:web:5f70cc0804913628c65089"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();

document.querySelector('#signupForm .submit-btn').addEventListener('click', (e) => {
    e.preventDefault();

    const inputs = document.querySelectorAll('#signupForm input');
    const name = inputs[0].value;
    const email = inputs[1].value;
    const password = inputs[2].value;

    if (!name || !email || !password) {
        alert("Please fill in all fields");
        return;
    }

    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;

            return db.ref('users/' + user.uid).set({
                username: name,
                email: email,
                uid: user.uid,
            });
        })
        .then(() => {
            alert("Account Created Successfully!");

            window.location.href = "index.html";
        })
        .catch((error) => alert(error.message));
});

// --- LOGIN LOGIC ---
document.querySelector('#loginForm .submit-btn').addEventListener('click', (e) => {
    e.preventDefault();
    const inputs = document.querySelectorAll('#loginForm input');
    const email = inputs[0].value;
    const password = inputs[1].value;

    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            window.location.href = "index.html";
        })
        .catch((error) => alert("Email/ Password seems to be wrong, please re-check it"));
=======
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const slider = document.querySelector('.toggle-slider');
const btns = document.querySelectorAll('.toggle-btn');

function showLogin() {
    loginForm.style.transform = "translateX(0)";
    signupForm.style.transform = "translateX(400px)";
    loginForm.classList.remove('hidden');
    signupForm.classList.add('hidden');

    slider.style.left = "0";
    btns[0].classList.add('active');
    btns[1].classList.remove('active');
}

function showSignup() {
    loginForm.style.transform = "translateX(-400px)";
    signupForm.style.transform = "translateX(0)";
    loginForm.classList.add('hidden');
    signupForm.classList.remove('hidden');

    slider.style.left = "50%";
    btns[0].classList.remove('active');
    btns[1].classList.add('active');
}


const firebaseConfig = {
    apiKey: "AIzaSyDVPC-bqN691qzIfT8B_mWxs4WJskgX7-U",
    authDomain: "luminapath-d25d4.firebaseapp.com",
    projectId: "luminapath-d25d4",
    storageBucket: "luminapath-d25d4.firebasestorage.app",
    messagingSenderId: "147151629612",
    appId: "1:147151629612:web:5f70cc0804913628c65089"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();

document.querySelector('#signupForm .submit-btn').addEventListener('click', (e) => {
    e.preventDefault();

    const inputs = document.querySelectorAll('#signupForm input');
    const name = inputs[0].value;
    const email = inputs[1].value;
    const password = inputs[2].value;

    if (!name || !email || !password) {
        alert("Please fill in all fields");
        return;
    }

    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;

            return db.ref('users/' + user.uid).set({
                username: name,
                email: email,
                uid: user.uid,
            });
        })
        .then(() => {
            alert("Account Created Successfully!");

            window.location.href = "index.html";
        })
        .catch((error) => alert(error.message));
});

// --- LOGIN LOGIC ---
document.querySelector('#loginForm .submit-btn').addEventListener('click', (e) => {
    e.preventDefault();
    const inputs = document.querySelectorAll('#loginForm input');
    const email = inputs[0].value;
    const password = inputs[1].value;

    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            window.location.href = "index.html";
        })
        .catch((error) => alert("Email/ Password seems to be wrong, please re-check it"));
>>>>>>> a2027aae10bd744b1f1e9650888ad512b325176b
});