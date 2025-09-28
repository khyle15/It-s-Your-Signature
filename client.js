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
    
    if (myRequests.length === 0) {
        list.innerHTML = "<p>No requests submitted yet. Click 'New Request' to get started.</p>";
        return;
    }
    
    list.innerHTML = myRequests.map(req => `
        <div class="request-card">
            <h4>${req.title}</h4>
            <p><strong>Status:</strong> <span class="status-${req.status.toLowerCase().replace(' ', '-')}">${req.status}</span></p>
            <p><strong>Priority:</strong> ${req.priority}</p>
            <p><strong>Description:</strong> ${req.description}</p>
            <p><strong>Submitted:</strong> ${new Date(req.createdAt).toLocaleDateString()}</p>
            ${req.updatedAt ? `<p><strong>Last Updated:</strong> ${new Date(req.updatedAt).toLocaleDateString()}</p>` : ""}
        </div>
    `).join("");
}

function setupEventListeners() {
    const newRequestForm = document.getElementById("new-request-form");
    if (newRequestForm) {
        newRequestForm.addEventListener("submit", handleNewRequest);
    }
}

function showNewRequestModal() {
    document.getElementById("new-request-modal").classList.remove("hidden");
    document.getElementById("new-request-error").classList.add("hidden");
    document.getElementById("new-request-form").reset();
    document.getElementById("request-title").focus();
}

function closeNewRequestModal() {
    document.getElementById("new-request-modal").classList.add("hidden");
    document.getElementById("new-request-error").classList.add("hidden");
    document.getElementById("new-request-form").reset();
}

function handleNewRequest(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const requestData = {
        id: "req_" + Date.now(),
        clientId: currentUser.id,
        title: formData.get("title"),
        description: formData.get("description"),
        priority: formData.get("priority"),
        status: "Pending",
        createdAt: new Date().toISOString()
    };
    
    // Validation
    if (!requestData.title || !requestData.description || !requestData.priority) {
        showNewRequestError("All fields are required.");
        return;
    }
    
    // Add request to storage
    const requests = JSON.parse(localStorage.getItem("ct_requests") || "[]");
    requests.push(requestData);
    localStorage.setItem("ct_requests", JSON.stringify(requests));
    
    closeNewRequestModal();
    loadClientRequests();
    alert("Request submitted successfully!");
}

function showNewRequestError(message) {
    const errorDiv = document.getElementById("new-request-error");
    errorDiv.textContent = message;
    errorDiv.classList.remove("hidden");
}

function logout() {
    localStorage.removeItem("ct_currentUser");
    localStorage.removeItem("ct_sessionActive");
    window.location.href = "index.html";
}
