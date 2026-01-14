document.addEventListener('DOMContentLoaded', function () {
    // Check if user is logged in
    fetch('http://localhost/myproject/check_auth.php')
        .then(response => response.json())
        .then(data => {
            if (!data.logged_in) {
                window.location.href = 'login.html';
                return;
            }
            // Update welcome message and profile pic
            if (data.user) {
                const welcomeMsg = document.getElementById('welcomeMsg');
                if (welcomeMsg) {
                    welcomeMsg.textContent = `Welcome to DSA Visualizer, ${data.user.name}!`;
                }

                const globalPic = document.getElementById('globalProfilePic');
                if (globalPic && data.user.profile_pic) {
                    const picPath = data.user.profile_pic === 'default.png' ? 'https://via.placeholder.com/40' : 'uploads/' + data.user.profile_pic;
                    globalPic.src = picPath;
                }
            }
        })
        .catch(error => {
            console.error('Auth check failed:', error);
        });

    // Logout functionality
    const logoutHandler = function (e) {
        if (e) e.preventDefault();
        fetch('http://localhost/myproject/logout.php')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    window.location.href = 'http://localhost/myproject/login.html';
                } else {
                    alert('Logout failed: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Logout error:', error);
                // Fallback redirect if server is unreachable
                window.location.href = 'http://localhost/myproject/login.html';
            });
    };

    document.getElementById('logoutBtn').addEventListener('click', logoutHandler);

    const sidebarLogout = document.getElementById('sidebarLogout');
    if (sidebarLogout) {
        sidebarLogout.addEventListener('click', logoutHandler);
    }

    // Search functionality
    const searchInput = document.getElementById('algoSearch');
    const clearBtn = document.getElementById('clearSearch');
    const buttons = document.querySelectorAll('.dsa-btn');

    if (searchInput) {
        searchInput.addEventListener('input', function () {
            const query = this.value.toLowerCase().trim();

            // Show/hide clear icon
            if (clearBtn) {
                clearBtn.style.display = query.length > 0 ? 'block' : 'none';
            }

            buttons.forEach(btn => {
                const text = btn.textContent.toLowerCase();
                if (text.includes(query)) {
                    btn.style.display = 'block';
                } else {
                    btn.style.display = 'none';
                }
            });
        });
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', function () {
            searchInput.value = '';
            clearBtn.style.display = 'none';
            buttons.forEach(btn => btn.style.display = 'block');
            searchInput.focus();
        });
    }

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
        queueBtn.addEventListener('click', function () {
            loadQueueSelection();
        });
    }
});

// Function to load algorithm
function loadAlgorithm(algoType) {
    // Hide home view and show visualization view
    document.getElementById('homeView').style.display = 'none';
    document.getElementById('visualizationView').style.display = 'block';

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
    // Hide home view and show visualization view
    document.getElementById('homeView').style.display = 'none';
    document.getElementById('visualizationView').style.display = 'block';

    // Update active button
    document.querySelectorAll('.dsa-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Activate Queue button
    const queueBtn = document.querySelector('.dsa-btn[data-algo="queue"]') ||
        Array.from(document.querySelectorAll('.dsa-btn')).find(b => b.textContent.includes('Queue'));
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
    // Show home view and hide visualization view
    document.getElementById('homeView').style.display = 'block';
    document.getElementById('visualizationView').style.display = 'none';

    // Update active button - remove active from all
    document.querySelectorAll('.dsa-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show default view
    document.getElementById('algorithmContent').innerHTML = '';

    // Remove back button
    removeBackButton();
}

// Function to add back button to header
// Function to add back button
function addBackButton(customHandler = null) {
    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
        backBtn.style.display = 'flex';
        if (customHandler) {
            backBtn.onclick = customHandler;
        } else {
            backBtn.onclick = goBackToMenu;
        }
    }
}

// Function to remove back button
function removeBackButton() {
    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
        backBtn.style.display = 'none';
    }
}

// Function to go back from queue selection
function goBackFromQueueSelection() {
    goBackToMenu();
}