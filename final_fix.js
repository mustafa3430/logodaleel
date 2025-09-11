// Final Arabic corrections
const fs = require('fs');

function finalFix() {
    let content = fs.readFileSync('admin-script.js', 'utf8');
    
    // Remaining corrupted text corrections based on CSV data
    const fixes = {
        "Ø§Ù„ØªØ±ÙÙŠÙ‡": "الترفيه والفعاليات",  // Entertainment
        "Ø§Ù„Ø±ÙŠØ§Ø¶Ø© ÙˆØ§Ù„ØªØ±ÙÙŠÙ‡": "الرياضة واللياقة",  // Sports & Recreation → Sports & Fitness
        "Ø§Ù„Ø³ÙØ± ÙˆØ§Ù„Ø³ÙŠØ§Ø­Ø©": "السفر والسياحة",  // Travel & Tourism
        "Ø§Ù„ØªØµÙ†ÙŠØ¹": "الصناعة",  // Manufacturing → Manufacturing & Industrial
        "Ø§Ù„Ø²Ø±Ø§Ø¹Ø©": "الزراعة",  // Agriculture
        "Ø§Ù„Ø·Ø§Ù‚Ø© ÙˆØ§Ù„Ù…Ø±Ø§ÙÙ‚": "الطاقة والمرافق",  // Energy & Utilities
        "Ø§Ù„Ø­ÙƒÙˆÙ…Ø© ÙˆØ§Ù„Ø®Ø¯Ù…Ø§Øª Ø§Ù„Ø¹Ø§Ù…Ø©": "الحكومة والخدمات العامة",  // Government & Public Services
        "Ø§Ù„Ù…Ù†Ø¸Ù…Ø§Øª ØºÙŠØ± Ø§Ù„Ø±Ø¨Ø­ÙŠØ©": "المنظمات غير الربحية",  // Non-Profit Organizations
        "Ø§Ù„Ø®Ø¯Ù…Ø§Øª Ø§Ù„Ø¯ÙŠÙ†ÙŠØ©": "الخدمات الدينية",  // Religious Services
        "Ø§Ù„Ø¥Ø¹Ù„Ø§Ù… ÙˆØ§Ù„Ø§ØªØµØ§Ù„Ø§Øª": "الإعلام والاتصالات",  // Media & Communications
        "Ø§Ù„Ù„ÙˆØ¬Ø³ØªÙŠØ§Øª ÙˆØ§Ù„ØªØ®Ø²ÙŠÙ†": "اللوجستيات والتخزين",  // Logistics & Warehousing
        "Ø§Ù„ÙØ¹Ø§Ù„ÙŠØ§Øª ÙˆØ§Ù„Ù…Ø¤ØªÙ…Ø±Ø§Øª": "الفعاليات والمؤتمرات",  // Events & Conferences
        "Ø®Ø¯Ù…Ø§Øª Ø§Ù„Ø£Ù…Ù†": "خدمات الأمن",  // Security Services
        "Ø®Ø¯Ù…Ø§Øª Ø§Ù„ØªÙ†Ø¸ÙŠÙ": "خدمات التنظيف"  // Cleaning Services
    };
    
    let fixCount = 0;
    for (const [corrupted, correct] of Object.entries(fixes)) {
        if (content.includes(corrupted)) {
            content = content.replace(new RegExp(corrupted, 'g'), correct);
            fixCount++;
            console.log(`Fixed: ${corrupted} -> ${correct}`);
        }
    }
    
    fs.writeFileSync('admin-script.js', content, 'utf8');
    console.log(`\nFinal fix complete! Applied ${fixCount} corrections.`);
}

finalFix();
