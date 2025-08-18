
// Analyze CV using mock AI (in production, use Google Gemini API)
function analyzeCV(candidateId, cvText, basicInfo, jobDescription) {
    try {
        // Simulate AI analysis processing time
        const timestamp = new Date().toISOString();
        
        // Mock AI analysis result based on input data
        const analysis = {
            overallScore: Math.floor(Math.random() * 20) + 80, // 80-99
            detailedScores: {
                experience: calculateExperienceScore(basicInfo.experience),
                education: calculateEducationScore(basicInfo.education), 
                skills: Math.floor(Math.random() * 15) + 85,
                personality: Math.floor(Math.random() * 10) + 80,
                compatibility: jobDescription ? Math.floor(Math.random() * 20) + 80 : 75
            },
            radarData: {
                labels: ['المهارات التقنية', 'الخبرة العملية', 'التعليم', 'اللغات', 'المهارات الناعمة', 'الإبداع'],
                data: [
                    Math.floor(Math.random() * 20) + 80,
                    Math.floor(Math.random() * 15) + 85,
                    Math.floor(Math.random() * 25) + 75,
                    Math.floor(Math.random() * 30) + 70,
                    Math.floor(Math.random() * 15) + 80,
                    Math.floor(Math.random() * 25) + 75
                ]
            },
            barData: {
                labels: ['البرمجة', 'إدارة المشاريع', 'التصميم', 'التحليل', 'التواصل'],
                data: [
                    Math.floor(Math.random() * 20) + 80,
                    Math.floor(Math.random() * 20) + 70,
                    Math.floor(Math.random() * 30) + 60,
                    Math.floor(Math.random() * 20) + 80,
                    Math.floor(Math.random() * 15) + 75
                ]
            },
            summary: generateSummary(basicInfo, cvText),
            strengths: generateStrengths(basicInfo),
            weaknesses: generateWeaknesses(basicInfo),
            cvImprovements: [
                'إضافة قسم المشاريع الشخصية',
                'تحسين وصف الخبرات المهنية',
                'إضافة الشهادات والدورات التدريبية',
                'تحسين التنسيق والتصميم'
            ],
            professionalSummary: `مرشح ${getExperienceText(basicInfo.experience)} في مجال ${getSpecializationText(basicInfo.specialization)} مع خلفية تعليمية ${getEducationText(basicInfo.education)}.`,
            suggestedJobs: generateSuggestedJobs(basicInfo.specialization),
            aiImpression: 'مرشح واعد يظهر إمكانات قوية للنمو والتطور المهني',
            finalVerdict: determineFinalVerdict(Math.floor(Math.random() * 20) + 80),
            analyzedAt: timestamp,
            candidateId: candidateId
        };

        return {
            success: true,
            analysis: analysis,
            processedAt: timestamp
        };
        
    } catch (error) {
        console.error('Error in CV analysis:', error);
        throw new Error('فشل في تحليل السيرة الذاتية');
    }
}

function calculateExperienceScore(experience) {
    const scores = {
        'fresh': 75,
        'junior': 80,
        'mid': 85,
        'senior': 95
    };
    return scores[experience] || 70;
}

function calculateEducationScore(education) {
    const scores = {
        'highschool': 70,
        'diploma': 75,
        'bachelor': 85,
        'master': 90,
        'phd': 95
    };
    return scores[education] || 70;
}

function generateSummary(basicInfo, cvText) {
    const templates = [
        'مرشح متميز بخبرة قوية في مجاله التخصصي. يظهر إمكانات كبيرة للنمو والتطور المهني.',
        'ملف مهني واعد يجمع بين الخبرة العملية والمؤهلات الأكاديمية القوية.',
        'مرشح يتمتع بمهارات تقنية متقدمة ورؤية واضحة لتطوير مسيرته المهنية.',
        'ملف مهني متكامل يظهر التزامًا واضحًا بالتطوير المستمر والتميز في الأداء.'
    ];
    
    return templates[Math.floor(Math.random() * templates.length)];
}

