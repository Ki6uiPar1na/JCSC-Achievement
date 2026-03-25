// Alumni page functionality

document.addEventListener('DOMContentLoaded', async () => {
    const alumni = await loadAlumni();
    
    if (!alumni) {
        showError('alumniList', 'Failed to load alumni data. Please check your configuration.');
        return;
    }

    let filteredAlumni = [...alumni];

    // Update stats
    document.getElementById('totalAlumni').textContent = alumni.length;
    const uniqueCompanies = [...new Set(alumni.map(a => a.company).filter(c => c))].length;
    document.getElementById('totalCompanies').textContent = uniqueCompanies;

    // Populate filters
    const batches = [...new Set(alumni.map(a => a.batch))].sort((a, b) => b - a);
    const batchFilter = document.getElementById('batchFilter');
    batches.forEach(batch => {
        const option = document.createElement('option');
        option.value = batch;
        option.textContent = batch;
        batchFilter.appendChild(option);
    });

    const companies = [...new Set(alumni.map(a => a.company).filter(c => c))].sort();
    const companyFilter = document.getElementById('companyFilter');
    companies.forEach(company => {
        const option = document.createElement('option');
        option.value = company;
        option.textContent = company;
        companyFilter.appendChild(option);
    });

    // Display alumni in list view
    function displayList(data) {
        const container = document.getElementById('alumniList');
        
        if (!data || data.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 40px;">No alumni found matching your criteria.</p>';
            return;
        }

        // Sort by batch (newest first)
        data.sort((a, b) => b.batch - a.batch);

        container.innerHTML = data.map(alumnus => `
            <div class="alumni-list-item">
                <div class="alumni-list-image-wrapper" style="position: relative;">
                    ${alumnus.image_url ? `
                        <img src="${alumnus.image_url}" alt="${alumnus.name}" class="alumni-list-image" onerror="this.src='images/placeholder.jpg'">
                    ` : `
                        <div style="width: 150px; height: 150px; background: linear-gradient(135deg, rgba(0, 255, 65, 0.1) 0%, rgba(0, 212, 255, 0.1) 100%); display: flex; align-items: center; justify-content: center;">
                            <i class="fas fa-user" style="font-size: 2rem; color: var(--text-secondary);"></i>
                        </div>
                    `}
                </div>
                <div class="alumni-list-content">
                    <div>
                        <h3 class="alumni-list-name">${alumnus.name}</h3>
                        ${alumnus.position ? `<p class="alumni-list-role">${alumnus.position}</p>` : ''}
                    </div>
                    <div class="alumni-list-info">
                        <div class="alumni-list-info-item">
                            <i class="fas fa-graduation-cap"></i>
                            <span>Batch of ${alumnus.batch}</span>
                        </div>
                        ${alumnus.company ? `
                            <div class="alumni-list-info-item">
                                <i class="fas fa-building"></i>
                                <span>${alumnus.company}</span>
                            </div>
                        ` : ''}
                        ${alumnus.linkedin ? `
                            <div class="alumni-list-info-item">
                                <a href="${alumnus.linkedin}" target="_blank" style="color: var(--secondary-color); display: flex; align-items: center; gap: 8px;">
                                    <i class="fab fa-linkedin"></i> LinkedIn Profile
                                </a>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Search functionality
    const searchInput = document.getElementById('alumniSearch');
    searchInput.addEventListener('input', filterAlumni);

    // Batch filter
    batchFilter.addEventListener('change', filterAlumni);

    // Company filter
    companyFilter.addEventListener('change', filterAlumni);

    function filterAlumni() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedBatch = batchFilter.value;
        const selectedCompany = companyFilter.value;

        filteredAlumni = alumni.filter(alumnus => {
            const matchesSearch = alumnus.name.toLowerCase().includes(searchTerm) ||
                                (alumnus.position && alumnus.position.toLowerCase().includes(searchTerm)) ||
                                (alumnus.company && alumnus.company.toLowerCase().includes(searchTerm));
            
            const matchesBatch = !selectedBatch || alumnus.batch === selectedBatch;
            const matchesCompany = !selectedCompany || alumnus.company === selectedCompany;

            return matchesSearch && matchesBatch && matchesCompany;
        });

        displayList(filteredAlumni);
    }

    // Initial display
    displayList(alumni);
});

