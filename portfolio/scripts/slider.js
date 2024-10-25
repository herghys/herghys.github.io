function openFullscreen(src) {
    const modal = document.getElementById("fullscreen-modal");
    const modalImg = document.getElementById("fullscreen-image");

    modal.style.display = "block";
    modalImg.src = src;

    const closeBtn = document.getElementsByClassName("close")[0];
    closeBtn.onclick = function() {
        modal.style.display = "none";
    }
}
