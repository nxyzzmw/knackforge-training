import { useState } from "react";
import List from "./components/List";
import Cards from "./components/Cards";
import Form from "./components/Form";
import "./App.css";

function App() {
  const [items, setItems] = useState(["Apple", "Banana", "Orange"]);

  const cardsData = [
    { title: "Web Development" },
    { title: "App Development" },
    { title: "UI/UX Design" },
    { title: "IT Consulting" },
    { title: "Cybersecurity" },
    { title: "Data Analytics & BI" },
  ];

  function addItem(newItem) {
    setItems([...items, newItem]);
  }

  return (
    <div className="App1">
      <h1>Hello! Practice on React.js</h1>

      <Form onAdd={addItem} />
      <List items={items} />
      <Cards cards={cardsData} />
    </div>
  );
}

export default App;
