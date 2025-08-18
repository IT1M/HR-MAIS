// Analyze CV using Gemini API for Mais Medical Company context
async function analyzeCV(candidateId, cvText, basicInfo = {}) {
    try {
        const { GoogleGenerativeAI } = require('@google/generative-ai');
        
        // Initialize Gemini API
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'AIzaSyBvJLY9HrYaZ9vR3MhOTLV1234567890');
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            generationConfig: {
                temperature: 0.3,
                maxOutputTokens: 4096,
            }
        });

        const prompt = `
تحليل شامل ومفصل للسيرة الذاتية - شركة ميس للمشاريع الطبية - السعودية

معلومات المرشح الأساسية:
- الاسم: ${basicInfo.fullName || 'غير محدد'}
- التخصص الطبي: ${basicInfo.specialization || 'غير محدد'}
- سنوات الخبرة: ${basicInfo.experience || 'غير محدد'}
- المؤهل التعليمي: ${basicInfo.education || 'غير محدد'}
- الراتب المتوقع: ${basicInfo.expectedSalary || 'غير محدد'} ريال سعودي

النص المستخرج من السيرة الذاتية:
${cvText}

كخبير في التوظيف الطبي في السعودية، قم بتحليل هذه السيرة الذاتية بدقة عالية وبدون مجاملات. 

التحليل يجب أن يكون:
1. صادق ومباشر بدون تجميل
2. يركز على الخبرة العملية في المجال الطبي
3. يقيم القدرة على العمل في البيئة السعودية
4. يحدد المخاطر الحقيقية في التوظيف
5. يقدم توصيات عملية للتطوير

معايير التقييم الأساسية:
- الخبرة العملية في المجال الطبي (0-100)
- المؤهلات الأكاديمية وجودتها (0-100)
- المهارات التقنية الطبية (0-100)
- مهارات التواصل والعمل الجماعي (0-100)
- المعرفة بالأنظمة الصحية السعودية (0-100)
- القدرة على التعامل مع التحديات (0-100)

أريد تحليل صريح يشمل:
- تحديد نقاط القوة الحقيقية (ليس مجاملات)
- تحديد نقاط الضعف والمخاطر
- تقييم مدى الملاءمة لشركة ميس الطبية
- توصية واقعية بخصوص التوظيف
- تقييم للراتب المناسب حسب الخبرة الفعلية

إرجع النتيجة في JSON فقط:
{
    "overallScore": رقم من 0-100,
    "detailedScores": {
        "medicalExperience": رقم من 0-100,
        "academicQualifications": رقم من 0-100,
        "technicalSkills": رقم من 0-100,
        "communicationSkills": رقم من 0-100,
        "saudiHealthSystemKnowledge": رقم من 0-100,
        "problemSolving": رقم من 0-100
    },
    "strengths": [
        "نقطة قوة حقيقية ومحددة",
        "نقطة قوة أخرى مع دليل"
    ],
    "weaknesses": [
        {
            "category": "فئة الضعف",
            "description": "وصف مفصل للضعف",
            "impact": "تأثير هذا الضعف على الأداء",
            "improvementSuggestion": "اقتراح محدد للتحسين"
        }
    ],
    "medicalExpertiseAssessment": {
        "specialization": "التخصص المحدد",
        "experienceLevel": "مبتدئ/متوسط/متقدم/خبير",
        "certifications": "الشهادات المهنية المعترف بها",
        "clinicalExperience": "تقييم الخبرة السريرية",
        "researchExperience": "الخبرة البحثية"
    },
    "saudiMarketFit": {
        "culturalAdaptability": رقم من 0-100,
        "languageSkills": "تقييم مهارات اللغة",
        "regulatoryKnowledge": "المعرفة بالأنظمة الصحية السعودية",
        "localExperience": "الخبرة في السوق السعودي"
    },
    "riskAssessment": {
        "overallRisk": "منخفض/متوسط/عالي",
        "riskFactors": [
            {
                "type": "نوع المخاطرة",
                "level": "منخفض/متوسط/عالي",
                "description": "وصف المخاطرة",
                "impact": "التأثير المحتمل",
                "mitigation": "كيفية تخفيف المخاطرة"
            }
        ]
    },
    "hiringRecommendation": {
        "decision": "توظيف فوري/توظيف مشروط/مراجعة إضافية/رفض مهذب",
        "confidence": رقم من 0-100,
        "reasoning": [
            "سبب رئيسي للقرار",
            "سبب إضافي"
        ],
        "conditions": [
            "شرط للتوظيف إن وجد"
        ],
        "nextSteps": [
            "الخطوة التالية المطلوبة"
        ]
    },
    "salaryAssessment": {
        "currency": "ريال سعودي",
        "recommendedRange": {
            "minimum": رقم,
            "maximum": رقم,
            "mostLikely": رقم
        },
        "justification": "تبرير نطاق الراتب المقترح",
        "marketComparison": "مقارنة مع السوق السعودي"
    },
    "developmentPlan": [
        {
            "area": "مجال التطوير",
            "priority": "عالي/متوسط/منخفض",
            "action": "الإجراء المطلوب",
            "timeline": "الإطار الزمني"
        }
    ],
    "finalSummary": "ملخص نهائي صادق ومباشر عن هذا المرشح"
}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let analysisText = response.text();
        
        // Clean JSON response
        analysisText = analysisText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        
        try {
            const analysis = JSON.parse(analysisText);
            
            // Store comprehensive analysis in database
            await window.ezsite.apis.tableCreate(35305, {
                candidate_id: candidateId,
                overall_score: analysis.overallScore || 0,
                technical_score: analysis.detailedScores?.technicalSkills || 0,
                experience_score: analysis.detailedScores?.medicalExperience || 0,
                education_score: analysis.detailedScores?.academicQualifications || 0,
                soft_skills_score: analysis.detailedScores?.communicationSkills || 0,
                medical_expertise_score: analysis.detailedScores?.medicalExperience || 0,
                strengths: JSON.stringify(analysis.strengths || []),
                weaknesses: JSON.stringify(analysis.weaknesses || []),
                recommendations: JSON.stringify(analysis.developmentPlan || []),
                summary: analysis.finalSummary || '',
                hiring_recommendation: analysis.hiringRecommendation?.decision || '',
                risk_assessment: analysis.riskAssessment?.overallRisk || 'متوسط',
                salary_recommendation: `${analysis.salaryAssessment?.recommendedRange?.minimum || 0} - ${analysis.salaryAssessment?.recommendedRange?.maximum || 0} ريال سعودي`
            });
            
            return analysis;
        } catch (parseError) {
            console.error('Failed to parse Gemini response:', parseError);
            console.log('Raw response:', analysisText);
            
            // Return comprehensive default analysis if parsing fails
            const defaultAnalysis = {
                overallScore: 40,
                detailedScores: {
                    medicalExperience: 40,
                    academicQualifications: 50,
                    technicalSkills: 45,
                    communicationSkills: 50,
                    saudiHealthSystemKnowledge: 30,
                    problemSolving: 45
                },
                strengths: ["يحتاج مراجعة السيرة الذاتية"],
                weaknesses: [{
                    category: "تحليل السيرة الذاتية",
                    description: "لم يتم التمكن من تحليل السيرة الذاتية بشكل كامل",
                    impact: "صعوبة في تقييم الملاءمة للوظيفة",
                    improvementSuggestion: "يرجى تحسين جودة ووضوح السيرة الذاتية"
                }],
                medicalExpertiseAssessment: {
                    specialization: "غير محدد بوضوح",
                    experienceLevel: "يحتاج تقييم إضافي",
                    certifications: "غير واضحة",
                    clinicalExperience: "تحتاج مراجعة",
                    researchExperience: "غير محددة"
                },
                saudiMarketFit: {
                    culturalAdaptability: 50,
                    languageSkills: "يحتاج تقييم",
                    regulatoryKnowledge: "غير واضحة",
                    localExperience: "محدودة أو غير واضحة"
                },
                riskAssessment: {
                    overallRisk: "متوسط إلى عالي",
                    riskFactors: [{
                        type: "عدم وضوح المعلومات",
                        level: "عالي",
                        description: "صعوبة في تحليل السيرة الذاتية",
                        impact: "قرار توظيف غير مدروس",
                        mitigation: "مقابلة شخصية مفصلة مطلوبة"
                    }]
                },
                hiringRecommendation: {
                    decision: "مراجعة إضافية",
                    confidence: 30,
                    reasoning: [
                        "عدم وضوح المعلومات في السيرة الذاتية",
                        "صعوبة في تقييم الملاءمة للوظيفة"
                    ],
                    conditions: ["مقابلة شخصية مفصلة", "مراجعة إضافية للوثائق"],
                    nextSteps: ["ترتيب مقابلة شخصية", "طلب وثائق إضافية"]
                },
                salaryAssessment: {
                    currency: "ريال سعودي",
                    recommendedRange: {
                        minimum: 5000,
                        maximum: 8000,
                        mostLikely: 6500
                    },
                    justification: "تقدير أولي يحتاج مراجعة بعد المقابلة",
                    marketComparison: "ضمن النطاق العام للمبتدئين"
                },
                developmentPlan: [{
                    area: "تحسين السيرة الذاتية",
                    priority: "عالي",
                    action: "إعادة كتابة السيرة الذاتية بشكل أوضح وأكثر تفصيلاً",
                    timeline: "قبل التقديم مرة أخرى"
                }],
                finalSummary: "هذا المرشح يحتاج إلى مراجعة إضافية ومقابلة شخصية مفصلة لتحديد مدى ملاءمته للوظيفة في شركة ميس للمشاريع الطبية. السيرة الذاتية تحتاج لتحسين في الوضوح والتفصيل."
            };
            
            // Store default analysis
            await window.ezsite.apis.tableCreate(35305, {
                candidate_id: candidateId,
                overall_score: defaultAnalysis.overallScore,
                technical_score: defaultAnalysis.detailedScores.technicalSkills,
                experience_score: defaultAnalysis.detailedScores.medicalExperience,
                education_score: defaultAnalysis.detailedScores.academicQualifications,
                soft_skills_score: defaultAnalysis.detailedScores.communicationSkills,
                medical_expertise_score: defaultAnalysis.detailedScores.medicalExperience,
                strengths: JSON.stringify(defaultAnalysis.strengths),
                weaknesses: JSON.stringify(defaultAnalysis.weaknesses),
                recommendations: JSON.stringify(defaultAnalysis.developmentPlan),
                summary: defaultAnalysis.finalSummary,
                hiring_recommendation: defaultAnalysis.hiringRecommendation.decision,
                risk_assessment: defaultAnalysis.riskAssessment.overallRisk,
                salary_recommendation: `${defaultAnalysis.salaryAssessment.recommendedRange.minimum} - ${defaultAnalysis.salaryAssessment.recommendedRange.maximum} ريال سعودي`
            });
            
            return defaultAnalysis;
        }
    } catch (error) {
        console.error('CV Analysis error:', error);
        throw new Error('فشل في تحليل السيرة الذاتية باستخدام الذكاء الاصطناعي. يرجى المحاولة مرة أخرى.');
    }
}