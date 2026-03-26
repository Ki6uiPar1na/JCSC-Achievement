// Contests page functionality

document.addEventListener('DOMContentLoaded', async () => {
    const contests = await loadContests();
    
    if (!contests) {
        showError('contestsContainer', 'Failed to load contests. Please check your configuration.');
        return;
    }
    
    // Debug: Show first contest structure
    if (contests.length > 0) {
        window.DEBUG_FIRST_CONTEST = contests[0];
    }

    let filteredContests = [...contests];

    // Display contests
    function displayContests(data) {
        const container = document.getElementById('contestsContainer');
        
        if (!data || data.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 40px;">No contests found.</p>';
            return;
        }

        // Function to parse date string into Date object
        function parseDate(dateString) {
            if (!dateString) return new Date(0);
            
            const trimmed = dateString.trim();
            
            // Format: M-DD-YYYY (4-17-2023)
            const dashFormat = trimmed.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
            if (dashFormat) {
                return new Date(dashFormat[3], parseInt(dashFormat[1]) - 1, dashFormat[2]);
            }
            
            // Format: "Month DD, YYYY" or "Month DD YYYY"
            const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                              'July', 'August', 'September', 'October', 'November', 'December'];
            const monthRegex = new RegExp(`(${monthNames.join('|')})\\s+(\\d{1,2})[,\\s]+(\\d{4})`, 'i');
            const monthMatch = trimmed.match(monthRegex);
            if (monthMatch) {
                const monthIndex = monthNames.findIndex(m => m.toLowerCase() === monthMatch[1].toLowerCase());
                return new Date(monthMatch[3], monthIndex, monthMatch[2]);
            }
            
            // Format: "DD Month YYYY"
            const dayMonthFormat = /^(\d{1,2})\s+([a-zA-Z]+)[,\s]+(\d{4})$/;
            const dayMonthMatch = trimmed.match(dayMonthFormat);
            if (dayMonthMatch) {
                const monthIndex = monthNames.findIndex(m => m.toLowerCase() === dayMonthMatch[2].toLowerCase());
                if (monthIndex !== -1) {
                    return new Date(dayMonthMatch[3], monthIndex, dayMonthMatch[1]);
                }
            }
            
            // Format: "YYYY-MM-DD"
            const isoFormat = trimmed.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
            if (isoFormat) {
                return new Date(isoFormat[1], parseInt(isoFormat[2]) - 1, isoFormat[3]);
            }
            
            // Format: "DD/MM/YYYY"
            const slashFormat = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
            if (slashFormat) {
                return new Date(slashFormat[3], parseInt(slashFormat[2]) - 1, slashFormat[1]);
            }
            
            // Fallback to generic Date parsing
            return new Date(dateString);
        }

        // Sort by date (newest first)
        data.sort((a, b) => {
            const dateA = parseDate(a.date);
            const dateB = parseDate(b.date);
            return dateB - dateA;
        });

        container.innerHTML = data.map(contest => {
            // Build winners section with badges
            const winners = [];
            
            if (contest.first && contest.first.trim()) {
                winners.push({
                    position: 'First',
                    names: contest.first.split(',').map(n => n.trim()),
                    badge: '🥇'
                });
            }
            
            if (contest.second && contest.second.trim()) {
                winners.push({
                    position: 'Second',
                    names: contest.second.split(',').map(n => n.trim()),
                    badge: '🥈'
                });
            }
            
            if (contest.third && contest.third.trim()) {
                winners.push({
                    position: 'Third',
                    names: contest.third.split(',').map(n => n.trim()),
                    badge: '🥉'
                });
            }
            
            if (contest.special_mention && contest.special_mention.trim()) {
                winners.push({
                    position: 'Special Mention',
                    names: contest.special_mention.split(',').map(n => n.trim()),
                    badge: '⭐'
                });
            }
            
            const winnersHTML = winners.map(winner => `
                <div class="contest-winner-group">
                    <span class="contest-position-badge ${winner.position.toLowerCase().replace(' ', '-')}">
                        ${winner.badge} ${winner.position}
                    </span>
                    <span class="contest-names">${winner.names.join(', ')}</span>
                </div>
            `).join('');
            
            return `
                <div class="contest-card">
                    <div class="contest-card-content">
                        <h3 class="contest-name">${escapeHtml(contest.name)}</h3>
                        ${contest.date ? `
                            <p class="contest-date">
                                <i class="fas fa-calendar"></i> ${escapeHtml(contest.date)}
                            </p>
                        ` : ''}
                        
                        ${winnersHTML ? `
                            <div class="contest-winners">
                                ${winnersHTML}
                            </div>
                        ` : `
                            <div class="contest-no-winners">
                                <p>No winners recorded yet</p>
                            </div>
                        `}
                        
                        ${contest.results_link && contest.results_link.trim() ? `
                            <div class="contest-footer">
                                <a href="${escapeHtml(contest.results_link)}" target="_blank" class="btn btn-primary">
                                    <i class="fas fa-link"></i> View Results
                                </a>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');
    }

    // Search functionality
    const searchInput = document.getElementById('contestSearch');
    if (searchInput) {
        searchInput.addEventListener('input', filterContests);
    }

    function filterContests() {
        const searchTerm = searchInput.value.toLowerCase();

        filteredContests = contests.filter(contest => {
            const matchesSearch = contest.name.toLowerCase().includes(searchTerm) ||
                                (contest.first && contest.first.toLowerCase().includes(searchTerm)) ||
                                (contest.second && contest.second.toLowerCase().includes(searchTerm)) ||
                                (contest.third && contest.third.toLowerCase().includes(searchTerm)) ||
                                (contest.special_mention && contest.special_mention.toLowerCase().includes(searchTerm));

            return matchesSearch;
        });

        displayContests(filteredContests);
    }

    // Initial display
    displayContests(contests);
});

function escapeHtml(text) {
    if (!text) return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}
