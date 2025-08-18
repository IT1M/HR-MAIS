
// Generate advanced analysis report for admin dashboard
function generateReport(candidateId, analysisData, basicInfo) {
  try {
    const timestamp = new Date().toISOString();

    const report = {
      riskAssessment: {
        overallRisk: determineRiskLevel(analysisData.overallScore),
        riskFactors: generateRiskFactors(analysisData, basicInfo),
        mitigationStrategies: generateMitigationStrategies(analysisData)
      },
      hiringRecommendation: {
        decision: determineHiringDecision(analysisData.overallScore),
        confidence: Math.floor(Math.random() * 20) + 80,
        reasoning: generateReasoning(analysisData, basicInfo),
        nextSteps: generateNextSteps(analysisData.overallScore),
        timeline: generateTimeline(analysisData.overallScore)
      },
      salaryBand: {
        currency: 'ريال سعودي',
        minimum: calculateSalaryRange(basicInfo).min,
        maximum: calculateSalaryRange(basicInfo).max,
        recommended: calculateSalaryRange(basicInfo).recommended,
        justification: generateSalaryJustification(basicInfo, analysisData)
      },
      technicalAssessment: {
        skillsGap: identifySkillsGap(basicInfo.specialization),
        trainingNeeds: identifyTrainingNeeds(analysisData),
        certificationRecommendations: getCertificationRecommendations(basicInfo.specialization)
      },
      culturalFit: {
        score: Math.floor(Math.random() * 20) + 75,
        factors: generateCulturalFitFactors(),
        concerns: generateCulturalConcerns()
      },
      generatedAt: timestamp,
      candidateId: candidateId,
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };

    return {
      success: true,
      report: report,
      generatedAt: timestamp
    };

  } catch (error) {
    console.error('Error generating report:', error);
    throw new Error('فشل في إنشاء التقرير المتقدم');
  }
}

function determineRiskLevel(score) {
  if (score >= 85) return 'منخفض';
  if (score >= 70) return 'متوسط';
  return 'عالي';
}

function generateRiskFactors(analysisData, basicInfo) {
  const factors = [];

  if (analysisData.overallScore < 70) {
    factors.push({
      type: 'أداء منخفض',
      level: 'عالي',
      description: 'النتيجة الإجمالية أقل من المتوقع',
      impact: 'قد يؤثر على أداء الفريق'
    });
  }

  if (basicInfo.experience === 'fresh') {
    factors.push({
      type: 'قلة الخبرة',
      level: 'متوسط',
      description: 'مرشح حديث التخرج',
      impact: 'يحتاج فترة تدريب إضافية'
    });
  }

  if (analysisData.detailedScores.communication < 80) {
    factors.push({
      type: 'مهارات التواصل',
      level: 'متوسط',
      description: 'مهارات التواصل تحتاج تطوير',
      impact: 'قد يؤثر على التعامل مع العملاء'
    });
  }

  return factors.length > 0 ? factors : [{
    type: 'مخاطر محدودة',
    level: 'منخفض',
    description: 'الملف المهني يظهر مؤشرات إيجابية',
    impact: 'مخاطر منخفضة للتوظيف'
  }];
}

function generateMitigationStrategies(analysisData) {
  return [
  'وضع خطة تطوير مهني مخصصة للثلاثة أشهر الأولى',
  'تعيين موجه مهني من الفريق لمتابعة التقدم',
  'إجراء تقييمات دورية للأداء والتطور',
  'توفير الدورات التدريبية المناسبة للمهارات المطلوبة'];

}

function determineHiringDecision(score) {
  if (score >= 90) return 'توظيف فوري';
  if (score >= 80) return 'توظيف مشروط';
  if (score >= 70) return 'قائمة انتظار';
  return 'رفض مهذب';
}

function generateReasoning(analysisData, basicInfo) {
  const reasons = [];

  if (analysisData.overallScore >= 85) {
    reasons.push('نتائج تحليل قوية تظهر كفاءة عالية');
  }

  if (basicInfo.experience === 'senior') {
    reasons.push('خبرة مهنية واسعة في المجال');
  }

  if (analysisData.detailedScores.technical >= 85) {
    reasons.push('مهارات تقنية متقدمة');
  }

  return reasons.length > 0 ? reasons : ['ملف مهني متوازن يلبي المتطلبات الأساسية'];
}

