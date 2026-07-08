// Main script for handling form interactions
let noteList = []; 

const inactiveForm = document.querySelector(".inactive-form");
const activeForm = document.querySelector(".active-form");
const noteTitleInput = document.querySelector(".note-title");
const noteTextInput = document.querySelector(".active-form .note-text");
const closeBtn = document.querySelector(".close-btn");
const notesContainer = document.querySelector(".notes");

if (inactiveForm) {
    inactiveForm.addEventListener("click", () => {
        inactiveForm.style.display = "none";
        activeForm.style.display = "flex";
        noteTitleInput.focus();
    });
}

if (closeBtn) {
    closeBtn.addEventListener("click", (e) => {
        e.preventDefault();
        addNote();
        closeActiveForm();
    });
}

document.addEventListener("click", (e) => {
    if (!activeForm || !inactiveForm) return;

    const isFormOpen = activeForm.style.display === "flex";

    if (isFormOpen) {
        const clickedInsideActive = activeForm.contains(e.target);
        const clickedInsideInactive = inactiveForm.contains(e.target);

        if (!clickedInsideActive && !clickedInsideInactive) {
            addNote();
            closeActiveForm();
        }
    }
});

function closeActiveForm() {
    if (activeForm && inactiveForm) {
        activeForm.style.display = "none";
        inactiveForm.style.display = "flex";
        const innerForm = activeForm.querySelector("form");
        if (innerForm) innerForm.reset();
    }
};

// ---- Data Handling -----

// Create note from input
const createNote = (title, text) => {
    return { title: title, text: text };
};

// Load notes from local storage
const loadNotes = () => {
    noteList = JSON.parse(localStorage.getItem("notes")) || [];
    return noteList;
};

// Store note locally on computer
const storeNotes = (noteObject) => {
    noteList = loadNotes();

    noteList.push(noteObject);

    localStorage.setItem("notes", JSON.stringify(noteList));
};

const displayNotes = () => {
    if (!notesContainer) {
        console.error("Error: Could not find container element with class '.notes' in HTML.");
        return;
    } 

    notesContainer.innerHTML = "";
    noteList = loadNotes();

    noteList.forEach(note => {
        const noteCard = document.createElement("div");
        noteCard.classList.add("note");
        // if (note.color) {
        //     card.style.backgroundColor = note.color;
        // }

        // if (note.title) {
        //     const titleEl = document.createElement("h3");
        //     titleEl.classList.add("note-title");
        //     titleEl.innerText = note.title;
        //     card.appendChild(titleEl);
        // }

        // if (note.text) {
        //     const textEl = document.createElement("p");
        //     textEl.classList.add("note-text");
        //     textEl.innerText = note.text;
        //     card.appendChild(textEl);
        // }

        // <span class="material-symbols-outlined check-circle">check_circle</span>

        noteCard.innerHTML = `
         <div class="title">${note.title || ""}</div>
         <div class="text">${note.text || ""}</div>
          <div class="note-footer">
            <div class="tooltip">
              <span class="material-symbols-outlined hover small-icon">palette</span>
              <span class="tooltip-text">Change Color</span>
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
              <span class="material-symbols-outlined hover small-icon">archive</span>
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

const addNote = () => {
    if (!noteTitleInput || !noteTextInput) return;

    const title = noteTitleInput.value.trim();
    const text = noteTextInput.value.trim();

    if (title || text) {
        const noteObject = createNote(title, text);
        storeNotes(noteObject);
        displayNotes();
    }
};

loadNotes();
displayNotes();


// ---------------------------------------------------------------

// Sidebar toggle functionality
const sidebarText = document.querySelector(".sidebar-text");
const sidebarItem = document.querySelector(".sidebar-item");

// Navbar icon hover effect
const settingsIcons = document.querySelectorAll(".settings-tooltip");

const closeAllSettings = () => {
    settingsIcons.forEach((icons) => {
        const trigger = icons.querySelector(".settings-trigger");
        const popover = icons.querySelector(".settings-menu");

        popover.classList.remove("show");
        trigger.classList.remove("show");
        trigger.setAttribute("aria-expanded", "false");
    });
};

settingsIcons.forEach((icons) => {
    const menutrigger = icons.querySelector(".settings-trigger");
    const popovermenu = icons.querySelector(".settings-menu");

    if (!menutrigger || !popovermenu) return;
    
    const closeSettings = () => {
        popovermenu.classList.remove("show");
        menutrigger.classList.remove("show");
        menutrigger.setAttribute("aria-expanded", "false");
    };

    const openSettings = () => {
        closeAllSettings();
        popovermenu.classList.add("show");
        menutrigger.classList.add("show");
        menutrigger.setAttribute("aria-expanded", "true");
    };       
        
    const toggleSettings = () => {
        const isOpen = popovermenu.classList.contains("show");
        if (isOpen) {
            closeSettings();
        } else {
            openSettings();
        }
    };        
        
    menutrigger.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleSettings();
    });

    popovermenu.addEventListener("click", (e) => {
        e.stopPropagation();
    });

});

document.addEventListener("click", () => {
    closeAllSettings();
});

// Note


// Read user input 



// Display note
// const displayNotes = () => {

//     noteList.forEach(note => {
//         const container = document.createElement(".notes");
//         const title = document.createElement(".title");
//         const title = document.createElement(".text");

//         title.innerText = note.title;
//         text.innerText = note.text;
//         container.appendChild(title);
//         container.appendChild(text);

//         const noteListContainer = document.querySelector(".note");
//         noteListContainer.appendChild(container);
//     });

// };

// Create the Note [Full Process]
// const addNote = () => {
//     const [title, text] = activeForm();
//     const noteObject = createNote(title, text);
//     storeNotes(noteObject);
//     displayNotes();
// };
