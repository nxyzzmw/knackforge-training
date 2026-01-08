import { useState, useEffect } from "react";
import Note from "../components/Note";

function Notes() {
  // ✅ Always read user, but DO NOT return before hooks
  const user = JSON.parse(localStorage.getItem("user"));
  const username = user?.username || "guest";
  const storageKey = `notes_${username}`;

  const [notes, setNotes] = useState("");
  const [allNotes, setAllNotes] = useState(() => {
    const savedNotes = localStorage.getItem(storageKey);
    return savedNotes ? JSON.parse(savedNotes) : [];
  });
  const [editIndex, setEditIndex] = useState(null);


  // 💾 Persist notes on every change
  useEffect(() => {
    if (username !== "guest") {
      localStorage.setItem(storageKey, JSON.stringify(allNotes));
    }
  }, [allNotes, storageKey, username]);

  function addNote() {
    if (notes.trim() === "") return;

    if (editIndex !== null) {
      const updatedNotes = allNotes.map((note, index) =>
        index === editIndex ? notes : note
      );
      setAllNotes(updatedNotes);
      setEditIndex(null);
    } else {
      setAllNotes([...allNotes, notes]);
    }

    setNotes("");
  }

  function del(indexToDelete) {
    setAllNotes(allNotes.filter((_, index) => index !== indexToDelete));
  }

  function edit(indexToEdit) {
    setNotes(allNotes[indexToEdit]);
    setEditIndex(indexToEdit);
  }
function pin(indexToPin) {
  const pinnedNote = allNotes[indexToPin];
  const remainingNotes = allNotes.filter((_, i) => i !== indexToPin);
  setAllNotes([pinnedNote, ...remainingNotes]);
}
  return (
    <div className="note-page">
      <h3>{username}'s Notes</h3>

      <textarea
        placeholder="Write your note here..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)} 
      />

      <br />
      <button onClick={addNote}>
        {editIndex !== null ? "Update Note" : "Add Note"}
      </button>

      <Note notes={allNotes} del={del} edit={edit}pin={pin}/>
    </div>
  );
}

export default Notes;
