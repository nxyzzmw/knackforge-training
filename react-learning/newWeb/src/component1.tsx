import { useStore } from "./store/useStore";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

type Post = {
  id: number;
  firstName: string;
  lastName: string;
  gender: string;
  age: number;
  image: string;
};

const App: React.FC = () => {
  const { count, increase, decrease } = useStore();

  const [showUsers, setShowUsers] = useState(false);

  const fetchPosts = async (): Promise<Post[]> => {
    const res = await fetch("https://dummyjson.com/users");

    if (!res.ok) throw new Error("error");

    const data = await res.json();

    return data.users;
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
    enabled: false, 
  });

  const handleClick = () => {
    setShowUsers(true);
    refetch();
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Users List</h1>

      {/* Fetch Button */}
      <button style={styles.fetchButton} onClick={handleClick}>
        Get Users
      </button>

      {isLoading && <h2>Loading...</h2>}

      {error && <h2>Error occurred</h2>}

      {/* User Cards */}
      <div style={styles.cardContainer}>
        {showUsers &&
          data?.map((post) => (
            <div key={post.id} style={styles.card}>
              
              {/* Image */}
              <img
                src={post.image}
                style={styles.image}
              />

              <p style={styles.name}>
                {post.firstName} {post.lastName}
              </p>

              <p>Gender: {post.gender}</p>

              <p>Age: {post.age}</p>

            </div>
          ))}
      </div>

      {/* Counter */}
      <h1 style={styles.counter}>{count}</h1>

      <button style={styles.button} onClick={increase}>
        Increase
      </button>

      <button style={styles.button} onClick={decrease}>
        Decrease
      </button>
    </div>
  );
};

export default App;

const styles = {

  container: {
    padding: "20px",
    textAlign: "center" as const,
  },

  title: {
    marginBottom: "20px",
  },

  fetchButton: {
    padding: "10px 20px",
    marginBottom: "20px",
    backgroundColor: "green",
    color: "white",
    border: "none",
    cursor: "pointer",
  },

  cardContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    justifyContent: "center",
  },

  card: {
    width: "200px",
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

  counter: {
    marginTop: "30px",
  },

  button: {
    padding: "10px",
    margin: "10px",
  },

};