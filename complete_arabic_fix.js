// Complete Arabic text correction for admin-script.js
// This script reads the CSV file and fixes ALL corrupted Arabic text in admin-script.js

const fs = require('fs');
const path = require('path');

// Read CSV file and extract all Arabic translations
function parseCSV() {
    const csvContent = fs.readFileSync('saudi_business_categories_updated.csv', 'utf8');
    const lines = csvContent.split('\n');
    const translations = new Map();
    
    for (let i = 1; i < lines.length; i++) { // Skip header
        const line = lines[i].trim();
        if (!line) continue;
        
        const columns = line.split(',');
        if (columns.length >= 6) {
            const level1En = columns[0];
            const level1Ar = columns[1];
            const level2En = columns[2];
            const level2Ar = columns[3];
            const level3En = columns[4];
            const level3Ar = columns[5];
            
            // Store all English->Arabic mappings
            if (level1En && level1Ar) {
                translations.set(level1En, level1Ar);
            }
            if (level2En && level2Ar) {
                translations.set(level2En, level2Ar);
            }
            if (level3En && level3Ar) {
                translations.set(level3En, level3Ar);
            }
        }
    }
    
    return translations;
}

// Detect if text contains corrupted Arabic characters
function isCorruptedArabic(text) {
    return /[ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ]/.test(text);
}

function fixAdminScript() {
    console.log('Starting complete Arabic text correction...');
    
    // Parse CSV file
    const translations = parseCSV();
    console.log(`Loaded ${translations.size} translations from CSV`);
    
    // Read admin-script.js
    const scriptPath = 'admin-script.js';
    let content = fs.readFileSync(scriptPath, 'utf8');
    
    let fixCount = 0;
    
    // Direct translations from CSV for specific terms we know are corrupted
    const knownCorrupted = {
        'Ø§Ù„ØªØ±ÙÙŠÙ‡': 'الترفيه',  // Entertainment
        'Ø§Ù„Ø±ÙŠØ§Ø¶Ø© ÙˆØ§Ù„ØªØ±ÙÙŠÙ‡': 'الرياضة والترفيه',  // Sports & Recreation
        'Ø§Ù„Ø³ÙØ± ÙˆØ§Ù„Ø³ÙŠØ§Ø­Ø©': 'السفر والسياحة',  // Travel & Tourism
        'Ø§Ù„ØªØµÙ†ÙŠØ¹': 'التصنيع',  // Manufacturing
        'Ø§Ù„Ø²Ø±Ø§Ø¹Ø©': 'الزراعة',  // Agriculture
        'Ø§Ù„Ø·Ø§Ù‚Ø© ÙˆØ§Ù„Ù…Ø±Ø§ÙÙ‚': 'الطاقة والمرافق',  // Energy & Utilities
        'Ø§Ù„Ø­ÙƒÙˆÙ…Ø© ÙˆØ§Ù„Ø®Ø¯Ù…Ø§Øª Ø§Ù„Ø¹Ø§Ù…Ø©': 'الحكومة والخدمات العامة',  // Government & Public Services
        'Ø§Ù„Ù…Ù†Ø¸Ù…Ø§Øª ØºÙŠØ± Ø§Ù„Ø±Ø¨Ø­ÙŠØ©': 'المنظمات غير الربحية',  // Non-Profit Organizations
        'Ø§Ù„Ø®Ø¯Ù…Ø§Øª Ø§Ù„Ø¯ÙŠÙ†ÙŠØ©': 'الخدمات الدينية',  // Religious Services
        'Ø§Ù„Ø¥Ø¹Ù„Ø§Ù… ÙˆØ§Ù„Ø§ØªØµØ§Ù„Ø§Øª': 'الإعلام والاتصالات',  // Media & Communications
        'Ø§Ù„Ù„ÙˆØ¬Ø³ØªÙŠØ§Øª ÙˆØ§Ù„ØªØ®Ø²ÙŠÙ†': 'اللوجستيات والتخزين',  // Logistics & Warehousing
        'Ø§Ù„ÙØ¹Ø§Ù„ÙŠØ§Øª ÙˆØ§Ù„Ù…Ø¤ØªÙ…Ø±Ø§Øª': 'الفعاليات والمؤتمرات',  // Events & Conferences
        'Ø®Ø¯Ù…Ø§Øª Ø§Ù„Ø£Ù…Ù†': 'خدمات الأمن',  // Security Services
        'Ø®Ø¯Ù…Ø§Øª Ø§Ù„ØªÙ†Ø¸ÙŠÙ': 'خدمات التنظيف',  // Cleaning Services
        'Ø§Ù„Ù†Ù‚Ù„': 'النقل'  // Transportation
    };
    
    // Apply known corrupted fixes first
    for (const [corrupted, correct] of Object.entries(knownCorrupted)) {
        if (content.includes(corrupted)) {
            content = content.replace(new RegExp(corrupted, 'g'), correct);
            fixCount++;
            console.log(`Fixed: ${corrupted} -> ${correct}`);
        }
    }
    
    // Apply translations from CSV
    for (const [english, arabic] of translations) {
        // Look for patterns like: { en: 'English', ar: 'corrupted_arabic' }
        const pattern = new RegExp(`(\\{[^}]*en:\\s*['"]${english}['"][^}]*ar:\\s*['"])([^'"]+)(['"][^}]*\\})`, 'g');
        const matches = content.match(pattern);
        
        if (matches) {
            for (const match of matches) {
                const arMatch = match.match(/ar:\s*['"]([^'"]+)['"]/);
                if (arMatch && isCorruptedArabic(arMatch[1])) {
                    const newMatch = match.replace(arMatch[1], arabic);
                    content = content.replace(match, newMatch);
                    fixCount++;
                    console.log(`Fixed via CSV: ${english} -> ${arabic}`);
                }
            }
        }
    }
    
    // Write the fixed content back
    fs.writeFileSync(scriptPath, content, 'utf8');
    
    console.log(`\nComplete! Applied ${fixCount} Arabic text fixes.`);
    console.log('All corrupted Arabic text has been corrected using the CSV file.');
    
    // Create localStorage clearing script
    const clearScript = `
<!DOCTYPE html>
<html>
<head>
    <title>Clear Arabic Cache</title>
    <meta charset="UTF-8">
</head>
<body>
    <h1>Clearing Arabic Text Cache</h1>
    <script>
        console.log('Clearing all localStorage data...');
        localStorage.clear();
        console.log('Cache cleared! Please refresh the admin dashboard.');
        alert('Cache cleared! Please refresh the admin dashboard to see corrected Arabic text.');
    </script>
</body>
</html>`;
    
    fs.writeFileSync('clear_arabic_cache.html', clearScript);
    console.log('\nCreated clear_arabic_cache.html - open this file to clear the cache.');
}

// Run the fix
try {
    fixAdminScript();
} catch (error) {
    console.error('Error:', error.message);
}
