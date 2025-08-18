// Generate personalized interview questions using Gemini API for medical positions
async function generateInterviewQuestions(candidateId, cvAnalysis, basicInfo = {}) {
    try {
        const { GoogleGenerativeAI } = require('@google/generative-ai');
        
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'AIzaSyBvJLY9HrYaZ9vR3MhOTLV1234567890');
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            generationConfig: {
                temperature: 0.4,
                maxOutputTokens: 3072,
            }
        });

        const prompt = `
إنشاء أسئلة مقابلة شخصية مخصصة للمرشح - شركة ميس للمشاريع الطبية - السعودية

معلومات المرشح:
- الاسم: ${basicInfo.fullName || 'غير محدد'}
- التخصص الطبي: ${basicInfo.specialization || 'غير محدد'}
- سنوات الخبرة: ${basicInfo.experience || 'غير محدد'}
- المؤهل التعليمي: ${basicInfo.education || 'غير محدد'}

نتائج تحليل السيرة الذاتية:
- النتيجة العامة: ${cvAnalysis.overallScore || 0}/100
- الخبرة الطبية: ${cvAnalysis.detailedScores?.medicalExperience || 0}/100
- المهارات التقنية: ${cvAnalysis.detailedScores?.technicalSkills || 0}/100
- التأهيل الأكاديمي: ${cvAnalysis.detailedScores?.academicQualifications || 0}/100
- مهارات التواصل: ${cvAnalysis.detailedScores?.communicationSkills || 0}/100
- نقاط القوة: ${JSON.stringify(cvAnalysis.strengths || [])}
- نقاط الضعف: ${JSON.stringify(cvAnalysis.weaknesses || [])}
- توصية التوظيف: ${cvAnalysis.hiringRecommendation?.decision || 'غير محددة'}
- تقييم المخاطر: ${cvAnalysis.riskAssessment?.overallRisk || 'غير محدد'}

بناءً على هذا التحليل، أنشئ 10-12 سؤال مقابلة شخصية مصممة خصيصاً لهذا المرشح تهدف إلى:

1. تقييم الخبرة العملية الحقيقية في المجال الطبي
2. اختبار المعرفة التقنية والطبية المتخصصة
3. فحص القدرة على التعامل مع المواقف الطبية الحرجة
4. تقييم مهارات التواصل مع المرضى والفريق الطبي
5. التحقق من فهم الأنظمة الصحية السعودية
6. اكتشاف نقاط الضعف المحددة من تحليل السيرة
7. تقييم الدافعية للعمل في شركة ميس
8. فحص القدرة على التطوير والتعلم المستمر
9. التحقق من الالتزام بالأخلاقيات الطبية
10. تقييم الملاءمة الثقافية للبيئة السعودية

الأسئلة يجب أن تكون:
- مباشرة وعملية
- مرتبطة بالخبرة الفعلية للمرشح
- تكشف عن القدرات الحقيقية
- مناسبة للمجال الطبي المحدد
- تختبر نقاط الضعف المكتشفة
- تؤكد نقاط القوة
- مناسبة للثقافة السعودية

إرجع النتيجة في JSON فقط:
{
    "questions": [
        {
            "id": 1,
            "category": "الخبرة الطبية",
            "question": "نص السؤال باللغة العربية",
            "purpose": "الهدف من طرح هذا السؤال",
            "difficulty": "سهل/متوسط/صعب",
            "expectedAnswer": "ملخص للإجابة المتوقعة",
            "scoringCriteria": [
                "معيار التقييم الأول",
                "معيار التقييم الثاني"
            ],
            "relatedWeakness": "نقطة الضعف المرتبطة إن وجدت"
        }
    ],
    "interviewMetadata": {
        "estimatedDuration": "المدة المقدرة بالدقائق",
        "difficultyLevel": "مستوى صعوبة المقابلة العام",
        "focusAreas": ["مجال التركيز الرئيسي", "مجال التركيز الثانوي"],
        "specialConsiderations": ["اعتبار خاص للمرشح"],
        "recommendedInterviewers": ["نوع المقابل المطلوب"]
    }
}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let questionsText = response.text();
        
        // Clean JSON response
        questionsText = questionsText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        
        try {
            const questionsData = JSON.parse(questionsText);
            
            // Generate unique session ID
            const sessionId = 'interview_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            
            // Store interview session in database
            await window.ezsite.apis.tableCreate(35306, {
                candidate_id: candidateId,
                session_id: sessionId,
                questions: JSON.stringify(questionsData.questions || []),
                responses: JSON.stringify([]),
                interview_score: 0,
                communication_score: 0,
                technical_response_score: 0,
                session_status: 'created',
                start_time: new Date().toISOString()
            });
            
            return {
                sessionId: sessionId,
                questions: questionsData.questions || [],
                metadata: questionsData.interviewMetadata || {
                    estimatedDuration: "30-45 دقيقة",
                    difficultyLevel: "متوسط",
                    focusAreas: ["الخبرة الطبية", "المهارات التقنية"],
                    specialConsiderations: [],
                    recommendedInterviewers: ["مختص طبي", "مدير الموارد البشرية"]
                }
            };
        } catch (parseError) {
            console.error('Failed to parse interview questions:', parseError);
            console.log('Raw response:', questionsText);
            
            // Return personalized default questions based on available data
            const defaultQuestions = [
                {
                    id: 1,
                    category: "الخبرة الطبية العامة",
                    question: `حدثني عن خبرتك في مجال ${basicInfo.specialization || 'الطب'} وأهم المشاريع التي عملت عليها خلال ${basicInfo.experience || 'سنوات عملك'}؟`,
                    purpose: "تقييم عمق الخبرة العملية",
                    difficulty: "متوسط",
                    expectedAnswer: "أمثلة محددة من الخبرة العملية",
                    scoringCriteria: ["تفاصيل عملية محددة", "نتائج قابلة للقياس"],
                    relatedWeakness: null
                },
                {
                    id: 2,
                    category: "المهارات التقنية الطبية",
                    question: "ما هي التقنيات والأجهزة الطبية التي تجيد استخدامها؟ وكيف طورت هذه المهارات؟",
                    purpose: "تقييم المهارات التقنية الفعلية",
                    difficulty: "متوسط",
                    expectedAnswer: "قائمة محددة بالتقنيات والخبرة العملية",
                    scoringCriteria: ["معرفة تقنية عميقة", "خبرة عملية مثبتة"],
                    relatedWeakness: null
                },
                {
                    id: 3,
                    category: "التعامل مع التحديات",
                    question: "اذكر موقف صعب واجهته في العمل الطبي وكيف تعاملت معه؟ وما الذي تعلمته منه؟",
                    purpose: "تقييم القدرة على حل المشكلات",
                    difficulty: "متوسط",
                    expectedAnswer: "مثال عملي مع خطوات الحل والتعلم",
                    scoringCriteria: ["وضوح الموقف", "فعالية الحل", "التعلم من التجربة"],
                    relatedWeakness: null
                },
                {
                    id: 4,
                    category: "الأنظمة الصحية السعودية",
                    question: "ما مدى معرفتك بالأنظمة والقوانين الصحية في السعودية؟ وكيف ستطبقها في عملك؟",
                    purpose: "تقييم المعرفة بالبيئة التنظيمية المحلية",
                    difficulty: "متوسط",
                    expectedAnswer: "معرفة بالأنظمة المحلية وكيفية التطبيق",
                    scoringCriteria: ["معرفة بالقوانين", "فهم التطبيق العملي"],
                    relatedWeakness: null
                },
                {
                    id: 5,
                    category: "التواصل الطبي",
                    question: "كيف تتواصل مع المرضى خاصة في المواقف الحساسة؟ أعط مثالاً من تجربتك؟",
                    purpose: "تقييم مهارات التواصل مع المرضى",
                    difficulty: "متوسط",
                    expectedAnswer: "استراتيجيات تواصل فعالة مع أمثلة",
                    scoringCriteria: ["تعاطف مع المرضى", "وضوح التواصل", "مهارات التهدئة"],
                    relatedWeakness: null
                },
                {
                    id: 6,
                    category: "العمل الجماعي",
                    question: "صف تجربتك في العمل مع فريق طبي متعدد التخصصات؟ وما دورك في نجاح الفريق؟",
                    purpose: "تقييم القدرة على العمل الجماعي",
                    difficulty: "متوسط",
                    expectedAnswer: "أمثلة على العمل الجماعي الناجح",
                    scoringCriteria: ["روح الفريق", "التعاون الفعال", "القيادة عند الحاجة"],
                    relatedWeakness: null
                },
                {
                    id: 7,
                    category: "التطوير المهني",
                    question: "كيف تواكب التطورات الجديدة في مجال تخصصك؟ وما آخر تطوير حصلت عليه؟",
                    purpose: "تقييم الالتزام بالتطوير المستمر",
                    difficulty: "سهل",
                    expectedAnswer: "استراتيجيات التعلم المستمر مع أمثلة حديثة",
                    scoringCriteria: ["التزام بالتعلم", "مصادر متنوعة للتطوير", "تطبيق عملي للمعرفة الجديدة"],
                    relatedWeakness: null
                },
                {
                    id: 8,
                    category: "الدافعية للعمل",
                    question: "لماذا تريد العمل في شركة ميس للمشاريع الطبية تحديداً؟ وما الذي تتطلع لتحقيقه؟",
                    purpose: "تقييم الدافعية والالتزام",
                    difficulty: "سهل",
                    expectedAnswer: "أسباب محددة ومقنعة للاختيار",
                    scoringCriteria: ["معرفة بالشركة", "أهداف واضحة", "التزام طويل المدى"],
                    relatedWeakness: null
                }
            ];
            
            const sessionId = 'interview_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            
            await window.ezsite.apis.tableCreate(35306, {
                candidate_id: candidateId,
                session_id: sessionId,
                questions: JSON.stringify(defaultQuestions),
                responses: JSON.stringify([]),
                interview_score: 0,
                communication_score: 0,
                technical_response_score: 0,
                session_status: 'created',
                start_time: new Date().toISOString()
            });
            
            return {
                sessionId: sessionId,
                questions: defaultQuestions,
                metadata: {
                    estimatedDuration: "30-45 دقيقة",
                    difficultyLevel: "متوسط",
                    focusAreas: ["الخبرة الطبية", "المهارات التقنية", "التواصل"],
                    specialConsiderations: ["تركيز على الخبرة العملية"],
                    recommendedInterviewers: ["مختص طبي", "مدير الموارد البشرية"]
                }
            };
        }
    } catch (error) {
        console.error('Interview questions generation error:', error);
        throw new Error('فشل في إنشاء أسئلة المقابلة باستخدام الذكاء الاصطناعي. يرجى المحاولة مرة أخرى.');
    }
}