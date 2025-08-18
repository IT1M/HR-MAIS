import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Stethoscope, Heart, Brain, Shield } from 'lucide-react';

interface AnimatedHeroProps {
  onStart: () => void;
  persona: string;
}

const AnimatedHero: React.FC<AnimatedHeroProps> = ({ onStart, persona }) => {
  const getPersonaGradient = () => {
    switch (persona) {
      case 'medical':
        return 'from-green-500 via-blue-500 to-cyan-500';
      case 'designer':
        return 'from-pink-400 to-purple-600';
      case 'marketer':
        return 'from-green-400 to-blue-600';
      default:
        return 'from-green-500 to-blue-600';
    }
  };

  return (
    <div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Medical Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Medical Icons */}
        <motion.div
          className="absolute top-20 right-20 text-green-200 opacity-20"
          animate={{
            y: [-20, 20, -20],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Stethoscope size={60} />
        </motion.div>

        <motion.div
          className="absolute top-40 left-20 text-blue-200 opacity-20"
          animate={{
            y: [20, -20, 20],
            rotate: [0, -10, 10, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        >
          <Heart size={80} />
        </motion.div>

        <motion.div
          className="absolute bottom-40 right-40 text-cyan-200 opacity-20"
          animate={{
            y: [-10, 10, -10],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        >
          <Brain size={50} />
        </motion.div>

        <motion.div
          className="absolute bottom-20 left-40 text-green-200 opacity-20"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <Shield size={70} />
        </motion.div>

        {/* DNA Helix Pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-5" viewBox="0 0 400 400">
          <motion.path
            d="M50 200 Q200 100 350 200 Q200 300 50 200"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            className="text-green-500"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
          />
          <motion.path
            d="M50 200 Q200 300 350 200 Q200 100 50 200"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            className="text-blue-500"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", delay: 1.5 }}
          />
        </svg>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <motion.h1
            className="text-6xl md:text-8xl font-bold mb-6"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className={`bg-gradient-to-r ${getPersonaGradient()} bg-clip-text text-transparent`}>
              انضم إلى
            </span>
            <br />
            <span className="text-green-700">شركة ميس</span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-gray-600 mb-4 leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <strong className="text-green-600">رائدة في المشاريع الطبية</strong>
          </motion.p>

          <motion.p
            className="text-lg md:text-xl text-gray-500 mb-12 leading-relaxed max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            نحن نبحث عن المواهب الطبية المميزة للانضمام إلى فريقنا في تطوير وإدارة المشاريع الطبية المبتكرة في المملكة العربية السعودية
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Button
              onClick={onStart}
              size="lg"
              className={`bg-gradient-to-r ${getPersonaGradient()} hover:opacity-90 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-3`}
            >
              ابدأ التقديم الآن
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </motion.div>

          {/* Medical Stats */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">500+</div>
              <div className="text-sm text-gray-600">مشروع طبي</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
              <div className="text-sm text-gray-600">مستشفى شريك</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-600 mb-2">200+</div>
              <div className="text-sm text-gray-600">متخصص طبي</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">15</div>
              <div className="text-sm text-gray-600">عام من الخبرة</div>
            </div>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            className="grid md:grid-cols-3 gap-6 mt-16"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <Stethoscope className="w-12 h-12 text-green-500 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2 text-gray-800">تقييم طبي شامل</h3>
              <p className="text-gray-600">تحليل متقدم للمؤهلات الطبية باستخدام الذكاء الاصطناعي</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <Heart className="w-12 h-12 text-blue-500 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2 text-gray-800">بيئة عمل مميزة</h3>
              <p className="text-gray-600">فرص وظيفية في أحدث المرافق الطبية والمشاريع المبتكرة</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <Brain className="w-12 h-12 text-cyan-500 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2 text-gray-800">تطوير مهني</h3>
              <p className="text-gray-600">برامج تدريب وتطوير مستمرة في أحدث التقنيات الطبية</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AnimatedHero;