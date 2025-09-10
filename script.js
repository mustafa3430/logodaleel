// Sample company data - this would typically come from a database
let companies = [];
let saudiLocationData = []; // Will be loaded from saudi_data.js

// Text truncation utility functions
function truncateText(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
}

function sanitizeCompanyData(company) {
    // Ensure text fields fit within our display limits (but keep original news for expansion)
    return {
        ...company,
        name: truncateText(company.name, 40),
        description: truncateText(company.description, 120),
        // Don't truncate news here - we'll handle expansion in the display
        news: company.news
    };
}

// News expansion utility functions
function isTextTruncated(element, lines = 3) {
    if (!element || !element.textContent) return false;
    
    // Create a temporary element to measure text
    const temp = element.cloneNode(true);
    temp.style.position = 'absolute';
    temp.style.visibility = 'hidden';
    temp.style.height = 'auto';
    temp.style.maxHeight = 'none';
    temp.style.webkitLineClamp = 'unset';
    temp.style.lineClamp = 'unset';
    temp.style.display = 'block';
    
    document.body.appendChild(temp);
    const fullHeight = temp.scrollHeight;
    document.body.removeChild(temp);
    
    // Calculate approximate height for the specified number of lines
    const lineHeight = parseFloat(window.getComputedStyle(element).lineHeight);
    const maxHeight = lineHeight * lines;
    
    return fullHeight > maxHeight;
}

function toggleNewsExpansion(button) {
    const newsContent = button.closest('.company-news').querySelector('.news-content');
    const isExpanded = newsContent.classList.contains('expanded');
    
    if (isExpanded) {
        newsContent.classList.remove('expanded');
        newsContent.classList.add('collapsed');
        button.textContent = 'more';
    } else {
        newsContent.classList.remove('collapsed');
        newsContent.classList.add('expanded');
        button.textContent = 'less';
    }
}

// Address hierarchy data with Village → Center → Province structure (Saudi Arabia)
let addressHierarchy = [
    {
        governorate: "Riyadh",
        governorate_ar: "منطقة الرياض",
        centers: [
            {
                name: "Riyadh",
                name_ar: "الرياض",
                villages: ["Al Amal Dist.", "Al Namudhajiyah Dist.", "Al Jarradiyah Dist.", "Al Sinaiyah Dist.", "Manfuha Al Jadidah Dist.", "Al Fakhiriyah Dist.", "Al Dirah Dist.", "East Umm Al Hamam Dist.", "Al Sharafiyah Dist.", "Al Hada Dist.", "North Mathar Dist.", "West Umm Al Hamam Dist.", "Ar Rahmaniyah Dist.", "Laban Dist.", "Ar Rafiah Dist.", "Al Shohda Dist.", "King Fahd Dist.", "Al Suwaidi Dist.", "Al Hazm Dist.", "Utayqah Dist.", "Al Murabba Dist.", "Al Falah Dist.", "Al Nada Dist.", "Al Mursalat Dist.", "Al Nuzha Dist.", "Al Woroud Dist.", "King Faisal Dist.", "2nd Industrial City", "Al Aziziyah Dist.", "Al Mansurah Dist.", "Ghobairah Dist.", "Al Farooq Dist.", "Al Faisaliyah Dist.", "Al Khalidiyah Dist.", "Al Jazeerah Dist.", "Al Saadah Dist.", "Al Nasiriyah Dist.", "Al Manakh Dist.", "Al Difaa Dist.", "Al Noor Dist.", "King Abdullah Dist.", "Al Wahah Dist.", "Salahuddin Dist.", "King Abdulaziz Dist.", "Al Wizarat Dist.", "Skirinah Dist.", "Ar Rabwah Dist.", "Jareer Dist.", "Al Mathar Dist.", "As Salhiyah Dist.", "Al Malaz Dist.", "Manfuhah Dist.", "Olaishah Dist.", "Al Nahdah Dist.", "Al Khaleej Dist.", "Al Dhubbat Dist.", "West Suwaidi Dist.", "Dirab Dist.", "Ohod Dist.", "Namar Dist.", "Al Shifa Dist.", "Al Muhammadiyah Dist.", "Al Sulaimaniyah Dist.", "Al Marwah Dist.", "Okaz Dist.", "Shubra Dist.", "Al Zahrah Dist.", "Siyah Dist.", "Sultanah Dist.", "Al Yamamah Dist.", "Al Badiah Dist.", "Al Masani Dist.", "Al Qadisiyah Dist.", "Al Safa Dist.", "Al Olaya Dist.", "Al Duraihemiyah Dist.", "Al Iskan Dist.", "Al Salam Dist.", "Al Manar Dist.", "East Naseem Dist.", "Al Quds Dist.", "Al Wadi Dist.", "Al Nafel Dist.", "Al Maseef Dist.", "Al Taawun Dist.", "Al Ezdihar Dist.", "Al Andalus Dist.", "Al Rawdah Dist.", "Al Rawabi Dist.", "Al Rayan Dist.", "Dhahrat Al Badeah Dist.", "Al Nadheem Dist.", "Al Rimayah Dist.", "Al Bariyah Dist.", "Taybah Dist.", "Mansuriyah Dist.", "Dahiyat Namar Dist.", "Al Misfat Dist.", "Assafarat Dist.", "Khashm Al An", "Qurtubah Dist.", "Tuwaiq Dist.", "Al Awaly Dist.", "Ar Rabie Dist.", "Al Mughrazat Dist.", "Al Sulay Dist.", "Al Aqeeq Dist.", "Al Nakheel Dist.", "Al Ghadeer Dist.", "Al Muruj Dist.", "Al Oud Dist.", "Thulaim Dist.", "Al Shumaisi Dist.", "Al Wisham Dist.", "Salam Park", "Al Dubiyah Dist.", "Meakal Dist.", "Jabrah Dist.", "Al Qura Dist.", "Al Marqab Dist.", "Al Futah Dist.", "Umm Saleem Dist.", "Al Sahafah Dist.", "Al Raed Dist.", "West Oraija Dist.", "Al Uraija Dist.", "Middle Oraija Dist.", "Al Hamra Dist.", "Al Dar Al Baida Dist.", "Al Butaiha Dist.", "Al Zahra Dist.", "Al Fayha Dist.", "Al Mutamarat Dist.", "Al Wusayta Dist.", "Al Janadriyah Dist.", "Ishbiliyah Dist.", "Al Maizalah Dist.", "Al Yarmuk Dist.", "Al Munisiyah Dist.", "Al Khuzama Dist.", "Irqah", "Dhahrat Laban Dist.", "Hiteen Dist.", "Al Malqa Dist.", "Al Qairawan Dist.", "Al Yasmeen Dist.", "Al Arid Dist.", "King Khalid International Airport", "Al Narjis Dist.", "Imam Muhammed Bin Saud Islamic University", "Banban Dist.", "Al Rimal Dist.", "Ghirnatah Dist.", "Al Dahou Dist.", "Al Ammajiyah Dist.", "Hyt Dist.", "Al Haer Dist.", "Umm Al Shaal Dist.", "Al Ghannamiyah Dist.", "Oraid Dist.", "Badr Dist.", "Al Mahdiyah Dist.", "King Saud University", "West Naseem Dist.", "Al Mishael Dist.", "Al Nadwah Dist.", "Al Rabiyah Dist.", "Wady Laban Dist.", "Al Sidrah Dist.", "Al Tadamun Dist.", "King Abdullah City For Energy", "Al Basatin Dist.", "Al Rehab Dist.", "Al Majd Dist.", "Al Danah Dist.", "Al Risalah Dist.", "Al Khair Dist.", "Al Fursan Dist.", "Al Sholah Dist.", "Al Rayah Dist.", "Al Zahour Dist.", "Al Zaher Dist.", "Al Marjan Dist.", "Al Bayan Dist.", "Al Ula Dist.", "Al Mashriq Dist.", "Al Nakhbah Dist.", "Al Sahab Dist.", "Al Wasam Dist."],
                villages_ar: ["حي العمل", "حي النموذجية", "حي الجرادية", "حي الصناعية", "حي منفوحة الجديدة", "حي الفاخرية", "حي الديرة", "حي ام الحمام الشرقي", "حي الشرفية", "حي الهدا", "حي المعذر الشمالي", "حي ام الحمام الغربي", "حي الرحمانية", "حي لبن", "حي الرفيعة", "حي الشهداء", "حي الملك فهد", "حي السويدي", "حي الحزم", "حي عتيقة", "حي المربع", "حي الفلاح", "حي الندى", "حي المرسلات", "حي النزهة", "حي الورود", "حي الملك فيصل", "المدينة الصناعية الثانية", "حي العزيزية", "حي المنصورة", "حي غبيرة", "حي الفاروق", "حي الفيصلية", "حي الخالدية", "حي الجزيرة", "حي السعادة", "حي الناصرية", "حي المناخ", "حي الدفاع", "حي النور", "حي الملك عبدالله", "حي الواحة", "حي صلاح الدين", "حي الملك عبدالعزيز", "حي الوزارات", "حي سكيرينة", "حي الربوة", "حي جرير", "حي المعذر", "حي الصالحية", "حي الملز", "حي منفوحة", "حي عليشة", "حي النهضة", "حي الخليج", "حي الضباط", "حي السويدي الغربي", "حي ديراب", "حي احد", "حي نمار", "حي الشفا", "حي المحمدية", "حي السليمانية", "حي المروة", "حي عكاظ", "حي شبرا", "حي الزهرة", "حي صياح", "حي سلطانة", "حي اليمامة", "حي البديعة", "حي المصانع", "حي القادسية", "حي الصفا", "حي العليا", "حي الدريهمية", "حي الاسكان", "حي السلام", "حي المنار", "حي النسيم الشرقي", "حي القدس", "حي الوادي", "حي النفل", "حي المصيف", "حي التعاون", "حي الازدهار", "حي الاندلس", "حي الروضة", "حي الروابي", "حي الريان", "حي ظهرة البديعة", "حي النظيم", "حي الرماية", "حي البرية", "حي طيبة", "حي المنصورية", "حي ضاحية نمار", "حي المصفاة", "حي السفارات", "خشم العان", "حي قرطبة", "حي طويق", "حي العوالي", "حي الربيع", "حي المغرزات", "حي السلي", "حي العقيق", "حي النخيل", "حي الغدير", "حي المروج", "حي العود", "حي ثليم", "حي الشميسي", "حي الوشام", "منتزه سلام", "حي الدوبية", "حي معكال", "حي جبرة", "حي القرى", "حي المرقب", "حي الفوطة", "حي ام سليم", "حي الصحافة", "حي الرائد", "حي العريجاء الغربي", "حي العريجاء", "حي العريجاء الوسطى", "حي الحمراء", "حي الدار البيضاء", "حي البطيحا", "حي الزهراء", "حي الفيحاء", "حي المؤتمرات", "حي الوسيطاء", "حي الجنادرية", "حي اشبيلية", "حي المعيزلة", "حي اليرموك", "حي المونسية", "حي الخزامى", "عرقة", "حي ظهرة لبن", "حي حطين", "حي الملقا", "حي القيروان", "حي الياسمين", "حي العارض", "مطار الملك خالد", "حي النرجس", "جامعة الامام محمد بن سعود الاسلامية", "حي بنبان", "حي الرمال", "حي غرناطة", "حي الدحو", "حي العماجية", "حي هيت", "حي الحائر", "حي ام الشعال", "حي الغنامية", "حي عريض", "حي بدر", "حي المهدية", "جامعة الملك سعود", "حي النسيم الغربي", "حي المشاعل", "حي الندوة", "حي الرابية", "حي وادي لبن", "حي السدرة", "حي التضامن", "مدينة الملك عبدالله للطاقة", "حي البساتين", "حي الرحاب", "حي المجد", "حي الدانة", "حي الرسالة", "حي الخير", "حي الفرسان", "حي الشعلة", "حي الراية", "حي الزهور", "حي الزاهر", "حي المرجان", "حي البيان", "حي العلا", "حي المشرق", "حي النخبة", "حي السحاب", "حي الوسام"]
            },
            {
                name: "Al Kharj",
                name_ar: "الخرج",
                villages: ["Al Masani Dist.", "Al Barakah Dist.", "Al Muntazah Dist.", "New Industrial Dist.", "As Sulaymaniyah Dist.", "Al Safa Dist.", "Al Burj Dist.", "Al Wurud Dist.", "As Salam Dist.", "Ar Rafiah Dist.", "Al Yamamah Dist.", "Al Khalidiyah Dist.", "Al Khuzama Dist.", "Al Aziziyah Dist.", "Mishrif Dist.", "Ar Rashidiyyah Dist.", "Al Munyfiyah Dist.", "An Nasifah Dist.", "Al Badiah Dist.", "Al Mansurah Dist.", "An Nahdah Dist.", "An Nuzhah Dist.", "Ar Rayyan Dist.", "Al Andalus Dist.", "Al Faisaliyah Dist.", "Az Zahir Dist.", "Industrial Area", "Al Aliyah Dist.", "Al Hayathim", "Al Adamah Dist.", "Al Qitar Dist.", "Al Kharj Industrial City", "Prince Sultan Air Base", "Al Jamiah Dist.", "Jawharat Al Kharj Dist.", "Al Muruj Dist.", "As Sahab Dist.", "Al Yarmuk Dist.", "Al Akhdar Dist.", "Ar Rawabi Dist.", "Qurtubah Dist.", "Al Hada Dist.", "Al Hamra Dist."],
                villages_ar: ["حي المصانع", "حي البركة", "حي المنتزة", "حي الصناعية الجديدة", "حي السليمانية", "حي الصفاء", "حي البرج", "حي الورود", "حي السلام", "حي الرفيعة", "حي اليمامة", "حي الخالدية", "حي الخزامى", "حي العزيزية", "حي مشرف", "حي الراشدية", "حي المنيفية", "حي الناصفة", "حي البديعة", "حي المنصورة", "حي النهضة", "حي النزهة", "حي الريان", "حي الاندلس", "حي الفيصلية", "حي الزاهر", "منطقة صناعية", "حي العالية", "الهياثم", "حي العدامة", "حي القطار", "المدينة الصناعية بالخرج", "قاعدة الامير سلطان الجوية", "حي الجامعة", "حي جوهرة الخرج", "حي المروج", "حي السحاب", "حي اليرموك", "حي الاخضر", "حي الروابي", "حي قرطبة", "حي الهدا", "حي الحمراء"]
            }
        ]
    },
    {
        governorate: "Makkah",
        governorate_ar: "منطقة مكة المكرمة",
        centers: [
            {
                name: "At Taif",
                name_ar: "الطائف",
                villages: ["C10 Dist.", "Dhahiyat Al Iskan  Dist.", "Dhahiyat Al Iskan Extension Area", "As Sail Al Kabeer  Dist.", "Al Huda  Dist.", "Ash Shifa  Dist.", "C3 Dist.", "C4 Dist.", "C5 Dist.", "C43 Dist.", "C16 Dist.", "C18 Dist."],
                villages_ar: ["حي ج10", "حي ضاحية الاسكان", "منطقة إمتداد ضاحية الإسكان", "حي السيل الكبير", "حي الهدا", "حي الشفا", "حي ج3", "حي ج4", "حي ج5", "حي ج43", "حي ج16", "حي ج18"]
            },
            {
                name: "Makkah",
                name_ar: "مكة المكرمة",
                villages: ["Al Adl Dist.", "Ar Rawdah Dist.", "Al Maabdah Dist.", "Al Khansa Dist.", "As Sulimaniyah Dist."],
                villages_ar: ["حي العدل", "حي الروضة", "حي المعابدة", "حي الخنساء", "حي السليمانية"]
            },
            {
                name: "Jeddah",
                name_ar: "جدة",
                villages: ["Az Zomorod Dist.", "Al Loaloa Dist.", "Al Yaqoot Dist.", "As Swaryee Dist.", "Al Amwaj Dist.", "Ash Sheraa Dist."],
                villages_ar: ["حي الزمرد", "حي اللؤلؤ", "حي الياقوت", "حي الصوارى", "حي الامواج", "حي الشراع"]
            }
        ]
    },
    {
        governorate: "Madinah",
        governorate_ar: "منطقة المدينة المنورة",
        centers: [
            {
                name: "Madinah",
                name_ar: "المدينة المنورة",
                villages: ["Khakh Dist.", "As Sakb Dist.", "Al Jassah Dist.", "Raht Dist.", "Bani Bayadah Dist.", "Nubala Dist.", "Ash Shahba Dist.", "Ar Rumanah Dist.", "Abu Kabir Dist.", "Al Gharra Dist.", "As Sad Dist.", "Al Jabirah Dist.", "Ar Ranuna Dist.", "Al Hadiqah Dist.", "Abu Burayqa Dist.", "Ar Rawabi Dist.", "Al Qaswa Dist.", "Al Usbah Dist.", "Al Khatim Dist.", "Al Aziziyah Dist.", "Al Ihn Dist.", "Dhu Al Hulayfah Dist.", "Wadi Mahzur Dist.", "Ad Duwaimah Dist.", "Wadi Mudhainib Dist.", "Ayn Al Khif Dist.", "Urwah Dist.", "Al Dhahirah Dist.", "Ash Shuraybat Dist.", "Jima Um Khalid Dist.", "Al Jumah Dist.", "Al Mughaisilah Dist.", "Qurban Dist.", "Ad Difa Dist.", "Sikkah Al Hadid Dist.", "Hura Al Wabra Dist.", "Al Usayfirin Dist.", "An Naqa Dist.", "Bani Dhafir Dist.", "Al Iskan Dist.", "Al Khalidiyah Dist.", "Al Jamawat Dist.", "Al Manakhah Dist.", "Badhaah Dist.", "Josham Dist.", "Al Hadra Dist.", "As Sih Dist.", "Al Masani Dist.", "Al Qiblatayn Dist.", "As Salam Dist.", "Al Mabuth Dist.", "Al Jamiah Dist.", "Bani Harithah Dist.", "Bir Uthman Dist.", "Shidhat Dist.", "Taibah Dist.", "Al Talaah Dist.", "King Fahd Dist.", "Al Barakah Dist.", "Al Eyun Dist.", "Ad Dar Dist.", "Al Nakhil Dist.", "Az Zahrah Dist.", "Al Hafya Dist.", "Al Balqa Dist.", "Kittanah Dist.", "As Sadiqiyah Dist.", "Al Ghabah Dist.", "Wairah Dist.", "Al Matar Dist.", "Al Ariydh Dist.", "Al Anabis Dist.", "Al Fath Dist.", "Ar Rayah Dist.", "Masjid Ad Dara Dist.", "As Suqya Dist.", "Jabal Ayr Dist.", "Ash Shafiyah Dist.", "Ash Shuhada Dist.", "Jabal Uhud Dist.", "Bani Khidrah Dist.", "Bani Abdul Ashhal Dist.", "Bani Muawiyah Dist.", "Warqan Dist.", "Shuran Dist.", "Industrial Dist.", "Ad Duwaikhilah Dist.", "Al Aqoul Dist.", "Wadi Al Battan Dist.", "Al Mulaylih Dist.", "Al Anahi Dist.", "Wadi  Al Hamdh Dist.", "Al Khadhra Dist.", "Abumarkha Dist.", "Al Sahluj Dist.", "Al Masbah Dist.", "Al Dhamiria Dist.", "Dhaea Dist.", "Um Al Seouf Dist.", "Ghorab Dist.", "Hadhawda Dist.", "Al Sharayie Dist.", "Al Sahwa Dist.", "Al Mundasa Dist.", "Qubeiba Dist.", "Al Muzayiyn Dist.", "Bani Al Najjar Dist.", "Hazrat Al Janoub Dist.", "Abu Sidr Dist.", "Sad Al Ghaba Dist.", "Al Hisa Dist.", "Industrial City Dist.", "Al Mafrahat Dist.", "As Suwaydra Dist.", "Abyar Al Mashi Dist.", "Al Furaysh Dist.", "An Ngma Dist.", "Al Haram  Al Sharif"],
                villages_ar: ["حي خاخ", "حي السكب", "حي الجصة", "حي رهط", "حي بني بياضة", "حي نبلاء", "حي الشهباء", "حي الرمانة", "حي ابو كبير", "حي الغراء", "حي السد", "حي الجابرة", "حي الرانوناء", "حي الحديقة", "حي ابو بريقاء", "حي الروابي", "حي القصواء", "حي العصبة", "حي الخاتم", "حي العزيزية", "حي العهن", "حي ذو الحليفة", "حي وادي مهزور", "حي الدويمة", "حي وادي مذينب", "حي عين الخيف", "حي عروة", "حي الظاهرة", "حي الشريبات", "حي جماء أم خالد", "حي الجمعة", "حي المغيسلة", "حي قربان", "حي الدفاع", "حي سكة الحديد", "حى حرة الوبرة", "حي الاصيفرين", "حي النقاء", "حي بني ظفر", "حي الاسكان", "حي الخالدية", "حي الجماوات", "حي المناخة", "حي بضاعة", "حي جشم", "حي الهدراء", "حي السيح", "حي المصانع", "حي القبلتين", "حي السلام", "حي المبعوث", "حي الجامعة", "حي بني حارثة", "حي بئر عثمان", "حي شظاة", "حي طيبة", "حي التلعة", "حي الملك فهد", "حي البركة", "حي العيون", "حي الدار", "حي النخيل", "حي الزهرة", "حي الحفيا", "حي البلقاء", "حي كتانة", "حي الصادقية", "حي الغابة", "حي وعيرة", "حي المطار", "حي العريض", "حي العنابس", "حي الفتح", "حي الراية", "حي مسجد الدرع", "حي السقيا", "حي جبل عير", "حي الشافية", "حي الشهداء", "حي جبل احد", "حي بني خدرة", "حي بني عبدالاشهل", "حي بني معاوية", "حي ورقان", "حي شوران", "حي الصناعية", "حي الدويخلة", "حي العاقول", "حي وادي البطان", "حي المليليح", "حي الاناهي", "حي وادي الحمض", "حى الخضراء", "حي ابومرخة", "حى الصهلوج", "حي المسبعة", "حي الضميرية", "حي ضعة", "حي ام السيوف", "حي غراب", "حى حضوضاء", "حي الشرائع", "حى الصهوة", "حي المندسة", "حى القبيبة", "حي المزيين", "حى بني النجار", "حي حزرة الجنوب", "حى ابو سدر", "حى سد الغابة", "حى الحساء", "حي المدينة الصناعية", "حى المفرحات", "حي الصويدرة", "حي ابيار الماشي", "حي الفريش", "حي الـنقـمى", "الحرم الشريف"]
            },
            {
                name: "Yanbu",
                name_ar: "ينبع",
                villages: ["Al Yaqut Dist.", "Al Murjan Dist.", "Al Biqa Dist.", "Al Rehab Dist.", "Al Naim Dist.", "Al Izdihar Dist.", "Al Yasmin Dist.", "Al Doha Dist.", "Al Falah Dist.", "Al Masif Dist.", "Al Rimal Dist.", "Al Aziziyah Dist.", "Al Yarmuk Dist.", "Al Urubah Dist.", "Al Nuzhah Dist.", "Al Jar Dist.", "Al Dabab Dist.", "Al Manar Dist.", "Al Luluah Dist.", "Al Jamiah Dist.", "Al Mursi Dist.", "Al Khaleej Dist.", "Al Salam Dist.", "Al Bandar Dist.", "Al Amarah Dist.", "Al Zuhur Dist.", "Al Sholah Dist.", "National Guard", "Al Talal Dist.", "Ar Rabie Dist.", "Al Nakheel Dist.", "Al Naseem Dist.", "Qurtubah Dist.", "Al Usayli Dist.", "Ar Rabwah Dist.", "Al Sumayri Dist.", "Al Wurud Dist.", "Al Ferdous Dist.", "Mishrifah Dist.", "Al Jabriyah Dist.", "Al Aqiq Dist.", "Al Wahah Dist.", "Al Muruj Dist.", "Al Nahdah Dist.", "Al Hawra Dist.", "Al Suraif Dist.", "Yanbu Al Balad Dist.", "Al Buhayrah Dist.", "Al Hadaek Dist.", "Al Majd Dist.", "Al Safa Dist.", "Ghirnatah Dist.", "Al Dana Dist.", "Al Rabiyah Dist.", "Al Ghadir Dist.", "Airport", "Al Shifa Dist.", "Al Rawabi Dist.", "Al Qadisiyah Dist.", "Al Fayha Dist.", "Bonded And Reexport Zone", "Al Asheyrah Dist.", "Al Bathnah Dist.", "Industrial Area", "An Nujayl Dist.", "Al Marwah Dist.", "Al Rawdah Dist.", "Al Rayyan Dist.", "Al Sawaiq Dist.", "Radwa Dist.", "Al Shati Dist."],
                villages_ar: ["حي الياقوت", "حي المرجان", "حي البقاع", "حي الرحاب", "حي النعيم", "حي الازدهار", "حي الياسمين", "حي الدوحة", "حي الفلاح", "حي المصيف", "حي الرمال", "حي العزيزية", "حي اليرموك", "حي العروبة", "حي النزهة", "حي الجار", "حي الضباب", "حي المنار", "حي اللؤلؤة", "حي الجامعة", "حي المرسي", "حي الخليج", "حي السلام", "حي البندر", "حي الامارة", "حي الزهور", "حي الشعلة", "الحرس الوطني", "حي التلال", "حي الربيع", "حي النخيل", "حي النسيم", "حي قرطبة", "حي العصيلي", "حي الربوة", "حي السميري", "حي الورود", "حي الفردوس", "حي مشرفة", "حي الجابرية", "حي العقيق", "حي الواحة", "حي المروج", "حي النهضة", "حي الحوراء", "حي الصريف", "حي ينبع البلد", "حي البحيرة", "حي الحدائق", "حي المجد", "حي الصفا", "حي غرناطة", "حي الدانة", "حي الرابية", "حي الغدير", "حى المطار", "حي الشفا", "حي الروابي", "حي القادسية", "حي الفيحاء", "منطقة الايداع واعادة التصنيع", "حي العشيرة", "حي البثنة", "المنطقة الصناعية", "حي النجيل", "حي المروة", "حي الروضة", "حي الريان", "حي السويق", "حى رضوى", "حي الشاطئ"]
            }
        ]
    },
    {
        governorate: "Qassim",
        governorate_ar: "منطقة القصيم",
        centers: [
            {
                name: "Buraidah",
                name_ar: "بريدة",
                villages: ["Al Yarmouk Dist.", "Ar Rimal Dist.", "Al Marwah Dist.", "Al Khudar Dist.", "Al Lusayb Dist.", "Al Nur Dist.", "Rawaq Dist.", "Al Qusayah Dist.", "Al Ghadir Dist.", "Al Muruj Dist.", "As Salmiya Dist.", "Al Rawabi Dist.", "Huwailan Dist.", "As Sabbakh Dist.", "Wasit Dist.", "Khudayra Dist.", "As Salam Dist.", "Al Janub Dist.", "Al Khalij Dist.", "Ad Dahi Dist.", "Khub Al Buraydi Dist.", "As Sadah Dist.", "Al Uraymdi Dist.", "Al Hilal Dist.", "Al Ujaybah Dist.", "Al Basatin Dist.", "Al Naseem Dist.", "Al Mawta Dist.", "At Taalim Dist.", "Al Jardah Dist.", "As Salhiyah Dist.", "Al Muraydisiyyah Dist.", "Al Shorouq Dist.", "Khub Ath Thanyan Dist.", "Ash Shammas Dist.", "Al Qadisiyah Dist.", "As Safa Dist.", "Al Khabib Dist.", "Al Marqab Dist.", "Ar Rabie Dist.", "Ar Rafiah Dist.", "Az Zarqa Dist.", "Al Humar Dist.", "Ash Shafaq Dist.", "Al Qaa Al Barid Dist.", "Al Manar Dist.", "Al Wusayta Dist.", "Ar Rabwah Dist.", "Al Muntazah Dist.", "As Safra Dist.", "An Naqa Dist.", "Al Fayziyah Dist.", "Al Nakhil Dist.", "Ar Rawdah Dist.", "An Nafl Dist.", "Al Iskan Dist.", "Al Akhdar Dist.", "Ash Shiqah Dist.", "Ar Rabiyah Dist.", "Ar Rayyan Dist.", "An Nahdah Dist.", "Al Ufuq Dist.", "Al Wurud Dist.", "Al Khuzama Dist.", "Al Jazirah Dist.", "Al Rehab Dist.", "Al Hazm Dist.", "Al Farouq Dist.", "At Tashlih Dist."],
                villages_ar: ["حي اليرموك", "حي الرمال", "حي المروة", "حي الخضر", "حي اللسيب", "حي النور", "حي رواق", "حي القصيعة", "حي الغدير", "حي المروج", "حي السالمية", "حي الروابي", "حي حويلان", "حي الصباخ", "حي واسط", "حي خضيراء", "حي السلام", "حي الجنوب", "حي الخليج", "حي الضاحي", "حي خب البريدي", "حي السادة", "حي العريمضي", "حي الهلال", "حي العجيبة", "حي البساتين", "حي النسيم", "حي الموطا", "حي التعليم", "حي الجردة", "حي الصالحية", "حي المريديسية", "حي الشروق", "حي خب الثنيان", "حي الشماس", "حي القادسية", "حي الصفا", "حي الخبيب", "حي المرقب", "حي الربيع", "حي الرفيعة", "حي الزرقاء", "حي الحمر", "حي الشفق", "حي القاع البارد", "حي المنار", "حي الوسيطا", "حي الربوة", "حي المنتزه", "حي الصفراء", "حي النقع", "حي الفايزية", "حي النخيل", "حي الروضه", "حي النفل", "حي الإسكان", "حي الأخضر", "حي الشقة", "حي الرابية", "حي الريان", "حي النهضة", "حي الافق", "حي الورود", "حي الخزامى", "حي الجزيرة", "حي الرحاب", "حي الحزم", "حي الفاروق", "حي التشليح"]
            },
            {
                name: "Unayzah",
                name_ar: "عنيزة",
                villages: ["Hiteen Dist.", "Snam Dist.", "Ar Rawdah Dist.", "Ad Dawhah Dist.", "Al Hajeb Dist.", "Ar Rimal Dist.", "Al Hufayrah Dist.", "As Safa Dist.", "King Khalid Dist.", "King Fahd Dist.", "Ar Riyadi Dist.", "Al Qirawan Dist.", "Ghirnatah Dist.", "Qurtubah Dist.", "Al Aqiq Dist.", "Ash Shifa Dist.", "Al Matar Dist.", "As Sulimaniyah Dist.", "Al Wusta Dist.", "2nd Industrial Area", "1st Industrial Area", "Al Khalij Dist.", "Warehouse Dist.", "Al Hadaa Dist.", "As Salhiyah Dist.", "Al Muntazah Dist.", "Al Yarmuk Dist.", "Al Naseem Dist.", "Ar Rahmaniyah Dist.", "Damshiah Dist.", "Al Muhammadiyah Dist.", "Al Absiah Dist.", "Badr Dist.", "Al Wahlan Dist.", "Mlihah Dist.", "Marbidah Dist.", "Al Olaya Dist.", "City Center", "Ar Rayan Dist.", "Al Fakhriyah Dist.", "An Nuqailiah Dist.", "As Suhaymiyyah Dist.", "Al Badiah Dist.", "As Salam Dist.", "Ishbiliyah Dist.", "Al Awniyah Dist.", "Al Hamra Dist.", "Al Fayha Dist.", "Al Jamie Dist.", "Al Muruj Dist.", "Al Yamamah Dist.", "Al Qadisiyah Dist.", "Al Manar Dist.", "Al Ashrafiyah Dist.", "Al Khuzama Dist.", "Ar Rawghani Dist.", "Az Zahra Dist.", "As Safraa Dist.", "Al Mubarkiah Dist.", "Al Mudwiah Dist.", "Al Yarmuk Dist.", "An Nadheem Dist.", "At Tahliyah Dist.", "Al Jazirah Dist.", "Al Bustan Dist.", "Al Wafa Dist.", "Az Zahir Dist.", "Al Wahah Dist.", "Suq Al Mashiya Dist.", "Al Jaldah Dist.", "An Nada Dist.", "Rabwat Al Hajeb Dist.", "Al Kada Dist.", "Ash Shuaib Dist.", "Al Buaiten Dist.", "An Narjis Dist.", "Uqaz Dist.", "An Nofoad Dist.", "Al Wadi Dist.", "Al Qusor Dist.", "Al Hadiqah Dist.", "Al Masif Dist.", "Al Jawharah Dist.", "Athaqafah Dist.", "Al Marwah Dist.", "Al Fakamah Dist.", "Al Faisaliyah Dist.", "Az Zugaibah Dist.", "Al Iskan Dist.", "Al Hazm Dist."],
                villages_ar: ["حي حطين", "حي سنام", "حي الروضة", "حي الدوحة", "حي الحاجب", "حي الرمال", "حي الحفيرة", "حي الصفا", "حي الملك خالد", "حي الملك فهد", "حي الرياضى", "حي القيروان", "حي غرناطة", "حي قرطبة", "حي العقيق", "حي الشفاء", "حي المطار", "حي السليمانية", "حي الوسطى", "المنطقة الصناعية الثانية", "المنطقة الصناعية الاولى", "حي الخليج", "حي المستودعات", "حي الهداء", "حي الصالحية", "حي المنتزة", "حي اليرموك", "حي النسيم", "حي الرحمانية", "حي دمشية", "حي المحمدية", "حي العبسة", "حي بدر", "حي الوهلان", "حي مليحة", "حي مربيدة", "حي العليا", "وسط المدينة", "حي الريان", "حي الفاخرية", "حي النقيلية", "حي السحيمية", "حي البديعة", "حي السلام", "حي اشبيلية", "حي العونية", "حي الحمراء", "حي الفيحاء", "حي الجامعي", "حي المروج", "حي اليمامة", "حي القادسية", "حي المنار", "حي الاشرفية", "حي الخزامى", "حي الروغاني", "حي الزهراء", "حي الصفراء", "حي المباركية", "حي المدوية", "حي اليرموك", "حي النظيم", "حي التحلية", "حي الجزيرة", "حي البستان", "حي الوفاء", "حي الزاهر", "حي الواحة", "حي سوق الماشية", "حي الجلده", "حي الندى", "حي ربوة الحاجب", "حي الغضا", "حي الشعيب", "حي البويطن", "حي النرجس", "حي عكاظ", "حي النفود", "حي الوادي", "حي القصور", "حي الحديقة", "حي المصيف", "حي الجوهرة", "حي الثقافة", "حي المروة", "حي الفخامة", "حي الفيصلية", "حي الزغيبة", "حي الاسكان", "حي الحزم"]
            }
        ]
    }
];

