document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('shopperForm');
  const fields = {
      email: document.getElementById('email'),
      firstName: document.getElementById('firstName'),
      lastName: document.getElementById('lastName'),
      phone: document.getElementById('phone'),
      age: document.getElementById('age'),
      street: document.getElementById('street'),
      city: document.getElementById('city'),
      state: document.getElementById('state'),
      zip: document.getElementById('zip')
  };

  // Validation Rules (unchanged)
  const validationRules = {
      email: {
          required: true,
          pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
          errorMessages: {
              required: 'Email is required',
              pattern: 'Please enter a valid email address'
          }
      },
      firstName: {
          required: true,
          errorMessages: {
              required: 'First name is required'
          }
      },
      lastName: {
          required: true,
          errorMessages: {
              required: 'Last name is required'
          }
      },
      age: {
          required: true,
          min: 13,
          errorMessages: {
              required: 'Age is required',
          }
      },
      street: {
          required: true,
          errorMessages: {
              required: 'Street address is required'
          }
      },
      city: {
          required: true,
          errorMessages: {
              required: 'City is required'
          }
      },
      state: {
          required: true,
          errorMessages: {
              required: 'State is required'
          }
      },
      zip: {
          required: true,
          pattern: /^\d{5}$/,
          errorMessages: {
              required: 'Zip code is required',
              pattern: 'Zip code must be 5 digits'
          }
      }
  };

  // Form Submission Handler (unchanged)
  form.addEventListener('submit', function(e) {
      e.preventDefault();
      resetAllErrors();
      
      let isFormValid = true;

      // Validate all fields
      Object.keys(fields).forEach(fieldName => {
          const field = fields[fieldName];
          const rules = validationRules[fieldName];
          
          if (rules) {
              const { isValid, error } = validateField(field, rules);
              if (!isValid) {
                  showError(field, error);
                  isFormValid = false;
              }
          }
      });

      // Submit if valid
      if (isFormValid) {
          saveShopperData();
          alert('Profile saved successfully!');
          form.reset();
      }
  });

  // Real-time Validation (on blur) (unchanged)
  Object.values(fields).forEach(field => {
      field.addEventListener('blur', function() {
          const fieldName = field.id;
          const rules = validationRules[fieldName];
          
          if (rules) {
              resetError(field);
              const { isValid, error } = validateField(field, rules);
              if (!isValid) showError(field, error);
          }
      });
  });

  // Core Validation Function (unchanged)
  function validateField(field, rules) {
      const value = field.value.trim();
      let isValid = true;
      let error = '';

      if (rules.required && !value) {
          error = rules.errorMessages.required;
          isValid = false;
      } else if (value) {
          if (rules.pattern && !rules.pattern.test(value)) {
              error = rules.errorMessages.pattern;
              isValid = false;
          }
          
          if (rules.min && parseInt(value) < rules.min) {
              error = rules.errorMessages.min;
              isValid = false;
          }
      }

      return { isValid, error };
  }

  // Error display functions (unchanged)
  function showError(field, message) {
      field.style.border = '2px solid #dc3545';
      field.style.boxShadow = '0 0 0 0.25rem rgba(220,53,69,.25)';
      
      const errorElement = document.createElement('div');
      errorElement.className = 'error-message';
      errorElement.style.color = '#dc3545';
      errorElement.style.fontSize = '0.875rem';
      errorElement.style.marginTop = '0.25rem';
      errorElement.textContent = message;
      
      field.parentNode.insertBefore(errorElement, field.nextSibling);
  }

  function resetAllErrors() {
      document.querySelectorAll('.error-message').forEach(msg => msg.remove());
      Object.values(fields).forEach(field => {
          field.style.border = '1px solid #ced4da';
          field.style.boxShadow = 'none';
      });
  }

  function resetError(field) {
      field.style.border = '1px solid #ced4da';
      field.style.boxShadow = 'none';
      const error = field.parentNode.querySelector('.error-message');
      if (error) error.remove();
  }

  // Updated Data Handling with JSON file download
  function saveShopperData() {
      const shopper = {
          email: fields.email.value.trim(),
          firstName: fields.firstName.value.trim(),
          lastName: fields.lastName.value.trim(),
          phone: fields.phone.value.trim() || null,
          age: parseInt(fields.age.value),
          address: {
              street: fields.street.value.trim(),
              city: fields.city.value.trim(),
              state: fields.state.value,
              zip: fields.zip.value.trim()
          },
          createdAt: new Date().toISOString()
      };

      // 1. Update localStorage (existing functionality)
      const shoppers = JSON.parse(localStorage.getItem('shoppers')) || [];
      const existingIndex = shoppers.findIndex(s => s.email === shopper.email);
      
      if (existingIndex >= 0) {
          shoppers[existingIndex] = shopper;
      } else {
          shoppers.push(shopper);
      }
      localStorage.setItem('shoppers', JSON.stringify(shoppers));

      // 2. Create downloadable JSON file (new functionality)
      createDownloadableJson(shoppers);
  }

  // New function to create downloadable JSON
  function createDownloadableJson(shoppersData) {
      // Format the JSON with 2-space indentation for readability
      const jsonString = JSON.stringify(shoppersData, null, 2);
      
      // Create a Blob with the JSON data
      const blob = new Blob([jsonString], { type: 'application/json' });
      
      // Create a download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'shoppers_data.json';
      
      // Trigger the download
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      setTimeout(() => {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
      }, 100);
  }
});