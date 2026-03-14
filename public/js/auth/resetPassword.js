import { API_URL } from "../config/config.js";

document.addEventListener("DOMContentLoaded", () => {
    const resetPasswordForm = document.getElementById("reset-password-form")
    resetPasswordForm.addEventListener('submit', async (e) => {
      e.preventDefault() // Prevent form from reloading the page

      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');

      if (!token) {
        window.location.href = "/login.html";
      }

      const password = document.getElementById('reset-password').value.trim();
      const confirmPassword = document.getElementById('confirm-password').value.trim();
      const errorMessage = document.getElementById('error-message');
      const submitBtn = resetPasswordForm.querySelector('button');

      errorMessage.textContent = '' // Clear old error messages
      submitBtn.disabled = true

      try {
        const res = await fetch(API_URL + '/api/auth/reset-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include', // Ensure session cookie is sent
          body: JSON.stringify({ token, password, confirmPassword })
        })

        const data = await res.json();

        if (res.ok) { 
          const formContext = resetPasswordForm.querySelector('.form-inner');
          formContext.textContent = "";
          const confirmation = document.createElement('p');
          confirmation.textContent = data.message;          
          const goBackToLogin = document.createElement('p');
          goBackToLogin.insertAdjacentText('beforeend', 'Go back to login page ');

          const a = document.createElement('a');
          a.href = '/login.html';
          a.textContent = 'here';
          a.className = 'sign-link';
          goBackToLogin.appendChild(a);

          goBackToLogin.insertAdjacentText('beforeend', '.');

          formContext.append(confirmation);
          formContext.append(goBackToLogin);
        } else {
          errorMessage.textContent = data.error || 'Error. Please try again.'
        }
      } catch (err) {
        console.error('Network error:', err)
        errorMessage.textContent = 'Unable to connect. Please try again.'
      } finally {
        submitBtn.disabled = false
      }
  });
})