// Load Saudi Arabia geographic data (full dataset from converted CSV)
function processCSVData() {
    // Clear existing data
    addressHierarchy.length = 0;
    
    // Use the full Saudi dataset loaded from saudi_data.js
    if (typeof saudiAddressData !== 'undefined') {
        addressHierarchy.push(...saudiAddressData);
        console.log(`Loaded ${addressHierarchy.length} provinces with ${addressHierarchy.reduce((total, p) => total + p.cities.length, 0)} cities from full dataset`);
        console.log('Sample data check:', addressHierarchy[0]);
    } else {
        console.warn('Saudi data not loaded, using fallback data');
        // Fallback to basic data if file not loaded
        addressHierarchy = [
            {
                governorate: "Riyadh",
                governorateAr: "منطقة الرياض",
                cities: [
                    {
                        city: "Riyadh",
                        cityAr: "الرياض",
                        districts: [
                            { district: "Al Olaya", districtAr: "حي العليا" },
                            { district: "Al Malaz", districtAr: "حي الملز" }
                        ]
                    }
                ]
            }
        ];
    }
    
    buildAddressCombinations();
}

// Generate all possible address combinations for searching
let allAddressCombinations = [];

// Build searchable address combinations
function buildAddressCombinations() {
    allAddressCombinations = [];
    
    addressHierarchy.forEach(gov => {
        // Add governorate only (English and Arabic)
        const govMatchTerms = [gov.governorate.toLowerCase()];
        if (gov.governorateAr) {
            govMatchTerms.push(gov.governorateAr);
        }
        
        allAddressCombinations.push({
            type: 'governorate',
            display: gov.governorate,
            display_ar: gov.governorateAr,
            governorate: gov.governorate,
            city: '',
            district: '',
            matchTerms: govMatchTerms
        });
        
        gov.cities.forEach(city => {
            // Add city + governorate (English and Arabic)
            const cityMatchTerms = [city.city.toLowerCase(), gov.governorate.toLowerCase()];
            if (city.cityAr) {
                cityMatchTerms.push(city.cityAr);
            }
            if (gov.governorateAr) {
                cityMatchTerms.push(gov.governorateAr);
            }
            
            allAddressCombinations.push({
                type: 'city',
                display: `${city.city}, ${gov.governorate}`,
                display_ar: city.cityAr ? `${city.cityAr}, ${gov.governorateAr}` : '',
                governorate: gov.governorate,
                city: city.city,
                district: '',
                matchTerms: cityMatchTerms
            });
            
            // Add districts for this city
            city.districts.forEach(district => {
                const districtMatchTerms = [
                    district.district.toLowerCase(),
                    city.city.toLowerCase(),
                    gov.governorate.toLowerCase()
                ];
                if (district.districtAr) {
                    districtMatchTerms.push(district.districtAr);
                }
                if (city.cityAr) {
                    districtMatchTerms.push(city.cityAr);
                }
                if (gov.governorateAr) {
                    districtMatchTerms.push(gov.governorateAr);
                }
                
                allAddressCombinations.push({
                    type: 'district',
                    display: `${district.district}, ${city.city}, ${gov.governorate}`,
                    display_ar: district.districtAr ? `${district.districtAr}, ${city.cityAr}, ${gov.governorateAr}` : '',
                    governorate: gov.governorate,
                    city: city.city,
                    district: district.district,
                    matchTerms: districtMatchTerms
                });
            });
        });
    });
    
    console.log(`Built ${allAddressCombinations.length} address combinations for autocomplete`);
    console.log('Sample combinations:', allAddressCombinations.slice(0, 5).map(c => c.display));
}

// Add real tech companies first
const realCompanies = [
    {
        id: 1,
        name: "Intel",
        description: "Semiconductor chip manufacturer, developing advanced integrated digital technology platforms.",
        category: "Technology",
        city: "Al-Olaya, Riyadh Center, Riyadh",
        governorate: "Riyadh",
        phone: "+1-408-765-8080",
        website: "https://www.intel.com",
        maps: "https://maps.google.com/?q=Intel+Headquarters+Santa+Clara",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Intel_logo_%282006-2020%29.svg/200px-Intel_logo_%282006-2020%29.svg.png",
        linkedin: "https://www.linkedin.com/company/intel-corporation",
        instagram: "https://www.instagram.com/intel",
        tiktok: "https://www.tiktok.com/@intel"
    },
    {
        id: 14,
        name: "Samsung",
        description: "Global leader in electronics, mobile devices and digital solutions.",
        category: "Technology",
        city: "Al-Balad, Jeddah, Makkah",
        governorate: "Makkah",
        phone: "+82-2-2053-3000",
        website: "https://www.samsung.com",
        maps: "https://maps.google.com/?q=Samsung+Electronics+Seoul",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Samsung_Logo.svg/200px-Samsung_Logo.svg.png",
        linkedin: "https://www.linkedin.com/company/samsung",
        instagram: "https://www.instagram.com/samsung",
        whatsapp: "https://wa.me/8220533000"
    },
    {
        id: 15,
        name: "Oracle",
        description: "Provider of enterprise software and cloud computing solutions.",
        category: "Technology",
        city: "Al-Faisaliyah, Dammam, Eastern Province",
        governorate: "Eastern Province",
        phone: "+1-650-506-7000",
        website: "https://www.oracle.com",
        maps: "https://maps.google.com/?q=Oracle+Headquarters+Austin",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Oracle_logo.svg/200px-Oracle_logo.svg.png"
    },
    {
        id: 16,
        name: "IBM",
        description: "Technology and consulting company specializing in AI, cloud computing, and quantum computing.",
        category: "Technology", 
        city: "Al-Masjid An-Nabawi, Medina Center, Medina",
        governorate: "Medina",
        phone: "+1-914-499-1900",
        website: "https://www.ibm.com",
        maps: "https://maps.google.com/?q=IBM+Headquarters+Armonk",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/IBM_logo.svg/200px-IBM_logo.svg.png"
    },
    {
        id: 17,
        name: "Nvidia",
        description: "Technology company specializing in graphics processors and AI computing.",
        category: "Technology",
        city: "Al-Ghabra, Buraydah, Qassim", 
        governorate: "Qassim",
        phone: "+1-408-486-2000",
        website: "https://www.nvidia.com",
        maps: "https://maps.google.com/?q=Nvidia+Headquarters+Santa+Clara",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Nvidia_logo.svg/200px-Nvidia_logo.svg.png"
    },
    {
        id: 18,
        name: "PayPal",
        description: "Online payments system and financial technology company.",
        category: "Finance",
        city: "King Fahd District, Riyadh Center, Riyadh",
        governorate: "Riyadh",
        phone: "+1-408-967-1000",
        website: "https://www.paypal.com",
        maps: "https://maps.google.com/?q=PayPal+Headquarters+San+Jose",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/200px-PayPal.svg.png"
    },
    {
        id: 1,
        name: "Microsoft",
        description: "Leading technology company providing cloud computing, productivity software, and AI solutions.",
        category: "Technology",
        city: "Al-Malaz, Riyadh Center, Riyadh",
        governorate: "Riyadh",
        phone: "+1-425-882-8080",
        website: "https://www.microsoft.com",
        maps: "https://maps.google.com/?q=Microsoft+Corporation+Redmond",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/200px-Microsoft_logo.svg.png",
        linkedin: "https://www.linkedin.com/company/microsoft",
        instagram: "https://www.instagram.com/microsoft",
        tiktok: "https://www.tiktok.com/@microsoft"
    },
    {
        id: 2,
        name: "Apple",
        description: "Technology company designing and manufacturing consumer electronics, software, and services.",
        category: "Technology",
        city: "Corniche Road, Al-Khobar, Eastern Province",
        governorate: "Eastern Province",
        phone: "+1-408-996-1010",
        website: "https://www.apple.com",
        maps: "https://maps.google.com/?q=Apple+Park+Cupertino",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/200px-Apple_logo_black.svg.png"
    },
    {
        id: 3,
        name: "Google",
        description: "Multinational technology company specializing in internet services and products.",
        category: "Technology",
        city: "Al-Hamra, Jeddah, Makkah",
        governorate: "Makkah",
        phone: "+1-650-253-0000",
        website: "https://www.google.com",
        maps: "https://maps.google.com/?q=Googleplex+Mountain+View",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/200px-Google_2015_logo.svg.png"
    },
    {
        id: 4,
        name: "Amazon",
        description: "E-commerce and cloud computing company offering diverse digital services worldwide.",
        phone: "+1-206-266-1000",
        website: "https://www.amazon.com",
        maps: "https://maps.google.com/?q=Amazon+Headquarters+Seattle",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/200px-Amazon_logo.svg.png"
    },
    {
        id: 5,
        name: "Meta",
        description: "Social technology company building platforms to connect people and communities globally.",
        category: "Technology",
        city: "Menlo Park",
        phone: "+1-650-543-4800",
        website: "https://www.meta.com",
        maps: "https://maps.google.com/?q=Meta+Headquarters+Menlo+Park",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Meta_Platforms_Inc._logo.svg/200px-Meta_Platforms_Inc._logo.svg.png",
        linkedin: "https://www.linkedin.com/company/meta",
        instagram: "https://www.instagram.com/meta",
        tiktok: "https://www.tiktok.com/@meta",
        whatsapp: "https://wa.me/16505434800"
    },
    {
        id: 6,
        name: "Tesla",
        description: "Electric vehicle and clean energy company accelerating sustainable transportation.",
        phone: "+1-512-516-8177",
        website: "https://www.tesla.com",
        maps: "https://maps.google.com/?q=Tesla+Gigafactory+Austin",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Tesla_T_symbol.svg/200px-Tesla_T_symbol.svg.png"
    },
    {
        id: 7,
        name: "Netflix",
        description: "Streaming entertainment service with TV series, documentaries and feature films.",
        phone: "+1-408-540-3700",
        website: "https://www.netflix.com",
        maps: "https://maps.google.com/?q=Netflix+Headquarters+Los+Gatos",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/200px-Netflix_2015_logo.svg.png"
    },
    {
        id: 8,
        name: "Spotify",
        description: "Audio streaming and media services provider with millions of songs and podcasts.",
        category: "Entertainment",
        city: "Stockholm",
        phone: "+46-8-120-99-000",
        website: "https://www.spotify.com",
        maps: "https://maps.google.com/?q=Spotify+Stockholm+Sweden",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/200px-Spotify_logo_without_text.svg.png",
        linkedin: "https://www.linkedin.com/company/spotify",
        instagram: "https://www.instagram.com/spotify",
        tiktok: "https://www.tiktok.com/@spotify",
        snapchat: "https://www.snapchat.com/add/spotify"
    },
    {
        id: 9,
        name: "Adobe",
        description: "Software company providing creative, marketing and document management solutions.",
        category: "Technology",
        city: "San Jose",
        phone: "+1-408-536-6000",
        website: "https://www.adobe.com",
        maps: "https://maps.google.com/?q=Adobe+Headquarters+San+Jose",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Adobe_Corporate_Logo.svg/200px-Adobe_Corporate_Logo.svg.png",
        linkedin: "https://www.linkedin.com/company/adobe",
        twitter: "https://www.twitter.com/adobe",
        instagram: "https://www.instagram.com/adobe",
        youtube: "https://www.youtube.com/user/adobecreativesuite"
    },
    {
        id: 10,
        name: "Slack",
        description: "Business communication platform bringing teams together for collaboration.",
        category: "Technology",
        city: "San Francisco",
        phone: "+1-415-630-7943",
        website: "https://www.slack.com",
        maps: "https://maps.google.com/?q=Slack+Headquarters+San+Francisco",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Slack_icon_2019.svg/200px-Slack_icon_2019.svg.png",
        linkedin: "https://www.linkedin.com/company/tiny-speck-inc",
        twitter: "https://www.twitter.com/slackhq",
        instagram: "https://www.instagram.com/slackhq",
        youtube: "https://www.youtube.com/channel/UCY3YECgeBcLCzIrFLP4gblw"
    },
    {
        id: 11,
        name: "Zoom",
        description: "Video communications company providing cloud-based video conferencing services.",
        category: "Technology",
        city: "San Jose",
        phone: "+1-888-799-9666",
        website: "https://www.zoom.us",
        maps: "https://maps.google.com/?q=Zoom+Headquarters+San+Jose",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Zoom_Communications_Logo.svg/200px-Zoom_Communications_Logo.svg.png",
        linkedin: "https://www.linkedin.com/company/zoom-video-communications",
        twitter: "https://www.twitter.com/zoom",
        instagram: "https://www.instagram.com/zoom",
        youtube: "https://www.youtube.com/user/ZoomMeetings"
    },
    {
        id: 15,
        name: "Oracle",
        description: "Provider of enterprise software and cloud computing solutions.",
        category: "Technology",
        city: "Austin",
        phone: "+1-650-506-7000",
        website: "https://www.oracle.com",
        maps: "https://maps.google.com/?q=Oracle+Headquarters+Austin",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Oracle_logo.svg/200px-Oracle_logo.svg.png",
        linkedin: "https://www.linkedin.com/company/oracle",
        twitter: "https://www.twitter.com/oracle",
        instagram: "https://www.instagram.com/oracle",
        youtube: "https://www.youtube.com/user/Oracle"
    },
    {
        id: 12,
        name: "Netflix",
        description: "Streaming entertainment service with TV series and films across a wide variety of genres.",
        category: "Entertainment",
        city: "Los Gatos",
        phone: "+1-408-540-3700",
        website: "https://www.netflix.com",
        maps: "https://maps.google.com/?q=Netflix+Los+Gatos+CA",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/200px-Netflix_2015_logo.svg.png",
        linkedin: "https://www.linkedin.com/company/netflix",
        twitter: "https://www.twitter.com/netflix",
        instagram: "https://www.instagram.com/netflix",
        youtube: "https://www.youtube.com/user/NewOnNetflix",
        tiktok: "https://www.tiktok.com/@netflix"
    },
    {
        id: 13,
        name: "Tesla",
        description: "Electric vehicle and clean energy company accelerating the world's transition to sustainable energy.",
        category: "Automotive",
        city: "Austin",
        phone: "+1-650-681-5000",
        website: "https://www.tesla.com",
        maps: "https://maps.google.com/?q=Tesla+Gigafactory+Austin",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Tesla_T_symbol.svg/200px-Tesla_T_symbol.svg.png",
        linkedin: "https://www.linkedin.com/company/tesla-motors",
        twitter: "https://www.twitter.com/tesla",
        instagram: "https://www.instagram.com/teslamotors",
        youtube: "https://www.youtube.com/user/TeslaMotors"
    },
    {
        id: 14,
        name: "Uber",
        description: "Technology platform offering ridesharing, food delivery, and freight transportation services.",
        category: "Transportation",
        city: "San Francisco",
        phone: "+1-415-612-8582",
        website: "https://www.uber.com",
        maps: "https://maps.google.com/?q=Uber+Headquarters+San+Francisco",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Uber_logo_2018.png/200px-Uber_logo_2018.png",
        linkedin: "https://www.linkedin.com/company/uber-com",
        twitter: "https://www.twitter.com/uber",
        instagram: "https://www.instagram.com/uber",
        youtube: "https://www.youtube.com/user/uber"
    }
];

// Force reload companies data and refresh display
async function forceDataRefresh() {
    console.log('🔄 Forcing data refresh...');
    
    try {
        // Reload companies data
        companies = await loadCompanies();
        
        // Update display
        renderCompanies();
        
        console.log('✅ Data refresh completed successfully');
        
        // Dispatch cross-window event
        const event = new CustomEvent('logodaleel_force_refresh', {
            detail: { source: 'main_page', timestamp: Date.now() }
        });
        window.dispatchEvent(event);
    } catch (error) {
        console.error('❌ Error during data refresh:', error);
    }
}

// Listen for cross-window refresh events
window.addEventListener('logodaleel_force_refresh', async function(event) {
    if (event.detail.source !== 'main_page') {
        console.log('📡 Received cross-window refresh from:', event.detail.source);
        try {
            companies = await loadCompanies();
            renderCompanies();
            console.log('✅ Cross-window refresh completed');
        } catch (error) {
            console.error('❌ Error during cross-window refresh:', error);
        }
    }
});

// Add keyboard shortcut for manual data refresh (Ctrl+R or F5)
document.addEventListener('keydown', async function(event) {
    if ((event.ctrlKey && event.key === 'r') || event.key === 'F5') {
        event.preventDefault();
        console.log('🔄 Manual refresh triggered by user');
        await forceDataRefresh();
    }
});

// Load companies from localStorage (local development)
async function loadCompanies() {
    try {
        // Try localStorage (for local development/admin testing)
        console.log('🌐 Attempting to load companies from localStorage...');
        const savedCompanies = localStorage.getItem('logodaleel_companies');
        if (savedCompanies) {
            const parsed = JSON.parse(savedCompanies);
            
            // Fix problematic companies instead of filtering them out
            const fixedCompanies = parsed.map(company => {
                let needsFix = false;
                let fixedCompany = { ...company };
                
                // Fix companies with problematic names or images
                if (company.name && (company.name.includes('البيك') || company.name === 'مطعم البيك')) {
                    console.log('� Fixing logo for company:', company.name);
                    needsFix = true;
                }
                
                if (company.logo && (company.logo.includes('am2ojKGHbaKozCgT8') || 
                    company.logo.includes('data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASA') ||
                    (company.logo.startsWith('data:image/jpeg;base64,/9j/') && company.logo.length > 1000000))) {
                    console.log('� Fixing problematic image for company:', company.name);
                    needsFix = true;
                }
                
                if (needsFix) {
                    // Replace with a working logo
                    const workingLogo = 'data:image/svg+xml,%3Csvg width="80" height="80" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="80" height="80" fill="%23ff6b6b" rx="10"/%3E%3Ctext x="40" y="25" text-anchor="middle" fill="white" font-family="Arial" font-size="14"%3E🍔%3C/text%3E%3Ctext x="40" y="45" text-anchor="middle" fill="white" font-family="Arial" font-size="8"%3ERestaurant%3C/text%3E%3Ctext x="40" y="58" text-anchor="middle" fill="white" font-family="Arial" font-size="6"%3EFixed%3C/text%3E%3C/svg%3E';
                    
                    fixedCompany.logo = workingLogo;
                    fixedCompany.logoFixed = true;
                    fixedCompany.logoFixedDate = Date.now();
                }
                
                return fixedCompany;
            });
            
            console.log(`✅ Loaded ${fixedCompanies.length} companies from localStorage`);
            console.log('🔍 Raw companies data:', fixedCompanies);
            const expanded = expandCompaniesWithBranches(fixedCompanies);
            console.log(`🔍 Expanded to ${expanded.length} entries`);
            
            // Save the fixed data back to localStorage
            const fixedCount = fixedCompanies.filter(c => c.logoFixed).length;
            if (fixedCount > 0) {
                localStorage.setItem('logodaleel_companies', JSON.stringify(fixedCompanies));
                console.log(`✅ Fixed ${fixedCount} problematic logos and saved to localStorage`);
            }
            
            return expanded;
        }
    } catch (error) {
        console.error('❌ Error loading companies from localStorage:', error);
    }

    // Fallback to default companies if localStorage is empty
    console.log('📊 Using default companies (localStorage empty)');
    return expandCompaniesWithBranches([...realCompanies]);
}// Expand companies with branches into separate company entries
function expandCompaniesWithBranches(companiesArray) {
    const expandedCompanies = [];
    
    console.log('🔄 Starting expansion of', companiesArray.length, 'companies');
    
    companiesArray.forEach((company, idx) => {
        console.log(`🔍 Processing company ${idx + 1}:`, company.name, 'ID:', company.id, 'Branches:', company.branches?.length || 0);
        
        if (company.branches && company.branches.length > 0) {
            // Company has multiple branches, create separate entries for each
            company.branches.forEach((branch, index) => {
                const branchCompany = {
                    ...company,
                    id: `${company.id}_branch_${index + 1}`,
                    city: branch.city || company.city,
                    governorate: branch.governorate || company.governorate,
                    maps: branch.maps || company.maps,
                    branchNumber: index + 1,
                    totalBranches: company.branches.length,
                    mainCompanyId: company.id
                };
                console.log(`  ➕ Created branch ${index + 1} with ID:`, branchCompany.id);
                expandedCompanies.push(branchCompany);
            });
        } else {
            // Single branch company, use as-is but ensure branch properties
            const singleBranchCompany = {
                ...company,
                branchNumber: 1,
                totalBranches: 1
            };
            console.log(`  ➕ Single branch company with ID:`, singleBranchCompany.id);
            expandedCompanies.push(singleBranchCompany);
        }
    });
    
    console.log(`🔄 Expanded ${companiesArray.length} companies into ${expandedCompanies.length} branch entries`);
    console.log('🔍 Final expanded IDs:', expandedCompanies.map(c => c.id));
    return expandedCompanies;
}

// Initialize companies data asynchronously
async function initializeCompanies() {
    companies = await loadCompanies();
    
    // Check for expired news and automatically turn them off
    checkAndUpdateExpiredNews();
    
    // Initialize the page once companies are loaded
    renderCompanies();
    
    console.log('🚀 Companies initialized and website ready for public use!');
    
    // Hide loading screen once everything is ready
    hideLoadingScreen();
}

// Hide loading screen with smooth animation
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.classList.add('hidden');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500); // Wait for fade transition to complete
    }
}

// Check for expired news/updates and automatically turn them off
function checkAndUpdateExpiredNews() {
    let needsSave = false;
    const now = Date.now();
    const fourteenDays = 14 * 24 * 60 * 60 * 1000; // 14 days in milliseconds
    
    companies.forEach(company => {
        // Only check companies with active news
        if (company.newsActive === true && company.newsStartTime) {
            const elapsed = now - company.newsStartTime;
            
            if (elapsed >= fourteenDays) {
                // Timer has expired - turn off automatically
                company.newsActive = false;
                company.newsExpired = true;
                company.newsExpiredTime = now;
                needsSave = true;
                
                console.log(`📅 Auto-expired news for company: ${company.name}`);
            }
        }
    });
    
    // Save changes if any companies were updated
    if (needsSave) {
        saveCompanyData();
        console.log('✅ Updated expired news and saved company data');
    }
}

// Start initialization
initializeCompanies();

// Listen for localStorage changes (e.g., from admin dashboard)
window.addEventListener('storage', function(e) {
    if (e.key === 'logodaleel_companies' && e.newValue !== e.oldValue) {
        console.log('🔄 Company data changed in localStorage, reloading...');
        reloadCompaniesData();
    }
    
    if (e.key === 'logodaleel_refresh_trigger') {
        console.log('🔄 Refresh trigger received, reloading...');
        reloadCompaniesData();
    }
});

// Listen for custom events from admin dashboard
window.addEventListener('logodaleel_companies_updated', function(e) {
    console.log('🔄 Received custom update event:', e.detail);
    reloadCompaniesData();
});

// Unified reload function
async function reloadCompaniesData() {
    console.log('🔄 Reloading companies data...');
    
    // Store current filter state
    const currentFilter = document.getElementById('categoryFilter')?.value;
    const currentSearch = document.getElementById('searchInput')?.value;
    
    // Reload companies (will try JSON first, then localStorage)
    companies = await loadCompanies();
    
    // Check for expired news after reloading
    checkAndUpdateExpiredNews();
    
    // Don't reset filteredCompanies to all companies - maintain current search state
    
    // Restore filter state and apply current search immediately
    if (currentFilter && document.getElementById('categoryFilter')) {
        document.getElementById('categoryFilter').value = currentFilter;
    }
    if (currentSearch && document.getElementById('searchInput')) {
        document.getElementById('searchInput').value = currentSearch;
        filterCompanies(); // Apply the search again to update filteredCompanies properly
    } else {
        // Only if there's no active search, show all companies
        filteredCompanies = getVisibleCompanies();
        renderCompanies();
    }
    
    console.log('✅ Companies reloaded successfully');
    console.log('📊 Current companies count:', companies.length);
    console.log('👁️ Visible companies count:', filteredCompanies.length);
}

// Poll for localStorage changes (backup method for same-window updates)
let lastCompaniesHash = '';
let lastRefreshTrigger = '';

// Create a simple hash from string that handles Unicode
function createSimpleHash(str) {
    if (!str) return '';
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36).slice(0, 50);
}

function checkForDataChanges() {
    const currentData = localStorage.getItem('logodaleel_companies');
    const currentHash = currentData ? createSimpleHash(currentData) : '';
    const currentRefreshTrigger = localStorage.getItem('logodaleel_refresh_trigger') || '';
    
    if ((currentHash !== lastCompaniesHash && lastCompaniesHash !== '') || 
        (currentRefreshTrigger !== lastRefreshTrigger && lastRefreshTrigger !== '')) {
        console.log('🔄 Detected localStorage change via polling, reloading...');
        reloadCompaniesData();
    }
    
    lastCompaniesHash = currentHash;
    lastRefreshTrigger = currentRefreshTrigger;
}

// Initialize hash and start polling
setTimeout(() => {
    const initialData = localStorage.getItem('logodaleel_companies');
    lastCompaniesHash = initialData ? createSimpleHash(initialData) : '';
    lastRefreshTrigger = localStorage.getItem('logodaleel_refresh_trigger') || '';
    setInterval(checkForDataChanges, 500); // Check every 500ms for faster response
}, 1000);

// Also check for changes when the page becomes visible (user returns from another tab)
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        // Page became visible, check if data has changed
        const currentData = localStorage.getItem('logodaleel_companies');
        const currentCompanies = currentData ? JSON.parse(currentData) : [];
        
        // Compare current companies count with loaded companies count
        if (currentCompanies.length !== companies.length) {
            console.log('🔄 Company data changed while away, reloading...');
            reloadCompaniesData();
            console.log('✅ Companies reloaded on page return');
        }
    }
});

// Only generate dummy companies if localStorage is completely empty (first time visit)
const savedCompanies = localStorage.getItem('logodaleel_companies');
if (!savedCompanies && companies.length < 20) {
    console.log('🔄 First time visit: Generating initial dummy companies...');
    const dummyCount = Math.max(0, 20 - companies.length);
    
    const colors = ['4285F4', 'EA4335', '34A853', 'FBBC05', '4267B2', 'E60023', 'FF0000', '1DB954', 'FF4500', '0084FF'];
    const shapes = ['circle', 'square', 'diamond', 'triangle'];
    const dummyCategories = ['Technology', 'Restaurant', 'Retail', 'Healthcare', 'Finance', 'Education', 'Entertainment', 'Manufacturing'];
    
    for (let i = 0; i < dummyCount; i++) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        const category = dummyCategories[Math.floor(Math.random() * dummyCategories.length)];
        const companyNumber = companies.length + i + 1;
        
        // Use our address hierarchy for dummy companies
        const randomGov = addressHierarchy[Math.floor(Math.random() * addressHierarchy.length)];
        const randomCenter = randomGov.centers[Math.floor(Math.random() * randomGov.centers.length)];
        const randomVillage = randomCenter.villages[Math.floor(Math.random() * randomCenter.villages.length)];
        const fullAddress = `${randomVillage}, ${randomCenter.name}, ${randomGov.governorate}`;
        
        companies.push({
            id: `dummy_${companyNumber}`,
            name: `Company ${companyNumber}`,
            description: `Description for Company ${companyNumber}`,
            category: category,
            city: fullAddress,
            logo: `https://ui-avatars.com/api/?name=C${companyNumber}&background=${color}&color=ffffff&size=200&font-size=0.7&format=png&rounded=true`
        });
    }
    
    // Save the initial companies to localStorage so they don't regenerate
    localStorage.setItem('logodaleel_companies', JSON.stringify(companies));
    console.log('✅ Initial dummy companies saved to localStorage');
}

