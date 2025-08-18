
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Zap,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Target,
  Trophy,
  Brain,
  Code,
  Palette,
  TrendingUp } from
'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ChallengeStepProps {
  data: any;
  onComplete: (data: any) => void;
  persona: string;
  theme: string;
}

const ChallengeStep: React.FC<ChallengeStepProps> = ({ data, onComplete, persona }) => {
  const [currentQuestion, setCurrentQuestion] = useState(data.currentQuestion || 0);
  const [answers, setAnswers] = useState(data.answers || {});
  const [timeLeft, setTimeLeft] = useState(data.timeLeft || 300); // 5 minutes
  const [isActive, setIsActive] = useState(!data.completed);
  const [challengeQuestions, setChallengeQuestions] = useState([]);
  const { toast } = useToast();

  // Generate persona-specific challenges
  const generateChallenges = () => {
    const challenges = {
      developer: [
      {
        id: 1,
        type: 'multiple',
        title: 'ما هي أفضل طريقة لإدارة الحالة (State) في React؟',
        options: [
        'استخدام useState في كل مكان',
        'Redux لجميع التطبيقات',
        'اختيار الأداة المناسبة حسب الحاجة',
        'Context API فقط'],

        correct: 2,
        points: 20,
        explanation: 'الحل الصحيح هو اختيار الأداة المناسبة حسب تعقيد التطبيق وحاجته.'
      },
      {
        id: 2,
        type: 'multiple',
        title: 'ما الغرض من استخدام Virtual DOM في React؟',
        options: [
        'تسريع عملية البحث',
        'تحسين أداء التطبيق',
        'تقليل استهلاك الذاكرة',
        'تسهيل عملية التطوير'],

        correct: 1,
        points: 15,
        explanation: 'Virtual DOM يحسن الأداء من خلال تقليل عمليات التلاعب المباشر بـ DOM.'
      },
      {
        id: 3,
        type: 'practical',
        title: 'اكتب دالة JavaScript تقوم بإزالة العناصر المكررة من مصفوفة',
        placeholder: 'function removeDuplicates(arr) {\n  // اكتب الكود هنا\n}',
        points: 25,
        solution: 'return [...new Set(arr)];'
      }],

      designer: [
      {
        id: 1,
        type: 'multiple',
        title: 'ما أهمية التباين (Contrast) في تصميم واجهات المستخدم؟',
        options: [
        'جعل التصميم أكثر جمالاً',
        'تحسين إمكانية الوصول والقراءة',
        'توفير مساحة في التصميم',
        'اتباع الاتجاهات الحديثة'],

        correct: 1,
        points: 20,
        explanation: 'التباين الجيد يحسن إمكانية الوصول ويسهل القراءة لجميع المستخدمين.'
      },
      {
        id: 2,
        type: 'multiple',
        title: 'ما هو الهدف من إنشاء نموذج أولي (Prototype)؟',
        options: [
        'إنهاء المشروع بسرعة',
        'اختبار الأفكار والتفاعلات',
        'توفير المال',
        'إبهار العميل'],

        correct: 1,
        points: 15,
        explanation: 'النموذج الأولي يساعد في اختبار الأفكار والتفاعلات قبل التطوير الفعلي.'
      },
      {
        id: 3,
        type: 'creative',
        title: 'صف كيف ستحسن تجربة المستخدم لتطبيق توصيل طعام',
        placeholder: 'اكتب أفكارك لتحسين تجربة المستخدم...',
        points: 25,
        keywords: ['بحث', 'سرعة', 'وضوح', 'تفاعل', 'سهولة']
      }],

      marketer: [
      {
        id: 1,
        type: 'multiple',
        title: 'ما أهم عامل في نجاح حملة إعلانية رقمية؟',
        options: [
        'الميزانية الكبيرة',
        'استهداف الجمهور المناسب',
        'التصميم الجذاب فقط',
        'النشر في جميع المنصات'],

        correct: 1,
        points: 20,
        explanation: 'استهداف الجمهور المناسب هو الأساس لنجاح أي حملة إعلانية.'
      },
      {
        id: 2,
        type: 'multiple',
        title: 'ما المقصود بـ ROAS في التسويق الرقمي؟',
        options: [
        'عائد الإنفاق الإعلاني',
        'معدل النقر على الإعلان',
        'تكلفة الحصول على عميل',
        'معدل التحويل'],

        correct: 0,
        points: 15,
        explanation: 'ROAS يعني Return on Ad Spend - عائد الإنفاق الإعلاني.'
      },
      {
        id: 3,
        type: 'strategic',
        title: 'اقترح استراتيجية تسويقية لمتجر إلكتروني جديد',
        placeholder: 'صف استراتيجيتك التسويقية...',
        points: 25,
        keywords: ['جمهور', 'منصات', 'محتوى', 'تحليل', 'هدف']
      }]

    };

    return challenges[persona] || challenges.developer;
  };

  useEffect(() => {
    if (!data.completed) {
      setChallengeQuestions(generateChallenges());
    }
  }, [persona, data.completed]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimeUp();
    }
    return () => clearTimeout(timer);
  }, [isActive, timeLeft]);

  const handleTimeUp = () => {
    setIsActive(false);
    toast({
      title: "انتهى الوقت!",
      description: "تم إنهاء التحدي تلقائياً",
      variant: "destructive",
      duration: 5000
    });

    setTimeout(() => {
      calculateScore();
    }, 1000);
  };

  const handleAnswer = (questionId: number, answer: any) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestion < challengeQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateScore();
    }
  };

  const calculateScore = () => {
    let totalScore = 0;
    let correctAnswers = 0;

    challengeQuestions.forEach((question: any) => {
      const userAnswer = answers[question.id];

      if (question.type === 'multiple') {
        if (userAnswer === question.correct) {
          totalScore += question.points;
          correctAnswers++;
        }
      } else if (question.type === 'practical') {
        // Simple keyword matching for practical questions
        if (userAnswer && userAnswer.includes(question.solution)) {
          totalScore += question.points;
          correctAnswers++;
        } else if (userAnswer && userAnswer.length > 20) {
          // Partial credit for effort
          totalScore += Math.floor(question.points * 0.5);
        }
      } else if (question.type === 'creative' || question.type === 'strategic') {
        // Keyword-based scoring for creative/strategic questions
        if (userAnswer && userAnswer.length > 50) {
          const keywords = question.keywords || [];
          const foundKeywords = keywords.filter((keyword) =>
          userAnswer.toLowerCase().includes(keyword.toLowerCase())
          );
          const keywordScore = foundKeywords.length / keywords.length * question.points;
          totalScore += Math.max(keywordScore, question.points * 0.3); // Minimum 30% for effort
          if (keywordScore > question.points * 0.7) correctAnswers++;
        }
      }
    });

    const percentage = Math.round(totalScore / challengeQuestions.reduce((sum: number, q: any) => sum + q.points, 0) * 100);

    const result = {
      completed: true,
      score: totalScore,
      percentage,
      correctAnswers,
      totalQuestions: challengeQuestions.length,
      answers,
      timeUsed: 300 - timeLeft,
      performance: getPerformanceLevel(percentage),
      completedAt: new Date().toISOString()
    };

    toast({
      title: "تم إكمال التحدي!",
      description: `حصلت على ${percentage}% من النتيجة الإجمالية`,
      duration: 5000
    });

    onComplete(result);
  };

  const getPerformanceLevel = (percentage: number) => {
    if (percentage >= 90) return 'ممتاز';
    if (percentage >= 80) return 'جيد جداً';
    if (percentage >= 70) return 'جيد';
    if (percentage >= 60) return 'مقبول';
    return 'يحتاج تحسين';
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getPersonaIcon = () => {
    switch (persona) {
      case 'designer':return <Palette className="w-8 h-8" />;
      case 'marketer':return <TrendingUp className="w-8 h-8" />;
      default:return <Code className="w-8 h-8" />;
    }
  };

  const getPersonaColor = () => {
    switch (persona) {
      case 'designer':return 'from-pink-500 to-purple-500';
      case 'marketer':return 'from-green-500 to-blue-500';
      default:return 'from-blue-500 to-cyan-500';
    }
  };

  if (data.completed) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6">

        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="inline-block mb-4">

            <Trophy className="w-16 h-16 text-yellow-500" />
          </motion.div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            تم إكمال التحدي المهني!
          </h3>
          <p className="text-gray-600">
            مبروك! لقد أكملت التحدي بنجاح
          </p>
        </div>

        <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{data.percentage}%</div>
              <div className="text-sm text-gray-600">النتيجة</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{data.correctAnswers}</div>
              <div className="text-sm text-gray-600">إجابات صحيحة</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">{Math.floor(data.timeUsed / 60)}م</div>
              <div className="text-sm text-gray-600">الوقت المستخدم</div>
            </div>
            <div>
              <Badge className={`${data.percentage >= 80 ? 'bg-green-100 text-green-800' : data.percentage >= 60 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                {data.performance}
              </Badge>
            </div>
          </div>
        </Card>

        <motion.div
          className="flex justify-center pt-6"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}>

          <Button
            onClick={() => onComplete(data)}
            size="lg"
            className={`px-12 py-3 bg-gradient-to-r ${getPersonaColor()} text-lg font-semibold`}>

            متابعة للمقابلة ←
          </Button>
        </motion.div>
      </motion.div>);

  }

  const currentQ = challengeQuestions[currentQuestion];
  if (!currentQ) return <div>جاري تحميل التحدي...</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6">

      <div className="text-center mb-8">
        <motion.div
          animate={{
            rotate: [0, 10, -10, 0],
            scale: timeLeft < 30 ? [1, 1.1, 1] : 1
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="inline-block mb-4">

          <div className="relative">
            {getPersonaIcon()}
            <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white bg-gradient-to-r ${getPersonaColor()}`}>
              <Zap className="w-3 h-3" />
            </div>
          </div>
        </motion.div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          التحدي المهني
        </h3>
        <p className="text-gray-600">
          اختبر مهاراتك ومعرفتك في مجال تخصصك
        </p>
      </div>

      {/* Timer and Progress */}
      <div className="bg-gray-50 p-4 rounded-xl">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            السؤال {currentQuestion + 1} من {challengeQuestions.length}
          </span>
          <div className={`flex items-center gap-2 ${timeLeft < 60 ? 'text-red-600' : 'text-gray-700'}`}>
            <Clock className="w-4 h-4" />
            <span className="font-mono font-semibold">{formatTime(timeLeft)}</span>
          </div>
        </div>
        <Progress value={(currentQuestion + 1) / challengeQuestions.length * 100} className="h-2" />
      </div>

      {/* Question */}
      <Card className="p-6">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-6">

          <div className="flex items-start gap-3">
            <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${getPersonaColor()} flex items-center justify-center text-white font-bold`}>
              {currentQ.id}
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-gray-800 leading-relaxed">
                {currentQ.title}
              </h4>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline">{currentQ.points} نقطة</Badge>
                <Badge variant="outline">{currentQ.type === 'multiple' ? 'اختيار متعدد' : currentQ.type === 'practical' ? 'تطبيقي' : 'إبداعي'}</Badge>
              </div>
            </div>
          </div>

          {/* Answer Options */}
          <div className="mr-11">
            {currentQ.type === 'multiple' ?
            <div className="space-y-3">
                {currentQ.options.map((option: string, index: number) =>
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}>

                    <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                    type="radio"
                    name={`question-${currentQ.id}`}
                    value={index}
                    checked={answers[currentQ.id] === index}
                    onChange={() => handleAnswer(currentQ.id, index)}
                    className="w-4 h-4 text-blue-600" />

                      <span className="text-gray-700 flex-1 text-right">{option}</span>
                    </label>
                  </motion.div>
              )}
              </div> :

            <div className="space-y-3">
                <textarea
                value={answers[currentQ.id] || ''}
                onChange={(e) => handleAnswer(currentQ.id, e.target.value)}
                placeholder={currentQ.placeholder}
                className="w-full p-4 border border-gray-200 rounded-lg text-right min-h-[120px] font-mono text-sm"
                dir="rtl" />

                <p className="text-xs text-gray-500">
                  اكتب إجابتك بالتفصيل للحصول على أفضل نتيجة
                </p>
              </div>
            }
          </div>
        </motion.div>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          {currentQuestion > 0 &&
          <span>يمكنك العودة للأسئلة السابقة لاحقاً</span>
          }
        </div>
        
        <div className="flex gap-3">
          <Button
            onClick={handleNextQuestion}
            disabled={!answers[currentQ.id]}
            size="lg"
            className={`px-8 bg-gradient-to-r ${getPersonaColor()}`}>

            {currentQuestion < challengeQuestions.length - 1 ? 'السؤال التالي' : 'إنهاء التحدي'}
            {currentQuestion === challengeQuestions.length - 1 &&
            <CheckCircle className="w-4 h-4 mr-2" />
            }
          </Button>
        </div>
      </div>

      {/* Time Warning */}
      <AnimatePresence>
        {timeLeft < 60 &&
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-red-50 border border-red-200 p-4 rounded-lg">

            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-red-700 font-medium">
                تحذير: المتبقي أقل من دقيقة واحدة!
              </span>
            </div>
          </motion.div>
        }
      </AnimatePresence>
    </motion.div>);

};

export default ChallengeStep;