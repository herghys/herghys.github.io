// Resume Script: Profile Photo, 3-Layout Switcher, and Collapsible Controls
document.addEventListener('DOMContentLoaded', function () {
    initProfilePhoto();
    initLayoutSwitcher();
    initCollapsibleControls();
});

// 1. Profile Photo Auto-Detector
function initProfilePhoto() {
    var photoContainer = document.getElementById('resume-photo-container');
    var photoImg = document.getElementById('resume-profile-photo');

    if (photoContainer && photoImg) {
        var candidates = [
            '../assets/photo/profile.jpeg',
            '../assets/photo/profile.jpg',
            '../assets/photo/profile.png'
        ];
        var candidateIndex = 0;

        function tryNextPhoto() {
            if (candidateIndex < candidates.length) {
                photoImg.src = candidates[candidateIndex++];
            } else {
                photoContainer.style.display = 'none';
            }
        }

        photoImg.onload = function () {
            if (photoImg.naturalWidth > 0 && photoImg.naturalHeight > 0) {
                photoContainer.style.display = 'flex';
            } else {
                tryNextPhoto();
            }
        };

        photoImg.onerror = function () {
            tryNextPhoto();
        };

        if (photoImg.complete && photoImg.naturalWidth > 0 && photoImg.naturalHeight > 0) {
            photoContainer.style.display = 'flex';
        }
    }
}

// 2. 3-Layout Switcher (Sidebar, Single Column, Compact Grid)
function initLayoutSwitcher() {
    var container = document.getElementById('resume-container');
    var layoutBtns = document.querySelectorAll('.layout-btn');
    if (!container || !layoutBtns.length) return;

    var validLayouts = ['sidebar', 'single', 'compact'];

    function setLayout(layoutName, updateHistory) {
        if (!validLayouts.includes(layoutName)) layoutName = 'sidebar';

        // Update container classes
        validLayouts.forEach(function (l) {
            container.classList.remove('layout-' + l);
        });
        container.classList.add('layout-' + layoutName);

        // Update active button state
        layoutBtns.forEach(function (btn) {
            if (btn.getAttribute('data-layout') === layoutName) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Persist preference
        try {
            localStorage.setItem('resume_layout', layoutName);
        } catch (e) {}

        // Optionally update URL query param without page reload
        if (updateHistory && window.history && window.history.replaceState) {
            var url = new URL(window.location);
            url.searchParams.set('layout', layoutName);
            window.history.replaceState({}, '', url);
        }
    }

    // Attach click handlers
    layoutBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var targetLayout = btn.getAttribute('data-layout');
            setLayout(targetLayout, true);
        });
    });

    // Detect initial layout: 1. URL param -> 2. LocalStorage -> 3. Default (sidebar)
    var initialLayout = 'sidebar';
    try {
        var urlParams = new URLSearchParams(window.location.search);
        var paramLayout = urlParams.get('layout');
        if (paramLayout && validLayouts.includes(paramLayout)) {
            initialLayout = paramLayout;
        } else {
            var saved = localStorage.getItem('resume_layout');
            if (saved && validLayouts.includes(saved)) {
                initialLayout = saved;
            }
        }
    } catch (e) {}

    setLayout(initialLayout, false);
}

// 3. Collapsible Controls (Expand All / Collapse All)
function initCollapsibleControls() {
    var expandAllBtn = document.getElementById('expand-all-btn');
    var collapseAllBtn = document.getElementById('collapse-all-btn');
    var cards = document.querySelectorAll('details.collapsible-card');

    if (expandAllBtn) {
        expandAllBtn.addEventListener('click', function () {
            cards.forEach(function (card) {
                card.open = true;
            });
        });
    }

    if (collapseAllBtn) {
        collapseAllBtn.addEventListener('click', function () {
            cards.forEach(function (card) {
                card.open = false;
            });
        });
    }
}
