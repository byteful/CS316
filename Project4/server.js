const express = require("express");
const session = require("express-session");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, "data");
const ACCOUNT_LIST_PATH = path.join(DATA_DIR, "accounts.json");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function findAccount(id) {
  return readJson(ACCOUNT_LIST_PATH).accounts.find((account) => account.id === id);
}

fs.mkdirSync(path.join(DATA_DIR, "accounts"), { recursive: true });
if (!fs.existsSync(ACCOUNT_LIST_PATH)) {
  writeJson(ACCOUNT_LIST_PATH, { nextId: 1, accounts: [] });
}

const app = express();

app.use(express.json());
app.use(session({ secret: "cs316-project4", resave: false, saveUninitialized: false }));
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/login", (req, res) => {
  const accountList = readJson(ACCOUNT_LIST_PATH);
  const match = accountList.accounts.find(
    (account) => account.username === req.body.username && account.password === req.body.password
  );
  if (!match) {
    return res.sendStatus(401);
  }
  req.session.accountId = match.id;
  res.sendStatus(200);
});

app.post("/api/accounts", (req, res) => {
  const accountList = readJson(ACCOUNT_LIST_PATH);
  const id = accountList.nextId;
  const file = `accounts/${id}.json`;
  const { username, password } = req.body;
  writeJson(path.join(DATA_DIR, file), { id, username, password, formData: null });
  accountList.accounts.push({ id, username, password, file });
  accountList.nextId = id + 1;
  writeJson(ACCOUNT_LIST_PATH, accountList);
  res.sendStatus(201);
});

app.get("/api/accounts", (req, res) => {
  res.json(readJson(ACCOUNT_LIST_PATH).accounts.map((account) => account.id));
});

app.get("/api/records/:id", (req, res) => {
  const account = findAccount(Number(req.params.id));
  if (!account) {
    return res.sendStatus(404);
  }
  res.json(readJson(path.join(DATA_DIR, account.file)).formData);
});

app.get("/api/form", (req, res) => {
  const account = findAccount(req.session.accountId);
  if (!account) {
    return res.sendStatus(401);
  }
  res.json(readJson(path.join(DATA_DIR, account.file)).formData);
});

app.post("/api/form", (req, res) => {
  const account = findAccount(req.session.accountId);
  if (!account) {
    return res.sendStatus(401);
  }
  const filePath = path.join(DATA_DIR, account.file);
  const accountFile = readJson(filePath);
  accountFile.formData = req.body;
  writeJson(filePath, accountFile);
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
