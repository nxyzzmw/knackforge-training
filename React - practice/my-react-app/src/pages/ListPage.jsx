import List from "../components/List";
import Form from "../components/Form";

function ListPage({ items, onAdd }) {
  return (
    <div className="lis">
      <h3>Dynamic List</h3>
      <List items={items} />
      <Form onAdd={onAdd} />
    </div>
  );
}

export default ListPage;
