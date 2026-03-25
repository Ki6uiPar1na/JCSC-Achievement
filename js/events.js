// Events page functionality

let eventsData = [];

document.addEventListener('DOMContentLoaded', async () => {
    eventsData = await loadEvents();
    
    if (!eventsData) {
        showError('eventsGallery', 'Failed to load events. Please check your configuration.');
        return;
    }

    let filteredEvents = [...eventsData];

    // Modal close handler
    const modal = document.getElementById('galleryModal');
    const closeBtn = modal.querySelector('.close');
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Display events in gallery
    function displayGallery(data) {
        const container = document.getElementById('eventsGallery');
        
        if (!data || data.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 40px; grid-column: 1/-1;">No events found.</p>';
            return;
        }

        // Sort by date (newest first)
        data.sort((a, b) => new Date(b.date) - new Date(a.date));

        container.innerHTML = data.map((event, index) => {
            const upcoming = isUpcoming(event.date);
            const hasImage = event.image_url && event.image_url.trim();
            return `
                <div class="event-gallery-item" data-index="${index}" ${hasImage ? 'onclick="openEventLightbox(' + index + ')"' : ''} style="${!hasImage ? 'cursor: default;' : ''}">
                    ${hasImage ? `
                        <img src="${event.image_url}" alt="${event.title}" class="event-gallery-image" onerror="this.src='images/placeholder.jpg'">
                        <div class="event-gallery-overlay">
                            <i class="fas fa-search-plus overlay-icon"></i>
                        </div>
                    ` : `
                        <div style="width: 100%; height: 180px; background: linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(0, 255, 65, 0.1) 100%); display: flex; align-items: center; justify-content: center;">
                            <i class="fas fa-image" style="font-size: 2rem; color: var(--text-secondary);"></i>
                        </div>
                    `}
                    <div class="event-gallery-info">
                        <div>
                            <h3 class="event-gallery-title">${event.title}</h3>
                        </div>
                        <div class="event-gallery-meta">
                            <div class="event-gallery-category">${event.category || 'Event'}</div>
                            <div class="event-gallery-date">
                                <i class="fas fa-calendar"></i>
                                ${formatDate(event.date)}
                            </div>
                            ${event.location ? `
                                <div class="event-gallery-location">
                                    <i class="fas fa-map-marker-alt"></i>
                                    ${event.location}
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Search functionality
    const searchInput = document.getElementById('eventSearch');
    searchInput.addEventListener('input', filterEvents);

    // Category filter
    const categoryFilter = document.getElementById('categoryFilter');
    categoryFilter.addEventListener('change', filterEvents);

    // Status filter
    const statusFilter = document.getElementById('statusFilter');
    statusFilter.addEventListener('change', filterEvents);

    function filterEvents() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCategory = categoryFilter.value.toLowerCase();
        const selectedStatus = statusFilter.value;

        filteredEvents = eventsData.filter(event => {
            const matchesSearch = event.title.toLowerCase().includes(searchTerm) ||
                                event.description.toLowerCase().includes(searchTerm);
            
            const matchesCategory = !selectedCategory || 
                                  (event.category && event.category.toLowerCase() === selectedCategory);
            
            let matchesStatus = true;
            if (selectedStatus === 'upcoming') {
                matchesStatus = isUpcoming(event.date);
            } else if (selectedStatus === 'past') {
                matchesStatus = !isUpcoming(event.date);
            }

            return matchesSearch && matchesCategory && matchesStatus;
        });

        displayGallery(filteredEvents);
    }

    // Initial display
    displayGallery(eventsData);
});

/**
 * Open event preview modal
 */
function openEventLightbox(index) {
    const events = document.querySelectorAll('.event-gallery-item');
    if (index >= events.length) return;
    
    const element = events[index];
    const eventIndex = parseInt(element.dataset.index);
    const event = eventsData[eventIndex];
    
    const modal = document.getElementById('galleryModal');
    const modalBody = document.getElementById('galleryModalBody');
    
    const images = event.gallery ? event.gallery.split('|').filter(img => img.trim()) : [];
    const upcoming = isUpcoming(event.date);
    
    modalBody.innerHTML = `
        <div style="max-width: 600px;">
            <h2 style="color: var(--primary-color); margin-bottom: 15px;">${event.title}</h2>
            <div style="display: flex; gap: 20px; margin-bottom: 20px; flex-wrap: wrap;">
                <div>
                    <span style="color: var(--text-secondary); font-size: 0.9rem;">Date</span>
                    <p style="margin: 5px 0; color: var(--text-primary);"><i class="fas fa-calendar"></i> ${formatDate(event.date)}</p>
                </div>
                <div>
                    <span style="color: var(--text-secondary); font-size: 0.9rem;">Category</span>
                    <p style="margin: 5px 0; color: var(--text-primary);"><i class="fas fa-tag"></i> ${event.category || 'Event'}</p>
                </div>
                ${upcoming ? `
                    <div>
                        <span style="color: var(--text-secondary); font-size: 0.9rem;">Status</span>
                        <p style="margin: 5px 0; color: var(--success);"><i class="fas fa-clock"></i> Upcoming</p>
                    </div>
                ` : ''}
            </div>
            
            ${event.location ? `
                <div style="margin-bottom: 20px;">
                    <span style="color: var(--text-secondary); font-size: 0.9rem;">Location</span>
                    <p style="margin: 5px 0; color: var(--text-primary);"><i class="fas fa-map-marker-alt"></i> ${event.location}</p>
                </div>
            ` : ''}
            
            ${event.time ? `
                <div style="margin-bottom: 20px;">
                    <span style="color: var(--text-secondary); font-size: 0.9rem;">Time</span>
                    <p style="margin: 5px 0; color: var(--text-primary);"><i class="fas fa-clock"></i> ${event.time}</p>
                </div>
            ` : ''}
            
            ${event.description ? `
                <div style="margin-bottom: 20px;">
                    <span style="color: var(--text-secondary); font-size: 0.9rem;">Description</span>
                    <p style="margin: 5px 0; color: var(--text-primary); line-height: 1.6;">${event.description}</p>
                </div>
            ` : ''}
            
            ${images.length > 0 ? `
                <div style="margin-bottom: 20px;">
                    <span style="color: var(--text-secondary); font-size: 0.9rem;">Gallery</span>
                    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 10px; margin-top: 10px;">
                        ${images.map(img => `
                            <img src="${img.trim()}" alt="Event gallery" style="width: 100%; height: 150px; object-fit: cover; border-radius: 5px; border: 1px solid var(--border-color); cursor: pointer;" 
                            onclick="window.open('${img.trim()}', '_blank')">
                        `).join('')}
                    </div>
                </div>
            ` : ''}
            
            ${event.registration_link && upcoming ? `
                <a href="${event.registration_link}" target="_blank" class="btn btn-primary" style="display: inline-block; margin-top: 15px;">
                    <i class="fas fa-user-plus"></i> Register Now
                </a>
            ` : ''}
        </div>
    `;
    
    modal.style.display = 'block';
}

// Gallery modal
function showGallery(title, galleryString) {
    const modal = document.getElementById('galleryModal');
    const modalBody = document.getElementById('galleryModalBody');
    
    const images = galleryString.split('|').filter(img => img.trim());
    
    modalBody.innerHTML = `
        <h2 style="color: var(--primary-color); margin-bottom: 20px; text-align: center;">${title} - Gallery</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px;">
            ${images.map(img => `
                <img src="${img.trim()}" alt="Gallery image" style="width: 100%; height: 200px; object-fit: cover; border-radius: 5px; border: 1px solid var(--border-color); cursor: pointer;" 
                onclick="window.open('${img.trim()}', '_blank')">
            `).join('')}
        </div>
    `;
    
    modal.style.display = 'block';
}