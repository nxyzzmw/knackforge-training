import RandomUsername from "../components/RandomName";

function RandomPage({ username, onGenerate }) {
  return (
    <>
      <h3>React Username Generator</h3>
      <RandomUsername
        username={username}
        onGenerate={onGenerate}
      />
    </>
  );
}

export default RandomPage;
