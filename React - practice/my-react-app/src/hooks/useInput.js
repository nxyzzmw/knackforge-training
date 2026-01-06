import { useState } from "react";

function useInput(initialValue = "") {
  const [value, setValue] = useState(initialValue);

  function handleChange(e) {
    setValue(e.target.value);
  }

  function reset() {
    setValue("");
  }

  return {
    value,
    onChange: handleChange,
    reset
  };
}

export default useInput;