// Business categories - loaded from localStorage if available, otherwise use default
let businessCategories = (() => {
    const storedCategories = localStorage.getItem('logodaleel_categories');
    if (storedCategories) {
        try {
            const parsed = JSON.parse(storedCategories);
            // Convert to expected format if needed
            return parsed.map(cat => ({
                name: cat.english,
                nameAr: cat.arabic,
                keywords: Array.isArray(cat.keywords) ? cat.keywords : [],
                active: cat.active !== false
            }));
        } catch (e) {
            console.warn('Error parsing stored categories, using defaults:', e);
        }
    }
    
    // Load from CSV if available, otherwise use defaults
    loadCategoriesFromCSV().then(categories => {
        if (categories && categories.length > 0) {
            businessCategories = categories;
            console.log('✅ Updated businessCategories from CSV:', businessCategories.length);
        }
    }).catch(error => {
        console.warn('⚠️ Could not load categories from CSV, using defaults:', error);
    });
    
    // Default categories if none stored
    return [
        {
            name: "Food & Drink",
            nameAr: "الطعام والشراب",
            keywords: ["Food & Drink", "الطعام والشراب", "Restaurants", "مطاعم", "eatery", "dining place", "food joint", "Cafes", "مقاهي", "coffee shop", "coffeehouse", "café", "Bakeries", "مخابز", "bakery", "bread shop", "pastry shop", "Sweets", "حلويات", "dessert", "candy"],
            active: true
        },
    {
        name: "Retail",
        nameAr: "تجارة التجزئة",
        keywords: ["Retail", "تجارة التجزئة", "Grocery", "بقالة", "grocery store", "market", "hypermarket", "supermarket", "Electronics", "إلكترونيات", "Fashion", "أزياء", "clothing", "apparel", "Jewelry", "مجوهرات", "gold", "ذهب", "Home & Furniture", "منزل وأثاث", "furniture", "أثاث"],
        active: true
    },
    {
        name: "Automotive",
        nameAr: "السيارات",
        keywords: ["Automotive", "السيارات", "Dealerships", "معارض السيارات", "car dealer", "automobile dealer", "Service & Repair", "خدمة وإصلاح", "workshop", "garage", "maintenance", "Tires", "إطارات", "Battery", "بطارية", "Car Wash", "غسيل سيارات", "Rentals", "تأجير", "rental services"]
    },
    {
        name: "Health & Medical",
        nameAr: "الصحة والطب",
        keywords: ["Health & Medical", "الصحة والطب", "Hospitals", "مستشفيات", "medical center", "healthcare facility", "Clinics", "عيادات", "clinic", "Pharmacies", "صيدليات", "pharmacy", "Labs", "مختبرات", "laboratory", "diagnostic", "Alternative Medicine", "الطب البديل", "herbal medicine"]
    },
    {
        name: "Beauty & Personal Care",
        nameAr: "الجمال والعناية الشخصية",
        keywords: ["Beauty & Personal Care", "الجمال والعناية الشخصية", "Salons", "صالونات", "beauty salon", "hair salon", "barbershop", "Spas", "سبا", "spa", "massage", "wellness center", "Cosmetics", "مستحضرات التجميل", "makeup", "perfume", "عطور", "fragrance"]
    },
    {
        name: "Home Services",
        nameAr: "خدمات منزلية",
        keywords: ["Home Services", "خدمات منزلية", "Cleaning", "تنظيف", "housekeeping", "janitorial", "AC & Electrical", "تكييف وكهرباء", "air conditioning", "HVAC", "electrical", "Plumbing", "سباكة", "plumber", "Pest Control", "مكافحة الحشرات", "exterminator", "Handyman", "صيانة", "repair"]
    },
    {
        name: "Professional Services",
        nameAr: "الخدمات المهنية",
        keywords: ["Professional Services", "الخدمات المهنية", "Business Consulting", "استشارات أعمال", "consultancy", "advisory", "Accounting", "محاسبة", "accountancy", "audit", "HR", "الموارد البشرية", "human resources", "recruitment", "Translation", "ترجمة", "interpreting", "Architecture", "هندسة", "engineering"]
    },
    {
        name: "Legal",
        nameAr: "قانون",
        keywords: ["Legal", "قانون", "Law Firms", "مكاتب محاماة", "legal services", "lawyer", "attorney", "Notary", "توثيق", "notary public", "attestation", "legal documentation"]
    },
    {
        name: "Finance & Insurance",
        nameAr: "المالية والتأمين",
        keywords: ["Finance & Insurance", "المالية والتأمين", "Banks", "بنوك", "banking", "financial institution", "Exchange", "صرف", "currency exchange", "money transfer", "Insurance", "التأمين", "insurance company", "Investment", "استثمار", "brokerage", "Fintech", "تقنية مالية", "financial technology"]
    },
    {
        name: "Real Estate",
        nameAr: "العقار",
        keywords: ["Real Estate", "العقار", "property", "real estate agency", "Developers", "مطورون", "property developer", "Property Management", "إدارة الأملاك", "property services", "Appraisal", "تقييم عقاري", "valuation", "property valuation"]
    },
    {
        name: "Construction",
        nameAr: "الإنشاءات",
        keywords: ["Construction", "الإنشاءات", "contractors", "building contractors", "General Contracting", "مقاولات عامة", "Civil", "أعمال مدنية", "civil engineering", "MEP", "ميكانيكا وكهرباء وسباكة", "Finishing", "تشطيبات", "fit out", "Building Materials", "مواد البناء", "construction materials"]
    },
    {
        name: "Manufacturing & Industrial",
        nameAr: "الصناعة",
        keywords: ["Manufacturing & Industrial", "الصناعة", "manufacturing", "industrial", "Food Manufacturing", "تصنيع غذائي", "food processing", "Plastics", "بلاستيك", "plastic manufacturing", "Metals", "معادن", "metal fabrication", "metalworks", "Chemicals", "كيماويات", "chemical production", "Textiles", "المنسوجات", "textile", "garments"]
    },
    {
        name: "Energy & Utilities",
        nameAr: "الطاقة والمرافق",
        keywords: ["Energy & Utilities", "الطاقة والمرافق", "Oil & Gas", "النفط والغاز", "petroleum services", "oilfield services", "Petrochemicals", "بتروكيماويات", "petrochemical", "Power Generation", "توليد الطاقة", "power plant", "Renewable Energy", "الطاقة المتجددة", "solar", "wind", "Water", "المياه", "water treatment", "Waste Management", "إدارة النفايات", "recycling"]
    },
    {
        name: "IT & Software",
        nameAr: "تقنية المعلومات",
        keywords: ["IT & Software", "تقنية المعلومات", "Software Development", "تطوير البرمجيات", "software engineering", "web development", "IT Services", "خدمات تقنية المعلومات", "IT support", "Cloud", "السحابة", "cloud computing", "Cybersecurity", "الأمن السيبراني", "Data & AI", "البيانات والذكاء الاصطناعي", "data analytics", "artificial intelligence"]
    },
    {
        name: "Telecommunications",
        nameAr: "الاتصالات",
        keywords: ["Telecommunications", "الاتصالات", "Mobile Operators", "مشغلي الاتصالات", "telecom", "mobile service", "Internet Providers", "مزودو الإنترنت", "broadband", "ISP", "Satellite", "الأقمار الصناعية", "satellite communications", "VSAT", "Telecom Equipment", "معدات الاتصالات", "network hardware"]
    },
    {
        name: "Education & Training",
        nameAr: "التعليم والتدريب",
        keywords: ["Education & Training", "التعليم والتدريب", "Schools", "مدارس", "educational institutions", "Universities", "جامعات", "higher education", "Institutes", "معاهد", "training institutes", "Tutoring", "دروس خصوصية", "tutors", "private lessons", "Corporate Training", "التدريب المهني", "professional training"]
    },
    {
        name: "Travel & Tourism",
        nameAr: "السفر والسياحة",
        keywords: ["Travel & Tourism", "السفر والسياحة", "Travel Agencies", "وكالات السفر", "tour agencies", "travel bureau", "Tour Operators", "منظمو الرحلات", "tour companies", "Hajj & Umrah", "الحج والعمرة", "pilgrimage services", "Tourist Guides", "المرشدون السياحيون", "tour guides"]
    },
    {
        name: "Hospitality & Lodging",
        nameAr: "الضيافة والإقامة",
        keywords: ["Hospitality & Lodging", "الضيافة والإقامة", "Hotels", "فنادق", "lodging", "accommodation", "inn", "Serviced Apartments", "شقق فندقية", "furnished apartments", "Resorts", "منتجعات", "vacation resort", "holiday resort", "Vacation Rentals", "تأجير العطلات", "holiday homes", "chalets"]
    },
    {
        name: "Entertainment & Events",
        nameAr: "الترفيه والفعاليات",
        keywords: ["Entertainment & Events", "الترفيه والفعاليات", "Cinemas", "سينما", "movie theaters", "Theme Parks", "حدائق ترفيهية", "amusement parks", "Event Management", "إدارة الفعاليات", "event planning", "Wedding Halls", "قاعات الأفراح", "wedding venues", "Kids Play", "مناطق لعب الأطفال", "playgrounds"]
    },
    {
        name: "Sports & Fitness",
        nameAr: "الرياضة واللياقة",
        keywords: ["Sports & Fitness", "الرياضة واللياقة", "Gyms", "نوادي رياضية", "fitness center", "health club", "Sports Clubs", "أندية رياضية", "athletic clubs", "Martial Arts", "فنون القتال", "combat sports", "Sports Stores", "متاجر الرياضة", "sporting goods"]
    },
    {
        name: "Transportation & Logistics",
        nameAr: "النقل واللوجستيات",
        keywords: ["Transportation & Logistics", "النقل واللوجستيات", "Freight", "الشحن", "freight services", "shipping logistics", "Couriers", "التوصيل", "courier services", "delivery", "Warehousing", "التخزين", "storage services", "warehouses", "Customs", "الجمارك", "customs clearance", "Public Transport", "النقل العام", "public transportation"]
    },
    {
        name: "Agriculture & Livestock",
        nameAr: "الزراعة والثروة الحيوانية",
        keywords: ["Agriculture & Livestock", "الزراعة والثروة الحيوانية", "Farms", "مزارع", "farmland", "agriculture", "Date Farms", "مزارع التمور", "dates plantation", "Poultry", "الدواجن", "poultry farming", "livestock farming", "Agricultural Supplies", "مستلزمات زراعية", "farm equipment", "Veterinary", "بيطرية", "animal clinic", "Animal Markets", "أسواق الحيوانات"]
    },
    {
        name: "Government & Public Services",
        nameAr: "الجهات الحكومية والخدمات العامة",
        keywords: ["Government & Public Services", "الجهات الحكومية والخدمات العامة", "Ministries", "وزارات", "government ministries", "public agencies", "Municipal", "بلدية", "municipality services", "Civil Affairs", "الأحوال المدنية", "passport office", "Courts", "المحاكم", "judicial courts", "Traffic", "المرور", "traffic department", "Emergency", "الطوارئ", "emergency services"]
    },
    {
        name: "Nonprofit & Community",
        nameAr: "غير ربحي ومجتمعي",
        keywords: ["Nonprofit & Community", "غير ربحي ومجتمعي", "Charities", "جمعيات خيرية", "charity organizations", "non-profit", "Foundations", "مؤسسات", "nonprofit foundations", "Volunteer", "التطوع", "volunteer organizations", "NGO", "منظمات غير حكومية", "community development"]
    },
    {
        name: "Religious Organizations",
        nameAr: "جهات دينية",
        keywords: ["Religious Organizations", "جهات دينية", "Mosques", "مساجد", "masjid", "prayer hall", "Quran Schools", "مدارس القرآن", "Quranic schools", "Tahfiz schools", "Islamic Centers", "مراكز إسلامية", "Islamic centres", "Da'wah", "الدعوة", "religious education"]
    },
    {
        name: "Media & Advertising",
        nameAr: "الإعلام والإعلان",
        keywords: ["Media & Advertising", "الإعلام والإعلان", "Advertising Agencies", "وكالات الإعلان", "ad agencies", "advertising companies", "Digital Marketing", "التسويق الرقمي", "online marketing", "internet marketing", "Public Relations", "العلاقات العامة", "PR services", "marketing", "social media", "content creation"]
    }
];
})(); // Close the IIFE and assign to businessCategories

// Load categories from CSV file (enhanced version)
async function loadCategoriesFromCSV() {
    try {
        const response = await fetch('saudi_business_categories_updated.csv');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const csvText = await response.text();
        const lines = csvText.split('\n');
        
        // Skip header row
        const dataLines = lines.slice(1).filter(line => line.trim());
        
        const categories = [];
        
        // Parse CSV and build categories (simplified for main site)
        dataLines.forEach(line => {
            const columns = line.split(',').map(col => col.trim().replace(/^"|"$/g, ''));
            if (columns.length < 9) return;
            
            const [level1_en, level1_ar, level2_en, level2_ar, level3_en, level3_ar, level1_keywords, level2_keywords, level3_keywords] = columns;
            
            if (!level1_en || !level2_en || !level3_en) return;
            
            // Parse keywords (split by semicolon)
            const parseKeywords = (keywordString) => {
                if (!keywordString) return [];
                return keywordString.split(';').map(k => k.trim()).filter(k => k);
            };
            
            const level1_kw = parseKeywords(level1_keywords);
            const level2_kw = parseKeywords(level2_keywords);
            const level3_kw = parseKeywords(level3_keywords);
            
            // Create category path for main site
            const categoryName = `${level1_en} > ${level2_en} > ${level3_en}`;
            const categoryNameAr = `${level1_ar} > ${level2_ar} > ${level3_ar}`;
            
            // Combine all keywords
            const allKeywords = [...new Set([...level1_kw, ...level2_kw, ...level3_kw])];
            
            categories.push({
                name: categoryName,
                nameAr: categoryNameAr,
                keywords: allKeywords,
                active: true,
                // Store level info for advanced matching
                level1: { en: level1_en, ar: level1_ar, keywords: level1_kw },
                level2: { en: level2_en, ar: level2_ar, keywords: level2_kw },
                level3: { en: level3_en, ar: level3_ar, keywords: level3_kw }
            });
        });
        
        console.log(`✅ Loaded ${categories.length} categories from CSV`);
        return categories;
    } catch (error) {
        console.warn('⚠️ Failed to load categories from CSV:', error);
        return null;
    }
}

// Function to detect if text contains Arabic characters
function isArabicText(text) {
    if (!text) return false;
    const arabicPattern = /[\u0600-\u06FF\u0750-\u077F]/;
    return arabicPattern.test(text);
}

// Function to get the appropriate category display name based on user language preference
function getCategoryDisplayName(categoryName, preferArabic = false) {
    if (!categoryName) return '';
    
    const category = businessCategories.find(cat => 
        cat.name === categoryName || cat.nameAr === categoryName
    );
    
    if (!category) return categoryName;
    
    // If preferArabic is true or if we detect user is searching in Arabic, return Arabic name
    return preferArabic ? category.nameAr : category.name;
}

// Function to detect user language preference from current search
function detectUserLanguagePreference() {
    const searchInput = document.getElementById('search');
    if (searchInput && searchInput.value) {
        return isArabicText(searchInput.value);
    }
    
    // Check if the page direction suggests Arabic
    return document.dir === 'rtl';
}

// Function to refresh categories from localStorage
function refreshCategoriesFromStorage() {
    const storedCategories = localStorage.getItem('logodaleel_categories');
    if (storedCategories) {
        try {
            const parsed = JSON.parse(storedCategories);
            // Convert to expected format
            businessCategories = parsed.map(cat => ({
                name: cat.english,
                nameAr: cat.arabic,
                keywords: Array.isArray(cat.keywords) ? cat.keywords : [],
                active: cat.active !== false
            }));
            console.log('✅ Categories refreshed from localStorage:', businessCategories.length);
            return true;
        } catch (e) {
            console.warn('Error parsing stored categories:', e);
            return false;
        }
    }
    return false;
}
const searchIntents = {
    location: {
        patterns: ['near', 'in', 'around', 'close to', 'nearby', 'within'],
        keywords: ['downtown', 'city', 'area', 'district', 'region', 'location']
    },
    service: {
        patterns: ['need', 'looking for', 'want', 'require', 'find', 'search for'],
        keywords: ['service', 'help', 'assistance', 'support', 'solution']
    },
    category: {
        patterns: ['type of', 'kind of', 'category', 'business that'],
        keywords: ['company', 'business', 'store', 'shop', 'firm', 'organization']
    },
    contact: {
        patterns: ['contact', 'call', 'reach', 'phone', 'email'],
        keywords: ['number', 'address', 'information', 'details']
    }
};

// Semantic keyword mapping for intelligent search
const semanticKeywords = {
    food: ['restaurant', 'cafe', 'diner', 'eatery', 'kitchen', 'bistro', 'grill', 'bar'],
    tech: ['technology', 'software', 'digital', 'computer', 'IT', 'programming', 'development'],
    health: ['healthcare', 'medical', 'clinic', 'hospital', 'doctor', 'physician', 'therapy'],
    money: ['finance', 'bank', 'investment', 'loan', 'credit', 'financial', 'accounting'],
    shop: ['retail', 'store', 'boutique', 'market', 'shopping', 'merchandise'],
    fix: ['repair', 'maintenance', 'service', 'fix', 'mechanic', 'technician'],
    learn: ['education', 'school', 'training', 'course', 'academy', 'university'],
    fun: ['entertainment', 'recreation', 'gaming', 'sports', 'music', 'movie'],
    beauty: ['salon', 'spa', 'cosmetics', 'skincare', 'hair', 'nails', 'wellness'],
    legal: ['lawyer', 'attorney', 'law', 'legal', 'court', 'litigation'],
    home: ['house', 'property', 'real estate', 'construction', 'building', 'contractor'],
    transport: ['taxi', 'delivery', 'shipping', 'logistics', 'moving', 'transportation'],
    auto: ['car', 'automotive', 'vehicle', 'auto', 'garage', 'dealership']
};

// Natural language patterns for query understanding
const nlpPatterns = [
    {
        pattern: /(?:find|show|search|get|look for)\s+(.+?)(?:\s+(?:near|in|around)\s+(.+))?$/i,
        intent: 'search',
        extract: (match) => ({ query: match[1], location: match[2] })
    },
    {
        pattern: /(?:i need|looking for|want)\s+(.+?)(?:\s+(?:that|which)\s+(.+))?$/i,
        intent: 'need',
        extract: (match) => ({ service: match[1], criteria: match[2] })
    },
    {
        pattern: /(?:what|which|who)\s+(.+?)(?:\s+(?:in|near|around)\s+(.+))?$/i,
        intent: 'question',
        extract: (match) => ({ question: match[1], location: match[2] })
    },
    {
        pattern: /(.+?)\s+(?:near|in|around|close to)\s+(.+)$/i,
        intent: 'location',
        extract: (match) => ({ query: match[1], location: match[2] })
    },
    {
        pattern: /(.+?)\s+(?:with|that|offering|providing)\s+(.+)$/i,
        intent: 'feature',
        extract: (match) => ({ query: match[1], feature: match[2] })
    }
];

let selectedCategoryIndex = -1;

let filteredCompanies = [];

// Filter companies to show only visible ones (not hidden)
function getVisibleCompanies() {
    return companies.filter(company => {
        // Filter out hidden companies
        if (company.status === 'hidden') {
            return false;
        }
        
        // Filter out companies from blacklisted phone numbers
        if (company.phone && isPhoneBlacklisted(company.phone)) {
            return false;
        }
        
        return true;
    });
}

// Update filtered companies with visible companies only
function updateFilteredCompanies() {
    filteredCompanies = getVisibleCompanies();
    renderCompanies();
}

// DOM elements
const companiesGrid = document.getElementById('companiesGrid');
const companyPopup = document.getElementById('companyPopup');
const addCompanyModal = document.getElementById('addCompanyModal');
const searchInput = document.getElementById('searchInput');
const addCompanyForm = document.getElementById('addCompanyForm');
const authStep = document.getElementById('authStep');
const companyFormStep = document.getElementById('companyFormStep');
const phoneAuthStep = document.getElementById('phoneAuthStep');
const otpAuthStep = document.getElementById('otpAuthStep');

// Ensure loading screen is hidden in case of any errors
window.addEventListener('load', () => {
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen && !loadingScreen.classList.contains('hidden')) {
            console.log('⚠️ Fallback: Hiding loading screen after window load');
            hideLoadingScreen();
        }
    }, 3000); // Max 3 seconds loading time
});

// Also hide loading screen on any unhandled errors
window.addEventListener('error', (e) => {
    console.error('Page error detected:', e.error);
    hideLoadingScreen();
});

// Save company data to localStorage
function saveCompanyData() {
    try {
        // Convert expanded companies back to original format before saving
        const originalCompanies = collapseExpandedCompanies(companies);
        localStorage.setItem('logodaleel_companies', JSON.stringify(originalCompanies));
        
        // Trigger refresh for other tabs/windows (admin dashboard)
        localStorage.setItem('logodaleel_refresh_trigger', Date.now().toString());
        
        // Also dispatch a custom event for immediate sync
        window.dispatchEvent(new CustomEvent('logodaleel_companies_updated', {
            detail: { companiesCount: originalCompanies.length, timestamp: Date.now() }
        }));
        
        console.log('✅ Companies saved to localStorage (collapsed from', companies.length, 'to', originalCompanies.length, 'entries)');
        console.log('🔄 Triggered refresh events for admin dashboard sync');
    } catch (error) {
        console.error('❌ Error saving companies:', error);
    }
}

// Collapse expanded branch companies back to original format
function collapseExpandedCompanies(expandedCompanies) {
    const companyMap = new Map();
    
    expandedCompanies.forEach(company => {
        const mainId = company.mainCompanyId || company.id.split('_branch_')[0];
        
        if (!companyMap.has(mainId)) {
            // Create the main company entry
            const mainCompany = { ...company };
            delete mainCompany.branchNumber;
            delete mainCompany.totalBranches;
            delete mainCompany.mainCompanyId;
            
            // Reset ID to main ID
            mainCompany.id = mainId;
            
            // Initialize branches array if this company has multiple branches
            if (company.totalBranches > 1) {
                mainCompany.branches = [];
            }
            
            companyMap.set(mainId, mainCompany);
        }
        
        // If this is a branch, add it to the branches array
        if (company.totalBranches > 1) {
            const mainCompany = companyMap.get(mainId);
            const branchData = {
                city: company.city,
                governorate: company.governorate,
                maps: company.maps
            };
            
            // Only add if not already present (avoid duplicates)
            const exists = mainCompany.branches.some(b => 
                b.city === branchData.city && 
                b.governorate === branchData.governorate && 
                b.maps === branchData.maps
            );
            
            if (!exists) {
                mainCompany.branches.push(branchData);
            }
        }
    });
    
    return Array.from(companyMap.values());
}

// Clean up duplicate companies on page load
function cleanupDuplicateCompanies() {
    const originalLength = companies.length;
    
    // Remove duplicates based on unique IDs (keeping the last occurrence)
    const uniqueCompanies = [];
    const seenIds = new Set();
    
    // Process in reverse to keep the most recent version of each company
    for (let i = companies.length - 1; i >= 0; i--) {
        const company = companies[i];
        const baseId = company.mainCompanyId || company.id.split('_branch_')[0];
        
        if (!seenIds.has(company.id)) {
            seenIds.add(company.id);
            uniqueCompanies.unshift(company);
        }
    }
    
    companies = uniqueCompanies;
    
    if (originalLength !== companies.length) {
        console.log(`🧹 Cleaned up duplicates: ${originalLength} → ${companies.length} companies`);
        saveCompanyData();
    }
}

// Add a new company (called from the form)
function addCompany(companyData) {
    const newCompany = {
        id: `user_${Date.now()}`,
        name: companyData.name,
        category: companyData.category,
        description: companyData.description,
        logo: companyData.logo,
        phone: companyData.phone,
        address: companyData.address,
        website: companyData.website,
        social: companyData.social || {},
        status: 'active',
        // Admin dashboard compatibility fields
        email: companyData.email || '',
        mapsUrl: companyData.mapsUrl || companyData.maps || '',
        city: companyData.address,
        facebook: (companyData.social && companyData.social.facebook) || '',
        twitter: (companyData.social && companyData.social.twitter) || '',
        instagram: (companyData.social && companyData.social.instagram) || '',
        maps: companyData.mapsUrl || companyData.maps || '',
        lastEdited: Date.now() // Set timestamp when company is added from main page
    };
    
    companies.unshift(newCompany); // Add to beginning
    filteredCompanies = getVisibleCompanies();
    saveCompanyData();
    renderCompanies();
    
    console.log('✅ New company added:', newCompany.name);
    return newCompany;
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Initialize categories from localStorage if available
    refreshCategoriesFromStorage();
    
    // Clean up any duplicate data first
    cleanupDuplicateCompanies();
    
    filteredCompanies = getVisibleCompanies();
    renderCompanies();
    setupEventListeners();
    setupCategoryAutocomplete(); // Set up category dropdown with current categories
    initializeSiteLogo();
    loadSiteSettings(); // Load site settings for dropdown
    
    // Restore authentication state if user was previously signed in
    const userData = localStorage.getItem('logodaleel_user');
    if (userData) {
        try {
            authCurrentUser = JSON.parse(userData);
            
            // Check if the user is blacklisted and log them out if necessary
            if (authCurrentUser.phone && isPhoneBlacklisted(authCurrentUser.phone)) {
                console.log('🚫 User is blacklisted, logging out:', authCurrentUser.phone);
                logoutBlacklistedUser();
                return; // Stop execution to prevent UI updates
            }
            
            updateUIForSignedInUser();
            console.log('✅ User authentication restored for phone:', authCurrentUser.phone);
        } catch (error) {
            console.error('Error restoring user authentication:', error);
            localStorage.removeItem('logodaleel_user');
            authCurrentUser = null;
        }
    }
    
    // Initialize Saudi location data if available
    if (typeof saudiAddressData !== 'undefined' && saudiAddressData.length > 0) {
        saudiLocationData = saudiAddressData;
        console.log('✅ Saudi location data loaded for filters:', saudiLocationData.length, 'governorates');
    } else {
        console.warn('⚠️ Saudi address data not available for filters');
        saudiLocationData = [];
    }
    
    // Initialize working address search (proven to work)
    initializeWorkingAddressSearch();
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        const logoDropdown = document.getElementById('logoDropdown');
        const logoContainer = document.querySelector('.logo-dropdown-container');
        
        if (logoDropdown && !logoContainer.contains(e.target)) {
            logoDropdown.classList.remove('show');
        }
    });
    
    // Test the URL parsing function (remove after testing)
    // console.log('Testing URL parsing:');
    // console.log('Test 1:', extractCityFromMapsUrl('https://maps.google.com/?q=Apple+Park+Cupertino+CA'));
    // console.log('Test 2:', extractCityFromMapsUrl('https://maps.google.com/place/Google+LLC+Mountain+View+CA'));
    // console.log('Test 3 (your format):', extractCityFromMapsUrl('https://maps.app.goo.gl/am2ojKGHbaKozCgT8'));
    
    // Set up periodic blacklist check (every 30 seconds)
    setInterval(function() {
        if (authCurrentUser && authCurrentUser.phone && isPhoneBlacklisted(authCurrentUser.phone)) {
            console.log('🚫 Periodic check: User is now blacklisted, logging out:', authCurrentUser.phone);
            logoutBlacklistedUser();
        }
    }, 30000);
    
    // Listen for localStorage changes (for cross-window synchronization)
    window.addEventListener('storage', function(e) {
        if (e.key === 'logodaleel_refresh_trigger') {
            console.log('🔄 Refresh trigger detected, reloading data...');
            // Refresh categories
            refreshCategoriesFromStorage();
            // Refresh companies
            companies = JSON.parse(localStorage.getItem('logodaleel_companies') || '[]');
            filteredCompanies = getVisibleCompanies();
            renderCompanies();
        } else if (e.key === 'logodaleel_categories') {
            console.log('🏷️ Categories updated, refreshing...');
            refreshCategoriesFromStorage();
            // Update category dropdown if visible
            setupCategoryAutocomplete();
        }
    });
});

// Initialize site logo
function initializeSiteLogo() {
    // This function will be used to set the LogoDaleel logo when provided
    // For now, we show the site logo which is already in the HTML
    const siteLogo = document.querySelector('.site-logo');
    
    // Logo is already set via HTML img src="logo.svg"
    if (siteLogo) {
        // Logo is displayed properly via CSS
        console.log('Site logo initialized successfully');
    }
}

// Function to set the site logo (call this when logo is provided)
function setSiteLogo(logoUrl) {
    const siteLogo = document.getElementById('siteLogo');
    const siteTitle = document.querySelector('.site-title');
    
    // Only set src if both logoUrl is valid AND the siteLogo element exists
    if (siteLogo && logoUrl && logoUrl.trim() !== '') {
        siteLogo.src = logoUrl;
        siteLogo.style.display = 'block';
        if (siteTitle) {
            siteTitle.style.display = 'none'; // Hide text when logo is available
        }
    }
}

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    searchInput.addEventListener('input', debounce(searchCompanies, 300));
    
    // Form submission (for authenticated company form)
    addCompanyForm.addEventListener('submit', handleAddCompanySubmission);
    
    // Logo preview functionality
    document.getElementById('companyLogo').addEventListener('change', handleLogoPreview);
    
    // Category autocomplete functionality
    setupCategoryAutocomplete();
    
    // Note: Address autocomplete is now handled by initializeWorkingAddressSearch()
    
    // Close modal when clicking outside
    addCompanyModal.addEventListener('click', function(e) {
        if (e.target === addCompanyModal) {
            hideAddCompanyForm();
        }
    });
    
        // Track mouse movement for popup interaction
    document.addEventListener('mousemove', function(e) {
        const popup = companyPopup;
        if (popup.classList.contains('show')) {
            const activeCard = document.querySelector('.company-card[data-active="true"]');
            if (activeCard) {
                const cardRect = activeCard.getBoundingClientRect();
                const popupRect = popup.getBoundingClientRect();
                
                // Calculate the path area between card and popup
                const pathArea = {
                    left: Math.min(cardRect.left, popupRect.left) - 5,
                    top: Math.min(cardRect.top, popupRect.top) - 5,
                    right: Math.max(cardRect.right, popupRect.right) + 5,
                    bottom: Math.max(cardRect.bottom, popupRect.bottom) + 5
                };

                // Check if mouse is in the safe area (card, popup, or path between them)
                const inSafeArea = (
                    (e.clientX >= cardRect.left && e.clientX <= cardRect.right && 
                     e.clientY >= cardRect.top && e.clientY <= cardRect.bottom) ||
                    (e.clientX >= popupRect.left && e.clientX <= popupRect.right && 
                     e.clientY >= popupRect.top && e.clientY <= popupRect.bottom) ||
                    (e.clientX >= pathArea.left && e.clientX <= pathArea.right && 
                     e.clientY >= pathArea.top && e.clientY <= pathArea.bottom)
                );

                if (!inSafeArea) {
                    hidePopup();
                }

                // Prevent other cards from triggering while in path area
                if (inSafeArea) {
                    e.stopPropagation();
                    const hoveredCard = e.target.closest('.company-card');
                    if (hoveredCard && hoveredCard !== activeCard) {
                        hoveredCard.style.pointerEvents = 'none';
                        setTimeout(() => {
                            hoveredCard.style.pointerEvents = 'auto';
                        }, 100);
                    }
                }
            }
        }
    });
}

