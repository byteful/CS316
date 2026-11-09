const loginForm = document.getElementById("loginForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const rememberCheckbox = document.getElementById("rememberUsername");

rememberCheckbox.checked = localStorage.getItem("rememberUsername") === "true";
if (rememberCheckbox.checked) {
  usernameInput.value = localStorage.getItem("savedUsername") || "";
}

rememberCheckbox.addEventListener("change", () => {
  localStorage.setItem("rememberUsername", rememberCheckbox.checked);
  if (!rememberCheckbox.checked) {
    localStorage.removeItem("savedUsername");
  }
});

document.getElementById("createAccountButton").addEventListener("click", () => {
  window.location.href = "/new-account.html";
});

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (rememberCheckbox.checked) {
    localStorage.setItem("savedUsername", usernameInput.value);
  }
  const response = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: usernameInput.value, password: passwordInput.value }),
  });
  if (response.ok) {
    window.location.href = "/form.html";
  } else {
    alert("The login information is incorrect.");
  }
});
