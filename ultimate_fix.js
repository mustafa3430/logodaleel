// Ultimate Arabic fix
const fs = require('fs');

function ultimateFix() {
    let content = fs.readFileSync('admin-script.js', 'utf8');
    
    // All remaining corrupted entries
    const allFixes = [
        ['Ø§Ù„ØªØ±ÙÙŠÙ‡', 'الترفيه'],
        ['Ø§Ù„Ø±ÙŠØ§Ø¶Ø© ÙˆØ§Ù„ØªØ±ÙÙŠÙ‡', 'الرياضة واللياقة'],
        ['Ø§Ù„Ø³ÙØ± ÙˆØ§Ù„Ø³ÙŠØ§Ø­Ø©', 'السفر والسياحة'],
        ['Ø§Ù„Ø·Ø§Ù‚Ø© ÙˆØ§Ù„Ù…Ø±Ø§ÙÙ‚', 'الطاقة والمرافق'],
        ['Ø§Ù„ÙØ¹Ø§Ù„ÙŠØ§Øª ÙˆØ§Ù„Ù…Ø¤ØªÙ…Ø±Ø§Øª', 'الفعاليات والمؤتمرات']
    ];
    
    let fixCount = 0;
    for (const [corrupted, correct] of allFixes) {
        if (content.includes(corrupted)) {
            content = content.replace(new RegExp(corrupted, 'g'), correct);
            fixCount++;
            console.log(`Fixed: ${corrupted} -> ${correct}`);
        }
    }
    
    fs.writeFileSync('admin-script.js', content, 'utf8');
    console.log(`\nUltimate fix complete! Applied ${fixCount} corrections.`);
    
    // Check for any remaining corrupted text
    const corruptedPattern = /[ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ]/g;
    const remaining = content.match(corruptedPattern);
    if (remaining) {
        console.log(`Warning: ${remaining.length} corrupted characters still found.`);
    } else {
        console.log('✅ No more corrupted Arabic characters found!');
    }
}

ultimateFix();
