import { useState } from "react";

function Calculator() {
  const [display, setDisplay] = useState("0");
  const [prevValue, setPrevValue] = useState(null);
  const [operator, setOperator] = useState(null);

  function handleNumber(num) {
    setDisplay(display === "0" ? num : display + num);
  }

  function handleDecimal() {
    if (display.includes(".")) return;
    setDisplay(display + ".");
  }

  function handleOperator(op) {
    setPrevValue(Number(display));
    setOperator(op);
    setDisplay("0");
  }

  function calculate() {
    if (prevValue === null || operator === null) return;

    const current = Number(display);
    let result;

    switch (operator) {
      case "+": result = prevValue + current; break;
      case "-": result = prevValue - current; break;
      case "*": result = prevValue * current; break;
      case "/": result = current === 0 ? "Error" : prevValue / current; break;
      default: return;
    }

    setDisplay(String(result));
    setPrevValue(null);
    setOperator(null);
  }

  function clear() {
    setDisplay("0");
    setPrevValue(null);
    setOperator(null);
  }

  return (
    <div className="calculator">
      <h3>Basic Calculator</h3>
      <div className="display">{display}</div>

      <div className="buttons">
        <button onClick={clear}>C</button>
        <button onClick={() => handleOperator("/")}>÷</button>
        <button onClick={() => handleOperator("*")}>×</button>
        <button onClick={() => handleOperator("-")}>−</button>
        <button onClick={handleDecimal}>.</button>

        <button onClick={() => handleNumber("7")}>7</button>
        <button onClick={() => handleNumber("8")}>8</button>
        <button onClick={() => handleNumber("9")}>9</button>
        <button onClick={() => handleOperator("+")}>+</button>

        <button onClick={() => handleNumber("4")}>4</button>
        <button onClick={() => handleNumber("5")}>5</button>
        <button onClick={() => handleNumber("6")}>6</button>

        <button onClick={() => handleNumber("1")}>1</button>
        <button onClick={() => handleNumber("2")}>2</button>
        <button onClick={() => handleNumber("3")}>3</button>

        <button onClick={() => handleNumber("0")} className="zero">0</button>
        <button onClick={calculate}>=</button>
      </div>
    </div>
  );
}

export default Calculator;
