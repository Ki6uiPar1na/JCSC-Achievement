// Data Loader - Connects to Google Sheets (public export) or CSV files

// Configuration - Google Sheets export URL
const CONFIG = {
    // Your Google Spreadsheet ID
    SPREADSHEET_ID: '1OSCunbN68FsPtv-aYDs79l3deU7soCgd6fCXljQ9tkE',
    // Sheet names - IMPORTANT: These must match your actual sheet tab names!
    SHEETS: {
        ACHIEVEMENTS: 'Achievements',
        MEMBERS: 'Executive',
        ALUMNI: 'Alumni',
        EVENTS: 'Events',
        CONTESTS: 'Contests'
    }
};

// Global data cache
const dataCache = {
    achievements: null,
    members: null,
    alumni: null,
    events: null,
    contests: null
};

// Fetch data from Google Sheets using public export CSV format
async function fetchSheetData(sheetName) {
    try {
        const url = `https://docs.google.com/spreadsheets/d/${CONFIG.SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet=${sheetName}`;
        
        const response = await fetch(url, {
            method: 'GET',
            mode: 'cors',
            credentials: 'omit',
            headers: {
                'Accept': 'text/csv, */*'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const csv = await response.text();
        
        if (csv && csv.trim().length > 0) {
            const parsed = parseCSVData(csv);
            return parsed;
        } else {
            throw new Error('Empty CSV');
        }
        
    } catch (error) {
        return null;
    }
}

// Parse CSV data into objects
function parseCSVData(csv) {
    const lines = csv.split('\n').filter(line => line.trim());
    if (lines.length === 0) return [];
    
    // Parse header row - keep original names for matching
    const rawHeaders = parseCSVLine(lines[0]);
    const headers = rawHeaders.map(h => {
        return h.toLowerCase().replace(/[^a-z0-9_]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
    });
    
    const headerMap = {};
    rawHeaders.forEach((raw, i) => {
        headerMap[headers[i]] = raw;
    });
    
    // Parse data rows - skip any row that looks like a header row
    return lines.slice(1).map((line, index) => {
        const values = parseCSVLine(line);
        if (!values.some(v => v.trim())) return null; // Skip empty rows
        
        // Skip rows that look like headers (contain the same values as the header row)
        const isHeaderRow = values.some((val, i) => {
            return val.toLowerCase() === rawHeaders[i].toLowerCase();
        });
        if (isHeaderRow) {
            return null;
        }
        
        const obj = {};
        headers.forEach((normalizedHeader, i) => {
            // Store both the normalized and original value
            obj[normalizedHeader] = values[i] || '';
            // Also store with original header name for compatibility
            const rawHeader = rawHeaders[i];
            if (rawHeader && rawHeader !== normalizedHeader) {
                obj[rawHeader] = values[i] || '';
            }
        });
        return obj;
    }).filter(obj => obj !== null);
}

// Helper function to parse CSV line handling quoted strings
function parseCSVLine(line) {
    const values = [];
    let currentValue = '';
    let insideQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        const nextChar = line[i + 1];
        
        if (char === '"') {
            if (insideQuotes && nextChar === '"') {
                // Escaped quote
                currentValue += '"';
                i++;
            } else {
                // Toggle quote state
                insideQuotes = !insideQuotes;
            }
        } else if (char === ',' && !insideQuotes) {
            values.push(currentValue.trim());
            currentValue = '';
        } else {
            currentValue += char;
        }
    }
    values.push(currentValue.trim());
    return values;
}

// Load achievements data
async function loadAchievements() {
    if (dataCache.achievements) {
        return dataCache.achievements;
    }

    // Try to load from Google Sheets first
    let data = await fetchSheetData(CONFIG.SHEETS.ACHIEVEMENTS);

    // Final fallback to embedded sample data
    if (!data || data.length === 0) {
        data = typeof SAMPLE_DATA !== 'undefined' ? SAMPLE_DATA.achievements : [];
    }
    
    if (data && data.length > 0) {
    }
    
    // Apply custom mapping if achievements-mapping.js is loaded
    if (typeof mapAchievementRow === 'function' && data && data.length > 0) {
        data = data.map(mapAchievementRow).filter(item => item !== null);
    }
    
    dataCache.achievements = data;
    return data;
}

// Load executive members data
async function loadMembers() {
    if (dataCache.members) {
        return dataCache.members;
    }
    
    
    // Try to load from Google Sheets first
    let data = await fetchSheetData(CONFIG.SHEETS.MEMBERS);
    
    
    // Final fallback to embedded sample data
    if (!data || data.length === 0) {
        data = typeof SAMPLE_DATA !== 'undefined' ? SAMPLE_DATA.members : [];
    }
    
    if (data && data.length > 0) {
    }
    
    dataCache.members = data;
    return data;
}

// Load alumni data
async function loadAlumni() {
    if (dataCache.alumni) {
        return dataCache.alumni;
    }
    
    
    // Try to load from Google Sheets first
    let data = await fetchSheetData(CONFIG.SHEETS.ALUMNI);
    
    // Final fallback to embedded sample data
    if (!data || data.length === 0) {
        data = typeof SAMPLE_DATA !== 'undefined' ? SAMPLE_DATA.alumni : [];
    }
    
    if (data && data.length > 0) {
    }
    
    dataCache.alumni = data;
    return data;
}

// Load events data
async function loadEvents() {
    if (dataCache.events) {
        return dataCache.events;
    }
    
    
    // Try to load from Google Sheets first
    let data = await fetchSheetData(CONFIG.SHEETS.EVENTS);
    
    // Final fallback to embedded sample data
    if (!data || data.length === 0) {
        data = typeof SAMPLE_DATA !== 'undefined' ? SAMPLE_DATA.events : [];
    }
    
    if (data && data.length > 0) {
    }
    
    dataCache.events = data;
    return data;
}

// Load contests data
async function loadContests() {
    if (dataCache.contests) {
        return dataCache.contests;
    }
    
    
    // Try to load from Google Sheets first
    let data = await fetchSheetData(CONFIG.SHEETS.CONTESTS);
    
    // Final fallback to embedded sample data
    if (!data || data.length === 0) {
        data = typeof SAMPLE_DATA !== 'undefined' ? SAMPLE_DATA.contests : [];
    }
    
    if (data && data.length > 0) {
    }
    
    dataCache.contests = data;
    return data;
}

// Alternative: Load data from CSV files (for testing or offline use)
async function loadFromCSV(filename) {
    try {
        const response = await fetch(`data/${filename}.csv`);
        if (!response.ok) {
            return null;
        }
        const text = await response.text();
        if (!text || text.trim().length === 0) {
            return null;
        }
        const data = parseCSVData(text);
        return data;
    } catch (error) {
        return null;
    }
}

// Initialize data on homepage
if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/Website/')) {
    document.addEventListener('DOMContentLoaded', async () => {
        // Load key achievements with prize money (random 3)
        const achievements = await loadAchievements();
        if (achievements && achievements.length > 0) {
            // Filter achievements that have prize money
            const achievementsWithPrize = achievements.filter(a => a.prize && a.prize.trim());
            
            // Shuffle array to randomize
            const shuffled = achievementsWithPrize.sort(() => 0.5 - Math.random());
            
            // Get first 3 random achievements with prize
            const randomAchievements = shuffled.slice(0, 3);
            
            // If we have less than 3, add more from all achievements
            if (randomAchievements.length < 3) {
                const remaining = achievements
                    .filter(a => !randomAchievements.includes(a))
                    .sort(() => 0.5 - Math.random())
                    .slice(0, 3 - randomAchievements.length);
                randomAchievements.push(...remaining);
            }
            
            displayKeyAchievements(randomAchievements);
        }

        // Load upcoming events (top 3)
        const events = await loadEvents();
        if (events && events.length > 0) {
            const upcomingEvents = events
                .filter(event => isUpcoming(event.date))
                .slice(0, 3);
            displayUpcomingEvents(upcomingEvents);
        }
    });
}

function displayKeyAchievements(achievements) {
    const container = document.getElementById('keyAchievementsGrid');
    if (!container) return;
    
    if (!achievements || achievements.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No achievements to display yet.</p>';
        return;
    }
    
    container.innerHTML = achievements.map(achievement => `
        <div class="achievement-card">
            ${achievement.image_url ? `<img src="${achievement.image_url}" alt="${achievement.title}" class="card-image">` : ''}
            <div class="card-content">
                <h3 class="card-title">${achievement.title}</h3>
                <p class="card-date"><i class="fas fa-calendar"></i> ${formatDate(achievement.date)}</p>
                <p class="card-description">${achievement.description}</p>
            </div>
        </div>
    `).join('');
}

function displayUpcomingEvents(events) {
    const container = document.getElementById('upcomingEventsGrid');
    if (!container) return;
    
    if (!events || events.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No upcoming events at the moment.</p>';
        return;
    }
    
    container.innerHTML = events.map(event => `
        <div class="event-card">
            ${event.image_url ? `<img src="${event.image_url}" alt="${event.title}" class="card-image">` : ''}
            <div class="card-content">
                <h3 class="card-title">${event.title}</h3>
                <p class="card-date"><i class="fas fa-calendar"></i> ${formatDate(event.date)}</p>
                <p class="card-description">${event.description}</p>
            </div>
        </div>
    `).join('');
}
