document.addEventListener("DOMContentLoaded", function () {

    const loginForm = document.getElementById("loginForm");
    const loginMsg = document.getElementById("loginMsg");

    loginForm.addEventListener("submit", function (e) {

        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value;

        if (!email || !password) {
            e.preventDefault();  // stop only if empty
            loginMsg.style.color = "red";
            loginMsg.textContent = "All fields are required!";
        }

        // If valid → form submits normally to Django
    });

});

document.addEventListener("DOMContentLoaded", function () {

    const regForm = document.getElementById("registerForm");
    const regMsg = document.getElementById("regMsg");

    regForm.addEventListener("submit", function (e) {

        const password = document.getElementById("regPassword").value;
        const confirm = document.getElementById("regConfirm").value;

        if (password !== confirm) {
            e.preventDefault();   // stop submission ONLY if error
            regMsg.style.color = "red";
            regMsg.textContent = "Passwords do not match!";
        }

        // If passwords match → form submits normally to Django
    });

});