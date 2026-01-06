import Cards from "../components/Cards";

function Home({ cardsData }) {
  return (
    <>
      <h3>Dynamic Cards</h3>
      <Cards cards={cardsData} />
    </>
  );
}

export default Home;
