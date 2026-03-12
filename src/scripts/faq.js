const initAccordion = () => {
    const container = document.querySelector(".faq-list");
    if (!container) return;

    container.addEventListener("click", (e) => {
        const button = e.target.closest(".faq-question");
        if (!button) return;

        const faqItem = button.parentElement;
        if (!faqItem) return;

        const isExpanded = button.getAttribute("aria-expanded") === "true";

        if (!isExpanded) {
            // Cerrar otros
            container.querySelectorAll(".faq-item.active").forEach((item) => {
                if (item !== faqItem) {
                    item.classList.remove("active");
                    item.querySelector(".faq-question")?.setAttribute("aria-expanded", "false");
                }
            });
        }

        faqItem.classList.toggle("active");
        button.setAttribute("aria-expanded", (!isExpanded).toString());
    });
};

// Initialize on load and page transitions
document.addEventListener("astro:page-load", initAccordion);

// Fallback for initial load
if (document.readyState === "complete") {
    initAccordion();
} else {
    window.addEventListener("load", initAccordion);
}
