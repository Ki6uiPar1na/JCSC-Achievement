// Alumni page functionality

document.addEventListener('DOMContentLoaded', async () => {
    console.log('Alumni page loading...');
    const alumni = await loadAlumni();
    
    console.log('Alumni data loaded:', alumni);
    
    if (!alumni || alumni.length === 0) {
        console.log('No alumni found, showing message');
        document.getElementById('alumniList').innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 40px;">No alumni data available.</p>';
        return;
    }

    let filteredAlumni = [...alumni];

    // Update stats
    document.getElementById('totalAlumni').textContent = alumni.length;
    const uniqueCompanies = [...new Set(alumni.map(a => a.company).filter(c => c))].length;
    document.getElementById('totalCompanies').textContent = uniqueCompanies;
    console.log('Stats updated: ', alumni.length, 'alumni,', uniqueCompanies, 'companies');

    // Populate filters - sort batches in increasing order (lowest to highest year)
    const batches = [...new Set(alumni.map(a => a.batch))]
        .map(b => parseInt(b))
        .sort((a, b) => a - b);
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

        console.log('displayList data:', data);

        // Group by batch and sort batches in increasing order (lowest to highest year)
        const groupedByBatch = {};
        data.forEach(alumnus => {
            const batch = (alumnus.batch || '').toString().trim();
            if (!groupedByBatch[batch]) {
                groupedByBatch[batch] = [];
            }
            groupedByBatch[batch].push(alumnus);
        });

        const sortedBatches = Object.keys(groupedByBatch)
            .map(b => parseInt(b))
            .filter(b => !isNaN(b))
            .sort((a, b) => a - b);

        let html = '';
        sortedBatches.forEach(batchNum => {
            const batchKey = batchNum.toString();
            if (!groupedByBatch[batchKey] || groupedByBatch[batchKey].length === 0) {
                return;
            }
            console.log('Processing batch:', batchKey, 'with', groupedByBatch[batchKey].length, 'alumni');
            
            html += `<div class="batch-section"><h3 class="batch-title">Batch ${batchKey}</h3>`;
            html += groupedByBatch[batchKey].map(alumnus => `
            <div class="alumni-list-item">
                <div class="alumni-list-image-wrapper" style="position: relative;">
                    ${alumnus.image_url ? `
                        <img src="${alumnus.image_url}" alt="${alumnus.name}" class="alumni-list-image" onerror="this.style.display='none'; this.parentElement.querySelector('.alumni-image-placeholder').style.display='flex';">
                        <div class="alumni-image-placeholder" style="display:none; width: 150px; height: 150px; background: linear-gradient(135deg, rgba(0, 255, 65, 0.1) 0%, rgba(0, 212, 255, 0.1) 100%); align-items: center; justify-content: center;">
                            <i class="fas fa-user" style="font-size: 2rem; color: var(--text-secondary);"></i>
                        </div>
                    ` : `
                        <div style="width: 150px; height: 150px; background: linear-gradient(135deg, rgba(0, 255, 65, 0.1) 0%, rgba(0, 212, 255, 0.1) 100%); display: flex; align-items: center; justify-content: center;">
                            <i class="fas fa-user" style="font-size: 2rem; color: var(--text-secondary);"></i>
                        </div>
                    `}
                </div>
                <div class="alumni-list-content">
                    <div>
                        <h3 class="alumni-list-name">${alumnus.name || 'Unknown'}</h3>
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
            html += '</div>';
        });

        console.log('Final HTML length:', html.length);
        container.innerHTML = html;
        console.log('Alumni list rendered successfully');
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
    console.log('Calling initial displayList with alumni:', alumni.length);
    displayList(alumni);
});

