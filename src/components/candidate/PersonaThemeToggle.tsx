
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Code, Palette, TrendingUp } from 'lucide-react';

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
    { id: 'developer', icon: Code, label: 'مطور', color: 'text-blue-500' },
    { id: 'designer', icon: Palette, label: 'مصمم', color: 'text-purple-500' },
    { id: 'marketer', icon: TrendingUp, label: 'مسوق', color: 'text-green-500' }
  ];

  return (
    <div className="flex items-center gap-4">
      {/* Persona selector */}
      <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full p-1">
        {personas.map((p) => {
          const Icon = p.icon;
          return (
            <motion.button
              key={p.id}
              onClick={() => onPersonaChange(p.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all ${
                persona === p.id
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon className={`w-4 h-4 ${persona === p.id ? 'text-white' : p.color}`} />
              <span className="text-sm font-medium">{p.label}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Theme toggle */}
      <motion.button
        onClick={() => onThemeChange(theme === 'light' ? 'dark' : 'light')}
        className="p-3 bg-white/80 backdrop-blur-sm rounded-full text-gray-600 hover:bg-gray-100 transition-all"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {theme === 'light' ? (
          <Moon className="w-5 h-5" />
        ) : (
          <Sun className="w-5 h-5" />
        )}
      </motion.button>
    </div>
  );
};

export default PersonaThemeToggle;
