import React, { useContext } from "react";
import { ThemeContext } from "../ThemeContext";

function ThemeToggle() {
  const { theme, setTheme } = useContext(ThemeContext);

  function toggleTheme() {
    setTheme(theme === "light" ? "dark" : "light");
  }

  return (
    <button onClick={toggleTheme} style={{ marginLeft: "auto" }}>
      {theme === "light" ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}

export default ThemeToggle;
