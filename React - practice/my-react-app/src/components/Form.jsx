import useInput from "../hooks/useInput";
import { useState } from "react";

function Form({ onAdd }) {
  const nameInput = useInput("");   // 👈 CUSTOM HOOK USED HERE
  const [lastAdded, setLastAdded] = useState("");

  function submitHandler(e) {
    e.preventDefault();

    if (!nameInput.value.trim()) return;

    onAdd(nameInput.value);
    setLastAdded(nameInput.value);
    nameInput.reset();
  }

  return (
    <form className="form" onSubmit={submitHandler}>
      <p>Add item to list</p>

      <input
        type="text"
        value={nameInput.value}
        onChange={nameInput.onChange}
      />

      <button type="submit">Add</button>

      {lastAdded && (
        <p style={{ color: "green" }}>
          Last added: <strong>{lastAdded}</strong>
        </p>
      )}
    </form>
  );
}

export default Form;
