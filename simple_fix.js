// Simple bulk replacement for remaining corrupted Arabic
const fs = require('fs');

function simpleFix() {
    let content = fs.readFileSync('admin-script.js', 'utf8');
    
    // Simple replacements for remaining corrupted entries
    const replacements = {
        'Ø§Ù„ØªØ±ÙÙŠÙ‡': 'الترفيه',
        'Ø§Ù„Ø±ÙŠØ§Ø¶Ø© ÙˆØ§Ù„ØªØ±ÙÙŠÙ‡': 'الرياضة واللياقة', 
        'Ø§Ù„Ø³ÙØ± ÙˆØ§Ù„Ø³ÙŠØ§Ø­Ø©': 'السفر والسياحة',
        'Ø§Ù„Ø·Ø§Ù‚Ø© ÙˆØ§Ù„Ù…Ø±Ø§ÙÙ‚': 'الطاقة والمرافق',
        'Ø§Ù„ÙØ¹Ø§Ù„ÙŠØ§Øª ÙˆØ§Ù„Ù…Ø¤ØªÙ…Ø±Ø§Øª': 'الفعاليات والمؤتمرات'
    };
    
    let fixed = 0;
    for (const [corrupted, correct] of Object.entries(replacements)) {
        const before = content.length;
        content = content.replaceAll(corrupted, correct);
        const after = content.length;
        if (before !== after) {
            fixed++;
            console.log(`✅ Fixed: ${correct}`);
        }
    }
    
    fs.writeFileSync('admin-script.js', content, 'utf8');
    console.log(`\n🎉 Simple fix complete! Fixed ${fixed} entries.`);
}

simpleFix();
