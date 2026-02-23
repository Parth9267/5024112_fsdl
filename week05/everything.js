// everything.js - login page JavaScript with error handling, validations, arrays, string, date

// sample user database (array of objects)
const users = [
  { email: 'alice@example.com', password: 'password1' },
  { email: 'bob@example.com', password: 'secret123' }
];

// simple string validation helpers
function isNonEmptyString(val) {
  return typeof val === 'string' && val.trim().length > 0;
}

function isValidEmail(email) {
  const re = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  return isNonEmptyString(email) && re.test(email);
}

// Error class for validation errors
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

// function that attempts login and uses array search
function attemptLogin(email, password) {
  // perform validations
  if (!isValidEmail(email)) {
    throw new ValidationError('Please enter a valid email address.');
  }
  if (!isNonEmptyString(password)) {
    throw new ValidationError('Password cannot be empty.');
  }

  // search users array
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    throw new Error('No user found with that email.');
  }
  if (user.password !== password) {
    throw new Error('Incorrect password.');
  }

  return user;
}

// event handler for login form
function handleLoginEvent(event) {
  event.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  const output = document.getElementById('loginOutput');

  try {
    const user = attemptLogin(email, password);
    const now = new Date();
    output.textContent = `Welcome, ${user.email}! You logged in at ${now.toLocaleString()}.`;
    output.className = 'text-success';
  } catch (err) {
    if (err instanceof ValidationError) {
      output.textContent = 'Validation error: ' + err.message;
    } else {
      output.textContent = 'Login failed: ' + err.message;
    }
    output.className = 'text-danger';
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  if (form) {
    form.addEventListener('submit', handleLoginEvent);
  }
});
