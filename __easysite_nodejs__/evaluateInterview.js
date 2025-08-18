// Evaluate interview responses using Gemini API for medical positions
async function evaluateInterview(candidateId, sessionId, responses = [], cvAnalysis = {}, basicInfo = {}) {
    try {
        const { GoogleGenerativeAI } = require('@google/generative-ai');
        
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'AIzaSyBvJLY9HrYaZ9vR3MhOTLV1234567890');
        const model = genAI.getGenerativeAI({ 
            model: "gemini-1.5-flash",
            generationConfig: {
                temperature: 0.2, // Lower temperature for more consistent evaluation
                maxOutputTokens: 4096,
            }
        });

        // Format responses for analysis
        const responsesText = responses.map((resp, index) => 
            `السؤال ${index + 1}: ${resp.answer || 'لم يتم الإجابة'}`
        ).join('\n\n');

        const prompt = `
تقييم شامل ومفصل لإجابات المقابلة الشخصية - شركة ميس للمشاريع الطبية

معلومات المرشح:
- الاسم: ${basicInfo.fullName || 'غير محدد'}
- التخصص: ${basicInfo.specialization || 'غير محدد'}
- الخبرة: ${basicInfo.experience || 'غير محدد'} سنة

نتائج تحليل السيرة الذاتية:
- النتيجة العامة: ${cvAnalysis.overallScore || 0}/100
- الخبرة الطبية: ${cvAnalysis.detailedScores?.medicalExperience || 0}/100
- المهارات التقنية: ${cvAnalysis.detailedScores?.technicalSkills || 0}/100
- مهارات التواصل: ${cvAnalysis.detailedScores?.communicationSkills || 0}/100
- توصية التوظيف من السيرة: ${cvAnalysis.hiringRecommendation?.decision || 'غير محددة'}

إجابات المرشح على أسئلة المقابلة:
${responsesText}

كخبير في تقييم المقابلات الطبية في السعودية، قم بتقييم هذه الإجابات بدقة عالية وصدق تام.

معايير التقييم:
1. جودة المحتوى الطبي والتقني (0-100)
2. وضوح التواصل والتعبير (0-100) 
3. عمق الخبرة العملية المظهرة (0-100)
4. القدرة على حل المشكلات (0-100)
5. الملاءمة للثقافة السعودية (0-100)
6. الدافعية والالتزام (0-100)
7. الأمانة والصدق في الإجابات (0-100)

التقييم يجب أن يكون:
- صادق ومباشر بدون مجاملات
- يكشف عن نقاط القوة والضعف الحقيقية
- يقيم مدى تطابق الإجابات مع الخبرة المذكورة
- يحدد المخاطر في حال التوظيف
- يقدم توصية واضحة ومبررة

إرجع النتيجة في JSON فقط:
{
    "overallScore": رقم من 0-100,
    "detailedScores": {
        "medicalTechnicalContent": رقم من 0-100,
        "communicationClarity": رقم من 0-100,
        "practicalExperienceDepth": رقم من 0-100,
        "problemSolvingAbility": رقم من 0-100,
        "culturalFit": رقم من 0-100,
        "motivationCommitment": رقم من 0-100,
        "honestyCredibility": رقم من 0-100
    },
    "strengthsObserved": [
        {
            "area": "مجال القوة",
            "description": "وصف مفصل لنقطة القوة",
            "evidence": "الدليل من الإجابات",
            "score": رقم من 0-100
        }
    ],
    "weaknessesIdentified": [
        {
            "area": "مجال الضعف",
            "description": "وصف مفصل لنقطة الضعف",
            "evidence": "الدليل من الإجابات",
            "impact": "تأثير هذا الضعف على الأداء",
            "severity": "منخفض/متوسط/عالي"
        }
    ],
    "redFlags": [
        {
            "type": "نوع التحذير",
            "description": "وصف التحذير",
            "evidence": "الدليل من الإجابات",
            "riskLevel": "منخفض/متوسط/عالي"
        }
    ],
    "consistencyAnalysis": {
        "cvVsInterview": "مدى تطابق المقابلة مع السيرة الذاتية",
        "internalConsistency": "مدى تماسك الإجابات مع بعضها",
        "credibilityScore": رقم من 0-100,
        "concerningDiscrepancies": [
            "تناقض مثير للقلق إن وجد"
        ]
    },
    "interviewPerformance": {
        "responseQuality": "ممتاز/جيد/مقبول/ضعيف",
        "preparedness": "مدى استعداد المرشح للمقابلة",
        "professionalismLevel": "مستوى الاحترافية",
        "adaptabilityShown": "مدى إظهار القدرة على التكيف"
    },
    "finalRecommendation": {
        "decision": "توظيف فوري/توظيف مشروط/مقابلة إضافية/رفض مهذب",
        "confidence": رقم من 0-100,
        "primaryReasons": [
            "السبب الرئيسي للتوصية"
        ],
        "conditions": [
            "شروط التوظيف إن وجدت"
        ],
        "alternativeRole": "اقتراح دور آخر إن مناسب",
        "timeline": "الإطار الزمني للقرار"
    },
    "improvementAreas": [
        {
            "area": "مجال التحسين",
            "priority": "عالي/متوسط/منخفض",
            "suggestion": "اقتراح محدد للتحسين",
            "timeline": "الوقت المطلوب للتحسين"
        }
    ],
    "overallAssessment": "تقييم شامل وصادق عن أداء المرشح في المقابلة ومدى ملاءمته للعمل في شركة ميس للمشاريع الطبية"
}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let evaluationText = response.text();
        
        // Clean JSON response
        evaluationText = evaluationText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        
        try {
            const evaluation = JSON.parse(evaluationText);
            
            // Update interview session in database
            await window.ezsite.apis.tableUpdate(35306, {
                ID: sessionId, // Assuming sessionId corresponds to the database ID
                responses: JSON.stringify(responses),
                interview_score: evaluation.overallScore || 0,
                communication_score: evaluation.detailedScores?.communicationClarity || 0,
                technical_response_score: evaluation.detailedScores?.medicalTechnicalContent || 0,
                session_status: 'completed',
                end_time: new Date().toISOString()
            });
            
            return evaluation;
        } catch (parseError) {
            console.error('Failed to parse interview evaluation:', parseError);
            console.log('Raw response:', evaluationText);
            
            // Calculate basic scores from responses
            const responseQuality = responses.length > 0 ? Math.min(responses.length * 10, 100) : 20;
            const avgResponseLength = responses.reduce((sum, resp) => sum + (resp.answer?.length || 0), 0) / Math.max(responses.length, 1);
            const qualityScore = Math.min(avgResponseLength / 10, 100);
            
            const defaultEvaluation = {
                overallScore: Math.round((responseQuality + qualityScore) / 2),
                detailedScores: {
                    medicalTechnicalContent: Math.round(qualityScore * 0.8),
                    communicationClarity: Math.round(qualityScore * 0.9),
                    practicalExperienceDepth: Math.round(responseQuality * 0.7),
                    problemSolvingAbility: 50,
                    culturalFit: 60,
                    motivationCommitment: 55,
                    honestyCredibility: 70
                },
                strengthsObserved: [
                    {
                        area: "المشاركة في المقابلة",
                        description: `أجاب المرشح على ${responses.length} سؤال`,
                        evidence: "حضور واستكمال المقابلة",
                        score: responseQuality
                    }
                ],
                weaknessesIdentified: [
                    {
                        area: "تقييم شامل",
                        description: "لم يتم التمكن من تقييم الإجابات بشكل كامل",
                        evidence: "صعوبة في تحليل المحتوى",
                        impact: "قرار توظيف غير مكتمل",
                        severity: "متوسط"
                    }
                ],
                redFlags: [],
                consistencyAnalysis: {
                    cvVsInterview: "يحتاج مراجعة إضافية",
                    internalConsistency: "غير محدد",
                    credibilityScore: 60,
                    concerningDiscrepancies: []
                },
                interviewPerformance: {
                    responseQuality: responses.length > 6 ? "مقبول" : "ضعيف",
                    preparedness: "يحتاج تقييم إضافي",
                    professionalismLevel: "متوسط",
                    adaptabilityShown: "غير محدد"
                },
                finalRecommendation: {
                    decision: "مقابلة إضافية",
                    confidence: 40,
                    primaryReasons: [
                        "تقييم غير مكتمل للإجابات",
                        "حاجة لمراجعة إضافية مع مختص"
                    ],
                    conditions: ["مقابلة وجها لوجه", "مراجعة من مختص طبي"],
                    alternativeRole: null,
                    timeline: "خلال أسبوع"
                },
                improvementAreas: [
                    {
                        area: "التحضير للمقابلات",
                        priority: "متوسط",
                        suggestion: "التدرب على إجابات أكثر تفصيلاً وعملية",
                        timeline: "قبل المقابلة القادمة"
                    }
                ],
                overallAssessment: `تم إجراء مقابلة نصية مع المرشح وحصل على ${responses.length} إجابة. يحتاج المرشح لمقابلة إضافية مع فريق طبي متخصص لتقييم أكثر دقة. الانطباع الأولي يشير لحاجة المرشح لمزيد من التحضير والتطوير قبل اتخاذ قرار التوظيف النهائي.`
            };
            
            // Update interview session with basic evaluation
            await window.ezsite.apis.tableUpdate(35306, {
                ID: sessionId,
                responses: JSON.stringify(responses),
                interview_score: defaultEvaluation.overallScore,
                communication_score: defaultEvaluation.detailedScores.communicationClarity,
                technical_response_score: defaultEvaluation.detailedScores.medicalTechnicalContent,
                session_status: 'completed',
                end_time: new Date().toISOString()
            });
            
            return defaultEvaluation;
        }
    } catch (error) {
        console.error('Interview evaluation error:', error);
        throw new Error('فشل في تقييم المقابلة باستخدام الذكاء الاصطناعي. يرجى المحاولة مرة أخرى.');
    }
}