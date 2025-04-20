// Select the form and its elements
const form = document.querySelector('form');
const username = document.querySelector('input[name="username"]');
const email = document.querySelector('input[name="email"]');
const password = document.querySelector('input[name="password"]');
const confirmPassword = document.querySelector('input[name="confirmPassword"]');
const registerButton = document.querySelector('.btn');


// Handle the form submission
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Get input values
  const usernameValue = username.value;
  const emailValue = email.value;
  const passwordValue = password.value;
  const confirmPasswordValue = confirmPassword.value;

  // Basic Validation
  if (passwordValue !== confirmPasswordValue) {
    alert("Passwords do not match!");
    return;
  }

  // Prepare data for the API call
  const userData = {
    username: usernameValue,
    email: emailValue,
    password: passwordValue,
  };

  try {
    const response = await fetch('http://localhost:5000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
  
    const contentType = response.headers.get('content-type');
  
    if (contentType && contentType.includes('application/json')) {
      const result = await response.json();
  
      if (response.ok) {
        alert('Registration successful!');
        window.location.href = 'login.html';
      } else {
        alert(`Error: ${result.message}`);
      }
    } else {
      const errorText = await response.text();
      console.error('Unexpected response:', errorText);
      alert('Server did not return JSON. Check console for details.');
    }
  } catch (error) {
    alert('There was an error with your request.');
    console.error(error);
  }
})  
function register() {
  alert("Registered successfully!");
  setTimeout(() => {
    window.location.href = "login.html"; // Change this path if your login page has a different location
  }, 1500); 
}
