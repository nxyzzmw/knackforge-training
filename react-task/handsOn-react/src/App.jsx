import React, { useState } from "react";
import { HashRouter, Routes, Route, Link } from "react-router-dom";
import { ThemeContext } from "./ThemeContext";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Todo from "./pages/Todo";

import "./App.css";

function App() {
  const [theme, setTheme] = useState("light");

  function toggleTheme() {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <HashRouter>
        {/* ✅ Full Page Wrapper */}
        <div className={`app-container ${theme}`}>
          {/* ✅ NAVBAR */}
          <nav className="navbar">
            <h2 className="logo">ReactApp</h2>
 
            <div className="links">
              <Link to="/">Home</Link>
              <Link to="/about">About</Link>
              <Link to="/contact">Contact</Link>
              
            </div>

            <button className="theme-btn" onClick={toggleTheme}>
              {theme === "light" ? "🌙 Dark" : "☀️ Light"}
            </button>
          </nav>

          {/* ✅ Page Content */}
          <div className="page-content">
            <Routes>
              <Route path="/" element={<Home />}  />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/todo" element={<Todo />} />

            </Routes>
          </div>
        </div>
        
      </HashRouter>
   
    </ThemeContext.Provider>
  );
}

export default App;