// Render companies in the grid
function renderCompanies() {
    console.log('🎨 Rendering companies, filteredCompanies count:', filteredCompanies.length);
    
    companiesGrid.innerHTML = '';
    
    if (filteredCompanies.length === 0) {
        companiesGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; color: #666; font-size: 18px; padding: 40px;">
                <p>No companies found matching your search.</p>
                <div style="margin-top: 20px; padding: 20px; background: #f8f9fa; border-radius: 8px; border: 2px dashed #dee2e6;">
                    <p style="margin-bottom: 15px; color: #6c757d;">Can't find the right category for your business?</p>
                    <button onclick="suggestCategory()" style="background: #28a745; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-size: 14px;">
                        💡 Suggest New Category
                    </button>
                </div>
            </div>
        `;
        return;
    }
    
    filteredCompanies.forEach((company, index) => {
        try {
            const companyCard = createCompanyCard(company);
            companiesGrid.appendChild(companyCard);
        } catch (error) {
            console.error(`Error creating company card for index ${index}:`, error, company);
            // Skip this company and continue with others
        }
    });
    
    // Update news panel counter
    refreshNewsPanel();
    
    console.log('✅ Finished rendering companies');
}

// Create a company card element
function createCompanyCard(company) {
    const card = document.createElement('div');
    card.className = 'company-card';
    card.dataset.companyId = company.id;
    
    // Add branch indicator if company has multiple branches
    // Handle legacy companies that don't have branch data
    const totalBranches = company.totalBranches || 1;
    const branchNumber = company.branchNumber || 1;
    const branchIndicator = totalBranches > 1 ? 
        `<div class="branch-indicator">${branchNumber}</div>` : '';
    
    // Ensure company has required properties
    const companyName = company.name || 'Unknown Company';
    const companyLogo = company.logo || '';
    
    // Create a safe fallback image (avoid encoding issues with Arabic text)
    const safeName = companyName.replace(/[^\x00-\x7F]/g, "").substring(0, 8) || 'Logo';
    const fallbackImage = 'data:image/svg+xml,%3Csvg width="80" height="80" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="80" height="80" fill="%23f0f0f0" stroke="%23ddd" stroke-width="1"/%3E%3Ccircle cx="40" cy="30" r="8" fill="%23007bff" opacity="0.7"/%3E%3Crect x="25" y="45" width="30" height="3" fill="%23007bff" opacity="0.7"/%3E%3Crect x="30" y="52" width="20" height="2" fill="%23007bff" opacity="0.5"/%3E%3Ctext x="40" y="68" text-anchor="middle" fill="%23666" font-family="Arial,sans-serif" font-size="10"%3E' + encodeURIComponent(safeName) + '%3C/text%3E%3C/svg%3E';
    
    // Alternative simple fallback if the above fails
    const simpleFallback = 'data:image/svg+xml,%3Csvg width="80" height="80" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="80" height="80" fill="%23e0e0e0"/%3E%3Ctext x="40" y="45" text-anchor="middle" fill="%23666" font-family="Arial" font-size="14"%3ELOGO%3C/text%3E%3C/svg%3E';
    
    // Create the image element separately to avoid template literal issues
    const imgElement = document.createElement('img');
    imgElement.alt = companyName;
    imgElement.className = 'company-logo';
    imgElement.loading = 'lazy'; // Enable lazy loading for better performance
    
    // Add loading state management and retry mechanism
    imgElement.style.opacity = '0.5';
    imgElement.style.transition = 'opacity 0.3s ease';
    
    let retryCount = 0;
    const maxRetries = 2;
    
    // Set up a timeout to prevent infinite loading (reduced to 3 seconds for better UX)
    let imageLoadTimeout = setTimeout(() => {
        if (imgElement.style.opacity === '0.5') {
            console.warn('Image loading timeout for company:', companyName);
            imgElement.src = fallbackImage;
            imgElement.style.opacity = '1';
        }
    }, 3000); // 3 second timeout
    
    // Handle successful image load
    imgElement.onload = function() {
        clearTimeout(imageLoadTimeout);
        this.style.opacity = '1';
        console.log('✅ Image loaded successfully for company:', companyName);
    };
    
    // Handle image load errors with fallback and retry mechanism
    imgElement.onerror = function() {
        clearTimeout(imageLoadTimeout);
        retryCount++;
        console.warn(`Image failed to load for company: ${companyName} (attempt ${retryCount}/${maxRetries + 1}) URL:`, this.src);
        
        if (this.src !== fallbackImage && this.src !== simpleFallback) {
            if (retryCount <= maxRetries && companyLogo && companyLogo.trim() !== '' && !companyLogo.startsWith('data:')) {
                // Only retry for external URLs, not data URIs
                console.log(`Retrying image load for ${companyName}...`);
                setTimeout(() => {
                    this.src = companyLogo + (companyLogo.includes('?') ? '&' : '?') + 't=' + Date.now();
                }, 500 * retryCount); // Shorter delay for faster fallback
            } else {
                console.log(`Using primary fallback for ${companyName}`);
                this.src = fallbackImage;
                this.style.opacity = '1';
            }
        } else if (this.src === fallbackImage) {
            // If even the fallback fails, use the simple fallback
            console.log(`Using secondary fallback for ${companyName}`);
            this.src = simpleFallback;
            this.style.opacity = '1';
        } else {
            // Final fallback already failed, just show it
            console.log(`Final fallback displayed for ${companyName}`);
            this.style.opacity = '1';
        }
    };
    
    // Set src after event handlers to ensure they're ready
    imgElement.src = companyLogo || fallbackImage;
    
    card.innerHTML = `
        ${branchIndicator}
        <div class="company-title">${companyName}</div>
    `;
    
    // Insert the image element after the branch indicator
    const titleElement = card.querySelector('.company-title');
    card.insertBefore(imgElement, titleElement);
    
    card.addEventListener('mouseenter', (e) => {
        showPopup(e, company);
    });
    
    return card;
}

// Show popup with company information
function parseAddressForDisplay(fullAddress, governorate) {
    if (!fullAddress || fullAddress.trim() === '') {
        return governorate || '';
    }
    
    // Split the address by commas and clean up each part
    let parts = fullAddress.split(',').map(part => part.trim()).filter(part => part !== '');
    
    // Remove country names (case-insensitive)
    const countryNames = [
        'saudi arabia',
        'kingdom of saudi arabia', 
        'ksa',
        'المملكة العربية السعودية',
        'السعودية'
    ];
    
    parts = parts.filter(part => {
        const lowerPart = part.toLowerCase();
        return !countryNames.some(country => lowerPart === country);
    });
    
    if (parts.length === 0) {
        return governorate || '';
    }
    
    // If there's only one part, return it (e.g., "Riyadh")
    if (parts.length === 1) {
        return parts[0];
    }
    
    // If there are multiple parts, take the last two parts (city, governorate)
    // e.g., "King Fahd Dist., Afif, Riyadh" -> "Afif, Riyadh"
    if (parts.length >= 2) {
        return parts.slice(-2).join(', ');
    }
    
    return parts[0];
}

function showPopup(event, company) {
    const popup = companyPopup;
    const card = event.currentTarget;
    
    // Close any open dropdown menus when hovering over a new company card
    const allDropdowns = document.querySelectorAll('.popup-menu-dropdown.show');
    allDropdowns.forEach(dropdown => {
        dropdown.classList.remove('show');
    });
    
    // Sanitize company data to ensure text fits
    const sanitizedCompany = sanitizeCompanyData(company);
    
    // Remove active state from all cards
    document.querySelectorAll('.company-card[data-active="true"]').forEach(c => {
        c.removeAttribute('data-active');
    });
    
    // Mark this card as active
    card.setAttribute('data-active', 'true');
    
    // Set company ID on share button
    const shareBtn = popup.querySelector('.share-btn-popup');
    if (shareBtn) {
        shareBtn.dataset.companyId = sanitizedCompany.id;
    }
    
    // Update report button with correct company data
    const reportOption = popup.querySelector('.popup-menu-option');
    if (reportOption) {
        reportOption.onclick = () => openReportModal(sanitizedCompany.id, sanitizedCompany.name);
    }
    
    // Update popup content with sanitized data
    popup.querySelector('.company-name').textContent = sanitizedCompany.name;
    
    // Update category with bilingual support
    const categoryContainer = popup.querySelector('.company-category');
    if (company.category && company.category.trim() !== '') {
        const preferArabic = detectUserLanguagePreference();
        const categoryDisplayName = getCategoryDisplayName(company.category, preferArabic);
        categoryContainer.innerHTML = `<span class="category-tag">${categoryDisplayName}</span>`;
        categoryContainer.style.display = 'block';
    } else {
        categoryContainer.style.display = 'none';
    }
    
    // Update city/governorate - use parsed address to show only city level
    const cityContainer = popup.querySelector('.company-city');
    const displayAddress = parseAddressForDisplay(company.city, company.governorate);
    
    if (displayAddress && displayAddress.trim() !== '') {
        cityContainer.innerHTML = `<span class="city-tag">${displayAddress}</span>`;
        cityContainer.style.display = 'block';
    } else {
        cityContainer.style.display = 'none';
    }
    
    popup.querySelector('.company-description').textContent = sanitizedCompany.description || '';
    
    // Update news section
    const newsContainer = popup.querySelector('.company-news');
    const newsContent = popup.querySelector('.news-content');
    const newsUpdatedDate = popup.querySelector('.news-updated-date');
    
    // Only show news if it exists, has content, AND is explicitly active
    // Default to false for better control - news must be explicitly turned ON
    const isNewsActive = company.newsActive === true;
    
    if (sanitizedCompany.news && sanitizedCompany.news.trim() !== '' && isNewsActive) {
        // Set news content
        newsContent.innerHTML = sanitizedCompany.news;
        
        // Reset any existing expansion state
        newsContent.classList.remove('expanded', 'collapsed');
        
        // Check if we need expansion functionality
        setTimeout(() => {
            if (isTextTruncated(newsContent, 3)) {
                newsContent.classList.add('collapsed');
                
                // Add or update toggle button
                let toggleDiv = newsContainer.querySelector('.news-toggle');
                if (!toggleDiv) {
                    toggleDiv = document.createElement('div');
                    toggleDiv.className = 'news-toggle';
                    newsContainer.appendChild(toggleDiv);
                }
                
                toggleDiv.innerHTML = `<button class="news-more-btn" onclick="toggleNewsExpansion(this)">more</button>`;
            } else {
                // Remove toggle if not needed
                const toggleDiv = newsContainer.querySelector('.news-toggle');
                if (toggleDiv) {
                    toggleDiv.remove();
                }
            }
        }, 10); // Small delay to ensure DOM is rendered
        
        // Show updated date - use existing timestamp or set default for legacy companies
        let updateTimestamp = company.newsStartTime || company.newsTimestamp;
        
        // If no timestamp exists, set a default one for companies with news
        if (!updateTimestamp) {
            updateTimestamp = Date.now() - (7 * 24 * 60 * 60 * 1000); // Default to 7 days ago
            // Optionally save this back to the company
            company.newsTimestamp = updateTimestamp;
        }
        
        const updateDate = new Date(updateTimestamp);
        const formattedDate = updateDate.toLocaleDateString('en-GB'); // dd/mm/yyyy format
        newsUpdatedDate.innerHTML = `Updated ${formattedDate}`;
        newsUpdatedDate.style.display = 'block';
        
        newsContainer.style.display = 'block';
    } else {
        newsContainer.style.display = 'none';
        newsUpdatedDate.style.display = 'none';
    }
    
    // Update phone button
    const phoneBtn = popup.querySelector('.company-phone');
    if (company.phone && company.phone.trim() !== '') {
        phoneBtn.textContent = company.phone;
        phoneBtn.href = `tel:${company.phone}`;
        phoneBtn.style.display = 'inline-block';
    } else {
        phoneBtn.style.display = 'none';
    }
    
    // Update website button
    const websiteBtn = popup.querySelector('.company-website');
    if (company.website && company.website.trim() !== '') {
        websiteBtn.href = company.website;
        websiteBtn.style.display = 'inline-block';
    } else {
        websiteBtn.style.display = 'none';
    }
    
    // Update maps button
    const mapsBtn = popup.querySelector('.company-maps');
    if (company.maps && company.maps.trim() !== '') {
        mapsBtn.href = company.maps;
        mapsBtn.style.display = 'inline-block';
    } else {
        mapsBtn.style.display = 'none';
    }
    
    // Update social media icons
    updateSocialIcons(popup, company);
    
    // Position and show popup
    popup.style.visibility = 'hidden';
    popup.classList.add('show');
    
    // Get the triggering card's position
    const cardRect = card.getBoundingClientRect();
    const popupRect = popup.getBoundingClientRect();
    
    // Calculate optimal position
    let left = cardRect.left + (cardRect.width / 2) - (popupRect.width / 2);
    let top = cardRect.top - popupRect.height;
    
    // Adjust if popup would go off screen
    if (left < 10) left = 10;
    if (left + popupRect.width > window.innerWidth - 10) {
        left = window.innerWidth - popupRect.width - 10;
    }
    if (top < 10) {
        top = cardRect.bottom;
    }
    
    // Apply position and show
    popup.style.left = left + 'px';
    popup.style.top = top + 'px';
    popup.style.visibility = 'visible';
}

// Update popup position based on mouse movement
function updatePopupPosition(event) {
    const popup = companyPopup;
    const rect = event.currentTarget.getBoundingClientRect();
    const popupRect = popup.getBoundingClientRect();
    
    let left = rect.left + (rect.width / 2) - (popupRect.width / 2);
    let top = rect.top - popupRect.height;
    
    // Adjust if popup goes off screen
    if (left < 10) left = 10;
    if (left + popupRect.width > window.innerWidth - 10) {
        left = window.innerWidth - popupRect.width - 10;
    }
    if (top < 10) {
        top = rect.bottom;
    }
    
    popup.style.left = left + 'px';
    popup.style.top = top + 'px';
}

// Update social media icons visibility and links
function updateSocialIcons(popup, company) {
    const socialTypes = ['linkedin', 'instagram', 'tiktok', 'snapchat', 'whatsapp'];
    
    socialTypes.forEach(type => {
        const icon = popup.querySelector(`.social-icon.${type}`);
        if (company[type] && company[type].trim() !== '') {
            icon.href = company[type];
            icon.style.display = 'inline-flex';
        } else {
            icon.style.display = 'none';
        }
    });
    
    // Hide the entire social icons container if no social media links
    const socialContainer = popup.querySelector('.social-icons');
    const visibleIcons = socialContainer.querySelectorAll('.social-icon[style*="inline-flex"]');
    if (visibleIcons.length === 0) {
        socialContainer.style.display = 'none';
    } else {
        socialContainer.style.display = 'flex';
    }
}

// Hide popup
function hidePopup() {
    const popup = companyPopup;
    popup.classList.remove('show');
    // Remove active state from all cards
    document.querySelectorAll('.company-card[data-active="true"]').forEach(card => {
        card.removeAttribute('data-active');
    });
}

// AI-Powered Search with Natural Language Processing
function searchCompanies() {
    const query = searchInput.value.trim();
    
    if (query === '') {
        filteredCompanies = getVisibleCompanies();
        updateSearchStats(filteredCompanies.length, companies.length, '');
        renderCompanies();
        return;
    }
    
    // Process query with AI
    const searchResults = performAISearch(query);
    filteredCompanies = searchResults.companies;
    updateSearchStats(filteredCompanies.length, companies.length, query, searchResults.interpretation);
    renderCompanies();
}

// Main AI search function
function performAISearch(query) {
    const interpretation = interpretQuery(query);
    let searchResults = [];
    let searchMethod = 'basic';
    
    // Try natural language processing first
    if (interpretation.intent !== 'unknown') {
        searchResults = performNLPSearch(interpretation);
        searchMethod = 'nlp';
    }
    
    // If NLP doesn't find good results, try semantic search
    if (searchResults.length === 0) {
        searchResults = performSemanticSearch(query);
        searchMethod = 'semantic';
    }
    
    // Fallback to enhanced basic search
    if (searchResults.length === 0) {
        searchResults = performEnhancedSearch(query);
        searchMethod = 'enhanced';
    }
    
    // Score and rank results
    const rankedResults = scoreAndRankResults(searchResults, query, interpretation);
    
    // Filter out hidden companies from search results
    const visibleResults = rankedResults.filter(company => company.status !== 'hidden');
    
    return {
        companies: visibleResults,
        interpretation: interpretation,
        method: searchMethod,
        confidence: calculateSearchConfidence(visibleResults, query)
    };
}

// Interpret user query using NLP patterns
function interpretQuery(query) {
    const lowerQuery = query.toLowerCase();
    
    // Try to match natural language patterns
    for (const pattern of nlpPatterns) {
        const match = lowerQuery.match(pattern.pattern);
        if (match) {
            return {
                intent: pattern.intent,
                originalQuery: query,
                ...pattern.extract(match),
                confidence: 0.8
            };
        }
    }
    
    // Detect intent from keywords
    const detectedIntent = detectIntent(lowerQuery);
    
    return {
        intent: detectedIntent.intent,
        originalQuery: query,
        keywords: extractKeywords(lowerQuery),
        confidence: detectedIntent.confidence
    };
}

// Detect search intent from query
function detectIntent(query) {
    let maxScore = 0;
    let detectedIntent = 'unknown';
    
    for (const [intent, data] of Object.entries(searchIntents)) {
        let score = 0;
        
        // Check for intent patterns
        data.patterns.forEach(pattern => {
            if (query.includes(pattern)) score += 3;
        });
        
        // Check for intent keywords
        data.keywords.forEach(keyword => {
            if (query.includes(keyword)) score += 1;
        });
        
        if (score > maxScore) {
            maxScore = score;
            detectedIntent = intent;
        }
    }
    
    return {
        intent: detectedIntent,
        confidence: Math.min(maxScore / 5, 1)
    };
}

// Extract meaningful keywords from query
function extractKeywords(query) {
    const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
    return query.split(' ')
        .filter(word => word.length > 2 && !stopWords.includes(word))
        .map(word => word.trim());
}

// Perform NLP-based search
function performNLPSearch(interpretation) {
    let results = [];
    
    switch (interpretation.intent) {
        case 'search':
        case 'need':
            if (interpretation.query || interpretation.service) {
                const searchTerm = interpretation.query || interpretation.service;
                results = searchByTerm(searchTerm);
            }
            break;
            
        case 'question':
            if (interpretation.question) {
                results = searchByQuestion(interpretation.question);
            }
            break;
            
        case 'location':
            if (interpretation.query) {
                results = searchByTerm(interpretation.query);
                // Could enhance with actual location filtering
            }
            break;
            
        case 'feature':
            if (interpretation.query) {
                results = searchByFeature(interpretation.query, interpretation.feature);
            }
            break;
    }
    
    return results;
}

// Perform semantic search using keyword mapping
function performSemanticSearch(query) {
    const lowerQuery = query.toLowerCase();
    let results = [];
    
    // Find semantic matches
    for (const [concept, synonyms] of Object.entries(semanticKeywords)) {
        if (lowerQuery.includes(concept) || synonyms.some(synonym => lowerQuery.includes(synonym))) {
            // Search for companies that match this semantic concept
            const conceptResults = companies.filter(company => {
                const searchText = `${company.name} ${company.description} ${company.category || ''}`.toLowerCase();
                return synonyms.some(synonym => searchText.includes(synonym)) || 
                       searchText.includes(concept);
            });
            results = results.concat(conceptResults);
        }
    }
    
    // Remove duplicates
    return [...new Set(results)];
}

// Enhanced basic search with multiple fields
function performEnhancedSearch(query) {
    const lowerQuery = query.toLowerCase();
    
    return companies.filter(company => {
        const searchFields = [
            company.name,
            company.description,
            company.category,
            company.phone,
            company.website
        ].filter(field => field); // Remove null/undefined fields
        
        return searchFields.some(field => 
            field.toLowerCase().includes(lowerQuery)
        );
    });
}

// Search by specific term with category intelligence
function searchByTerm(term) {
    const lowerTerm = term.toLowerCase();
    
    // First try exact category match
    const categoryMatches = companies.filter(company => 
        company.category && company.category.toLowerCase().includes(lowerTerm)
    );
    
    if (categoryMatches.length > 0) return categoryMatches;
    
    // Then try semantic search
    return performSemanticSearch(term);
}

// Search by question pattern
function searchByQuestion(question) {
    const lowerQuestion = question.toLowerCase();
    
    // Extract the main subject from the question
    const subjects = ['company', 'business', 'service', 'store', 'shop'];
    for (const subject of subjects) {
        if (lowerQuestion.includes(subject)) {
            // Remove the subject and search for the remaining terms
            const searchTerm = lowerQuestion.replace(subject, '').trim();
            if (searchTerm) {
                return performSemanticSearch(searchTerm);
            }
        }
    }
    
    return performSemanticSearch(question);
}

// Search by feature/criteria
function searchByFeature(query, feature) {
    const queryResults = searchByTerm(query);
    
    if (!feature) return queryResults;
    
    // Filter results by feature if provided
    return queryResults.filter(company => {
        const featureText = `${company.description} ${company.category || ''}`.toLowerCase();
        return featureText.includes(feature.toLowerCase());
    });
}

// Score and rank search results
function scoreAndRankResults(results, originalQuery, interpretation) {
    const lowerQuery = originalQuery.toLowerCase();
    
    return results.map(company => {
        let score = 0;
        
        // Name match gets highest score
        if (company.name.toLowerCase().includes(lowerQuery)) score += 100;
        
        // Category match gets high score
        if (company.category && company.category.toLowerCase().includes(lowerQuery)) score += 80;
        
        // Description match gets medium score
        if (company.description.toLowerCase().includes(lowerQuery)) score += 50;
        
        // Exact word matches get bonus
        const queryWords = lowerQuery.split(' ');
        queryWords.forEach(word => {
            if (word.length > 2) {
                if (company.name.toLowerCase().includes(word)) score += 20;
                if (company.category && company.category.toLowerCase().includes(word)) score += 15;
                if (company.description.toLowerCase().includes(word)) score += 10;
            }
        });
        
        // Intent-based scoring
        if (interpretation.intent === 'category' && company.category) score += 30;
        if (interpretation.intent === 'location' && company.maps) score += 20;
        
        return { ...company, searchScore: score };
    })
    .sort((a, b) => b.searchScore - a.searchScore)
    .map(({ searchScore, ...company }) => company); // Remove score from final result
}

// Calculate search confidence
function calculateSearchConfidence(results, query) {
    if (results.length === 0) return 0;
    if (results.length === 1) return 0.9;
    if (results.length <= 5) return 0.8;
    if (results.length <= 10) return 0.6;
    return 0.4;
}

// Update search statistics display
function updateSearchStats(found, total, query, interpretation = null) {
    // Remove existing stats
    const existingStats = document.querySelector('.search-stats');
    if (existingStats) existingStats.remove();
    
    // No longer displaying the "Found X of Y companies" stats
    return;
}

// Get human-readable intent description
function getIntentDescription(interpretation) {
    switch (interpretation.intent) {
        case 'search': return 'Searching for companies';
        case 'need': return 'Finding services you need';
        case 'question': return 'Answering your question';
        case 'location': return 'Location-based search';
        case 'feature': return 'Feature-specific search';
        case 'category': return 'Category search';
        case 'service': return 'Service search';
        case 'contact': return 'Contact information search';
        default: return 'Smart search active';
    }
}

// Show add company form
function showAddCompanyForm() {
    addCompanyModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Hide add company form
function hideAddCompanyForm() {
    addCompanyModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    addCompanyForm.reset();
    
    // Cleanup NewsSystem if it exists
    if (window.currentNewsSystem) {
        if (window.currentNewsSystem.timerInterval) {
            clearInterval(window.currentNewsSystem.timerInterval);
        }
        window.currentNewsSystem = null;
    }
    
    // Hide logo preview
    const previewSquare = document.getElementById('logoPreviewSquare');
    const placeholder = document.getElementById('logoPlaceholder');
    const logoPreviewImg = document.getElementById('logoPreviewImg');
    
    if (previewSquare && placeholder && logoPreviewImg) {
        placeholder.style.display = 'flex';
        logoPreviewImg.style.display = 'none';
        previewSquare.style.border = '2px dashed #dee2e6';
        previewSquare.style.background = '#f8f9fa';
    }
    
    // Reset category autocomplete
    hideCategoryDropdown();
    
    // Reset address autocomplete
    hideAddressDropdown();
    const cityInput = document.getElementById('addressInput');
    cityInput.removeAttribute('data-governorate');
}

// Setup category autocomplete functionality
function setupCategoryAutocomplete() {
    const categoryInput = document.getElementById('companyCategory');
    const categoryDropdown = document.getElementById('categoryDropdown');
    
    categoryInput.addEventListener('input', function(e) {
        const query = e.target.value.trim().toLowerCase();
        if (query.length === 0) {
            hideCategoryDropdown();
            return;
        }
        
        const suggestions = findCategorySuggestions(query);
        showCategorySuggestions(suggestions, query);
    });
    
    categoryInput.addEventListener('keydown', function(e) {
        const options = categoryDropdown.querySelectorAll('.category-option');
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            selectedCategoryIndex = Math.min(selectedCategoryIndex + 1, options.length - 1);
            updateCategoryHighlight(options);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            selectedCategoryIndex = Math.max(selectedCategoryIndex - 1, -1);
            updateCategoryHighlight(options);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (selectedCategoryIndex >= 0 && options[selectedCategoryIndex]) {
                selectCategory(options[selectedCategoryIndex].textContent);
            }
        } else if (e.key === 'Escape') {
            hideCategoryDropdown();
        }
    });
    
    categoryInput.addEventListener('blur', function() {
        // Delay hiding to allow for click selection
        setTimeout(() => hideCategoryDropdown(), 200);
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.category-input-container')) {
            hideCategoryDropdown();
        }
    });
}

// Find category suggestions based on user input
function findCategorySuggestions(query) {
    const suggestions = [];
    
    businessCategories.forEach(category => {
        let score = 0;
        let matchType = '';
        
        // Exact name match gets highest score
        if (category.name.toLowerCase().includes(query)) {
            score = 100;
            matchType = 'name';
        }
        // Keyword match gets lower score
        else if (category.keywords.some(keyword => keyword.includes(query))) {
            score = 50;
            matchType = 'keyword';
        }
        // Partial keyword match gets lowest score
        else if (category.keywords.some(keyword => query.includes(keyword) || keyword.includes(query))) {
            score = 25;
            matchType = 'partial';
        }
        
        if (score > 0) {
            suggestions.push({
                category: category,
                score: score,
                matchType: matchType
            });
        }
    });
    
    // Sort by score (highest first) and limit to top 8 results
    return suggestions.sort((a, b) => b.score - a.score).slice(0, 8);
}

// Show category suggestions in dropdown
function showCategorySuggestions(suggestions, query) {
    const categoryDropdown = document.getElementById('categoryDropdown');
    selectedCategoryIndex = -1;
    
    if (suggestions.length === 0) {
        hideCategoryDropdown();
        return;
    }
    
    categoryDropdown.innerHTML = '';
    
    suggestions.forEach((suggestion, index) => {
        const option = document.createElement('div');
        option.className = 'category-option';
        
        let displayName = suggestion.category.name;
        let keywordText = '';
        
        // Highlight matching keywords for context
        if (suggestion.matchType === 'keyword' || suggestion.matchType === 'partial') {
            const matchingKeywords = suggestion.category.keywords
                .filter(keyword => keyword.includes(query) || query.includes(keyword))
                .slice(0, 3);
            
            if (matchingKeywords.length > 0) {
                keywordText = `<div class="category-keywords">Related: ${matchingKeywords.join(', ')}</div>`;
            }
        }
        
        // Highlight the matching part
        if (suggestion.matchType === 'name') {
            const regex = new RegExp(`(${query})`, 'gi');
            displayName = displayName.replace(regex, '<span class="category-match">$1</span>');
        }
        
        option.innerHTML = `${displayName}${keywordText}`;
        option.addEventListener('click', () => selectCategory(suggestion.category.name));
        categoryDropdown.appendChild(option);
    });
    
    categoryDropdown.style.display = 'block';
}

// Update highlighted option
function updateCategoryHighlight(options) {
    options.forEach((option, index) => {
        option.classList.toggle('highlighted', index === selectedCategoryIndex);
    });
}

// Select a category
function selectCategory(categoryName) {
    const categoryInput = document.getElementById('companyCategory');
    categoryInput.value = categoryName;
    hideCategoryDropdown();
}

// Hide category dropdown
function hideCategoryDropdown() {
    const categoryDropdown = document.getElementById('categoryDropdown');
    categoryDropdown.style.display = 'none';
    selectedCategoryIndex = -1;
}

let selectedAddressIndex = -1;

// Setup address autocomplete functionality
function setupAddressAutocomplete() {
    const addressInput = document.getElementById('addressInput');
    const addressDropdown = document.getElementById('addressDropdown');
    
    addressInput.addEventListener('input', function(e) {
        const query = e.target.value.trim().toLowerCase();
        if (query.length === 0) {
            hideAddressDropdown();
            return;
        }
        
        const suggestions = findAddressSuggestions(query);
        showAddressSuggestions(suggestions, query);
    });
    
    addressInput.addEventListener('keydown', function(e) {
        const options = addressDropdown.querySelectorAll('.address-option');
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            selectedAddressIndex = Math.min(selectedAddressIndex + 1, options.length - 1);
            updateAddressHighlight(options);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            selectedAddressIndex = Math.max(selectedAddressIndex - 1, -1);
            updateAddressHighlight(options);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (selectedAddressIndex >= 0 && options[selectedAddressIndex]) {
                const selectedOption = options[selectedAddressIndex];
                selectAddress(selectedOption.dataset.address, selectedOption.dataset.governorate);
            }
        } else if (e.key === 'Escape') {
            hideAddressDropdown();
        }
    });
    
    addressInput.addEventListener('blur', function() {
        // Delay hiding to allow for click selection
        setTimeout(() => hideAddressDropdown(), 200);
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.address-input-container')) {
            hideAddressDropdown();
        }
    });
}

// Find address suggestions based on user input
function findAddressSuggestions(query) {
    console.log('Finding suggestions for:', query);
    console.log('Available combinations:', allAddressCombinations.length);
    const suggestions = [];
    
    allAddressCombinations.forEach(address => {
        let score = 0;
        let matchType = '';
        
        // Check if any of the match terms contain the query
        const matchingTerms = address.matchTerms.filter(term => 
            term.includes(query) || query.includes(term)
        );
        
        if (matchingTerms.length > 0) {
            // Higher score for exact matches
            if (matchingTerms.some(term => term === query)) {
                score = 100;
                matchType = 'exact';
            }
            // Medium score for prefix matches
            else if (matchingTerms.some(term => term.startsWith(query))) {
                score = 80;
                matchType = 'prefix';
            }
            // Lower score for partial matches
            else {
                score = 50;
                matchType = 'partial';
            }
            
            // Boost score based on address type (governorate is most important)
            if (address.type === 'governorate') score += 20;
            else if (address.type === 'city') score += 10;
            else if (address.type === 'district') score += 5;
            
            suggestions.push({
                address: address,
                score: score,
                matchType: matchType,
                matchingTerms: matchingTerms
            });
        }
    });
    
    // Sort by score (highest first) and limit to top 10 results
    const topSuggestions = suggestions.sort((a, b) => b.score - a.score).slice(0, 10);
    console.log('Returning', topSuggestions.length, 'suggestions for:', query);
    if (topSuggestions.length > 0) {
        console.log('Top suggestion:', topSuggestions[0].address.display);
    }
    return topSuggestions;
}

// Show address suggestions in dropdown
function showAddressSuggestions(suggestions, query) {
    console.log('showAddressSuggestions called with', suggestions.length, 'suggestions');
    const addressDropdown = document.getElementById('addressDropdown');
    selectedAddressIndex = -1;
    
    if (suggestions.length === 0) {
        console.log('No suggestions to show, hiding dropdown');
        hideAddressDropdown();
        return;
    }
    
    console.log('Building dropdown with suggestions');
    addressDropdown.innerHTML = '';
    
    suggestions.forEach((suggestion, index) => {
        const option = document.createElement('div');
        option.className = 'address-option';
        option.dataset.address = suggestion.address.display;
        option.dataset.governorate = suggestion.address.governorate;
        
        let displayText = suggestion.address.display;
        
        // Highlight the matching part
        if (suggestion.matchType === 'exact' || suggestion.matchType === 'prefix') {
            const regex = new RegExp(`(${query})`, 'gi');
            displayText = displayText.replace(regex, '<span class="address-match">$1</span>');
        }
        
        // Add type indicator
        let typeIndicator = '';
        if (suggestion.address.type === 'governorate') {
            typeIndicator = '<span class="address-type">Governorate</span>';
        } else if (suggestion.address.type === 'center') {
            typeIndicator = '<span class="address-type">Center</span>';
        } else if (suggestion.address.type === 'village') {
            typeIndicator = '<span class="address-type">Village</span>';
        }
        
        option.innerHTML = `
            <div class="address-name">${displayText}</div>
            ${typeIndicator}
        `;
        
        option.addEventListener('click', () => {
            selectAddress(suggestion.address.display, suggestion.address.governorate);
        });
        
        addressDropdown.appendChild(option);
    });
    
    addressDropdown.style.display = 'block';
}

// Update highlighted option
function updateAddressHighlight(options) {
    options.forEach((option, index) => {
        option.classList.toggle('highlighted', index === selectedAddressIndex);
    });
}

// Select an address
function selectAddress(addressDisplay, governorate) {
    const addressInput = document.getElementById('addressInput');
    addressInput.value = addressDisplay;
    addressInput.dataset.governorate = governorate; // Store governorate for display
    hideAddressDropdown();
}

// Hide address dropdown
function hideAddressDropdown() {
    const addressDropdown = document.getElementById('addressDropdown');
    addressDropdown.style.display = 'none';
    selectedAddressIndex = -1;
}

// Handle logo file preview
function handleLogoPreview(event) {
    const file = event.target.files[0];
    const previewSquare = document.getElementById('logoPreviewSquare');
    const placeholder = document.getElementById('logoPlaceholder');
    const previewImg = document.getElementById('logoPreviewImg');
    
    if (!previewImg || !placeholder || !previewSquare) {
        console.warn('Logo preview elements not found');
        return;
    }
    
    if (file) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select a valid image file');
            event.target.value = '';
            placeholder.style.display = 'flex';
            previewImg.style.display = 'none';
            return;
        }
        
        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            alert('Please select an image smaller than 2MB');
            event.target.value = '';
            placeholder.style.display = 'flex';
            previewImg.style.display = 'none';
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            previewImg.src = e.target.result;
            placeholder.style.display = 'none';
            previewImg.style.display = 'block';
            previewSquare.style.border = '2px solid #28a745';
            previewSquare.style.background = '#f8fff9';
        };
        reader.readAsDataURL(file);
    } else {
        placeholder.style.display = 'flex';
        previewImg.style.display = 'none';
        previewSquare.style.border = '2px dashed #dee2e6';
        previewSquare.style.background = '#f8f9fa';
    }
}

// Handle add company form submission (after authentication)
function handleAddCompanySubmission(event) {
    event.preventDefault();
    
    // Ensure user is authenticated
    if (!authCurrentUser) {
        alert('Please sign in first to add a company');
        showAuthenticationStep();
        return;
    }
    
    const logoFile = document.getElementById('companyLogo').files[0];
    
    // Validate required fields first
    const name = document.getElementById('companyName').value;
    const description = document.getElementById('companyDescription').value;
    const category = document.getElementById('companyCategory').value;
    const phoneInput = document.getElementById('companyPhone').value;
    const phone = phoneInput ? '+966' + phoneInput : '';
    const website = document.getElementById('companyWebsite').value;
    const news = document.getElementById('companyNews').value;
    
    // Collect all branches
    const branches = [];
    const branchSections = document.querySelectorAll('.branch-group');
    
    for (let i = 0; i < branchSections.length; i++) {
        const branchNumber = i + 1;
        const maps = document.getElementById(`companyMaps${branchNumber}`).value;
        const cityInput = document.getElementById(`addressInput${branchNumber}`);
        const city = cityInput.value;
        const governorate = cityInput.dataset.governorate || '';
        
        // At least one field should be provided for the branch to be meaningful
        // But we'll allow empty branches to be created
        
        branches.push({
            maps: maps,
            city: city,
            governorate: governorate,
            branchNumber: branchNumber
        });
    }
    
    // Check if this is an update to existing company
    const userCompanyKey = `user_company_${authCurrentUser.id}`;
    const existingData = localStorage.getItem(userCompanyKey);
    let isUpdate = false;
    
    if (existingData) {
        try {
            const existingCompanyData = JSON.parse(existingData);
            isUpdate = true;
        } catch (error) {
            console.error('Error parsing existing company data:', error);
        }
    }
    
    // For new companies, logo is required. For updates, logo is optional
    if (!name || !description || !category || branches.length === 0 || (!isUpdate && !logoFile)) {
        if (!isUpdate && !logoFile) {
            alert('Please fill in all required fields and upload a logo');
        } else {
            alert('Please fill in all required fields');
        }
        return;
    }
    
    // Convert logo to data URL and create company
    async function processCompanyData(logoData) {
        // Check if this is an update to existing company
        const userCompanyKey = `user_company_${authCurrentUser.id}`;
        const existingData = localStorage.getItem(userCompanyKey);
        let isUpdate = false;
        let existingCompanyId = null;
        
        if (existingData) {
            try {
                const existingCompanyData = JSON.parse(existingData);
                existingCompanyId = existingCompanyData.company.id;
                isUpdate = true;
            } catch (error) {
                console.error('Error parsing existing company data:', error);
            }
        }
        
        const newCompany = {
            id: isUpdate ? existingCompanyId : Date.now(), // Keep existing ID if updating
            name: name,
            description: description,
            category: category,
            branches: branches, // Store all branches
            phone: phone,
            website: website,
            news: news,
            logo: logoData, // Use provided logo data
            linkedin: document.getElementById('companyLinkedin').value,
            instagram: document.getElementById('companyInstagram').value,
            tiktok: document.getElementById('companyTiktok').value,
            snapchat: document.getElementById('companySnapchat').value,
            whatsapp: document.getElementById('companyWhatsapp').value,
            // User information
            addedBy: authCurrentUser.phone,
            addedById: authCurrentUser.id,
            dateAdded: isUpdate ? (JSON.parse(existingData).company.dateAdded) : new Date().toISOString(),
            lastModified: new Date().toISOString(),
            lastEdited: Date.now(), // For admin dashboard compatibility
            isUserCompany: true
        };
        
        // Add news state information from NewsSystem if available
        if (window.currentNewsSystem) {
            newCompany.newsActive = window.currentNewsSystem.isActive || false;
            newCompany.newsStartTime = window.currentNewsSystem.startTime || null;
            newCompany.newsTimestamp = window.currentNewsSystem.timestamp || null;
        } else {
            console.log('No NewsSystem found during form submission');
        }
        
        // Update global localStorage with the base company data
        const globalCompanies = JSON.parse(localStorage.getItem('logodaleel_companies') || '[]');
        
        if (isUpdate) {
            // Find and update existing company in global list
            const existingIndex = globalCompanies.findIndex(company => 
                company.id === existingCompanyId || company.id == existingCompanyId
            );
            
            if (existingIndex !== -1) {
                // Update existing company
                globalCompanies[existingIndex] = newCompany;
            } else {
                // Company not found, add as new (shouldn't happen but handle gracefully)
                globalCompanies.push(newCompany);
            }
        } else {
            // Add new company
            globalCompanies.push(newCompany);
        }
        
        // Save to global localStorage
        console.log('💾 Saving company to localStorage with lastEdited:', newCompany.lastEdited);
        localStorage.setItem('logodaleel_companies', JSON.stringify(globalCompanies));
        
        // Trigger refresh for other tabs/windows (admin dashboard)
        localStorage.setItem('logodaleel_refresh_trigger', Date.now().toString());
        
        // Also trigger a cross-window event
        window.dispatchEvent(new CustomEvent('logodaleel_companies_updated', {
            detail: { source: 'main_page', action: actionText, company: newCompany.name }
        }));
        
        // For immediate display, reload companies from localStorage to get consistent state
        companies = await loadCompanies();
        filteredCompanies = getVisibleCompanies();
        
        // Store user's company data separately for future editing
        const userCompanyData = {
            company: newCompany,
            savedAt: new Date().toISOString(),
            isUpdate: isUpdate
        };
        localStorage.setItem(userCompanyKey, JSON.stringify(userCompanyData));
        
        // Re-render companies
        renderCompanies();
        
        // Hide form and show success message
        hideAddCompanyForm();
        const actionText = isUpdate ? 'updated' : 'added';
        showSuccessMessage(`Company "${name}" ${actionText} successfully! You can edit it anytime by signing in.`);
        
        // Update UI to show user is signed in
        updateUIForSignedInUser();
    }
    
    // Handle logo file upload or use existing logo
    if (logoFile) {
        // New logo uploaded, read it
        const reader = new FileReader();
        reader.onload = function(e) {
            processCompanyData(e.target.result);
        };
        reader.readAsDataURL(logoFile);
    } else if (isUpdate) {
        // No new logo, use existing logo for updates
        const existingCompanyData = JSON.parse(existingData);
        processCompanyData(existingCompanyData.company.logo);
    } else {
        // This shouldn't happen due to validation, but handle gracefully
        alert('Please upload a company logo');
        return;
    }
}

// Show success message
function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 4000;
        font-weight: 500;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        animation: slideIn 0.3s ease-out;
    `;
    successDiv.textContent = message;
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(successDiv);
        }, 300);
    }, 3000);
}

