import { loadNotes } from "./data.js";
import { displayNotes } from "./ui.js";
import {
    initEvents,
    initSidebarNavigation,
    initTrashFeature
} from "./events.js";
import { initTooltips } from "./tooltips.js";

function initApp() {
    loadNotes();
    displayNotes();
    initEvents();
    initTooltips();
    initSidebarNavigation();
    initTrashFeature();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initApp);
} else {
    initApp();
}