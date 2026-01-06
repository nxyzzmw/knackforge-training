function RandomUsername({ username, onGenerate }) {
  return (
    <div style={{ textAlign: "center" }}>
      <p>Click to generate random username</p>

      <button onClick={onGenerate}>
        Generate
      </button>

      {username && (
        <p>
          Generated Username: <strong>{username}</strong>
        </p>
      )}
    </div>
  );
}

export default RandomUsername;
