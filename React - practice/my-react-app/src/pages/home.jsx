import Cards from "../components/Cards";

function Home({ cardsData }) {
  return (
    <div className="car">
      <h3>Dynamic Cards</h3>
      <Cards cards={cardsData} />
    </div>
  );
}

export default Home;
