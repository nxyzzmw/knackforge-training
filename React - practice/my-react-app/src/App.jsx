import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { ThemeContext } from "./ThemeContext";

import Home from "./pages/home";
import ListPage from "./pages/ListPage";
import Counter from "./pages/Counter";
import RandomPage from "./pages/RandomPage";
import ThemePage from "./pages/ThemePage";

import "./App.css";

function App() {
  const [theme, setTheme] = useState("light");
  const [items, setItems] = useState(["Apple", "Banana", "Orange"]);
  const [username, setUsername] = useState("");

  const adjectives = ["Silent", "Brave", "Cosmic", "Lucky", "Mighty"];
  const nouns = ["Tiger", "Panda", "Wolf", "Falcon", "Dragon"];

  const cardsData = [
    { title: "Web Development" },
    { title: "App Development" },
    { title: "UI/UX Design" },
    { title: "IT Consulting" },
    { title: "Cybersecurity" },
    { title: "Data Analytics & BI" }
  ];

  function addItem(newItem) {
    setItems([...items, newItem]);
  }

  function generateUsername() {
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const number = Math.floor(Math.random() * 1000);
    setUsername(`${adj}${noun}${number}`);
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <BrowserRouter>
        {/* NAVBAR */}
        <nav style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Link to="/">Home</Link> |{" "}
          <Link to="/list">List</Link> |{" "}
          <Link to="/counter">Counter</Link> |{" "}
          <Link to="/random">Random</Link> |{" "}
          <Link to="/theme">Theme</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Home cardsData={cardsData} />} />
          <Route
            path="/list"
            element={<ListPage items={items} onAdd={addItem} />}
          />
          <Route path="/counter" element={<Counter />} />
          <Route
            path="/random"
            element={
              <RandomPage
                username={username}
                onGenerate={generateUsername}
              />
            }
          />
          <Route path="/theme" element={<ThemePage />} />
        </Routes>
      </BrowserRouter>
    </ThemeContext.Provider>
  );
}

export default App;
