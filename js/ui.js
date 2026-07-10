import { createNote, loadNotes, storeNotes } from "./data.js";
import { 
    // notesList,
    activeTab,
    inactiveForm, 
    activeForm, 
    noteTitleInput, 
    noteTextInput, 
    checklistContainer,
    notesContainer 
} from "./state-dom.js";

// Add notes
export function addNote(shouldArchive = false) {
    if (!noteTitleInput) return;

    const title = noteTitleInput.value.trim();
    let text = "";

    if (checklistContainer && checklistContainer.style.display === 'block') {
        const listInputs = document.querySelectorAll('.list-item-input');
        const items = [];
        listInputs.forEach(input => {
            if (input.value.trim()) items.push(`☐ ${input.value.trim()}`);
        });
        text = items.join('\n');
    } else if (noteTextInput) {
        text = noteTextInput.value.trim();
    }

    if (title || text) {
        const noteObject = createNote(title, text, shouldArchive);
        storeNotes(noteObject);
        displayNotes();
    }
};

// Display notes
export function displayNotes() {
    if (!notesContainer) return;
    notesContainer.innerHTML = "";
    const notes = loadNotes();

    const filteredNotes = notes.filter(note => {
        if (activeTab === "archive") return note.isArchived === true;
        if (activeTab === "notes") return note.isArchived === false;
        return false;
    });

    filteredNotes.forEach(note => {
        const noteCard = document.createElement("div");
        noteCard.classList.add("note");
        noteCard.dataset.id = note.id;

        const archivedIconText = note.isArchived ? "unarchive" : "archive";

        // <span class="material-symbols-outlined check-circle">check_circle</span>

        noteCard.innerHTML = `
         <div class="title">${note.title || ""}</div>
         <div class="text">${note.text || ""}</div>
          <div class="note-footer">
            <div class="tooltip">
              <span class="material-symbols-outlined hover small-icon">palette</span>
              <span class="tooltip-text">Background options</span>
            </div>
            <div class="tooltip">
              <span class="material-symbols-outlined hover small-icon">add_alert</span>
              <span class="tooltip-text">Remind me</span>
            </div>
            <div class="tooltip">
              <span class="material-symbols-outlined hover small-icon">person_add</span>
              <span class="tooltip-text">Collaborator</span>
            </div>
            <div class="tooltip">
              <span class="material-symbols-outlined hover small-icon">image</span>
              <span class="tooltip-text">Add Image</span>
            </div>
            <div class="tooltip">
              <span class="material-symbols-outlined hover small-icon archive-btn">archive</span>
              <span class="tooltip-text">Archive</span>
            </div>
            <div class="tooltip">
              <span class="material-symbols-outlined hover small-icon">more_vert</span>
              <span class="tooltip-text">More</span>
            </div>
          </div>
        `;

        notesContainer.appendChild(noteCard);
    });
};

// ------------ OPEN / CLOSE FORM  MECHANICS  -------------------------------
export function openActiveForm() {
    if (inactiveForm) inactiveForm.style.display = "none";
    if (activeForm) activeForm.style.display = "flex";
    if (noteTitleInput) noteTitleInput.focus();
}

export function closeActiveForm() {
    if (activeForm && inactiveForm) {
        activeForm.style.display = "none";
        inactiveForm.style.display = "flex";
        if (checklistContainer) checklistContainer.style.display = "none";
        if (noteTextInput) noteTextInput.style.display = "flex";

        const innerForm = activeForm.querySelector("form");
        if (innerForm) innerForm.reset();
    }
}

