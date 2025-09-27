let currentUser = null;

document.addEventListener("DOMContentLoaded", () => {
  currentUser = validateSession();
  if (!currentUser || currentUser.role !== "client") {
    window.location.href = "index.html";
    return;
  }

  document.getElementById("client-welcome").textContent = `Welcome, ${currentUser.name}`;

  loadClientRequests();
  setupEventListeners();
});

function validateSession() {
  const user = JSON.parse(localStorage.getItem("ct_currentUser") || "null");
  const active = localStorage.getItem("ct_sessionActive");
  if (!user || active !== "true") {
    return null;
  }
  return user;
}

function loadClientRequests() {
  const requests = JSON.parse(localStorage.getItem("ct_requests") || "[]");
  const myRequests = requests.filter(r => r.clientId === currentUser.id);
  const list = document.getElementById("client-requests-list");
  if (!list) return;

  list.innerHTML = myRequests.map(req => `
    <div class="request-card">
      <h4>${req.title}</h4>
      <p>Status: ${req.status}</p>
      <p>${req.description}</p>
    </div>
  `).join("");
}

function logout() {
  localStorage.removeItem("ct_currentUser");
  localStorage.removeItem("ct_sessionActive");
  window.location.href = "index.html";
}

function setupEventListeners() {
  document.getElementById("password-change-form")?.addEventListener("submit", changePassword);
}

function changePassword(e) {
  e.preventDefault();

  const currentPass = document.getElementById("current-password").value;
  const newPass = document.getElementById("new-password").value;
  const confirmPass = document.getElementById("confirm-password").value;

  if (currentPass !== currentUser.password) {
    alert("Current password is incorrect");
    return;
  }

  if (newPass.length < 6) {
    alert("New password must be at least 6 characters");
    return;
  }

  if (newPass !== confirmPass) {
    alert("New passwords do not match");
    return;
  }

  const users = JSON.parse(localStorage.getItem("ct_users") || "[]");
  const index = users.findIndex(u => u.id === currentUser.id);
  if (index !== -1) {
    users[index].password = newPass;
    localStorage.setItem("ct_users", JSON.stringify(users));
    currentUser.password = newPass;
    localStorage.setItem("ct_currentUser", JSON.stringify(currentUser));
    alert("Password changed successfully");
    document.getElementById("password-change-form").reset();
  }
}
