import RandomUsername from "../components/RandomName";

function RandomPage({ username, onGenerate }) {
  return (
    <div className="rand">
      <h3>React Username Generator</h3>
      <RandomUsername
        username={username}
        onGenerate={onGenerate}
      />
    </div>
  );
}

export default RandomPage;
