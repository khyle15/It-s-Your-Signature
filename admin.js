let currentUser = null;

document.addEventListener("DOMContentLoaded", () => {
  currentUser = validateSession();
  if (!currentUser || currentUser.role !== "admin") {
    window.location.href = "index.html";
    return;
  }

  document.getElementById("admin-welcome").textContent = `Welcome, ${currentUser.name}`;

  loadAdminData();
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

function loadAdminData() {
  const users = JSON.parse(localStorage.getItem("ct_users") || "[]");
  const requests = JSON.parse(localStorage.getItem("ct_requests") || "[]");
  const clients = users.filter(u => u.role === "client");

  document.getElementById("total-clients").textContent = clients.length;
  document.getElementById("total-requests").textContent = requests.length;
  document.getElementById("pending-requests").textContent = requests.filter(r => r.status === "Pending").length;
  document.getElementById("completed-requests").textContent = requests.filter(r => r.status === "Completed").length;

  loadClients(clients);
  loadRequests(requests, users);
}

function loadClients(clients) {
  const list = document.getElementById("clients-list");
  list.innerHTML = clients.map(client => `
    <div class="client-card">
      <h3>${client.name}</h3>
      <p>${client.company}</p>
      <p>${client.email}</p>
      <button onclick="editClient('${client.id}')">Edit Client</button>
    </div>
  `).join("");
}

function loadRequests(requests, users) {
  const list = document.getElementById("requests-list");
  list.innerHTML = requests.map(req => {
    const client = users.find(u => u.id === req.clientId);
    return `
      <div class="request-card">
        <h4>${req.title}</h4>
        <p>Client: ${client ? client.name : "Unknown"}</p>
        <p>Status: ${req.status}</p>
      </div>
    `;
  }).join("");
}

function editClient(clientId) {
  // To be fully implemented: client edit modal with visible password generation, copy, and show/hide.
  alert(`Edit client functionality coming soon for client ID: ${clientId}`);
}

function logout() {
  localStorage.removeItem("ct_currentUser");
  localStorage.removeItem("ct_sessionActive");
  window.location.href = "index.html";
}

function setupEventListeners() {
  // Add event listeners for forms and filters
}
