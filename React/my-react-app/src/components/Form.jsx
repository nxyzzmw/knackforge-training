import { useState } from "react";

function Form({ onAdd }) {
  const [value, setValue] = useState("");

  const [count, setCount] = useState(0);

  function handleSubmit(e) {
    e.preventDefault();

    if (!onAdd) {
      console.error("onAdd prop is missing");
      return;
    }

    if (!value.trim()) return;

    onAdd(value);
    setValue("");
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <p>Write and submit to add it in the list below:</p>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />

      <button type="submit">Submit</button>
      <p>
        Counter:<button onClick={() => setCount(count + 1)}>{count}</button>
      </p>
    </form>
  );
}

export default Form;