// Debounce function for search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add CSS for success message animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes fadeOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===== WORKING AUTOCOMPLETE SYSTEM (from test page) =====

// Simple address search data  
let workingSearchableAddresses = [];

// Initialize address search data
function initializeWorkingAddressSearch() {
    console.log('🔄 Initializing working address search...');
    workingSearchableAddresses = [];
    
    if (typeof saudiAddressData === 'undefined') {
        console.error('❌ Saudi data not available');
        return;
    }
    
    console.log('✅ Saudi data loaded:', saudiAddressData.length, 'provinces');
    
    saudiAddressData.forEach(province => {
        // Add province (English and Arabic search terms)
        workingSearchableAddresses.push({
            type: 'Province',
            display: province.governorate,
            searchText: [
                province.governorate.toLowerCase(),
                province.governorateAr || ''
            ].filter(term => term).join(' '),
            fullAddress: province.governorate
        });
        
        province.cities.forEach(city => {
            // Add city (English and Arabic search terms)
            workingSearchableAddresses.push({
                type: 'City',
                display: `${city.city}, ${province.governorate}`,
                searchText: [
                    city.city.toLowerCase(),
                    city.cityAr || '',
                    province.governorate.toLowerCase(),
                    province.governorateAr || ''
                ].filter(term => term).join(' '),
                fullAddress: `${city.city}, ${province.governorate}`
            });
            
            city.districts.forEach(district => {
                // Add district (English and Arabic search terms)
                workingSearchableAddresses.push({
                    type: 'District',
                    display: `${district.district}, ${city.city}, ${province.governorate}`,
                    searchText: [
                        district.district.toLowerCase(),
                        district.districtAr || '',
                        city.city.toLowerCase(),
                        city.cityAr || '',
                        province.governorate.toLowerCase(),
                        province.governorateAr || ''
                    ].filter(term => term).join(' '),
                    fullAddress: `${district.district}, ${city.city}, ${province.governorate}`
                });
            });
        });
    });
    
    console.log(`✅ Created ${workingSearchableAddresses.length} searchable addresses with Arabic support`);
}

// Simple search function
function searchWorkingAddresses(query) {
    const q = query.toLowerCase().trim();
    if (q.length < 2) return [];
    
    const matches = workingSearchableAddresses.filter(addr => 
        addr.searchText.includes(q)
    ).slice(0, 10);
    
    console.log(`🔍 Searching for "${query}" (${q.length} chars)`);
    console.log(`📍 Found ${matches.length} matches`);
    if (matches.length > 0) {
        console.log('Sample matches:', matches.slice(0, 3).map(m => m.display));
    }
    return matches;
}

// Simple display function
function displayWorkingAddressSuggestions(suggestions) {
    const dropdown = document.getElementById('addressDropdown');
    if (!dropdown) return;
    
    if (suggestions.length === 0) {
        dropdown.style.display = 'none';
        return;
    }
    
    dropdown.innerHTML = '';
    dropdown.style.display = 'block';
    
    suggestions.forEach(suggestion => {
        const div = document.createElement('div');
        div.className = 'address-option';
        div.innerHTML = `
            <span class="address-text">${suggestion.display}</span>
            <span class="address-type">${suggestion.type}</span>
        `;
        
        div.addEventListener('click', () => {
            const input = document.getElementById('addressInput');
            if (input) {
                input.value = suggestion.fullAddress;
                dropdown.style.display = 'none';
                console.log(`✅ Selected: ${suggestion.fullAddress}`);
            }
        });
        
        dropdown.appendChild(div);
    });
}

// Initialize address autocomplete for specific input/dropdown pair (for branch system)
function initializeAddressAutocomplete(inputId, dropdownId) {
    const addressInput = document.getElementById(inputId);
    const addressDropdown = document.getElementById(dropdownId);
    
    if (!addressInput || !addressDropdown) {
        console.error(`❌ Address input (${inputId}) or dropdown (${dropdownId}) not found`);
        return;
    }
    
    addressInput.addEventListener('input', function(e) {
        const query = e.target.value.trim().toLowerCase();
        if (query.length === 0) {
            addressDropdown.style.display = 'none';
            return;
        }
        
        const suggestions = findAddressSuggestions(query);
        showAddressSuggestionsForDropdown(suggestions, query, addressDropdown, addressInput);
    });
    
    addressInput.addEventListener('keydown', function(e) {
        const options = addressDropdown.querySelectorAll('.address-option');
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (options.length > 0) {
                options[0].focus();
            }
        }
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.address-input-container') || 
            (!addressInput.contains(e.target) && !addressDropdown.contains(e.target))) {
            addressDropdown.style.display = 'none';
        }
    });
}

// Show address suggestions for specific dropdown
function showAddressSuggestionsForDropdown(suggestions, query, dropdown, input) {
    dropdown.innerHTML = '';
    
    if (suggestions.length === 0) {
        dropdown.style.display = 'none';
        return;
    }
    
    suggestions.forEach(suggestion => {
        const option = document.createElement('div');
        option.className = 'address-option';
        option.textContent = suggestion.display;
        option.addEventListener('click', () => {
            input.value = suggestion.display;
            input.dataset.governorate = suggestion.governorate;
            dropdown.style.display = 'none';
        });
        dropdown.appendChild(option);
    });
    
    dropdown.style.display = 'block';
}

// Setup working autocomplete
function setupWorkingAutocomplete() {
    const input = document.getElementById('addressInput');
    const dropdown = document.getElementById('addressDropdown');
    
    if (!input || !dropdown) {
        console.error('❌ Address input or dropdown not found');
        return;
    }
    
    console.log('✅ Setting up working autocomplete');
    
    input.addEventListener('input', function(e) {
        const query = e.target.value.trim();
        const suggestions = searchWorkingAddresses(query);
        displayWorkingAddressSuggestions(suggestions);
    });
    
    // Hide dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!input.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.style.display = 'none';
        }
    });
}

// ================================
// ADD COMPANY WITH AUTHENTICATION
// ================================

let authCurrentUser = null;
let authOtpTimer = null;
let authResendCountdown = 60;

// Handle Add Company button click
function handleAddCompany() {
    // Check if user is already authenticated
    const userData = localStorage.getItem('logodaleel_user');
    if (userData) {
        try {
            authCurrentUser = JSON.parse(userData);
            showCompanyForm();
        } catch (error) {
            console.error('Error parsing user data:', error);
            localStorage.removeItem('logodaleel_user');
            showAuthenticationStep();
        }
    } else {
        showAuthenticationStep();
    }
}

// Show authentication step
function showAuthenticationStep() {
    // Reset to phone step
    authStep.style.display = 'block';
    companyFormStep.style.display = 'none';
    phoneAuthStep.style.display = 'block';
    otpAuthStep.style.display = 'none';
    
    // Clear previous inputs
    document.getElementById('authPhone').value = '';
    document.getElementById('authOtpCode').value = '';
    
    addCompanyModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Show company form step
function showCompanyForm() {
    authStep.style.display = 'none';
    companyFormStep.style.display = 'block';
    
    addCompanyModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Load existing user company data if available
    loadUserCompanyData();
    
    // Initialize phone change listeners
    initializePhoneChangeListeners();
    
    // Update the visibility toggle UI based on current company status
    updateVisibilityToggleUI();
    
    // Initialize NewsSystem after modal is fully rendered
    setTimeout(() => {
        if (typeof NewsSystem !== 'undefined') {
            const companyId = authCurrentUser ? `user_${authCurrentUser.id}` : 'temp_company';
            const newsSystem = new NewsSystem(companyId);
            // Store reference for potential cleanup
            window.currentNewsSystem = newsSystem;
        }
    }, 100);
}

// Load user's existing company data
function loadUserCompanyData() {
    if (!authCurrentUser) return;
    
    const userCompanyKey = `user_company_${authCurrentUser.id}`;
    const savedData = localStorage.getItem(userCompanyKey);
    
    // Update form title and subtitle
    const formTitle = document.getElementById('companyFormTitle');
    const formSubtitle = document.getElementById('companyFormSubtitle');
    const submitBtn = document.querySelector('#addCompanyForm button[type="submit"]');
    
    if (savedData) {
        try {
            const userCompanyData = JSON.parse(savedData);
            const company = userCompanyData.company;
            
            // Update titles for editing mode
            formTitle.textContent = 'Edit Your Company Information';
            formSubtitle.textContent = 'Update your company details below';
            submitBtn.textContent = 'Update Company';
            
            // Remove required attribute from logo input for editing
            const logoInput = document.getElementById('companyLogo');
            logoInput.removeAttribute('required');
            
            // Pre-populate form fields with existing data
            document.getElementById('companyName').value = company.name || '';
            document.getElementById('companyDescription').value = company.description || '';
            document.getElementById('companyCategory').value = company.category || '';
            
            // Set phone field and make it readonly
            const phoneField = document.getElementById('companyPhone');
            phoneField.value = (company.phone || authCurrentUser.phone || '').replace(/^\+966/, '');
            phoneField.setAttribute('readonly', true);
            
            document.getElementById('companyNews').value = company.news || '';
            document.getElementById('companyWebsite').value = company.website || '';
            
            // Load branch data
            if (company.branches && company.branches.length > 0) {
                // Load first branch
                const firstBranch = company.branches[0];
                document.getElementById('companyMaps1').value = firstBranch.maps || '';
                document.getElementById('addressInput1').value = firstBranch.city || '';
                const addressInput1 = document.getElementById('addressInput1');
                if (firstBranch.governorate) {
                    addressInput1.dataset.governorate = firstBranch.governorate;
                }
                
                // Load additional branches
                for (let i = 1; i < company.branches.length; i++) {
                    addBranch(); // Add branch UI
                    const branchNum = i + 1;
                    const branch = company.branches[i];
                    document.getElementById(`companyMaps${branchNum}`).value = branch.maps || '';
                    document.getElementById(`addressInput${branchNum}`).value = branch.city || '';
                    const addressInput = document.getElementById(`addressInput${branchNum}`);
                    if (branch.governorate) {
                        addressInput.dataset.governorate = branch.governorate;
                    }
                }
            }
            
            // Pre-populate social media fields
            document.getElementById('companyLinkedin').value = company.linkedin || '';
            document.getElementById('companyInstagram').value = company.instagram || '';
            document.getElementById('companyTiktok').value = company.tiktok || '';
            document.getElementById('companySnapchat').value = company.snapchat || '';
            document.getElementById('companyWhatsapp').value = company.whatsapp || '';
            
            // Show existing logo if available
            if (company.logo) {
                const previewSquare = document.getElementById('logoPreviewSquare');
                const placeholder = document.getElementById('logoPlaceholder');
                const logoPreviewImg = document.getElementById('logoPreviewImg');
                if (logoPreviewImg) {
                    logoPreviewImg.src = company.logo;
                    logoPreviewImg.style.display = 'block';
                }
                if (placeholder) {
                    placeholder.style.display = 'none';
                }
                if (previewSquare) {
                    previewSquare.style.border = '2px solid #28a745';
                    previewSquare.style.background = '#f8fff9';
                }
            }
            
            // Show info message for editing
            const formStep = document.getElementById('companyFormStep');
            const existingMessage = formStep.querySelector('.existing-company-message');
            if (!existingMessage) {
                const infoDiv = document.createElement('div');
                infoDiv.className = 'existing-company-message';
                infoDiv.innerHTML = `
                    <div style="background: #e3f2fd; border: 1px solid #1976d2; padding: 6px 10px; border-radius: 6px; margin-top: 0px; margin-bottom: 20px;">
                        <h4 style="margin: 0 0 2px 0; color: #1976d2; font-size: 11px;">✏️ Editing Your Company</h4>
                        <p style="margin: 0; color: #1565c0; font-size: 10px; line-height: 1.3;">
                            Your existing company information has been loaded. Make any changes you need and click Update.
                        </p>
                    </div>
                `;
                const form = formStep.querySelector('form');
                formStep.insertBefore(infoDiv, form);
            }
            
        } catch (error) {
            console.error('Error loading user company data:', error);
            // Fall back to new company mode
            setupNewCompanyMode();
        }
    } else {
        // No existing data - setup for new company
        setupNewCompanyMode();
    }
}

// Setup form for new company
function setupNewCompanyMode() {
    const formTitle = document.getElementById('companyFormTitle');
    const formSubtitle = document.getElementById('companyFormSubtitle');
    const submitBtn = document.querySelector('#addCompanyForm button[type="submit"]');
    
    // Update titles for new company mode
    formTitle.textContent = 'Enter Your Company Information';
    formSubtitle.textContent = 'Welcome! Please fill in your company details';
    submitBtn.textContent = 'Add Company';
    
    // Ensure logo input is required for new companies
    const logoInput = document.getElementById('companyLogo');
    logoInput.setAttribute('required', 'required');
    
    // Pre-fill phone with user's phone and make it readonly
    if (authCurrentUser) {
        const phoneField = document.getElementById('companyPhone');
        phoneField.value = (authCurrentUser.phone || '').replace(/^\+966/, '');
        phoneField.setAttribute('readonly', true);
    }
    
    // Remove existing company message if present
    const existingMessage = document.getElementById('companyFormStep').querySelector('.existing-company-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Show welcome message for new users
    const formStep = document.getElementById('companyFormStep');
    const welcomeMessage = formStep.querySelector('.new-company-message');
    if (!welcomeMessage) {
        const infoDiv = document.createElement('div');
        infoDiv.className = 'new-company-message';
        infoDiv.innerHTML = `
            <div style="background: #e8f5e8; border: 1px solid #4CAF50; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <h4 style="margin: 0 0 8px 0; color: #2c5530;">🏢 Add Your Company</h4>
                <p style="margin: 0; color: #2c5530; font-size: 14px;">
                    Fill in your company details below. This information will be displayed in the business directory.
                </p>
            </div>
        `;
        const form = formStep.querySelector('form');
        formStep.insertBefore(infoDiv, form);
    }
}

// Hide Add Company Form
function hideAddCompanyForm() {
    addCompanyModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    
    // Clear any running timers
    if (authOtpTimer) {
        clearInterval(authOtpTimer);
        authOtpTimer = null;
    }
    
    // Reset phone change state if in progress
    if (phoneChangeOTP !== null || originalPhoneValue !== '') {
        handleCancelPhoneChange();
    }
    
    // Reset form steps
    authStep.style.display = 'block';
    companyFormStep.style.display = 'none';
    phoneAuthStep.style.display = 'block';
    otpAuthStep.style.display = 'none';
    
    // Update UI if user is signed in
    if (authCurrentUser && authCurrentUser.id) {
        updateUIForSignedInUser();
    }
    
    // Clear form data (but only if explicitly requested)
    // Form data will be preserved for existing users
}

// Clear all form data (utility function)
function clearCompanyForm() {
    document.getElementById('companyName').value = '';
    document.getElementById('companyDescription').value = '';
    document.getElementById('companyCategory').value = '';
    document.getElementById('companyPhone').value = '';
    document.getElementById('companyWebsite').value = '';
    document.getElementById('companyNews').value = '';
    
    // Reset branch fields
    document.getElementById('companyMaps1').value = '';
    document.getElementById('addressInput1').value = '';
    
    // Remove additional branches
    const additionalBranches = document.getElementById('additionalBranches');
    additionalBranches.innerHTML = '';
    branchCounter = 1;
    
    document.getElementById('companyLinkedin').value = '';
    document.getElementById('companyInstagram').value = '';
    document.getElementById('companyTiktok').value = '';
    document.getElementById('companySnapchat').value = '';
    document.getElementById('companyWhatsapp').value = '';
    
    // Clear logo preview
    const previewSquare = document.getElementById('logoPreviewSquare');
    const placeholder = document.getElementById('logoPlaceholder');
    const logoPreviewImg = document.getElementById('logoPreviewImg');
    const logoFileInput = document.getElementById('companyLogo');
    
    placeholder.style.display = 'flex';
    logoPreviewImg.style.display = 'none';
    previewSquare.style.border = '2px dashed #dee2e6';
    previewSquare.style.background = '#f8f9fa';
    logoFileInput.value = '';
    
    // Reset submit button text
    const submitBtn = document.querySelector('#addCompanyForm button[type="submit"]');
    submitBtn.textContent = 'Add Company';
    
    // Remove existing company message
    const existingMessage = document.getElementById('companyFormStep').querySelector('.existing-company-message');
    if (existingMessage) {
        existingMessage.remove();
    }
}

// Handle authentication phone submission
function handleAuthPhoneSubmission() {
    const phoneInput = document.getElementById('authPhone');
    const phone = phoneInput.value.trim();
    
    // Validate Saudi phone number
    if (!validateSaudiPhone(phone)) {
        alert('Please enter a valid Saudi mobile number (9 digits starting with 5)');
        return;
    }
    
    // Simulate sending OTP
    const fullPhone = '+966' + phone;
    sendAuthOTP(fullPhone);
}

// Send OTP for authentication
function sendAuthOTP(phone) {
    console.log(`🔐 Sending OTP to ${phone} for company registration`);
    
    // Check if phone number is blacklisted
    if (isPhoneBlacklisted(phone)) {
        const contactEmail = getContactEmail();
        const message = `Your account has been disabled, please contact ${contactEmail}`;
        alert(message);
        return;
    }
    
    // Generate OTP
    const otp = generateOTP();
    
    // Store OTP temporarily
    sessionStorage.setItem('auth_current_otp', otp);
    sessionStorage.setItem('auth_otp_phone', phone);
    
    // Show OTP step
    showAuthOTPStep(phone);
    
    // For demo purposes, show the OTP
    console.log(`📱 Demo OTP for ${phone}: ${otp}`);
    alert(`Demo Mode: Your verification code is ${otp}`);
}

// Show OTP verification step for authentication
function showAuthOTPStep(phone) {
    const displayPhone = document.getElementById('authDisplayPhone');
    
    phoneAuthStep.style.display = 'none';
    otpAuthStep.style.display = 'block';
    displayPhone.textContent = phone;
    
    // Start resend countdown
    startAuthResendCountdown();
}

// Handle authentication OTP submission
function handleAuthOTPSubmission() {
    const otpInput = document.getElementById('authOtpCode');
    const enteredOTP = otpInput.value.trim();
    
    // Validate OTP format
    if (!/^[0-9]{6}$/.test(enteredOTP)) {
        alert('Please enter a valid 6-digit code');
        return;
    }
    
    // Verify OTP
    const storedOTP = sessionStorage.getItem('auth_current_otp');
    const phone = sessionStorage.getItem('auth_otp_phone');
    
    if (enteredOTP === storedOTP) {
        // OTP verified successfully
        authenticateUserForCompany(phone);
    } else {
        alert('Invalid verification code. Please try again.');
        otpInput.value = '';
    }
}

// Authenticate user and proceed to company form
function authenticateUserForCompany(phone) {
    authCurrentUser = {
        phone: phone,
        signInTime: new Date().toISOString(),
        id: 'user_' + Date.now()
    };
    
    // Check if user already exists and restore their ID
    const existingUsers = Object.keys(localStorage).filter(key => key.startsWith('user_company_'));
    for (const key of existingUsers) {
        try {
            const userData = JSON.parse(localStorage.getItem(key));
            if (userData.company && userData.company.addedBy === phone) {
                // Found existing user data, restore their ID
                authCurrentUser.id = userData.company.addedById;
                authCurrentUser.signInTime = userData.company.dateAdded;
                break;
            }
        } catch (error) {
            console.error('Error checking existing user data:', error);
        }
    }
    
    // Save user session
    localStorage.setItem('logodaleel_user', JSON.stringify(authCurrentUser));
    
    // Clean up OTP data
    sessionStorage.removeItem('auth_current_otp');
    sessionStorage.removeItem('auth_otp_phone');
    
    // Check if user has existing company data
    const userCompanyKey = `user_company_${authCurrentUser.id}`;
    const existingCompanyData = localStorage.getItem(userCompanyKey);
    
    if (existingCompanyData) {
        // Show success message for returning user
        alert('Welcome back! You can now edit your company information.');
    } else {
        // Show success message for new user
        alert('Phone verified! Please enter your company details.');
    }
    
    // Update UI to show user is signed in
    updateUIForSignedInUser();
    
    // Proceed to company form
    showCompanyForm();
}

// Start resend countdown timer for auth
function startAuthResendCountdown() {
    authResendCountdown = 60;
    const resendBtn = document.getElementById('authResendBtn');
    const countdownDiv = document.getElementById('authResendCountdown');
    const timerSpan = document.getElementById('authCountdownTimer');
    
    resendBtn.disabled = true;
    countdownDiv.style.display = 'block';
    
    authOtpTimer = setInterval(() => {
        authResendCountdown--;
        timerSpan.textContent = authResendCountdown;
        
        if (authResendCountdown <= 0) {
            clearInterval(authOtpTimer);
            resendBtn.disabled = false;
            countdownDiv.style.display = 'none';
            authOtpTimer = null;
        }
    }, 1000);
}

// Resend OTP for authentication
function resendAuthOTP() {
    const phone = sessionStorage.getItem('auth_otp_phone');
    if (phone) {
        sendAuthOTP(phone);
    }
}

// Go back to phone input step for auth
function goBackToAuthPhone() {
    phoneAuthStep.style.display = 'block';
    otpAuthStep.style.display = 'none';
    
    // Clear OTP data
    sessionStorage.removeItem('auth_current_otp');
    sessionStorage.removeItem('auth_otp_phone');
    
    // Clear timer
    if (authOtpTimer) {
        clearInterval(authOtpTimer);
        authOtpTimer = null;
    }
}

// Set up event listeners for authentication forms
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already signed in
    checkUserSession();
    
    // Auth phone form submission
    const authPhoneForm = document.getElementById('authPhoneForm');
    if (authPhoneForm) {
        authPhoneForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleAuthPhoneSubmission();
        });
    }
    
    // Auth OTP form submission
    const authOtpForm = document.getElementById('authOtpForm');
    if (authOtpForm) {
        authOtpForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleAuthOTPSubmission();
        });
    }
});

