  import React, { useContext } from "react";
import { ThemeContext } from "../ThemeContext";

function Contact() {
  const { theme } = useContext(ThemeContext);

  return (
    <div style={{ padding: "20px" }}>
      <h2> Contact Page</h2>
      <p>Theme is: {theme}</p>
    </div>
  );
}

export default Contact;
