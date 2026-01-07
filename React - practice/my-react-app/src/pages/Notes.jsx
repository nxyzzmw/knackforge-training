import { useState } from "react";
import Note from "../components/Note";

function Notes() {
  const [notes, setNotes] = useState("");
  const [allNotes, setAllNotes] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  function addNote() {
    if (notes.trim() === "") return;

    // ✏️ EDIT MODE
    if (editIndex !== null) {
      const updatedNotes = allNotes.map((note, index) =>
        index === editIndex ? notes : note
      );
      setAllNotes(updatedNotes);
      setEditIndex(null);
    }
    // ➕ ADD MODE
    else {
      setAllNotes([...allNotes, notes]);
    }

    setNotes("");
  }

  function del(indexToDelete) {
    const updatedNotes = allNotes.filter(
      (note, index) => index !== indexToDelete
    );
    setAllNotes(updatedNotes);
  }

  function edit(indexToEdit) {
    setNotes(allNotes[indexToEdit]); 
    setEditIndex(indexToEdit);        
  }

  return (
    <div className="note-page">
      <h3>Note Tracker</h3>

      <textarea
        placeholder="Write your note here..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      <br />
      <button onClick={addNote}>
        {editIndex !== null ? "Update Note" : "Add Note"}
      </button>

      <Note notes={allNotes} del={del} edit={edit} />
    </div>
  );
}

export default Notes;