// Check if user is already signed in on page load
function checkUserSession() {
    const userData = localStorage.getItem('logodaleel_user');
    if (userData) {
        try {
            authCurrentUser = JSON.parse(userData);
            
            // Verify user has valid company data associated
            const userCompanyKey = `user_company_${authCurrentUser.id}`;
            const companyData = localStorage.getItem(userCompanyKey);
            
            if (!companyData) {
                // Try to find user by phone number in case ID changed
                const existingUsers = Object.keys(localStorage).filter(key => key.startsWith('user_company_'));
                for (const key of existingUsers) {
                    try {
                        const existingUserData = JSON.parse(localStorage.getItem(key));
                        if (existingUserData.company && existingUserData.company.addedBy === authCurrentUser.phone) {
                            // Found user's data, update current user ID
                            authCurrentUser.id = existingUserData.company.addedById;
                            localStorage.setItem('logodaleel_user', JSON.stringify(authCurrentUser));
                            break;
                        }
                    } catch (error) {
                        console.error('Error checking existing user data:', error);
                    }
                }
            }
            
            updateUIForSignedInUser();
        } catch (error) {
            console.error('Error parsing user data:', error);
            localStorage.removeItem('logodaleel_user');
        }
    }
}

// Update UI when user is signed in
function updateUIForSignedInUser() {
    const signOutBtn = document.getElementById('signOutBtn');
    
    if (signOutBtn && authCurrentUser) {
        signOutBtn.style.display = 'block';
    }
}

// Sign out user
function signOutUser() {
    if (confirm('Are you sure you want to sign out?')) {
        // Clear user data
        authCurrentUser = null;
        localStorage.removeItem('logodaleel_user');
        
        // Hide sign out button
        const signOutBtn = document.getElementById('signOutBtn');
        if (signOutBtn) {
            signOutBtn.style.display = 'none';
        }
        
        alert('You have been signed out successfully.');
    }
}

// Show user dashboard
function showUserDashboard() {
    if (!authCurrentUser) {
        alert('Please sign in first');
        return;
    }
    
    const userCompanyKey = `user_company_${authCurrentUser.id}`;
    const savedData = localStorage.getItem(userCompanyKey);
    
    // Create dashboard modal
    const dashboard = document.createElement('div');
    dashboard.className = 'modal';
    dashboard.style.display = 'block';
    
    let companyInfo = '';
    let hasCompany = false;
    
    if (savedData) {
        try {
            const userCompanyData = JSON.parse(savedData);
            const company = userCompanyData.company;
            hasCompany = true;
            
            companyInfo = `
                <div class="company-summary">
                    <h4>Your Company Information</h4>
                    <div class="company-details">
                        <div class="company-logo">
                            ${company.logo ? `<img src="${company.logo}" alt="Company Logo" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;">` : '<div class="no-logo">No Logo</div>'}
                        </div>
                        <div class="company-text">
                            <h5>${company.name}</h5>
                            <p class="company-category">${company.category}</p>
                            <p class="company-location">${company.city}${company.governorate ? `, ${company.governorate}` : ''}</p>
                            <p class="company-phone">${company.phone}</p>
                            <p class="company-added">Added: ${new Date(company.dateAdded).toLocaleDateString()}</p>
                            ${company.lastModified ? `<p class="company-modified">Last updated: ${new Date(company.lastModified).toLocaleDateString()}</p>` : ''}
                        </div>
                    </div>
                    <div class="dashboard-actions">
                        <button onclick="editUserCompany()" class="edit-company-btn">Edit Company</button>
                        <button onclick="deleteUserCompany()" class="delete-company-btn">Delete Company</button>
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('Error loading company data:', error);
            companyInfo = '<p style="color: #dc3545;">Error loading company data.</p>';
        }
    } else {
        companyInfo = `
            <div class="no-company">
                <h4>No Company Added Yet</h4>
                <p>You haven't added your company information yet.</p>
                <button onclick="closeDashboard(this); handleAddCompany();" class="add-first-company-btn">Add Your Company</button>
            </div>
        `;
    }
    
    dashboard.innerHTML = `
        <div class="modal-content" style="max-width: 600px;">
            <span class="close" onclick="closeDashboard(this)">&times;</span>
            <div class="user-dashboard">
                <div class="user-info">
                    <h3>👤 User Dashboard</h3>
                    <p><strong>Phone:</strong> ${authCurrentUser.phone}</p>
                    <p><strong>Member Since:</strong> ${new Date(authCurrentUser.signInTime).toLocaleDateString()}</p>
                </div>
                ${companyInfo}
                <div class="dashboard-footer">
                    <p style="font-size: 14px; color: #666; margin-top: 20px;">
                        Your information is stored locally on your device.
                    </p>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(dashboard);
}

// Edit user company
function editUserCompany() {
    // Close dashboard
    const dashboards = document.querySelectorAll('.modal .user-dashboard');
    dashboards.forEach(dashboard => {
        dashboard.closest('.modal').remove();
    });
    
    // Open company form with existing data
    handleAddCompany();
}

// Delete user company
function deleteUserCompany() {
    if (confirm('Are you sure you want to delete your company? This action cannot be undone.')) {
        const userCompanyKey = `user_company_${authCurrentUser.id}`;
        
        try {
            const savedData = localStorage.getItem(userCompanyKey);
            if (savedData) {
                const userCompanyData = JSON.parse(savedData);
                const companyId = userCompanyData.company.id;
                
                // Remove from companies array
                const companyIndex = companies.findIndex(c => c.id === companyId);
                if (companyIndex !== -1) {
                    const deletedCompany = {
                        ...companies[companyIndex],
                        deletedDate: new Date().toISOString(),
                        deletedBy: 'User Company'
                    };
                    
                    // Move to deletion history
                    const existingDeleted = JSON.parse(localStorage.getItem('logodaleel_deleted_companies') || '[]');
                    existingDeleted.push(deletedCompany);
                    localStorage.setItem('logodaleel_deleted_companies', JSON.stringify(existingDeleted));
                    
                    // Remove from active companies
                    companies.splice(companyIndex, 1);
                    filteredCompanies = getVisibleCompanies();
                    renderCompanies();
                }
                
                // Remove from localStorage
                localStorage.removeItem(userCompanyKey);
                
                alert('Your company has been deleted successfully.');
                
                // Close dashboard and refresh
                const dashboards = document.querySelectorAll('.modal .user-dashboard');
                dashboards.forEach(dashboard => {
                    dashboard.closest('.modal').remove();
                });
                
                // Show dashboard again to reflect changes
                setTimeout(() => {
                    showUserDashboard();
                }, 500);
            }
        } catch (error) {
            console.error('Error deleting company:', error);
            alert('Error deleting company. Please try again.');
        }
    }
}

// Close dashboard
function closeDashboard(closeBtn) {
    const dashboard = closeBtn.closest('.modal');
    dashboard.remove();
}

// Blacklist Management Functions
function isPhoneBlacklisted(phone) {
    try {
        const blacklistedData = JSON.parse(localStorage.getItem('logodaleel_blacklist') || '[]');
        return blacklistedData.some(item => item.phone === phone);
    } catch (error) {
        console.error('Error checking blacklist:', error);
        return false;
    }
}

function getContactEmail() {
    try {
        const siteSettings = JSON.parse(localStorage.getItem('siteSettings') || '{}');
        return siteSettings.contactEmail || 'support@logodaleel.com';
    } catch (error) {
        console.error('Error getting contact email:', error);
        return 'support@logodaleel.com';
    }
}

function logoutBlacklistedUser() {
    // Clear current user session if they are blacklisted
    if (authCurrentUser && authCurrentUser.phone && isPhoneBlacklisted(authCurrentUser.phone)) {
        console.log('🚫 Logging out blacklisted user:', authCurrentUser.phone);
        authCurrentUser = null;
        localStorage.removeItem('logodaleel_user');
        
        const contactEmail = getContactEmail();
        alert(`Your account has been disabled, please contact ${contactEmail}`);
        
        // Close any open modals
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => modal.remove());
        
        // Reload page to clear any user interface
        location.reload();
    }
}

// Validate Saudi phone number format
function validateSaudiPhone(phone) {
    const pattern = /^5[0-9]{8}$/;
    return pattern.test(phone);
}

// Generate 6-digit OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Phone Change Functions
function initializePhoneChangeListeners() {
    const changePhoneBtn = document.getElementById('changePhoneBtn');
    const sendOtpBtn = document.getElementById('sendOtpBtn');
    const cancelPhoneBtn = document.getElementById('cancelPhoneChangeBtn');
    const verifyOtpBtn = document.getElementById('verifyPhoneOtpBtn');
    
    if (changePhoneBtn) {
        changePhoneBtn.addEventListener('click', handlePhoneChangeRequest);
    }
    
    if (sendOtpBtn) {
        sendOtpBtn.addEventListener('click', handleSendPhoneOTP);
    }
    
    if (cancelPhoneBtn) {
        cancelPhoneBtn.addEventListener('click', handleCancelPhoneChange);
    }
    
    if (verifyOtpBtn) {
        verifyOtpBtn.addEventListener('click', handleVerifyPhoneOTP);
    }
}

let phoneChangeOTP = null;
let originalPhoneValue = '';

function handlePhoneChangeRequest() {
    const phoneInput = document.getElementById('companyPhone');
    const changePhoneBtn = document.getElementById('changePhoneBtn');
    const sendOtpBtn = document.getElementById('sendOtpBtn');
    const cancelPhoneBtn = document.getElementById('cancelPhoneChangeBtn');
    
    // Store original value
    originalPhoneValue = phoneInput.value;
    
    // Enable phone input
    phoneInput.removeAttribute('readonly');
    phoneInput.focus();
    
    // Show/hide buttons
    changePhoneBtn.style.display = 'none';
    sendOtpBtn.style.display = 'inline-block';
    cancelPhoneBtn.style.display = 'inline-block';
}

function handleSendPhoneOTP() {
    const phoneInput = document.getElementById('companyPhone');
    const newPhone = phoneInput.value.trim();
    
    // Validate phone number
    if (!validateSaudiPhone(newPhone)) {
        alert('Please enter a valid Saudi phone number (9 digits starting with 5)');
        return;
    }
    
    // Check if phone number changed
    if (newPhone === originalPhoneValue) {
        alert('Phone number hasn\'t changed');
        handleCancelPhoneChange();
        return;
    }
    
    // Generate and store OTP
    phoneChangeOTP = generateOTP();
    console.log('Phone Change OTP:', phoneChangeOTP); // For testing
    alert(`Demo Mode: OTP sent to +966${newPhone}. Your verification code is ${phoneChangeOTP}`);
    
    // Show inline OTP input and verify button
    const otpInput = document.getElementById('phoneOtpInput');
    const verifyBtn = document.getElementById('verifyPhoneOtpBtn');
    otpInput.style.display = 'block';
    verifyBtn.style.display = 'block';
    
    // Lock phone input again
    phoneInput.setAttribute('readonly', true);
    
    // Hide send OTP button
    document.getElementById('sendOtpBtn').style.display = 'none';
    
    // Focus on OTP input
    otpInput.focus();
}

function handleVerifyPhoneOTP() {
    const otpInput = document.getElementById('phoneOtpInput');
    const enteredOTP = otpInput.value.trim();
    
    if (!enteredOTP) {
        alert('Please enter the OTP code');
        return;
    }
    
    if (enteredOTP !== phoneChangeOTP) {
        alert('Invalid OTP code. Please try again.');
        return;
    }
    
    // OTP verified successfully
    alert('Phone number updated successfully!');
    
    // Reset UI
    resetPhoneChangeUI();
    
    // Clear stored OTP
    phoneChangeOTP = null;
}

function handleCancelPhoneChange() {
    const phoneInput = document.getElementById('companyPhone');
    
    // Restore original phone value
    phoneInput.value = originalPhoneValue;
    
    // Reset UI
    resetPhoneChangeUI();
    
    // Clear stored OTP
    phoneChangeOTP = null;
}

function resetPhoneChangeUI() {
    const phoneInput = document.getElementById('companyPhone');
    const changePhoneBtn = document.getElementById('changePhoneBtn');
    const sendOtpBtn = document.getElementById('sendOtpBtn');
    const cancelPhoneBtn = document.getElementById('cancelPhoneChangeBtn');
    const otpInput = document.getElementById('phoneOtpInput');
    const verifyBtn = document.getElementById('verifyPhoneOtpBtn');
    
    // Lock phone input
    phoneInput.setAttribute('readonly', true);
    
    // Reset buttons
    changePhoneBtn.style.display = 'inline-block';
    sendOtpBtn.style.display = 'none';
    cancelPhoneBtn.style.display = 'none';
    
    // Hide inline OTP input and verify button
    otpInput.style.display = 'none';
    verifyBtn.style.display = 'none';
    
    // Clear OTP input
    otpInput.value = '';
}

// Branch Management System
let branchCounter = 1;

// Add branch functionality
document.addEventListener('DOMContentLoaded', function() {
    const addBranchBtn = document.getElementById('addBranchBtn');
    if (addBranchBtn) {
        addBranchBtn.addEventListener('click', addBranch);
    }
    
    // Initialize autocomplete for first branch
    if (document.getElementById('addressInput1')) {
        initializeAddressAutocomplete('addressInput1', 'addressDropdown1');
    }
});

function addBranch() {
    branchCounter++;
    const additionalBranches = document.getElementById('additionalBranches');
    const addBranchContainer = document.querySelector('.add-branch-container');
    
    const branchHTML = `
        <div class="branch-section" data-branch="${branchCounter}">
            <h3 class="branch-title">
                Branch ${branchCounter}
                <button type="button" class="remove-branch-btn" onclick="removeBranch(this)">×</button>
            </h3>
            <div class="branch-group" data-branch="${branchCounter}">
                <div class="form-group">
                    <label for="companyMaps${branchCounter}">Maps URL:</label>
                    <input type="url" id="companyMaps${branchCounter}" name="maps${branchCounter}" placeholder="Google Maps URL">
                </div>
                <div class="form-group">
                    <label for="companyCity${branchCounter}">City/Town:</label>
                    <div class="address-input-container">
                        <input type="text" id="addressInput${branchCounter}" placeholder="Enter district, city, or province in Saudi Arabia">
                        <div class="address-dropdown" id="addressDropdown${branchCounter}"></div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    additionalBranches.insertAdjacentHTML('beforeend', branchHTML);
    
    // Move the Add Branch button after the newly added branch
    additionalBranches.appendChild(addBranchContainer);
    
    // Initialize autocomplete for new branch
    initializeAddressAutocomplete(`addressInput${branchCounter}`, `addressDropdown${branchCounter}`);
}

function removeBranch(btn) {
    const branchSection = btn.closest('.branch-section');
    branchSection.remove();
    
    // Renumber remaining branches
    const remainingBranches = document.querySelectorAll('.branch-section');
    branchCounter = 1;
    
    remainingBranches.forEach((branch, index) => {
        const branchNumber = index + 1;
        branch.setAttribute('data-branch', branchNumber);
        
        const title = branch.querySelector('.branch-title');
        const titleText = title.childNodes[0];
        titleText.textContent = `Branch ${branchNumber}`;
        
        // Update IDs and names
        const inputs = branch.querySelectorAll('input, div');
        inputs.forEach(input => {
            if (input.id) {
                input.id = input.id.replace(/\d+$/, branchNumber);
            }
            if (input.name) {
                input.name = input.name.replace(/\d+$/, branchNumber);
            }
        });
        
        branchCounter = branchNumber;
    });
    
    branchCounter = Math.max(branchCounter, remainingBranches.length);
    
    // Ensure the Add Branch button stays at the bottom
    const additionalBranches = document.getElementById('additionalBranches');
    const addBranchContainer = document.querySelector('.add-branch-container');
    if (additionalBranches && addBranchContainer) {
        additionalBranches.appendChild(addBranchContainer);
    }
}

// ====================================
// SITE SETTINGS AND LOGO DROPDOWN
// ====================================

// Default site settings
const defaultSiteSettings = {
    tradingName: 'LogoDaleel.com',
    registrationNumber: 'Not set',
    contactEmail: 'Not set',
    saudiBusinessLogo: '',
    termsAndConditions: `<h3>Terms and Conditions</h3>
<p>Welcome to LogoDaleel.com. These terms and conditions outline the rules and regulations for the use of LogoDaleel's Website.</p>

<h3>1. Acceptance of Terms</h3>
<p>By accessing this website, we assume you accept these terms and conditions. Do not continue to use LogoDaleel.com if you do not agree to take all of the terms and conditions stated on this page.</p>

<h3>2. Use License</h3>
<p>Permission is granted to temporarily download one copy of the materials on LogoDaleel.com for personal, non-commercial transitory viewing only.</p>

<h3>3. Disclaimer</h3>
<p>The materials on LogoDaleel.com are provided on an 'as is' basis. LogoDaleel makes no warranties, expressed or implied.</p>

<h3>4. Contact Information</h3>
<p>If you have any questions about these Terms and Conditions, please contact us.</p>`,
    privacyPolicy: `<h3>Privacy Policy</h3>
<p>Your privacy is important to us. This privacy statement explains the personal data LogoDaleel processes, how LogoDaleel processes it, and for what purposes.</p>

<h3>1. Information We Collect</h3>
<p>We collect information you provide directly to us, such as when you create an account, submit company information, or contact us.</p>

<h3>2. How We Use Your Information</h3>
<p>We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.</p>

<h3>3. Information Sharing</h3>
<p>We do not share your personal information with third parties without your consent, except as described in this policy.</p>

<h3>4. Data Security</h3>
<p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>

<h3>5. Contact Us</h3>
<p>If you have any questions about this Privacy Policy, please contact us.</p>`
};

// Load site settings from localStorage
function loadSiteSettings() {
    try {
        const savedSettings = localStorage.getItem('siteSettings');
        const settings = savedSettings ? JSON.parse(savedSettings) : defaultSiteSettings;
        
        // Update dropdown display
        document.getElementById('tradingNameDisplay').textContent = settings.tradingName || defaultSiteSettings.tradingName;
        document.getElementById('registrationNumberDisplay').textContent = settings.registrationNumber || defaultSiteSettings.registrationNumber;
        
        const contactEmailEl = document.getElementById('contactEmailDisplay');
        if (settings.contactEmail && settings.contactEmail !== 'Not set') {
            contactEmailEl.textContent = settings.contactEmail;
            contactEmailEl.href = `mailto:${settings.contactEmail}`;
        } else {
            contactEmailEl.textContent = defaultSiteSettings.contactEmail;
            contactEmailEl.href = '#';
        }
        
        const saudiLogoEl = document.getElementById('saudiBusinessLogo');
        if (saudiLogoEl && settings.logoUrl) {
            saudiLogoEl.src = settings.logoUrl;
            saudiLogoEl.style.display = 'block';
        } else if (saudiLogoEl) {
            saudiLogoEl.style.display = 'none';
        }
        
        console.log('✅ Site settings loaded');
    } catch (error) {
        console.error('❌ Error loading site settings:', error);
    }
}

// Toggle logo dropdown
function toggleLogoDropdown() {
    const dropdown = document.getElementById('logoDropdown');
    dropdown.classList.toggle('show');
}

// Make functions globally available
window.toggleLogoDropdown = toggleLogoDropdown;

// Show Terms and Conditions popup
function showTermsAndConditions() {
    const popup = document.getElementById('termsPopup');
    const contentEl = document.getElementById('termsContent');
    
    // Load terms from settings
    try {
        const savedSettings = localStorage.getItem('siteSettings');
        const settings = savedSettings ? JSON.parse(savedSettings) : defaultSiteSettings;
        const termsContent = settings.termsAndConditions || defaultSiteSettings.termsAndConditions;
        console.log('Loading Terms content:', termsContent.length, 'characters');
        contentEl.innerHTML = termsContent;
    } catch (error) {
        console.error('Error loading terms:', error);
        contentEl.innerHTML = defaultSiteSettings.termsAndConditions;
    }
    
    popup.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Close dropdown
    document.getElementById('logoDropdown').classList.remove('show');
}

// Show Privacy Policy popup
function showPrivacyPolicy() {
    const popup = document.getElementById('privacyPopup');
    const contentEl = document.getElementById('privacyContent');
    
    // Load privacy policy from settings
    try {
        const savedSettings = localStorage.getItem('siteSettings');
        const settings = savedSettings ? JSON.parse(savedSettings) : defaultSiteSettings;
        const privacyContent = settings.privacyPolicy || defaultSiteSettings.privacyPolicy;
        console.log('Loading Privacy content:', privacyContent.length, 'characters');
        contentEl.innerHTML = privacyContent;
    } catch (error) {
        console.error('Error loading privacy policy:', error);
        contentEl.innerHTML = defaultSiteSettings.privacyPolicy;
    }
    
    popup.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Close dropdown
    document.getElementById('logoDropdown').classList.remove('show');
}

// Make functions globally available
window.showTermsAndConditions = showTermsAndConditions;
window.showPrivacyPolicy = showPrivacyPolicy;

// Close Terms and Conditions popup
function closeTermsPopup() {
    const popup = document.getElementById('termsPopup');
    popup.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close Privacy Policy popup
function closePrivacyPopup() {
    const popup = document.getElementById('privacyPopup');
    popup.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Make close functions globally available
window.closeTermsPopup = closeTermsPopup;
window.closePrivacyPopup = closePrivacyPopup;

// Close popups when clicking outside
document.addEventListener('click', function(e) {
    const termsPopup = document.getElementById('termsPopup');
    const privacyPopup = document.getElementById('privacyPopup');
    
    if (termsPopup && e.target === termsPopup) {
        closeTermsPopup();
    }
    
    if (privacyPopup && e.target === privacyPopup) {
        closePrivacyPopup();
    }
});

// Listen for site settings updates from admin dashboard
window.addEventListener('storage', function(e) {
    if (e.key === 'siteSettings') {
        console.log('🔄 Site settings changed, reloading...');
        loadSiteSettings();
    }
});

// ===============================================
// ENHANCED SEARCH SYSTEM
// ===============================================

// Search Enhancement State
let searchHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');
let savedSearches = JSON.parse(localStorage.getItem('savedSearches') || '[]');
let currentFilters = {};
let searchStartTime = 0;
let selectedSuggestionIndex = -1;

// Popular search terms (could be dynamically updated based on usage)
const popularSearches = [
    'restaurants near me', 'coffee shops', 'tech companies', 'healthcare services',
    'automotive repair', 'beauty salons', 'real estate', 'finance services',
    'education centers', 'entertainment venues'
];

// Initialize Enhanced Search System
function initializeEnhancedSearch() {
    const searchInput = document.getElementById('searchInput');
    const clearSearchBtn = document.getElementById('clearSearchBtn');
    const filterToggleBtn = document.getElementById('filterToggleBtn');
    
    if (!searchInput) return;
    
    // Setup search input events
    searchInput.addEventListener('input', handleSearchInput);
    searchInput.addEventListener('focus', handleSearchFocus);
    searchInput.addEventListener('blur', handleSearchBlur);
    searchInput.addEventListener('keydown', handleSearchKeydown);
    
    // Setup clear search
    if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', clearCurrentSearch);
    }
    
    // Setup filter toggle
    if (filterToggleBtn) {
        filterToggleBtn.addEventListener('click', toggleAdvancedFilters);
    }
    
    // Setup filter controls
    setupAdvancedFilters();
    
    // Setup saved searches
    displaySavedSearches();
    
    // Update filter count display
    updateFilterCount();
    
    console.log('✅ Enhanced Search System Initialized');
}

// Handle search input with debouncing and suggestions
let searchTimeout;
function handleSearchInput(e) {
    const query = e.target.value.trim();
    const clearBtn = document.getElementById('clearSearchBtn');
    
    // Show/hide clear button
    if (clearBtn) {
        clearBtn.style.display = query ? 'block' : 'none';
    }
    
    // Clear previous timeout
    clearTimeout(searchTimeout);
    
    // Debounce search
    searchTimeout = setTimeout(() => {
        if (query.length >= 2) {
            showSearchSuggestions(query);
        } else {
            hideSearchSuggestions();
        }
        
        // Perform search
        if (query.length >= 1) {
            performEnhancedSearch(query);
        } else {
            clearSearchResults();
        }
    }, 300);
}

// Handle search focus - show history or suggestions
function handleSearchFocus(e) {
    const query = e.target.value.trim();
    
    if (query.length >= 2) {
        showSearchSuggestions(query);
    } else if (query.length === 0) {
        // Show popular searches when search bar is empty
        showPopularSearches();
    } else if (searchHistory.length > 0) {
        showSearchHistory();
    }
}

// Handle search blur with delay to allow clicks
function handleSearchBlur(e) {
    setTimeout(() => {
        hideSearchSuggestions();
        hideSearchHistory();
    }, 200);
}

// Handle keyboard navigation in search
function handleSearchKeydown(e) {
    const suggestions = document.querySelectorAll('.suggestion-item');
    
    if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedSuggestionIndex = Math.min(selectedSuggestionIndex + 1, suggestions.length - 1);
        updateSuggestionSelection(suggestions);
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedSuggestionIndex = Math.max(selectedSuggestionIndex - 1, -1);
        updateSuggestionSelection(suggestions);
    } else if (e.key === 'Enter') {
        e.preventDefault();
        if (selectedSuggestionIndex >= 0 && suggestions[selectedSuggestionIndex]) {
            selectSuggestion(suggestions[selectedSuggestionIndex].dataset.query);
        } else {
            performSearchFromInput();
        }
    } else if (e.key === 'Escape') {
        hideSearchSuggestions();
        hideSearchHistory();
        e.target.blur();
    }
}

// Update suggestion selection visual state
function updateSuggestionSelection(suggestions) {
    suggestions.forEach((item, index) => {
        item.classList.toggle('selected', index === selectedSuggestionIndex);
    });
}

// Show popular searches when search bar is empty
function showPopularSearches() {
    const suggestionsContainer = document.getElementById('searchSuggestions');
    if (!suggestionsContainer) return;
    
    const popularSuggestions = popularSearches.map(search => ({
        query: search,
        text: search,
        icon: '🔍',
        type: 'Popular'
    }));
    
    suggestionsContainer.innerHTML = popularSuggestions.map(suggestion => `
        <div class="suggestion-item" data-query="${suggestion.query}" onclick="selectSuggestion('${suggestion.query}')">
            <span class="suggestion-icon">${suggestion.icon}</span>
            <span class="suggestion-text">${suggestion.text}</span>
            <span class="suggestion-type">${suggestion.type}</span>
        </div>
    `).join('');
    
    suggestionsContainer.style.display = 'block';
    selectedSuggestionIndex = -1;
}

// Show search suggestions based on query
function showSearchSuggestions(query) {
    const suggestionsContainer = document.getElementById('searchSuggestions');
    if (!suggestionsContainer) return;
    
    const suggestions = generateSearchSuggestions(query);
    
    if (suggestions.length === 0) {
        hideSearchSuggestions();
        return;
    }
    
    suggestionsContainer.innerHTML = suggestions.map(suggestion => `
        <div class="suggestion-item" data-query="${suggestion.query}" onclick="selectSuggestion('${suggestion.query}')">
            <span class="suggestion-icon">${suggestion.icon}</span>
            <span class="suggestion-text">${suggestion.text}</span>
            <span class="suggestion-type">${suggestion.type}</span>
        </div>
    `).join('');
    
    suggestionsContainer.style.display = 'block';
    selectedSuggestionIndex = -1;
}

// Generate intelligent search suggestions
function generateSearchSuggestions(query) {
    const lowerQuery = query.toLowerCase();
    const suggestions = [];
    
    // Company name suggestions
    const companyMatches = companies.filter(company => 
        company.name.toLowerCase().includes(lowerQuery)
    ).slice(0, 3);
    
    companyMatches.forEach(company => {
        suggestions.push({
            query: company.name,
            text: company.name,
            icon: '🏢',
            type: 'Company'
        });
    });
    
    // Category suggestions
    const categoryMatches = businessCategories.filter(category => 
        category.name.toLowerCase().includes(lowerQuery) ||
        category.keywords.some(keyword => keyword.includes(lowerQuery))
    ).slice(0, 3);
    
    categoryMatches.forEach(category => {
        suggestions.push({
            query: category.name,
            text: category.name,
            icon: '📂',
            type: 'Category'
        });
    });
    
    // Location suggestions
    if (saudiLocationData && saudiLocationData.length > 0) {
        const locationMatches = saudiLocationData.filter(location => 
            location.governorate_name_en.toLowerCase().includes(lowerQuery) ||
            (location.city_name_en && location.city_name_en.toLowerCase().includes(lowerQuery))
        ).slice(0, 2);
        
        locationMatches.forEach(location => {
            suggestions.push({
                query: `companies in ${location.city_name_en || location.governorate_name_en}`,
                text: `Companies in ${location.city_name_en || location.governorate_name_en}`,
                icon: '📍',
                type: 'Location'
            });
        });
    }
    
    // Popular search suggestions
    const popularMatches = popularSearches.filter(search => 
        search.toLowerCase().includes(lowerQuery)
    ).slice(0, 2);
    
    popularMatches.forEach(search => {
        suggestions.push({
            query: search,
            text: search,
            icon: '🔥',
            type: 'Popular'
        });
    });
    
    return suggestions.slice(0, 8); // Limit to 8 suggestions
}

