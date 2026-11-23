function initPortfolio() {
    if (window.PORTFOLIO_DATA && Array.isArray(window.PORTFOLIO_DATA) && window.PORTFOLIO_DATA.length > 0) {
        renderProjects(window.PORTFOLIO_DATA);
    } else {
        fetch('data/portfolio.json')
            .then(function (response) {
                if (!response.ok) throw new Error('Network error: ' + response.status);
                return response.json();
            })
            .then(function (projects) {
                renderProjects(projects);
            })
            .catch(function (error) {
                console.warn('Fetch failed (likely file:// protocol), checking window.PORTFOLIO_DATA:', error);
                if (window.PORTFOLIO_DATA && Array.isArray(window.PORTFOLIO_DATA)) {
                    renderProjects(window.PORTFOLIO_DATA);
                }
            });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPortfolio);
} else {
    initPortfolio();
}

function renderProjects(projects) {
    const projectsGrid = document.querySelector('.projects-grid');
    if (!projectsGrid || !projects) return;

    projects.forEach(project => {
        const card = document.createElement('div');
        card.classList.add('card');

        // Card Header with Title, Year, and Project Type
        const cardHeader = document.createElement('div');
        cardHeader.classList.add('card-header');

        let timeDisplay = '';
        if (project.projectTime) {
            const start = project.projectTime.startDate || '';
            const end = project.projectTime.currentlyWorking ? 'Present' : (project.projectTime.endDate || '');
            if (start && end) {
                timeDisplay = `${start} - ${end}`;
            } else if (start || end) {
                timeDisplay = start || end;
            }
        }

        cardHeader.innerHTML = `
            <h2>${project.title}</h2>
            ${timeDisplay ? `<p class="year">${timeDisplay}</p>` : ''}
            <p class="project-type">Project Type: ${project.projectType == 1 ? 'Personal / Open Source' : 'Commercial / Freelance'}</p>
            <p>${project.description}</p>
        `;

        // Tasks/Responsibilities
        const tasksHtml = project.tasks && project.tasks.length > 0
            ? `<strong>Tasks / Responsibilities</strong><ul>${project.tasks.map(task => `<li>${task}</li>`).join('')}</ul>`
            : '';

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');
        cardBody.innerHTML = `
            ${tasksHtml}
            <strong>Technologies Used</strong>
            <div class="tech-list">
                ${project.technologies.map(tech => `<span class="tech-item">${tech}</span>`).join('')}
            </div>
        `;

        // Repo Button
        const repoBtn = document.createElement('a');
        repoBtn.classList.add('repo-btn');
        repoBtn.innerHTML = `<i class="fab fa-github"></i> Open Repo`;

        if (project.repo && project.repo.link && !project.repo.isPrivate) {
            repoBtn.href = project.repo.link;
            repoBtn.target = "_blank";
            repoBtn.rel = "noopener noreferrer";
        } else {
            repoBtn.classList.add('disabled');
            repoBtn.removeAttribute('href');
        }

        // Store / External Link Button
        const storeBtn = document.createElement('a');
        storeBtn.classList.add('store-btn');

        let storeText = "View on Store";
        let storeIcon = "fas fa-store";

        if (project.store && project.store.buttonText) {
            storeText = project.store.buttonText;
            if (storeText.toLowerCase().includes('website') || storeText.toLowerCase().includes('visit')) {
                storeIcon = "fas fa-globe";
            }
        } else if (project.store && project.store.link) {
            if (project.store.link.includes('play.google.com')) {
                storeText = "Google Play";
                storeIcon = "fab fa-google-play";
            } else if (project.store.link.includes('t.me')) {
                storeText = "Telegram App";
                storeIcon = "fab fa-telegram";
            } else if (project.store.link.startsWith('http')) {
                storeText = "Visit Website";
                storeIcon = "fas fa-globe";
            }
        }

        storeBtn.innerHTML = `<i class="${storeIcon}"></i> ${storeText}`;

        if (project.store && project.store.isAvailable && project.store.link) {
            storeBtn.href = project.store.link;
            storeBtn.target = "_blank";
            storeBtn.rel = "noopener noreferrer";
        } else {
            storeBtn.classList.add('disabled');
            storeBtn.removeAttribute('href');
        }

        // Buttons Group
        const buttonGroup = document.createElement('div');
        buttonGroup.classList.add('buttons-section');
        buttonGroup.appendChild(repoBtn);
        buttonGroup.appendChild(storeBtn);

        cardBody.appendChild(buttonGroup);

        // Append card header and body
        card.appendChild(cardHeader);
        card.appendChild(document.createElement('hr'));
        card.appendChild(cardBody);

        // Screenshots
        if (project.screenshot && project.screenshot.path && project.screenshot.images && project.screenshot.images.length > 0) {
            const screenshotsSection = document.createElement('div');
            screenshotsSection.classList.add('screenshots');

            const imagePath = `assets/portfolios/${project.screenshot.path}`;
            const extensions = ['png', 'jpg', 'jpeg'];

            project.screenshot.images.forEach((imageBaseName, index) => {
                let fileFound = false;

                extensions.forEach(ext => {
                    const imgPath = `${imagePath}/${imageBaseName}.${ext}`;
                    const img = new Image();

                    img.onload = function () {
                        if (!fileFound) {
                            fileFound = true;

                            const imgElement = document.createElement('img');
                            imgElement.src = imgPath;
                            imgElement.alt = `${project.title} screenshot ${index + 1}`;
                            imgElement.classList.add('screenshot-thumb');

                            imgElement.addEventListener('click', () => {
                                const modal = document.createElement('div');
                                modal.classList.add('fullscreen-modal');
                                modal.innerHTML = `
                                    <span class="close">&times;</span>
                                    <img class="fullscreen-modal-content" src="${imgElement.src}" alt="${project.title} fullscreen">
                                `;
                                document.body.appendChild(modal);
                                modal.style.display = "block";

                                modal.querySelector('.close').onclick = () => {
                                    modal.style.display = "none";
                                    document.body.removeChild(modal);
                                };

                                window.onclick = (event) => {
                                    if (event.target === modal) {
                                        modal.style.display = "none";
                                        document.body.removeChild(modal);
                                    }
                                };
                            });

                            screenshotsSection.appendChild(imgElement);
                        }
                    };

                    img.onerror = function () {};
                    img.src = imgPath;
                });
            });

            cardBody.appendChild(screenshotsSection);
        }

        projectsGrid.appendChild(card);
    });
}
