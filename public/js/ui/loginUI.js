document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("signin-form");
  const resetForm = document.getElementById("forgot-password-form");
  const resetLink = document.getElementById("reset-password-link");
  const backToLoginLink = document.getElementById("back-to-login-link");

  function toggleForms(showReset) {
    if (showReset) {
      loginForm.style.display = "none";
      resetForm.style.display = "block";
    } else {
      loginForm.style.display = "block";
      resetForm.style.display = "none";
    }
  }

  const params = new URLSearchParams(window.location.search);
  if (params.has("forgot-password")) {
    toggleForms(true);
  }

  resetLink.addEventListener("click", (e) => {
    e.preventDefault();
    toggleForms(true);
    history.pushState(null, "", "?forgot-password");
  });

  backToLoginLink.addEventListener("click", (e) => {
    e.preventDefault();
    toggleForms(false);
    history.pushState(null, "", "?login");
  });
});