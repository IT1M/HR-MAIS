
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Brain, TrendingUp, Star, Target, Lightbulb, Award, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import RadarChart from '@/components/charts/RadarChart';
import BarChart from '@/components/charts/BarChart';

interface AIAnalysisStepProps {
  data: any;
  onComplete: (data: any) => void;
  persona: string;
  theme: string;
}

const AIAnalysisStep: React.FC<AIAnalysisStepProps> = ({ data, onComplete, persona }) => {
  const [analyzing, setAnalyzing] = useState(!data.completed);
  const [progress, setProgress] = useState(data.progress || 0);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [analysisResult, setAnalysisResult] = useState(data.result || null);
  const { toast } = useToast();

  const analysisPhases = [
    'تحليل المعلومات الأساسية...',
    'استخراج المهارات والخبرات...',
    'تقييم مستوى التخصص...',
    'مقارنة مع معايير السوق...',
    'إنشاء التوصيات المخصصة...',
    'إعداد التقرير النهائي...'
  ];

  useEffect(() => {
    if (analyzing && !data.completed) {
      startAnalysis();
    }
  }, [analyzing, data.completed]);

  const startAnalysis = async () => {
    try {
      // Call backend AI analysis
      let result;
      if (window.ezsite && window.ezsite.apis) {
        const response = await window.ezsite.apis.run({
          path: "analyzeCV",
          param: [
            data.candidateId,
            data.cvText || '',
            data.basicInfo,
            data.jobDescription || ''
          ]
        });
        result = response.analysis;
      } else {
        // Fallback to mock data for development
        result = await generateAnalysisResult();
      }

      setAnalysisResult(result);
      setAnalyzing(false);
      setProgress(100);
      
      toast({
        title: "تم إكمال التحليل!",
        description: "تم تحليل سيرتك الذاتية بواسطة الذكاء الاصطناعي",
        duration: 5000
      });

    } catch (error) {
      setAnalyzing(false);
      toast({
        title: "خطأ في التحليل",
        description: "حدث خطأ أثناء تحليل السيرة الذاتية",
        variant: "destructive"
      });
    }
  };

  const generateAnalysisResult = async () => {
    // Simulate API call to Gemini AI
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      overallScore: 87,
      scores: {
        technical: 85,
        experience: 90,
        education: 82,
        skills: 88,
        communication: 85
      },
      radarData: {
        labels: ['المهارات التقنية', 'الخبرة العملية', 'التعليم', 'اللغات', 'المهارات الناعمة', 'الإبداع'],
        data: [85, 90, 82, 75, 88, 80]
      },
      barData: {
        labels: ['البرمجة', 'إدارة المشاريع', 'التصميم', 'التحليل', 'التواصل'],
        data: [90, 75, 65, 85, 80]
      },
      strengths: [
        'خبرة قوية في تطوير الويب',
        'إتقان تقنيات React و Node.js',
        'خلفية تعليمية ممتازة',
        'مهارات تواصل جيدة'
      ],
      improvements: [
        'تطوير مهارات إدارة المشاريع',
        'تعلم تقنيات الذكاء الاصطناعي',
        'تحسين مهارات التصميم',
        'الحصول على شهادات مهنية إضافية'
      ],
      summary: 'مرشح متميز بخبرة قوية في التطوير والبرمجة. يظهر إمكانات كبيرة للنمو والتطور في المجال التقني.',
      suggestedJobs: [
        'مطور تطبيقات الويب المتقدم',
        'مهندس البرمجيات الأول',
        'قائد فريق التطوير',
        'مستشار تقني'
      ],
      finalVerdict: 'مناسب جداً للتوظيف'
    };
  };

  const handleContinue = () => {
    onComplete({
      ...data,
      result: analysisResult,
      completed: true,
      progress: 100,
      analyzedAt: new Date().toISOString()
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 90) return 'bg-green-100 text-green-800';
    if (score >= 80) return 'bg-blue-100 text-blue-800';
    if (score >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <motion.div
          animate={{ 
            rotate: analyzing ? 360 : 0,
            scale: analyzing ? [1, 1.1, 1] : 1 
          }}
          transition={{ 
            duration: analyzing ? 2 : 0.5, 
            repeat: analyzing ? Infinity : 0,
            ease: "linear"
          }}
          className="inline-block mb-4"
        >
          <Brain className="w-16 h-16 text-purple-500" />
        </motion.div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          تحليل السيرة الذاتية بالذكاء الاصطناعي
        </h3>
        <p className="text-gray-600">
          {analyzing ? 'جاري تحليل سيرتك الذاتية...' : 'تم إكمال تحليل سيرتك الذاتية'}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {analyzing ? (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Progress */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Brain className="w-6 h-6 text-purple-500" />
                </motion.div>
                <span className="font-semibold text-gray-800">
                  {analysisPhases[currentPhase]}
                </span>
              </div>
              
              <Progress value={progress} className="w-full h-3" />
              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>{Math.round(progress)}%</span>
                <span>الخطوة {currentPhase + 1} من {analysisPhases.length}</span>
              </div>
            </div>

            {/* Analysis Animation */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['المهارات', 'الخبرة', 'التعليم'].map((item, index) => (
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
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                    </div>
                    <p className="font-medium text-gray-700">{item}</p>
                    {currentPhase > index && (
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-green-600 text-sm mt-1"
                      >
                        ✓ تم التحليل
                      </motion.p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : analysisResult ? (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Overall Score */}
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="inline-block"
              >
                <div className="relative">
                  <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl font-bold text-white">
                      {analysisResult.overallScore}
                    </span>
                  </div>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-2 -right-2"
                  >
                    <Star className="w-8 h-8 text-yellow-500" />
                  </motion.div>
                </div>
                <h4 className="text-xl font-bold text-gray-800">النتيجة الإجمالية</h4>
                <Badge className={getScoreBadgeColor(analysisResult.overallScore)}>
                  {analysisResult.finalVerdict}
                </Badge>
              </motion.div>
            </div>

            {/* Detailed Scores */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(analysisResult.scores).map(([key, score], index) => {
                const labels = {
                  technical: 'التقني',
                  experience: 'الخبرة',
                  education: 'التعليم',
                  skills: 'المهارات',
                  communication: 'التواصل'
                };
                
                return (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div className="bg-white p-4 rounded-lg shadow border">
                      <div className={`text-2xl font-bold ${getScoreColor(score as number)}`}>
                        {score}
                      </div>
                      <p className="text-sm text-gray-600">
                        {labels[key as keyof typeof labels]}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white p-6 rounded-2xl shadow"
              >
                <h4 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                  تحليل المهارات الشامل
                </h4>
                <RadarChart data={analysisResult.radarData} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white p-6 rounded-2xl shadow"
              >
                <h4 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                  مستوى الكفاءات
                </h4>
                <BarChart data={analysisResult.barData} />
              </motion.div>
            </div>

            {/* Strengths and Improvements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-50 p-6 rounded-2xl border border-green-200"
              >
                <h4 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  نقاط القوة
                </h4>
                <ul className="space-y-2">
                  {analysisResult.strengths.map((strength: string, index: number) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-2 text-green-700"
                    >
                      <Star className="w-4 h-4 text-green-500" />
                      <span>{strength}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-blue-50 p-6 rounded-2xl border border-blue-200"
              >
                <h4 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  توصيات للتحسين
                </h4>
                <ul className="space-y-2">
                  {analysisResult.improvements.map((improvement: string, index: number) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-2 text-blue-700"
                    >
                      <Target className="w-4 h-4 text-blue-500" />
                      <span>{improvement}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-2xl"
            >
              <h4 className="text-lg font-semibold text-gray-800 mb-3">الملخص</h4>
              <p className="text-gray-700 leading-relaxed">{analysisResult.summary}</p>
            </motion.div>

            {/* Suggested Jobs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-2xl shadow"
            >
              <h4 className="text-lg font-semibold text-gray-800 mb-4">الوظائف المقترحة</h4>
              <div className="flex flex-wrap gap-2">
                {analysisResult.suggestedJobs.map((job: string, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Badge variant="outline" className="px-3 py-1">
                      {job}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Continue Button */}
            <motion.div 
              className="flex justify-center pt-6"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={handleContinue}
                size="lg"
                className="px-12 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-lg font-semibold"
              >
                متابعة للتحدي ←
              </Button>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
};

export default AIAnalysisStep;
