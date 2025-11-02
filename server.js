/**
 * Combined React + Express Example
 * ---------------------------------
 * This single code file:
 *   - Starts an Express server
 *   - Serves a React frontend (index.html + app.js)
 *   - Connects frontend to backend via Axios
 *
 * Run:
 *   mkdir public
 *   node server.js
 * Then open http://localhost:3000
 */

const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());

// Create 'public' folder and files dynamically if not exist
const publicDir = path.join(__dirname, "public");
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir);

// ==============================
// Create Frontend (React + Axios)
// ==============================

const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>React + Express + Axios Demo</title>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
</head>
<body style="font-family: sans-serif; background: #fafafa; padding: 30px;">
  <div id="root"></div>
  <script src="app.js"></script>
</body>
</html>
`;

const reactAppContent = `
const { useState, useEffect } = React;

function App() {
  const [message, setMessage] = useState("Loading...");
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState("");

  // Fetch greeting from backend
  useEffect(() => {
    axios.get("/api/hello")
      .then(res => setMessage(res.data.message))
      .catch(err => setMessage("Error fetching message"));
  }, []);

  // Fetch all users
  const fetchUsers = () => {
    axios.get("/api/users").then(res => setUsers(res.data));
  };

  // Add user
  const addUser = () => {
    if (!newUser) return;
    axios.post("/api/users", { name: newUser }).then(() => {
      setNewUser("");
      fetchUsers();
    });
  };

  return (
    React.createElement("div", null,
      React.createElement("h2", null, "🌐 React + Express + Axios Demo"),
      React.createElement("p", null, message),
      React.createElement("hr", null),
      React.createElement("h3", null, "Users"),
      React.createElement("button", { onClick: fetchUsers }, "Fetch Users"),
      React.createElement("ul", null,
        users.map((u, i) =>
          React.createElement("li", { key: i }, u.name)
        )
      ),
      React.createElement("input", {
        value: newUser,
        placeholder: "Enter new user name",
        onChange: (e) => setNewUser(e.target.value),
        style: { marginRight: "10px", padding: "5px" }
      }),
      React.createElement("button", { onClick: addUser }, "Add User")
    )
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(React.createElement(App));
`;

fs.writeFileSync(path.join(publicDir, "index.html"), htmlContent);
fs.writeFileSync(path.join(publicDir, "app.js"), reactAppContent);

// ==============================
// Backend API (Express)
// ==============================

const users = [{ name: "Alice" }, { name: "Bob" }];

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from Express backend 👋" });
});

app.get("/api/users", (req, res) => {
  res.json(users);
});

app.post("/api/users", (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Name required" });
  users.push({ name });
  res.json({ success: true });
});

// Serve frontend
app.use(express.static(publicDir));

// ==============================
// Start Server
// ==============================
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
