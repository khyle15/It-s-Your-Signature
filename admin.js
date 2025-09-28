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
    
    // Update dashboard stats
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
            <h4>${client.name}</h4>
            <p><strong>Company:</strong> ${client.company}</p>
            <p><strong>Email:</strong> ${client.email}</p>
            <button onclick="editClient('${client.id}')" class="btn" style="width: auto; margin-right: 10px;">Edit Client</button>
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
                <p><strong>Client:</strong> ${client ? client.name : "Unknown"}</p>
                <p><strong>Status:</strong> <span class="status-${req.status.toLowerCase().replace(' ', '-')}">${req.status}</span></p>
                <p><strong>Priority:</strong> ${req.priority}</p>
                <p><strong>Description:</strong> ${req.description}</p>
                <p><strong>Submitted:</strong> ${new Date(req.createdAt).toLocaleDateString()}</p>
                <button onclick="updateRequestStatus('${req.id}')" class="btn" style="width: auto;">Update Status</button>
            </div>
        `;
    }).join("");
}

function setupEventListeners() {
    const addClientForm = document.getElementById("add-client-form");
    if (addClientForm) {
        addClientForm.addEventListener("submit", handleAddClient);
    }
}

function showAddClientModal() {
    document.getElementById("add-client-modal").classList.remove("hidden");
    document.getElementById("add-client-error").classList.add("hidden");
    document.getElementById("add-client-form").reset();
    document.getElementById("client-name").focus();
}

function closeAddClientModal() {
    document.getElementById("add-client-modal").classList.add("hidden");
    document.getElementById("add-client-error").classList.add("hidden");
    document.getElementById("add-client-form").reset();
}

function handleAddClient(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const clientData = {
        id: "client_" + Date.now(),
        name: formData.get("name"),
        email: formData.get("email"),
        company: formData.get("company"),
        username: formData.get("username"),
        password: formData.get("password"),
        role: "client",
        createdAt: new Date().toISOString()
    };
    
    // Validation
    if (!clientData.name || !clientData.email || !clientData.company || !clientData.username || !clientData.password) {
        showAddClientError("All fields are required.");
        return;
    }
    
    // Check if username or email already exists
    const users = JSON.parse(localStorage.getItem("ct_users") || "[]");
    const existingUser = users.find(u => u.username === clientData.username || u.email === clientData.email);
    
    if (existingUser) {
        showAddClientError("Username or email already exists.");
        return;
    }
    
    // Add client
    users.push(clientData);
    localStorage.setItem("ct_users", JSON.stringify(users));
    
    closeAddClientModal();
    loadAdminData();
    alert("Client added successfully!");
}

function showAddClientError(message) {
    const errorDiv = document.getElementById("add-client-error");
    errorDiv.textContent = message;
    errorDiv.classList.remove("hidden");
}

function editClient(clientId) {
    alert("Edit client functionality coming soon!");
}

function updateRequestStatus(requestId) {
    const newStatus = prompt("Enter new status (Pending, In Progress, Completed, Cancelled):");
    
    if (!newStatus) return;
    
    const validStatuses = ["Pending", "In Progress", "Completed", "Cancelled"];
    if (!validStatuses.includes(newStatus)) {
        alert("Invalid status. Please use: Pending, In Progress, Completed, or Cancelled");
        return;
    }
    
    const requests = JSON.parse(localStorage.getItem("ct_requests") || "[]");
    const requestIndex = requests.findIndex(r => r.id === requestId);
    
    if (requestIndex !== -1) {
        requests[requestIndex].status = newStatus;
        requests[requestIndex].updatedAt = new Date().toISOString();
        localStorage.setItem("ct_requests", JSON.stringify(requests));
        loadAdminData();
        alert("Request status updated successfully!");
    }
}

function logout() {
    localStorage.removeItem("ct_currentUser");
    localStorage.removeItem("ct_sessionActive");
    window.location.href = "index.html";
}
