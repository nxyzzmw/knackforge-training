export default function Cards({ cards }) {
  return (
    <div className="container">
      <div className="row g-5">
        {cards.map((card, index) => (
          <div className="col-6 col-md-6 col-lg-4 mb-4" key={index}>
            <div className="card h-100">
              <div className="card-body text-center">
                <h5 className="card-title">{card.title}</h5>
                <button className="btn btn-primary">View More</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
