const surveyForm = document.getElementById("surveyForm");

async function loadForm() {
  const response = await fetch("/api/form");
  if (!response.ok) {
    window.location.href = "/";
    return;
  }
  const formData = await response.json();
  if (!formData) {
    return;
  }
  for (const input of surveyForm.elements) {
    if (input.type === "radio") {
      input.checked = input.value === formData[input.name];
    } else if (input.name) {
      input.value = formData[input.name] || "";
    }
  }
}

surveyForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await fetch("/api/form", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(Object.fromEntries(new FormData(surveyForm))),
  });
  document.getElementById("saveMessage").hidden = false;
});

loadForm();