// Hide search suggestions
function hideSearchSuggestions() {
    const suggestionsContainer = document.getElementById('searchSuggestions');
    if (suggestionsContainer) {
        suggestionsContainer.style.display = 'none';
    }
}

// Show search history
function showSearchHistory() {
    const historyContainer = document.getElementById('searchHistory');
    const historyItems = document.querySelector('.search-history-items');
    
    if (!historyContainer || !historyItems || searchHistory.length === 0) return;
    
    historyItems.innerHTML = searchHistory.slice(-5).reverse().map(search => `
        <div class="search-history-item" onclick="selectSuggestion('${search}')">
            <span class="icon">🕒</span>
            <span>${search}</span>
        </div>
    `).join('');
    
    historyContainer.style.display = 'block';
    
    // Setup clear history button
    const clearHistoryBtn = historyContainer.querySelector('.clear-history-btn');
    if (clearHistoryBtn) {
        clearHistoryBtn.onclick = clearSearchHistory;
    }
}

// Hide search history
function hideSearchHistory() {
    const historyContainer = document.getElementById('searchHistory');
    if (historyContainer) {
        historyContainer.style.display = 'none';
    }
}

// Select a suggestion or history item
function selectSuggestion(query) {
    const searchInput = document.getElementById('searchInput');
    const clearBtn = document.getElementById('clearSearchBtn');
    
    if (searchInput) {
        searchInput.value = query;
        
        // Show clear button since we now have text
        if (clearBtn && query.trim()) {
            clearBtn.style.display = 'block';
        }
        
        addToSearchHistory(query);
        performEnhancedSearch(query);
        hideSearchSuggestions();
        hideSearchHistory();
        searchInput.blur();
    }
}

// Add search to history
function addToSearchHistory(query) {
    if (!query || searchHistory.includes(query)) return;
    
    searchHistory.unshift(query);
    searchHistory = searchHistory.slice(0, 10); // Keep only last 10 searches
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
}

// Clear search history
function clearSearchHistory() {
    searchHistory = [];
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    hideSearchHistory();
}

// Clear current search
function clearCurrentSearch() {
    const searchInput = document.getElementById('searchInput');
    const clearBtn = document.getElementById('clearSearchBtn');
    
    if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
    }
    
    if (clearBtn) {
        clearBtn.style.display = 'none';
    }
    
    clearSearchResults();
    hideSearchSuggestions();
}

// Clear search results
function clearSearchResults() {
    filteredCompanies = getVisibleCompanies();
    renderCompanies();
    hideSearchResultsHeader();
    updateSearchStats(filteredCompanies.length, companies.length, '');
}

// Enhanced search with timing and results header
function performEnhancedSearch(query) {
    searchStartTime = performance.now();
    
    // Add to search history
    addToSearchHistory(query);
    
    // Perform the search
    const searchResults = performAISearch(query);
    filteredCompanies = searchResults.companies;
    
    // Calculate search time
    const searchTime = performance.now() - searchStartTime;
    
    // Update UI
    updateSearchStats(filteredCompanies.length, companies.length, query, searchResults.interpretation);
    showSearchResultsHeader(filteredCompanies.length, searchTime, query);
    renderCompanies();
}

// Show search results header
function showSearchResultsHeader(count, time, query) {
    const header = document.getElementById('searchResultsHeader');
    const countEl = document.getElementById('searchResultsCount');
    const timeEl = document.getElementById('searchResultsTime');
    
    if (header && countEl && timeEl) {
        countEl.textContent = `${count} results found`;
        timeEl.textContent = `(${(time / 1000).toFixed(3)} seconds)`;
        header.style.display = 'flex';
    }
}

// Hide search results header
function hideSearchResultsHeader() {
    const header = document.getElementById('searchResultsHeader');
    if (header) {
        header.style.display = 'none';
    }
}

// Setup Advanced Filters
function setupAdvancedFilters() {
    // Category filter with bilingual support
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        businessCategories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.name; // Store English name as value for consistency
            // Display both English and Arabic names
            option.textContent = `${category.name} / ${category.nameAr}`;
            categoryFilter.appendChild(option);
        });
        
        categoryFilter.addEventListener('change', handleFilterChange);
    }
    
    // Location filter with multi-select
    setupMultiSelectLocation();
    
    // Announcement filter
    const announcementFilter = document.getElementById('announcementFilter');
    if (announcementFilter) {
        announcementFilter.addEventListener('change', handleFilterChange);
    }
    
    // Filter action buttons
    const applyBtn = document.getElementById('applyFiltersBtn');
    const clearBtn = document.getElementById('clearFiltersBtn');
    const saveBtn = document.getElementById('saveSearchBtn');
    
    if (applyBtn) applyBtn.addEventListener('click', applyAdvancedFilters);
    if (clearBtn) clearBtn.addEventListener('click', clearAllFilters);
    if (saveBtn) saveBtn.addEventListener('click', saveCurrentSearch);
}

// Toggle advanced filters panel
function toggleAdvancedFilters() {
    const panel = document.getElementById('advancedFilters');
    const toggleBtn = document.getElementById('filterToggleBtn');
    
    if (panel && toggleBtn) {
        const isVisible = panel.style.display === 'block';
        
        if (isVisible) {
            panel.style.display = 'none';
            toggleBtn.classList.remove('active');
        } else {
            // Position the panel relative to the filter button
            const buttonRect = toggleBtn.getBoundingClientRect();
            panel.style.position = 'fixed';
            panel.style.top = (buttonRect.bottom + 5) + 'px';
            panel.style.right = (window.innerWidth - buttonRect.right) + 'px';
            panel.style.display = 'block';
            toggleBtn.classList.add('active');
        }
    }
}

// Close filters panel when clicking outside
document.addEventListener('click', function(event) {
    const panel = document.getElementById('advancedFilters');
    const toggleBtn = document.getElementById('filterToggleBtn');
    
    if (panel && toggleBtn && panel.style.display === 'block') {
        // Check if click is outside both the panel and the toggle button
        if (!panel.contains(event.target) && !toggleBtn.contains(event.target)) {
            panel.style.display = 'none';
            toggleBtn.classList.remove('active');
        }
    }
});

// Handle filter changes
function handleFilterChange() {
    updateCurrentFilters();
    updateFilterCount();
}

// Update current filters object
function updateCurrentFilters() {
    currentFilters = {};
    
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter && categoryFilter.value) {
        currentFilters.category = categoryFilter.value;
    }
    
    // Handle multi-select location filter
    if (selectedLocations && selectedLocations.length > 0) {
        currentFilters.locations = selectedLocations.map(loc => loc.fullAddress);
    }
    
    const announcementFilter = document.getElementById('announcementFilter');
    if (announcementFilter && announcementFilter.value) {
        currentFilters.announcement = announcementFilter.value;
    }
}

// Update filter count display
function updateFilterCount() {
    const filterCount = document.querySelector('.filter-count');
    const toggleBtn = document.getElementById('filterToggleBtn');
    const activeFilters = Object.keys(currentFilters).length;
    
    if (filterCount) {
        if (activeFilters > 0) {
            filterCount.textContent = activeFilters;
            filterCount.style.display = 'inline-block';
            if (toggleBtn) {
                toggleBtn.classList.add('active');
            }
        } else {
            filterCount.style.display = 'none';
            if (toggleBtn && !document.getElementById('advancedFilters').style.display === 'block') {
                toggleBtn.classList.remove('active');
            }
        }
    }
}

// Apply advanced filters
function applyAdvancedFilters() {
    updateCurrentFilters();
    
    let filtered = [...companies];
    
    // Apply category filter
    if (currentFilters.category) {
        filtered = filtered.filter(company => company.category === currentFilters.category);
    }
    
    // Apply location filter (multi-select)
    if (currentFilters.locations && currentFilters.locations.length > 0) {
        filtered = filtered.filter(company => {
            // Check if company's city matches any selected location
            if (!company.city) return false;
            
            return currentFilters.locations.some(selectedLocation => {
                const cityFromLocation = selectedLocation.split(',')[0].trim().toLowerCase();
                const provinceFromLocation = selectedLocation.split(',')[1]?.trim().toLowerCase();
                
                // Check if company city contains the selected city or province
                const companyCity = company.city.toLowerCase();
                return companyCity.includes(cityFromLocation) || 
                       (provinceFromLocation && companyCity.includes(provinceFromLocation));
            });
        });
    }
    
    // Apply announcement filter
    if (currentFilters.announcement) {
        if (currentFilters.announcement === 'has-announcement') {
            filtered = filtered.filter(company => 
                company.announcement && company.announcement.trim() !== ''
            );
        } else if (currentFilters.announcement === 'no-announcement') {
            filtered = filtered.filter(company => 
                !company.announcement || company.announcement.trim() === ''
            );
        }
    }
    
    filteredCompanies = filtered;
    renderCompanies();
    updateSearchStats(filtered.length, companies.length, 'Advanced Filter Results');
    showSearchResultsHeader(filtered.length, 0, 'filtered results');
}

// Clear all filters
function clearAllFilters() {
    currentFilters = {};
    
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) categoryFilter.value = '';
    
    // Clear multi-select location filter
    selectedLocations = [];
    updateLocationDisplay();
    updateLocationOptionsUI();
    
    const announcementFilter = document.getElementById('announcementFilter');
    if (announcementFilter) announcementFilter.value = '';
    
    updateFilterCount();
    clearSearchResults();
}

// Location input handling with suggestions
function handleLocationInput(e) {
    const query = e.target.value.toLowerCase();
    if (query.length >= 2) {
        showLocationSuggestions(query);
    } else {
        hideLocationSuggestions();
    }
}

// Show location suggestions
function showLocationSuggestions(query = '') {
    const suggestionsContainer = document.getElementById('locationSuggestions');
    if (!suggestionsContainer || !saudiLocationData) return;
    
    let matches = [];
    
    if (query) {
        matches = saudiLocationData.filter(location => 
            location.governorate_name_en.toLowerCase().includes(query) ||
            (location.city_name_en && location.city_name_en.toLowerCase().includes(query))
        ).slice(0, 8);
    } else {
        // Show popular locations
        matches = saudiLocationData.filter(location => 
            ['Riyadh', 'Jeddah', 'Dammam', 'Mecca', 'Medina'].includes(location.governorate_name_en)
        );
    }
    
    if (matches.length === 0) {
        hideLocationSuggestions();
        return;
    }
    
    suggestionsContainer.innerHTML = matches.map(location => `
        <div class="location-suggestion" onclick="selectLocation('${location.city_name_en || location.governorate_name_en}')">
            ${location.city_name_en || location.governorate_name_en}, ${location.governorate_name_en}
        </div>
    `).join('');
    
    suggestionsContainer.style.display = 'block';
}

// Hide location suggestions
function hideLocationSuggestions() {
    const suggestionsContainer = document.getElementById('locationSuggestions');
    if (suggestionsContainer) {
        suggestionsContainer.style.display = 'none';
    }
}

// Select location from suggestions
function selectLocation(location) {
    const locationFilter = document.getElementById('locationFilter');
    if (locationFilter) {
        locationFilter.value = location;
        hideLocationSuggestions();
        handleFilterChange();
    }
}

// Setup location autocomplete for filter
function setupLocationAutocomplete(inputElement, suggestionsElement) {
    if (!inputElement || !suggestionsElement) return;
    
    // Add event listeners for autocomplete
    inputElement.addEventListener('input', function() {
        const query = this.value.trim();
        
        if (query.length < 2) {
            suggestionsElement.style.display = 'none';
            return;
        }
        
        // Find matching locations
        const matches = findMatchingLocations(query);
        
        if (matches.length > 0) {
            displayLocationSuggestions(suggestionsElement, matches, inputElement);
        } else {
            suggestionsElement.style.display = 'none';
        }
    });
    
    // Hide suggestions when clicking outside
    inputElement.addEventListener('blur', function() {
        setTimeout(() => {
            suggestionsElement.style.display = 'none';
        }, 200);
    });
    
    // Show suggestions when focused
    inputElement.addEventListener('focus', function() {
        if (this.value.trim().length >= 2) {
            const matches = findMatchingLocations(this.value.trim());
            if (matches.length > 0) {
                displayLocationSuggestions(suggestionsElement, matches, inputElement);
            }
        }
    });
}

// Find matching locations from Saudi address data
function findMatchingLocations(query) {
    if (!saudiLocationData || saudiLocationData.length === 0) {
        return [];
    }
    
    const matches = [];
    const queryLower = query.toLowerCase();
    
    saudiLocationData.forEach(governorate => {
        // Check governorate match
        if (governorate.governorate.toLowerCase().includes(queryLower) || 
            governorate.governorateAr.includes(query)) {
            matches.push({
                type: 'governorate',
                nameEn: governorate.governorate,
                nameAr: governorate.governorateAr,
                fullAddress: `${governorate.governorate}, Saudi Arabia`,
                fullAddressAr: `${governorate.governorateAr}، المملكة العربية السعودية`,
                relevance: 10
            });
        }
        
        // Check cities
        if (governorate.cities) {
            governorate.cities.forEach(city => {
                if (city.city.toLowerCase().includes(queryLower) || 
                    city.cityAr.includes(query)) {
                    matches.push({
                        type: 'city',
                        nameEn: city.city,
                        nameAr: city.cityAr,
                        fullAddress: `${city.city}, ${governorate.governorate}, Saudi Arabia`,
                        fullAddressAr: `${city.cityAr}، ${governorate.governorateAr}، المملكة العربية السعودية`,
                        relevance: 15
                    });
                }
            });
        }
    });
    
    // Sort by relevance and limit results
    return matches
        .sort((a, b) => b.relevance - a.relevance)
        .slice(0, 8);
}

// Display location suggestions for filter
function displayLocationSuggestions(suggestionsElement, matches, inputElement) {
    suggestionsElement.innerHTML = '';
    
    matches.forEach(match => {
        const suggestionItem = document.createElement('div');
        suggestionItem.className = 'location-suggestion-item';
        
        const typeIcon = match.type === 'city' ? '🏙️' : '🌍';
        const typeLabel = match.type === 'city' ? 'City' : 'Province';
        
        suggestionItem.innerHTML = `
            <div class="location-main">
                <span class="location-icon">${typeIcon}</span>
                <div class="location-names">
                    <div class="location-name-en">${match.nameEn} <span class="location-type">(${typeLabel})</span></div>
                    <div class="location-name-ar">${match.nameAr}</div>
                </div>
            </div>
            <div class="location-full">${match.fullAddress}</div>
        `;
        
        suggestionItem.addEventListener('click', function() {
            inputElement.value = match.fullAddress;
            suggestionsElement.style.display = 'none';
            inputElement.focus();
            // Trigger filter change
            handleFilterChange();
        });
        
        suggestionsElement.appendChild(suggestionItem);
    });
    
    suggestionsElement.style.display = 'block';
}

// Multi-select location dropdown functionality
let selectedLocations = [];

function setupMultiSelectLocation() {
    const dropdown = document.getElementById('locationDropdown');
    const search = document.getElementById('locationSearch');
    const options = document.getElementById('locationOptions');
    
    if (!dropdown || !search || !options) return;
    
    // Populate options
    populateLocationOptions();
    
    // Show options when clicking on search field
    search.addEventListener('click', function(e) {
        e.stopPropagation();
        options.classList.add('show');
    });
    
    // Show options when focusing search field
    search.addEventListener('focus', function() {
        options.classList.add('show');
    });
    
    // Search functionality
    search.addEventListener('input', function() {
        filterLocationOptions(this.value);
        options.classList.add('show'); // Ensure options are visible while typing
    });
    
    // Hide options when clicking outside
    document.addEventListener('click', function(e) {
        if (!dropdown.contains(e.target)) {
            options.classList.remove('show');
        }
    });
    
    // Prevent closing when clicking inside the dropdown
    dropdown.addEventListener('click', function(e) {
        e.stopPropagation();
    });
}

function populateLocationOptions() {
    const options = document.getElementById('locationOptions');
    if (!options || !saudiLocationData) return;
    
    const allLocations = [];
    
    // Add provinces/governorates
    saudiLocationData.forEach(governorate => {
        allLocations.push({
            type: 'governorate',
            nameEn: governorate.governorate,
            nameAr: governorate.governorateAr,
            fullAddress: `${governorate.governorate}, Saudi Arabia`,
            searchText: governorate.governorate.toLowerCase() + ' ' + governorate.governorateAr
        });
        
        // Add cities
        if (governorate.cities) {
            governorate.cities.forEach(city => {
                allLocations.push({
                    type: 'city',
                    nameEn: city.city,
                    nameAr: city.cityAr,
                    fullAddress: `${city.city}, ${governorate.governorate}, Saudi Arabia`,
                    searchText: city.city.toLowerCase() + ' ' + city.cityAr + ' ' + governorate.governorate.toLowerCase()
                });
            });
        }
    });
    
    // Sort locations
    allLocations.sort((a, b) => {
        if (a.type !== b.type) {
            return a.type === 'governorate' ? -1 : 1; // Provinces first
        }
        return a.nameEn.localeCompare(b.nameEn);
    });
    
    // Create option elements
    options.innerHTML = '';
    allLocations.forEach(location => {
        const option = document.createElement('div');
        option.className = 'multi-select-option';
        option.dataset.value = location.fullAddress;
        
        const icon = location.type === 'city' ? '🏙️' : '🌍';
        
        option.innerHTML = `
            <span class="option-icon">${icon}</span>
            <div class="option-text">
                <div class="option-name">${location.nameEn}</div>
                <div class="option-arabic">${location.nameAr}</div>
            </div>
        `;
        
        option.addEventListener('click', function() {
            toggleLocationSelection(location.fullAddress, location.nameEn);
        });
        
        options.appendChild(option);
    });
}

function filterLocationOptions(query) {
    const options = document.querySelectorAll('.multi-select-option');
    const queryLower = query.toLowerCase();
    
    options.forEach(option => {
        const text = option.textContent.toLowerCase();
        const shouldShow = !query || text.includes(queryLower);
        option.style.display = shouldShow ? 'flex' : 'none';
    });
}

function toggleLocationSelection(fullAddress, displayName) {
    const index = selectedLocations.findIndex(loc => loc.fullAddress === fullAddress);
    
    if (index > -1) {
        // Remove selection
        selectedLocations.splice(index, 1);
    } else {
        // Add selection
        selectedLocations.push({ fullAddress, displayName });
    }
    
    updateLocationDisplay();
    updateLocationOptionsUI();
    handleFilterChange();
}

function updateLocationDisplay() {
    const display = document.getElementById('selectedLocationsDisplay');
    if (!display) return;
    
    display.innerHTML = '';
    
    if (selectedLocations.length > 0) {
        selectedLocations.forEach(location => {
            const tag = document.createElement('span');
            tag.className = 'selected-location';
            tag.innerHTML = `
                ${location.displayName}
                <span class="remove" onclick="removeLocationSelection('${location.fullAddress}')">&times;</span>
            `;
            display.appendChild(tag);
        });
    }
}

function updateLocationOptionsUI() {
    const options = document.querySelectorAll('.multi-select-option');
    options.forEach(option => {
        const value = option.dataset.value;
        const isSelected = selectedLocations.some(loc => loc.fullAddress === value);
        option.classList.toggle('selected', isSelected);
    });
}

function removeLocationSelection(fullAddress) {
    const index = selectedLocations.findIndex(loc => loc.fullAddress === fullAddress);
    if (index > -1) {
        selectedLocations.splice(index, 1);
        updateLocationDisplay();
        updateLocationOptionsUI();
        handleFilterChange();
    }
}

// Make function globally available
window.removeLocationSelection = removeLocationSelection;

// Save current search
function saveCurrentSearch() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput ? searchInput.value.trim() : '';
    
    if (!query) {
        alert('Please enter a search term to save');
        return;
    }
    
    const searchName = prompt('Enter a name for this saved search:', query);
    if (!searchName) return;
    
    const savedSearch = {
        name: searchName,
        query: query,
        filters: { ...currentFilters },
        timestamp: new Date().toISOString()
    };
    
    // Check if already exists
    if (savedSearches.some(search => search.name === searchName)) {
        if (!confirm('A saved search with this name already exists. Replace it?')) {
            return;
        }
        savedSearches = savedSearches.filter(search => search.name !== searchName);
    }
    
    savedSearches.unshift(savedSearch);
    savedSearches = savedSearches.slice(0, 10); // Keep only 10 saved searches
    localStorage.setItem('savedSearches', JSON.stringify(savedSearches));
    
    displaySavedSearches();
    alert('Search saved successfully!');
}

// Display saved searches
function displaySavedSearches() {
    const savedSearchesBar = document.getElementById('savedSearchesBar');
    const savedSearchesList = document.getElementById('savedSearchesList');
    
    if (!savedSearchesBar || !savedSearchesList) return;
    
    if (savedSearches.length === 0) {
        savedSearchesBar.style.display = 'none';
        return;
    }
    
    savedSearchesBar.style.display = 'flex';
    savedSearchesList.innerHTML = savedSearches.map(search => `
        <div class="saved-search-item" onclick="applySavedSearch('${search.name}')">
            ${search.name}
            <span class="delete-saved" onclick="event.stopPropagation(); deleteSavedSearch('${search.name}')" title="Delete saved search">×</span>
        </div>
    `).join('');
}

// Apply saved search
function applySavedSearch(name) {
    const savedSearch = savedSearches.find(search => search.name === name);
    if (!savedSearch) return;
    
    // Set search query
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = savedSearch.query;
    }
    
    // Apply filters
    currentFilters = { ...savedSearch.filters };
    
    if (currentFilters.category) {
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) categoryFilter.value = currentFilters.category;
    }
    
    if (currentFilters.location) {
        const locationFilter = document.getElementById('locationFilter');
        if (locationFilter) locationFilter.value = currentFilters.location;
    }
    
    if (currentFilters.services) {
        const serviceCheckboxes = document.querySelectorAll('.services-filter input[type="checkbox"]');
        serviceCheckboxes.forEach(cb => {
            cb.checked = currentFilters.services.includes(cb.value);
        });
    }
    
    // Perform search
    performEnhancedSearch(savedSearch.query);
    updateFilterCount();
}

// Delete saved search
function deleteSavedSearch(name) {
    if (confirm('Delete this saved search?')) {
        savedSearches = savedSearches.filter(search => search.name !== name);
        localStorage.setItem('savedSearches', JSON.stringify(savedSearches));
        displaySavedSearches();
    }
}

// Perform search from input (for Enter key)
function performSearchFromInput() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        const query = searchInput.value.trim();
        if (query) {
            performEnhancedSearch(query);
        }
    }
}

// Utility function to get time ago string
function getTimeAgo(date) {
    const now = new Date();
    const diffInMs = now - date;
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) {
        return 'just now';
    } else if (diffInHours < 24) {
        return `${diffInHours}h ago`;
    } else if (diffInDays < 7) {
        return `${diffInDays}d ago`;
    } else {
        return date.toLocaleDateString();
    }
}

// News/Updates System with Timer
class NewsSystem {
    constructor(companyId = null) {
        this.companyId = companyId;
        this.timerInterval = null;
        this.init();
    }

    init() {
        console.log('NewsSystem init called');
        const toggle = document.getElementById('newsToggle');
        const resetBtn = document.getElementById('newsResetBtn');
        const timer = document.getElementById('newsTimer');
        const newsTextarea = document.getElementById('companyNews');

        console.log('NewsSystem elements found:', {
            toggle: !!toggle,
            resetBtn: !!resetBtn,
            timer: !!timer,
            newsTextarea: !!newsTextarea
        });

        if (!toggle || !resetBtn || !timer || !newsTextarea) {
            console.error('NewsSystem: Required elements not found');
            return;
        }

        // Initialize button state first
        this.isActive = false;
        this.updateButtonState();

        // Load saved state (this will override the initial state if needed)
        this.loadState();

        // Event listeners
        toggle.addEventListener('click', () => this.handleToggle());
        resetBtn.addEventListener('click', () => this.resetTimer());
        newsTextarea.addEventListener('input', () => this.updateTimestamp());
        
        console.log('NewsSystem initialized successfully');
    }

    updateButtonState() {
        const toggle = document.getElementById('newsToggle');
        const toggleText = toggle.querySelector('.toggle-text');
        
        if (this.isActive) {
            toggle.classList.add('active');
            toggleText.textContent = 'ON';
        } else {
            toggle.classList.remove('active');
            toggleText.textContent = 'OFF';
        }
    }

    handleToggle() {
        const timer = document.getElementById('newsTimer');
        const resetBtn = document.getElementById('newsResetBtn');
        const currentCompany = this.getCurrentCompany();

        // Toggle the state
        this.isActive = !this.isActive;
        this.updateButtonState();

        // Always show timer and reset button
        timer.style.display = 'block';
        resetBtn.style.display = 'block';

        if (this.isActive) {
            // Turn on: start 14-day timer and clear any expired flags
            this.startTime = Date.now();
            this.timestamp = Date.now();
            
            // Clear expired flags when turning news back on
            if (currentCompany) {
                currentCompany.newsExpired = false;
                currentCompany.newsExpiredAlertShown = false;
                delete currentCompany.newsExpiredTime;
                this.saveCompanyData(currentCompany);
            }
            
            this.startTimer();
        } else {
            // Turn off: stop timer
            this.stopTimer();
            // Reset timer display to default
            const timerDisplay = document.getElementById('timerDisplay');
            if (timerDisplay) {
                timerDisplay.textContent = '14d 0h 0m 0s';
            }
        }
        
        this.updateDateDisplay();
    }

