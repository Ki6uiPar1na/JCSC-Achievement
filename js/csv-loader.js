// Alternative data loader using CSV export (works without API key!)
// This is a fallback method when API key is not configured

// Store the original fetchSheetData when it gets defined
let originalFetchSheetData = null;

// CSV fetch function
async function fetchSheetAsCSV(sheetName, gid) {
    try {
        const spreadsheetId = typeof CONFIG !== 'undefined' ? CONFIG.SPREADSHEET_ID : '1OSCunbN68FsPtv-aYDs79l3deU7soCgd6fCXljQ9tkE';
        const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv&gid=${gid}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const text = await response.text();
        return parseCSVText(text);
    } catch (error) {
        return null;
    }
}

function parseCSVText(csv) {
    const lines = csv.split('\n').filter(line => line.trim());
    if (lines.length === 0) return [];
    
    // Parse CSV properly (handle quoted values)
    const parseCSVLine = (line) => {
        const result = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        result.push(current.trim());
        return result;
    };
    
    const headers = parseCSVLine(lines[0]).map(h => h.toLowerCase().replace(/\s+/g, '_').replace(/\(|\)/g, ''));
    
    return lines.slice(1).map(line => {
        const values = parseCSVLine(line);
        const obj = {};
        headers.forEach((header, index) => {
            obj[header] = values[index] || '';
        });
        return obj;
    }).filter(obj => Object.values(obj).some(v => v));
}

// Sheet GIDs (get these from the sheet URLs or use 0 for first sheet)
const SHEET_GIDS = {
    ACHIEVEMENTS: 0,
    ALUMNI: 2054436441,
    EXECUTIVE: 0,
    EVENTS: 1158896650,
    CONTEST: 0
};

// Intercept and override fetchSheetData when it's defined
Object.defineProperty(window, 'fetchSheetData', {
    get: function() {
        return originalFetchSheetData;
    },
    set: function(fn) {
        originalFetchSheetData = fn;
        
        // Create override function
        window.fetchSheetData = async function(sheetName) {
            const config = typeof CONFIG !== 'undefined' ? CONFIG : window.CONFIG;
            
            // If API key is configured, use original method
            if (config && config.API_KEY && config.API_KEY !== 'YOUR_API_KEY') {
                return originalFetchSheetData(sheetName);
            }
            
            // Otherwise, use CSV export method
            
            const gidMap = {
                'Achievements': SHEET_GIDS.ACHIEVEMENTS,
                'Alumni': SHEET_GIDS.ALUMNI,
                'Current Executive Body': SHEET_GIDS.EXECUTIVE,
                'Events': SHEET_GIDS.EVENTS,
                'Contest': SHEET_GIDS.CONTEST
            };
            
            const gid = gidMap[sheetName] !== undefined ? gidMap[sheetName] : 0;
            return await fetchSheetAsCSV(sheetName, gid);
        };
    },
    configurable: true
});

