import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="co" style={{ textAlign: "center" }}>
      <h3>Counter Page</h3>
      <button onClick={() => setCount(count + 1)}>
        Count: {count}
      </button>
    </div>
  );
}

export default Counter;
