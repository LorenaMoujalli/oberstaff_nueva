document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById("videoModal") as HTMLElement | null;
    const btn = document.getElementById("openVideoModal") as HTMLAnchorElement | null;
    const closeBtn = document.querySelector(".close-modal") as HTMLSpanElement | null;
    const playerContainer = document.getElementById("player") as HTMLDivElement | null;

    // ID del video de YouTube: HPx5IsSYI8Q
    const videoId = "HPx5IsSYI8Q";

    if (!btn || !modal || !closeBtn || !playerContainer) return;
        // Abrir modal
        btn.addEventListener("click", function(e) {
            e.preventDefault();
            if (modal) modal.style.display = "block";
            // Insertamos el iframe al abrir para que empiece a reproducirse
            if (playerContainer) {
                playerContainer.innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
            }
            document.body.style.overflow = "hidden"; // Evita el scroll de fondo
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
