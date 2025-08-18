import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Contrast, Stethoscope, Palette, TrendingUp } from 'lucide-react';

interface PersonaThemeToggleProps {
  persona: string;
  theme: string;
  onPersonaChange: (persona: string) => void;
  onThemeChange: (theme: string) => void;
}

const PersonaThemeToggle: React.FC<PersonaThemeToggleProps> = ({
  persona,
  theme,
  onPersonaChange,
  onThemeChange
}) => {
  const personas = [
    { id: 'medical', name: 'طبي', icon: Stethoscope, color: 'from-green-500 to-blue-600' },
    { id: 'designer', name: 'مصمم', icon: Palette, color: 'from-pink-400 to-purple-600' },
    { id: 'marketer', name: 'تسويق', icon: TrendingUp, color: 'from-green-400 to-blue-600' }
  ];

  const themes = [
    { id: 'light', name: 'فاتح', icon: Sun },
    { id: 'dark', name: 'داكن', icon: Moon },
    { id: 'high-contrast', name: 'تباين عالي', icon: Contrast }
  ];

  return (
    <div className="flex items-center gap-4">
      {/* Persona Toggle */}
      <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl p-1">
        {personas.map((p) => {
          const IconComponent = p.icon;
          return (
            <motion.button
              key={p.id}
              onClick={() => onPersonaChange(p.id)}
              className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                persona === p.id
                  ? 'text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {persona === p.id && (
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-r ${p.color} rounded-lg`}
                  layoutId="persona-bg"
                  initial={false}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <div className="relative flex items-center gap-2">
                <IconComponent className="w-4 h-4" />
                <span className="hidden sm:inline">{p.name}</span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Theme Toggle */}
      <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl p-1">
        {themes.map((t) => {
          const IconComponent = t.icon;
          return (
            <motion.button
              key={t.id}
              onClick={() => onThemeChange(t.id)}
              className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                theme === t.id
                  ? 'text-white bg-gray-800 shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center gap-2">
                <IconComponent className="w-4 h-4" />
                <span className="hidden md:inline">{t.name}</span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default PersonaThemeToggle;