function generateStrengths(basicInfo) {
    const strengthsPool = {
        developer: [
            'خبرة قوية في تطوير التطبيقات',
            'إتقان تقنيات البرمجة الحديثة',
            'فهم عميق لهندسة البرمجيات',
            'مهارات حل المشاكل المتقدمة',
            'القدرة على العمل مع فرق متعددة'
        ],
        designer: [
            'حس إبداعي متميز',
            'إتقان أدوات التصميم المتخصصة',
            'فهم عميق لتجربة المستخدم',
            'مهارات التواصل البصري',
            'القدرة على ترجمة الأفكار إلى تصاميم'
        ],
        marketer: [
            'فهم عميق لسلوك المستهلك',
            'مهارات التحليل والتخطيط الاستراتيجي',
            'خبرة في أدوات التسويق الرقمي',
            'القدرة على إنشاء حملات فعالة',
            'مهارات التواصل والإقناع'
        ]
    };
    
    const relevantStrengths = strengthsPool[basicInfo.persona] || strengthsPool.developer;
    return relevantStrengths.slice(0, 4);
}

function generateWeaknesses(basicInfo) {
    const weaknessesPool = [
        { category: 'المهارات التقنية', description: 'تطوير معرفة أعمق بالتقنيات الحديثة', improvement: 'أخذ دورات تدريبية متخصصة' },
        { category: 'إدارة المشاريع', description: 'تعزيز مهارات التخطيط والتنظيم', improvement: 'الحصول على شهادة PMP' },
        { category: 'التسويق الذاتي', description: 'تحسين عرض الإنجازات والخبرات', improvement: 'بناء محفظة أعمال قوية' },
        { category: 'الشبكات المهنية', description: 'توسيع نطاق العلاقات المهنية', improvement: 'المشاركة في فعاليات المجال' }
    ];
    
    return weaknessesPool.slice(0, 3);
}

function getExperienceText(experience) {
    const texts = {
        'fresh': 'حديث التخرج',
        'junior': 'مبتدئ',
        'mid': 'متوسط الخبرة', 
        'senior': 'خبير'
    };
    return texts[experience] || 'مرشح';
}

function getEducationText(education) {
    const texts = {
        'highschool': 'ثانوية عامة',
        'diploma': 'دبلوم',
        'bachelor': 'بكالوريوس',
        'master': 'ماجستير',
        'phd': 'دكتوراه'
    };
    return texts[education] || 'مؤهل';
}

function getSpecializationText(specialization) {
    const texts = {
        'frontend': 'تطوير الواجهات الأمامية',
        'backend': 'تطوير الواجهات الخلفية',
        'fullstack': 'التطوير الشامل',
        'mobile': 'تطوير التطبيقات المحمولة',
        'devops': 'DevOps',
        'uiux': 'تصميم UI/UX',
        'graphic': 'التصميم الجرافيكي',
        'web': 'تصميم المواقع',
        'brand': 'تصميم الهوية',
        'product': 'تصميم المنتجات',
        'digital': 'التسويق الرقمي',
        'social': 'إدارة وسائل التواصل',
        'content': 'تسويق المحتوى',
        'seo': 'تحسين محركات البحث',
        'ppc': 'الإعلانات المدفوعة'
    };
    return texts[specialization] || 'التقنية';
}

function generateSuggestedJobs(specialization) {
    const jobsBySpec = {
        'frontend': ['مطور واجهات أمامية أول', 'مهندس React', 'مطور تطبيقات الويب'],
        'backend': ['مهندس خادم أول', 'مطور Node.js', 'مهندس قواعد البيانات'],
        'fullstack': ['مهندس برمجيات شامل', 'قائد فريق التطوير', 'مستشار تقني'],
        'mobile': ['مطور تطبيقات محمولة أول', 'مهندس React Native', 'مطور iOS/Android'],
        'uiux': ['مصمم تجربة مستخدم أول', 'قائد فريق التصميم', 'مستشار UX'],
        'digital': ['مدير تسويق رقمي', 'استراتيجي تسويق', 'محلل تسويق رقمي']
    };
    
    return jobsBySpec[specialization] || ['متخصص تقني', 'مستشار', 'قائد فريق'];
}

function determineFinalVerdict(score) {
    if (score >= 90) return 'مناسب جداً للتوظيف';
    if (score >= 80) return 'مناسب للتوظيف';
    if (score >= 70) return 'مناسب مع التطوير';
    return 'يحتاج تطوير إضافي';
}
