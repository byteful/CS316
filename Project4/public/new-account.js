const newUsernameInput = document.getElementById("newUsername");
const newPasswordInput = document.getElementById("newPassword");

document.getElementById("newAccountForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  if (newUsernameInput.value === "" || newPasswordInput.value === "") {
    alert("Please fill in both the username and password.");
    return;
  }
  await fetch("/api/accounts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: newUsernameInput.value, password: newPasswordInput.value }),
  });
  document.getElementById("successMessage").hidden = false;
});
