// Resume Script: Profile Photo dynamic detection and layout toggle
document.addEventListener('DOMContentLoaded', () => {
    const photoContainer = document.getElementById('resume-photo-container');
    const photoImg = document.getElementById('resume-profile-photo');

    if (photoContainer && photoImg) {
        const showPhoto = () => {
            if (photoImg.naturalWidth > 0 && photoImg.naturalHeight > 0) {
                photoContainer.style.display = 'flex';
            }
        };

        const hidePhoto = () => {
            photoContainer.style.display = 'none';
        };

        if (photoImg.complete) {
            if (photoImg.naturalWidth > 0 && photoImg.naturalHeight > 0) {
                showPhoto();
            } else {
                hidePhoto();
            }
        } else {
            photoImg.addEventListener('load', showPhoto);
            photoImg.addEventListener('error', hidePhoto);
        }
    }
});
