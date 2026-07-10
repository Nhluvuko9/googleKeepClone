import { formArchiveBtn, settingsIcons } from "./state-dom.js";
import { addNote, closeActiveForm } from "./ui.js";


// ----------- NOTE TOOLTIP FUNCTIONS ------------------------

export function initTooltips() {
    const moreIcons = document.querySelectorAll(".more-tooltip");
    
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
            toggleOptions();
        });
    
        popovermenu.addEventListener("click", (e) => {
            e.stopPropagation();
        });
    
    });
    
    document.addEventListener("click", () => {
        closeAllOptions();
    });
    
    // Tooltip Archive Processing
    if (formArchiveBtn) {
        const parentTooltip = formArchiveBtn.closest(".tooltip");
        if (parentTooltip) {
            parentTooltip.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                addNote(true);
                closeActiveForm();
            });
        }
    }

    //------------ NAVBAR TOOLTIP FUNCTIONS ----------------------    
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
}

