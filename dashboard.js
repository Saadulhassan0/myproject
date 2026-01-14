document.addEventListener('DOMContentLoaded', function () {
    // Check if user is logged in
    fetch('check_auth.php')
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
        fetch('logout.php')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    window.location.href = 'login.html';
                } else {
                    alert('Logout failed: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Logout error:', error);
                // Fallback redirect if server is unreachable
                window.location.href = 'login.html';
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
    const homeView = document.getElementById('homeView');
    const vizView = document.getElementById('visualizationView');

    // Smooth transition
    homeView.style.opacity = '0';
    setTimeout(() => {
        homeView.style.display = 'none';
        vizView.style.display = 'block';
        vizView.style.opacity = '0';
        setTimeout(() => {
            vizView.style.opacity = '1';
        }, 50);

        // Update active button
        document.querySelectorAll('.dsa-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        const activeBtn = document.querySelector(`.dsa-btn[data-algo="${algoType}"]`);
        if (activeBtn) activeBtn.classList.add('active');

        if (typeof showAlgorithm === 'function') {
            showAlgorithm(algoType);
        }
    }, 200);
}

// Function to update active sidebar link
function updateActiveNavLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.sidebar nav ul li a');
    navLinks.forEach(link => {
        if (currentPath.includes(link.getAttribute('href'))) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}
updateActiveNavLink();

// Function to load queue selection
function loadQueueSelection() {
    const homeView = document.getElementById('homeView');
    const vizView = document.getElementById('visualizationView');

    homeView.style.opacity = '0';
    setTimeout(() => {
        homeView.style.display = 'none';
        vizView.style.display = 'block';
        vizView.style.opacity = '0';
        setTimeout(() => {
            vizView.style.opacity = '1';
        }, 50);

        if (typeof showQueueSelection === 'function') {
            showQueueSelection();
        }
    }, 200);
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