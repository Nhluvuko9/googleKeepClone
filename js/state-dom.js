// -------- GLOBAL STATE ---------------------
export let noteList = [];
export let activeTab = "notes";

export function setNoteList(notes) {
    noteList = notes;
}
export function setActiveTab(tab) {
    activeTab = tab;
}

// ----------- DOM SELECTORS --------------------

// Forms
export const inactiveForm = document.querySelector(".inactive-form");
export const activeForm = document.querySelector(".active-form");
// Inputs
export const noteTitleInput = document.querySelector(".note-title");
export const noteTextInput = document.querySelector(".active-form .note-text");
// Buttons
export const closeBtn = document.querySelector(".close-btn");
export const formArchiveBtn = document.querySelector('.active-form .material-symbols-outlined[class*="archive"]');
// Containers
export const notesContainer = document.querySelector(".notes");
export const checklistContainer = document.getElementById("checklist-container");
// Navbar
export const settingsIcons = document.querySelectorAll(".settings-tooltip");


