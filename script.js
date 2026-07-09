// -------- GLOBAL STATE & SELECTORS -----------

let noteList = []; 

const inactiveForm = document.querySelector(".inactive-form");
const activeForm = document.querySelector(".active-form");
const noteTitleInput = document.querySelector(".note-title");
const noteTextInput = document.querySelector(".active-form .note-text");
const closeBtn = document.querySelector(".close-btn");
const notesContainer = document.querySelector(".notes");

// --------- FORM INTERACTIONS -----------------
if (inactiveForm) {
    inactiveForm.addEventListener("click", () => {
        inactiveForm.style.display = "none";
        if (activeForm) activeForm.style.display = "flex";
        if (noteTitleInput) noteTitleInput.focus();
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

// --------- DATA Handling ---------------------

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
    if (!notesContainer) return;

    notesContainer.innerHTML = "";
    noteList = loadNotes();

    noteList.forEach(note => {
        const noteCard = document.createElement("div");
        noteCard.classList.add("note");

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

// --------- Deleting notes functionality ------------------
const initTrashFeature = () => {
    const sidebarItem = document.querySelectorAll(".sidebar-item");
    let trashButton = null;
    
    sidebarItem.forEach(item => {
        const textEl = item.querySelector(".sidebar-text");
        if (textEl && textEl.innerText.trim().toLowerCase() === "trash") {
            trashButton = item;
        }
    });
    
    if (trashButton) {
        trashButton.addEventListener("click", () => {
            const confirmDelete = confirm("Are yu sure you want to permanently delete all notes? ");
            if (confirmDelete) {
                noteList = [];
                localStorage.setItem("notes", JSON.stringify(noteList));
                displayNotes();
            }
        });
    }
}

// ------------ APP STARTUP -----------------------------------
loadNotes();
displayNotes();
initTrashFeature();

// ------------ SIDEBAR TOGGLE FUNCTIONALITY ------------------

const sidebarText = document.querySelector(".sidebar-text");
const sidebarItem = document.querySelector(".sidebar-item");

//------------ NAVBAR TOOLTIP FUNCTIONS ----------------------
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

// ----------- NOTE TOOLTIP FUNCTIONS ------------------------
const moreIcons = document.querySelector(".more-tooltip");

const closeAllOptions = () => {
    moreIcons.forEach((icons) => {
        const trigger = icons.querySelector(".more-trigger");
        const popover = icons.querySelector(".more-menu");

        popover.classList.remove("show");
        trigger.classList.remove("show");
        trigger.setAttribute("aria-expanded", "false");
    });
};

moreIcons.forEach((icons) => {
    const menutrigger = icons.querySelector(".more-trigger");
    const popovermenu = icons.querySelector(".more-menu");

    if (!menutrigger || !popovermenu) return;
    
    const closeOptions = () => {
        popovermenu.classList.remove("show");
        menutrigger.classList.remove("show");
        menutrigger.setAttribute("aria-expanded", "false");
    };

    const openOptions = () => {
        closeAllOptions();
        popovermenu.classList.add("show");
        menutrigger.classList.add("show");
        menutrigger.setAttribute("aria-expanded", "true");
    };       
        
    const toggleOptions = () => {
        const isOpen = popovermenu.classList.contains("show");
        if (isOpen) {
            closeOptions();
        } else {
            openOptions();
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
    closeAllOptions();
});