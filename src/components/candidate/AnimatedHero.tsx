
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sparkles, Rocket, Users } from 'lucide-react';

interface AnimatedHeroProps {
  onStart: () => void;
  persona: string;
}

const AnimatedHero: React.FC<AnimatedHeroProps> = ({ onStart, persona }) => {
  const getPersonaConfig = () => {
    switch (persona) {
      case 'designer':
        return {
          title: 'أطلق إبداعك في عالم التصميم',
          subtitle: 'انضم لفريق المصممين المبدعين وابدأ رحلتك المهنية',
          icon: Sparkles,
          gradient: 'from-pink-400 to-purple-600'
        };
      case 'marketer':
        return {
          title: 'قد مستقبل التسويق الرقمي',
          subtitle: 'كن جزءاً من ثورة التسويق الإبداعي والابتكار',
          icon: Users,
          gradient: 'from-green-400 to-blue-600'
        };
      default:
        return {
          title: 'ابني مستقبلك التقني معنا',
          subtitle: 'انضم لفريق المطورين والمبرمجين في رحلة الابتكار',
          icon: Rocket,
          gradient: 'from-blue-400 to-cyan-600'
        };
    }
  };

  const config = getPersonaConfig();
  const Icon = config.icon;

  return (
    <section className="relative py-20 px-6 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-96 h-96 bg-gradient-to-r ${config.gradient} opacity-10 rounded-full blur-3xl`}
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 2
            }}
            style={{
              right: `${20 + i * 15}%`,
              top: `${10 + i * 10}%`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="inline-block mb-6"
          >
            <Icon className={`w-16 h-16 text-transparent bg-gradient-to-r ${config.gradient} bg-clip-text`} />
          </motion.div>

          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <span className={`bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}>
              {config.title}
            </span>
          </motion.h1>

          <motion.p 
            className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            {config.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={onStart}
              size="lg"
              className={`px-12 py-4 text-lg font-semibold bg-gradient-to-r ${config.gradient} hover:shadow-2xl transition-all duration-300 border-0`}
            >
              ابدأ رحلة التقديم
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="mr-2"
              >
                ←
              </motion.span>
            </Button>
          </motion.div>
        </motion.div>

        {/* Floating stats */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          {[
            { number: '500+', label: 'مرشح ناجح' },
            { number: '95%', label: 'معدل الرضا' },
            { number: '24/7', label: 'دعم مستمر' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
              whileHover={{ y: -5, shadow: "0 20px 40px rgba(0,0,0,0.1)" }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h3 className={`text-3xl font-bold bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}>
                {stat.number}
              </h3>
              <p className="text-gray-600 mt-2">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default AnimatedHero;
