const initAccordion = () => {
    // Buscamos todas las preguntas directamente para evitar problemas de selectores de contenedor
    const questions = document.querySelectorAll(".faq-question");
    
    questions.forEach(question => {
        // Clonar para limpiar listeners previos si los hubiera
        const newQuestion = question.cloneNode(true);
        question.parentNode.replaceChild(newQuestion, question);

        newQuestion.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();

            const faqItem = newQuestion.closest(".faq-item");
            if (!faqItem) return;

            const isExpanded = faqItem.classList.contains("active");

            // Opcional: cerrar otros (buscamos en el mismo contenedor padre)
            const parentContainer = faqItem.parentElement;
            parentContainer.querySelectorAll(".faq-item.active").forEach((item) => {
                if (item !== faqItem) {
                    item.classList.remove("active");
                    item.querySelector(".faq-question")?.setAttribute("aria-expanded", "false");
                }
            });

            // Toggle actual
            faqItem.classList.toggle("active");
            newQuestion.setAttribute("aria-expanded", (!isExpanded).toString());
        });
    });
};

// Reinicializar en cambios de página de Astro
document.addEventListener("astro:page-load", initAccordion);

// Ejecución inicial
if (document.readyState === "complete") {
    initAccordion();
} else {
    window.addEventListener("load", initAccordion);
}
