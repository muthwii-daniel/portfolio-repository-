const elements = {
  form: document.getElementById('regform'),
  
  // Inputs
  nameInput: document.getElementById("name"),
  emailInput: document.getElementById("email"),
  passwordInput: document.getElementById("password"),
  confirmPasswordInput: document.getElementById("confirm-password"),
  genderInput: document.getElementById("gender"),
  dobInput: document.getElementById("dob"),
  countryInput: document.getElementById("country"),
  phoneInput: document.getElementById("phone"),
  bioInput: document.getElementById("bio"),

  // Error Spans
  nameError: document.getElementById("nameError"),
  emailError: document.getElementById("emailError"),
  passwordError: document.getElementById("passwordError"),
  confirmError: document.getElementById("confirmError"),
  genderError: document.getElementById("genderError"),
  dobError: document.getElementById("dobError"),
  countryError: document.getElementById("countryError"),
  phoneError: document.getElementById("phoneError"),
  bioError: document.getElementById("bioError"),

  // UI Elements
  successMessage: document.getElementById("successMsg"),
  memberList: document.getElementById("memberList"),
  memberCounter: document.getElementById("count"),
  darkModeBtn: document.getElementById("theme"),
  emptyNote: document.getElementById("emptyNote")
};

// Global member count tracker
let totalMembers = 0;

// ==========================================
// 2. Capture Form Submission
// ==========================================
elements.form.addEventListener('submit', function (e) {
  e.preventDefault(); // Prevent standard page reload

  // Run validation checks
  const isValid = validateForm();
  if (isValid) {
    registerMember();
  }
});


function validateForm() {
  let isValid = true;

  // Name Validation
  if (!elements.nameInput.value.trim()) {
    showError(elements.nameError, 'Full name is required.');
    isValid = false;
  } else {
    clearError(elements.nameError);
  }

  // Email Validation (Matches kyu.ac.ke student email format patterns if needed)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!elements.emailInput.value.trim()) {
    showError(elements.emailError, 'Email is required.');
    isValid = false;
  } else if (!emailRegex.test(elements.emailInput.value.trim())) {
    showError(elements.emailError, 'Please enter a valid email address.');
    isValid = false;
  } else {
    clearError(elements.emailError);
  }

  // Password Validations
  if (!elements.passwordInput.value) {
    showError(elements.passwordError, 'Password is required.');
    isValid = false;
  } else if (elements.passwordInput.value.length < 6) {
    showError(elements.passwordError, 'Password must be at least 6 characters.');
    isValid = false;
  } else {
    clearError(elements.passwordError);
  }

  // Confirm Password Check
  if (!elements.confirmPasswordInput.value) {
    showError(elements.confirmError, 'Please confirm your password.');
    isValid = false;
  } else if (elements.passwordInput.value !== elements.confirmPasswordInput.value) {
    showError(elements.confirmError, 'Passwords do not match.');
    isValid = false;
  } else {
    clearError(elements.confirmError);
  }

  // Gender Selection Validation
  if (!elements.genderInput.value) {
    showError(elements.genderError, 'Please select your gender.');
    isValid = false;
  } else {
    clearError(elements.genderError);
  }

  // Bio Text Field Validation
  if (!elements.bioInput.value.trim()) {
    showError(elements.bioError, 'Please write a short bio.');
    isValid = false;
  } else {
    clearError(elements.bioError);
  }

  return isValid;
}

// Error UI helpers
function showError(errorSpan, message) {
  if (errorSpan) {
    errorSpan.textContent = message;
    errorSpan.style.display = 'block';
  }
}

// Clear error styles safely
function clearError(errorSpan) {
  if (errorSpan) {
    errorSpan.textContent = '';
    errorSpan.style.display = 'none';
  }
}

// ==========================================
// 4. Real-time Error Clearance Array Map
// ==========================================
const dynamicFields = [
  { input: elements.nameInput, error: elements.nameError },
  { input: elements.emailInput, error: elements.emailError },
  { input: elements.passwordInput, error: elements.passwordError },
  { input: elements.confirmPasswordInput, error: elements.confirmError },
  { input: elements.genderInput, error: elements.genderError },
  { input: elements.bioInput, error: elements.bioError }
];

dynamicFields.forEach(({ input, error }) => {
  if (!input || !error) return;
  const eventType = input.tagName === 'SELECT' ? 'change' : 'input';
  input.addEventListener(eventType, () => {
    clearError(error);
  });
});

// ==========================================
// 5. Register Member UI Injection
// ==========================================
function registerMember() {
  // Clear the "No members yet" message if it is visible
  if (elements.emptyNote) {
    elements.emptyNote.style.display = 'none';
  }

  // Build structural list container
  const li = document.createElement('li');
  li.className = 'member-item';

  // Build context summary container
  const detailsDiv = document.createElement('div');
  detailsDiv.className = 'member-details';
  
  // Format layout presentation 
  const displayGender = elements.genderInput.value.charAt(0).toUpperCase() + elements.genderInput.value.slice(1);
  const countryText = elements.countryInput.value.trim() ? ` | ${elements.countryInput.value.trim()}` : '';

  detailsDiv.innerHTML = `
    <strong>${elements.nameInput.value.trim()}</strong> (${displayGender}${countryText})<br>
    <small>${elements.emailInput.value.trim()}</small>
    <p>${elements.bioInput.value.trim()}</p>
  `;

  // Remove Button Implementation
  const removeBtn = document.createElement('button');
  removeBtn.textContent = 'Remove';
  removeBtn.className = 'remove-btn';
  removeBtn.addEventListener('click', () => {
    li.remove();
    updateCounter(-1);
  });

  // Structural composition setup
  li.appendChild(detailsDiv);
  li.appendChild(removeBtn);
  elements.memberList.appendChild(li);

  // Status transitions Updates
  updateCounter(1);
  showSuccessAndReset();
}

// ==========================================
// 6. Update Counter Management
// ==========================================
function updateCounter(amount) {
  totalMembers += amount;
  if (elements.memberCounter) {
    elements.memberCounter.textContent = totalMembers;
  }

  // Bring back placeholder empty notification if items go down to zero
  if (totalMembers === 0 && elements.emptyNote) {
    elements.emptyNote.style.display = 'block';
  }
}

// ==========================================
// 7. Submission System Resets
// ==========================================
function showSuccessAndReset() {
  if (elements.successMessage) {
    elements.successMessage.textContent = 'Member successfully registered!';
    elements.successMessage.classList.remove('hidden');
    elements.successMessage.style.display = 'block';

    setTimeout(() => {
      elements.successMessage.style.display = 'none';
      elements.successMessage.classList.add('hidden');
    }, 4000);
  }

  elements.form.reset();
}


if (elements.theme-btn) {
  elements.theme-btn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    
    if (document.body.classList.contains('dark-mode')) {
      elements.theme-btn.textContent ; 'Light Mode';
    } else {
      elements.theme-btn.textContent ; 'Dark Mode';
    }
  });
}