import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, Shield, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';

interface ConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

const ConsentModal: React.FC<ConsentModalProps> = ({ isOpen, onClose, onAccept }) => {
  const consentItems = [
    {
      icon: Shield,
      title: "حماية البيانات الشخصية",
      description: "نحن ملتزمون بحماية بياناتك الشخصية وفقاً لقوانين الخصوصية السعودية ومعايير شركة ميس للمشاريع الطبية"
    },
    {
      icon: FileText,
      title: "معالجة السيرة الذاتية",
      description: "سيتم تحليل سيرتك الذاتية باستخدام تقنيات الذكاء الاصطناعي المتقدمة لتقييم ملاءمتك للوظائف الطبية"
    },
    {
      icon: CheckCircle2,
      title: "التقييم الطبي المتخصص",
      description: "ستخضع لتقييم شامل يركز على المعايير الطبية والتقنية المطلوبة للعمل في المجال الطبي"
    },
    {
      icon: AlertTriangle,
      title: "السرية والموافقة",
      description: "جميع المعلومات المقدمة ستبقى سرية وستُستخدم فقط لأغراض التوظيف في شركة ميس"
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">م</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      شركة ميس للمشاريع الطبية
                    </h2>
                    <p className="text-gray-600">موافقة على معالجة البيانات</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="space-y-6 mb-8">
                <div className="bg-blue-50 border-r-4 border-blue-400 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">مرحباً بك في عملية التقديم</h3>
                  <p className="text-blue-700 text-sm leading-relaxed">
                    شكراً لك على اهتمامك بالانضمام لفريق شركة ميس للمشاريع الطبية. قبل البدء في عملية التقديم، 
                    يرجى الاطلاع على الشروط التالية والموافقة عليها.
                  </p>
                </div>

                {/* Consent Items */}
                <div className="space-y-4">
                  {consentItems.map((item, index) => {
                    const IconComponent = item.icon;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border"
                      >
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                            <IconComponent className="w-5 h-5 text-white" />
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-1">{item.title}</h4>
                          <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Additional Information */}
                <div className="bg-yellow-50 border-r-4 border-yellow-400 p-4 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-2">معلومات مهمة:</h4>
                  <ul className="text-yellow-700 text-sm space-y-1">
                    <li>• ستستغرق عملية التقديم حوالي 30-45 دقيقة</li>
                    <li>• يمكنك حفظ التقدم والعودة لاحقاً</li>
                    <li>• ستحصل على تقييم مفصل لسيرتك الذاتية</li>
                    <li>• المقابلة ستكون كتابية وتفاعلية</li>
                    <li>• جميع البيانات محمية ومؤمنة</li>
                  </ul>
                </div>

                {/* Medical Field Focus */}
                <div className="bg-green-50 border-r-4 border-green-400 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">التخصص الطبي:</h4>
                  <p className="text-green-700 text-sm leading-relaxed">
                    نحن متخصصون في المشاريع الطبية ونبحث عن مواهب في مختلف التخصصات الطبية والصحية. 
                    سيتم تقييمك وفقاً لمعايير المجال الطبي ومتطلبات السوق السعودي.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-end">
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="sm:order-1"
                >
                  إلغاء
                </Button>
                <Button
                  onClick={onAccept}
                  className="bg-gradient-to-r from-green-500 to-blue-600 hover:opacity-90 text-white sm:order-2"
                >
                  أوافق وابدأ التقديم
                </Button>
              </div>

              {/* Footer */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  بالنقر على "أوافق وابدأ التقديم"، فإنك توافق على معالجة بياناتك الشخصية وفقاً لسياسة الخصوصية الخاصة بنا
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConsentModal;