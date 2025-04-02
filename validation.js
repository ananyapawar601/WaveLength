// Wait for the DOM to be fully loaded before executing JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Get references to form elements
    const form = document.querySelector('form'); // The entire form
    const firstName = document.getElementById('first-name'); // First name input
    const lastName = document.getElementById('last-name'); // Last name input
    const email = document.getElementById('email'); // Email input
    const password = document.getElementById('password'); // Password input
    const confirmPassword = document.getElementById('confirm-password'); // Confirm password input

    // Regular expression pattern for validating email addresses
    // Matches standard email formats like user@domain.com
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    /**
     * Validates the entire form on submission
     * @param {Event} event - The form submission event
     */
    function validateForm(event) {
        let isValid = true; // Flag to track overall form validity

        // Clear any previous errors before new validation
        resetErrors();

        // Validate First Name - must not be empty
        if (firstName.value.trim() === '') {
            showError(firstName, 'First name is required');
            isValid = false;
        }

        // Validate Last Name - must not be empty
        if (lastName.value.trim() === '') {
            showError(lastName, 'Last name is required');
            isValid = false;
        }

        // Validate Email - must not be empty and must match email pattern
        if (email.value.trim() === '') {
            showError(email, 'Email is required');
            isValid = false;
        } else if (!emailRegex.test(email.value)) {
            showError(email, 'Please enter a valid email address');
            isValid = false;
        }

        // Validate Password - must not be empty and at least 8 characters
        if (password.value.trim() === '') {
            showError(password, 'Password is required');
            isValid = false;
        } else if (password.value.length < 8) {
            showError(password, 'Password must be at least 8 characters');
            isValid = false;
        }

        // Validate Confirm Password - must not be empty and match password
        if (confirmPassword.value.trim() === '') {
            showError(confirmPassword, 'Please confirm your password');
            isValid = false;
        } else if (password.value !== confirmPassword.value) {
            showError(confirmPassword, 'Passwords do not match');
            isValid = false;
        }

        // If any validation failed, prevent form submission
        if (!isValid) {
            event.preventDefault();
        }
    }

    /**
     * Displays an error message for a specific form field
     * @param {HTMLElement} field - The input field with error
     * @param {string} message - The error message to display
     */
    function showError(field, message) {
        // Highlight the field with red border
        field.style.border = '2px solid red';
        
        // Create error message element
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message'; // For styling and identification
        errorElement.style.color = 'red'; // Red text
        errorElement.style.fontSize = '0.8rem'; // Smaller font
        errorElement.style.marginTop = '5px'; // Spacing from field
        errorElement.textContent = message; // Set the error text
        
        // Insert error message after the field
        field.parentNode.insertBefore(errorElement, field.nextSibling);
    }

    /** Clears all error messages and resets field styles */
    function resetErrors() {
        // Remove all existing error messages
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(msg => msg.remove());

        // Reset borders for all input fields
        const inputs = [firstName, lastName, email, password, confirmPassword];
        inputs.forEach(input => {
            input.style.border = '1px solid #ccc'; // Default border
        });
    }

    // Add blur event listeners for real-time field validation
    firstName.addEventListener('blur', validateField);
    lastName.addEventListener('blur', validateField);
    email.addEventListener('blur', validateField);
    password.addEventListener('blur', validateField);
    confirmPassword.addEventListener('blur', validateField);

    /**
     * Validates an individual field when it loses focus (on blur)
     * Uses 'this' to reference the field that triggered the event
     */
    function validateField() {
        // Clear previous errors before validating
        resetErrors();
        
        // Validate based on which field triggered the event
        if (this === firstName && firstName.value.trim() === '') {
            showError(firstName, 'First name is required');
        }
        
        if (this === lastName && lastName.value.trim() === '') {
            showError(lastName, 'Last name is required');
        }
        
        if (this === email) {
            if (email.value.trim() === '') {
                showError(email, 'Email is required');
            } else if (!emailRegex.test(email.value)) {
                showError(email, 'Please enter a valid email address');
            }
        }
        
        if (this === password) {
            if (password.value.trim() === '') {
                showError(password, 'Password is required');
            } else if (password.value.length < 8) {
                showError(password, 'Password must be at least 8 characters');
            }
        }
        
        if (this === confirmPassword) {
            if (confirmPassword.value.trim() === '') {
                showError(confirmPassword, 'Please confirm your password');
            } else if (password.value !== confirmPassword.value) {
                showError(confirmPassword, 'Passwords do not match');
            }
        }
    }

    // Add submit event listener to validate form before submission
    form.addEventListener('submit', validateForm);
});