import React, { useContext } from "react";
import { ThemeContext } from "../ThemeContext";

function About() {
  const { theme } = useContext(ThemeContext);

  return (
    <div style={{ padding: "20px" }}>
      <h2>ℹ️ About Page</h2>
      <p>Theme is: {theme}</p>
    </div>
  );
}

export default About;
