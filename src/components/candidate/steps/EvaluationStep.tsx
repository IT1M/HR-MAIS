import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Award, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Target,
  Brain,
  FileText,
  Users,
  Shield,
  DollarSign
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { RadarChart } from '@/components/charts/RadarChart';

interface EvaluationStepProps {
  data: any;
  onComplete: (data: any) => void;
  persona: string;
  theme: string;
}

const EvaluationStep: React.FC<EvaluationStepProps> = ({
  data,
  onComplete,
  persona,
  theme
}) => {
  const [evaluation, setEvaluation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentView, setCurrentView] = useState<'overview' | 'detailed' | 'recommendations'>('overview');
  const { toast } = useToast();

  useEffect(() => {
    if (data.evaluation) {
      setEvaluation(data.evaluation);
    } else if (data.responses && data.sessionId) {
      loadEvaluation();
    }
  }, [data]);

  const loadEvaluation = async () => {
    setIsLoading(true);
    
    try {
      // The evaluation should already be completed in the interview step
      // We'll retrieve it from the database
      const candidateData = JSON.parse(localStorage.getItem('candidateData') || '{}');
      
      // Get interview session data
      const response = await window.ezsite.apis.tablePage(35306, {
        PageNo: 1,
        PageSize: 1,
        Filters: [
          { name: "candidate_id", op: "Equal", value: candidateData.id },
          { name: "session_id", op: "Equal", value: data.sessionId }
        ]
      });

      if (response.data?.List?.[0]) {
        const sessionData = response.data.List[0];
        
        // Mock evaluation based on interview scores (in real implementation, this would come from Gemini API)
        const mockEvaluation = {
          overallScore: sessionData.interview_score || 75,
          communicationScore: sessionData.communication_score || 80,
          technicalScore: sessionData.technical_response_score || 70,
          experienceScore: 72,
          problemSolvingScore: 75,
          culturalFitScore: 80,
          detailedFeedback: data.responses?.map((r: any, i: number) => ({
            questionId: r.questionId,
            question: r.question,
            score: 70 + Math.random() * 25, // Random score for demo
            feedback: "إجابة جيدة تُظهر فهماً للمفاهيم الأساسية، ولكن يمكن تحسينها بإضافة المزيد من التفاصيل العملية",
            strengths: ["وضوح في التعبير", "فهم أساسي جيد"],
            improvements: ["إضافة أمثلة عملية أكثر", "تفصيل الخبرات السابقة"]
          })) || [],
          overallAssessment: `المرشح يُظهر إمكانيات جيدة في المجال الطبي مع فهم أساسي للمتطلبات. يحتاج لتطوير بعض الجوانب ولكنه مرشح واعد لشركة ميس للمشاريع الطبية. النتيجة العامة ${sessionData.interview_score || 75}% تضعه في فئة المرشحين المقبولين مع شروط للتطوير.`,
          recommendation: sessionData.interview_score >= 80 ? "توظيف فوري" : sessionData.interview_score >= 65 ? "توظيف مشروط" : sessionData.interview_score >= 50 ? "قائمة انتظار" : "رفض مهذب",
          nextSteps: [
            "مراجعة مع فريق التوظيف في شركة ميس",
            "إجراء مقابلة تقنية متخصصة",
            "فحص المراجع والشهادات",
            "تحديد البرنامج التدريبي المناسب"
          ],
          redFlags: sessionData.interview_score < 60 ? [
            "نقص في الخبرة العملية المتخصصة",
            "عدم وضوح في بعض الإجابات",
            "حاجة لتطوير المهارات التقنية"
          ] : [],
          positiveIndicators: [
            "حماس واضح للعمل في المجال الطبي",
            "قدرة على التعلم والتطوير",
            "التزام بالمعايير المهنية",
            "رغبة في العمل مع شركة ميس"
          ]
        };

        setEvaluation(mockEvaluation);
      }
    } catch (error) {
      console.error('Evaluation loading error:', error);
      toast({
        title: "خطأ في تحميل التقييم",
        description: "حدث خطأ أثناء تحميل نتائج التقييم",
        variant: "destructive",
        duration: 3000
      });
    }
    
    setIsLoading(false);
  };

  const handleComplete = () => {
    onComplete({ evaluation, completed: true });
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
    if (score >= 65) return 'text-blue-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle2 className="w-5 h-5 text-green-600" />;
    if (score >= 65) return <Target className="w-5 h-5 text-blue-600" />;
    if (score >= 50) return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
    return <XCircle className="w-5 h-5 text-red-600" />;
  };

  const getRecommendationColor = (rec: string) => {
    if (rec.includes('فوري')) return 'bg-green-100 text-green-700 border-green-200';
    if (rec.includes('مشروط')) return 'bg-blue-100 text-blue-700 border-blue-200';
    if (rec.includes('انتظار')) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    return 'bg-red-100 text-red-700 border-red-200';
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Brain className="w-16 h-16 mx-auto mb-4 text-blue-500 animate-pulse" />
          <h2 className="text-3xl font-bold mb-2 text-gray-800">جاري تحليل وتقييم إجاباتك</h2>
          <p className="text-gray-600">يرجى الانتظار بينما نعد تقريرك الشامل...</p>
        </motion.div>
        <div className="flex justify-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!evaluation) {
    return (
      <div className="text-center py-8">
        <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
        <p className="text-gray-600">لم يتم العثور على نتائج التقييم</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <Award className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${getPersonaGradient()} bg-clip-text text-transparent`} />
        <h2 className="text-3xl font-bold mb-2 text-gray-800">
          التقييم النهائي - شركة ميس
        </h2>
        <p className="text-gray-600">
          تقييم شامل وصادق لأدائك في عملية التقديم
        </p>
      </motion.div>

      {/* Navigation */}
      <div className="flex justify-center">
        <div className="inline-flex rounded-lg bg-gray-100 p-1">
          <button
            onClick={() => setCurrentView('overview')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              currentView === 'overview'
                ? `bg-gradient-to-r ${getPersonaGradient()} text-white shadow`
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            نظرة عامة
          </button>
          <button
            onClick={() => setCurrentView('detailed')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              currentView === 'detailed'
                ? `bg-gradient-to-r ${getPersonaGradient()} text-white shadow`
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            تفاصيل الأسئلة
          </button>
          <button
            onClick={() => setCurrentView('recommendations')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              currentView === 'recommendations'
                ? `bg-gradient-to-r ${getPersonaGradient()} text-white shadow`
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            التوصيات
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {currentView === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Overall Score */}
            <Card className="p-6 text-center bg-gradient-to-br from-blue-50 to-green-50">
              <div className="flex items-center justify-center mb-4">
                {getScoreIcon(evaluation.overallScore)}
                <h3 className="text-2xl font-bold text-gray-800 mr-2">النتيجة الإجمالية</h3>
              </div>
              <div className={`text-6xl font-bold mb-4 ${getScoreColor(evaluation.overallScore)}`}>
                {evaluation.overallScore}%
              </div>
              <div className={`inline-block px-4 py-2 rounded-full text-lg font-semibold border-2 ${getRecommendationColor(evaluation.recommendation)}`}>
                {evaluation.recommendation}
              </div>
            </Card>

            {/* Score Breakdown */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: 'التواصل', score: evaluation.communicationScore, icon: Users },
                { name: 'المهارات التقنية', score: evaluation.technicalScore, icon: Brain },
                { name: 'الخبرة العملية', score: evaluation.experienceScore, icon: Award },
                { name: 'حل المشكلات', score: evaluation.problemSolvingScore, icon: Target },
                { name: 'الملاءمة الثقافية', score: evaluation.culturalFitScore, icon: Shield },
              ].map((item, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <item.icon className="w-5 h-5 text-gray-600" />
                      <span className="font-medium text-gray-800">{item.name}</span>
                    </div>
                    <span className={`font-bold ${getScoreColor(item.score)}`}>
                      {item.score}%
                    </span>
                  </div>
                  <Progress value={item.score} className="h-2" />
                </Card>
              ))}
            </div>

            {/* Overall Assessment */}
            <Card className="p-6">
              <h4 className="text-xl font-semibold mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-500" />
                التقييم الشامل
              </h4>
              <div className="bg-gray-50 rounded-lg p-4 border-r-4 border-blue-500">
                <p className="text-gray-700 leading-relaxed">{evaluation.overallAssessment}</p>
              </div>
            </Card>
          </motion.div>
        )}

        {currentView === 'detailed' && (
          <motion.div
            key="detailed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold text-gray-800 text-center">تقييم تفصيلي للإجابات</h3>
            <div className="space-y-4">
              {evaluation.detailedFeedback?.map((feedback: any, index: number) => (
                <Card key={index} className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 mb-2">
                          السؤال {feedback.questionId}
                        </h4>
                        <p className="text-gray-600 text-sm mb-3">{feedback.question}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getScoreIcon(feedback.score)}
                        <span className={`font-bold text-lg ${getScoreColor(feedback.score)}`}>
                          {Math.round(feedback.score)}%
                        </span>
                      </div>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-4">
                      <p className="text-blue-800 text-sm">{feedback.feedback}</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-semibold text-green-700 text-sm mb-2">نقاط القوة:</h5>
                        <ul className="text-green-600 text-sm space-y-1">
                          {feedback.strengths?.map((strength: string, i: number) => (
                            <li key={i} className="flex items-start gap-2">
                              <CheckCircle2 className="w-3 h-3 mt-0.5 flex-shrink-0" />
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-semibold text-yellow-700 text-sm mb-2">نقاط التحسين:</h5>
                        <ul className="text-yellow-600 text-sm space-y-1">
                          {feedback.improvements?.map((improvement: string, i: number) => (
                            <li key={i} className="flex items-start gap-2">
                              <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                              {improvement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {currentView === 'recommendations' && (
          <motion.div
            key="recommendations"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="grid md:grid-cols-2 gap-6">
              {/* Next Steps */}
              <Card className="p-6">
                <h4 className="text-xl font-semibold mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                  الخطوات التالية
                </h4>
                <ul className="space-y-3">
                  {evaluation.nextSteps?.map((step: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                        {index + 1}
                      </div>
                      <span className="text-gray-700">{step}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Positive Indicators */}
              <Card className="p-6">
                <h4 className="text-xl font-semibold mb-4 flex items-center">
                  <CheckCircle2 className="w-5 h-5 mr-2 text-green-500" />
                  المؤشرات الإيجابية
                </h4>
                <ul className="space-y-2">
                  {evaluation.positiveIndicators?.map((indicator: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{indicator}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>

            {/* Red Flags */}
            {evaluation.redFlags?.length > 0 && (
              <Card className="p-6 border-yellow-200 bg-yellow-50">
                <h4 className="text-xl font-semibold mb-4 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-yellow-600" />
                  نقاط تحتاج انتباه
                </h4>
                <ul className="space-y-2">
                  {evaluation.redFlags.map((flag: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <span className="text-yellow-800 text-sm">{flag}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="text-center">
        <Button
          onClick={handleComplete}
          className={`bg-gradient-to-r ${getPersonaGradient()} hover:opacity-90 text-white px-8 py-3 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
        >
          إنهاء عملية التقديم
        </Button>
        <p className="text-sm text-gray-600 mt-3">
          شكراً لك على وقتك. ستتم مراجعة طلبك وسيتم التواصل معك قريباً.
        </p>
      </div>
    </div>
  );
};

export default EvaluationStep;