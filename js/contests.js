// Contests page functionality

document.addEventListener('DOMContentLoaded', async () => {
    const contests = await loadContests();
    
    if (!contests) {
        showError('contestsContainer', 'Failed to load contests. Please check your configuration.');
        return;
    }

    let filteredContests = [...contests];

    // Display contests
    function displayContests(data) {
        const container = document.getElementById('contestsContainer');
        
        if (!data || data.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 40px;">No contests found.</p>';
            return;
        }

        // Sort by date (newest first)
        data.sort((a, b) => {
            const dateA = a.date ? new Date(a.date) : new Date(0);
            const dateB = b.date ? new Date(b.date) : new Date(0);
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
