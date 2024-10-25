document.addEventListener('DOMContentLoaded', function () {
    fetch('data/portfolio.json')
        .then(response => response.json())
        .then(projects => {
            const projectsGrid = document.querySelector('.projects-grid');

            projects.forEach(project => {
                const card = document.createElement('div');
                card.classList.add('card');

                // Card Header with Title, Year, and Project Type
                const cardHeader = document.createElement('div');
                cardHeader.classList.add('card-header');
                cardHeader.innerHTML = `
                    <h2>${project.title}</h2>
                    <p class="year">${project.projectTime.startDate} ${ project.projectTime.currentlyWorking ? 'Now' : project.projectTime.endDate}</p>
                    <p class="project-type">Project Type: ${project.projectType == 1 ? 'Personal' : 'Work / Freelance'}</p>
                    <p>${project.description}</p>
                `;

                // Tasks/Responsibilities
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
                repoBtn.href = project.repo.link;
                repoBtn.classList.add('repo-btn');
                repoBtn.innerHTML = `<i class="fab fa-github"></i> Open Repo`;

                 // Check if repo is private, and disable the button if so
                 if (project.repo.isPrivate || repoBtn.href =="") {
                    repoBtn.classList.add('disabled');
                    repoBtn.removeAttribute('href'); // Remove link functionality
                }

                // Store Button
                const storeBtn = document.createElement('a');
                storeBtn.href = project.store.link;
                storeBtn.classList.add('store-btn');
                storeBtn.innerHTML = `<i class="fas fa-store"></i> View on Store`;

                // Check if store button should be disabled
                if (!project.store.isAvailable || storeBtn.href == "") {
                    storeBtn.classList.add('disabled');
                    storeBtn.removeAttribute('href'); // Remove link functionality
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
                if (project.screenshot && project.screenshot.images.length > 0) {
                    const screenshotsSection = document.createElement('div');
                    screenshotsSection.classList.add('screenshots');
                    project.screenshot.images.forEach(image => {
                        const img = document.createElement('img');
                        img.src = `assets/portfolios/${project.screenshot.path}/${image}`;
                        img.alt = `${project.title} screenshot`;
                        img.classList.add('screenshot-thumb');
                        // Add click event for fullscreen
                        img.addEventListener('click', () => {
                            const modal = document.createElement('div');
                            modal.classList.add('fullscreen-modal');
                            modal.innerHTML = `
                                <span class="close">&times;</span>
                                <img class="fullscreen-modal-content" src="${img.src}" alt="${project.title} fullscreen">
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
                        screenshotsSection.appendChild(img);
                    });
                    cardBody.appendChild(screenshotsSection);
                }

                projectsGrid.appendChild(card);
            });
        })
        .catch(error => console.error('Error loading the portfolio data:', error));
});
