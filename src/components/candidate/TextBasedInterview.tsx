import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Send, Clock, User, Bot, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Question {
  id: number;
  category: string;
  question: string;
  purpose: string;
  expectedPoints: string[];
}

interface ChatMessage {
  id: number;
  type: 'question' | 'answer' | 'system';
  content: string;
  timestamp: Date;
  category?: string;
  questionId?: number;
}

interface TextBasedInterviewProps {
  candidateId: string;
  onComplete: (interviewData: any) => void;
  cvAnalysis?: any;
  basicInfo?: any;
}

const TextBasedInterview: React.FC<TextBasedInterviewProps> = ({
  candidateId,
  onComplete,
  cvAnalysis,
  basicInfo
}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentResponse, setCurrentResponse] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [sessionId, setSessionId] = useState('');
  const [startTime, setStartTime] = useState(new Date());
  const [isInterviewComplete, setIsInterviewComplete] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    initializeInterview();
  }, [candidateId, cvAnalysis]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeInterview = async () => {
    try {
      setIsLoading(true);
      
      const response = await window.ezsite.apis.run({
        path: 'generateInterviewQuestions',
        param: [candidateId, cvAnalysis || {}, basicInfo || {}]
      });

      if (response.error) {
        throw new Error(response.error);
      }

      const interviewData = response.data;
      setQuestions(interviewData.questions || []);
      setSessionId(interviewData.sessionId || '');
      setStartTime(new Date());

      // Add welcome messages
      const welcomeMessages: ChatMessage[] = [
        {
          id: 1,
          type: 'system',
          content: 'أهلاً وسهلاً بك في مقابلة شركة ميس للمشاريع الطبية',
          timestamp: new Date()
        },
        {
          id: 2,
          type: 'system',
          content: `سيتم طرح ${interviewData.questions?.length || 0} أسئلة عليك. خذ وقتك في الإجابة وكن صادقاً ومفصلاً`,
          timestamp: new Date()
        }
      ];

      setMessages(welcomeMessages);

      // Start with first question after a delay
      setTimeout(() => {
        if (interviewData.questions && interviewData.questions[0]) {
          addQuestionMessage(interviewData.questions[0]);
        }
      }, 2000);

    } catch (error) {
      console.error('Interview initialization error:', error);
      toast({
        title: 'خطأ',
        description: 'فشل في بدء المقابلة. يرجى المحاولة مرة أخرى.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addQuestionMessage = (question: Question) => {
    const questionMessage: ChatMessage = {
      id: Date.now(),
      type: 'question',
      content: question.question,
      timestamp: new Date(),
      category: question.category,
      questionId: question.id
    };

    setMessages(prev => [...prev, questionMessage]);
  };

  const handleSendResponse = async () => {
    if (!currentResponse.trim()) return;

    const currentQuestion = questions[currentQuestionIndex];
    
    // Add user response to chat
    const responseMessage: ChatMessage = {
      id: Date.now(),
      type: 'answer',
      content: currentResponse,
      timestamp: new Date(),
      questionId: currentQuestion?.id
    };

    setMessages(prev => [...prev, responseMessage]);

    // Save response to backend
    try {
      await saveResponse(currentQuestion.id, currentResponse);
    } catch (error) {
      console.error('Error saving response:', error);
    }

    setCurrentResponse('');

    // Move to next question
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        const nextIndex = currentQuestionIndex + 1;
        setCurrentQuestionIndex(nextIndex);
        addQuestionMessage(questions[nextIndex]);
      } else {
        completeInterview();
      }
    }, 1500);
  };

  const saveResponse = async (questionId: number, response: string) => {
    try {
      // This would save the individual response
      // For now, we'll collect all responses and save them together at the end
      console.log('Saving response for question', questionId, ':', response);
    } catch (error) {
      console.error('Error saving response:', error);
    }
  };

  const completeInterview = async () => {
    setIsInterviewComplete(true);
    
    // Add completion message
    const completionMessage: ChatMessage = {
      id: Date.now(),
      type: 'system',
      content: 'شكراً لك! تم إكمال المقابلة. سيتم تقييم إجاباتك قريباً.',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, completionMessage]);

    try {
      const endTime = new Date();
      const responses = messages
        .filter(msg => msg.type === 'answer')
        .map(msg => ({
          questionId: msg.questionId,
          answer: msg.content,
          timestamp: msg.timestamp
        }));

      const interviewData = {
        sessionId,
        responses,
        startTime,
        endTime,
        duration: Math.round((endTime.getTime() - startTime.getTime()) / 1000),
        completed: true
      };

      // Evaluate interview using Gemini API
      const evaluationResponse = await window.ezsite.apis.run({
        path: 'evaluateInterview',
        param: [candidateId, sessionId, responses, cvAnalysis || {}, basicInfo || {}]
      });

      if (evaluationResponse.error) {
        throw new Error(evaluationResponse.error);
      }

      // Call parent completion handler
      onComplete({
        ...interviewData,
        evaluation: evaluationResponse.data
      });

      toast({
        title: 'تم إكمال المقابلة',
        description: 'شكراً لك! سيتواصل معك فريق التوظيف قريباً.',
        duration: 5000
      });

    } catch (error) {
      console.error('Error completing interview:', error);
      toast({
        title: 'تحذير',
        description: 'تم حفظ المقابلة ولكن حدث خطأ في التقييم',
        variant: 'destructive'
      });
      
      // Still call completion handler with basic data
      onComplete({
        sessionId,
        responses: messages.filter(msg => msg.type === 'answer'),
        startTime,
        endTime: new Date(),
        completed: true
      });
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleTimeString('ar-SA', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-[400px] space-y-4"
      >
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        <p className="text-lg text-gray-600">جاري إعداد أسئلة المقابلة...</p>
        <p className="text-sm text-gray-500">يتم تخصيص الأسئلة حسب سيرتك الذاتية</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      {/* Interview Header */}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">المقابلة الشخصية</h2>
            <p className="text-green-100">شركة ميس للمشاريع الطبية</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5" />
              <span>السؤال {currentQuestionIndex + 1} من {questions.length}</span>
            </div>
            <Badge variant="secondary" className="bg-white/20 text-white">
              {questions[currentQuestionIndex]?.category || 'عام'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <Card className="h-[500px] flex flex-col">
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex ${message.type === 'answer' ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.type === 'answer'
                      ? 'bg-blue-100 text-blue-900 ml-4'
                      : message.type === 'question'
                      ? 'bg-green-100 text-green-900 mr-4'
                      : 'bg-gray-100 text-gray-700 mx-auto text-center'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {message.type === 'answer' ? (
                      <User className="w-4 h-4" />
                    ) : message.type === 'question' ? (
                      <Bot className="w-4 h-4" />
                    ) : (
                      <CheckCircle className="w-4 h-4" />
                    )}
                    <span className="text-sm opacity-70">
                      {formatTimestamp(message.timestamp)}
                    </span>
                    {message.category && (
                      <Badge variant="outline" className="text-xs">
                        {message.category}
                      </Badge>
                    )}
                  </div>
                  <p className="whitespace-pre-wrap leading-relaxed">
                    {message.content}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </CardContent>

        {/* Response Input */}
        {!isInterviewComplete && currentQuestionIndex < questions.length && (
          <div className="border-t p-4 space-y-3">
            <Textarea
              placeholder="اكتب إجابتك هنا... كن مفصلاً وصادقاً في إجابتك"
              value={currentResponse}
              onChange={(e) => setCurrentResponse(e.target.value)}
              className="min-h-[100px] resize-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                  handleSendResponse();
                }
              }}
            />
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">
                اضغط Ctrl + Enter للإرسال
              </p>
              <Button
                onClick={handleSendResponse}
                disabled={!currentResponse.trim()}
                className="bg-green-600 hover:bg-green-700"
              >
                <Send className="w-4 h-4 ml-2" />
                إرسال الإجابة
              </Button>
            </div>
          </div>
        )}

        {/* Interview Complete */}
        {isInterviewComplete && (
          <div className="border-t p-4 bg-green-50">
            <div className="flex items-center justify-center space-x-2 space-x-reverse">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-700 font-medium">
                تم إكمال المقابلة بنجاح
              </span>
            </div>
          </div>
        )}
      </Card>

      {/* Progress Indicator */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>التقدم في المقابلة</span>
          <span>{Math.round((currentQuestionIndex / questions.length) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="h-2 bg-gradient-to-r from-green-500 to-blue-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(currentQuestionIndex / questions.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default TextBasedInterview;