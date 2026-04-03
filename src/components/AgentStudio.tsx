import React from 'react';
import { motion } from 'motion/react';
import { 
  Cpu, 
  Terminal, 
  Settings2, 
  Zap, 
  Save, 
  RotateCcw,
  Sparkles,
  ChevronDown,
  Info
} from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface AgentStudioProps {
  language: Language;
}

export const AgentStudio: React.FC<AgentStudioProps> = ({ language }) => {
  const t = TRANSLATIONS[language];
  const [selectedModel, setSelectedModel] = React.useState('gemini-3-flash-preview');
  const [prompts, setPrompts] = React.useState({
    research: 'You are a world-class regulatory researcher. Your goal is to transform raw regulation text into a comprehensive summary grounded in current web data. Use the googleSearch tool to find the latest FDA guidances and international standards.',
    report: 'You are a professional regulatory writer. Your goal is to align research findings with the provided professional template. Ensure all headings and sub-headings are strictly followed.',
    skill: 'You are an AI meta-cognition specialist. Your goal is to analyze a successful regulatory workflow and generate a reusable skill.md file that encodes the logic of the process.'
  });

  const models = [
    { id: 'gemini-3-flash-preview', name: 'Gemini 3 Flash', desc: 'Fast & efficient for research tasks.' },
    { id: 'gemini-3.1-pro-preview', name: 'Gemini 3.1 Pro', desc: 'Advanced reasoning for complex reports.' },
    { id: 'gemini-3.1-flash-lite-preview', name: 'Gemini 3.1 Flash Lite', desc: 'Low-latency for quick summaries.' },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-black tracking-tight mb-2">{t.studio}</h1>
        <p className="text-text/60 max-w-2xl">Fine-tune agent prompts and select specific models for each step of the MDRI pipeline.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Model Selector */}
        <div className="lg:col-span-4 space-y-6">
          <section className="bg-card p-6 rounded-3xl border border-border shadow-sm space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Cpu className="w-5 h-5 text-primary" />
              {t.modelSelector}
            </h3>
            <div className="space-y-3">
              {models.map((model) => (
                <button
                  key={model.id}
                  onClick={() => setSelectedModel(model.id)}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                    selectedModel === model.id 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm">{model.name}</span>
                    {selectedModel === model.id && <Zap className="w-4 h-4 text-primary fill-primary" />}
                  </div>
                  <p className="text-xs opacity-50">{model.desc}</p>
                </button>
              ))}
            </div>
          </section>

          <section className="bg-card p-6 rounded-3xl border border-border shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-primary">
              <Info className="w-5 h-5" />
              <h4 className="font-bold text-sm uppercase tracking-wider">Handoff Logic</h4>
            </div>
            <p className="text-xs opacity-60 leading-relaxed">
              The system uses a <strong>Gated Handoff</strong> pattern. After each agent finishes, the user must approve the artifact before it is passed to the next step. This prevents hallucination propagation.
            </p>
          </section>
        </div>

        {/* Prompt Editor */}
        <div className="lg:col-span-8 space-y-6">
          <section className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border flex items-center justify-between bg-secondary/20">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Terminal className="w-5 h-5" />
                {t.promptEditor}
              </h3>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-secondary rounded-xl transition-colors">
                  <RotateCcw className="w-5 h-5" />
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:shadow-lg transition-all">
                  <Save className="w-4 h-4" />
                  {t.save}
                </button>
              </div>
            </div>

            <div className="p-8 space-y-8">
              {Object.entries(prompts).map(([key, value], idx) => (
                <div key={key} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-widest opacity-40">
                      Agent {idx + 1}: {key.toUpperCase()}
                    </label>
                    <span className="text-[10px] font-mono opacity-30">SYSTEM_INSTRUCTION</span>
                  </div>
                  <textarea
                    value={value}
                    onChange={(e) => setPrompts({ ...prompts, [key]: e.target.value })}
                    className="w-full h-32 p-4 rounded-2xl bg-secondary/30 border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none text-sm font-mono"
                  />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
