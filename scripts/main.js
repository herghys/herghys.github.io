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

    var candidates = [
        'assets/photo/profile.jpeg',
        'assets/photo/profile.jpg',
        'assets/photo/profile.png'
    ];
    var candidateIndex = 0;

    function tryNextPhoto() {
        if (candidateIndex < candidates.length) {
            photoImg.src = candidates[candidateIndex++];
        } else {
            // All candidates failed -> clean "No Photo" layout
            photoWrapper.style.display = 'none';
            if (heroSection) heroSection.classList.remove('has-photo');
        }
    }

    photoImg.onload = function () {
        if (photoImg.naturalHeight !== 0) {
            photoWrapper.style.display = 'flex';
            if (heroSection) heroSection.classList.add('has-photo');
        } else {
            tryNextPhoto();
        }
    };

    photoImg.onerror = function () {
        tryNextPhoto();
    };

    if (photoImg.complete && photoImg.naturalHeight !== 0) {
        photoWrapper.style.display = 'flex';
        if (heroSection) heroSection.classList.add('has-photo');
    }
}

// Built-in featured projects dataset (prevents CORS failure when browsing via file:// protocol or offline)
var FEATURED_PROJECTS_FALLBACK = [
    {
        title: "Pong Evolved",
        badge: "Mobile Game",
        description: "Action arcade mobile game with infinite dynamic levels, retro-modern aesthetic, particle effects, and integrated Google AdMob monetization.",
        technologies: ["Unity3D", "C#", "Google AdMob"],
        link: "https://play.google.com/store/apps/details?id=com.HerghysStudio.PongEvolved",
        linkText: "View on Google Play &rarr;"
    },
    {
        title: "Tap!",
        badge: "Mobile Game",
        description: "Fast-paced reflex and tapping arcade game for mobile, featuring responsive input mechanics, custom audio, and Google AdMob integration.",
        technologies: ["Unity3D", "C#", "Google AdMob"],
        link: "https://play.google.com/store/apps/details?id=com.HerghysStudio.Game.Tap",
        linkText: "View on Google Play &rarr;"
    },
    {
        title: "Linjun Nail Art",
        badge: "Web Platform",
        description: "Curated online showcase, product catalog, and digital lookbook for Linjun Nail Art & Eyelashes handmade press-on nail studio.",
        technologies: ["PHP / Laravel", "JavaScript", "Responsive Web"],
        link: "https://linjunnailart.com/",
        linkText: "Visit Website &rarr;"
    },
    {
        title: "Cinda: Virtual Dress Up",
        badge: "Mobile / AI Game",
        description: "Commercial mobile game featuring 3D avatar generation from selfies, dress-up mechanics, asset bundle streaming, and real-world product rewards.",
        technologies: ["Unity3D", "Firebase Auth", "Google/Apple Sign-In"],
        link: "https://play.google.com/store/apps/details?id=com.newfemmewanitaindonesia.cinda",
        linkText: "View on Google Play &rarr;"
    },
    {
        title: "Duckie Bubble",
        badge: "Telegram WebApp",
        description: "Bubble shooter game integrated into Telegram Bot WebApps with custom REST API client and WebGL wrapper bridge.",
        technologies: ["Unity WebGL", "Telegram API", "JSLib / JS"],
        link: "https://t.me/DuckieLandBot/DuckieBubbles/",
        linkText: "Play on Telegram &rarr;"
    },
    {
        title: "Keystore Helper",
        badge: "Desktop Tool",
        description: "Windows desktop application (WPF) to streamline Android Keystore generation and extract SHA-1 and SHA-256 certificate fingerprints.",
        technologies: ["C#", "WPF", ".NET"],
        link: "https://github.com/herghys/Keystore-Helper",
        linkText: "View on GitHub &rarr;"
    }
];

function renderFeatured(items, container) {
    if (!container || !items || !items.length) return;
    container.innerHTML = items.map(function (item) {
        var techBadges = (item.technologies || []).map(function (t) {
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
}

function loadFeaturedProjects() {
    var container = document.getElementById('featured-grid');
    if (!container) return;

    // 1. Immediately render fallback data (zero delay, immune to CORS/file:// blocks)
    renderFeatured(FEATURED_PROJECTS_FALLBACK, container);

    // 2. If served via HTTP / HTTPS, dynamically load data/featured.json to get live updates
    if (window.location.protocol === 'http:' || window.location.protocol === 'https:') {
        fetch('data/featured.json')
            .then(function (res) {
                if (!res.ok) throw new Error('Status: ' + res.status);
                return res.json();
            })
            .then(function (items) {
                if (Array.isArray(items) && items.length > 0) {
                    renderFeatured(items, container);
                }
            })
            .catch(function (err) {
                // If fetch fails (e.g. network disconnect or offline), silent fallback is already rendered
                console.warn('Could not load data/featured.json dynamically; kept default data.', err);
            });
    }
}
