import { useState } from "react";

function Login({ setIsLoggedIn }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

function handleLogin(e) {
  e.preventDefault();

  const users = JSON.parse(localStorage.getItem("users")) || {};

  if (users[username] && users[username] === password) {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("user", JSON.stringify({ username }));
    setIsLoggedIn(true);
    window.location.href = "/notes";
  } else {
    alert("Invalid credentials");
  }
}

  return (
    <div className="auth">
      <h3>Login</h3>

      <form onSubmit={handleLogin}>
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

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
