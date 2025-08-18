import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700" dir="rtl">
            <header className="py-6 px-8 border-b bg-white/80 backdrop-blur-sm">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        {/* شعار الشركة */}
                        <img
                            src="/assets/logo.png"
                            alt="شعار شركة ميس"
                            className="w-12 h-12 object-contain rounded-full bg-white border border-gray-200 shadow"
                            style={{ background: "#fff" }}
                        />
                        <h1 className="text-xl font-bold text-gray-800">Mais Co.</h1>
                    </div>
                    <nav className="space-x-4 space-x-reverse">
                        <Button variant="link">الرئيسية</Button>
                        <Button variant="link">حول الشركة</Button>
                    </nav>
                </div>
            </header>

            <main className="container mx-auto py-12 px-4">
                <motion.section
          className="text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}>

                    {/* شعار الشركة في الصفحة الرئيسية */}
                    <div className="mb-8">
                        <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 bg-white border border-gray-200 shadow"
              style={{ background: "#fff" }}>

                            <img
                                src="/assets/logo.png"
                                alt="شعار شركة ميس"
                                className="w-20 h-20 object-contain rounded-full"
                            />
                        </motion.div>
                        <h2 className="text-2xl font-bold text-green-600 mb-2">Mais Co. For projects Medical</h2>
                        <p className="text-gray-600 dark:text-gray-400">المملكة العربية السعودية</p>
                    </div>

                    <motion.h2
            className="text-5xl font-bold mb-6 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}>

                        منصة التوظيف الطبي الذكية
                    </motion.h2>
                    <motion.p
            className="text-xl text-gray-700 mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}>

                        انضم إلى شركة ميس الرائدة في المشاريع الطبية. منصتنا المتطورة تستخدم الذكاء الاصطناعي لتحليل سيرتك الذاتية وتقييم مهاراتك الطبية بدقة وصراحة
                    </motion.p>

                    <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}>

                        <motion.div
              className="bg-white p-8 rounded-2xl shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 border-t-4 border-green-500"
              whileHover={{ y: -5 }}
              onClick={() => navigate('/candidate')}>

                            <div className="text-4xl mb-4">🩺</div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">بوابة المرشحين الطبيين</h3>
                            <p className="text-gray-600 mb-6">
                                ابدأ رحلة التقديم للوظائف الطبية مع نظام تقييم ذكي وتحليل صادق لمهاراتك الطبية
                            </p>
                            <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 w-full">
                                ابدأ التقديم للوظائف الطبية
                            </Button>
                        </motion.div>

                        <motion.div
              className="bg-white p-8 rounded-2xl shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 border-t-4 border-blue-500"
              whileHover={{ y: -2 }}
              onClick={() => navigate('/admin')}>

                            <div className="text-4xl mb-4">👨‍⚕️</div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">لوحة إدارة الموارد البشرية</h3>
                            <p className="text-gray-600 mb-6">
                                إدارة وتقييم المرشحين الطبيين مع تحليلات متقدمة وتقارير شاملة
                            </p>
                            <Button className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 w-full">
                                دخول لوحة الإدارة
                            </Button>
                        </motion.div>
                    </motion.div>

                    <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}>

                        {[
            { icon: '🧠', title: 'تحليل ذكي للخبرة الطبية', desc: 'تقييم شامل وصادق للسير الذاتية الطبية باستخدام ذكاء جوجل Gemini' },
            { icon: '💬', title: 'مقابلة كتابية متخصصة', desc: 'مقابلة نصية مصممة خصيصاً للمجال الطبي بناءً على تحليل سيرتك الذاتية' },
            { icon: '📋', title: 'تقييم صادق بلا مجاملات', desc: 'تقرير مفصل وصريح عن مهاراتك الطبية ونقاط القوة والتحسين المطلوبة' }].
            map((feature, index) =>
            <motion.div
              key={index}
              className="bg-white/80 p-6 rounded-xl border-t-4 border-green-500"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}>

                                <div className="text-3xl mb-3">{feature.icon}</div>
                                <h4 className="font-bold text-gray-800 mb-2">{feature.title}</h4>
                                <p className="text-gray-600 text-sm">{feature.desc}</p>
                            </motion.div>
            )}
                    </motion.div>

                    {/* Medical Specializations */}
                    <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="mt-16 p-8 bg-gradient-to-r from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-xl">

                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">التخصصات الطبية المطلوبة</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            {[
              '🩺 طب عام', '🫀 طب القلب', '🧠 طب الأعصاب', '👁️ طب العيون',
              '🦴 جراحة العظام', '👶 طب الأطفال', '🏥 طب الطوارئ', '🔬 تحاليل طبية',
              '💉 تمريض', '⚕️ صيدلة', '🩻 أشعة تشخيصية', '🔧 هندسة طبية'].
              map((specialization, index) =>
              <div key={index} className="bg-white dark:bg-gray-800 p-3 rounded-lg text-center shadow-sm">
                                    {specialization}
                                </div>
              )}
                        </div>
                    </motion.div>
                </motion.section>
            </main>

            <footer className="border-t bg-white/80 py-8 mt-auto">
                <div className="container mx-auto px-4 text-center text-gray-600">
                    <p>© {new Date().getFullYear()} شركة ميس للمشاريع الطبية. جميع الحقوق محفوظة.</p>
                </div>
            </footer>
        </div>);

};

export default HomePage;