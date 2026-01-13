import React, { useContext } from "react";
import { ThemeContext } from "../ThemeContext";
import { Link } from "react-router-dom";  

function Home() {
  const { theme } = useContext(ThemeContext);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Home Page</h2>
      <p>Theme is: {theme}</p>

      <Link to="/todo">
        <button className="todo-btn">Go To Todo</button>
      </Link>
    </div>
  );
}

export default Home;
