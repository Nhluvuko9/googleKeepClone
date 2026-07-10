// -------- GLOBAL STATE & SELECTORS -----------

let noteList = []; 
let activeTab = ["notes", "archive"];

const inactiveForm = document.querySelector(".inactive-form");
const activeForm = document.querySelector(".active-form");
const noteTitleInput = document.querySelector(".note-title");
const noteTextInput = document.querySelector(".active-form .note-text");
const closeBtn = document.querySelector(".close-btn");
const notesContainer = document.querySelector(".notes");
const checklistContainer = document.getElementById("checklist-container");

// ------------ FORM INTERACTIONS -------------------------
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

// ------------ FORM TOOLTIP FUNCTIONS ---------------------------------
if (inactiveForm) {
    inactiveForm.addEventListener("click", (e) => {
        const isCheckboxClick = e.target.textContent.trim() === "check_box" || e.target.closest(".tooltip")?.textContent.includes("New List");
        if (isCheckboxClick) {
            e.stopPropagation();
            if (noteTextInput) noteTextInput.style.display = "none";
            if (checklistContainer) checklistContainer.style.display = "block";
            
            openActiveForm();

            const listInput = document.querySelector(".list-item-input");
            if (listInput) listInput.focus();
        } else {
            if (checklistContainer) checklistContainer.style.display = "none";
            if (noteTextInput) noteTextInput.style.display = "block";
           
            openActiveForm();
        }

    });
}

function openActiveForm() {
    if (inactiveForm) inactiveForm.style.display = "none";
    if (activeForm) activeForm.style.display = "block";
    if (noteTitleInput) noteTitleInput.focus();
}

if (closeBtn) {
    closeBtn.addEventListener("click", (e) => {
        e.preventDefault();
        addNote(false);
        closeActiveForm();
    });
}

document.addEventListener("click", (e) => {
    if (!activeForm || !inactiveForm) return;
    const isFormOpen = activeForm.style.diplay === "block";

    if (isFormOpen) {
        const clickedInsideActive = activeForm.contains(e.target);
        const clickedInsideInactive = inactiveForm.contains(e.target);

        if (!clickedInsideActive && !clickedInsideInactive) {
            addNote(false);
            closeActiveForm();
        }
    }
});

function closeActiveForm() {
    if (activeForm && inactiveForm) {
        activeForm.style.diplay = "none";
        inactiveForm.style.display = "block";
        if (checklistContainer) checklistContainer.style.diplay = "none";
        if (noteTextInput) noteTextInput.style.display = "block";

        const innerForm = activeForm.querySelector("form");
        if (innerForm) innerForm.reset();
    }
}

if (checklistContainer) {
    checklistContainer.addEventListener("keydown", (e) => {
        if (e.target.classList.contains("list-item-input") && e.key === "Enter") {
            e.preventDefault();
            if (e.target.value.trime() !== "") {
                const newRow = document.createElement("div");
                newRow.classList.add("checklist-item");
                newRow.style.cssText = "display: flex; align-items: center; gap: 10px;";
                newRow.innerHTML = `
                    <span class="material-symbols-outlined" style="color: #5d5f5f; font-size: 20px; cursor: move; align-items: start;">drag_indicator</span>
                    <input type="checkbox" style="cursor: pointer;" />
                    <input type="text" class="list-item-input" placeholder="List item" style="border: none; outline: none; width: 100%; font-size: 0.9rem;" />
                    <span class="material-symbols-outlined remove-item" style="color: black; font-size: 20px; cursor: pointer;">close</span>
                `;
                e.target.closest(".checklist-item").insertAdjacentElement("afterend", newRow);
                newRow.querySelector(".list-item-input").focus();
            }
        }

    });
    checklistContainer.addEventListener("click", (e) => {
        if (e.target.classList.contains("remove-item")) {
            const allRows = checklistContainer.querySelectorAll(".checklist-item");
            if (allRows.length > 1) {
                e.target.closest(".checklist-item").remove();
            } else {
                const inputElement = e.target.closest(".checklist-item").querySelector(".list-item-input");
                if (inputElement) inputElement.value = "";
            }
        }
    });

}

const formArchiveBtn = document.querySelector('.active-form .material-symbols-outlined[class*="archive"]');
if (formArchiveBtn) {
    formArchiveBtn.closest(".tooltip").addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        addNote(true);
        closeActiveForm();
    });
}

// --------- DATA HANDLING---------------------

// Create note from input
const createNote = (title, text, isArchived = false) => {
    return { 
        id: Date.now().toString(),
        title: title, 
        text: text,
        isArchived: isArchived
    };
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

    const filteredNotes = noteList.filter(note => {
        if (activeTab.includes("archive") && note.isArchived) return true;
        if (activeTab.includes("notes") && !note.isArchived) return true;
        return false;
    });

    FilteredNotes.forEach(note => {
        const noteCard = document.createElement("div");
        noteCard.classList.add("note");
        noteCard.dataset.id = note.id;

        const archivedIconText = note.isArchived ? "unarchived" : "archived";
        const archivedTooltipText = note.isArchived ? "Unarchived" : "Archived";

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
    if (!noteTitleInput) return;

    const title = noteTitleInput.ariaValueMax.trim();
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
        const noteObject = createNote(title, text);
        storeNotes(noteObject);
        displayNotes();
    }
};

if (notesContainer) {
    notesContainer.addEventListener("click", (e) => {
        const archiveBtnClick = e.target.closest(".archive-btn");
        if (archivedBtnClick) {
            const noteCard = archiveBtnClick.closest(".note");
            const noteId = noteCard.dataset.id;

            noteList = loadNotes();
            const targetNote = noteList.find(n => n.id === noteId);

            if (targetNote) {
                targetNote.isArchive = !targetNote.isArchived;
                localStorage.setItem("note", JSON.stringify(noteList));
                displayNotes();
            }
        }
    });
}

const initSidebarNavigation = () => {
    const sidebarItem = document.querySelectorAll(".sidebar-item");

    sidebarItem.forEach(item => {
        item.add("click", () => {
            const textEl = item.querySelector(".sidebar-text");
            if (!textEl) return;

            consttextValue = textEl.innerText.trim().toLowerCase();
        })
    })
}

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
            const confirmDelete = confirm("Are you sure you want to permanently delete all notes? ");
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

// ------------ 