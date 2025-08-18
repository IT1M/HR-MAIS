
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import BasicInfoStep from './steps/BasicInfoStep';
import CVUploadStep from './steps/CVUploadStep';
import AIAnalysisStep from './steps/AIAnalysisStep';
import ChallengeStep from './steps/ChallengeStep';
import InterviewStep from './steps/InterviewStep';
import EvaluationStep from './steps/EvaluationStep';

interface WizardContainerProps {
  currentStep: number;
  candidateData: any;
  onStepComplete: (data: any) => void;
  onReset: () => void;
  persona: string;
  theme: string;
}

const WizardContainer: React.FC<WizardContainerProps> = ({
  currentStep,
  candidateData,
  onStepComplete,
  onReset,
  persona,
  theme
}) => {
  const steps = [
    { id: 0, title: 'المعلومات الأساسية', component: BasicInfoStep },
    { id: 1, title: 'رفع السيرة الذاتية', component: CVUploadStep },
    { id: 2, title: 'التحليل بالذكاء الاصطناعي', component: AIAnalysisStep },
    { id: 3, title: 'التحدي المهني', component: ChallengeStep },
    { id: 4, title: 'المقابلة التفاعلية', component: InterviewStep },
    { id: 5, title: 'التقييم النهائي', component: EvaluationStep }
  ];

  const CurrentStepComponent = steps[currentStep]?.component;
  const progress = ((currentStep + 1) / steps.length) * 100;

  const getStepKey = (step: number) => {
    const keys = ['basicInfo', 'cv', 'analysis', 'challenge', 'interview', 'evaluation'];
    return keys[step];
  };

  const getPersonaGradient = () => {
    switch (persona) {
      case 'designer':
        return 'from-pink-400 to-purple-600';
      case 'marketer':
        return 'from-green-400 to-blue-600';
      default:
        return 'from-blue-400 to-cyan-600';
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      {/* Progress Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {steps[currentStep]?.title}
          </h2>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>الخطوة {currentStep + 1} من {steps.length}</span>
          </div>
        </div>
        
        <div className="relative">
          <Progress value={progress} className="h-3 bg-gray-200" />
          <motion.div
            className={`absolute top-0 left-0 h-3 bg-gradient-to-r ${getPersonaGradient()} rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>

        {/* Steps indicator */}
        <div className="flex justify-between mt-4">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex flex-col items-center ${
                index <= currentStep ? 'text-blue-600' : 'text-gray-400'
              }`}
            >
              <motion.div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  index <= currentStep
                    ? `bg-gradient-to-r ${getPersonaGradient()} text-white`
                    : 'bg-gray-200 text-gray-500'
                }`}
                initial={{ scale: 0.8 }}
                animate={{ 
                  scale: index === currentStep ? 1.1 : 1,
                  rotate: index <= currentStep ? 360 : 0
                }}
                transition={{ duration: 0.3 }}
              >
                {index + 1}
              </motion.div>
              <span className="text-xs mt-1 text-center max-w-20 hidden md:block">
                {step.title}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Step Content */}
      <motion.div
        className="bg-white rounded-2xl shadow-lg p-8 min-h-[600px]"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <AnimatePresence mode="wait">
          {CurrentStepComponent && (
            <CurrentStepComponent
              key={currentStep}
              data={candidateData[getStepKey(currentStep)] || {}}
              onComplete={onStepComplete}
              persona={persona}
              theme={theme}
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        className="flex justify-between items-center mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Button
          onClick={onReset}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          إعادة تعيين
        </Button>

        {currentStep === steps.length - 1 && (
          <Button
            onClick={() => onReset()}
            className={`bg-gradient-to-r ${getPersonaGradient()} hover:opacity-90 flex items-center gap-2`}
          >
            تطبيق جديد
            <ArrowLeft className="w-4 h-4" />
          </Button>
        )}
      </motion.div>
    </div>
  );
};

export default WizardContainer;
