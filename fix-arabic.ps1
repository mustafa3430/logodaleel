# Fix corrupted Arabic text encoding
$content = Get-Content 'admin-script.js' -Raw -Encoding UTF8

# Basic replacements for common corrupted Arabic text
$content = $content -replace 'Ø§Ù„Ø·Ø¹Ø§Ù… ÙˆØ§Ù„Ø´Ø±Ø§Ø¨', 'الطعام والشراب'
$content = $content -replace 'Ù…Ø·Ø§Ø¹Ù…', 'مطاعم'
$content = $content -replace 'ÙˆØ¬Ø¨Ø§Øª Ø³Ø±ÙŠØ¹Ø©', 'وجبات سريعة'
$content = $content -replace 'Ù…Ø·Ø§Ø¹Ù… Ø±Ø§Ù‚ÙŠØ©', 'مطاعم راقية'
$content = $content -replace 'Ù…Ù‚Ø§Ù‡ÙŠ', 'مقاهي'
$content = $content -replace 'Ø¹Ø§Ù…', 'عام'
$content = $content -replace 'Ù…Ø®Ø§Ø¨Ø²', 'مخابز'
$content = $content -replace 'Ù…Ø®Ø§Ø¨Ø² ØªÙ‚Ù„ÙŠØ¯ÙŠØ©', 'مخابز تقليدية'
$content = $content -replace 'ØªÙ‚Ø¯ÙŠÙ… Ø§Ù„Ø·Ø¹Ø§Ù…', 'تقديم الطعام'
$content = $content -replace 'ØªÙ‚Ø¯ÙŠÙ… Ø§Ù„Ù…Ù†Ø§Ø³Ø¨Ø§Øª', 'تقديم المناسبات'
$content = $content -replace 'Ø§Ù„Ø±Ø¹Ø§ÙŠØ© Ø§Ù„ØµØ­ÙŠØ©', 'الرعاية الصحية'
$content = $content -replace 'Ø§Ù„Ù…Ø±Ø§ÙƒØ² Ø§Ù„Ø·Ø¨ÙŠØ©', 'المراكز الطبية'
$content = $content -replace 'Ø·Ø¨ Ø¹Ø§Ù…', 'طب عام'

# Write back to file with UTF8 encoding
$content | Out-File 'admin-script.js' -Encoding UTF8 -NoNewline

Write-Host "Arabic text encoding fixed!"
