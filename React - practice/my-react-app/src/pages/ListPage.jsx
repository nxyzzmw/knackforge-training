import List from "../components/List";
import Form from "../components/Form";

function ListPage({ items, onAdd }) {
  return (
    <>
      <h3>Dynamic List</h3>
      <List items={items} />
      <Form onAdd={onAdd} />
    </>
  );
}

export default ListPage;
