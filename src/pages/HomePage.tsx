import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50" dir="rtl">
            <header className="py-6 px-8 border-b bg-white/80 backdrop-blur-sm">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-xl font-bold text-gray-800">نظام إدارة المرشحين</h1>
                    <nav className="space-x-4 space-x-reverse">
                        <Button variant="link">الرئيسية</Button>
                        <Button variant="link">حول النظام</Button>
                    </nav>
                </div>
            </header>

            <main className="container mx-auto py-12 px-4">
                <motion.section 
                    className="text-center max-w-4xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <motion.h2 
                        className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                    >
                        منصة التوظيف الذكية
                    </motion.h2>
                    <motion.p 
                        className="text-xl text-gray-700 mb-8 leading-relaxed"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                    >
                        نظام متطور لإدارة المرشحين مع تحليل ذكي بالذكاء الاصطناعي، 
                        مقابلات تفاعلية، وتقييم شامل لضمان اختيار أفضل المواهب
                    </motion.p>

                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                    >
                        <motion.div 
                            className="bg-white p-8 rounded-2xl shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300"
                            whileHover={{ y: -5 }}
                            onClick={() => navigate('/candidate')}
                        >
                            <div className="text-4xl mb-4">👤</div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">بوابة المرشحين</h3>
                            <p className="text-gray-600 mb-6">
                                ابدأ رحلة التقديم مع نظام تقييم ذكي وتحليل شامل لمهاراتك وخبراتك
                            </p>
                            <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 w-full">
                                ابدأ التقديم
                            </Button>
                        </motion.div>

                        <motion.div 
                            className="bg-white p-8 rounded-2xl shadow-lg opacity-50 cursor-not-allowed"
                            whileHover={{ y: -2 }}
                        >
                            <div className="text-4xl mb-4">👨‍💼</div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">لوحة الإدارة</h3>
                            <p className="text-gray-600 mb-6">
                                إدارة وتقييم المرشحين مع تحليلات متقدمة وتقارير شاملة (قريباً)
                            </p>
                            <Button disabled className="w-full">
                                قريباً
                            </Button>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8, duration: 0.8 }}
                    >
                        {[
                            { icon: '🤖', title: 'تحليل ذكي', desc: 'تحليل السير الذاتية بالذكاء الاصطناعي' },
                            { icon: '🎯', title: 'تقييم دقيق', desc: 'تحديات وأسئلة مخصصة حسب التخصص' },
                            { icon: '📊', title: 'تقارير شاملة', desc: 'تقارير مفصلة وتوصيات للتوظيف' }
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                className="bg-white/80 p-6 rounded-xl"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 + index * 0.1 }}
                            >
                                <div className="text-3xl mb-3">{feature.icon}</div>
                                <h4 className="font-bold text-gray-800 mb-2">{feature.title}</h4>
                                <p className="text-gray-600 text-sm">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.section>
            </main>

            <footer className="border-t bg-white/80 py-8 mt-auto">
                <div className="container mx-auto px-4 text-center text-gray-600">
                    <p>© {new Date().getFullYear()} نظام إدارة المرشحين. جميع الحقوق محفوظة.</p>
                </div>
            </footer>
        </div>
    );
};

export default HomePage; 