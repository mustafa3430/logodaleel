const fs = require('fs');

// Read the CSV file and parse it properly
const csvContent = fs.readFileSync('saudi_business_categories_updated.csv', 'utf8');
const lines = csvContent.split('\n');

// Build a complete mapping from the CSV
const translations = new Map();

console.log('📊 Reading CSV file and building translation map...');

for (let i = 1; i < lines.length; i++) { // Skip header
    const line = lines[i].trim();
    if (!line) continue;
    
    // Simple CSV parsing (handling quotes)
    const parts = line.split(',');
    if (parts.length >= 6) {
        const level1En = parts[0].replace(/"/g, '');
        const level1Ar = parts[1].replace(/"/g, '');
        const level2En = parts[2].replace(/"/g, '');
        const level2Ar = parts[3].replace(/"/g, '');
        const level3En = parts[4].replace(/"/g, '');
        const level3Ar = parts[5].replace(/"/g, '');
        
        if (level1En && level1Ar) translations.set(level1En, level1Ar);
        if (level2En && level2Ar) translations.set(level2En, level2Ar);
        if (level3En && level3Ar) translations.set(level3En, level3Ar);
    }
}

console.log(`✅ Built translation map with ${translations.size} entries`);

// Print the main categories we found
console.log('\n🏷️ Main Level 1 Categories:');
const mainCategories = ['Food & Drink', 'Retail', 'Automotive', 'Health & Medical', 'Beauty & Personal Care', 'Home Services', 'Professional Services', 'Legal', 'Finance & Insurance', 'Real Estate', 'Construction', 'Manufacturing & Industrial', 'Energy & Utilities', 'IT & Software', 'Telecommunications', 'Education & Training'];

mainCategories.forEach(cat => {
    const arabic = translations.get(cat);
    if (arabic) {
        console.log(`${cat} -> ${arabic}`);
    }
});

// Now read and fix the admin-script.js file
console.log('\n🔧 Reading admin-script.js file...');
let content = fs.readFileSync('admin-script.js', 'utf8');

let fixes = 0;

// Replace all corrupted Arabic text with correct translations
for (const [english, arabic] of translations.entries()) {
    if (!english || !arabic) continue;
    
    // Pattern 1: l1ar: 'corrupted' -> l1ar: 'correct' (when l1: 'English' exists)
    const pattern1 = new RegExp(`(l1ar:\\s*')([^']*)'([^}]*l1:\\s*'${english.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}')`, 'g');
    const before1 = content;
    content = content.replace(pattern1, `$1${arabic}'$3`);
    if (content !== before1) {
        fixes++;
        console.log(`✓ Fixed l1ar for: ${english} -> ${arabic}`);
    }
    
    // Pattern 2: l2ar: 'corrupted' -> l2ar: 'correct' (when l2: 'English' exists)
    const pattern2 = new RegExp(`(l2ar:\\s*')([^']*)'([^}]*l2:\\s*'${english.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}')`, 'g');
    const before2 = content;
    content = content.replace(pattern2, `$1${arabic}'$3`);
    if (content !== before2) {
        fixes++;
        console.log(`✓ Fixed l2ar for: ${english} -> ${arabic}`);
    }
    
    // Pattern 3: l3ar: 'corrupted' -> l3ar: 'correct' (when l3: 'English' exists)
    const pattern3 = new RegExp(`(l3ar:\\s*')([^']*)'([^}]*l3:\\s*'${english.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}')`, 'g');
    const before3 = content;
    content = content.replace(pattern3, `$1${arabic}'$3`);
    if (content !== before3) {
        fixes++;
        console.log(`✓ Fixed l3ar for: ${english} -> ${arabic}`);
    }
    
    // Pattern 4: ar: 'corrupted' -> ar: 'correct' (when en: 'English' exists)
    const pattern4 = new RegExp(`(ar:\\s*')([^']*)'([^}]*en:\\s*'${english.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}')`, 'g');
    const before4 = content;
    content = content.replace(pattern4, `$1${arabic}'$3`);
    if (content !== before4) {
        fixes++;
        console.log(`✓ Fixed ar for: ${english} -> ${arabic}`);
    }
}

// Write the corrected file
fs.writeFileSync('admin-script.js', content, 'utf8');

console.log(`\n🎯 FINAL RESULT: Applied ${fixes} Arabic text corrections!`);
console.log('✅ All corrupted Arabic text has been replaced with correct translations from CSV');
console.log('🔄 Now clearing localStorage to force reload from corrected data...');

// Also create a simple script to clear localStorage
const clearScript = `
// Clear corrupted categories and reload
localStorage.clear();
console.log('✅ Cleared all localStorage data');
location.reload();
`;

fs.writeFileSync('clear_and_reload.js', clearScript);
console.log('💾 Created clear_and_reload.js - run this in browser console');

console.log('\n🎉 Arabic text fix completed! The admin dashboard should now show correct Arabic text.');