    startTimer() {
        // Use the instance startTime directly
        if (!this.startTime) {
            this.startTime = Date.now();
        }

        this.updateTimerDisplay();
        
        // Update every second for real-time countdown
        this.timerInterval = setInterval(() => {
            this.updateTimerDisplay();
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    updateTimerDisplay() {
        if (!this.startTime) {
            return;
        }

        const now = Date.now();
        const elapsed = now - this.startTime;
        const fourteenDays = 14 * 24 * 60 * 60 * 1000; // 14 days in milliseconds
        const remaining = fourteenDays - elapsed;

        if (remaining <= 0) {
            // Time's up - auto turn off
            this.autoTurnOff();
            return;
        }

        const days = Math.floor(remaining / (24 * 60 * 60 * 1000));
        const hours = Math.floor((remaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
        const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
        const seconds = Math.floor((remaining % (60 * 1000)) / 1000);

        const timerDisplay = document.getElementById('timerDisplay');
        if (timerDisplay) {
            timerDisplay.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        }
    }

    updateDateDisplay() {
        const newsUpdatedDate = document.getElementById('news-updated-date');
        if (newsUpdatedDate && this.timestamp) {
            const updateDate = new Date(this.timestamp);
            const formattedDate = updateDate.toLocaleDateString('en-GB'); // dd/mm/yyyy format
            newsUpdatedDate.textContent = `Updated ${formattedDate}`;
            newsUpdatedDate.style.display = 'block';
        }
    }

    resetTimer() {
        const currentCompany = this.getCurrentCompany();
        if (!currentCompany) return;

        // Reset to 14 days and clear any expired flags
        currentCompany.newsStartTime = Date.now();
        currentCompany.newsTimestamp = Date.now();
        currentCompany.newsExpired = false; // Clear expired flag
        currentCompany.newsExpiredAlertShown = false; // Reset alert flag
        delete currentCompany.newsExpiredTime; // Remove expired time
        this.saveCompanyData(currentCompany);
        this.updateTimerDisplay();
    }

    autoTurnOff() {
        const timer = document.getElementById('newsTimer');
        const resetBtn = document.getElementById('newsResetBtn');
        const currentCompany = this.getCurrentCompany();

        this.isActive = false;
        this.updateButtonState();
        
        // Keep timer and reset button visible
        timer.style.display = 'block';
        resetBtn.style.display = 'block';
        
        this.stopTimer();
        
        // Mark that timer has expired and save the company data
        if (currentCompany) {
            currentCompany.newsActive = false;
            currentCompany.newsExpired = true; // Mark as expired
            currentCompany.newsExpiredTime = Date.now(); // Record when it expired
            this.saveCompanyData(currentCompany);
        }
        
        this.clearState();
        
        // Only show alert if this is the user's own company timer expiring
        // and they are currently logged in, and we haven't shown this alert before
        if (authCurrentUser && currentCompany && 
            ((currentCompany.addedById && currentCompany.addedById === authCurrentUser.id) ||
             (currentCompany.addedBy && currentCompany.addedBy === authCurrentUser.phone)) &&
            !currentCompany.newsExpiredAlertShown) {
            
            currentCompany.newsExpiredAlertShown = true; // Mark alert as shown
            this.saveCompanyData(currentCompany);
            alert('News/Updates timer has expired and has been automatically turned off.');
        }
    }

    updateTimestamp() {
        const currentCompany = this.getCurrentCompany();
        if (!currentCompany) return;

        currentCompany.newsTimestamp = Date.now();
        this.saveCompanyData(currentCompany);
    }

    getCurrentCompany() {
        // If we have a companyId passed to constructor (for Add Company form)
        if (this.companyId) {
            // For Add Company form, create a temporary company object
            const tempCompanyKey = `temp_news_${this.companyId}`;
            let tempCompany = JSON.parse(localStorage.getItem(tempCompanyKey) || 'null');
            
            if (!tempCompany) {
                tempCompany = {
                    id: this.companyId,
                    newsActive: false,
                    newsStartTime: null,
                    newsTimestamp: null
                };
            }
            return tempCompany;
        }
        
        // Original logic for existing companies
        const companyId = document.getElementById('companyId')?.value;
        if (!companyId) return null;

        const companies = JSON.parse(localStorage.getItem('logodaleel_companies') || '[]');
        return companies.find(c => c.id === companyId);
    }

    saveCompanyData(company) {
        // Set lastEdited timestamp whenever company data is saved
        company.lastEdited = Date.now();
        
        // If this is a temporary company (Add Company form)
        if (this.companyId && company.id === this.companyId) {
            const tempCompanyKey = `temp_news_${this.companyId}`;
            localStorage.setItem(tempCompanyKey, JSON.stringify(company));
            return;
        }
        
        // Original logic for existing companies
        const companies = JSON.parse(localStorage.getItem('logodaleel_companies') || '[]');
        const index = companies.findIndex(c => c.id === company.id);
        if (index !== -1) {
            companies[index] = company;
            localStorage.setItem('logodaleel_companies', JSON.stringify(companies));
        }
    }

    saveState() {
        const currentCompany = this.getCurrentCompany();
        if (currentCompany) {
            currentCompany.newsActive = true;
            if (!currentCompany.newsStartTime) {
                currentCompany.newsStartTime = Date.now();
            }
            currentCompany.newsTimestamp = Date.now();
            this.saveCompanyData(currentCompany);
        }
    }

    clearState() {
        const currentCompany = this.getCurrentCompany();
        if (currentCompany) {
            currentCompany.newsActive = false;
            delete currentCompany.newsStartTime;
            this.saveCompanyData(currentCompany);
        }
    }

    loadState() {
        // Load from actual saved company data, not temporary NewsSystem data
        if (!authCurrentUser) return;
        
        const userCompanyKey = `user_company_${authCurrentUser.id}`;
        const savedData = localStorage.getItem(userCompanyKey);
        
        if (savedData) {
            try {
                const userCompanyData = JSON.parse(savedData);
                const company = userCompanyData.company;
                
                const toggle = document.getElementById('newsToggle');
                const timer = document.getElementById('newsTimer');
                const resetBtn = document.getElementById('newsResetBtn');

                if (company.newsActive) {
                    this.isActive = true;
                    this.startTime = company.newsStartTime;
                    this.timestamp = company.newsTimestamp;
                    this.updateButtonState();
                    timer.style.display = 'block';
                    resetBtn.style.display = 'block';
                    this.startTimer();
                } else {
                    this.isActive = false;
                    this.updateButtonState();
                    timer.style.display = 'block';
                    resetBtn.style.display = 'block';
                }
            } catch (error) {
                console.error('Error loading company data:', error);
                // Default to inactive state
                this.isActive = false;
                this.updateButtonState();
            }
        } else {
            // No saved data, default to inactive
            this.isActive = false;
            this.updateButtonState();
            const timer = document.getElementById('newsTimer');
            const resetBtn = document.getElementById('newsResetBtn');
            timer.style.display = 'block';
            resetBtn.style.display = 'block';
        }
    }
}

// Initialize news system
let newsSystem;

// Initialize the enhanced search system when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add a small delay to ensure all other initialization is complete
    setTimeout(initializeEnhancedSearch, 100);
    
    // Initialize news system
    setTimeout(() => {
        newsSystem = new NewsSystem();
    }, 200);
});

// Make functions globally available for onclick handlers
window.selectSuggestion = selectSuggestion;

// ====================================
// NEWS PANEL FUNCTIONALITY
// ====================================

function toggleNewsPanel() {
    const newsPanel = document.getElementById('newsPanel');
    const overlay = document.getElementById('newsPanelOverlay');
    
    if (newsPanel.classList.contains('active')) {
        // Close panel
        newsPanel.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    } else {
        // Open panel
        updateNewsPanel();
        newsPanel.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Consolidate companies with multiple branches for news panel display
function consolidateCompaniesForNews(companiesWithNews) {
    const consolidatedMap = new Map();
    
    companiesWithNews.forEach(company => {
        // Determine the main company ID (remove branch suffix if present)
        const mainId = company.mainCompanyId || (company.id.includes('_branch_') ? company.id.split('_branch_')[0] : company.id);
        
        if (!consolidatedMap.has(mainId)) {
            // Create the main consolidated company entry
            const consolidatedCompany = {
                ...company,
                id: mainId,
                branches: [],
                totalBranches: 1,
                allMapsUrls: [] // Store all maps URLs for multi-branch companies
            };
            
            // Add this branch info
            if (company.city || company.maps) {
                consolidatedCompany.branches.push({
                    city: company.city,
                    governorate: company.governorate,
                    maps: company.maps
                });
                
                if (company.maps) {
                    consolidatedCompany.allMapsUrls.push(company.maps);
                }
            }
            
            consolidatedMap.set(mainId, consolidatedCompany);
        } else {
            // Add this branch to existing consolidated company
            const consolidatedCompany = consolidatedMap.get(mainId);
            
            // Add branch info if not already present
            const existingBranch = consolidatedCompany.branches.find(b => 
                b.city === company.city && b.maps === company.maps
            );
            
            if (!existingBranch && (company.city || company.maps)) {
                consolidatedCompany.branches.push({
                    city: company.city,
                    governorate: company.governorate,
                    maps: company.maps
                });
                
                if (company.maps && !consolidatedCompany.allMapsUrls.includes(company.maps)) {
                    consolidatedCompany.allMapsUrls.push(company.maps);
                }
            }
            
            consolidatedCompany.totalBranches = consolidatedCompany.branches.length;
        }
    });
    
    return Array.from(consolidatedMap.values());
}

function updateNewsPanel() {
    const companiesWithNews = companies.filter(company => 
        company.news && company.news.trim() !== '' && company.newsActive === true
    );
    
    // Consolidate multi-branch companies for news panel display
    const consolidatedNewsCompanies = consolidateCompaniesForNews(companiesWithNews);
    
    const newsPanelContent = document.getElementById('newsPanelContent');
    const newsCount = document.getElementById('newsCount');
    
    // Update counter with consolidated count
    newsCount.textContent = consolidatedNewsCompanies.length;
    
    if (consolidatedNewsCompanies.length === 0) {
        newsPanelContent.innerHTML = `
            <div class="news-panel-empty">
                <h4>No Updates Available</h4>
                <p>No companies have posted updates or announcements yet. Check back later for the latest offers and news!</p>
            </div>
        `;
        return;
    }
    
    // Sort by most recent news (if you have timestamps) or just display all
    const newsHTML = consolidatedNewsCompanies.map(company => createNewsCard(company)).join('');
    newsPanelContent.innerHTML = newsHTML;
    
    // Initialize expandable news functionality for all news cards
    initializeNewsExpansion();
}

function initializeNewsExpansion() {
    // Check all news content elements for expansion needs
    document.querySelectorAll('.news-content.collapsed').forEach(newsContent => {
        setTimeout(() => {
            if (!isTextTruncated(newsContent, 3)) {
                // Remove toggle if not needed
                const toggleDiv = newsContent.closest('.company-news').querySelector('.news-toggle');
                if (toggleDiv) {
                    toggleDiv.remove();
                }
                newsContent.classList.remove('collapsed');
            }
        }, 10);
    });
}

function createNewsCard(company) {
    const phone = company.phone ? company.phone : '';
    
    // Handle multiple branches display
    const totalBranches = company.branches ? company.branches.length : 1;
    let locationDisplay = '';
    let mapsLinks = '';
    
    if (totalBranches > 1) {
        // Multiple branches - show "X Branches" with hover tooltip
        const branchAddresses = company.branches
            .map(branch => parseAddressForDisplay(branch.city, branch.governorate))
            .filter(addr => addr && addr.trim() !== '');
        
        locationDisplay = `<div class="company-city">
            <span class="city-tag branches-tag" data-company-id="${company.id}">
                ${totalBranches} Branches
                <div class="branches-tooltip">
                    ${branchAddresses.map(addr => `<span class="branch-capsule">${addr}</span>`).join('')}
                </div>
            </span>
        </div>`;
        
        // Multiple maps links
        if (company.allMapsUrls && company.allMapsUrls.length > 1) {
            const mapsLinksHtml = company.allMapsUrls
                .map((url, index) => `<a href="${url}" target="_blank">Branch ${index + 1}</a>`)
                .join('');
            
            mapsLinks = `<div class="company-maps-multi" title="Multiple locations">
                <span class="maps-multi-trigger">Maps</span>
                <div class="maps-multi-dropdown">
                    ${mapsLinksHtml}
                </div>
            </div>`;
        } else if (company.allMapsUrls && company.allMapsUrls.length === 1) {
            mapsLinks = `<a href="${company.allMapsUrls[0]}" class="company-maps" target="_blank">Maps</a>`;
        }
    } else {
        // Single branch - show regular address
        const displayAddress = parseAddressForDisplay(company.city, company.governorate);
        if (displayAddress && displayAddress.trim() !== '') {
            locationDisplay = `<div class="company-city"><span class="city-tag">${displayAddress}</span></div>`;
        }
        
        // Single maps link
        if (company.maps && company.maps.trim() !== '') {
            mapsLinks = `<a href="${company.maps}" class="company-maps" target="_blank">Maps</a>`;
        }
    }
    
    // Format news timestamp
    let updateTimestamp = company.newsStartTime || company.newsTimestamp;
    if (!updateTimestamp) {
        updateTimestamp = Date.now() - (7 * 24 * 60 * 60 * 1000); // Default to 7 days ago
    }
    const updateDate = new Date(updateTimestamp);
    const formattedDate = updateDate.toLocaleDateString('en-GB'); // dd/mm/yyyy format
    
    return `
        <div class="company-popup news-card-popup">
            <div class="popup-action-buttons">
                <div class="action-button-container">
                    <button class="share-btn-popup" onclick="shareCompany('${company.id}')" title="Share this company">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
                        </svg>
                    </button>
                    <div class="button-divider"></div>
                    <div class="popup-menu-container">
                        <button class="popup-menu-btn" onclick="togglePopupMenu('${company.id}')" title="More options">
                            <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                            </svg>
                        </button>
                        <div class="popup-menu-dropdown" id="popup-menu-${company.id}">
                            <div class="popup-menu-option" onclick="openReportModal('${company.id}', '${company.name.replace(/'/g, "\\'")}')">
                                Report Company
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <h3 class="company-name">${company.name}</h3>
            <div class="company-tags">
                ${company.category ? `<div class="company-category"><span class="category-tag">${getCategoryDisplayName(company.category, detectUserLanguagePreference())}</span></div>` : ''}
                ${locationDisplay}
            </div>
            <p class="company-description">${company.description || ''}</p>
            <div class="company-news">
                <div class="news-updated-date">Updated ${formattedDate}</div>
                <div class="news-content collapsed">${company.news}</div>
                <div class="news-toggle">
                    <button class="news-more-btn" onclick="toggleNewsExpansion(this)">more</button>
                </div>
            </div>
            <div class="company-links">
                ${phone ? `<a href="tel:${phone}" class="company-phone" target="_blank">${phone}</a>` : ''}
                ${company.website ? `<a href="${company.website}" class="company-website" target="_blank">Website</a>` : ''}
                ${mapsLinks}
            </div>
            <div class="social-icons">
                ${company.linkedin ? `<a href="${company.linkedin}" class="social-icon linkedin" target="_blank" title="LinkedIn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                </a>` : ''}
                ${company.instagram ? `<a href="${company.instagram}" class="social-icon instagram" target="_blank" title="Instagram">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                </a>` : ''}
                ${company.tiktok ? `<a href="${company.tiktok}" class="social-icon tiktok" target="_blank" title="TikTok">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                    </svg>
                </a>` : ''}
                ${company.snapchat ? `<a href="${company.snapchat}" class="social-icon snapchat" target="_blank" title="Snapchat">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.219-.359-.219c-.359-.359-.359-.719 0-1.078.359-.359.719-.359 1.078 0 0 0 .719.359.719.359s5.957-1.406 5.957-1.406c1.036-.24 2.49-.146 3.439-.041C20.842 21.405 24.004 17.066 24.004 11.987 24.004 5.367 18.637.001 12.017.001z"/>
                    </svg>
                </a>` : ''}
                ${company.whatsapp ? `<a href="${company.whatsapp}" class="social-icon whatsapp" target="_blank" title="WhatsApp">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.905 3.488"/>
                    </svg>
                </a>` : ''}
            </div>
        </div>
    `;
}

// Update news panel when companies data changes
function refreshNewsPanel() {
    const newsCount = document.getElementById('newsCount');
    if (newsCount) {
        const companiesWithNews = companies.filter(company => 
            company.news && company.news.trim() !== '' && company.newsActive === true
        );
        
        // Consolidate multi-branch companies for counter
        const consolidatedNewsCompanies = consolidateCompaniesForNews(companiesWithNews);
        newsCount.textContent = consolidatedNewsCompanies.length;
        
        // If panel is open, refresh its content
        if (document.getElementById('newsPanel').classList.contains('active')) {
            updateNewsPanel();
        }
    }
}

// Make functions globally available
window.toggleNewsPanel = toggleNewsPanel;
window.selectLocation = selectLocation;
window.applySavedSearch = applySavedSearch;
window.deleteSavedSearch = deleteSavedSearch;
window.shareCompany = shareCompany;
window.shareOwnCompany = shareOwnCompany;

// Company sharing functionality
function shareCompany(companyId) {
    const company = companies.find(c => c.id === companyId);
    if (!company) return;
    
    // Create share content
    const shareText = createShareText(company);
    const shareUrl = window.location.href;
    
    // Always show our custom share modal to include preview option
    showShareModal(company, shareText, shareUrl);
}

// Share own company functionality
function shareOwnCompany() {
    // Get current user's company data from the form
    const currentCompany = getCurrentCompanyFromForm();
    if (!currentCompany || !currentCompany.name) {
        alert('Please save your company information first before sharing.');
        return;
    }
    
    // Create share content
    const shareText = createShareText(currentCompany);
    const shareUrl = window.location.href;
    
    // Show share modal
    showShareModal(currentCompany, shareText, shareUrl);
}

// Helper function to get current company data from the form
function getCurrentCompanyFromForm() {
    const name = document.getElementById('companyName').value.trim();
    if (!name) return null;
    
    return {
        name: name,
        description: document.getElementById('companyDescription').value.trim(),
        category: document.getElementById('companyCategory').value.trim(),
        phone: document.getElementById('companyPhone').value.trim(),
        website: document.getElementById('companyWebsite').value.trim(),
        news: document.getElementById('companyNews').value.trim(),
        newsActive: document.getElementById('newsToggle').classList.contains('active')
    };
}

function createShareText(company) {
    let text = `🏢 ${company.name}\n`;
    if (company.category) text += `📂 ${company.category}\n`;
    if (company.description) text += `📝 ${company.description}\n`;
    if (company.news && company.newsActive) text += `📢 ${company.news}\n`;
    if (company.phone) text += `📞 ${company.phone}\n`;
    text += `\n🔗 LogoDaleel.com - Saudi Business Directory`;
    return text;
}

function showShareModal(company, shareText, shareUrl) {
    // Create modal if it doesn't exist
    let modal = document.getElementById('shareModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'shareModal';
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content share-modal">
                <div class="modal-header">
                    <h3>Share ${company.name}</h3>
                    <button class="modal-close" onclick="closeShareModal()">×</button>
                </div>
                <div class="modal-body">
                    <div class="share-options">
                        <button class="share-option whatsapp" onclick="shareToWhatsApp('${encodeURIComponent(shareText)}')">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.905 3.488"/>
                            </svg>
                            WhatsApp
                        </button>
                        <button class="share-option telegram" onclick="shareToTelegram('${encodeURIComponent(shareText)}')">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                            </svg>
                            Telegram
                        </button>
                        <button class="share-option twitter" onclick="shareToTwitter('${encodeURIComponent(shareText)}', '${encodeURIComponent(shareUrl)}')">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                            </svg>
                            Twitter
                        </button>
                        <button class="share-option copy" onclick="copyToClipboard('${shareText.replace(/'/g, "\\'")}')">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                            </svg>
                            Copy Text
                        </button>
                        <button class="share-option preview" onclick="previewWhatsAppMessage('${company.id}')">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                            </svg>
                            Preview WhatsApp
                        </button>
                        <button class="share-option native" onclick="useNativeShare('${company.name}', '${encodeURIComponent(shareText)}', '${encodeURIComponent(shareUrl)}')">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
                            </svg>
                            More Options
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    modal.style.display = 'flex';
}

function closeShareModal() {
    const modal = document.getElementById('shareModal');
    if (modal) modal.style.display = 'none';
}

function shareToWhatsApp(text) {
    window.open(`https://wa.me/?text=${text}`, '_blank');
    closeShareModal();
}

function shareToTelegram(text) {
    window.open(`https://t.me/share/url?text=${text}`, '_blank');
    closeShareModal();
}

function shareToTwitter(text, url) {
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
    closeShareModal();
}

function copyToClipboard(text) {
    // Decode the text first
    const decodedText = text.replace(/\\'/g, "'");
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(decodedText).then(() => {
            showNotification('Company details copied to clipboard!', 'success');
            closeShareModal();
        });
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = decodedText;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('Company details copied to clipboard!', 'success');
        closeShareModal();
    }
}

function previewWhatsAppMessage(companyId) {
    const company = companies.find(c => c.id === companyId);
    if (!company) return;
    
    // Create the message as it would appear when the site is live
    const shareText = createShareText(company);
    const productionUrl = `https://logodaleel.com/company/${company.id}`; // Example production URL
    
    // Create the full WhatsApp message
    const whatsappMessage = `${shareText}\n\n${productionUrl}`;
    
    // Close the share modal first
    closeShareModal();
    
    // Create preview modal
    let previewModal = document.getElementById('whatsappPreviewModal');
    if (!previewModal) {
        previewModal = document.createElement('div');
        previewModal.id = 'whatsappPreviewModal';
        previewModal.className = 'modal-overlay';
        previewModal.innerHTML = `
            <div class="modal-content whatsapp-preview-modal">
                <div class="modal-header">
                    <h3>📱 WhatsApp Message Preview</h3>
                    <button class="modal-close" onclick="closeWhatsAppPreview()">×</button>
                </div>
                <div class="modal-body">
                    <div class="whatsapp-preview">
                        <div class="whatsapp-header">
                            <div class="whatsapp-avatar">📱</div>
                            <div class="whatsapp-info">
                                <div class="whatsapp-name">You</div>
                                <div class="whatsapp-status">Just now</div>
                            </div>
                        </div>
                        <div class="whatsapp-message">
                            <div class="message-bubble">
                                <pre class="message-text">${whatsappMessage}</pre>
                                <div class="message-time">Just now ✓✓</div>
                            </div>
                        </div>
                    </div>
                    <div class="preview-note">
                        <p><strong>Note:</strong> This is how your message will appear when your site is live at logodaleel.com</p>
                        <p>Currently showing local file path because you're testing locally.</p>
                    </div>
                    <div class="preview-actions">
                        <button class="btn btn-primary" onclick="copyWhatsAppMessage('${whatsappMessage.replace(/'/g, "\\'")}')">
                            Copy This Message
                        </button>
                        <button class="btn btn-secondary" onclick="closeWhatsAppPreview()">
                            Close Preview
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(previewModal);
    } else {
        // Update existing modal with new content
        const messageText = previewModal.querySelector('.message-text');
        messageText.textContent = whatsappMessage;
        const copyButton = previewModal.querySelector('.btn-primary');
        copyButton.setAttribute('onclick', `copyWhatsAppMessage('${whatsappMessage.replace(/'/g, "\\'")}\')`);
    }
    
    previewModal.style.display = 'flex';
}

function closeWhatsAppPreview() {
    const modal = document.getElementById('whatsappPreviewModal');
    if (modal) modal.style.display = 'none';
}

function copyWhatsAppMessage(message) {
    const decodedMessage = message.replace(/\\'/g, "'");
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(decodedMessage).then(() => {
            showNotification('WhatsApp message copied to clipboard!', 'success');
            closeWhatsAppPreview();
        });
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = decodedMessage;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('WhatsApp message copied to clipboard!', 'success');
        closeWhatsAppPreview();
    }
}

function useNativeShare(title, text, url) {
    const decodedText = decodeURIComponent(text);
    const decodedUrl = decodeURIComponent(url);
    
    if (navigator.share) {
        navigator.share({
            title: title,
            text: decodedText,
            url: decodedUrl
        }).then(() => {
            closeShareModal();
        }).catch(err => {
            console.log('Error with native sharing:', err);
            showNotification('Native sharing not available', 'error');
        });
    } else {
        showNotification('Native sharing not supported on this device', 'error');
    }
}

function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        background: ${type === 'success' ? '#4CAF50' : '#f44336'};
        color: white;
        border-radius: 4px;
        z-index: 10000;
        font-size: 14px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

// Modal menu functions
function toggleModalMenu() {
    const dropdown = document.getElementById('modalMenuDropdown');
    dropdown.classList.toggle('show');
}

// Close modal menu when clicking outside
document.addEventListener('click', function(event) {
    const menuContainer = document.querySelector('.modal-menu-container');
    const dropdown = document.getElementById('modalMenuDropdown');
    
    if (dropdown && !menuContainer.contains(event.target)) {
        dropdown.classList.remove('show');
    }
});

function toggleCompanyVisibility() {
    // Close the dropdown first
    const dropdown = document.getElementById('modalMenuDropdown');
    dropdown.classList.remove('show');
    
    // Check if user is authenticated
    if (authCurrentUser && authCurrentUser.phone) {
        // Find the company
        const companyIndex = companies.findIndex(c => c.phone === authCurrentUser.phone);
        if (companyIndex !== -1) {
            const company = companies[companyIndex];
            const isCurrentlyHidden = company.status === 'hidden';
            
            if (isCurrentlyHidden) {
                // Show confirmation to make company visible
                if (confirm('Are you sure you want to show your company on the main page? Visitors will be able to find and view your company.')) {
                    companies[companyIndex].status = 'visible';
                    saveCompanyData();
                    showNotification('Your company is now visible on the main page', 'success');
                    
                    // Close the modal
                    hideAddCompanyForm();
                    
                    // Refresh the display
                    updateFilteredCompanies();
                }
            } else {
                // Show confirmation to hide company
                if (confirm('Are you sure you want to hide your company from the main page? Visitors will not be able to find your company, but it will still be accessible through direct links.')) {
                    companies[companyIndex].status = 'hidden';
                    saveCompanyData();
                    showNotification('Your company has been hidden from the main page', 'success');
                    
                    // Close the modal
                    hideAddCompanyForm();
                    
                    // Refresh the display
                    updateFilteredCompanies();
                }
            }
        } else {
            showNotification('Company not found', 'error');
        }
    } else {
        showNotification('Please sign in first', 'error');
    }
}

// Update the visibility toggle UI based on current company status
function updateVisibilityToggleUI() {
    if (authCurrentUser && authCurrentUser.phone) {
        const company = companies.find(c => c.phone === authCurrentUser.phone);
        if (company) {
            const isHidden = company.status === 'hidden';
            const toggleIcon = document.getElementById('toggleVisibilityIcon');
            const toggleText = document.getElementById('toggleVisibilityText');
            
            if (isHidden) {
                // Company is hidden, show "Show Company" option
                toggleText.textContent = 'Show Company on Main Page';
                toggleIcon.innerHTML = '<path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>';
            } else {
                // Company is visible, show "Hide Company" option
                toggleText.textContent = 'Hide Company from Main Page';
                toggleIcon.innerHTML = '<path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>';
            }
        }
    }
}

function deleteCompanyAccount() {
    // Close the dropdown first
    const dropdown = document.getElementById('modalMenuDropdown');
    dropdown.classList.remove('show');
    
    // Show confirmation dialog with warning
    if (confirm('Are you sure you want to delete your company account? Your company will be moved to deletion history and can be restored by an administrator.')) {
        // Double confirmation
        if (confirm('Please confirm again: Do you really want to delete your company account?')) {
            // Check if user is authenticated
            if (authCurrentUser && authCurrentUser.phone) {
                // Find and remove the company
                const companyIndex = companies.findIndex(c => c.phone === authCurrentUser.phone);
                if (companyIndex !== -1) {
                    const companyName = companies[companyIndex].name;
                    const deletedCompany = {
                        ...companies[companyIndex],
                        deletedDate: new Date().toISOString(),
                        deletedBy: 'User Account'
                    };
                    
                    // Move to deletion history
                    const existingDeleted = JSON.parse(localStorage.getItem('logodaleel_deleted_companies') || '[]');
                    existingDeleted.push(deletedCompany);
                    localStorage.setItem('logodaleel_deleted_companies', JSON.stringify(existingDeleted));
                    
                    // Remove from active companies
                    companies.splice(companyIndex, 1);
                    saveCompanyData();
                    
                    // Clear user session
                    authCurrentUser = null;
                    localStorage.removeItem('logodaleel_user');
                    
                    showNotification(`Company "${companyName}" has been moved to deletion history`, 'success');
                    
                    // Close the modal
                    hideAddCompanyForm();
                    
                    // Refresh the display - filter out hidden companies
                    updateFilteredCompanies();
                } else {
                    showNotification('Company not found', 'error');
                }
            } else {
                showNotification('Please sign in first', 'error');
            }
        }
    }
}

// Make functions globally available
window.toggleModalMenu = toggleModalMenu;
window.toggleCompanyVisibility = toggleCompanyVisibility;
window.deleteCompanyAccount = deleteCompanyAccount;
window.toggleNewsExpansion = toggleNewsExpansion;
window.togglePopupMenu = togglePopupMenu;
window.openReportModal = openReportModal;
window.closeReportModal = closeReportModal;
window.submitReport = submitReport;

// Popup menu functionality
function togglePopupMenu(companyId) {
    // First, close all other open dropdowns
    const allDropdowns = document.querySelectorAll('.popup-menu-dropdown.show');
    allDropdowns.forEach(dropdown => {
        if (dropdown.id !== `popup-menu-${companyId}`) {
            dropdown.classList.remove('show');
        }
    });
    
    const dropdown = document.getElementById(`popup-menu-${companyId}`);
    
    if (dropdown) {
        dropdown.classList.toggle('show');
        
        // Close menu when clicking outside
        if (dropdown.classList.contains('show')) {
            document.addEventListener('click', function closeMenu(e) {
                if (!e.target.closest('.popup-menu-container')) {
                    dropdown.classList.remove('show');
                    document.removeEventListener('click', closeMenu);
                }
            });
        }
    }
}

// Report company functionality
function openReportModal(companyId, companyName) {
    // Close any open popup menus
    document.querySelectorAll('.popup-menu-dropdown.show').forEach(menu => {
        menu.classList.remove('show');
    });
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay report-modal-overlay';
    modal.innerHTML = `
        <div class="modal-content report-modal-content">
            <div class="modal-header">
                <h2>Report Company</h2>
                <button class="modal-close" onclick="closeReportModal()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="report-company-info">
                    <p><strong>Reporting:</strong> ${companyName}</p>
                    <p class="report-disclaimer">Your report will be reviewed by our administrators. Please provide accurate information.</p>
                </div>
                
                <form id="reportForm" onsubmit="submitReport(event, '${companyId}', '${companyName.replace(/'/g, "\\'")}')">
                    <div class="form-group">
                        <label for="reportReason">Reason for Report *</label>
                        <select id="reportReason" required>
                            <option value="">Select a reason...</option>
                            <option value="inappropriate-content">Inappropriate or offensive content</option>
                            <option value="false-information">False or misleading information</option>
                            <option value="spam">Spam or promotional abuse</option>
                            <option value="copyright">Copyright infringement</option>
                            <option value="not-business">Not a legitimate business</option>
                            <option value="inappropriate-images">Inappropriate images or logo</option>
                            <option value="other">Other (please specify below)</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="reportDetails">Additional Details</label>
                        <textarea id="reportDetails" rows="4" placeholder="Please provide specific details about your report. If you selected 'Other', please explain the issue here."></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="reporterPhone">Your Phone Number *</label>
                        <input type="tel" id="reporterPhone" required placeholder="+966xxxxxxxxx" 
                               pattern="^\\+966[5-9][0-9]{8}$" 
                               title="Please enter a valid Saudi phone number (e.g., +966501234567)">
                    </div>
                    
                    <div class="form-group">
                        <label for="reporterEmail">Your Email Address *</label>
                        <input type="email" id="reporterEmail" required placeholder="your.email@example.com">
                    </div>
                    
                    <div class="report-terms">
                        <label class="checkbox-label">
                            <input type="checkbox" id="reportTerms" required>
                            I confirm that the information provided is accurate and I understand that false reports may result in consequences.
                        </label>
                    </div>
                    
                    <button type="submit" class="submit-btn report-submit-btn">Submit Report</button>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function closeReportModal() {
    const modal = document.querySelector('.report-modal-overlay');
    if (modal) {
        modal.remove();
    }
}

function submitReport(event, companyId, companyName) {
    event.preventDefault();
    
    const reason = document.getElementById('reportReason').value;
    const details = document.getElementById('reportDetails').value;
    const phone = document.getElementById('reporterPhone').value;
    const email = document.getElementById('reporterEmail').value;
    
    if (!reason || !phone || !email) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    // Create report object
    const report = {
        id: Date.now().toString(),
        companyId: companyId,
        companyName: companyName,
        reason: reason,
        details: details,
        reporterPhone: phone,
        reporterEmail: email,
        timestamp: Date.now(),
        status: 'pending', // pending, reviewed, resolved, dismissed
        adminNotes: ''
    };
    
    // Save report to localStorage
    const existingReports = JSON.parse(localStorage.getItem('logodaleel_reports') || '[]');
    existingReports.push(report);
    localStorage.setItem('logodaleel_reports', JSON.stringify(existingReports));
    
    // Trigger refresh for admin dashboard
    localStorage.setItem('logodaleel_reports_refresh_trigger', Date.now().toString());
    
    showNotification('Report submitted successfully. Thank you for helping us maintain quality.', 'success');
    closeReportModal();
}

// ==========================================
// CATEGORY SUGGESTION SYSTEM
// ==========================================

// Function to suggest a new category
function suggestCategory() {
    const categoryName = prompt('What category would you like to suggest? (English name)');
    if (!categoryName) return;
    
    const categoryNameAr = prompt('What is the Arabic name for this category? (اسم الفئة بالعربية)');
    if (!categoryNameAr) return;
    
    const userEmail = prompt('Your email (optional):') || 'Anonymous';
    
    const suggestion = {
        categoryName: categoryName.trim(),
        categoryNameAr: categoryNameAr.trim(),
        userEmail: userEmail.trim(),
        dateSubmitted: new Date().toISOString(),
        status: 'pending'
    };
    
    // Save to localStorage
    const suggestions = JSON.parse(localStorage.getItem('logodaleel_category_suggestions') || '[]');
    suggestions.push(suggestion);
    localStorage.setItem('logodaleel_category_suggestions', JSON.stringify(suggestions));
    
    alert('Thank you! Your category suggestion has been submitted for review.');
}

// Function to show category suggestion option in UI
function showCategorySuggestionUI() {
    const searchResults = document.getElementById('searchResults');
    if (searchResults && searchResults.innerHTML.includes('No companies found')) {
        const suggestionHTML = `
            <div style="text-align: center; padding: 20px; margin: 20px 0; background: #f8f9fa; border-radius: 8px; border: 2px dashed #dee2e6;">
                <p style="margin-bottom: 15px; color: #6c757d;">Can't find the right category for your business?</p>
                <button onclick="suggestCategory()" style="background: #28a745; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-size: 14px;">
                    💡 Suggest New Category
                </button>
            </div>
        `;
        searchResults.insertAdjacentHTML('beforeend', suggestionHTML);
    }
}
