
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Calendar, Users, Briefcase, TrendingUp } from 'lucide-react';

const VacancySearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [vacancies, setVacancies] = useState([
    {
      id: 1,
      title: 'مطور React محترف',
      department: 'التقنية',
      location: 'الرياض',
      type: 'دوام كامل',
      experience: 'متوسط',
      applicants: 45,
      posted: '3 أيام',
      salary: '12,000 - 18,000 ريال',
      description: 'نبحث عن مطور React محترف للانضمام لفريقنا المتميز'
    },
    {
      id: 2,
      title: 'مصمم UI/UX إبداعي',
      department: 'التصميم',
      location: 'جدة',
      type: 'دوام كامل',
      experience: 'مبتدئ إلى متوسط',
      applicants: 28,
      posted: '1 أسبوع',
      salary: '8,000 - 14,000 ريال',
      description: 'مصمم مبدع لتصميم تجارب مستخدم استثنائية'
    },
    {
      id: 3,
      title: 'أخصائي تسويق رقمي',
      department: 'التسويق',
      location: 'الدمام',
      type: 'دوام جزئي',
      experience: 'خبير',
      applicants: 62,
      posted: '5 أيام',
      salary: '10,000 - 16,000 ريال',
      description: 'خبير في التسويق الرقمي وإدارة الحملات الإعلانية'
    }
  ]);

  const filters = [
    'التقنية', 'التصميم', 'التسويق', 'دوام كامل', 'دوام جزئي', 
    'الرياض', 'جدة', 'الدمام', 'مبتدئ', 'متوسط', 'خبير'
  ];

  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'دوام كامل':
        return 'bg-green-100 text-green-800';
      case 'دوام جزئي':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getExperienceColor = (experience: string) => {
    if (experience.includes('مبتدئ')) return 'bg-blue-100 text-blue-800';
    if (experience.includes('متوسط')) return 'bg-purple-100 text-purple-800';
    if (experience.includes('خبير')) return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <section className="py-16 px-6">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            اكتشف الفرص الوظيفية المتاحة
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            ابحث في مجموعة واسعة من الوظائف المثيرة واعثر على الفرصة المناسبة لمهاراتك وخبراتك
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="relative mb-6">
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحث عن وظيفة أو مهارة أو شركة..."
              className="text-right pr-12 h-12 text-lg"
            />
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap gap-2 justify-center">
            {filters.map((filter) => (
              <motion.div
                key={filter}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Badge
                  variant={selectedFilters.includes(filter) ? "default" : "outline"}
                  className={`cursor-pointer transition-all px-4 py-2 ${
                    selectedFilters.includes(filter)
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                      : 'hover:bg-gray-100'
                  }`}
                  onClick={() => toggleFilter(filter)}
                >
                  {filter}
                </Badge>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Vacancies Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <AnimatePresence>
            {vacancies.map((vacancy, index) => (
              <motion.div
                key={vacancy.id}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, shadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                className="bg-white rounded-2xl p-6 shadow-lg border hover:border-blue-300 transition-all duration-300 cursor-pointer"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <Badge className={getTypeColor(vacancy.type)}>
                      {vacancy.type}
                    </Badge>
                    <Badge className={getExperienceColor(vacancy.experience)}>
                      {vacancy.experience}
                    </Badge>
                  </div>
                  <Briefcase className="w-8 h-8 text-blue-500" />
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-2 text-right">
                  {vacancy.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 text-right leading-relaxed">
                  {vacancy.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-end gap-2 text-sm text-gray-600">
                    <span>{vacancy.department}</span>
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div className="flex items-center justify-end gap-2 text-sm text-gray-600">
                    <span>{vacancy.location}</span>
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="flex items-center justify-end gap-2 text-sm text-gray-600">
                    <span>{vacancy.applicants} مرشح</span>
                    <Users className="w-4 h-4" />
                  </div>
                  <div className="flex items-center justify-end gap-2 text-sm text-gray-600">
                    <span>منذ {vacancy.posted}</span>
                    <Calendar className="w-4 h-4" />
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="hover:bg-blue-50"
                  >
                    عرض التفاصيل
                  </Button>
                  <span className="text-lg font-bold text-green-600">
                    {vacancy.salary}
                  </span>
                </div>

                {/* Animated border */}
                <motion.div
                  className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 transition-opacity"
                  whileHover={{ opacity: 0.1 }}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-gray-600 mb-6">
            لم تجد الوظيفة المناسبة؟ ابدأ رحلة التقديم وسنساعدك في العثور على الفرص المناسبة
          </p>
          <Button 
            size="lg"
            className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 px-8"
          >
            ابدأ التقديم الآن
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default VacancySearch;
