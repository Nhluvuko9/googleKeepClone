const inactiveForm = document.querySelector(".inactive-form");
const activeForm = document.querySelector(".active-form");
const noteTitle = document.querySelector(".note-title");
const closeBtn = document.querySelector(".close-btn");

inactiveForm.addEventListener("click", () => {
    inactiveForm.style.display = "none";
    activeForm.style.display = "flex";
    noteTitle.focus();
});

closeBtn.addEventListener("click", (e) => {
    e.preventDefault();
    closeActiveForm();
});

document.addEventListener("click", (e) => {
    const isClickInsideActive = activeForm.contains(e.target);
    const isClickInsideInactive = inactiveForm.contains(e.target);

    if (!isClickInsideActive && !isClickInsideInactive && activeForm.style.display === "flex") {
        closeActiveForm();
    }
});

function closeActiveForm() {
    activeForm.style.display = "none";
    inactiveForm.style.display = "flex";
    noteTitle.value = "";
    activeForm.querySelector("form").reset();
}