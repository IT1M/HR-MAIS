import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Clock, Send, Brain, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import TextBasedInterview from '@/components/candidate/TextBasedInterview';

interface InterviewStepProps {
  data: any;
  onComplete: (data: any) => void;
  persona: string;
  theme: string;
}

const InterviewStep: React.FC<InterviewStepProps> = ({
  data,
  onComplete,
  persona,
  theme
}) => {
  const [interviewData, setInterviewData] = useState<any>(null);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (data.interviewData) {
      setInterviewData(data.interviewData);
      setHasStarted(true);
    }
  }, [data]);

  const generateInterviewQuestions = async () => {
    setIsGeneratingQuestions(true);
    
    try {
      // Get candidate data and analysis
      const candidateData = JSON.parse(localStorage.getItem('candidateData') || '{}');
      const cvAnalysis = candidateData.analysis?.result || {};
      const basicInfo = candidateData.basicInfo || {};

      const response = await window.ezsite.apis.run({
        path: "generateInterviewQuestions",
        param: [candidateData.id, cvAnalysis, basicInfo]
      });

      if (response?.data) {
        setInterviewData(response.data);
        setHasStarted(true);
        
        toast({
          title: "تم إنشاء أسئلة المقابلة!",
          description: "تم إنشاء أسئلة مخصصة بناءً على تحليل سيرتك الذاتية",
          duration: 3000
        });
      }
    } catch (error) {
      console.error('Interview questions generation error:', error);
      toast({
        title: "خطأ في إنشاء الأسئلة",
        description: "حدث خطأ أثناء إنشاء أسئلة المقابلة، جاري استخدام أسئلة افتراضية",
        variant: "destructive",
        duration: 3000
      });
      
      // Fallback questions
      setInterviewData({
        sessionId: 'fallback_' + Date.now(),
        questions: [
          {
            id: 1,
            category: "الخبرة الطبية",
            question: "حدثني عن خبرتك في المجال الطبي وأهم المشاريع التي عملت عليها في شركات طبية سابقة",
            purpose: "تقييم الخبرة العملية والمشاريع الطبية",
            expectedPoints: ["أمثلة عملية من المجال الطبي", "نتائج محققة", "تحديات تم التغلب عليها"]
          },
          {
            id: 2,
            category: "المهارات التقنية الطبية",
            question: "ما هي الأنظمة والتقنيات الطبية التي تجيد العمل عليها؟ وكيف استخدمتها في مشاريعك السابقة؟",
            purpose: "تقييم المهارات التقنية في المجال الطبي",
            expectedPoints: ["معرفة بالأنظمة الطبية", "خبرة عملية", "مواكبة التطورات التقنية"]
          },
          {
            id: 3,
            category: "التعامل مع التحديات",
            question: "صف لي موقفاً تحدياً واجهته في بيئة طبية وكيف تعاملت معه. ما الدروس التي تعلمتها؟",
            purpose: "تقييم القدرة على التعامل مع الضغط والتحديات الطبية",
            expectedPoints: ["استراتيجيات حل المشكلات", "أمثلة عملية", "التعلم من التحديات"]
          },
          {
            id: 4,
            category: "العمل الجماعي",
            question: "كيف تتعامل مع فريق العمل الطبي متعدد التخصصات؟ أعطني مثال على مشروع عملت فيه مع فريق",
            purpose: "تقييم مهارات العمل الجماعي والتواصل",
            expectedPoints: ["مهارات التواصل", "القدرة على التعاون", "قيادة الفريق"]
          },
          {
            id: 5,
            category: "المعايير والجودة",
            question: "كيف تضمن الالتزام بالمعايير الطبية والجودة في عملك؟ وما أهمية ذلك في المجال الطبي؟",
            purpose: "تقييم الوعي بمعايير الجودة الطبية",
            expectedPoints: ["معرفة بالمعايير", "إجراءات الجودة", "أهمية الدقة في المجال الطبي"]
          }
        ],
        interviewDuration: "30-45 دقيقة",
        focusAreas: ["الخبرة الطبية", "المهارات التقنية", "العمل الجماعي"]
      });
      setHasStarted(true);
    }
    
    setIsGeneratingQuestions(false);
  };

  const handleInterviewComplete = (responses: any) => {
    onComplete({ 
      interviewData, 
      responses, 
      completed: true,
      sessionId: interviewData.sessionId 
    });
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

  if (!hasStarted) {
    return (
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <MessageSquare className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${getPersonaGradient()} bg-clip-text text-transparent`} />
          <h2 className="text-3xl font-bold mb-2 text-gray-800">
            المقابلة الشخصية الكتابية
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            ستخوض مقابلة شخصية كتابية مصممة خصيصاً لك بناءً على تحليل سيرتك الذاتية والمجال الطبي في شركة ميس
          </p>
        </motion.div>

        <div className="bg-white rounded-2xl p-8 shadow-lg max-w-2xl mx-auto">
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-lg">
              <Brain className="w-6 h-6 text-blue-500" />
              <span className="font-semibold">أسئلة مخصصة بالذكاء الاصطناعي</span>
            </div>
            
            <div className="flex items-center gap-3 text-lg">
              <Clock className="w-6 h-6 text-green-500" />
              <span className="font-semibold">مدة المقابلة: 30-45 دقيقة</span>
            </div>
            
            <div className="flex items-center gap-3 text-lg">
              <MessageSquare className="w-6 h-6 text-purple-500" />
              <span className="font-semibold">مقابلة كتابية تفاعلية</span>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 border-r-4 border-blue-500">
              <h4 className="font-semibold text-blue-800 mb-2">نصائح للمقابلة:</h4>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• كن واضحاً ومفصلاً في إجاباتك</li>
                <li>• اربط إجاباتك بخبراتك في المجال الطبي</li>
                <li>• أعط أمثلة عملية من مشاريعك السابقة</li>
                <li>• اشرح كيف يمكنك المساهمة في شركة ميس</li>
              </ul>
            </div>

            <div className="text-center">
              <Button
                onClick={generateInterviewQuestions}
                disabled={isGeneratingQuestions}
                className={`bg-gradient-to-r ${getPersonaGradient()} hover:opacity-90 text-white px-8 py-3 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
              >
                {isGeneratingQuestions ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    إنشاء أسئلة المقابلة...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Send className="w-5 h-5" />
                    بدء المقابلة الكتابية
                  </div>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <MessageSquare className={`w-12 h-12 mx-auto mb-4 bg-gradient-to-r ${getPersonaGradient()} bg-clip-text text-transparent`} />
        <h2 className="text-2xl font-bold mb-2 text-gray-800">
          المقابلة الشخصية - شركة ميس للمشاريع الطبية
        </h2>
        <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {interviewData?.interviewDuration}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            {interviewData?.questions?.length} سؤال
          </Badge>
        </div>
      </motion.div>

      <TextBasedInterview
        interviewData={interviewData}
        onComplete={handleInterviewComplete}
        persona={persona}
      />
    </div>
  );
};

export default InterviewStep;