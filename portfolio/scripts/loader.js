/**
 * Portfolio Loader & Interactive Showcase Engine (Ultra-Performant Edition)
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
    let allCards = [];
    let currentCategory = 'all';
    let searchQuery = '';
    let searchRafId = null;

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

        // Project Classification via separated boolean flags
        if (project.isWorkProject) {
            categories.push('work');
            categories.push('commercial');
        }
        if (project.isClientProject || project.isFreelanceProject) {
            categories.push('client');
            categories.push('commercial');
        }
        if (project.isPersonalProject) {
            categories.push('personal');
            if (project.title === 'Pong Evolved' || project.title === 'Tap!') {
                categories.push('commercial');
            }
        }
        if (project.isOpenSource) {
            categories.push('opensource');
            categories.push('tools');
        }

        // AR / VR & Simulation
        if (/\b(ar|vr|vuforia|augmented reality|virtual reality|simulation|simulator|avatar)\b/i.test(fullText)) {
            categories.push('ar-vr-sim');
        }

        // Tools & Utilities
        if ((project.isApplication && !project.isGame) || /\b(tool|wpf|winforms|extension|helper|comparer|monitoring|module|linq|utility)\b/i.test(fullText)) {
            if (!categories.includes('tools')) {
                categories.push('tools');
            }
        }

        // Games & Interactive
        if (project.isGame === true || (project.isGame !== false && (/\b(game|arcade|dress up|puzzle|racer|admob|bubble|lands|runner)\b/i.test(fullText) ||
            ((project.technologies || []).includes('Unity3D') && !categories.includes('tools'))))) {
            categories.push('games');
        }

        return categories;
    }

    /**
     * Pre-indexes projects for O(1) category lookup and zero-allocation search
     */
    function indexProjects(projects) {
        const total = projects.length;
        for (let i = 0; i < total; i++) {
            const p = projects[i];
            const categories = getProjectCategories(p);
            p._catSet = new Set(categories);
            p._catStr = categories.join(' ');

            const techStr = (p.technologies || []).join(' ');
            const tasksStr = (p.tasks || []).join(' ');
            p._searchIndex = `${p.title} ${p.description || ''} ${techStr} ${tasksStr}`.toLowerCase();
            p._index = i;
        }
        return projects;
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
     * Render a single project card element with performance optimizations
     */
    function createProjectCard(project, projectIndex) {
        const card = document.createElement('article');
        card.className = 'project-card';
        card.setAttribute('data-index', projectIndex);
        card.setAttribute('data-categories', project._catStr || '');

        const isCommercialOrClient = project.isWorkProject || project.isClientProject || project.isFreelanceProject;
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
                        <img src="${thumbSrc}" alt="${escapeHtml(project.title)} preview ${i + 1}" loading="lazy" decoding="async" width="48" height="32">
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

            // High-priority image loading for top 4 cards (above the fold)
            const imgLoading = projectIndex < 4 ? 'eager' : 'lazy';
            const fetchPriority = projectIndex === 0 ? 'fetchpriority="high"' : '';

            mediaHtml = `
                <div class="card-media">
                    <div class="media-preview" data-proj-idx="${projectIndex}" data-img-idx="0">
                        <img src="${firstImgSrc}" alt="${escapeHtml(project.title)} showcase" class="hero-preview-img" loading="${imgLoading}" decoding="async" ${fetchPriority} width="640" height="360">
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
        let typeBadge = '';
        if (project.isClientProject || project.isFreelanceProject) {
            typeBadge = `<span class="badge badge-client"><i class="fas fa-handshake"></i> Client Project</span>`;
        } else if (project.isWorkProject) {
            typeBadge = `<span class="badge badge-commercial"><i class="fas fa-briefcase"></i> Commercial</span>`;
        } else if (project.isOpenSource) {
            typeBadge = `<span class="badge badge-oss"><i class="fas fa-code-branch"></i> Open Source</span>`;
        } else if (project.title === 'Pong Evolved' || project.title === 'Tap!') {
            typeBadge = `<span class="badge badge-commercial"><i class="fas fa-briefcase"></i> Commercial</span>`;
        } else if (project.isPersonalProject) {
            typeBadge = `<span class="badge badge-personal"><i class="fas fa-user"></i> Personal Project</span>`;
        } else {
            typeBadge = `<span class="badge badge-commercial"><i class="fas fa-briefcase"></i> Commercial</span>`;
        }

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
        } else if (isCommercialOrClient) {
            repoActionHtml = `
                <span class="badge-private" title="Client / Enterprise proprietary codebase under NDA">
                    <i class="fas fa-shield-alt"></i> Confidential
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
     * Ultra-fast O(N) project filter with zero heap string allocations during typing
     */
    function filterProjects() {
        const grid = document.getElementById('projects-grid');
        const emptyState = document.getElementById('empty-state');
        const visibleCountEl = document.getElementById('visible-count');
        if (!grid || allCards.length === 0) return;

        const isAll = currentCategory === 'all';
        const query = searchQuery; // already trimmed and lowercased
        let visibleCount = 0;
        const total = allCards.length;

        for (let i = 0; i < total; i++) {
            const card = allCards[i];
            const proj = allProjects[i];
            if (!proj) continue;

            const matchesCategory = isAll || proj._catSet.has(currentCategory);
            const matchesSearch = !query || proj._searchIndex.includes(query);
            const isVisible = matchesCategory && matchesSearch;

            card.classList.toggle('is-hidden', !isVisible);
            if (isVisible) visibleCount++;
        }

        if (visibleCountEl) {
            visibleCountEl.textContent = visibleCount;
        }

        if (emptyState) {
            emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
        }
    }

    /**
     * Render the whole project list into the grid using DocumentFragment & replaceChildren
     */
    function renderProjectGrid(projects) {
        allProjects = indexProjects(projects);
        const grid = document.getElementById('projects-grid');
        if (!grid) return;

        const fragment = document.createDocumentFragment();
        const total = allProjects.length;
        allCards = new Array(total);

        for (let i = 0; i < total; i++) {
            const cardEl = createProjectCard(allProjects[i], i);
            allCards[i] = cardEl;
            fragment.appendChild(cardEl);
        }

        grid.replaceChildren(fragment);

        setupCardInteractions();
        updateCategoryCounts();
        filterProjects();
    }

    /**
     * Compute and display live counts in filter pill badges with O(N) lookup
     */
    function updateCategoryCounts() {
        const counts = {
            'all': allProjects.length,
            'commercial': 0,
            'client': 0,
            'games': 0,
            'ar-vr-sim': 0,
            'tools': 0,
            'personal': 0,
            'opensource': 0
        };

        const total = allProjects.length;
        for (let i = 0; i < total; i++) {
            const set = allProjects[i]._catSet;
            if (!set) continue;
            for (const cat in counts) {
                if (cat !== 'all' && set.has(cat)) {
                    counts[cat]++;
                }
            }
        }

        const pills = document.querySelectorAll('.filter-pill');
        for (let i = 0; i < pills.length; i++) {
            const pill = pills[i];
            const cat = pill.getAttribute('data-filter');
            const badge = pill.querySelector('.count-badge');
            if (badge && counts[cat] !== undefined) {
                badge.textContent = counts[cat];
            }
        }
    }

    /**
     * Setup event listeners for thumbnail swaps and lightbox triggers (delegated)
     */
    function setupCardInteractions() {
        const grid = document.getElementById('projects-grid');
        if (!grid || grid.dataset.interactionsReady) return;
        grid.dataset.interactionsReady = 'true';

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
                    const activeThumb = card.querySelector('.thumb-btn.active');
                    if (activeThumb) activeThumb.classList.remove('active');
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
        }, { passive: true });
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
     * Setup UI controls with RAF debouncing and fast event handling
     */
    function setupControls() {
        // Filter pills
        const filterContainer = document.getElementById('category-filters');
        if (filterContainer) {
            filterContainer.addEventListener('click', function (e) {
                const pill = e.target.closest('.filter-pill');
                if (!pill) return;

                const activePill = filterContainer.querySelector('.filter-pill.active');
                if (activePill) activePill.classList.remove('active');
                pill.classList.add('active');

                currentCategory = pill.getAttribute('data-filter') || 'all';
                filterProjects();
            });
        }

        // Search input with requestAnimationFrame debouncing
        const searchInput = document.getElementById('project-search');
        const clearBtn = document.getElementById('clear-search');

        if (searchInput) {
            searchInput.addEventListener('input', function () {
                searchQuery = searchInput.value.trim().toLowerCase();
                if (clearBtn) {
                    clearBtn.style.display = searchQuery ? 'block' : 'none';
                }
                if (searchRafId) cancelAnimationFrame(searchRafId);
                searchRafId = requestAnimationFrame(filterProjects);
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
                    const activePill = filterContainer.querySelector('.filter-pill.active');
                    if (activePill) activePill.classList.remove('active');
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

        fetch('data/portfolio.json')
            .then(res => {
                if (!res.ok) throw new Error('Network error: ' + res.status);
                return res.json();
            })
            .then(projects => {
                renderProjectGrid(projects);
            })
            .catch(err => {
                console.error('Failed to load portfolio data:', err);
            });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
