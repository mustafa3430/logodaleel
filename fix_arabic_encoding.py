import re

# Read the file
with open('admin-script.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Comprehensive Arabic text corrections
# These are the correct Arabic translations for the corrupted text
replacements = {
    # Healthcare section
    'Ø§Ù„Ø±Ø¹Ø§ÙŠØ© Ø§Ù„ØµØ­ÙŠØ©': 'الرعاية الصحية',  # Healthcare
    'Ø±Ø¹Ø§ÙŠØ© Ø§Ù„Ø£Ø³Ù†Ø§Ù†': 'رعاية الأسنان',  # Dental Care
    'Ø·Ø¨ Ø§Ù„Ø£Ø³Ù†Ø§Ù† Ø§Ù„Ø¹Ø§Ù…': 'طب الأسنان العام',  # General Dentistry
    'ØµÙŠØ¯Ù„ÙŠØ©': 'صيدلية',  # Pharmacy
    'ØµÙŠØ¯Ù„ÙŠØ© ØªØ¬Ø²Ø¦Ø©': 'صيدلية تجزئة',  # Retail Pharmacy
    
    # Retail section
    'Ø§Ù„ØªØ¬Ø²Ø¦Ø©': 'التجزئة',  # Retail
    'Ø§Ù„Ù…Ù„Ø§Ø¨Ø³': 'الملابس',  # Clothing
    'Ø§Ù„Ù…Ù„Ø§Ø¨Ø³ Ø§Ù„ØªÙ‚Ù„ÙŠØ¯ÙŠØ©': 'الملابس التقليدية',  # Traditional Clothing
    'Ø§Ù„Ø¥Ù„ÙƒØªØ±ÙˆÙ†ÙŠØ§Øª': 'الإلكترونيات',  # Electronics
    'Ø§Ù„Ù‡ÙˆØ§ØªÙ Ø§Ù„Ù…Ø­Ù…ÙˆÙ„Ø©': 'الهواتف المحمولة',  # Mobile Phones
    'Ø§Ù„Ø¨Ù‚Ø§Ù„Ø©': 'البقالة',  # Groceries
    'Ø§Ù„Ø³ÙˆØ¨Ø± Ù…Ø§Ø±ÙƒØª': 'السوبر ماركت',  # Supermarkets
    
    # Automotive section
    'Ø§Ù„Ø³ÙŠØ§Ø±Ø§Øª': 'السيارات',  # Automotive
    'Ø¨ÙŠØ¹ Ø§Ù„Ø³ÙŠØ§Ø±Ø§Øª': 'بيع السيارات',  # Car Sales
    'Ø§Ù„Ø³ÙŠØ§Ø±Ø§Øª Ø§Ù„Ø¬Ø¯ÙŠØ¯Ø©': 'السيارات الجديدة',  # New Cars
    'Ø®Ø¯Ù…Ø§Øª Ø§Ù„Ø³ÙŠØ§Ø±Ø§Øª': 'خدمات السيارات',  # Car Services
    'Ø§Ù„ØµÙŠØ§Ù†Ø©': 'الصيانة',  # Maintenance
    
    # Education section
    'Ø§Ù„ØªØ¹Ù„ÙŠÙ…': 'التعليم',  # Education
    'Ø§Ù„Ù…Ø¯Ø§Ø±Ø³': 'المدارس',  # Schools
    'Ø§Ù„Ù…Ø¯Ø§Ø±Ø³ Ø§Ù„Ø®Ø§ØµØ©': 'المدارس الخاصة',  # Private Schools
    'Ø§Ù„Ø¬Ø§Ù…Ø¹Ø§Øª': 'الجامعات',  # Universities
    'Ø§Ù„Ø¬Ø§Ù…Ø¹Ø§Øª Ø§Ù„Ø®Ø§ØµØ©': 'الجامعات الخاصة',  # Private Universities
    
    # Business Services section
    'Ø§Ù„Ø®Ø¯Ù…Ø§Øª Ø§Ù„ØªØ¬Ø§Ø±ÙŠØ©': 'الخدمات التجارية',  # Business Services
    'Ø§Ù„Ø§Ø³ØªØ´Ø§Ø±Ø§Øª': 'الاستشارات',  # Consulting
    'Ø§Ù„Ø§Ø³ØªØ´Ø§Ø±Ø§Øª Ø§Ù„Ø¥Ø¯Ø§Ø±ÙŠØ©': 'الاستشارات الإدارية',  # Management Consulting
    'Ø§Ù„Ø®Ø¯Ù…Ø§Øª Ø§Ù„Ù‚Ø§Ù†ÙˆÙ†ÙŠØ©': 'الخدمات القانونية',  # Legal Services
    'Ù…ÙƒØ§ØªØ¨ Ø§Ù„Ù…Ø­Ø§Ù…Ø§Ø©': 'مكاتب المحاماة',  # Law Firms
    
    # Construction section
    'Ø§Ù„Ø¨Ù†Ø§Ø¡': 'البناء',  # Construction
    'Ø§Ù„Ù…Ù‚Ø§ÙˆÙ„Ø§Øª Ø§Ù„Ø¹Ø§Ù…Ø©': 'المقاولات العامة',  # General Contracting
    'Ø§Ù„Ø¨Ù†Ø§Ø¡ Ø§Ù„Ø³ÙƒÙ†ÙŠ': 'البناء السكني',  # Residential Construction
    'Ø§Ù„Ø­Ø±Ù Ø§Ù„Ù…ØªØ®ØµØµØ©': 'الحرف المتخصصة',  # Specialized Trades
    'Ø§Ù„Ø£Ø¹Ù…Ø§Ù„ Ø§Ù„ÙƒÙ‡Ø±Ø¨Ø§Ø¦ÙŠØ©': 'الأعمال الكهربائية',  # Electrical Work
    
    # Real Estate section
    'Ø§Ù„Ø¹Ù‚Ø§Ø±Ø§Øª': 'العقارات',  # Real Estate
    'Ø¨ÙŠØ¹ Ø§Ù„Ø¹Ù‚Ø§Ø±Ø§Øª': 'بيع العقارات',  # Property Sales
    'Ø¨ÙŠØ¹ Ø§Ù„Ø¹Ù‚Ø§Ø±Ø§Øª Ø§Ù„Ø³ÙƒÙ†ÙŠØ©': 'بيع العقارات السكنية',  # Residential Sales
    'Ø¥Ø¯Ø§Ø±Ø© Ø§Ù„Ø¹Ù‚Ø§Ø±Ø§Øª': 'إدارة العقارات',  # Property Management
    'Ø¥Ø¯Ø§Ø±Ø© Ø§Ù„Ø¥ÙŠØ¬Ø§Ø±Ø§Øª': 'إدارة الإيجارات',  # Rental Management
    
    # Technology section
    'Ø§Ù„ØªÙƒÙ†ÙˆÙ„ÙˆØ¬ÙŠØ§': 'التكنولوجيا',  # Technology
    'ØªØ·ÙˆÙŠØ± Ø§Ù„Ø¨Ø±Ù…Ø¬ÙŠØ§Øª': 'تطوير البرمجيات',  # Software Development
    'ØªØ·ÙˆÙŠØ± Ø§Ù„Ù…ÙˆØ§Ù‚Ø¹': 'تطوير المواقع',  # Web Development
    'Ø®Ø¯Ù…Ø§Øª ØªÙ‚Ù†ÙŠØ© Ø§Ù„Ù…Ø¹Ù„ÙˆÙ…Ø§Øª': 'خدمات تقنية المعلومات',  # IT Services
    'Ø¯Ø¹Ù… Ø§Ù„Ø´Ø¨ÙƒØ§Øª': 'دعم الشبكات',  # Network Support
    
    # Additional newer categories
    'Ø§Ù„Ù…Ø·Ø§Ø¹Ù…': 'المطاعم',  # Restaurants
    'Ø§Ù„Ù…Ù‚Ø§Ù‡ÙŠ ÙˆÙ…Ø­Ù„Ø§Øª Ø§Ù„Ù‚Ù‡ÙˆØ©': 'المقاهي ومحلات القهوة',  # Cafes & Coffee Shops
    'Ø¥Ù†ØªØ§Ø¬ Ø§Ù„Ø·Ø¹Ø§Ù…': 'إنتاج الطعام',  # Food Production
    'ØªØ¬Ø§Ø±Ø© Ø§Ù„ØªØ¬Ø²Ø¦Ø© Ù„Ù„Ø·Ø¹Ø§Ù…': 'تجارة التجزئة للطعام',  # Food Retail
    'Ø®Ø¯Ù…Ø§Øª Ø§Ù„Ø·Ø¹Ø§Ù…': 'خدمات الطعام',  # Food Services
}

# Apply all replacements
for corrupted, correct in replacements.items():
    content = content.replace(corrupted, correct)

# Write back to file
with open('admin-script.js', 'w', encoding='utf-8') as f:
    f.write(content)

print(f"Fixed {len(replacements)} Arabic text entries!")
print("Arabic text encoding has been corrected.")
