// Resume Script: Profile Photo and Section Collapsible Controls
document.addEventListener('DOMContentLoaded', function () {
    initProfilePhoto();
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

// 2. Collapsible Controls (Expand All / Collapse All)
function initCollapsibleControls() {
    var expandAllBtn = document.getElementById('expand-all-btn');
    var collapseAllBtn = document.getElementById('collapse-all-btn');

    function getAllDetails() {
        return document.querySelectorAll('details.resume-section, details.role-card');
    }

    if (expandAllBtn) {
        expandAllBtn.addEventListener('click', function () {
            getAllDetails().forEach(function (el) {
                el.open = true;
            });
        });
    }

    if (collapseAllBtn) {
        collapseAllBtn.addEventListener('click', function () {
            getAllDetails().forEach(function (el) {
                el.open = false;
            });
        });
    }

    // Auto-open target section when nav link or anchor is clicked
    function openTargetFromHash() {
        if (!window.location.hash) return;
        try {
            var target = document.querySelector(window.location.hash);
            if (target) {
                if (target.tagName === 'DETAILS') {
                    target.open = true;
                }
                var parentDetails = target.closest('details');
                if (parentDetails) {
                    parentDetails.open = true;
                }
            }
        } catch (e) {}
    }

    window.addEventListener('hashchange', openTargetFromHash);
    openTargetFromHash();
}
