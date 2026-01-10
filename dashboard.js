document.addEventListener('DOMContentLoaded', function () {
    // Check if user is logged in
    fetch('check_auth.php')
        .then(response => response.json())
        .then(data => {
            if (!data.logged_in) {
                window.location.href = 'login.html';
                return;
            }
            // Update welcome message
            const welcomeMsg = document.getElementById('welcomeMsg');
            if (welcomeMsg && data.user) {
                welcomeMsg.textContent = `Welcome to DSA Visualizer, ${data.user.name}!`;
            }
        })
        .catch(error => {
            console.error('Auth check failed:', error);
        });

    // Logout functionality
    document.getElementById('logoutBtn').addEventListener('click', function (e) {
        e.preventDefault();
        fetch('logout.php')
            .then(response => response.json())
            .then(data => {
                if (data.success) window.location.href = 'login.html';
            });
    });

    // Add event listeners to DSA buttons with data-algo attribute
    document.querySelectorAll('.dsa-btn[data-algo]').forEach(button => {
        button.addEventListener('click', function () {
            const algoType = this.getAttribute('data-algo');
            loadAlgorithm(algoType);
        });
    });

    // Special handler for Queue button
    const queueBtn = document.querySelector('.dsa-btn[onclick="loadQueueSelection()"]');
    if (queueBtn) {
        queueBtn.addEventListener('click', function() {
            loadQueueSelection();
        });
    }

    // Load default algorithm (Bubble Sort)
    loadAlgorithm('bubble');
});

// Function to load algorithm
function loadAlgorithm(algoType) {
    // Update active button
    document.querySelectorAll('.dsa-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Find and activate the clicked button
    const activeBtn = document.querySelector(`.dsa-btn[data-algo="${algoType}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }

    // Call algorithm function
    if (typeof showAlgorithm === 'function') {
        showAlgorithm(algoType);
    } else {
        console.error('showAlgorithm function not found!');
        document.getElementById('algorithmContent').innerHTML = `
            <h3>Error Loading Algorithm</h3>
            <p>The algorithms.js file might not be loaded properly.</p>
            <p>Please refresh the page.</p>
        `;
    }
}

// Function to load queue selection
function loadQueueSelection() {
    // Update active button
    document.querySelectorAll('.dsa-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Activate Queue button
    const queueBtn = document.querySelector('.dsa-btn[onclick="loadQueueSelection()"]');
    if (queueBtn) {
        queueBtn.classList.add('active');
    }

    // Call queue selection function
    if (typeof showQueueSelection === 'function') {
        showQueueSelection();
    } else {
        console.error('showQueueSelection function not found!');
        document.getElementById('algorithmContent').innerHTML = `
            <h3>Error Loading Queue Selection</h3>
            <p>Please refresh the page.</p>
        `;
    }
}

// Function to go back to main menu
function goBackToMenu() {
    // Update active button - remove active from all
    document.querySelectorAll('.dsa-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show default view
    document.getElementById('algorithmContent').innerHTML = `
        <h3>Select an Algorithm</h3>
        <p>Choose an algorithm from the buttons above to visualize its working.</p>
        <div class="info-panel">
            <h4>How to use:</h4>
            <p>1. Click any algorithm button</p>
            <p>2. Generate or enter array elements</p>
            <p>3. Use controls to visualize step-by-step</p>
            <p>4. Watch the steps in the output panel</p>
        </div>
    `;
    
    // Remove back button
    removeBackButton();
}

// Function to add back button to header
function addBackButton() {
    const header = document.querySelector('header');
    if (!header) return;
    
    // Check if back button already exists
    if (document.getElementById('backBtn')) return;
    
    // Create back button
    const backBtn = document.createElement('button');
    backBtn.id = 'backBtn';
    backBtn.className = 'back-btn';
    backBtn.innerHTML = '← Back to Menu';
    backBtn.onclick = goBackToMenu;
    
    // Insert back button before logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        header.insertBefore(backBtn, logoutBtn);
    } else {
        header.appendChild(backBtn);
    }
}

// Function to remove back button
function removeBackButton() {
    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
        backBtn.remove();
    }
}

// Function to go back from queue selection
function goBackFromQueueSelection() {
    goBackToMenu();
}