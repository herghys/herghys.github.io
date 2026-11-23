/**
 * Portfolio Loader & Interactive Showcase Engine
 * Helmi Arghya Santosa (Herghys) - Unity Game Developer & Software Engineer
 */

(function () {
    'use strict';

    // Extension map for projects with screenshot directories (prevents 404 console errors)
    const EXT_MAP = {
        'cinda': 'png',
        'duckybubble': 'jpg',
        'duckypop': 'png',
        'eksponengame': 'png',
        'fortunehunter': 'jpg',
        'logibot': 'png',
        'periodictable': 'png',
        'simurda': 'jpg'
    };

    let allProjects = [];
    let currentCategory = 'all';
    let searchQuery = '';

    // Lightbox modal state
    let activeGallery = {
        title: '',
        images: [],
        currentIndex: 0
    };

    /**
     * Categorize a project dynamically based on its data
     */
    function getProjectCategories(project) {
        const categories = ['all'];
        const techStr = (project.technologies || []).join(' ');
        const fullText = `${project.title} ${project.description || ''} ${techStr}`.toLowerCase();

        // Project Type
        if (project.projectType == 2) {
            categories.push('commercial');
        } else if (project.projectType == 1) {
            categories.push('opensource');
        }

        // AR / VR & Simulation
        if (/\b(ar|vr|vuforia|augmented reality|virtual reality|simulation|simulator|avatar)\b/i.test(fullText)) {
            categories.push('ar-vr-sim');
        }

        // Tools & Utilities
        if (/\b(tool|wpf|winforms|extension|helper|comparer|monitoring|module|linq|utility)\b/i.test(fullText)) {
            categories.push('tools');
        }

        // Games & Interactive
        if (/\b(game|arcade|dress up|puzzle|racer|admob|bubble|lands|runner)\b/i.test(fullText) ||
            ((project.technologies || []).includes('Unity3D') && !categories.includes('tools'))) {
            categories.push('games');
        }

        return categories;
    }

    /**
     * Format timeline display
     */
    function formatTimeline(projectTime) {
        if (!projectTime) return '';
        const start = projectTime.startDate || '';
        const end = projectTime.currentlyWorking ? 'Present' : (projectTime.endDate || '');
        if (start && end) return `${start} &ndash; ${end}`;
        return start || end || '';
    }

    /**
     * Escape HTML helper
     */
    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    /**
     * Render a single project card element
     */
    function createProjectCard(project, projectIndex) {
        const card = document.createElement('article');
        card.className = 'project-card';
        card.setAttribute('data-index', projectIndex);

        const categories = getProjectCategories(project);
        card.setAttribute('data-categories', categories.join(' '));

        const isCommercial = project.projectType == 2;
        const timeline = formatTimeline(project.projectTime);

        // --- Screenshots Media Block ---
        let mediaHtml = '';
        const hasScreenshots = project.screenshot &&
            project.screenshot.path &&
            Array.isArray(project.screenshot.images) &&
            project.screenshot.images.length > 0;

        if (hasScreenshots) {
            const folder = project.screenshot.path;
            const ext = EXT_MAP[folder] || 'png';
            const images = project.screenshot.images;
            const firstImgSrc = `assets/portfolios/${folder}/${images[0]}.${ext}`;
            const totalCount = images.length;

            // Generate thumbnail strip (up to 5 thumbnails)
            const maxThumbs = Math.min(5, totalCount);
            let thumbsHtml = '';
            for (let i = 0; i < maxThumbs; i++) {
                const thumbSrc = `assets/portfolios/${folder}/${images[i]}.${ext}`;
                thumbsHtml += `
                    <button type="button" class="thumb-btn ${i === 0 ? 'active' : ''}" data-folder="${folder}" data-ext="${ext}" data-img-idx="${i}" data-proj-idx="${projectIndex}" aria-label="View screenshot ${i + 1}">
                        <img src="${thumbSrc}" alt="${escapeHtml(project.title)} preview ${i + 1}" loading="lazy">
                    </button>
                `;
            }
            if (totalCount > maxThumbs) {
                thumbsHtml += `
                    <button type="button" class="thumb-btn thumb-more" data-folder="${folder}" data-ext="${ext}" data-img-idx="${maxThumbs}" data-proj-idx="${projectIndex}" aria-label="View all ${totalCount} screenshots">
                        <span>+${totalCount - maxThumbs}</span>
                    </button>
                `;
            }

            mediaHtml = `
                <div class="card-media">
                    <div class="media-preview" data-proj-idx="${projectIndex}" data-img-idx="0">
                        <img src="${firstImgSrc}" alt="${escapeHtml(project.title)} showcase" class="hero-preview-img" loading="lazy">
                        <div class="media-overlay">
                            <span class="media-zoom-hint"><i class="fas fa-search-plus"></i> View Gallery</span>
                        </div>
                        <span class="gallery-badge"><i class="fas fa-camera"></i> ${totalCount} Shots</span>
                    </div>
                    <div class="thumb-strip">
                        ${thumbsHtml}
                    </div>
                </div>
            `;
        }

        // --- Card Header ---
        const typeBadge = isCommercial
            ? `<span class="badge badge-commercial"><i class="fas fa-briefcase"></i> Commercial</span>`
            : `<span class="badge badge-oss"><i class="fas fa-code-branch"></i> Open Source</span>`;

        const timelineBadge = timeline
            ? `<span class="timeline-badge"><i class="far fa-calendar-alt"></i> ${timeline}</span>`
            : '';

        const headerHtml = `
            <div class="card-meta">
                ${typeBadge}
                ${timelineBadge}
            </div>
            <h2 class="card-title">${escapeHtml(project.title)}</h2>
        `;

        // --- Tasks / Contributions ---
        let tasksHtml = '';
        if (project.tasks && project.tasks.length > 0) {
            tasksHtml = `
                <div class="card-section">
                    <div class="section-label">Key Engineering Contributions</div>
                    <ul class="task-list">
                        ${project.tasks.map(t => `<li>${escapeHtml(t)}</li>`).join('')}
                    </ul>
                </div>
            `;
        }

        // --- Tech Stack ---
        let techHtml = '';
        if (project.technologies && project.technologies.length > 0) {
            techHtml = `
                <div class="card-section">
                    <div class="section-label">Tech Stack</div>
                    <div class="tech-pills">
                        ${project.technologies.map(t => `<span class="tech-pill">${escapeHtml(t)}</span>`).join('')}
                    </div>
                </div>
            `;
        }

        // --- Action Buttons ---
        let repoActionHtml = '';
        if (project.repo && project.repo.link && !project.repo.isPrivate) {
            repoActionHtml = `
                <a href="${escapeHtml(project.repo.link)}" target="_blank" rel="noopener noreferrer" class="btn-card btn-outline">
                    <i class="fab fa-github"></i> Repository
                </a>
            `;
        } else if (isCommercial) {
            repoActionHtml = `
                <span class="badge-private" title="Client / Enterprise proprietary codebase under NDA">
                    <i class="fas fa-shield-alt"></i> Client Confidential
                </span>
            `;
        } else {
            repoActionHtml = `
                <span class="badge-private" title="Private source repository">
                    <i class="fas fa-lock"></i> Private Source
                </span>
            `;
        }

        let storeActionHtml = '';
        if (project.store && project.store.isAvailable && project.store.link) {
            let storeText = project.store.buttonText || 'Live Demo';
            let storeIcon = 'fas fa-external-link-alt';

            const linkLower = project.store.link.toLowerCase();
            if (linkLower.includes('play.google.com')) {
                storeText = 'Google Play';
                storeIcon = 'fab fa-google-play';
            } else if (linkLower.includes('t.me')) {
                storeText = 'Telegram App';
                storeIcon = 'fab fa-telegram';
            } else if (linkLower.startsWith('http')) {
                if (!project.store.buttonText) {
                    storeText = 'Live Showcase';
                }
                storeIcon = 'fas fa-globe';
            }

            storeActionHtml = `
                <a href="${escapeHtml(project.store.link)}" target="_blank" rel="noopener noreferrer" class="btn-card btn-primary">
                    <i class="${storeIcon}"></i> ${escapeHtml(storeText)}
                </a>
            `;
        }

        const actionsHtml = `
            <div class="card-actions">
                ${repoActionHtml}
                ${storeActionHtml}
            </div>
        `;

        // Assemble card
        card.innerHTML = `
            ${mediaHtml}
            <div class="card-body">
                ${headerHtml}
                <p class="card-desc">${escapeHtml(project.description)}</p>
                ${tasksHtml}
                ${techHtml}
                ${actionsHtml}
            </div>
        `;

        return card;
    }

    /**
     * Filter projects based on current category and search query
     */
    function filterProjects() {
        const grid = document.getElementById('projects-grid');
        const emptyState = document.getElementById('empty-state');
        const visibleCountEl = document.getElementById('visible-count');
        if (!grid) return;

        const cards = grid.querySelectorAll('.project-card');
        let visibleCount = 0;
        const query = searchQuery.trim().toLowerCase();

        cards.forEach(card => {
            const index = parseInt(card.getAttribute('data-index'), 10);
            const project = allProjects[index];
            if (!project) return;

            const categories = getProjectCategories(project);
            const matchesCategory = currentCategory === 'all' || categories.includes(currentCategory);

            let matchesSearch = true;
            if (query) {
                const title = (project.title || '').toLowerCase();
                const desc = (project.description || '').toLowerCase();
                const tech = (project.technologies || []).join(' ').toLowerCase();
                const tasks = (project.tasks || []).join(' ').toLowerCase();
                matchesSearch = title.includes(query) ||
                    desc.includes(query) ||
                    tech.includes(query) ||
                    tasks.includes(query);
            }

            if (matchesCategory && matchesSearch) {
                card.style.display = '';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        if (visibleCountEl) {
            visibleCountEl.textContent = visibleCount;
        }

        if (emptyState) {
            emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
        }
    }

    /**
     * Render the whole project list into the grid
     */
    function renderProjectGrid(projects) {
        allProjects = projects;
        const grid = document.getElementById('projects-grid');
        if (!grid) return;

        grid.innerHTML = '';
        projects.forEach((proj, idx) => {
            const cardEl = createProjectCard(proj, idx);
            grid.appendChild(cardEl);
        });

        setupCardInteractions();
        updateCategoryCounts();
        filterProjects();
    }

    /**
     * Compute and display live counts in filter pill badges
     */
    function updateCategoryCounts() {
        const counts = {
            'all': allProjects.length,
            'commercial': 0,
            'games': 0,
            'ar-vr-sim': 0,
            'tools': 0,
            'opensource': 0
        };

        allProjects.forEach(p => {
            const cats = getProjectCategories(p);
            cats.forEach(c => {
                if (counts[c] !== undefined && c !== 'all') {
                    counts[c]++;
                }
            });
        });

        const pills = document.querySelectorAll('.filter-pill');
        pills.forEach(pill => {
            const cat = pill.getAttribute('data-filter');
            const badge = pill.querySelector('.count-badge');
            if (badge && counts[cat] !== undefined) {
                badge.textContent = counts[cat];
            }
        });
    }

    /**
     * Setup event listeners for thumbnail swaps and lightbox triggers
     */
    function setupCardInteractions() {
        const grid = document.getElementById('projects-grid');
        if (!grid) return;

        // Thumbnail click / hover swapping
        grid.addEventListener('click', function (e) {
            // Thumbnail button clicked
            const thumbBtn = e.target.closest('.thumb-btn');
            if (thumbBtn) {
                e.stopPropagation();
                const projIdx = parseInt(thumbBtn.getAttribute('data-proj-idx'), 10);
                const imgIdx = parseInt(thumbBtn.getAttribute('data-img-idx'), 10);
                const folder = thumbBtn.getAttribute('data-folder');
                const ext = thumbBtn.getAttribute('data-ext');

                const card = thumbBtn.closest('.project-card');
                if (card) {
                    const heroImg = card.querySelector('.hero-preview-img');
                    const mediaPreview = card.querySelector('.media-preview');
                    if (heroImg) {
                        heroImg.src = `assets/portfolios/${folder}/${allProjects[projIdx].screenshot.images[imgIdx]}.${ext}`;
                    }
                    if (mediaPreview) {
                        mediaPreview.setAttribute('data-img-idx', imgIdx);
                    }
                    // Update active thumb
                    card.querySelectorAll('.thumb-btn').forEach(btn => btn.classList.remove('active'));
                    thumbBtn.classList.add('active');
                }
                return;
            }

            // Main preview clicked -> open lightbox
            const mediaPreview = e.target.closest('.media-preview');
            if (mediaPreview) {
                const projIdx = parseInt(mediaPreview.getAttribute('data-proj-idx'), 10);
                const imgIdx = parseInt(mediaPreview.getAttribute('data-img-idx') || '0', 10);
                openLightbox(projIdx, imgIdx);
            }
        });
    }

    /**
     * Lightbox Modal Functions
     */
    function openLightbox(projectIndex, imageIndex) {
        const project = allProjects[projectIndex];
        if (!project || !project.screenshot || !project.screenshot.images) return;

        const folder = project.screenshot.path;
        const ext = EXT_MAP[folder] || 'png';
        const images = project.screenshot.images.map(img => `assets/portfolios/${folder}/${img}.${ext}`);

        activeGallery = {
            title: project.title,
            images: images,
            currentIndex: imageIndex || 0
        };

        const modal = document.getElementById('lightbox-modal');
        if (!modal) return;

        modal.classList.add('is-active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        updateLightboxImage();
    }

    function updateLightboxImage() {
        const modal = document.getElementById('lightbox-modal');
        const img = document.getElementById('lightbox-img');
        const titleEl = document.getElementById('lightbox-title');
        const counterEl = document.getElementById('lightbox-counter');
        if (!modal || !img) return;

        const total = activeGallery.images.length;
        const current = activeGallery.currentIndex;

        img.src = activeGallery.images[current];
        img.alt = `${activeGallery.title} - Screenshot ${current + 1}`;

        if (titleEl) {
            titleEl.textContent = activeGallery.title;
        }
        if (counterEl) {
            counterEl.textContent = `Screenshot ${current + 1} of ${total}`;
        }
    }

    function prevLightboxImage() {
        if (!activeGallery.images || activeGallery.images.length === 0) return;
        activeGallery.currentIndex = (activeGallery.currentIndex - 1 + activeGallery.images.length) % activeGallery.images.length;
        updateLightboxImage();
    }

    function nextLightboxImage() {
        if (!activeGallery.images || activeGallery.images.length === 0) return;
        activeGallery.currentIndex = (activeGallery.currentIndex + 1) % activeGallery.images.length;
        updateLightboxImage();
    }

    function closeLightbox() {
        const modal = document.getElementById('lightbox-modal');
        if (!modal) return;
        modal.classList.remove('is-active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    /**
     * Setup UI controls (filter pills, search input, lightbox controls)
     */
    function setupControls() {
        // Filter pills
        const filterContainer = document.getElementById('category-filters');
        if (filterContainer) {
            filterContainer.addEventListener('click', function (e) {
                const pill = e.target.closest('.filter-pill');
                if (!pill) return;

                filterContainer.querySelectorAll('.filter-pill').forEach(btn => btn.classList.remove('active'));
                pill.classList.add('active');

                currentCategory = pill.getAttribute('data-filter') || 'all';
                filterProjects();
            });
        }

        // Search input
        const searchInput = document.getElementById('project-search');
        const clearBtn = document.getElementById('clear-search');

        if (searchInput) {
            searchInput.addEventListener('input', function () {
                searchQuery = searchInput.value;
                if (clearBtn) {
                    clearBtn.style.display = searchQuery ? 'block' : 'none';
                }
                filterProjects();
            });
        }

        if (clearBtn) {
            clearBtn.addEventListener('click', function () {
                if (searchInput) {
                    searchInput.value = '';
                    searchInput.focus();
                }
                searchQuery = '';
                clearBtn.style.display = 'none';
                filterProjects();
            });
        }

        // Reset filter button in empty state
        const resetBtn = document.getElementById('reset-filter-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', function () {
                if (searchInput) {
                    searchInput.value = '';
                }
                searchQuery = '';
                if (clearBtn) clearBtn.style.display = 'none';

                if (filterContainer) {
                    filterContainer.querySelectorAll('.filter-pill').forEach(btn => btn.classList.remove('active'));
                    const allPill = filterContainer.querySelector('[data-filter="all"]');
                    if (allPill) allPill.classList.add('active');
                }
                currentCategory = 'all';
                filterProjects();
            });
        }

        // Lightbox controls
        const modal = document.getElementById('lightbox-modal');
        const closeBtn = document.getElementById('lightbox-close');
        const prevBtn = document.getElementById('lightbox-prev');
        const nextBtn = document.getElementById('lightbox-next');

        if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
        if (prevBtn) prevBtn.addEventListener('click', prevLightboxImage);
        if (nextBtn) nextBtn.addEventListener('click', nextLightboxImage);

        if (modal) {
            modal.addEventListener('click', function (e) {
                if (e.target.classList.contains('lightbox-overlay') || e.target.classList.contains('lightbox-container')) {
                    closeLightbox();
                }
            });
        }

        // Keyboard navigation
        document.addEventListener('keydown', function (e) {
            const modalEl = document.getElementById('lightbox-modal');
            if (!modalEl || !modalEl.classList.contains('is-active')) return;

            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                prevLightboxImage();
            } else if (e.key === 'ArrowRight') {
                nextLightboxImage();
            }
        });
    }

    /**
     * Initialization entry point
     */
    function init() {
        setupControls();

        if (window.PORTFOLIO_DATA && Array.isArray(window.PORTFOLIO_DATA) && window.PORTFOLIO_DATA.length > 0) {
            renderProjectGrid(window.PORTFOLIO_DATA);
        } else {
            fetch('data/portfolio.json')
                .then(res => {
                    if (!res.ok) throw new Error('Network error: ' + res.status);
                    return res.json();
                })
                .then(projects => {
                    renderProjectGrid(projects);
                })
                .catch(err => {
                    console.warn('Fetch fallback to window.PORTFOLIO_DATA:', err);
                    if (window.PORTFOLIO_DATA && Array.isArray(window.PORTFOLIO_DATA)) {
                        renderProjectGrid(window.PORTFOLIO_DATA);
                    }
                });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
