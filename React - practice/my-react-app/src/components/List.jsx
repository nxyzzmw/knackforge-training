function List({ items }) {
  if (items.length === 0) {
    return <p style={{ textAlign: "center" }}>No items found.</p>;
  }

  return (
    <ul className="list">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}

export default List;
