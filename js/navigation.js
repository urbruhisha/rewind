/* =========================
   Page Navigation
========================= */

const navButtons = document.querySelectorAll(".nav-item");
const pages = document.querySelectorAll(".page-section");


function showPage(pageId) {
    pages.forEach((page) => {
        page.hidden = page.id !== pageId;
    });

    navButtons.forEach((button) => {
        const isActive =
            button.dataset.page === pageId;

        button.classList.toggle(
            "active",
            isActive
        );

        if (isActive) {
            button.setAttribute(
                "aria-current",
                "page"
            );
        } else {
            button.removeAttribute(
                "aria-current"
            );
        }
    });
}


navButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const pageId = button.dataset.page;

        showPage(pageId);
    });
});


/* =========================
   Starting Page
========================= */

showPage("home-page");