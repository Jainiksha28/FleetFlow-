const loginForm = document.getElementById('loginForm');
const loginMsg = document.getElementById('loginMsg');

function getUsers() {
  const data = localStorage.getItem('fleet_users');
  return data ? JSON.parse(data) : [];
}

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const role = document.getElementById('loginRole').value;

  const users = getUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password && u.role === role);

  if (!user) {
    loginMsg.textContent = "Invalid credentials or role!";
    return;
  }

  loginMsg.style.color = 'green';
  loginMsg.textContent = "Login successful! Redirecting...";

  setTimeout(() => {
    if (role === "manager") window.location.href = "dashboard.html";
    else if (role === "dispatcher") window.location.href = "trips.html";
    else window.location.href = "dashboard.html";
  }, 1000);
});




const regForm = document.getElementById('registerForm');
const regMsg = document.getElementById('regMsg');

function getUsers() {
  const data = localStorage.getItem('fleet_users');
  return data ? JSON.parse(data) : [];
}

function saveUsers(users) {
  localStorage.setItem('fleet_users', JSON.stringify(users));
}

regForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const pass = document.getElementById('regPassword').value;
  const confirm = document.getElementById('regConfirm').value;
  const role = document.getElementById('regRole').value;

  if (pass !== confirm) {
    regMsg.textContent = "Passwords don't match!";
    return;
  }

  const users = getUsers();
  if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
    regMsg.textContent = "Email already registered!";
    return;
  }

  users.push({ name, email, password: pass, role });
  saveUsers(users);
  regMsg.style.color = 'green';
  regMsg.textContent = "Registration successful! Redirecting...";
  setTimeout(() => window.location.href = 'index.html', 1000);
});