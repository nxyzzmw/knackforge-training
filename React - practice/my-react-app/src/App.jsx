import React, { useState } from "react";
import { HashRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import { ThemeContext } from "./ThemeContext";

import Home from "./pages/home";
import ListPage from "./pages/ListPage";
import Counter from "./pages/Counter";
import RandomPage from "./pages/RandomPage";
import ThemePage from "./pages/ThemePage";
import Notes from "./pages/Notes";
import Calculator from "./pages/Calculator";
import Todo from "./pages/Todo";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

import "./App.css";

function App() {
  const [theme, setTheme] = useState("light");
  const [items, setItems] = useState(["Apple", "Banana", "Orange"]);
  const cardsData = [
    { title: "Web Development" },
    { title: "App Development" },
    { title: "UI/UX Design" },
    { title: "IT Consulting" },
    { title: "Cybersecurity" },
    { title: "Data Analytics & BI" },
  ];

  const adjectives = ["Silent", "Brave", "Cosmic", "Lucky", "Mighty"];
  const nouns = ["Tiger", "Panda", "Wolf", "Falcon", "Dragon"];
  const [username1, setUsername1] = useState("");

  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );

  const user = JSON.parse(localStorage.getItem("user"));
  const username = user?.username;

  function logout() {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
    window.location.href = "/login";
  }

  function generateUsername() {
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const number = Math.floor(Math.random() * 1000);
    setUsername1(`${adj}${noun}${number}`);
  }

  function addItem(newItem) {
    setItems([...items, newItem]);
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <HashRouter>
        <nav
          className={`navbar navbar-expand-lg ${
            theme === "dark" ? "navbar-dark bg-dark" : "navbar-light bg-light"
          }`}
        >
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">
              ReactApp
            </Link>

            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#mainNavbar"
              aria-controls="mainNavbar"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="mainNavbar">
              <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                {!isLoggedIn && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/login">
                        Login
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/signup">
                        Signup
                      </Link>
                    </li>
                  </>
                )}

                {isLoggedIn && (
                  <>
                    <li className="nav-item">
                      <span className="nav-link fw-bold">
                        Welcome, {username}
                      </span>
                    </li>

                    <li className="anav-item">
                      <Link className="nav-link" to="/">
                        Home
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link className="nav-link" to="/list">
                        List
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link className="nav-link" to="/counter">
                        Counter
                      </Link>
                    </li>       

                    <li className="nav-item">
                      <Link className="nav-link" to="/random">
                        Random
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link className="nav-link" to="/theme">
                        Theme
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link className="nav-link" to="/notes">
                        Notes
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link className="nav-link" to="/dashboard">
                        Dashboard
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/calculator">
                        Calculator
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/todo">
                        Todo
                      </Link>
                    </li>

                    <li className="nav-item">
                      <button
                        className="btn btn-danger ms-lg-3 mt-2 mt-lg-0"
                        onClick={logout}
                      >
                        Logout
                      </button>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </nav>

        {/* ROUTES */}
        <Routes>
          <Route
            path="/login"
            element={<Login setIsLoggedIn={setIsLoggedIn} />}
          />
          <Route path="/signup" element={<Signup />} />

          <Route
            path="/"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Home cardsData={cardsData} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/list"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <ListPage items={items} onAdd={addItem} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/counter"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Counter />
              </ProtectedRoute>
            }
          />

          <Route
            path="/random"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <RandomPage
                  username={username1}
                  onGenerate={generateUsername}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/theme"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <ThemePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/notes"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Notes />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/calculator"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Calculator />
              </ProtectedRoute>
            }
          />

          <Route
            path="/todo"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Todo />
              </ProtectedRoute>
            }
          />


          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </HashRouter>
    </ThemeContext.Provider>
  );
}

export default App;
