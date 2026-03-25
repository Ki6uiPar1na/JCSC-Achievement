// Direct CSV loader - replaces the complex fetchSheetData override
// This version is loaded AFTER data-loader.js and directly replaces the function

(function() {
    
    // Store original function
    const originalFetchSheetData = window.fetchSheetData;
    
    // CSV parsing function
    function parseCSV(csv) {
        const lines = csv.split('\n').filter(line => line.trim());
        if (lines.length === 0) return [];
        
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
        
        const headers = parseCSVLine(lines[0]).map(h => 
            h.toLowerCase().replace(/\s+/g, '_').replace(/\(|\)/g, '')
        );
        
        return lines.slice(1).map(line => {
            const values = parseCSVLine(line);
            const obj = {};
            headers.forEach((header, index) => {
                obj[header] = values[index] || '';
            });
            return obj;
        }).filter(obj => Object.values(obj).some(v => v));
    }
    
    // Sheet GID mapping
    const SHEET_GIDS = {
        'Achievements': 0,
        'Alumni': 2054436441,
        'Current Executive Body': 107127067,
        'Events': 1158896650,
        'Contests': 646403325
    };
    
    // New fetchSheetData using CSV
    window.fetchSheetData = async function(sheetName) {
        
        const gid = SHEET_GIDS[sheetName] !== undefined ? SHEET_GIDS[sheetName] : 0;
        const url = `https://docs.google.com/spreadsheets/d/${CONFIG.SPREADSHEET_ID}/gviz/tq?tqx=out:csv&gid=${gid}`;
        
        try {
            const response = await fetch(url);
            
            if (!response.ok) {
                return null;
            }
            
            const text = await response.text();
            
            const data = parseCSV(text);
            
            return data;
        } catch (error) {
            return null;
        }
    };
    
})();
