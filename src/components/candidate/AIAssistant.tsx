
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Bot, X, MessageCircle, Lightbulb } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AIAssistantProps {
  persona: string;
  currentStep: number;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ persona, currentStep }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{id: number;text: string;type: 'tip' | 'help';}>>([]);
  const { toast } = useToast();

  const stepTips = {
    0: [
    'تأكد من كتابة اسمك الكامل كما يظهر في الوثائق الرسمية',
    'اختر التخصص الذي يتناسب أكثر مع خبراتك ومهاراتك',
    'كن صادقاً في تحديد مستوى خبرتك - سيساعدنا في إيجاد الوظيفة المناسبة لك'],

    1: [
    'تأكد من أن السيرة الذاتية محدثة وتحتوي على أحدث خبراتك',
    'يُفضل أن تكون السيرة الذاتية بصيغة PDF للحصول على أفضل جودة',
    'يمكنك معاينة السيرة الذاتية قبل الإرسال للتأكد من صحة المعلومات'],

    2: [
    'سيقوم الذكاء الاصطناعي بتحليل سيرتك الذاتية وتقديم نصائح مفيدة',
    'راجع النتائج بعناية واستفد من الاقتراحات المقدمة',
    'يمكنك استخدام هذه النتائج لتحسين سيرتك الذاتية مستقبلاً'],

    3: [
    'اقرأ الأسئلة بعناية قبل الإجابة',
    'لا تتسرع في الإجابة - خذ وقتك للتفكير',
    'اختر الإجابة التي تعبر عن شخصيتك وخبرتك الحقيقية'],

    4: [
    'تحدث بوضوح وثقة أمام الكاميرا',
    'اختر مكاناً هادئاً ومضاءً بشكل جيد للتسجيل',
    'راجع الأسئلة مسبقاً وفكر في إجاباتك'],

    5: [
    'راجع جميع المعلومات المقدمة للتأكد من صحتها',
    'تابع حالة طلبك من خلال البريد الإلكتروني',
    'سنتواصل معك خلال 3-5 أيام عمل']

  };

  useEffect(() => {
    if (currentStep >= 0 && currentStep <= 5) {
      const tips = stepTips[currentStep as keyof typeof stepTips];
      const randomTip = tips[Math.floor(Math.random() * tips.length)];

      toast({
        title: "💡 نصيحة مفيدة",
        description: randomTip,
        duration: 5000
      });
    }
  }, [currentStep, toast]);

  const getPersonaGreeting = () => {
    switch (persona) {
      case 'designer':
        return 'مرحباً أيها المصمم المبدع! 🎨';
      case 'marketer':
        return 'أهلاً بك أيها المسوق الذكي! 📈';
      default:
        return 'مرحباً بك أيها المطور المتميز! 💻';
    }
  };

  const showRandomTip = () => {
    const allTips = Object.values(stepTips).flat();
    const randomTip = allTips[Math.floor(Math.random() * allTips.length)];

    const newMessage = {
      id: Date.now(),
      text: randomTip,
      type: 'tip' as const
    };

    setMessages((prev) => [...prev, newMessage]);

    // Remove message after 8 seconds
    setTimeout(() => {
      setMessages((prev) => prev.filter((msg) => msg.id !== newMessage.id));
    }, 8000);
  };

  return (
    <>
      {/* AI Assistant Button */}
      <motion.button
        className="fixed left-6 bottom-6 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg flex items-center justify-center text-white z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{
          boxShadow: [
          "0 0 20px rgba(59, 130, 246, 0.5)",
          "0 0 30px rgba(147, 51, 234, 0.5)",
          "0 0 20px rgba(59, 130, 246, 0.5)"]

        }}
        transition={{ duration: 2, repeat: Infinity }}
        onClick={() => setIsOpen(!isOpen)}>

        <Bot className="w-8 h-8" />
      </motion.button>

      {/* Assistant Panel */}
      <AnimatePresence>
        {isOpen &&
        <motion.div
          initial={{ opacity: 0, x: -100, y: 20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: -100, y: 20 }}
          className="fixed left-6 bottom-24 w-80 bg-white rounded-2xl shadow-2xl p-6 z-50 border">

            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <Bot className="w-5 h-5 text-blue-500" />
                المساعد الذكي
              </h3>
              <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600">

                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                <p className="text-sm text-gray-700">
                  {getPersonaGreeting()}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  أنا هنا لمساعدتك في رحلة التقديم
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                onClick={showRandomTip}
                size="sm"
                variant="outline"
                className="flex-1 text-xs">

                  <Lightbulb className="w-4 h-4 ml-1" />
                  نصيحة
                </Button>
                <Button
                size="sm"
                variant="outline"
                className="flex-1 text-xs">

                  <MessageCircle className="w-4 h-4 ml-1" />
                  مساعدة
                </Button>
              </div>
            </div>
          </motion.div>
        }
      </AnimatePresence>

      {/* Floating Messages */}
      <div className="fixed left-6 bottom-96 z-50 space-y-2">
        <AnimatePresence>
          {messages.map((message) =>
          <motion.div
            key={message.id}
            initial={{ opacity: 0, x: -50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -50, scale: 0.9 }}
            className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white p-3 rounded-lg shadow-lg max-w-xs">

              <div className="flex items-start gap-2">
                <Lightbulb className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <p className="text-sm">{message.text}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>);

};

export default AIAssistant;