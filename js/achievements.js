// Achievements page functionality

let achievementsData = [];
let currentLightboxIndex = 0;

document.addEventListener('DOMContentLoaded', async () => {
    achievementsData = await loadAchievements();
    
    if (!achievementsData || achievementsData.length === 0) {
        showError('achievementsGallery', 'Failed to load achievements. Please check your configuration.');
        return;
    }

    let filteredAchievements = [...achievementsData];
    
    // Populate year filter
    const years = [...new Set(achievementsData.map(a => new Date(a.date).getFullYear()))].sort((a, b) => b - a);
    const yearFilter = document.getElementById('yearFilter');
    years.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearFilter.appendChild(option);
    });

    // Search functionality
    const searchInput = document.getElementById('achievementSearch');
    searchInput.addEventListener('input', filterAchievements);

    // Year filter
    yearFilter.addEventListener('change', filterAchievements);

    function filterAchievements() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedYear = yearFilter.value;

        filteredAchievements = achievementsData.filter(achievement => {
            const matchesSearch = achievement.title.toLowerCase().includes(searchTerm) ||
                                achievement.position.toLowerCase().includes(searchTerm);
            
            const matchesYear = !selectedYear || new Date(achievement.date).getFullYear().toString() === selectedYear;

            return matchesSearch && matchesYear;
        });

        // Update timeline view
        displayTimeline(filteredAchievements);
    }

    // Display achievements in timeline
    function displayTimeline(data) {
        const container = document.getElementById('achievementsTimeline');
        
        if (!data || data.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 40px;">No achievements found.</p>';
            return;
        }

        // Sort by date (newest first)
        data.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Group by year
        const grouped = {};
        data.forEach(achievement => {
            const year = new Date(achievement.date).getFullYear();
            if (!grouped[year]) {
                grouped[year] = [];
            }
            grouped[year].push(achievement);
        });

        // Build timeline HTML
        let timelineHTML = '<div class="achievement-timeline-container">';
        
        Object.keys(grouped).sort((a, b) => b - a).forEach(year => {
            const achievements = grouped[year];
            timelineHTML += `
                <div class="achievement-timeline-year-section">
                    <div class="achievement-timeline-year-header">
                        <h2>${year}</h2>
                    </div>
                    <div class="achievement-timeline-items">
            `;
            
            achievements.forEach((achievement, index) => {
                const hasImage = achievement.image_url && achievement.image_url.trim();
                const achievementIndex = achievementsData.indexOf(achievement);
                timelineHTML += `
                    <div class="achievement-timeline-item ${index % 2 === 0 ? 'left' : 'right'}">
                        <div class="achievement-timeline-dot"></div>
                        <div class="achievement-timeline-content">
                            <div class="achievement-timeline-card clickable" onclick="openAchievementLightbox(${achievementIndex})">
                                ${achievement.position ? `<span class="achievement-timeline-position">${achievement.position}</span>` : ''}
                                ${hasImage ? `
                                    <img src="${achievement.image_url}" alt="${achievement.title}" class="achievement-timeline-image" onerror="this.style.display='none'; this.parentElement.querySelector('.achievement-timeline-image-placeholder').style.display='flex';">
                                    <div class="achievement-timeline-image-placeholder" style="display:none;">
                                        <i class="fas fa-image"></i>
                                    </div>
                                ` : ''}
                                <div class="achievement-timeline-card-info">
                                    <h3>${achievement.title}</h3>
                                    ${achievement.team_name ? `
                                        <div class="achievement-timeline-detail">
                                            <i class="fas fa-shield-alt"></i>
                                            <div>
                                                <strong>Team</strong>
                                                <span>${achievement.team_name}</span>
                                            </div>
                                        </div>
                                    ` : ''}
                                    ${achievement.members ? `
                                        <div class="achievement-timeline-members-container">
                                            <div class="achievement-timeline-members-label">
                                                <i class="fas fa-users"></i>
                                                <strong>Members</strong>
                                            </div>
                                            <div class="achievement-timeline-members-badges">
                                                ${achievement.members.split(',').map((member, idx) => {
                                                    const trimmed = member.trim();
                                                    const colors = ['#00ff41', '#00d4ff', '#ff006e', '#ffbe0b', '#8338ec', '#3a86ff', '#06ffa5'];
                                                    const bgColor = colors[idx % colors.length];
                                                    return `<span class="achievement-member-badge" style="background-color: ${bgColor}; border-color: ${bgColor};">${trimmed}</span>`;
                                                }).join('')}
                                            </div>
                                        </div>
                                    ` : ''}
                                    ${achievement.prize ? `
                                        <div class="achievement-timeline-detail">
                                            <i class="fas fa-trophy"></i>
                                            <div>
                                                <strong>Prize</strong>
                                                <span>${achievement.prize}</span>
                                            </div>
                                        </div>
                                    ` : ''}
                                    <div class="achievement-timeline-meta">
                                        <span class="achievement-timeline-date">
                                            <i class="fas fa-calendar"></i> ${formatDate(achievement.date)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            });
            
            timelineHTML += `
                    </div>
                </div>
            `;
        });
        
        timelineHTML += '</div>';
        container.innerHTML = timelineHTML;
    }

    // Setup lightbox
    setupAchievementLightbox();

    // Initial display - Timeline only
    displayTimeline(achievementsData);
});

/**
 * Open achievement lightbox
 */
function openAchievementLightbox(index) {
    currentLightboxIndex = index;
    updateAchievementLightbox();
    document.getElementById('galleryLightbox').classList.add('active');
}

/**
 * Update lightbox content
 */
function updateAchievementLightbox() {
    const index = currentLightboxIndex;
    if (index >= achievementsData.length) return;
    
    const achievement = achievementsData[index];
    
    const lightboxImg = document.getElementById('lightboxImage');
    
    if (achievement.image_url && achievement.image_url.trim()) {
        lightboxImg.src = achievement.image_url;
        lightboxImg.style.display = 'block';
        lightboxImg.onerror = function() {
            this.style.display = 'none';
        };
    } else {
        lightboxImg.style.display = 'none';
    }
    
    document.getElementById('lightboxTitle').textContent = achievement.title;
    document.getElementById('lightboxDescription').textContent = (achievement.position ? `Position: ${achievement.position}` : 'No position available');
    
    const detailsContainer = document.getElementById('lightboxDetails');
    detailsContainer.innerHTML = '';
    
    if (achievement.date) {
        detailsContainer.innerHTML += `
            <div class="gallery-lightbox-detail-item">
                <div class="gallery-lightbox-detail-label"><i class="fas fa-calendar"></i> Date</div>
                <div class="gallery-lightbox-detail-value">${formatDate(achievement.date)}</div>
            </div>
        `;
    }
    
    if (achievement.team_name) {
        detailsContainer.innerHTML += `
            <div class="gallery-lightbox-detail-item">
                <div class="gallery-lightbox-detail-label"><i class="fas fa-shield-alt"></i> Team</div>
                <div class="gallery-lightbox-detail-value">${achievement.team_name}</div>
            </div>
        `;
    }
    
    if (achievement.members) {
        const memberBadges = achievement.members.split(',').map((member, idx) => {
            const trimmed = member.trim();
            const colors = ['#00ff41', '#00d4ff', '#ff006e', '#ffbe0b', '#8338ec', '#3a86ff', '#06ffa5'];
            const bgColor = colors[idx % colors.length];
            return `<span class="achievement-member-badge" style="background-color: ${bgColor}; border-color: ${bgColor};">${trimmed}</span>`;
        }).join('');
        detailsContainer.innerHTML += `
            <div class="gallery-lightbox-members">
                <div class="gallery-lightbox-detail-label"><i class="fas fa-users"></i> Members</div>
                <div class="gallery-lightbox-members-badges">
                    ${memberBadges}
                </div>
            </div>
        `;
    }
    
    if (achievement.prize) {
        detailsContainer.innerHTML += `
            <div class="gallery-lightbox-detail-item">
                <div class="gallery-lightbox-detail-label"><i class="fas fa-trophy"></i> Prize</div>
                <div class="gallery-lightbox-detail-value prize-highlight">${achievement.prize}</div>
            </div>
        `;
    }
}

/**
 * Setup lightbox functionality
 */
function setupAchievementLightbox() {
    const lightbox = document.getElementById('galleryLightbox');
    if (!lightbox) {
        // Create lightbox if it doesn't exist
        const lightboxHTML = `
            <div class="gallery-lightbox" id="galleryLightbox">
                <div class="gallery-lightbox-overlay" id="lightboxOverlay"></div>
                <div class="gallery-lightbox-container">
                    <button class="gallery-lightbox-close" id="lightboxClose">
                        <i class="fas fa-times"></i>
                    </button>
                    <button class="gallery-lightbox-nav gallery-lightbox-prev" id="lightboxPrev">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <div class="gallery-lightbox-content">
                        <img id="lightboxImage" src="" alt="" class="gallery-lightbox-image" />
                        <div class="gallery-lightbox-info">
                            <h3 id="lightboxTitle"></h3>
                            <p id="lightboxDescription" class="gallery-lightbox-description"></p>
                            <div id="lightboxDetails" class="gallery-lightbox-details"></div>
                        </div>
                    </div>
                    <button class="gallery-lightbox-nav gallery-lightbox-next" id="lightboxNext">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', lightboxHTML);
    }

    const closeLightbox = () => {
        document.getElementById('galleryLightbox').classList.remove('active');
    };

    document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
    document.getElementById('lightboxOverlay').addEventListener('click', closeLightbox);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        const lightbox = document.getElementById('galleryLightbox');
        if (!lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') prevAchievementImage();
        if (e.key === 'ArrowRight') nextAchievementImage();
    });

    document.getElementById('lightboxPrev').addEventListener('click', prevAchievementImage);
    document.getElementById('lightboxNext').addEventListener('click', nextAchievementImage);
}

/**
 * Navigate to previous image
 */
function prevAchievementImage() {
    if (currentLightboxIndex > 0) {
        currentLightboxIndex--;
        updateAchievementLightbox();
    }
}

/**
 * Navigate to next image
 */
function nextAchievementImage() {
    if (currentLightboxIndex < achievementsData.length - 1) {
        currentLightboxIndex++;
        updateAchievementLightbox();
    }
}
