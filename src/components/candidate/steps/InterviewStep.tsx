
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  Square, 
  Clock, 
  MessageCircle, 
  CheckCircle, 
  AlertTriangle,
  Lightbulb,
  Volume2,
  User
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import VoiceRecorder from '../VoiceRecorder';

interface InterviewStepProps {
  data: any;
  onComplete: (data: any) => void;
  persona: string;
  theme: string;
}

const InterviewStep: React.FC<InterviewStepProps> = ({ data, onComplete, persona }) => {
  const [currentQuestion, setCurrentQuestion] = useState(data.currentQuestion || 0);
  const [responses, setResponses] = useState(data.responses || {});
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [interviewQuestions, setInterviewQuestions] = useState([]);
  const [tips, setTips] = useState([]);
  const [showTip, setShowTip] = useState(false);
  const { toast } = useToast();

  // Generate persona-specific interview questions
  const generateInterviewQuestions = () => {
    const questionsByPersona = {
      developer: [
        {
          id: 1,
          question: "حدثني عن مشروع برمجي تفتخر به وكيف تعاملت مع التحديات التقنية فيه؟",
          category: "الخبرة التقنية",
          expectedDuration: 90,
          tips: [
            "اذكر تقنيات محددة استخدمتها",
            "تحدث عن التحديات وكيف حللتها",
            "اربط المشروع بالنتائج المحققة"
          ]
        },
        {
          id: 2,
          question: "كيف تبقى مطلعاً على أحدث التقنيات والأدوات في مجال البرمجة؟",
          category: "التطوير المستمر",
          expectedDuration: 60,
          tips: [
            "اذكر مصادر التعلم التي تتابعها",
            "تحدث عن مشاريع شخصية أو تجارب",
            "أظهر شغفك بالتطوير الذاتي"
          ]
        },
        {
          id: 3,
          question: "صف موقفاً واجهت فيه خطأ معقد في الكود وكيف قمت بحله؟",
          category: "حل المشكلات",
          expectedDuration: 75,
          tips: [
            "اشرح عملية التفكير المنطقي",
            "أظهر استخدامك لأدوات التتبع والتحليل",
            "تحدث عن الدروس المستفادة"
          ]
        },
        {
          id: 4,
          question: "كيف تتعامل مع العمل في فريق والمراجعة المتبادلة للكود؟",
          category: "العمل الجماعي",
          expectedDuration: 60,
          tips: [
            "أكد على أهمية التواصل",
            "اذكر أدوات التعاون التي تستخدمها",
            "تحدث عن تقبل النقد البناء"
          ]
        }
      ],
      designer: [
        {
          id: 1,
          question: "حدثني عن مشروع تصميم تحدي فيه فهم احتياجات المستخدم وكيف تعاملت معه؟",
          category: "تجربة المستخدم",
          expectedDuration: 90,
          tips: [
            "اذكر عملية البحث والاستكشاف",
            "تحدث عن النماذج الأولية والاختبارات",
            "اربط التصميم بالنتائج المحققة"
          ]
        },
        {
          id: 2,
          question: "كيف تتأكد من أن تصاميمك تلبي معايير الوصول والاستخدام؟",
          category: "إمكانية الوصول",
          expectedDuration: 60,
          tips: [
            "اذكر معايير الوصول التي تطبقها",
            "تحدث عن أدوات الاختبار",
            "أظهر فهمك لاحتياجات المستخدمين المختلفة"
          ]
        },
        {
          id: 3,
          question: "صف عمليتك الإبداعية من الفكرة إلى التصميم النهائي؟",
          category: "العملية الإبداعية",
          expectedDuration: 75,
          tips: [
            "اشرح مراحل التصميم خطوة بخطوة",
            "أظهر كيف تجمع الإلهام والأفكار",
            "تحدث عن أدواتك المفضلة"
          ]
        },
        {
          id: 4,
          question: "كيف تتعامل مع ملاحظات العملاء أو الفريق على تصاميمك؟",
          category: "التعامل مع الملاحظات",
          expectedDuration: 60,
          tips: [
            "أكد على أهمية الاستماع",
            "اذكر كيف تدمج الملاحظات بطريقة بناءة",
            "تحدث عن التوازن بين الإبداع والمتطلبات"
          ]
        }
      ],
      marketer: [
        {
          id: 1,
          question: "حدثني عن حملة تسويقية نجحت في تحقيق أهدافها وما كان دورك فيها؟",
          category: "إدارة الحملات",
          expectedDuration: 90,
          tips: [
            "اذكر أرقام ونتائج محددة",
            "تحدث عن استراتيجية الحملة",
            "أظهر كيف قست النجاح"
          ]
        },
        {
          id: 2,
          question: "كيف تحدد الجمهور المستهدف لمنتج أو خدمة جديدة؟",
          category: "استهداف الجمهور",
          expectedDuration: 60,
          tips: [
            "اذكر أدوات وطرق البحث",
            "تحدث عن تحليل البيانات",
            "أظهر فهمك لسلوك المستهلك"
          ]
        },
        {
          id: 3,
          question: "صف موقفاً واجهت فيه تحدياً في قياس عائد الاستثمار للنشاط التسويقي؟",
          category: "قياس الأداء",
          expectedDuration: 75,
          tips: [
            "اذكر المؤشرات التي استخدمتها",
            "تحدث عن الأدوات والتقنيات",
            "اشرح كيف حسنت الأداء"
          ]
        },
        {
          id: 4,
          question: "كيف تواكب التطورات والاتجاهات الجديدة في التسويق الرقمي؟",
          category: "التطوير المستمر",
          expectedDuration: 60,
          tips: [
            "اذكر المصادر التي تتابعها",
            "تحدث عن التجارب والاختبارات",
            "أظهر قدرتك على التكيف"
          ]
        }
      ]
    };

    return questionsByPersona[persona] || questionsByPersona.developer;
  };

  useEffect(() => {
    if (!data.completed) {
      const questions = generateInterviewQuestions();
      setInterviewQuestions(questions);
      
      // Show tip for first question
      if (questions.length > 0) {
        setTips(questions[0].tips);
        setTimeout(() => setShowTip(true), 1000);
      }
    }
  }, [persona, data.completed]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRecording) {
      timer = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    setShowTip(false);
    
    toast({
      title: "بدء التسجيل",
      description: "تحدث بوضوح وثقة",
      duration: 3000
    });
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    
    const currentQ = interviewQuestions[currentQuestion];
    if (currentQ) {
      setResponses(prev => ({
        ...prev,
        [currentQ.id]: {
          duration: recordingTime,
          recordedAt: new Date().toISOString(),
          questionId: currentQ.id,
          category: currentQ.category
        }
      }));
    }
    
    toast({
      title: "تم حفظ الإجابة",
      description: "تم تسجيل إجابتك بنجاح",
      duration: 3000
    });
  };

  const handleNextQuestion = () => {
    const currentQ = interviewQuestions[currentQuestion];
    if (!responses[currentQ?.id]) {
      toast({
        title: "لم يتم تسجيل الإجابة",
        description: "يرجى تسجيل إجابة قبل المتابعة",
        variant: "destructive"
      });
      return;
    }

    if (currentQuestion < interviewQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      const nextQ = interviewQuestions[currentQuestion + 1];
      setTips(nextQ?.tips || []);
      setTimeout(() => setShowTip(true), 500);
    } else {
      completeInterview();
    }
  };

  const completeInterview = () => {
    const totalDuration = Object.values(responses).reduce((sum: number, response: any) => sum + (response.duration || 0), 0);
    const averageResponseTime = totalDuration / interviewQuestions.length;
    
    const result = {
      completed: true,
      responses,
      totalQuestions: interviewQuestions.length,
      completedQuestions: Object.keys(responses).length,
      totalDuration,
      averageResponseTime,
      performance: getInterviewPerformance(Object.keys(responses).length, interviewQuestions.length, averageResponseTime),
      completedAt: new Date().toISOString()
    };

    toast({
      title: "تم إكمال المقابلة!",
      description: "شكراً لك على وقتك والإجابات المميزة",
      duration: 5000
    });

    onComplete(result);
  };

  const getInterviewPerformance = (completed: number, total: number, avgTime: number) => {
    const completionRate = (completed / total) * 100;
    
    if (completionRate === 100 && avgTime > 45 && avgTime < 120) return 'ممتاز';
    if (completionRate >= 75 && avgTime > 30) return 'جيد جداً';
    if (completionRate >= 50) return 'جيد';
    return 'يحتاج تحسين';
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getPersonaColor = () => {
    switch (persona) {
      case 'designer': return 'from-pink-500 to-purple-500';
      case 'marketer': return 'from-green-500 to-blue-500';
      default: return 'from-blue-500 to-cyan-500';
    }
  };

  if (data.completed) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="inline-block mb-4"
          >
            <CheckCircle className="w-16 h-16 text-green-500" />
          </motion.div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            تم إكمال المقابلة التفاعلية!
          </h3>
          <p className="text-gray-600">
            شكراً لك على الإجابات الممتازة والوقت المُخصص
          </p>
        </div>

        <Card className="p-6 bg-gradient-to-r from-blue-50 to-green-50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{data.completedQuestions}</div>
              <div className="text-sm text-gray-600">أسئلة مُجابة</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{Math.floor(data.totalDuration / 60)}م</div>
              <div className="text-sm text-gray-600">مدة المقابلة</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">{Math.floor(data.averageResponseTime)}ث</div>
              <div className="text-sm text-gray-600">متوسط الإجابة</div>
            </div>
            <div>
              <Badge className={`${data.performance === 'ممتاز' ? 'bg-green-100 text-green-800' : data.performance === 'جيد جداً' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {data.performance}
              </Badge>
            </div>
          </div>
        </Card>

        <motion.div 
          className="flex justify-center pt-6"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            onClick={() => onComplete(data)}
            size="lg"
            className={`px-12 py-3 bg-gradient-to-r ${getPersonaColor()} text-lg font-semibold`}
          >
            متابعة للتقييم النهائي ←
          </Button>
        </motion.div>
      </motion.div>
    );
  }

  const currentQ = interviewQuestions[currentQuestion];
  if (!currentQ) return <div>جاري تحميل أسئلة المقابلة...</div>;

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
            scale: isRecording ? [1, 1.1, 1] : 1,
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: isRecording ? 1.5 : 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="inline-block mb-4"
        >
          <div className="relative">
            <User className="w-16 h-16 text-blue-500" />
            {isRecording && (
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              </div>
            )}
          </div>
        </motion.div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          المقابلة التفاعلية
        </h3>
        <p className="text-gray-600">
          أجب على الأسئلة بصوتك الطبيعي وبثقة
        </p>
      </div>

      {/* Progress */}
      <div className="bg-gray-50 p-4 rounded-xl">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            السؤال {currentQuestion + 1} من {interviewQuestions.length}
          </span>
          <Badge variant="outline">{currentQ.category}</Badge>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className={`h-2 rounded-full bg-gradient-to-r ${getPersonaColor()}`}
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestion + 1) / interviewQuestions.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Question Card */}
      <Card className="p-6">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="flex items-start gap-4">
            <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${getPersonaColor()} flex items-center justify-center text-white font-bold flex-shrink-0`}>
              <MessageCircle className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-gray-800 leading-relaxed mb-3">
                {currentQ.question}
              </h4>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>الوقت المتوقع: {currentQ.expectedDuration} ثانية</span>
              </div>
            </div>
          </div>

          {/* Recording Interface */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <div className="text-center space-y-4">
              {!isRecording ? (
                <div className="space-y-4">
                  {responses[currentQ.id] ? (
                    <div className="flex items-center justify-center gap-3 text-green-600">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">تم تسجيل الإجابة ({formatTime(responses[currentQ.id].duration)})</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-3 text-gray-500">
                      <MicOff className="w-5 h-5" />
                      <span>اضغط للبدء بالتسجيل</span>
                    </div>
                  )}
                  
                  <Button
                    onClick={handleStartRecording}
                    size="lg"
                    className={`px-8 py-4 bg-gradient-to-r ${getPersonaColor()}`}
                  >
                    <Mic className="w-5 h-5 ml-2" />
                    {responses[currentQ.id] ? 'إعادة التسجيل' : 'بدء التسجيل'}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="flex items-center justify-center gap-3 text-red-600"
                  >
                    <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse" />
                    <span className="font-medium">جاري التسجيل... {formatTime(recordingTime)}</span>
                  </motion.div>
                  
                  <Button
                    onClick={handleStopRecording}
                    variant="destructive"
                    size="lg"
                    className="px-8 py-4"
                  >
                    <Square className="w-5 h-5 ml-2" />
                    إيقاف التسجيل
                  </Button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </Card>

      {/* Tips */}
      <AnimatePresence>
        {showTip && tips.length > 0 && !isRecording && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl"
          >
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h5 className="font-semibold text-yellow-800 mb-2">نصائح للإجابة:</h5>
                <ul className="space-y-1 text-yellow-700 text-sm">
                  {tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-yellow-500 mt-1">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTip(false)}
                className="text-yellow-600 hover:text-yellow-800"
              >
                إخفاء
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-4">
        <div className="text-sm text-gray-500">
          {Object.keys(responses).length > 0 && (
            <span>تم تسجيل {Object.keys(responses).length} إجابات</span>
          )}
        </div>
        
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setShowTip(!showTip)}
            disabled={isRecording}
          >
            <Lightbulb className="w-4 h-4 ml-2" />
            {showTip ? 'إخفاء النصائح' : 'عرض النصائح'}
          </Button>
          
          <Button
            onClick={handleNextQuestion}
            disabled={!responses[currentQ.id] || isRecording}
            size="lg"
            className={`px-8 bg-gradient-to-r ${getPersonaColor()}`}
          >
            {currentQuestion < interviewQuestions.length - 1 ? 'السؤال التالي' : 'إكمال المقابلة'}
          </Button>
        </div>
      </div>

      {/* Warning for recording */}
      {isRecording && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-red-50 border border-red-200 p-4 rounded-lg"
        >
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span className="text-red-700 font-medium">
              جاري التسجيل - تحدث بوضوح وثقة
            </span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default InterviewStep;
