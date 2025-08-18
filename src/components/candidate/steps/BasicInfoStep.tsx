
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { User, Mail, Phone, Briefcase, GraduationCap, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BasicInfoStepProps {
  data: any;
  onComplete: (data: any) => void;
  persona: string;
  theme: string;
}

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({ data, onComplete, persona }) => {
  const [formData, setFormData] = useState({
    fullName: data.fullName || '',
    email: data.email || '',
    phone: data.phone || '',
    experience: data.experience || '',
    education: data.education || '',
    specialization: data.specialization || '',
    expectedSalary: data.expectedSalary || '',
    jobDescription: data.jobDescription || '',
    persona: data.persona || persona
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const experienceLevels = [
    { value: 'fresh', label: 'خريج جديد (0-1 سنة)' },
    { value: 'junior', label: 'مبتدئ (1-3 سنوات)' },
    { value: 'mid', label: 'متوسط الخبرة (3-5 سنوات)' },
    { value: 'senior', label: 'خبير (5+ سنوات)' },
  ];

  const educationLevels = [
    { value: 'highschool', label: 'الثانوية العامة' },
    { value: 'diploma', label: 'دبلوم' },
    { value: 'bachelor', label: 'بكالوريوس' },
    { value: 'master', label: 'ماجستير' },
    { value: 'phd', label: 'دكتوراه' },
  ];

  const specializations = {
    developer: [
      { value: 'frontend', label: 'تطوير الواجهات الأمامية' },
      { value: 'backend', label: 'تطوير الواجهات الخلفية' },
      { value: 'fullstack', label: 'تطوير شامل' },
      { value: 'mobile', label: 'تطوير تطبيقات الجوال' },
      { value: 'devops', label: 'DevOps' },
    ],
    designer: [
      { value: 'uiux', label: 'تصميم UI/UX' },
      { value: 'graphic', label: 'التصميم الجرافيكي' },
      { value: 'web', label: 'تصميم المواقع' },
      { value: 'brand', label: 'تصميم الهوية' },
      { value: 'product', label: 'تصميم المنتجات' },
    ],
    marketer: [
      { value: 'digital', label: 'التسويق الرقمي' },
      { value: 'social', label: 'إدارة وسائل التواصل' },
      { value: 'content', label: 'تسويق المحتوى' },
      { value: 'seo', label: 'تحسين محركات البحث' },
      { value: 'ppc', label: 'الإعلانات المدفوعة' },
    ]
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'الاسم الكامل مطلوب';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'البريد الإلكتروني غير صحيح';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'رقم الهاتف مطلوب';
    }

    if (!formData.experience) {
      newErrors.experience = 'مستوى الخبرة مطلوب';
    }

    if (!formData.education) {
      newErrors.education = 'المستوى التعليمي مطلوب';
    }

    if (!formData.specialization) {
      newErrors.specialization = 'التخصص مطلوب';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onComplete(formData);
      toast({
        title: "تم حفظ المعلومات!",
        description: "تم حفظ المعلومات الأساسية بنجاح",
        duration: 3000
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="inline-block mb-4"
        >
          <User className="w-16 h-16 text-blue-500" />
        </motion.div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          أخبرنا عن نفسك
        </h3>
        <p className="text-gray-600">
          املأ المعلومات الأساسية لبدء رحلة التقديم
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-right flex items-center gap-2">
            <User className="w-4 h-4" />
            الاسم الكامل *
          </Label>
          <Input
            id="fullName"
            value={formData.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            placeholder="أدخل اسمك الكامل"
            className={`text-right ${errors.fullName ? 'border-red-500' : ''}`}
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm text-right">{errors.fullName}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-right flex items-center gap-2">
            <Mail className="w-4 h-4" />
            البريد الإلكتروني *
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="example@domain.com"
            className={`text-right ${errors.email ? 'border-red-500' : ''}`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm text-right">{errors.email}</p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-right flex items-center gap-2">
            <Phone className="w-4 h-4" />
            رقم الهاتف *
          </Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="+966xxxxxxxxx"
            className={`text-right ${errors.phone ? 'border-red-500' : ''}`}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm text-right">{errors.phone}</p>
          )}
        </div>

        {/* Expected Salary */}
        <div className="space-y-2">
          <Label htmlFor="salary" className="text-right flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            الراتب المتوقع (اختياري)
          </Label>
          <Input
            id="salary"
            value={formData.expectedSalary}
            onChange={(e) => handleInputChange('expectedSalary', e.target.value)}
            placeholder="مثال: 8000 ريال سعودي"
            className="text-right"
          />
        </div>

        {/* Experience Level */}
        <div className="space-y-2">
          <Label className="text-right flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            مستوى الخبرة *
          </Label>
          <Select 
            value={formData.experience} 
            onValueChange={(value) => handleInputChange('experience', value)}
          >
            <SelectTrigger className={`text-right ${errors.experience ? 'border-red-500' : ''}`}>
              <SelectValue placeholder="اختر مستوى الخبرة" />
            </SelectTrigger>
            <SelectContent>
              {experienceLevels.map((level) => (
                <SelectItem key={level.value} value={level.value}>
                  {level.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.experience && (
            <p className="text-red-500 text-sm text-right">{errors.experience}</p>
          )}
        </div>

        {/* Education */}
        <div className="space-y-2">
          <Label className="text-right flex items-center gap-2">
            <GraduationCap className="w-4 h-4" />
            المستوى التعليمي *
          </Label>
          <Select 
            value={formData.education} 
            onValueChange={(value) => handleInputChange('education', value)}
          >
            <SelectTrigger className={`text-right ${errors.education ? 'border-red-500' : ''}`}>
              <SelectValue placeholder="اختر المستوى التعليمي" />
            </SelectTrigger>
            <SelectContent>
              {educationLevels.map((level) => (
                <SelectItem key={level.value} value={level.value}>
                  {level.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.education && (
            <p className="text-red-500 text-sm text-right">{errors.education}</p>
          )}
        </div>
      </div>

      {/* Specialization */}
      <div className="space-y-2">
        <Label className="text-right">
          التخصص *
        </Label>
        <Select 
          value={formData.specialization} 
          onValueChange={(value) => handleInputChange('specialization', value)}
        >
          <SelectTrigger className={`text-right ${errors.specialization ? 'border-red-500' : ''}`}>
            <SelectValue placeholder="اختر التخصص" />
          </SelectTrigger>
          <SelectContent>
            {specializations[persona as keyof typeof specializations]?.map((spec) => (
              <SelectItem key={spec.value} value={spec.value}>
                {spec.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.specialization && (
          <p className="text-red-500 text-sm text-right">{errors.specialization}</p>
        )}
      </div>

      {/* Job Description */}
      <div className="space-y-2">
        <Label htmlFor="jobDescription" className="text-right">
          وصف الوظيفة المرغوبة (اختياري)
        </Label>
        <Textarea
          id="jobDescription"
          value={formData.jobDescription}
          onChange={(e) => handleInputChange('jobDescription', e.target.value)}
          placeholder="اكتب وصفاً للوظيفة التي تسعى إليها..."
          className="text-right min-h-[100px]"
          rows={4}
        />
      </div>

      {/* Submit Button */}
      <motion.div 
        className="flex justify-center pt-6"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button
          onClick={handleSubmit}
          size="lg"
          className="px-12 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-lg font-semibold"
        >
          متابعة للخطوة التالية ←
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default BasicInfoStep;
