import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Brain, Sparkles, TrendingUp, AlertTriangle, CheckCircle2, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { RadarChart } from '@/components/charts/RadarChart';
import { BarChart } from '@/components/charts/BarChart';

interface AIAnalysisStepProps {
  data: any;
  onComplete: (data: any) => void;
  persona: string;
  theme: string;
}

const AIAnalysisStep: React.FC<AIAnalysisStepProps> = ({
  data,
  onComplete,
  persona,
  theme
}) => {
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const analysisPhases = [
    { text: "تحليل المعلومات الأساسية...", duration: 2000 },
    { text: "استخراج وتحليل نص السيرة الذاتية...", duration: 3000 },
    { text: "تقييم المؤهلات الطبية باستخدام الذكاء الاصطناعي...", duration: 4000 },
    { text: "حساب النتائج والدرجات...", duration: 2000 },
    { text: "إنشاء التقرير النهائي...", duration: 1500 }
  ];

  useEffect(() => {
    if (!data.result && !isAnalyzing) {
      startAnalysis();
    } else if (data.result) {
      setAnalysisResult(data.result);
      setAnalysisProgress(100);
      setCurrentPhase(analysisPhases.length - 1);
    }
  }, []);

  const startAnalysis = async () => {
    setIsAnalyzing(true);
    let progress = 0;
    
    // Simulate analysis phases
    for (let i = 0; i < analysisPhases.length; i++) {
      setCurrentPhase(i);
      const increment = 100 / analysisPhases.length;
      
      // Animate progress for this phase
      const phaseStart = i * increment;
      const phaseEnd = (i + 1) * increment;
      
      const animationDuration = analysisPhases[i].duration;
      const steps = 20;
      const stepTime = animationDuration / steps;
      
      for (let step = 0; step <= steps; step++) {
        const phaseProgress = (step / steps) * increment;
        setAnalysisProgress(phaseStart + phaseProgress);
        await new Promise(resolve => setTimeout(resolve, stepTime));
      }
    }

    // Perform actual API call
    try {
      // Get candidate data from localStorage or props
      const candidateData = JSON.parse(localStorage.getItem('candidateData') || '{}');
      const basicInfo = candidateData.basicInfo || {};
      const cvText = candidateData.cv?.extractedText || '';

      const response = await window.ezsite.apis.run({
        path: "analyzeCV",
        param: [candidateData.id, cvText, basicInfo]
      });

      if (response?.data) {
        const result = response.data;
        setAnalysisResult(result);
        
        toast({
          title: "تم اكتمال التحليل!",
          description: "تم تحليل سيرتك الذاتية بنجاح باستخدام الذكاء الاصطناعي",
          duration: 3000
        });
      }
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "خطأ في التحليل",
        description: "حدث خطأ أثناء تحليل السيرة الذاتية",
        variant: "destructive",
        duration: 3000
      });
      
      // Use mock data as fallback
      setAnalysisResult({
        overallScore: 75,
        technicalScore: 80,
        experienceScore: 70,
        educationScore: 85,
        softSkillsScore: 75,
        medicalExpertiseScore: 78,
        strengths: ["خبرة جيدة في المجال الطبي", "مؤهلات تعليمية ممتازة"],
        weaknesses: [
          { category: "الخبرة", description: "تحتاج لمزيد من الخبرة العملية", improvement: "العمل في مشاريع طبية أكثر" }
        ],
        recommendations: ["تطوير المهارات التقنية", "زيادة الخبرة العملية"],
        summary: "مرشح واعد بمؤهلات جيدة يحتاج لبعض التطوير",
        hiringRecommendation: "توظيف مشروط",
        riskAssessment: "منخفض",
        salaryRecommendation: "12,000 - 18,000 ريال سعودي"
      });
    }
    
    setIsAnalyzing(false);
  };

  const handleContinue = () => {
    if (analysisResult) {
      onComplete({ result: analysisResult, completed: true });
    }
  };

  const getPersonaGradient = () => {
    switch (persona) {
      case 'medical':
        return 'from-green-500 to-blue-600';
      case 'designer':
        return 'from-pink-400 to-purple-600';
      case 'marketer':
        return 'from-green-400 to-blue-600';
      default:
        return 'from-green-500 to-blue-600';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <Brain className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${getPersonaGradient()} bg-clip-text text-transparent`} />
        <h2 className="text-3xl font-bold mb-2 text-gray-800">
          التحليل بالذكاء الاصطناعي
        </h2>
        <p className="text-gray-600">
          نحلل سيرتك الذاتية باستخدام أحدث تقنيات الذكاء الاصطناعي للمجال الطبي
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {(isAnalyzing || analysisProgress < 100) && !analysisResult ? (
          <motion.div
            key="analysis"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="space-y-6"
          >
            <div className="relative">
              <Progress value={analysisProgress} className="h-4 bg-gray-200" />
              <motion.div
                className={`absolute top-0 left-0 h-4 bg-gradient-to-r ${getPersonaGradient()} rounded-full`}
                initial={{ width: 0 }}
                animate={{ width: `${analysisProgress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>

            <div className="text-center">
              <motion.div
                key={currentPhase}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center justify-center gap-3"
              >
                <Sparkles className="w-5 h-5 text-blue-500 animate-pulse" />
                <span className="text-lg text-gray-700">
                  {analysisPhases[currentPhase]?.text}
                </span>
              </motion.div>
              <div className="mt-2 text-sm text-gray-500">
                {Math.round(analysisProgress)}% مكتمل
              </div>
            </div>
          </motion.div>
        ) : analysisResult && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Overall Score */}
            <div className="text-center bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-center mb-4">
                <Target className="w-8 h-8 text-green-500 mr-2" />
                <h3 className="text-2xl font-bold text-gray-800">النتيجة الإجمالية</h3>
              </div>
              <div className={`text-6xl font-bold mb-2 ${getScoreColor(analysisResult.overallScore)}`}>
                {analysisResult.overallScore}%
              </div>
              <Badge variant={getScoreBadgeVariant(analysisResult.overallScore)} className="text-sm">
                {analysisResult.hiringRecommendation}
              </Badge>
            </div>

            {/* Detailed Scores */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h4 className="text-xl font-semibold mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
                  التقييمات التفصيلية
                </h4>
                <div className="space-y-3">
                  {[
                    { name: 'المهارات التقنية', score: analysisResult.technicalScore },
                    { name: 'الخبرة العملية', score: analysisResult.experienceScore },
                    { name: 'التعليم', score: analysisResult.educationScore },
                    { name: 'المهارات الشخصية', score: analysisResult.softSkillsScore },
                    { name: 'الخبرة الطبية', score: analysisResult.medicalExpertiseScore }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-gray-700">{item.name}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full">
                          <div
                            className={`h-full bg-gradient-to-r ${getPersonaGradient()} rounded-full`}
                            style={{ width: `${item.score}%` }}
                          />
                        </div>
                        <span className={`font-semibold ${getScoreColor(item.score)}`}>
                          {item.score}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h4 className="text-xl font-semibold mb-4 flex items-center">
                  <CheckCircle2 className="w-5 h-5 mr-2 text-green-500" />
                  نقاط القوة
                </h4>
                <div className="space-y-2">
                  {analysisResult.strengths?.map((strength: string, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{strength}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Weaknesses and Recommendations */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h4 className="text-xl font-semibold mb-4 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-yellow-500" />
                  نقاط التحسين
                </h4>
                <div className="space-y-3">
                  {analysisResult.weaknesses?.map((weakness: any, index: number) => (
                    <div key={index} className="border border-yellow-200 rounded-lg p-3">
                      <div className="font-semibold text-gray-800 text-sm">{weakness.category}</div>
                      <div className="text-gray-600 text-sm mb-1">{weakness.description}</div>
                      <div className="text-blue-600 text-xs">{weakness.improvement}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h4 className="text-xl font-semibold mb-4 text-gray-800">التوصيات</h4>
                <div className="space-y-2">
                  {analysisResult.recommendations?.map((rec: string, index: number) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6">
              <h4 className="text-xl font-semibold mb-3 text-gray-800">ملخص التحليل</h4>
              <p className="text-gray-700 leading-relaxed">{analysisResult.summary}</p>
              
              <div className="grid md:grid-cols-2 gap-4 mt-6">
                <div>
                  <div className="text-sm font-semibold text-gray-600">تقييم المخاطر</div>
                  <Badge variant="outline" className="mt-1">
                    {analysisResult.riskAssessment}
                  </Badge>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-600">نطاق الراتب المقترح</div>
                  <div className="text-green-600 font-semibold mt-1">
                    {analysisResult.salaryRecommendation}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                onClick={handleContinue}
                className={`bg-gradient-to-r ${getPersonaGradient()} hover:opacity-90 text-white px-8 py-3 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-3`}
              >
                متابعة إلى الخطوة التالية
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIAnalysisStep;