// Executive Body page functionality

// Define role order for sorting
const roleOrder = {
    'president': 1,
    'vice president': 2,
    'secretary': 3,
    'treasurer': 4,
    'technical lead': 5,
    'event coordinator': 6,
    'social media manager': 7,
    'content head': 8,
    'member': 99
};

// Utility functions
function truncateText(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showMemberModal(name, role, bio, imageUrl, linkedin, github, email, year, current) {
    const modal = document.getElementById('memberModal');
    const modalBody = document.getElementById('modalBody');
    
    const isCurrent = current == 1 || current === 'true' || current === true;
    const statusText = isCurrent ? 'Current Committee' : 'Past Committee';
    const statusColor = isCurrent ? 'var(--success)' : 'var(--text-secondary)';
    
    modalBody.innerHTML = `
        <div style="text-align: center;">
            <img src="${imageUrl || 'images/default-avatar.jpg'}" alt="${name}" style="width: 200px; height: 100px; border-radius: 50%; object-fit: cover; margin-bottom: 20px; border: 3px solid var(--primary-color);">
            <h2 style="color: var(--primary-color); margin-bottom: 10px;">${name}</h2>
            <p style="color: var(--secondary-color); font-size: 1.2rem; margin-bottom: 10px;">${role}</p>
            <div style="display: flex; gap: 15px; justify-content: center; margin-bottom: 20px; font-size: 0.95rem;">
                ${year ? `<span style="color: var(--text-secondary);"><i class="fas fa-calendar"></i> Year: ${year}</span>` : ''}
                <span style="color: ${statusColor};"><i class="fas fa-circle" style="font-size: 0.6rem;"></i> ${statusText}</span>
            </div>
            <p style="color: var(--text-secondary); line-height: 1.8; margin-bottom: 20px;">${bio}</p>
            <div style="display: flex; gap: 20px; justify-content: center; margin-top: 20px;">
                ${linkedin ? `<a href="${linkedin}" target="_blank" class="btn btn-primary"><i class="fab fa-linkedin"></i> LinkedIn</a>` : ''}
                ${github ? `<a href="${github}" target="_blank" class="btn btn-secondary"><i class="fab fa-github"></i> GitHub</a>` : ''}
                ${email ? `<a href="mailto:${email}" class="btn btn-secondary"><i class="fas fa-envelope"></i> Email</a>` : ''}
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
}

// Main execution
document.addEventListener('DOMContentLoaded', async () => {
    
    try {
        // Load members data
        const members = await loadMembers();
        
        if (!members || members.length === 0) {
            const container = document.getElementById('membersGrid');
            if (container) {
                container.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 40px;">No members to display.</p>';
            }
            return;
        }

        
        // Sort by role
        members.sort((a, b) => {
            const orderA = roleOrder[a.role.toLowerCase()] || 99;
            const orderB = roleOrder[b.role.toLowerCase()] || 99;
            return orderA - orderB;
        });
        
        
        // Get container
        const container = document.getElementById('membersGrid');
        if (!container) {
            return;
        }
        
        // Function to render members based on filters
        function renderMembers(filteredMembers = members) {
            // Separate current and past members
            const currentMembers = filteredMembers.filter(m => m.current == 1 || m.current === 'true' || m.current === true);
            const pastMembers = filteredMembers.filter(m => !(m.current == 1 || m.current === 'true' || m.current === true));
            
            // Group past members by year
            const membersByYear = {};
            pastMembers.forEach(member => {
                const year = member.year || 'Unknown Year';
                if (!membersByYear[year]) {
                    membersByYear[year] = [];
                }
                membersByYear[year].push(member);
            });
            
            // Sort years in descending order
            const sortedYears = Object.keys(membersByYear).sort((a, b) => {
                const yearA = parseInt(a);
                const yearB = parseInt(b);
                if (isNaN(yearA) || isNaN(yearB)) return 0;
                return yearB - yearA;
            });
            
            // Build HTML
            let html = '';
            
            // Add current committee section
            if (currentMembers.length > 0) {
                html += `
                    <div class="committee-section-header" style="grid-column: 1/-1;">
                        <h2><i class="fas fa-star"></i> Current Committee</h2>
                    </div>
                `;
                
                currentMembers.forEach((member, i) => {
                    const originalIndex = members.indexOf(member);
                    html += `
                        <div class="member-card" data-member-index="${originalIndex}">
                            <img src="${member.image_url || 'images/default-avatar.jpg'}" alt="${member.name}" class="member-image">
                            <div class="member-info">
                                <h3 class="member-name">${member.name}</h3>
                                <p class="member-role">${member.role}</p>
                                ${member.year ? `<p style="color: var(--text-secondary); font-size: 0.85rem; margin: 5px 0;"><i class="fas fa-calendar"></i> ${member.year}</p>` : ''}
                                <p class="member-bio">${truncateText(member.bio, 100)}</p>
                                <div style="margin-top: 10px;">
                                    <span class="status-badge current"><i class="fas fa-star"></i> Current</span>
                                </div>
                                <div class="member-social">
                                    ${member.linkedin ? `<a href="${member.linkedin}" target="_blank" onclick="event.stopPropagation()"><i class="fab fa-linkedin"></i></a>` : ''}
                                    ${member.github ? `<a href="${member.github}" target="_blank" onclick="event.stopPropagation()"><i class="fab fa-github"></i></a>` : ''}
                                    ${member.email ? `<a href="mailto:${member.email}" onclick="event.stopPropagation()"><i class="fas fa-envelope"></i></a>` : ''}
                                </div>
                            </div>
                        </div>
                    `;
                });
            }
            
            // Add divider between current and past
            if (currentMembers.length > 0 && pastMembers.length > 0) {
                html += `
                    <div class="committee-divider-main" style="grid-column: 1/-1;">
                        <div class="divider-line-main"></div>
                        <div class="divider-label-main">All Past Committee</div>
                        <div class="divider-line-main"></div>
                    </div>
                `;
            }
            
            // Add past committee section organized by year
            if (pastMembers.length > 0 && sortedYears.length > 0) {
                html += `
                    <div class="committee-section-header" style="grid-column: 1/-1;">
                        <h2><i class="fas fa-history"></i> Past Committee</h2>
                    </div>
                `;
                
                sortedYears.forEach(year => {
                    const yearMembers = membersByYear[year];
                    
                    // Add year subheader
                    html += `
                        <div class="year-section-header" style="grid-column: 1/-1;">
                            <h3><i class="fas fa-calendar-alt"></i> ${year}</h3>
                        </div>
                    `;
                    
                    // Add members for this year
                    yearMembers.forEach(member => {
                        const originalIndex = members.indexOf(member);
                        html += `
                            <div class="member-card" data-member-index="${originalIndex}">
                                <img src="${member.image_url || 'images/default-avatar.jpg'}" alt="${member.name}" class="member-image">
                                <div class="member-info">
                                    <h3 class="member-name">${member.name}</h3>
                                    <p class="member-role">${member.role}</p>
                                    <p class="member-bio">${truncateText(member.bio, 100)}</p>
                                    <div style="margin-top: 10px;">
                                        <span class="status-badge past"><i class="fas fa-clock"></i> Past</span>
                                    </div>
                                    <div class="member-social">
                                        ${member.linkedin ? `<a href="${member.linkedin}" target="_blank" onclick="event.stopPropagation()"><i class="fab fa-linkedin"></i></a>` : ''}
                                        ${member.github ? `<a href="${member.github}" target="_blank" onclick="event.stopPropagation()"><i class="fab fa-github"></i></a>` : ''}
                                        ${member.email ? `<a href="mailto:${member.email}" onclick="event.stopPropagation()"><i class="fas fa-envelope"></i></a>` : ''}
                                    </div>
                                </div>
                            </div>
                        `;
                    });
                });
            }
            
            // Show empty message if no members match filters
            if (currentMembers.length === 0 && pastMembers.length === 0) {
                html = '<p style="text-align: center; color: var(--text-secondary); padding: 40px; grid-column: 1/-1;">No members found matching your filters.</p>';
            }
            
            // Render to container
            container.innerHTML = html;
            
            // Add click handlers to member cards
            document.querySelectorAll('.member-card').forEach(card => {
                card.addEventListener('click', () => {
                    const index = parseInt(card.dataset.memberIndex);
                    const member = members[index];
                    showMemberModal(
                        member.name,
                        member.role,
                        member.bio,
                        member.image_url,
                        member.linkedin || '',
                        member.github || '',
                        member.email || '',
                        member.year || '',
                        member.current || '0'
                    );
                });
            });
            
            // Apply fade-in animation
            const memberCards = document.querySelectorAll('.member-card');
            const fadeObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0)';
                        }, index * 100);
                        fadeObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });

            memberCards.forEach(card => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                fadeObserver.observe(card);
            });
            
        }
        
        // Populate year filter
        const allYears = new Set();
        members.forEach(member => {
            if (member.year) allYears.add(member.year);
        });
        const sortedYearsList = Array.from(allYears).sort((a, b) => {
            const yearA = parseInt(a);
            const yearB = parseInt(b);
            if (isNaN(yearA) || isNaN(yearB)) return 0;
            return yearB - yearA;
        });
        
        const yearFilter = document.getElementById('yearFilter');
        sortedYearsList.forEach(year => {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            yearFilter.appendChild(option);
        });
        
        // Setup filter event listeners
        const statusFilter = document.getElementById('statusFilter');
        yearFilter.addEventListener('change', applyFilters);
        statusFilter.addEventListener('change', applyFilters);
        
        function applyFilters() {
            const selectedYear = yearFilter.value;
            const selectedStatus = statusFilter.value;
            
            let filtered = members;
            
            // Filter by status
            if (selectedStatus === 'current') {
                filtered = filtered.filter(m => m.current == 1 || m.current === 'true' || m.current === true);
            } else if (selectedStatus === 'past') {
                filtered = filtered.filter(m => !(m.current == 1 || m.current === 'true' || m.current === true));
            }
            
            // Filter by year
            if (selectedYear) {
                filtered = filtered.filter(m => m.year === selectedYear);
            }
            
            renderMembers(filtered);
        }
        
        // Initial render
        renderMembers(members);
        
    } catch (error) {
        const container = document.getElementById('membersGrid');
        if (container) {
            container.innerHTML = `<p style="text-align: center; color: var(--danger); padding: 40px;">Error: ${error.message}</p>`;
        }
    }
});
