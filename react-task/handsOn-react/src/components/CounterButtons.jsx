import { useDispatch } from "react-redux";
import { increment, decrement } from "../redux/counterSlice";

export default function CounterButtons() {
  const dispatch = useDispatch();

  return (
    <div>
      <button className="inc-btn" onClick={() => dispatch(increment())}>➕ Increment</button>
      <button className="dec-btn" onClick={() => dispatch(decrement())}>➖ Decrement</button>
    </div>
  );
}
