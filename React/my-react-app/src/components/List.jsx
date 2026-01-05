export default function List({ items }) {
  return (
    <ul className="list">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}