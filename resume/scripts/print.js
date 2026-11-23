// Printable Resume Script: Print handler
document.addEventListener('DOMContentLoaded', () => {
    const printBtn = document.getElementById('print-resume-btn');
    if (printBtn) {
        printBtn.addEventListener('click', () => {
            window.print();
        });
    }
});