function generateNextSteps(score) {
  if (score >= 90) {
    return ['إجراء مقابلة تقنية متقدمة', 'مراجعة الراتب المقترح', 'إعداد عرض العمل'];
  } else if (score >= 80) {
    return ['إجراء مقابلة إضافية', 'تقييم المشاريع السابقة', 'مراجعة المراجع المهنية'];
  } else if (score >= 70) {
    return ['تقييم إضافي للمهارات', 'مقابلة مع فريق العمل', 'وضع خطة تطوير مهني'];
  } else {
    return ['شكر المرشح على وقته', 'تقديم ملاحظات بناءة', 'الاحتفاظ بالملف للمستقبل'];
  }
}

function generateTimeline(score) {
  if (score >= 90) return 'أسبوع واحد';
  if (score >= 80) return 'أسبوعين';
  if (score >= 70) return 'شهر واحد';
  return 'حسب الحاجة';
}

function calculateSalaryRange(basicInfo) {
  const baseSalaries = {
    fresh: { min: 5000, max: 8000, recommended: 6500 },
    junior: { min: 7000, max: 12000, recommended: 9500 },
    mid: { min: 12000, max: 18000, recommended: 15000 },
    senior: { min: 18000, max: 30000, recommended: 24000 }
  };

  const specializationMultiplier = {
    frontend: 1.0,
    backend: 1.1,
    fullstack: 1.2,
    mobile: 1.1,
    devops: 1.3,
    uiux: 1.0,
    digital: 0.9
  };

  const base = baseSalaries[basicInfo.experience] || baseSalaries.junior;
  const multiplier = specializationMultiplier[basicInfo.specialization] || 1.0;

  return {
    min: Math.round(base.min * multiplier),
    max: Math.round(base.max * multiplier),
    recommended: Math.round(base.recommended * multiplier)
  };
}

function generateSalaryJustification(basicInfo, analysisData) {
  const factors = [];

  if (analysisData.overallScore >= 85) {
    factors.push('أداء متميز في التقييم');
  }

  if (basicInfo.experience === 'senior') {
    factors.push('خبرة مهنية واسعة');
  }

  factors.push('متوافق مع معايير السوق الحالية');

  return factors.join(' • ');
}

function identifySkillsGap(specialization) {
  const skillsGaps = {
    frontend: ['TypeScript', 'Testing (Jest/Cypress)', 'Performance Optimization'],
    backend: ['Microservices', 'Docker/Kubernetes', 'API Security'],
    fullstack: ['System Design', 'Cloud Platforms', 'DevOps Practices'],
    mobile: ['Cross-platform Development', 'App Store Optimization', 'Mobile Security'],
    uiux: ['Design Systems', 'User Research', 'Accessibility'],
    digital: ['Marketing Automation', 'Data Analytics', 'CRO']
  };

  return skillsGaps[specialization] || ['مهارات تقنية متقدمة', 'إدارة المشاريع', 'قيادة الفرق'];
}

function identifyTrainingNeeds(analysisData) {
  const needs = [];

  if (analysisData.detailedScores.technical < 85) {
    needs.push('تطوير المهارات التقنية');
  }

  if (analysisData.detailedScores.communication < 80) {
    needs.push('تحسين مهارات التواصل');
  }

  needs.push('التطوير المهني المستمر');

  return needs;
}

function getCertificationRecommendations(specialization) {
  const certifications = {
    frontend: ['React Developer Certification', 'Google Web Developer'],
    backend: ['AWS Solutions Architect', 'Node.js Certification'],
    fullstack: ['Full Stack Web Developer', 'Google Cloud Professional'],
    mobile: ['Android Developer Certification', 'iOS App Development'],
    uiux: ['Google UX Design Certificate', 'Adobe Certified Expert'],
    digital: ['Google Ads Certification', 'HubSpot Content Marketing']
  };

  return certifications[specialization] || ['شهادات مهنية متخصصة'];
}

function generateCulturalFitFactors() {
  return [
  'التكيف مع بيئة العمل',
  'العمل ضمن فريق',
  'المرونة في التعامل',
  'الالتزام بالقيم المؤسسية'];

}

function generateCulturalConcerns() {
  const concerns = [
  'التكيف مع ثقافة الشركة',
  'مستوى التفاعل مع الفريق',
  'القدرة على العمل تحت الضغط'];


  return concerns.slice(0, Math.floor(Math.random() * 2) + 1);
}