import { memo } from "react";

type UserCardProps = {
  id: number;
  firstName: string;
  lastName: string;
  gender: string;
  age: number;
  image: string;
  onSelect: (id: number) => void;
};

const UserCard: React.FC<UserCardProps> = ({
  id,
  firstName,
  lastName,
  gender,
  age,
  image,
  onSelect,
}) => {
  return (
    <div style={styles.card}>
      <img src={image} style={styles.image} />
      <p style={styles.name}>
        {firstName} {lastName}
      </p>
      <p>Gender: {gender}</p>
      <p>Age: {age}</p>
      <button style={styles.button} onClick={() => onSelect(id)}>
        Select User
      </button>
    </div>
  );
};

export default memo(UserCard);

const styles = {
  card: {
    width: "220px",
    padding: "15px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    borderRadius: "10px",
  },
  image: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    marginBottom: "10px",
  },
  name: {
    fontWeight: "bold",
  },
  button: {
    marginTop: "10px",
    padding: "8px 12px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
  },
};
