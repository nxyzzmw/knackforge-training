function Cards({ cards }) {
  return (
    <div className="container">
      <div className="row g-4">
        {cards.map((card, index) => (
          <div className="col-12 col-md-6 col-lg-4" key={index}>
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title">{card.title}</h5>
                <button className="btn btn-primary">
                  View More
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Cards;
