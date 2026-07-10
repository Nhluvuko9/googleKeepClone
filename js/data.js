// --------- DATA HANDLING---------------------
import { setNoteList } from "./state-dom.js";

// Create note from input
export function createNote(title, text, isArchived = false) {
    return {
        id: Date.now().toString(),
        title,
        text,
        isArchived
    };
}

// Load notes from local storage
export function  loadNotes() {
    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    setNoteList(notes);
    return notes;
};

// Save notes locally
export function saveNotes(notes) {
    setNoteList(notes);
    localStorage.setItem("notes", JSON.stringify(notes));
}

// Store note locally on computer
export function storeNotes(note) {
    const notes = loadNotes();
    notes.push(note);
    saveNotes(notes);
};

// Delete Note
export function deleteNote(id) {
    const notes = loadNotes();
    const filtered =
        notes.filter(note => note.id !== id);

    saveNotes(filtered);
}

// Toggle Archive
export function toggleArchive(id) {
    const notes = loadNotes();
    const note =
        notes.find(n => n.id === id);

    if (note) {
    note.isArchived = !note.isArchived;
    }
    saveNotes(notes);
}

