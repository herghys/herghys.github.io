document.addEventListener('DOMContentLoaded', async function () {
    try {
        // Fetch portfolio data
        const response = await fetch('data/portfolio.json');
        const projects = await response.json();
        const projectsGrid = document.querySelector('.projects-grid');

        const supportedExtensions = ['png', 'jpg', 'jpeg', 'exr']; // List of supported extensions

        projects.forEach(project => {
            const card = document.createElement('div');
            card.classList.add('card');

            // Card Header
            const cardHeader = document.createElement('div');
            cardHeader.classList.add('card-header');
            cardHeader.innerHTML = `
                <h2>${project.title}</h2>
                <p class="year">${project.projectTime.startDate} ${project.projectTime.currentlyWorking ? 'Now' : project.projectTime.endDate}</p>
                <p class="project-type">Project Type: ${project.projectType == 1 ? 'Personal' : 'Work / Freelance'}</p>
                <p>${project.description}</p>
            `;

            // Tasks Section
            const tasks = project.tasks.map(task => `<li>${task}</li>`).join('');
            const cardBody = document.createElement('div');
            cardBody.classList.add('card-body');
            cardBody.innerHTML = `
                <strong>Tasks / Responsibilities</strong>
                <ul>${tasks}</ul>
                <strong>Technologies Used</strong>
                <div class="tech-list">
                    ${project.technologies.map(tech => `<span class="tech-item">${tech}</span>`).join('')}
                </div>
            `;

            // Repo Button
            const repoBtn = document.createElement('a');
            repoBtn.href = project.repo.link || '#';
            repoBtn.classList.add('repo-btn');
            repoBtn.innerHTML = `<i class="fab fa-github"></i> Open Repo`;

            if (project.repo.isPrivate || !project.repo.link) {
                repoBtn.classList.add('disabled');
                repoBtn.removeAttribute('href');
            }

            // Store Button
            const storeBtn = document.createElement('a');
            storeBtn.href = project.store.link || '#';
            storeBtn.classList.add('store-btn');
            storeBtn.innerHTML = `<i class="fas fa-store"></i> View on Store`;

            if (!project.store.isAvailable || !project.store.link) {
                storeBtn.classList.add('disabled');
                storeBtn.removeAttribute('href');
            }

            // Buttons Section
            const buttonGroup = document.createElement('div');
            buttonGroup.classList.add('buttons-section');
            buttonGroup.appendChild(repoBtn);
            buttonGroup.appendChild(storeBtn);

            cardBody.appendChild(buttonGroup);

            // Screenshots Section
            if (project.screenshot && project.screenshot.path) {
                const screenshotsSection = document.createElement('div');
                screenshotsSection.classList.add('screenshots');

                const imagePath = `assets/portfolios/${project.screenshot.path}`;
                project.screenshot.images.forEach((imageBaseName, index) => {
                    const imgElement = document.createElement('img');
                    imgElement.alt = `${project.title} screenshot ${index + 1}`;
                    imgElement.classList.add('screenshot-thumb', 'lazy');

                    let fileFound = false;

                    // Try each extension until one works
                    supportedExtensions.forEach(ext => {
                        const fullPath = `${imagePath}/${imageBaseName}.${ext}`;
                        const img = new Image();

                        img.onload = function () {
                            if (!fileFound) {
                                fileFound = true;
                                imgElement.dataset.src = fullPath;

                                // Lazy load with IntersectionObserver
                                if ('IntersectionObserver' in window) {
                                    const observer = new IntersectionObserver((entries, observer) => {
                                        entries.forEach(entry => {
                                            if (entry.isIntersecting) {
                                                const lazyImg = entry.target;
                                                lazyImg.src = lazyImg.dataset.src;
                                                lazyImg.onload = () => lazyImg.classList.remove('lazy');
                                                observer.unobserve(lazyImg);
                                            }
                                        });
                                    });

                                    observer.observe(imgElement);
                                } else {
                                    // Fallback for older browsers
                                    imgElement.src = imgElement.dataset.src;
                                    imgElement.onload = () => imgElement.classList.remove('lazy');
                                }

                                // Add click event for fullscreen modal
                                imgElement.addEventListener('click', () => {
                                    const modal = document.createElement('div');
                                    modal.classList.add('fullscreen-modal');
                                    modal.innerHTML = `
                                        <span class="close">&times;</span>
                                        <img class="fullscreen-modal-content" src="${imgElement.dataset.src}" alt="${project.title} fullscreen">
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

                        img.onerror = function () {
                            // If this file doesn't exist, continue to next extension
                        };

                        img.src = fullPath; // Start loading the image
                    });
                });

                cardBody.appendChild(screenshotsSection);
            }

            // Append elements to the card
            card.appendChild(cardHeader);
            card.appendChild(document.createElement('hr'));
            card.appendChild(cardBody);

            projectsGrid.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading the portfolio data:', error);
    }
});