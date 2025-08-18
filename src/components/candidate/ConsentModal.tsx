
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Shield, Check, X } from 'lucide-react';

interface ConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

const ConsentModal: React.FC<ConsentModalProps> = ({ isOpen, onClose, onAccept }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="inline-block mb-4"
              >
                <Shield className="w-16 h-16 text-blue-500 mx-auto" />
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                موافقة على معالجة البيانات الشخصية
              </h2>
              <p className="text-gray-600">
                يرجى قراءة والموافقة على سياسة الخصوصية قبل المتابعة
              </p>
            </div>

            <div className="space-y-4 mb-8 text-right">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2 flex items-center justify-end gap-2">
                  <Check className="w-5 h-5" />
                  جمع البيانات
                </h3>
                <p className="text-blue-700 text-sm leading-relaxed">
                  نقوم بجمع البيانات الأساسية والسيرة الذاتية فقط لأغراض التقييم والتوظيف.
                  لن نشارك معلوماتك مع أطراف ثالثة دون موافقتك الصريحة.
                </p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2 flex items-center justify-end gap-2">
                  <Check className="w-5 h-5" />
                  أمان البيانات
                </h3>
                <p className="text-green-700 text-sm leading-relaxed">
                  تخزن جميع البيانات بشكل آمن ومشفر. نستخدم أحدث تقنيات الأمان لحماية معلوماتك الشخصية.
                </p>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-800 mb-2 flex items-center justify-end gap-2">
                  <Check className="w-5 h-5" />
                  التحليل بالذكاء الاصطناعي
                </h3>
                <p className="text-purple-700 text-sm leading-relaxed">
                  نستخدم الذكاء الاصطناعي لتحليل سيرتك الذاتية وتقديم اقتراحات لتحسينها.
                  جميع التحليلات تتم بشكل آمن ومحمي.
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center justify-end gap-2">
                  <Check className="w-5 h-5" />
                  حقوقك
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  يمكنك طلب حذف أو تعديل بياناتك في أي وقت. كما يمكنك سحب موافقتك والتوقف عن المشاركة.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1 h-12"
              >
                <X className="w-4 h-4 ml-2" />
                إلغاء
              </Button>
              <Button
                onClick={onAccept}
                className="flex-1 h-12 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                <Check className="w-4 h-4 ml-2" />
                أوافق وأتابع
              </Button>
            </div>

            <p className="text-xs text-gray-500 text-center mt-4">
              بالموافقة، أنت تقر بأنك قرأت وفهمت سياسة الخصوصية وتوافق على معالجة بياناتك وفقاً لها
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConsentModal;
