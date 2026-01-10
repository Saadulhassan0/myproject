document.addEventListener('DOMContentLoaded', function () {
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

    // ==================== HELPER FUNCTIONS ====================

    // Show colored error message
    function showError(element, message, type = 'error') {
        if (element) {
            element.textContent = message;
            element.style.color = type === 'error' ? '#d9534f' :
                type === 'success' ? '#5cb85c' :
                    type === 'warning' ? '#f0ad4e' : '#0275d8';
            element.style.fontWeight = '500';
            element.style.marginTop = '5px';
            element.style.display = 'block';
        }
    }

    // Clear all errors
    function clearErrors() {
        document.querySelectorAll('.error').forEach(e => {
            e.textContent = '';
            e.style.color = '';
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
        this.value = this.value.replace(/[^a-zA-Z\s]/g, '');

        if (this.value.trim().length > 0) {
            if (this.value.trim().length < 3) {
                showError(regNameError, 'Name must be at least 3 characters', 'error');
            } else {
                showError(regNameError, '✓ Valid name', 'success');
            }
        } else {
            showError(regNameError, '');
        }
    });

    // Email validation
    regEmail.addEventListener('input', function () {
        const email = this.value.trim();

        if (email.length > 0) {
            if (!validateEmail(email)) {
                showError(regEmailError, 'Invalid email format', 'error');
            } else if (emailExists(email)) {
                showError(regEmailError, 'Email already registered', 'error');
            } else {
                showError(regEmailError, '✓ Valid email', 'success');
            }
        } else {
            showError(regEmailError, '');
        }
    });

    // CNIC validation and formatting
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
                showError(regCNICError, '✓ Valid CNIC format', 'success');
            } else {
                showError(regCNICError, 'Format: 12345-1234567-1', 'error');
            }
        } else {
            showError(regCNICError, '');
        }
    });

    // Phone validation and formatting
    regPhone.addEventListener('input', function () {
        let value = this.value.replace(/\D/g, '').slice(0, 11);

        // Format: 03xx-xxxxxxx
        if (value.length > 4) {
            value = value.slice(0, 4) + '-' + value.slice(4);
        }

        this.value = value;

        // Validation
        if (value.length > 0) {
            if (/^03\d{2}-\d{7}$/.test(value)) {
                showError(regPhoneError, '✓ Valid phone format', 'success');
            } else {
                showError(regPhoneError, 'Format: 03xx-xxxxxxx', 'error');
            }
        } else {
            showError(regPhoneError, '');
        }
    });

    // Date of Birth validation
    regDOB.addEventListener('change', function () {
        if (this.value) {
            const age = calculateAge(this.value);

            if (age < 13) {
                showError(regDOBError, 'Must be at least 13 years old', 'error');
                this.value = '';
            } else if (age > 120) {
                showError(regDOBError, 'Please enter a valid date', 'error');
                this.value = '';
            } else {
                showError(regDOBError, `✓ Age: ${age} years`, 'success');
            }
        } else {
            showError(regDOBError, '');
        }
    });

    // Password strength indicator
    regPassword.addEventListener('input', function () {
        const password = this.value;

        if (password.length > 0) {
            const strength = checkPasswordStrength(password);
            showError(regPasswordError, strength.message, strength.message.includes('Weak') || strength.message.includes('short') ? 'error' :
                strength.message.includes('Medium') ? 'warning' : 'success');

            // Show/hide requirements
            showPasswordRequirements(password);
        } else {
            showError(regPasswordError, '');
            hidePasswordRequirements();
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
                showError(loginEmailError, 'Invalid email format', 'error');
            } else {
                showError(loginEmailError, '✓ Valid email format', 'success');
            }
        } else {
            showError(loginEmailError, '');
        }
    });

    // Login password validation
    loginPassword.addEventListener('input', function () {
        const password = this.value;

        if (password.length > 0) {
            if (password.length < 6) {
                showError(loginPasswordError, 'Password must be at least 6 characters', 'error');
            } else {
                showError(loginPasswordError, '✓ Password format OK', 'success');
            }
        } else {
            showError(loginPasswordError, '');
        }
    });

    // ==================== FORM SUBMISSIONS ====================

    // Register form submission
    registerForm.addEventListener('submit', function (e) {
        e.preventDefault();
        clearErrors();

        let isValid = true;
        const errors = [];

        // Name validation
        if (regName.value.trim().length < 3) {
            showError(regNameError, 'Name must be at least 3 characters', 'error');
            isValid = false;
            errors.push('Name is too short');
        }

        // Email validation
        if (!validateEmail(regEmail.value)) {
            showError(regEmailError, 'Please enter a valid email', 'error');
            isValid = false;
            errors.push('Invalid email format');
        } else if (emailExists(regEmail.value)) {
            showError(regEmailError, 'Email already registered', 'error');
            isValid = false;
            errors.push('Email already exists');
        }

        // CNIC validation
        if (!/^\d{5}-\d{7}-\d$/.test(regCNIC.value)) {
            showError(regCNICError, 'Format: 12345-1234567-1', 'error');
            isValid = false;
            errors.push('Invalid CNIC format');
        }

        // Phone validation
        if (!/^03\d{2}-\d{7}$/.test(regPhone.value)) {
            showError(regPhoneError, 'Format: 03xx-xxxxxxx', 'error');
            isValid = false;
            errors.push('Invalid phone format');
        }

        // DOB validation
        if (!regDOB.value) {
            showError(regDOBError, 'Date of birth is required', 'error');
            isValid = false;
            errors.push('Date of birth required');
        } else if (calculateAge(regDOB.value) < 13) {
            showError(regDOBError, 'Must be at least 13 years old', 'error');
            isValid = false;
            errors.push('Age must be at least 13');
        }

        // Password validation
        if (regPassword.value.length < 6) {
            showError(regPasswordError, 'Password must be at least 6 characters', 'error');
            isValid = false;
            errors.push('Password too short');
        }

        // Confirm password
        if (regPassword.value !== regConfirmPassword.value) {
            showError(regConfirmPasswordError, 'Passwords do not match', 'error');
            isValid = false;
            errors.push('Passwords do not match');
        }

        if (!isValid) {
            // Show error summary
            showErrorSummary(errors);
            return;
        }

        // All validations passed - send to server
        const userData = {
            name: regName.value.trim(),
            email: regEmail.value.trim(),
            cnic: regCNIC.value,
            phone: regPhone.value,
            dob: regDOB.value,
            password: regPassword.value
        };

        fetch('http://localhost/myproject/register.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
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
                        showErrorSummary(Object.values(data.errors));
                    } else {
                        showErrorSummary([data.message]);
                    }
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert("NETWORK/FETCH ERROR:\n" + error.message);
                showErrorSummary(['Network Error: ' + error.message]);
            });
    });

    // Login form submission
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        clearErrors();

        let isValid = true;
        const errors = [];

        // Email validation
        if (!loginEmail.value.trim()) {
            showError(loginEmailError, 'Email is required', 'error');
            isValid = false;
            errors.push('Email required');
        } else if (!validateEmail(loginEmail.value)) {
            showError(loginEmailError, 'Invalid email format', 'error');
            isValid = false;
            errors.push('Invalid email');
        }

        // Password validation
        if (!loginPassword.value) {
            showError(loginPasswordError, 'Password is required', 'error');
            isValid = false;
            errors.push('Password required');
        } else if (loginPassword.value.length < 6) {
            showError(loginPasswordError, 'Password must be at least 6 characters', 'error');
            isValid = false;
            errors.push('Password too short');
        }

        if (!isValid) {
            showErrorSummary(errors);
            return;
        }

        // Check credentials on server
        fetch('http://localhost/myproject/login_handler.php', {
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
                    alert("SERVER ERROR:\n" + text.substring(0, 500));
                    throw new Error("Invalid JSON from server");
                }

                if (data.success) {
                    showSuccessMessage('Login successful! Redirecting...');
                    setTimeout(() => { window.location.href = 'dashboard.html'; }, 1500);
                } else {
                    showError(loginPasswordError, data.message, 'error');
                    errors.push(data.message);
                    showErrorSummary([data.message]);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showErrorSummary(['Connection failed. Make sure XAMPP is running.']);
            });
    });

    // Show error summary
    function showErrorSummary(errors) {
        const summary = document.createElement('div');
        summary.className = 'error-summary';
        summary.style.backgroundColor = '#f8d7da';
        summary.style.color = '#721c24';
        summary.style.padding = '15px';
        summary.style.borderRadius = '8px';
        summary.style.marginTop = '20px';
        summary.style.border = '1px solid #f5c6cb';

        summary.innerHTML = `
            <strong>Please fix the following errors:</strong>
            <ul style="margin: 10px 0 0 20px; padding: 0;">
                ${errors.map(error => `<li>${error}</li>`).join('')}
            </ul>
        `;

        // Remove existing summary if any
        const existingSummary = document.querySelector('.error-summary');
        if (existingSummary) {
            existingSummary.remove();
        }

        // Add to form
        const form = document.querySelector('.form.active');
        form.appendChild(summary);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (summary.parentNode) {
                summary.remove();
            }
        }, 5000);
    }

    // Show success message
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

        // Remove existing messages
        const existingMsg = document.querySelector('.success-message, .error-summary');
        if (existingMsg) {
            existingMsg.remove();
        }

        // Add to form
        const form = document.querySelector('.form.active');
        form.appendChild(successDiv);
    }
    // ==================== EMPTY INPUT VALIDATION ====================
    // Add this at the end of your existing login.js file, before the last });

    // Function to validate empty inputs
    function validateEmptyInputs() {
        let hasEmptyFields = false;

        // Get the active form
        const activeForm = document.querySelector('.form.active');
        if (!activeForm) return false;

        // Check all required inputs in active form
        const inputs = activeForm.querySelectorAll('input[required]');

        inputs.forEach(input => {
            const errorElement = document.getElementById(input.id + 'Error');
            if (errorElement) {
                if (!input.value.trim()) {
                    // Show red error for empty field
                    errorElement.textContent = 'This field is required';
                    errorElement.style.color = '#d9534f';
                    input.style.borderColor = '#d9534f';
                    input.style.backgroundColor = '#fff8f8';
                    hasEmptyFields = true;
                } else {
                    // Clear error if field is filled
                    if (errorElement.textContent === 'This field is required') {
                        errorElement.textContent = '';
                        input.style.borderColor = '';
                        input.style.backgroundColor = '';
                    }
                }
            }
        });

        return hasEmptyFields;
    }

    // Add input event listeners to clear red borders when user starts typing
    document.querySelectorAll('input[required]').forEach(input => {
        input.addEventListener('input', function () {
            if (this.value.trim()) {
                this.style.borderColor = '';
                this.style.backgroundColor = '';
                const errorElement = document.getElementById(this.id + 'Error');
                if (errorElement && errorElement.textContent === 'This field is required') {
                    errorElement.textContent = '';
                }
            }
        });

        // Also add focus event to highlight current field
        input.addEventListener('focus', function () {
            this.style.boxShadow = '0 0 0 3px rgba(108, 76, 224, 0.1)';
        });

        input.addEventListener('blur', function () {
            this.style.boxShadow = '';
        });
    });

    // Modify form submission to check for empty fields
    const originalLoginSubmit = loginForm.onsubmit;
    const originalRegisterSubmit = registerForm.onsubmit;

    loginForm.onsubmit = function (e) {
        // Check for empty fields first
        if (validateEmptyInputs()) {
            e.preventDefault();

            // Show error summary
            const summary = document.createElement('div');
            summary.className = 'error-summary';
            summary.style.backgroundColor = '#f8d7da';
            summary.style.color = '#721c24';
            summary.style.padding = '15px';
            summary.style.borderRadius = '8px';
            summary.style.marginTop = '20px';
            summary.style.border = '1px solid #f5c6cb';
            summary.innerHTML = '<strong>⚠️ Please fill all required fields marked in red</strong>';

            // Remove existing summary
            const existing = document.querySelector('.error-summary');
            if (existing) existing.remove();

            loginForm.appendChild(summary);

            // Auto remove after 3 seconds
            setTimeout(() => {
                if (summary.parentNode) summary.remove();
            }, 3000);

            return false;
        }

        // Continue with original validation
        if (originalLoginSubmit) return originalLoginSubmit.call(this, e);
    };

    registerForm.onsubmit = function (e) {
        // Check for empty fields first
        if (validateEmptyInputs()) {
            e.preventDefault();

            // Show error summary
            const summary = document.createElement('div');
            summary.className = 'error-summary';
            summary.style.backgroundColor = '#f8d7da';
            summary.style.color = '#721c24';
            summary.style.padding = '15px';
            summary.style.borderRadius = '8px';
            summary.style.marginTop = '20px';
            summary.style.border = '1px solid #f5c6cb';
            summary.innerHTML = '<strong>⚠️ Please fill all required fields marked in red</strong>';

            // Remove existing summary
            const existing = document.querySelector('.error-summary');
            if (existing) existing.remove();

            registerForm.appendChild(summary);

            // Auto remove after 3 seconds
            setTimeout(() => {
                if (summary.parentNode) summary.remove();
            }, 3000);

            return false;
        }

        // Continue with original validation
        if (originalRegisterSubmit) return originalRegisterSubmit.call(this, e);
    };

    // Add visual indicator for required fields
    document.querySelectorAll('input[required]').forEach(input => {
        const label = document.createElement('span');
        label.textContent = ' *';
        label.style.color = '#d9534f';
        label.style.fontWeight = 'bold';

        // Insert after the input
        input.parentNode.insertBefore(label, input.nextSibling);
    });

    // Add placeholder styling for empty fields
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('blur', function () {
            if (!this.value.trim() && this.hasAttribute('required')) {
                this.style.borderColor = '#d9534f';
                this.style.backgroundColor = '#fff8f8';
            }
        });
    });

    // Add this CSS dynamically for better empty field indication
    const style = document.createElement('style');
    style.textContent = `
    input:invalid:not(:focus):not(:placeholder-shown) {
        border-color: #d9534f !important;
        background-color: #fff8f8 !important;
    }
    
    .required-star {
        color: #d9534f;
        font-weight: bold;
        margin-left: 2px;
    }
    
    .empty-field {
        animation: shake 0.3s ease-in-out;
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;
    document.head.appendChild(style);

    // Function to highlight empty fields with animation
    function highlightEmptyFields() {
        document.querySelectorAll('input[required]').forEach(input => {
            if (!input.value.trim()) {
                input.classList.add('empty-field');
                setTimeout(() => {
                    input.classList.remove('empty-field');
                }, 300);
            }
        });
    }

    // Call highlight function on form submit
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function (e) {
            highlightEmptyFields();
        });
    });

    // ==================== ENHANCED EMPTY FIELD DETECTION ====================

    // Real-time empty field detection
    document.querySelectorAll('input[required]').forEach(input => {
        // Check on page load
        if (!input.value.trim()) {
            input.style.borderColor = '#ddd'; // Light gray border for empty
        }

        // Check on input change
        input.addEventListener('input', function () {
            if (!this.value.trim()) {
                this.style.borderColor = '#d9534f';
                this.style.backgroundColor = '#fff8f8';
            } else {
                this.style.borderColor = '';
                this.style.backgroundColor = '';
            }
        });

        // Check on blur
        input.addEventListener('blur', function () {
            if (!this.value.trim()) {
                const errorElement = document.getElementById(this.id + 'Error');
                if (errorElement) {
                    errorElement.textContent = 'This field is required';
                    errorElement.style.color = '#d9534f';
                }
                this.style.borderColor = '#d9534f';
                this.style.backgroundColor = '#fff8f8';
            }
        });

        // Clear on focus
        input.addEventListener('focus', function () {
            const errorElement = document.getElementById(this.id + 'Error');
            if (errorElement && errorElement.textContent === 'This field is required') {
                errorElement.textContent = '';
            }
            this.style.borderColor = '#6c4ce0';
            this.style.backgroundColor = '';
        });
    });

    // Add a message at the bottom of forms about required fields
    function addRequiredFieldMessage() {
        const forms = document.querySelectorAll('.form');
        forms.forEach(form => {
            // Check if message already exists
            if (!form.querySelector('.required-message')) {
                const message = document.createElement('p');
                message.className = 'required-message';
                message.style.fontSize = '12px';
                message.style.color = '#666';
                message.style.marginTop = '10px';
                message.style.textAlign = 'center';
                message.innerHTML = '<span style="color:#d9534f">*</span> indicates required field';
                form.appendChild(message);
            }
        });
    }

    // Call when forms are switched
    showRegister.addEventListener('click', function (e) {
        setTimeout(addRequiredFieldMessage, 100);
    });

    showLogin.addEventListener('click', function (e) {
        setTimeout(addRequiredFieldMessage, 100);
    });

    // Initial call
    addRequiredFieldMessage();

    // ==================== ENHANCED SUBMIT BUTTON ====================

    // Disable submit button when form has empty required fields
    function updateSubmitButton() {
        const activeForm = document.querySelector('.form.active');
        if (!activeForm) return;

        const submitButton = activeForm.querySelector('button[type="submit"]');
        if (!submitButton) return;

        const inputs = activeForm.querySelectorAll('input[required]');
        let hasEmptyFields = false;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                hasEmptyFields = true;
            }
        });

        if (hasEmptyFields) {
            submitButton.disabled = true;
            submitButton.style.opacity = '0.6';
            submitButton.style.cursor = 'not-allowed';
            submitButton.title = 'Please fill all required fields';
        } else {
            submitButton.disabled = false;
            submitButton.style.opacity = '1';
            submitButton.style.cursor = 'pointer';
            submitButton.title = '';
        }
    }

    // Check on every input
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', updateSubmitButton);
    });

    // Initial check
    updateSubmitButton();

    // Update when switching forms
    showRegister.addEventListener('click', function () {
        setTimeout(updateSubmitButton, 100);
    });

    showLogin.addEventListener('click', function () {
        setTimeout(updateSubmitButton, 100);
    });

    // Add this CSS for better button feedback
    const buttonStyle = document.createElement('style');
    buttonStyle.textContent = `
    button[type="submit"]:disabled {
        background: linear-gradient(90deg, #cccccc, #999999) !important;
        transform: none !important;
        box-shadow: none !important;
    }
    
    button[type="submit"]:disabled:hover {
        transform: none !important;
        box-shadow: none !important;
    }
`;
    document.head.appendChild(buttonStyle);
});