export function initBenefitsTabs() {
    const buttons = document.querySelectorAll('.tab-btn');
    const panes = document.querySelectorAll('.tab-pane');

    if (!buttons.length || !panes.length) return;

    buttons.forEach((btn) => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');

            // Update buttons
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update panes
            panes.forEach(p => {
                p.classList.remove('active');
                if (p.id === tabId) {
                    p.classList.add('active');
                }
            });
        });
    });
}
