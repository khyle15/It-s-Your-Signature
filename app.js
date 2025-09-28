// Global variables
let currentUser = null;
let currentPortal = null;

const SAMPLE_DATA = {
    sampleUsers: [
        { id: "admin1", username: "admin", password: "admin123", role: "admin", name: "Admin User", email: "admin@example.com" },
        { id: "client1", username: "client001", password: "temp123", role: "client", name: "John Smith", company: "Tech Corp", email: "john@techcorp.com" },
        { id: "client2", username: "client002", password: "temp456", role: "client", name: "Sarah Johnson", company: "Design Studio Inc", email: "sarah@designstudio.com" },
        { id: "client3", username: "client003", password: "temp789", role: "client", name: "Mike Chen", company: "Startup Innovations", email: "mike@startup.com" }
    ],
    sampleRequests: []
};

document.addEventListener("DOMContentLoaded", () => {
    // Initialize sample data if not exists
    if (!localStorage.getItem("ct_users")) {
        localStorage.setItem("ct_users", JSON.stringify(SAMPLE_DATA.sampleUsers));
    }
    
    if (!localStorage.getItem("ct_requests")) {
        localStorage.setItem("ct_requests", JSON.stringify(SAMPLE_DATA.sampleRequests));
    }
    
    // Setup event listeners
    document.getElementById("login-form").addEventListener("submit", handleLogin);
    
    // Add escape key handler for modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const modal = document.getElementById('login-modal');
            if (modal && !modal.classList.contains('hidden')) {
                closeModal();
            }
        }
    });
});

function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    
    if (!username || !password) {
        showLoginError("Please enter both username and password.");
        return;
    }
    
    const users = JSON.parse(localStorage.getItem("ct_users") || "[]");
    const user = users.find(u => u.username === username && u.password === password);
    
    if (!user) {
        showLoginError("Invalid username or password.");
        return;
    }
    
    if (currentPortal !== user.role) {
        showLoginError(`Please use the ${user.role} portal to log in.`);
        return;
    }
    
    // Set session
    localStorage.setItem("ct_currentUser", JSON.stringify(user));
    localStorage.setItem("ct_sessionActive", "true");
    
    // Redirect based on role
    if (user.role === "admin") {
        window.location.href = "admin.html";
    } else {
        window.location.href = "client.html";
    }
}

function showLoginError(message) {
    const errorDiv = document.getElementById("login-error");
    errorDiv.textContent = message;
    errorDiv.classList.remove("hidden");
}

function handlePortalAccess(portal) {
    currentPortal = portal;
    document.getElementById('login-title').textContent = `${portal.charAt(0).toUpperCase() + portal.slice(1)} Login`;
    document.getElementById('login-modal').classList.remove('hidden');
    
    // Clear any previous login errors
    document.getElementById('login-error').classList.add('hidden');
    document.getElementById('login-error').textContent = '';
    
    // Clear form fields
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    
    // Focus on username field
    setTimeout(() => {
        document.getElementById('username').focus();
    }, 100);
}

function closeModal() {
    document.getElementById('login-modal').classList.add('hidden');
    
    // Clear form and errors
    const form = document.getElementById('login-form');
    if (form) {
        form.reset();
    }
    
    const errorDiv = document.getElementById('login-error');
    if (errorDiv) {
        errorDiv.classList.add('hidden');
        errorDiv.textContent = '';
    }
}
