import './App.css'
import { useState , useEffect} from 'react';

function App() {

  const type = { name: "nayeem", age: 10 };
  const username: string = "Nayeem";
  const age: number = 23;
  const isActive: boolean = true;

  const [items, setItems] = useState<string[]>([
    "Java",
    "React",
    "Azure"
  ]);
function add(a: number, b: number): number {
  return a + b;
}

console.log(add(10, 20));

  useEffect(() => {
    setItems(prev => [...prev, "TypeScript"]);
  }, []);

  const greet = (name: string): string => {
  return `Hello ${name}`;
};

console.log(greet("Nayeem"));

  return (
    <>
      <p>{type.name}</p>
      <p>{username}</p>
      <p>{age}</p>
      <p>{add(10, 20)}</p>
      <p>{isActive ? "Active" : "Inactive"}</p>
      <p>{greet("nayeem")}</p>
      <ul>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
          
        ))}
      </ul>
    </>
  );
}

export default App;
