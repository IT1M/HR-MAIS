import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { User, ArrowLeft, Stethoscope, GraduationCap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BasicInfoStepProps {
  data: any;
  onComplete: (data: any) => void;
  persona: string;
  theme: string;
}

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({
  data,
  onComplete,
  persona,
  theme
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    experience: '',
    education: '',
    specialization: '',
    expectedSalary: '',
    jobDescription: '',
    ...data
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();

  const medicalSpecializations = [
    { value: 'general_medicine', label: 'الطب العام' },
    { value: 'cardiology', label: 'أمراض القلب' },
    { value: 'neurology', label: 'الأمراض العصبية' },
    { value: 'orthopedics', label: 'جراحة العظام' },
    { value: 'pediatrics', label: 'طب الأطفال' },
    { value: 'radiology', label: 'الأشعة التشخيصية' },
    { value: 'anesthesia', label: 'التخدير' },
    { value: 'emergency', label: 'طب الطوارئ' },
    { value: 'surgery', label: 'الجراحة العامة' },
    { value: 'dermatology', label: 'الأمراض الجلدية' },
    { value: 'psychiatry', label: 'الطب النفسي' },
    { value: 'ophthalmology', label: 'طب العيون' },
    { value: 'ent', label: 'أنف وأذن وحنجرة' },
    { value: 'gynecology', label: 'أمراض النساء والولادة' },
    { value: 'urology', label: 'المسالك البولية' },
    { value: 'oncology', label: 'علاج الأورام' },
    { value: 'pathology', label: 'علم الأمراض' },
    { value: 'laboratory', label: 'الطب المخبري' },
    { value: 'nursing', label: 'التمريض' },
    { value: 'pharmacy', label: 'الصيدلة' },
    { value: 'medical_tech', label: 'التقنيات الطبية' },
    { value: 'physiotherapy', label: 'العلاج الطبيعي' },
    { value: 'nutrition', label: 'التغذية العلاجية' },
    { value: 'biomedical', label: 'الهندسة الطبية الحيوية' },
    { value: 'health_admin', label: 'إدارة المرافق الصحية' },
    { value: 'public_health', label: 'الصحة العامة' },
    { value: 'medical_research', label: 'البحوث الطبية' },
    { value: 'other', label: 'أخرى' }
  ];

  const experienceLevels = [
    { value: 'fresh', label: 'خريج جديد (أقل من سنة)' },
    { value: '1-3', label: '1-3 سنوات' },
    { value: '3-5', label: '3-5 سنوات' },
    { value: '5-10', label: '5-10 سنوات' },
    { value: '10+', label: 'أكثر من 10 سنوات' }
  ];

  const educationLevels = [
    { value: 'diploma', label: 'دبلوم' },
    { value: 'bachelor', label: 'بكالوريوس' },
    { value: 'master', label: 'ماجستير' },
    { value: 'phd', label: 'دكتوراه' },
    { value: 'board', label: 'البورد السعودي/العربي' },
    { value: 'fellowship', label: 'زمالة' },
    { value: 'other', label: 'أخرى' }
  ];

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'الاسم الكامل مطلوب';
    if (!formData.email.trim()) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'البريد الإلكتروني غير صحيح';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'رقم الهاتف مطلوب';
    } else if (!/^[+]?[0-9]{10,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'رقم الهاتف غير صحيح';
    }
    if (!formData.experience) newErrors.experience = 'سنوات الخبرة مطلوبة';
    if (!formData.education) newErrors.education = 'المؤهل التعليمي مطلوب';
    if (!formData.specialization) newErrors.specialization = 'التخصص الطبي مطلوب';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Save to localStorage for later steps
      localStorage.setItem('candidateData', JSON.stringify({
        basicInfo: formData,
        id: null
      }));

      onComplete(formData);
      
      toast({
        title: "تم حفظ المعلومات الأساسية",
        description: "يمكنك الآن الانتقال لرفع السيرة الذاتية",
        duration: 3000
      });
    }
  };

  const getPersonaGradient = () => {
    switch (persona) {
      case 'medical':
        return 'from-green-500 to-blue-600';
      case 'designer':
        return 'from-pink-400 to-purple-600';
      case 'marketer':
        return 'from-green-400 to-blue-600';
      default:
        return 'from-green-500 to-blue-600';
    }
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <User className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${getPersonaGradient()} bg-clip-text text-transparent`} />
        <h2 className="text-3xl font-bold mb-2 text-gray-800">
          المعلومات الأساسية
        </h2>
        <p className="text-gray-600">
          أدخل معلوماتك الشخصية والمهنية للبدء في عملية التقديم لشركة ميس
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid md:grid-cols-2 gap-6"
      >
        {/* Personal Information */}
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg border-r-4 border-blue-400">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-blue-600" />
              المعلومات الشخصية
            </h3>

            <div className="space-y-4">
              <div>
                <Label htmlFor="fullName" className="text-gray-700 font-medium">
                  الاسم الكامل *
                </Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  placeholder="أدخل اسمك الكامل"
                  className={errors.fullName ? 'border-red-500' : ''}
                  dir="rtl"
                />
                {errors.fullName && (
                  <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  البريد الإلكتروني *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="example@mais.com"
                  className={errors.email ? 'border-red-500' : ''}
                  dir="ltr"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <Label htmlFor="phone" className="text-gray-700 font-medium">
                  رقم الهاتف *
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="+966 50 123 4567"
                  className={errors.phone ? 'border-red-500' : ''}
                  dir="ltr"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Professional Information */}
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border-r-4 border-green-400">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
              <Stethoscope className="w-5 h-5 mr-2 text-green-600" />
              المعلومات المهنية
            </h3>

            <div className="space-y-4">
              <div>
                <Label className="text-gray-700 font-medium">
                  التخصص الطبي *
                </Label>
                <Select
                  value={formData.specialization}
                  onValueChange={(value) => handleChange('specialization', value)}
                >
                  <SelectTrigger className={errors.specialization ? 'border-red-500' : ''}>
                    <SelectValue placeholder="اختر تخصصك الطبي" />
                  </SelectTrigger>
                  <SelectContent>
                    {medicalSpecializations.map((spec) => (
                      <SelectItem key={spec.value} value={spec.value}>
                        {spec.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.specialization && (
                  <p className="text-red-500 text-sm mt-1">{errors.specialization}</p>
                )}
              </div>

              <div>
                <Label className="text-gray-700 font-medium">
                  سنوات الخبرة *
                </Label>
                <Select
                  value={formData.experience}
                  onValueChange={(value) => handleChange('experience', value)}
                >
                  <SelectTrigger className={errors.experience ? 'border-red-500' : ''}>
                    <SelectValue placeholder="اختر مستوى خبرتك" />
                  </SelectTrigger>
                  <SelectContent>
                    {experienceLevels.map((exp) => (
                      <SelectItem key={exp.value} value={exp.value}>
                        {exp.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.experience && (
                  <p className="text-red-500 text-sm mt-1">{errors.experience}</p>
                )}
              </div>

              <div>
                <Label className="text-gray-700 font-medium">
                  المؤهل التعليمي *
                </Label>
                <Select
                  value={formData.education}
                  onValueChange={(value) => handleChange('education', value)}
                >
                  <SelectTrigger className={errors.education ? 'border-red-500' : ''}>
                    <SelectValue placeholder="اختر مؤهلك التعليمي" />
                  </SelectTrigger>
                  <SelectContent>
                    {educationLevels.map((edu) => (
                      <SelectItem key={edu.value} value={edu.value}>
                        {edu.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.education && (
                  <p className="text-red-500 text-sm mt-1">{errors.education}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Additional Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-6"
      >
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border-r-4 border-purple-400">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
            <GraduationCap className="w-5 h-5 mr-2 text-purple-600" />
            معلومات إضافية (اختيارية)
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expectedSalary" className="text-gray-700 font-medium">
                الراتب المتوقع (ريال سعودي)
              </Label>
              <Input
                id="expectedSalary"
                value={formData.expectedSalary}
                onChange={(e) => handleChange('expectedSalary', e.target.value)}
                placeholder="مثال: 15,000 - 20,000"
                dir="rtl"
              />
            </div>

            <div>
              <Label htmlFor="jobDescription" className="text-gray-700 font-medium">
                الوظيفة المرغوبة
              </Label>
              <Input
                id="jobDescription"
                value={formData.jobDescription}
                onChange={(e) => handleChange('jobDescription', e.target.value)}
                placeholder="مثال: طبيب مقيم - أمراض القلب"
                dir="rtl"
              />
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex justify-center"
      >
        <Button
          onClick={handleSubmit}
          className={`bg-gradient-to-r ${getPersonaGradient()} hover:opacity-90 text-white px-8 py-3 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-3`}
        >
          حفظ والانتقال لرفع السيرة الذاتية
          <ArrowLeft className="w-5 h-5" />
        </Button>
      </motion.div>
    </div>
  );
};

export default BasicInfoStep;