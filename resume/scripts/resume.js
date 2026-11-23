// Resume Script: Profile Photo dynamic detection and layout toggle
document.addEventListener('DOMContentLoaded', () => {
    const photoContainer = document.getElementById('resume-photo-container');
    const photoImg = document.getElementById('resume-profile-photo');

    if (photoContainer && photoImg) {
        const candidates = [
            '../assets/photo/profile.jpeg',
            '../assets/photo/profile.jpg',
            '../assets/photo/profile.png'
        ];
        let candidateIndex = 0;

        const tryNextPhoto = () => {
            if (candidateIndex < candidates.length) {
                photoImg.src = candidates[candidateIndex++];
            } else {
                photoContainer.style.display = 'none';
            }
        };

        photoImg.onload = () => {
            if (photoImg.naturalWidth > 0 && photoImg.naturalHeight > 0) {
                photoContainer.style.display = 'flex';
            } else {
                tryNextPhoto();
            }
        };

        photoImg.onerror = () => {
            tryNextPhoto();
        };

        if (photoImg.complete && photoImg.naturalWidth > 0 && photoImg.naturalHeight > 0) {
            photoContainer.style.display = 'flex';
        }
    }
});
