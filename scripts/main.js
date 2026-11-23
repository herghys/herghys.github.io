document.addEventListener('DOMContentLoaded', function () {
    // 1. Photo Auto-Detector (Dynamic "With Photo" vs "No Photo" Layout)
    initProfilePhoto();

    // 2. Dynamic Featured Projects Loader
    loadFeaturedProjects();
});

function initProfilePhoto() {
    var photoImg = document.getElementById('profile-photo');
    var photoWrapper = document.getElementById('profile-photo-wrapper');
    var heroSection = document.getElementById('hero-section');

    if (!photoImg || !photoWrapper) return;

    // Pre-check if image is already cached/complete
    if (photoImg.complete && photoImg.naturalHeight !== 0) {
        photoWrapper.style.display = 'flex';
        if (heroSection) heroSection.classList.add('has-photo');
    }

    photoImg.onload = function () {
        if (photoImg.naturalHeight !== 0) {
            photoWrapper.style.display = 'flex';
            if (heroSection) heroSection.classList.add('has-photo');
        }
    };

    photoImg.onerror = function () {
        // Hide wrapper and keep "No Photo" layout
        photoWrapper.style.display = 'none';
        if (heroSection) heroSection.classList.remove('has-photo');
    };
}

function loadFeaturedProjects() {
    var container = document.getElementById('featured-grid');
    if (!container) return;

    fetch('data/featured.json')
        .then(function (res) {
            if (!res.ok) throw new Error('Network error loading featured projects');
            return res.json();
        })
        .then(function (items) {
            container.innerHTML = items.map(function (item) {
                var techBadges = item.technologies.map(function (t) {
                    return '<span class="tech-pill">' + t + '</span>';
                }).join('');

                return '<div class="project-card">' +
                    '<div>' +
                        '<span class="project-badge">' + (item.badge || 'Project') + '</span>' +
                        '<h3>' + item.title + '</h3>' +
                        '<p class="project-desc">' + item.description + '</p>' +
                    '</div>' +
                    '<div>' +
                        '<div class="project-tech">' + techBadges + '</div>' +
                        '<a class="project-link" href="' + item.link + '" target="_blank" rel="noopener noreferrer">' +
                            (item.linkText || 'View Project &rarr;') +
                        '</a>' +
                    '</div>' +
                '</div>';
            }).join('');
        })
        .catch(function (err) {
            console.error('Featured projects loader:', err);
            container.innerHTML = '<div style="color: #ff79c6;">Failed to load featured projects. Explore the full catalog in <a href="portfolio/">Portfolio</a>.</div>';
        });
}
