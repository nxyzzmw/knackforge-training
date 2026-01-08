import { useState } from "react";

function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleSignup(e) {
  e.preventDefault();

  if (!username || !password) return;

  const users = JSON.parse(localStorage.getItem("users")) || {};

  if (users[username]) {
    alert("User already exists");
    return;
  }

  users[username] = password;

  localStorage.setItem("users", JSON.stringify(users));

  alert("Signup successful. Please login.");
  window.location.href = "/login";
}

  return (
    <div className="auth">
      <h3>Signup</h3>

      <form onSubmit={handleSignup}>
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Create Account</button>
      </form>
    </div>
  );
}

export default Signup;
