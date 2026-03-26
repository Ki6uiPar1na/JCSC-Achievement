// Helper function to get field value from row with multiple possible column names
function getField(row, possibleNames) {
    if (!row) return '';
    
    // Try each possible name
    for (let name of possibleNames) {
        if (row[name]) {
            return row[name];
        }
    }
    
    // Try normalized versions
    for (let name of possibleNames) {
        const normalized = name.toLowerCase().replace(/[^a-z0-9_]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
        if (row[normalized]) {
            return row[normalized];
        }
    }
    
    return '';
}

// Helper function to map achievements data to website format
function mapAchievementRow(row) {
    if (!row) return null;
    
    // Try to get title from any of these possible column names
    // Google Sheets has: Title
    const title = getField(row, ['Title', 'title', 'Achievement', 'achievement']);
    
    // Skip rows with no title
    if (!title || !title.trim()) {
        return null;
    }
    
    // Skip header rows (if title field contains "Title" text)
    if (title.toLowerCase() === 'title' || title.toLowerCase() === 'achievement') {
        return null;
    }
    
    // Get description
    const description = getField(row, ['Description', 'description']);
    
    // Get date
    const date = getField(row, ['Date', 'date']);
    
    // Get position - Google Sheets has: Position (e.g., 1st Place, 2nd Place, etc.)
    const position = getField(row, [
        'Position', 'position',
        'Rank', 'rank',
        'Award', 'award'
    ]);
    
    // Get image URL - Google Sheets has: Image_URL(optional)
    const image_url = getField(row, [
        'Image_URL', 'image_url',
        'Image_URL(optional)', 'image_url_optional',
        'Image', 'image'
    ]);
    
    // Get members - Google Sheets has: Members Names(Comma Separated)
    const members = getField(row, [
        'Members', 'members',
        'Members Names(Comma Separated)', 'members_names_comma_separated',
        'Team', 'team'
    ]);
    
    // Get team name - Google Sheets has: Team_name
    const team_name = getField(row, [
        'Team_name', 'team_name',
        'Team Name', 'team_name',
        'Team Name(if any)', 'team_name_if_any'
    ]);
    
    // Get prize - Google Sheets has: Prize Money(if any)
    const prize = getField(row, [
        'Prize', 'prize',
        'Prize Money(if any)', 'prize_money_if_any',
        'Reward', 'reward'
    ]);
    
    return {
        title: title.trim(),
        description: description.trim(),
        date: date,
        position: position,  // Add position field
        image_url: image_url,
        members: members,  // Add as separate field
        team_name: team_name,  // Add team name field
        prize: prize       // Add as separate field
    };
}
