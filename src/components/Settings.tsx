import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Palette, 
  Globe, 
  Moon, 
  Sun, 
  Zap, 
  Check, 
  RotateCw,
  Sparkles
} from 'lucide-react';
import { Language, Theme, PantoneStyle } from '../types';
import { TRANSLATIONS, PANTONE_STYLES } from '../constants';

interface SettingsProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  currentStyle: PantoneStyle;
  setCurrentStyle: (style: PantoneStyle) => void;
  onJackslot: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ 
  language, 
  setLanguage, 
  theme, 
  setTheme, 
  currentStyle, 
  setCurrentStyle,
  onJackslot
}) => {
  const t = TRANSLATIONS[language];
  const [isJackslotting, setIsJackslotting] = React.useState(false);

  const handleJackslot = () => {
    setIsJackslotting(true);
    onJackslot();
    setTimeout(() => setIsJackslotting(false), 1000);
  };

  return (
    <div className="space-y-12">
      <header>
        <h1 className="text-4xl font-black tracking-tight mb-2">{t.settings}</h1>
        <p className="text-text/60 max-w-2xl">Customize your visual environment and linguistic context for the Artistic MDRI Flow System.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Visual Settings */}
        <div className="space-y-8">
          <section className="bg-card p-8 rounded-3xl border border-border shadow-sm space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Sun className="w-6 h-6 text-primary" />
              {t.theme}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { id: 'light', icon: Sun, label: t.light },
                { id: 'dark', icon: Moon, label: t.dark },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setTheme(item.id as Theme)}
                  className={`flex items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                    theme === item.id 
                      ? 'border-primary bg-primary/5 text-primary' 
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-bold">{item.label}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="bg-card p-8 rounded-3xl border border-border shadow-sm space-y-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Globe className="w-6 h-6 text-primary" />
              {t.language}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { id: 'en', label: t.english },
                { id: 'zh', label: t.chinese },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setLanguage(item.id as Language)}
                  className={`flex items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                    language === item.id 
                      ? 'border-primary bg-primary/5 text-primary' 
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <span className="font-bold">{item.label}</span>
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* Style Palette */}
        <section className="bg-card p-8 rounded-3xl border border-border shadow-sm space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Palette className="w-6 h-6 text-primary" />
              {t.stylePalette}
            </h3>
            <button
              onClick={handleJackslot}
              disabled={isJackslotting}
              className={`flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:shadow-xl transition-all ${
                isJackslotting ? 'scale-95 opacity-50' : ''
              }`}
            >
              <RotateCw className={`w-4 h-4 ${isJackslotting ? 'animate-spin' : ''}`} />
              {t.jackslot}
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {PANTONE_STYLES.map((style) => (
              <button
                key={style.id}
                onClick={() => setCurrentStyle(style)}
                className={`group relative flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                  currentStyle.id === style.id 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/30'
                }`}
              >
                <div 
                  className="w-12 h-12 rounded-xl shadow-inner flex items-center justify-center transition-transform group-hover:scale-110"
                  style={{ backgroundColor: style.primary }}
                >
                  {currentStyle.id === style.id && <Check className="w-6 h-6 text-white" />}
                </div>
                <div className="text-center">
                  <span className="block text-xs font-bold truncate max-w-[100px]">{style.name}</span>
                  <span className="block text-[10px] opacity-40 font-mono tracking-tighter">{style.code}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Style Preview Card */}
          <motion.div 
            key={currentStyle.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-2xl border border-border bg-secondary/10 flex items-center gap-6"
          >
            <div className="w-20 h-20 rounded-2xl shadow-lg" style={{ backgroundColor: currentStyle.primary }} />
            <div className="space-y-1">
              <h4 className="text-lg font-black tracking-tight">{currentStyle.name}</h4>
              <p className="text-sm opacity-60">Pantone Color of the Year {currentStyle.code}</p>
              <div className="flex gap-2 pt-2">
                {[currentStyle.primary, currentStyle.secondary, currentStyle.accent].map((c, i) => (
                  <div key={i} className="w-4 h-4 rounded-full" style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
};
