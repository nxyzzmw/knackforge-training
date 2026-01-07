function Note({ notes , del,edit }) {

   
  return (
    <div className="container mt-4">
      <div className="row g-4">
        {notes.map((note, index) => (
          <div key={index} className="col-12 col-md-6 col-lg-4">
            <div className="note-card">
<p>
    
  <span>{note}</span>
                  <button
                  className="b1"
                  onClick={() => del(index)}
                >
<strong>X</strong></button>
  <button className="b2"   onClick={() =>edit(index)}>✏️</button>


</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Note;
