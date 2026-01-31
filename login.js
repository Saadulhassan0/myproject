document.addEventListener('DOMContentLoaded', function () {
    console.log("DSA Visualizer: JS Loaded Successfully");

    // Environment Check: Prevent usage with Live Server (Port 5500)
    if (window.location.port === '5500') {
        console.warn("ENVIRONMENT ERROR: VS Code Live Server detected.");
        const warning = document.createElement('div');
        warning.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.9); z-index:10000; color:white; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; padding:20px; font-family:sans-serif;';
        warning.innerHTML = `
            <h1 style="color:#ff4444; font-size:32px; margin-bottom:20px;">⚠️ STOP: WRONG ENVIRONMENT</h1>
            <p style="font-size:18px; margin-bottom:15px;">You are currently using <b>VS Code Live Server</b>, which <u>cannot</u> run PHP code.</p>
            <p style="font-size:20px; color:#aaa; margin-bottom:30px;">To fix your login errors, you MUST use XAMPP:</p>
            <div style="background:#333; padding:15px 30px; border-radius:10px; border:1px solid #555;">
                <p style="margin:5px 0;">1. Open your browser</p>
                <p style="margin:5px 0;">2. Type this address: <b style="color:#6c4ce0; font-size:22px;">http://localhost/myproject/login.html</b></p>
                <p style="margin:5px 0;">3. Press Enter</p>
            </div>
            <p style="margin-top:30px; color:#ff4444;">Please close this tab and use the address above!</p>
        `;
        document.body.appendChild(warning);
        return; // Stop further execution
    }
    // Form elements
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const showRegister = document.getElementById('showRegister');
    const showLogin = document.getElementById('showLogin');

    // Input elements
    const loginEmail = document.getElementById('loginEmail');
    const loginPassword = document.getElementById('loginPassword');
    const regName = document.getElementById('regName');
    const regEmail = document.getElementById('regEmail');
    const regCNIC = document.getElementById('regCNIC');
    const regPhone = document.getElementById('regPhone');
    const regDOB = document.getElementById('regDOB');
    const regPassword = document.getElementById('regPassword');
    const regConfirmPassword = document.getElementById('regConfirmPassword');
    const regProfilePic = document.getElementById('regProfilePic');
    const rememberMe = document.getElementById('rememberMe');
    const regTerms = document.getElementById('regTerms');

    // Load remembered email
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail && loginEmail) {
        loginEmail.value = savedEmail;
        if (rememberMe) rememberMe.checked = true;
    }

    // Error elements
    const loginEmailError = document.getElementById('loginEmailError');
    const loginPasswordError = document.getElementById('loginPasswordError');
    const regNameError = document.getElementById('regNameError');
    const regEmailError = document.getElementById('regEmailError');
    const regCNICError = document.getElementById('regCNICError');
    const regPhoneError = document.getElementById('regPhoneError');
    const regDOBError = document.getElementById('regDOBError');
    const regPasswordError = document.getElementById('regPasswordError');
    const regConfirmPasswordError = document.getElementById('regConfirmPasswordError');
    const regProfilePicError = document.getElementById('regProfilePicError');
    const regTermsError = document.getElementById('regTermsError');

    // ==================== HELPER FUNCTIONS ====================

    // Show error message
    function showError(element, message, type = 'error') {
        if (element) {
            if (message) {
                element.textContent = message;
                element.style.color = '#e53e3e';
                element.style.display = 'block';
                // Add red border to parent container
                const container = element.closest('.field-container')?.querySelector('.input-with-icon');
                if (container) container.classList.add('invalid');
            } else {
                element.textContent = '';
                element.style.display = 'none';
                const container = element.closest('.field-container')?.querySelector('.input-with-icon');
                if (container) container.classList.remove('invalid');
            }
        }
    }

    // Clear all errors
    function clearErrors() {
        document.querySelectorAll('.error').forEach(e => {
            e.textContent = '';
            e.style.display = 'none';
            const container = e.closest('.field-container')?.querySelector('.input-with-icon');
            if (container) container.classList.remove('invalid');
        });
    }

    // Validate email format
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Check if email already exists
    function emailExists(email) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        return users.some(user => user.email === email);
    }

    // Calculate age from date of birth
    function calculateAge(dob) {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

    // Password strength checker
    function checkPasswordStrength(password) {
        let strength = 0;
        let message = '';
        let color = '#d9534f'; // red

        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;

        if (password.length < 6) {
            message = 'Too short (min 6 characters)';
            color = '#d9534f';
        } else if (strength <= 2) {
            message = 'Weak';
            color = '#d9534f';
        } else if (strength === 3) {
            message = 'Medium';
            color = '#f0ad4e';
        } else if (strength === 4) {
            message = 'Strong';
            color = '#5cb85c';
        } else {
            message = 'Very Strong';
            color = '#5cb85c';
        }

        return { message, color };
    }

    // ==================== EVENT LISTENERS ====================

    // Toggle password visibility
    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', function () {
            const targetId = this.getAttribute('data-target');
            const input = document.getElementById(targetId);
            if (input) {
                if (input.type === 'password') {
                    input.type = 'text';
                    this.textContent = '🙈';
                    this.style.color = '#6c4ce0';
                } else {
                    input.type = 'password';
                    this.textContent = '👁️';
                    this.style.color = '#666';
                }
            }
        });
    });

    // Switch between forms
    showRegister.addEventListener('click', function (e) {
        e.preventDefault();
        loginForm.classList.remove('active');
        registerForm.classList.add('active');
        clearErrors();
        clearFormInputs(registerForm);
    });

    showLogin.addEventListener('click', function (e) {
        e.preventDefault();
        registerForm.classList.remove('active');
        loginForm.classList.add('active');
        clearErrors();
        clearFormInputs(loginForm);
    });

    // Clear form inputs
    function clearFormInputs(form) {
        const inputs = form.querySelectorAll('input');
        inputs.forEach(input => {
            if (input.type !== 'submit') {
                input.value = '';
            }
        });
    }

    // ==================== REGISTER FORM VALIDATIONS ====================

    // Name validation - letters and spaces only
    regName.addEventListener('input', function () {
        // Block numbers and symbols - keep only letters and spaces
        this.value = this.value.replace(/[^A-Za-z\s]/g, '');

        const value = this.value.trim();
        if (value.length > 0) {
            if (value.length < 3) {
                showError(regNameError, 'Name must be at least 3 characters');
            } else {
                showError(regNameError, '');
            }
        } else {
            showError(regNameError, 'Please enter your name');
        }
    });

    // Email validation
    regEmail.addEventListener('input', function () {
        const email = this.value.trim();

        if (email.length > 0) {
            if (!validateEmail(email)) {
                showError(regEmailError, 'Please Enter Your Valid Email');
            } else if (emailExists(email)) {
                showError(regEmailError, 'Email Already Registered');
            } else {
                showError(regEmailError, '');
            }
        } else {
            showError(regEmailError, 'Please Enter Your Email');
        }
    });

    regCNIC.addEventListener('input', function () {
        let value = this.value.replace(/\D/g, '').slice(0, 13);

        // Format: 12345-1234567-1
        if (value.length > 5 && value.length <= 12) {
            value = value.slice(0, 5) + '-' + value.slice(5);
        } else if (value.length > 12) {
            value = value.slice(0, 5) + '-' + value.slice(5, 12) + '-' + value.slice(12);
        }

        this.value = value;

        // Validation
        if (value.length > 0) {
            if (/^\d{5}-\d{7}-\d$/.test(value)) {
                showError(regCNICError, '');
            } else {
                showError(regCNICError, 'Format: 12345-1234567-1');
            }
        } else {
            showError(regCNICError, 'Please Enter Your CNIC');
        }
    });

    // Phone validation and formatting
    regPhone.addEventListener('input', function () {
        let value = this.value.replace(/\D/g, '').slice(0, 11);
        if (value.length > 4) {
            value = value.slice(0, 4) + '-' + value.slice(4);
        }
        this.value = value;

        if (value.length > 0) {
            if (!value.startsWith('03')) {
                showError(regPhoneError, 'Phone must start with 03');
            } else if (!/^03\d{2}-\d{7}$/.test(value)) {
                showError(regPhoneError, 'Please enter a valid phone number (03xx-xxxxxxx)');
            } else {
                showError(regPhoneError, '');
            }
        } else {
            showError(regPhoneError, 'Please enter your phone number');
        }
    });

    // Date of Birth validation
    regDOB.addEventListener('change', function () {
        if (this.value) {
            const age = calculateAge(this.value);
            if (age < 13) {
                showError(regDOBError, 'Please Enter Valid Birth Date (Min 13)');
                this.value = '';
            } else {
                showError(regDOBError, '');
            }
        } else {
            showError(regDOBError, 'Please Enter Your Date of Birth');
        }
    });

    // Password strength indicator
    regPassword.addEventListener('input', function () {
        if (this.value.length > 0) {
            if (this.value.length < 6) {
                showError(regPasswordError, 'Please Enter Your Password (Min 6)');
            } else {
                showError(regPasswordError, '');
            }
        } else {
            showError(regPasswordError, 'Please Enter Your Password');
        }
    });

    // Password requirements
    function showPasswordRequirements(password) {
        const requirements = document.getElementById('passwordRequirements');
        if (!requirements) {
            const reqDiv = document.createElement('div');
            reqDiv.id = 'passwordRequirements';
            reqDiv.style.marginTop = '5px';
            reqDiv.style.fontSize = '12px';
            reqDiv.innerHTML = `
                <div>• At least 6 characters <span id="lenReq">❌</span></div>
                <div>• At least one uppercase letter <span id="upperReq">❌</span></div>
                <div>• At least one lowercase letter <span id="lowerReq">❌</span></div>
                <div>• At least one number <span id="numReq">❌</span></div>
            `;
            regPasswordError.parentNode.insertBefore(reqDiv, regPasswordError.nextSibling);
        }

        // Update requirement status
        document.getElementById('lenReq').textContent = password.length >= 6 ? '✓' : '❌';
        document.getElementById('lenReq').style.color = password.length >= 6 ? '#5cb85c' : '#d9534f';

        document.getElementById('upperReq').textContent = /[A-Z]/.test(password) ? '✓' : '❌';
        document.getElementById('upperReq').style.color = /[A-Z]/.test(password) ? '#5cb85c' : '#d9534f';

        document.getElementById('lowerReq').textContent = /[a-z]/.test(password) ? '✓' : '❌';
        document.getElementById('lowerReq').style.color = /[a-z]/.test(password) ? '#5cb85c' : '#d9534f';

        document.getElementById('numReq').textContent = /[0-9]/.test(password) ? '✓' : '❌';
        document.getElementById('numReq').style.color = /[0-9]/.test(password) ? '#5cb85c' : '#d9534f';
    }

    function hidePasswordRequirements() {
        const requirements = document.getElementById('passwordRequirements');
        if (requirements) {
            requirements.remove();
        }
    }

    // Confirm password validation
    regConfirmPassword.addEventListener('input', function () {
        const password = regPassword.value;
        const confirmPassword = this.value;

        if (confirmPassword.length > 0) {
            if (password === confirmPassword) {
                showError(regConfirmPasswordError, '✓ Passwords match', 'success');
            } else {
                showError(regConfirmPasswordError, 'Passwords do not match', 'error');
            }
        } else {
            showError(regConfirmPasswordError, '');
        }
    });

    // ==================== LOGIN FORM VALIDATIONS ====================

    // Login email validation
    loginEmail.addEventListener('input', function () {
        const email = this.value.trim();
        if (email.length > 0) {
            if (!validateEmail(email)) {
                showError(loginEmailError, 'Please Enter Your Valid Email');
            } else {
                showError(loginEmailError, '');
            }
        } else {
            showError(loginEmailError, 'Please Enter Your Email');
        }
    });

    // Login password validation
    loginPassword.addEventListener('input', function () {
        if (this.value.length > 0) {
            if (this.value.length < 6) {
                showError(loginPasswordError, 'Please Enter Your Password (Min 6)');
            } else {
                showError(loginPasswordError, '');
            }
        } else {
            showError(loginPasswordError, 'Please Enter Your Password');
        }
    });

    // ==================== FORM SUBMISSIONS ====================

    // Register form submission
    registerForm.addEventListener('submit', function (e) {
        e.preventDefault();
        clearErrors();

        let isValid = true;

        // Sweep all fields
        const fields = [
            { id: 'regName', errorId: 'regNameError', msg: 'Please Enter Your Name' },
            { id: 'regEmail', errorId: 'regEmailError', msg: 'Please Enter Your Email' },
            { id: 'regCNIC', errorId: 'regCNICError', msg: 'Please Enter Your CNIC' },
            { id: 'regPhone', errorId: 'regPhoneError', msg: 'Please Enter Your Phone' },
            { id: 'regDOB', errorId: 'regDOBError', msg: 'Please Enter Your Date of Birth' },
            { id: 'regPassword', errorId: 'regPasswordError', msg: 'Please Enter Your Password' },
            { id: 'regConfirmPassword', errorId: 'regConfirmPasswordError', msg: 'Please Confirm Your Password' },
            { id: 'regProfilePic', errorId: 'regProfilePicError', msg: 'Please upload a profile picture' },
            { id: 'regTerms', errorId: 'regTermsError', msg: 'You must agree to the terms to register' }
        ];

        fields.forEach(field => {
            const input = document.getElementById(field.id);
            const errorElement = document.getElementById(field.errorId);
            const value = input.value.trim();

            if (!value) {
                showError(errorElement, field.msg);
                isValid = false;
            } else {
                // Additional format checks if already filled
                if (field.id === 'regName' && !/^[A-Za-z\s]+$/.test(value)) {
                    showError(errorElement, 'Name can only contain letters and spaces');
                    isValid = false;
                } else if (field.id === 'regName' && value.length < 3) {
                    showError(errorElement, 'Name must be at least 3 characters');
                    isValid = false;
                } else if (field.id === 'regEmail' && !validateEmail(value)) {
                    showError(errorElement, 'Please enter a valid email address');
                    isValid = false;
                } else if (field.id === 'regCNIC' && !/^\d{5}-\d{7}-\d$/.test(value)) {
                    showError(errorElement, 'Please enter a valid CNIC');
                    isValid = false;
                } else if (field.id === 'regPhone') {
                    if (!value.startsWith('03')) {
                        showError(errorElement, 'Phone must start with 03');
                        isValid = false;
                    } else if (!/^03\d{2}-\d{7}$/.test(value)) {
                        showError(errorElement, 'Please enter a valid phone number (03xx-xxxxxxx)');
                        isValid = false;
                    }
                } else if (field.id === 'regPassword' && value.length < 6) {
                    showError(errorElement, 'Password must be at least 6 characters');
                    isValid = false;
                } else if (field.id === 'regConfirmPassword' && value !== regPassword.value) {
                    showError(errorElement, 'Passwords do not match');
                    isValid = false;
                } else if (field.id === 'regTerms' && !regTerms.checked) {
                    showError(errorElement, 'You must agree to the terms');
                    isValid = false;
                }
            }
        });

        if (!isValid) return;

        // All validations passed - send to server
        const formData = new FormData();
        formData.append('name', regName.value.trim());
        formData.append('email', regEmail.value.trim());
        formData.append('cnic', regCNIC.value);
        formData.append('phone', regPhone.value);
        formData.append('dob', regDOB.value);
        formData.append('password', regPassword.value);

        if (regProfilePic.files[0]) {
            formData.append('profile_pic', regProfilePic.files[0]);
        }

        console.log("Registration: Sending data to server...");
        fetch('register.php', {
            method: 'POST',
            body: formData
        })
            .then(response => response.text())
            .then(text => {
                let data;
                try {
                    data = JSON.parse(text);
                } catch (e) {
                    alert("SERVER ERROR:\n" + text.substring(0, 500));
                    throw new Error("Invalid JSON from server");
                }

                if (data.success) {
                    showSuccessMessage('Registration successful! Please login.');
                    setTimeout(() => { showLogin.click(); }, 2000);
                } else {
                    if (data.errors) {
                        if (data.errors.email) showError(regEmailError, data.errors.email);
                        if (data.errors.cnic) showError(regCNICError, data.errors.cnic);
                        if (data.errors.phone) showError(regPhoneError, data.errors.phone);
                    } else {
                        alert(data.message || "Registration failed");
                    }
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert("Network Error: " + error.message);
            });
    });

    // Login form submission
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        let isValid = true;

        if (!loginEmail.value.trim()) {
            showError(loginEmailError, 'Please Enter Your Email');
            isValid = false;
        } else if (!validateEmail(loginEmail.value.trim())) {
            showError(loginEmailError, 'Please Enter Your Valid Email');
            isValid = false;
        }

        if (!loginPassword.value) {
            showError(loginPasswordError, 'Please Enter Your Password');
            isValid = false;
        }

        if (!isValid) return;

        // Check credentials on server
        fetch('login_handler.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: loginEmail.value.trim(),
                password: loginPassword.value
            })
        })
            .then(response => response.text())
            .then(text => {
                let data;
                try {
                    data = JSON.parse(text);
                } catch (e) {
                    console.error("Server output:", text);
                    alert("SERVER ERROR:\n" + text.substring(0, 500));
                    throw new Error("Invalid JSON from server");
                }

                if (data.success) {
                    // Remember Me Logic
                    if (rememberMe && rememberMe.checked) {
                        localStorage.setItem('rememberedEmail', loginEmail.value.trim());
                    } else {
                        localStorage.removeItem('rememberedEmail');
                    }

                    showSuccessMessage('Login successful! Redirecting...');
                    setTimeout(() => { window.location.href = 'dashboard.html'; }, 1500);
                } else {
                    // Show specific error from server
                    showError(loginPasswordError, data.message || "Login failed");
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Connection failed!\n\nREASON: You must access the project via http://localhost/ and NOT directly through VS Code Live Server.\n\nMake sure XAMPP is running.');
            });
    });

    // Success and Error Helpers
    function showSuccessMessage(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.style.backgroundColor = '#d4edda';
        successDiv.style.color = '#155724';
        successDiv.style.padding = '15px';
        successDiv.style.borderRadius = '8px';
        successDiv.style.marginTop = '20px';
        successDiv.style.border = '1px solid #c3e6cb';
        successDiv.style.textAlign = 'center';
        successDiv.style.fontWeight = 'bold';
        successDiv.textContent = message;

        const existingMsg = document.querySelector('.success-message');
        if (existingMsg) existingMsg.remove();

        const form = document.querySelector('.form.active');
        form.appendChild(successDiv);
    }

    // Clear specific error on input is now handled within each specific validation listener
    // or through the general validation sweep on submit.
});