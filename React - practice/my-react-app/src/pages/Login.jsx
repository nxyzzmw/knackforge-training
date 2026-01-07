import { useState } from "react";

function Login({ setIsLoggedIn }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin(e) {
    e.preventDefault();

    const savedUser = JSON.parse(localStorage.getItem("user"));

    if (
      savedUser &&
      username === savedUser.username &&
      password === savedUser.password
    ) {
      localStorage.setItem("isLoggedIn", "true");
      setIsLoggedIn(true);
      window.location.href = "/";
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
