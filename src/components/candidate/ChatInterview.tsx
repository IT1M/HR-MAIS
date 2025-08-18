
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Send,
  MessageCircle,
  Clock,
  CheckCircle,
  User,
  Bot,
  Lightbulb,
  AlertCircle,
  Star,
  FileText
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ChatMessage {
  id: string;
  type: 'question' | 'answer' | 'system';
  content: string;
  timestamp: string;
  questionId?: number;
  category?: string;
}

interface ChatInterviewProps {
  data: any;
  onComplete: (data: any) => void;
  persona: string;
  theme: string;
}

const ChatInterview: React.FC<ChatInterviewProps> = ({ data, onComplete, persona }) => {
  const [currentQuestion, setCurrentQuestion] = useState(data.currentQuestion || 0);
  const [messages, setMessages] = useState<ChatMessage[]>(data.messages || []);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [responses, setResponses] = useState(data.responses || {});
  const [interviewQuestions, setInterviewQuestions] = useState([]);
  const [showTips, setShowTips] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!data.completed && !data.questionsLoaded) {
      loadInterviewQuestions();
    } else if (data.questions) {
      setInterviewQuestions(data.questions);
      if (messages.length === 0) {
        initializeChat();
      }
    }
  }, [data.completed, data.questionsLoaded]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadInterviewQuestions = async () => {
    try {
      if (window.ezsite && window.ezsite.apis) {
        const response = await window.ezsite.apis.run({
          path: "generateInterviewQuestions",
          param: [data.candidateId, data.basicInfo, data.analysisResult, data.basicInfo.specialization]
        });

        if (response && response.questions) {
          setInterviewQuestions(response.questions.questions);
          initializeChat();
          
          // Save questions to parent component
          onComplete({
            ...data,
            questions: response.questions.questions,
            questionsLoaded: true
          });
        }
      } else {
        // Fallback to mock questions
        const mockQuestions = generateMedicalMockQuestions(data.basicInfo.specialization);
        setInterviewQuestions(mockQuestions);
        initializeChat();
      }
    } catch (error) {
      console.error('Error loading interview questions:', error);
      toast({
        title: "خطأ في تحميل الأسئلة",
        description: "سنستخدم أسئلة افتراضية للمتابعة",
        variant: "destructive"
      });
      
      const mockQuestions = generateMedicalMockQuestions(data.basicInfo.specialization);
      setInterviewQuestions(mockQuestions);
      initializeChat();
    }
  };

  const initializeChat = () => {
    setStartTime(new Date());
    
    const welcomeMessage: ChatMessage = {
      id: 'welcome',
      type: 'system',
      content: `مرحباً ${data.basicInfo.fullName}! أنا مساعد المقابلات الذكي لشركة mais co for medical projects. سأطرح عليك 6 أسئلة مهنية. أجب بصراحة وتفصيل، حيث ستساعد إجاباتك في تقييم مدى ملاءمتك للوظيفة الطبية.`,
      timestamp: new Date().toISOString()
    };

    setMessages([welcomeMessage]);
    
    // Send first question after a short delay
    setTimeout(() => {
      sendNextQuestion(0);
    }, 2000);
  };

  const sendNextQuestion = (questionIndex: number) => {
    if (questionIndex < interviewQuestions.length) {
      const question = interviewQuestions[questionIndex];
      const questionMessage: ChatMessage = {
        id: `question-${question.id}`,
        type: 'question',
        content: question.question,
        timestamp: new Date().toISOString(),
        questionId: question.id,
        category: question.category
      };

      setMessages(prev => [...prev, questionMessage]);
      setCurrentQuestion(questionIndex);
    } else {
      completeInterview();
    }
  };

  const generateMedicalMockQuestions = (specialization: string) => {
    return [
      {
        id: 1,
        question: "لماذا اخترت العمل في المجال الطبي، وما الذي يحفزك للعمل مع شركة mais co for medical projects؟",
        category: "الدافعية والرؤية",
        expectedDuration: 120,
        tips: ["اربط إجابتك بشغفك الحقيقي", "اذكر معرفتك بالشركة", "أظهر التزامك بالمجال الطبي"]
      },
      {
        id: 2,
        question: "صف موقفاً مهنياً صعباً واجهته (أو تتوقع مواجهته) في المجال الطبي. كيف تعاملت معه؟",
        category: "حل المشكلات الطبية",
        expectedDuration: 150,
        tips: ["استخدم منهجية واضحة", "أظهر تفكيرك التحليلي", "اذكر النتائج والدروس المستفادة"]
      },
      {
        id: 3,
        question: "كيف تتعامل مع ضغط العمل والحالات الطارئة مع ضمان جودة الرعاية الطبية؟",
        category: "إدارة الضغط والأزمات",
        expectedDuration: 120,
        tips: ["اذكر استراتيجيات عملية", "أظهر قدرتك على ترتيب الأولويات", "أكد على سلامة المريض"]
      },
      {
        id: 4,
        question: "ما رأيك في أهمية التطوير المهني المستمر في المجال الطبي؟ وما خططك للتطوير؟",
        category: "التطوير المهني",
        expectedDuration: 100,
        tips: ["اذكر خطط محددة للتعلم", "أظهر اطلاعك على التطورات", "اربط التطوير بتحسين الأداء"]
      },
      {
        id: 5,
        question: "كيف تتعامل مع المرضى من خلفيات ثقافية مختلفة في البيئة السعودية؟",
        category: "التواصل والثقافة",
        expectedDuration: 110,
        tips: ["أظهر حساسيتك الثقافية", "اذكر أهمية التواصل الفعال", "أكد على احترام التنوع"]
      },
      {
        id: 6,
        question: "أين ترى نفسك مهنياً خلال 5 سنوات في شركة mais co؟ وكيف ستساهم في تطوير الخدمات الطبية؟",
        category: "الرؤية المستقبلية",
        expectedDuration: 120,
        tips: ["ضع أهدافاً واقعية ومحددة", "اربط أهدافك بأهداف الشركة", "أظهر طموحك للمساهمة"]
      }
    ];
  };

  const handleSendAnswer = async () => {
    if (!currentAnswer.trim()) {
      toast({
        title: "إجابة فارغة",
        description: "يرجى كتابة إجابة قبل الإرسال",
        variant: "destructive"
      });
      return;
    }

    const currentQ = interviewQuestions[currentQuestion];
    const answerDuration = startTime ? Math.floor((new Date().getTime() - startTime.getTime()) / 1000) : 0;

    // Add user's answer to messages
    const answerMessage: ChatMessage = {
      id: `answer-${currentQ.id}`,
      type: 'answer',
      content: currentAnswer,
      timestamp: new Date().toISOString(),
      questionId: currentQ.id
    };

    setMessages(prev => [...prev, answerMessage]);

    // Save response
    const newResponse = {
      questionId: currentQ.id,
      question: currentQ.question,
      answer: currentAnswer,
      category: currentQ.category,
      duration: answerDuration,
      answeredAt: new Date().toISOString(),
      wordCount: currentAnswer.split(/\s+/).length,
      characterCount: currentAnswer.length
    };

    setResponses(prev => ({
      ...prev,
      [currentQ.id]: newResponse
    }));

    setCurrentAnswer('');
    setIsTyping(true);

    // Show thinking animation
    setTimeout(() => {
      // Add feedback or acknowledgment
      const feedbackMessage: ChatMessage = {
        id: `feedback-${currentQ.id}`,
        type: 'system',
        content: getResponseFeedback(newResponse),
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, feedbackMessage]);
      setIsTyping(false);

      // Send next question
      setTimeout(() => {
        if (currentQuestion < interviewQuestions.length - 1) {
          sendNextQuestion(currentQuestion + 1);
        } else {
          completeInterview();
        }
      }, 1500);
    }, 2000);
  };

  const getResponseFeedback = (response: any) => {
    const wordCount = response.wordCount;
    const duration = response.duration;

    if (wordCount < 30 && duration < 60) {
      return "شكراً لإجابتك. يمكنك التوسع أكثر في الإجابات القادمة لإظهار خبرتك وتفكيرك بشكل أفضل.";
    } else if (wordCount > 100 && duration > 180) {
      return "إجابة مفصلة وممتازة! تظهر عمق فهمك وخبرتك في المجال.";
    } else {
      return "شكراً لك. إجابة جيدة تظهر فهمك للموضوع.";
    }
  };

  const completeInterview = () => {
    const totalResponses = Object.keys(responses).length;
    const totalDuration = Object.values(responses).reduce((sum: number, response: any) => sum + response.duration, 0);
    const averageWordsPerAnswer = Object.values(responses).reduce((sum: number, response: any) => sum + response.wordCount, 0) / totalResponses;

    const completionMessage: ChatMessage = {
      id: 'completion',
      type: 'system',
      content: `🎉 تم إكمال المقابلة بنجاح! شكراً لك على وقتك والإجابات المفصلة. تم تسجيل ${totalResponses} إجابات خلال ${Math.floor(totalDuration / 60)} دقيقة. سنقوم الآن بتحليل إجاباتك وتقييم أدائك في المقابلة.`,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, completionMessage]);

    // Calculate performance metrics
    const performance = calculateInterviewPerformance(totalResponses, interviewQuestions.length, averageWordsPerAnswer, totalDuration);

    const result = {
      completed: true,
      responses,
      messages: [...messages, completionMessage],
      totalQuestions: interviewQuestions.length,
      completedQuestions: totalResponses,
      totalDuration,
      averageWordsPerAnswer,
      performance,
      completedAt: new Date().toISOString()
    };

    setTimeout(() => {
      toast({
        title: "تم إكمال المقابلة النصية!",
        description: "سيتم الآن تحليل إجاباتك لإعداد التقييم النهائي",
        duration: 5000
      });

      onComplete(result);
    }, 3000);
  };

  const calculateInterviewPerformance = (completed: number, total: number, avgWords: number, totalTime: number) => {
    const completionRate = (completed / total) * 100;
    const avgTimePerQuestion = totalTime / completed;
    
    let score = 0;
    
    // Completion rate (40% of score)
    score += (completionRate / 100) * 40;
    
    // Answer quality based on word count (30% of score)
    if (avgWords >= 50) score += 30;
    else if (avgWords >= 30) score += 20;
    else if (avgWords >= 15) score += 10;
    
    // Time management (30% of score)
    if (avgTimePerQuestion >= 60 && avgTimePerQuestion <= 180) score += 30;
    else if (avgTimePerQuestion >= 30 && avgTimePerQuestion <= 240) score += 20;
    else score += 10;

    if (score >= 85) return 'ممتاز';
    if (score >= 75) return 'جيد جداً';
    if (score >= 60) return 'جيد';
    return 'يحتاج تحسين';
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
            تم إكمال المقابلة النصية بنجاح!
          </h3>
          <p className="text-gray-600">
            شكراً لك على الوقت والإجابات المفصلة والصادقة
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
              <div className="text-2xl font-bold text-purple-600">{Math.floor(data.averageWordsPerAnswer)}</div>
              <div className="text-sm text-gray-600">متوسط الكلمات</div>
            </div>
            <div>
              <Badge className={`${data.performance === 'ممتاز' ? 'bg-green-100 text-green-800' : 
                data.performance === 'جيد جداً' ? 'bg-blue-100 text-blue-800' : 
                'bg-yellow-100 text-yellow-800'}`}>
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-4xl mx-auto"
    >
      {/* Header */}
      <div className="text-center mb-6">
        <motion.div
          animate={{ 
            scale: [1, 1.05, 1],
            rotate: [0, 2, -2, 0]
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="inline-block mb-4"
        >
          <MessageCircle className="w-12 h-12 text-blue-500" />
        </motion.div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          المقابلة النصية التفاعلية
        </h3>
        <p className="text-gray-600">
          أجب على الأسئلة بصراحة ووضوح - تذكر أن هذا تقييم صادق لشركة طبية
        </p>
      </div>

      {/* Progress */}
      <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            السؤال {currentQuestion + 1} من {interviewQuestions.length}
          </span>
          <Badge variant="outline">مقابلة طبية</Badge>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className={`h-2 rounded-full bg-gradient-to-r ${getPersonaColor()}`}
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestion + 1) / interviewQuestions.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </Card>

      {/* Chat Container */}
      <Card className="h-96 overflow-hidden">
        <div className="h-full flex flex-col">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex ${message.type === 'answer' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-3 max-w-[80%] ${message.type === 'answer' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.type === 'answer' ? 'bg-blue-500' : 
                      message.type === 'system' ? 'bg-green-500' : 'bg-purple-500'
                    }`}>
                      {message.type === 'answer' ? 
                        <User className="w-4 h-4 text-white" /> :
                        <Bot className="w-4 h-4 text-white" />
                      }
                    </div>
                    <div className={`p-3 rounded-lg ${
                      message.type === 'answer' ? 
                        'bg-blue-500 text-white ml-2' : 
                        message.type === 'system' ?
                        'bg-green-100 text-green-800' :
                        'bg-white border shadow-sm'
                    }`}>
                      {message.category && (
                        <Badge variant="secondary" className="mb-2 text-xs">
                          {message.category}
                        </Badge>
                      )}
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </p>
                      <p className="text-xs opacity-70 mt-2">
                        {new Date(message.timestamp).toLocaleTimeString('ar-SA')}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing Indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="flex gap-3 items-center">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-gray-200 p-3 rounded-lg">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" />
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          {!data.completed && currentQuestion < interviewQuestions.length && (
            <div className="p-4 border-t bg-white">
              <div className="flex gap-2">
                <Textarea
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  placeholder="اكتب إجابتك هنا... كن صادقاً ومفصلاً"
                  className="flex-1 min-h-[60px] max-h-[120px] text-right"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.ctrlKey) {
                      e.preventDefault();
                      handleSendAnswer();
                    }
                  }}
                />
                <div className="flex flex-col gap-2">
                  <Button
                    onClick={handleSendAnswer}
                    disabled={!currentAnswer.trim() || isTyping}
                    className={`bg-gradient-to-r ${getPersonaColor()}`}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowTips(!showTips)}
                    disabled={isTyping}
                  >
                    <Lightbulb className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              {/* Tips */}
              {showTips && interviewQuestions[currentQuestion]?.tips && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800">نصائح للإجابة:</span>
                  </div>
                  <ul className="space-y-1 text-sm text-yellow-700">
                    {interviewQuestions[currentQuestion].tips.map((tip: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-yellow-500 mt-1">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                <span>
                  {currentAnswer.length} حرف، {currentAnswer.split(/\s+/).filter(w => w.length > 0).length} كلمة
                </span>
                <span>اضغط Ctrl+Enter للإرسال</span>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Interview Stats */}
      {Object.keys(responses).length > 0 && (
        <Card className="p-4 bg-gray-50">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-600" />
              <span>تم الإجابة على {Object.keys(responses).length} أسئلة</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-600" />
              <span>
                {startTime ? `${Math.floor((new Date().getTime() - startTime.getTime()) / 60000)} دقيقة` : ''}
              </span>
            </div>
          </div>
        </Card>
      )}
    </motion.div>
  );
};

export default ChatInterview;
