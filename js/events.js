import {
    inactiveForm,
    activeForm,
    closeBtn,
    notesContainer,
    noteTitleInput,
    noteTextInput,
    checklistContainer,
    setActiveTab
} from "./state-dom.js";
import {
    addNote,
    displayNotes,
    openActiveForm,
    closeActiveForm
} from "./ui.js";
import { saveNotes, toggleArchive } from "./data.js";

// -------------- EVENT LISTENERS -------------------------------

export function initEvents() {
    if (inactiveForm) {
        inactiveForm.addEventListener("click", () => {
            inactiveForm.style.display = "none";
            if (activeForm) activeForm.style.display = "flex";
            if (noteTitleInput) noteTitleInput.focus();
        });
    }

    // Inactive Form Interactions
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

    // Close button Processing
    if (closeBtn) {
        closeBtn.addEventListener("click", (e) => {
            e.preventDefault();
            addNote(false);
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

    // Note grid Interactions
    if (notesContainer) {
        notesContainer.addEventListener("click", (e) => {
            const archiveBtnClick = e.target.closest(".archive-btn");
            if (archiveBtnClick) {
                const noteCard = archiveBtnClick.closest(".note");
                const noteId = noteCard?.dataset.id;

                if (noteId) {
                    toggleArchive(noteId);
                    displayNotes();
                }
            }
        });
    }
    
    // Checklist Handling
    if (checklistContainer) {
        checklistContainer.addEventListener("keydown", (e) => {
            if (e.target.classList.contains("list-item-input") && e.key === "Enter") {
                e.preventDefault();
                if (e.target.value.trim() !== "") {
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

}

// Deleting Notes Functionality 
export function initTrashFeature() {
    const sidebarItems = document.querySelectorAll(".sidebar-item");
    let trashButton = null;

    sidebarItems.forEach(item => {
        const textEl = item.querySelector(".sidebar-text");
        if (textEl && textEl.innerText.trim().toLowerCase() === "trash") {
            trashButton = item;
        }
    });

    if (trashButton) {
        trashButton.addEventListener("click", () => {
            const confirmDelete = confirm("Are you sure you want to permanently delete all notes?");
            if (confirmDelete) {
                saveNotes([]);
                displayNotes();
            }
        });
    }
}

// Sidebar View Transition
export function initSidebarNavigation() {
    const sidebarItems = document.querySelectorAll(".sidebar-item");

    sidebarItems.forEach(item => {
        item.addEventListener("click", () => {
            const textEl = item.querySelector(".sidebar-text");
            if (!textEl) return;

            const textValue = textEl.innerText.trim().toLowerCase();
            if (textValue === "notes") {
                setActiveTab("notes");
            } else if (textValue === "archive") {
                setActiveTab("archive");
            } else if (textValue === "trash") {
                setActiveTab("trash");
            }

            sidebarItems.forEach(sidebarItem => sidebarItem.classList.remove("active"));
            item.classList.add("active");
            displayNotes();
        });
    });
}
