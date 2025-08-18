import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import AnimatedHero from '@/components/candidate/AnimatedHero';
import WizardContainer from '@/components/candidate/WizardContainer';
import PersonaThemeToggle from '@/components/candidate/PersonaThemeToggle';
import ConsentModal from '@/components/candidate/ConsentModal';
import AIAssistant from '@/components/candidate/AIAssistant';
import VacancySearch from '@/components/candidate/VacancySearch';
import AnimatedBackground from '@/components/candidate/AnimatedBackground';
import NotificationSystem from '@/components/candidate/NotificationSystem';

const CandidatePortal: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [candidateData, setCandidateData] = useState({
    id: null,
    basicInfo: {},
    cv: null,
    analysis: null,
    challenge: null,
    interview: null,
    evaluation: null
  });
  const [showWizard, setShowWizard] = useState(false);
  const [showConsent, setShowConsent] = useState(false);
  const [persona, setPersona] = useState('developer');
  const [theme, setTheme] = useState('light');
  const { toast } = useToast();

  useEffect(() => {
    // Set RTL direction
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = 'ar';
    
    // Apply data attributes for theming
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-persona', persona);
  }, [theme, persona]);

  const handleStartApplication = () => {
    setShowConsent(true);
  };

  const handleConsentAccept = () => {
    setShowConsent(false);
    setShowWizard(true);
    toast({
      title: "مرحباً بك",
      description: "سنرشدك خلال عملية التقديم خطوة بخطوة",
      duration: 3000
    });
  };

  const handleStepComplete = async (stepData: any) => {
    const updatedData = { ...candidateData, [getStepKey(currentStep)]: stepData };
    setCandidateData(updatedData);
    
    // Save to backend
    try {
      if (window.ezsite && window.ezsite.apis) {
        const response = await window.ezsite.apis.run({
          path: "saveCandidateStep",
          param: [currentStep, stepData, candidateData.id]
        });
        
        if (response && response.candidateId) {
          setCandidateData(prev => ({ ...prev, id: response.candidateId }));
        }
      }
    } catch (error) {
      console.error('خطأ في حفظ البيانات:', error);
      toast({
        title: "تحذير",
        description: "حدث خطأ في حفظ البيانات، ولكن يمكنك المتابعة",
        variant: "destructive",
        duration: 3000
      });
    }

    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete application
      toast({
        title: "تم إكمال التقديم!",
        description: "شكراً لك، سنتواصل معك قريباً",
        duration: 5000
      });
    }
  };

  const getStepKey = (step: number) => {
    const keys = ['basicInfo', 'cv', 'analysis', 'challenge', 'interview', 'evaluation'];
    return keys[step];
  };

  const resetApplication = () => {
    setCurrentStep(0);
    setCandidateData({
      id: null,
      basicInfo: {},
      cv: null,
      analysis: null,
      challenge: null,
      interview: null,
      evaluation: null
    });
    setShowWizard(false);
    
    toast({
      title: "تم إعادة تعيين التطبيق",
      description: "يمكنك البدء من جديد",
      duration: 2000
    });
  };

  return (
    <div 
      className={`min-h-screen transition-all duration-500 ${
        theme === 'dark' 
          ? 'bg-gray-900 text-white' 
          : theme === 'high-contrast'
          ? 'bg-black text-yellow-400'
          : 'bg-gradient-to-br from-blue-50 to-purple-50 text-gray-900'
      }`} 
      dir="rtl"
      data-theme={theme}
      data-persona={persona}
    >
      <AnimatedBackground />
      
      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="container mx-auto flex justify-between items-center">
          <motion.h1 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold"
          >
            بوابة المرشحين
          </motion.h1>
          <div className="flex items-center gap-4">
            <NotificationSystem />
            <PersonaThemeToggle 
              persona={persona}
              theme={theme}
              onPersonaChange={setPersona}
              onThemeChange={setTheme}
            />
          </div>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {!showWizard ? (
          <motion.div
            key="hero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <AnimatedHero onStart={handleStartApplication} persona={persona} />
            <VacancySearch />
          </motion.div>
        ) : (
          <motion.div
            key="wizard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="pb-20"
          >
            <WizardContainer
              currentStep={currentStep}
              candidateData={candidateData}
              onStepComplete={handleStepComplete}
              onReset={resetApplication}
              persona={persona}
              theme={theme}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <ConsentModal
        isOpen={showConsent}
        onClose={() => setShowConsent(false)}
        onAccept={handleConsentAccept}
      />

      <AIAssistant persona={persona} currentStep={showWizard ? currentStep : -1} />
    </div>
  );
};

export default CandidatePortal;
