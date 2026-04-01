document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById("videoTestimonialModal") as HTMLElement | null;
    const btns = document.querySelectorAll(".open-testimonial-video");
    const closeBtn = document.querySelector(".close-testimonial") as HTMLSpanElement | null;
    const playerContainer = document.getElementById("playerTestimonial") as HTMLDivElement | null;

    if (!modal || !closeBtn || !playerContainer) return;

    // Loop through all testimonial buttons to attach click events
    btns.forEach(btn => {
        btn.addEventListener("click", function(this: HTMLAnchorElement, e) {
            e.preventDefault();
            
            const videoId = this.getAttribute("data-video-id");
            if (!videoId) return;

            if (modal) modal.style.display = "block";
            // Insertamos el iframe dinámicamente según el ID del botón cliqueado
            if (playerContainer) {
                playerContainer.innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
            }
            document.body.style.overflow = "hidden"; // Evita el scroll de fondo
        });
    });

    // Cerrar modal
    function closeModal() {
        if (modal) modal.style.display = "none";
        if (playerContainer) playerContainer.innerHTML = ""; // Limpiamos el iframe para detener el video
        document.body.style.overflow = "auto"; // Habilita el scroll de nuevo
    }

    closeBtn.addEventListener("click", closeModal);

    // Cerrar si hace clic fuera del video
    window.addEventListener("click", function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });
});
