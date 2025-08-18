
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  Star, 
  TrendingUp, 
  Target, 
  Award, 
  FileText,
  Download,
  Share2,
  Zap,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  User,
  Briefcase,
  GraduationCap
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import RadarChart from '@/components/charts/RadarChart';

interface EvaluationStepProps {
  data: any;
  onComplete: (data: any) => void;
  persona: string;
  theme: string;
}

const EvaluationStep: React.FC<EvaluationStepProps> = ({ data, onComplete, persona }) => {
  const [evaluation, setEvaluation] = useState(null);
  const [isGenerating, setIsGenerating] = useState(!data.completed);
  const [progress, setProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState(0);
  const { toast } = useToast();

  const evaluationPhases = [
    'تجميع نتائج جميع المراحل...',
    'تحليل الأداء الشامل...',
    'حساب النتيجة النهائية...',
    'إعداد التوصيات المهنية...',
    'إنشاء مسار التطوير المقترح...',
    'إعداد التقرير النهائي...'
  ];

  useEffect(() => {
    if (isGenerating && !data.completed) {
      generateFinalEvaluation();
    }
  }, []);

  const generateFinalEvaluation = async () => {
    try {
      // Simulate evaluation phases
      for (let i = 0; i < evaluationPhases.length; i++) {
        setCurrentPhase(i);
        setProgress((i + 1) * 16.67);
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      // Generate final evaluation
      const finalEvaluation = await createFinalEvaluation();
      setEvaluation(finalEvaluation);
      setIsGenerating(false);
      setProgress(100);

      toast({
        title: "تم إكمال التقييم النهائي!",
        description: "تم إعداد تقريرك المهني الشامل",
        duration: 5000
      });

    } catch (error) {
      setIsGenerating(false);
      toast({
        title: "خطأ في التقييم",
        description: "حدث خطأ أثناء إعداد التقييم النهائي",
        variant: "destructive"
      });
    }
  };

  const createFinalEvaluation = async () => {
    // Mock comprehensive evaluation based on all steps
    return {
      overallScore: Math.floor(Math.random() * 15) + 85, // 85-99
      finalGrade: 'A',
      ranking: 'متميز',
      
      stepScores: {
        basicInfo: 95,
        cvAnalysis: data.analysisScore || 87,
        challenge: data.challengeScore || 85,
        interview: data.interviewScore || 90,
        overall: Math.floor(Math.random() * 15) + 85
      },

      competencyAssessment: {
        technical: Math.floor(Math.random() * 20) + 80,
        communication: Math.floor(Math.random() * 15) + 82,
        problemSolving: Math.floor(Math.random() * 18) + 85,
        teamwork: Math.floor(Math.random() * 10) + 88,
        leadership: Math.floor(Math.random() * 25) + 75,
        adaptability: Math.floor(Math.random() * 12) + 83
      },

      radarData: {
        labels: ['المهارات التقنية', 'التواصل', 'حل المشكلات', 'العمل الجماعي', 'القيادة', 'التكيف'],
        data: [85, 82, 88, 90, 78, 85]
      },

      strengths: [
        'أداء متميز في التحديات التقنية',
        'مهارات تواصل فعالة وواضحة',
        'قدرة قوية على حل المشكلات المعقدة',
        'التزام عالي بالجودة والتطوير المستمر',
        'شخصية إيجابية ومتعاونة'
      ],

      areasForImprovement: [
        {
          area: 'المهارات القيادية',
          priority: 'متوسط',
          suggestion: 'المشاركة في مشاريع قيادية والحصول على تدريب إداري',
          timeline: '6-12 شهر'
        },
        {
          area: 'المعرفة بأحدث التقنيات',
          priority: 'عالي',
          suggestion: 'أخذ دورات متخصصة والمشاركة في المجتمعات التقنية',
          timeline: '3-6 أشهر'
        },
        {
          area: 'الشبكات المهنية',
          priority: 'منخفض',
          suggestion: 'المشاركة في الفعاليات المهنية وبناء علاقات في المجال',
          timeline: 'مستمر'
        }
      ],

      careerPath: {
        currentLevel: getCareerLevel(persona),
        nextSteps: getCareerNextSteps(persona),
        timeline: '1-2 سنوات',
        requiredSkills: getRequiredSkills(persona)
      },

      jobRecommendations: [
        {
          title: getPersonaJobTitle(persona, 'senior'),
          company: 'شركة تقنية رائدة',
          match: '95%',
          salaryRange: '15,000 - 25,000 ريال',
          location: 'الرياض، السعودية'
        },
        {
          title: getPersonaJobTitle(persona, 'lead'),
          company: 'ستارت أب ناشئ',
          match: '88%',
          salaryRange: '18,000 - 28,000 ريال',
          location: 'دبي، الإمارات'
        },
        {
          title: getPersonaJobTitle(persona, 'consultant'),
          company: 'شركة استشارية',
          match: '82%',
          salaryRange: '20,000 - 30,000 ريال',
          location: 'عن بُعد'
        }
      ],

      certificationRecommendations: getCertificationRecommendations(persona),
      
      personalizedTips: getPersonalizedTips(persona),

      reportSummary: `تقييم شامل لمرشح ${persona === 'developer' ? 'مطور' : persona === 'designer' ? 'مصمم' : 'مسوق'} متميز يظهر إمكانات كبيرة للنمو والتطور في المجال المهني. الأداء العام ممتاز مع توصيات محددة للتطوير المستمر.`,

      nextStepsRecommendation: [
        'مراجعة التقرير المفصل والتوصيات',
        'البدء في تطبيق خطة التطوير المقترحة',
        'التواصل مع الشركات المقترحة',
        'المتابعة الدورية للتقدم المهني'
      ]
    };
  };

  const getCareerLevel = (persona: string) => {
    const levels = {
      developer: 'مطور متقدم',
      designer: 'مصمم أول',
      marketer: 'أخصائي تسويق أول'
    };
    return levels[persona] || 'متخصص أول';
  };

  const getCareerNextSteps = (persona: string) => {
    const steps = {
      developer: ['قائد فريق تطوير', 'مهندس معماري', 'مدير تقني'],
      designer: ['قائد فريق تصميم', 'مدير إبداعي', 'مستشار تصميم'],
      marketer: ['مدير تسويق', 'استراتيجي تسويق', 'مدير عام التسويق']
    };
    return steps[persona] || ['قائد فريق', 'مدير', 'مستشار'];
  };

  const getRequiredSkills = (persona: string) => {
    const skills = {
      developer: ['قيادة الفرق', 'هندسة البرمجيات', 'DevOps', 'الذكاء الاصطناعي'],
      designer: ['استراتيجية التصميم', 'أبحاث المستخدم', 'إدارة المنتجات', 'العلامة التجارية'],
      marketer: ['التحليل المتقدم', 'التسويق الرقمي', 'إدارة العلاقات', 'الذكاء التجاري']
    };
    return skills[persona] || ['مهارات قيادية', 'تحليل البيانات', 'إدارة المشاريع'];
  };

  const getPersonaJobTitle = (persona: string, level: string) => {
    const titles = {
      developer: {
        senior: 'مطور برمجيات أول',
        lead: 'قائد فريق التطوير',
        consultant: 'مستشار تقني'
      },
      designer: {
        senior: 'مصمم أول',
        lead: 'قائد فريق التصميم',
        consultant: 'مستشار تصميم'
      },
      marketer: {
        senior: 'أخصائي تسويق أول',
        lead: 'مدير تسويق',
        consultant: 'مستشار تسويقي'
      }
    };
    return titles[persona]?.[level] || 'متخصص أول';
  };

  const getCertificationRecommendations = (persona: string) => {
    const certs = {
      developer: [
        { name: 'AWS Solutions Architect', priority: 'عالي', duration: '3-6 أشهر' },
        { name: 'Google Cloud Professional', priority: 'متوسط', duration: '2-4 أشهر' },
        { name: 'Kubernetes Administrator', priority: 'متوسط', duration: '2-3 أشهر' }
      ],
      designer: [
        { name: 'Google UX Design Certificate', priority: 'عالي', duration: '4-6 أشهر' },
        { name: 'Adobe Certified Expert', priority: 'متوسط', duration: '2-3 أشهر' },
        { name: 'Design Leadership Certificate', priority: 'منخفض', duration: '1-2 شهر' }
      ],
      marketer: [
        { name: 'Google Ads Certification', priority: 'عالي', duration: '1-2 شهر' },
        { name: 'HubSpot Content Marketing', priority: 'متوسط', duration: '2-3 أشهر' },
        { name: 'Facebook Blueprint', priority: 'عالي', duration: '2-4 أشهر' }
      ]
    };
    return certs[persona] || [];
  };

  const getPersonalizedTips = (persona: string) => {
    const tips = {
      developer: [
        'احرص على مواكبة أحدث التقنيات والأدوات',
        'ساهم في مشاريع مفتوحة المصدر لبناء سمعتك',
        'طور مهارات التواصل والعرض التقديمي',
        'تعلم أساسيات إدارة المنتجات'
      ],
      designer: [
        'اعتمد على البحث والبيانات في قراراتك التصميمية',
        'تطوير مهارات الـ Prototyping والـ User Testing',
        'تعلم أساسيات التطوير لتحسين التعاون مع المطورين',
        'اهتم ببناء محفظة أعمال قوية ومتنوعة'
      ],
      marketer: [
        'اتقن استخدام أدوات التحليل والبيانات',
        'طور مهارات السرد والمحتوى الإبداعي',
        'تعلم أساسيات التصميم لتحسين الحملات',
        'اهتم بفهم رحلة العميل بشكل عميق'
      ]
    };
    return tips[persona] || [];
  };

  const getPersonaColor = () => {
    switch (persona) {
      case 'designer': return 'from-pink-500 to-purple-500';
      case 'marketer': return 'from-green-500 to-blue-500';
      default: return 'from-blue-500 to-cyan-500';
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'text-green-600 bg-green-100';
      case 'B': return 'text-blue-600 bg-blue-100';
      case 'C': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-red-600 bg-red-100';
    }
  };

  const handleComplete = () => {
    const finalData = {
      ...data,
      evaluation,
      completed: true,
      completedAt: new Date().toISOString()
    };
    
    onComplete(finalData);
  };

  const handleDownloadReport = () => {
    toast({
      title: "تحميل التقرير",
      description: "سيتم إرسال التقرير المفصل عبر البريد الإلكتروني",
      duration: 5000
    });
  };

  const handleShareResults = () => {
    navigator.clipboard.writeText(`حصلت على تقييم ${evaluation?.ranking} بنسبة ${evaluation?.overallScore}% في بوابة المرشحين!`);
    toast({
      title: "تم نسخ الرابط",
      description: "يمكنك مشاركة نتائجك الآن",
      duration: 3000
    });
  };

  if (isGenerating) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="text-center mb-8">
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              scale: { duration: 1.5, repeat: Infinity }
            }}
            className="inline-block mb-4"
          >
            <Trophy className="w-16 h-16 text-yellow-500" />
          </motion.div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            جاري إعداد التقييم النهائي
          </h3>
          <p className="text-gray-600">
            يتم تحليل جميع النتائج وإعداد تقريرك الشامل
          </p>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Zap className="w-6 h-6 text-purple-500" />
            </motion.div>
            <span className="font-semibold text-gray-800">
              {evaluationPhases[currentPhase]}
            </span>
          </div>
          
          <Progress value={progress} className="w-full h-3 mb-3" />
          <div className="flex justify-between text-sm text-gray-600">
            <span>{Math.round(progress)}%</span>
            <span>المرحلة {currentPhase + 1} من {evaluationPhases.length}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['تحليل البيانات', 'حساب النتائج', 'إعداد التوصيات'].map((item, index) => (
            <motion.div
              key={item}
              className="bg-white p-4 rounded-lg shadow border"
              animate={{
                scale: currentPhase >= index ? [1, 1.05, 1] : 1,
                backgroundColor: currentPhase >= index ? ["#ffffff", "#f3f4f6", "#ffffff"] : "#ffffff"
              }}
              transition={{
                duration: 1,
                repeat: currentPhase >= index ? Infinity : 0,
                repeatType: "reverse"
              }}
            >
              <div className="text-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  {currentPhase > index ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                  )}
                </div>
                <p className="font-medium text-gray-700">{item}</p>
                {currentPhase > index && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-green-600 text-sm mt-1"
                  >
                    ✓ اكتمل
                  </motion.p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  }

  if (!evaluation) {
    return <div>حدث خطأ في تحميل التقييم</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 10 }}
          className="inline-block mb-4"
        >
          <div className="relative">
            <Trophy className="w-20 h-20 text-yellow-500" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute -top-2 -right-2"
            >
              <Star className="w-8 h-8 text-yellow-400" />
            </motion.div>
          </div>
        </motion.div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          التقييم النهائي مكتمل!
        </h3>
        <p className="text-gray-600 text-lg">
          مبروك! إليك نتائجك الشاملة وتوصياتك المهنية
        </p>
      </div>

      {/* Overall Score */}
      <Card className="p-8 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 150 }}
            className="relative inline-block mb-6"
          >
            <div className={`w-32 h-32 rounded-full bg-gradient-to-r ${getPersonaColor()} flex items-center justify-center mx-auto shadow-lg`}>
              <span className="text-4xl font-bold text-white">
                {evaluation.overallScore}
              </span>
            </div>
            <div className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full text-sm font-bold ${getGradeColor(evaluation.finalGrade)}`}>
              {evaluation.finalGrade}
            </div>
          </motion.div>
          
          <h4 className="text-xl font-bold text-gray-800 mb-2">النتيجة الإجمالية</h4>
          <Badge className="bg-green-100 text-green-800 text-lg px-4 py-1">
            {evaluation.ranking}
          </Badge>
        </div>
      </Card>

      {/* Step Breakdown */}
      <Card className="p-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-6 text-center">تفصيل النتائج</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(evaluation.stepScores).map(([step, score], index) => {
            const stepNames = {
              basicInfo: 'المعلومات الأساسية',
              cvAnalysis: 'تحليل السيرة الذاتية', 
              challenge: 'التحدي المهني',
              interview: 'المقابلة التفاعلية',
              overall: 'التقييم الشامل'
            };
            
            const stepIcons = {
              basicInfo: <User className="w-5 h-5" />,
              cvAnalysis: <FileText className="w-5 h-5" />,
              challenge: <Target className="w-5 h-5" />,
              interview: <Briefcase className="w-5 h-5" />,
              overall: <Award className="w-5 h-5" />
            };

            return (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-4 bg-white rounded-lg shadow border"
              >
                <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${getPersonaColor()} flex items-center justify-center text-white mx-auto mb-2`}>
                  {stepIcons[step]}
                </div>
                <div className="text-2xl font-bold text-gray-800">{score}</div>
                <p className="text-sm text-gray-600">{stepNames[step]}</p>
              </motion.div>
            );
          })}
        </div>
      </Card>

      {/* Competency Assessment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 text-center">
            تقييم الكفاءات
          </h4>
          <RadarChart data={evaluation.radarData} />
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">نقاط القوة</h4>
          <div className="space-y-3">
            {evaluation.strengths.map((strength: string, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3"
              >
                <Star className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                <span className="text-gray-700">{strength}</span>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>

      {/* Areas for Improvement */}
      <Card className="p-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">مجالات التطوير</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {evaluation.areasForImprovement.map((area: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-blue-50 p-4 rounded-lg border border-blue-200"
            >
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-4 h-4 text-blue-600" />
                <span className="font-semibold text-blue-800">{area.area}</span>
                <Badge variant="outline" className={`text-xs ${
                  area.priority === 'عالي' ? 'border-red-300 text-red-700' :
                  area.priority === 'متوسط' ? 'border-yellow-300 text-yellow-700' :
                  'border-green-300 text-green-700'
                }`}>
                  {area.priority}
                </Badge>
              </div>
              <p className="text-sm text-blue-700 mb-2">{area.suggestion}</p>
              <div className="flex items-center gap-2 text-xs text-blue-600">
                <Clock className="w-3 h-3" />
                <span>{area.timeline}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Job Recommendations */}
      <Card className="p-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">الوظائف المقترحة</h4>
        <div className="space-y-4">
          {evaluation.jobRecommendations.map((job: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border"
            >
              <div className="flex-1">
                <h5 className="font-semibold text-gray-800">{job.title}</h5>
                <p className="text-sm text-gray-600">{job.company} • {job.location}</p>
                <p className="text-sm text-blue-600 font-medium">{job.salaryRange}</p>
              </div>
              <Badge className={`${
                parseInt(job.match) >= 90 ? 'bg-green-100 text-green-800' :
                parseInt(job.match) >= 80 ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {job.match} مطابقة
              </Badge>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Button
          onClick={handleDownloadReport}
          variant="outline"
          size="lg"
          className="px-8"
        >
          <Download className="w-5 h-5 ml-2" />
          تحميل التقرير المفصل
        </Button>
        
        <Button
          onClick={handleShareResults}
          variant="outline"
          size="lg"
          className="px-8"
        >
          <Share2 className="w-5 h-5 ml-2" />
          مشاركة النتائج
        </Button>
        
        <Button
          onClick={handleComplete}
          size="lg"
          className={`px-12 bg-gradient-to-r ${getPersonaColor()}`}
        >
          <Trophy className="w-5 h-5 ml-2" />
          إكمال التقديم
        </Button>
      </div>

      {/* Summary */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50">
        <h4 className="text-lg font-semibold text-gray-800 mb-3">ملخص التقييم</h4>
        <p className="text-gray-700 leading-relaxed mb-4">{evaluation.reportSummary}</p>
        
        <div className="bg-white p-4 rounded-lg">
          <h5 className="font-semibold text-gray-800 mb-2">الخطوات التالية المقترحة:</h5>
          <ul className="space-y-1">
            {evaluation.nextStepsRecommendation.map((step: string, index: number) => (
              <li key={index} className="flex items-center gap-2 text-gray-700 text-sm">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      </Card>
    </motion.div>
  );
};

export default EvaluationStep;
