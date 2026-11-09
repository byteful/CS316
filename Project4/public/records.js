const accountSelect = document.getElementById("accountSelect");
const recordsTable = document.getElementById("recordsTable");
const recordsBody = document.getElementById("recordsBody");

const RECORD_FIELDS = [
  { key: "fullName", label: "Full name" },
  { key: "favoriteLanguage", label: "Favorite language" },
  { key: "editor", label: "Preferred editor" },
  { key: "yearsCoding", label: "Years of programming experience" },
  { key: "project", label: "A project they have built" },
];

async function loadAccountIds() {
  const response = await fetch("/api/accounts");
  for (const id of await response.json()) {
    accountSelect.add(new Option(id, id));
  }
}

accountSelect.addEventListener("change", async () => {
  recordsBody.replaceChildren();
  recordsTable.hidden = accountSelect.value === "";
  if (recordsTable.hidden) {
    return;
  }
  const response = await fetch(`/api/records/${accountSelect.value}`);
  const formData = (await response.json()) || {};
  for (const field of RECORD_FIELDS) {
    const row = recordsBody.insertRow();
    const header = document.createElement("th");
    header.textContent = field.label;
    row.appendChild(header);
    row.insertCell().textContent = (formData[field.key] || "").trim() || "Left empty";
  }
});

loadAccountIds();
