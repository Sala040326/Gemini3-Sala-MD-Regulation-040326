import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  FileText, 
  Code, 
  CheckCircle2, 
  ArrowRight, 
  Edit3, 
  Save, 
  X,
  Loader2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ShieldAlert,
  ListChecks,
  History,
  BarChart3,
  Workflow
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Language, Artifact, ArtifactType } from '../types';
import { TRANSLATIONS } from '../constants';

interface MDRIProps {
  language: Language;
  onGenerate: (input: string, template: string) => Promise<void>;
  onApprove: (type: ArtifactType) => Promise<void>;
  onSaveArtifact: (id: string, content: string) => void;
  artifacts: Artifact[];
  currentStep: number;
  isGenerating: boolean;
}

export const MDRI: React.FC<MDRIProps> = ({ 
  language, 
  onGenerate, 
  onApprove, 
  onSaveArtifact,
  artifacts, 
  currentStep,
  isGenerating
}) => {
  const t = TRANSLATIONS[language];
  const [inputText, setInputText] = React.useState('');
  const [templateText, setTemplateText] = React.useState('');
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editContent, setEditContent] = React.useState('');
  const [showAdditionalFeatures, setShowAdditionalFeatures] = React.useState(false);

  const steps = [
    { id: 1, icon: Search, label: t.step1 },
    { id: 2, icon: FileText, label: t.step2 },
    { id: 3, icon: Code, label: t.step3 },
  ];

  const currentArtifact = artifacts.find(a => {
    if (currentStep === 1) return a.type === 'summary';
    if (currentStep === 2) return a.type === 'report';
    if (currentStep === 3) return a.type === 'skill';
    return false;
  });

  const handleStartEdit = (artifact: Artifact) => {
    setEditingId(artifact.id);
    setEditContent(artifact.content);
  };

  const handleSaveEdit = () => {
    if (editingId) {
      onSaveArtifact(editingId, editContent);
      setEditingId(null);
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">{t.mdri}</h1>
          <p className="text-text/60 max-w-2xl">Execute the 3-step agentic pipeline to transform regulatory text into intelligence.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setShowAdditionalFeatures(!showAdditionalFeatures)}
            className={`p-3 rounded-2xl border border-border transition-all flex items-center gap-2 ${
              showAdditionalFeatures ? 'bg-primary text-white' : 'bg-card hover:bg-secondary'
            }`}
          >
            <Sparkles className="w-5 h-5" />
            <span className="font-bold text-sm">{t.additionalFeatures}</span>
          </button>
        </div>
      </header>

      {/* Additional AI Features Panel */}
      <AnimatePresence>
        {showAdditionalFeatures && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-8">
              {[
                { icon: ShieldAlert, label: t.riskScore, desc: 'Automated risk assessment based on FDA criteria.', color: 'bg-red-500/10 text-red-500' },
                { icon: BarChart3, label: t.gapAnalysis, desc: 'Identify missing compliance elements in your QMS.', color: 'bg-blue-500/10 text-blue-500' },
                { icon: ListChecks, label: t.checklist, desc: 'Generate actionable audit checklists from reports.', color: 'bg-green-500/10 text-green-500' },
              ].map((feature, idx) => (
                <div key={idx} className="bg-card p-6 rounded-3xl border border-border shadow-sm flex flex-col gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${feature.color}`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{feature.label}</h4>
                    <p className="text-sm opacity-60">{feature.desc}</p>
                  </div>
                  <button className="mt-auto py-2 px-4 rounded-xl bg-secondary hover:bg-secondary/80 text-xs font-bold transition-colors">
                    RUN ANALYSIS
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Input & Progress */}
        <div className="lg:col-span-4 space-y-8">
          {/* Input Panel */}
          <div className="bg-card p-6 rounded-3xl border border-border shadow-sm space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              {t.inputPanel}
            </h3>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={t.placeholder}
              className="w-full h-48 p-4 rounded-2xl bg-secondary/30 border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none text-sm"
            />
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider opacity-50">Report Template</label>
              <textarea
                value={templateText}
                onChange={(e) => setTemplateText(e.target.value)}
                placeholder={t.templatePlaceholder}
                className="w-full h-32 p-4 rounded-2xl bg-secondary/30 border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none text-sm"
              />
            </div>
            <button
              onClick={() => onGenerate(inputText, templateText)}
              disabled={isGenerating || !inputText}
              className="w-full py-4 rounded-2xl bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:translate-y-0 flex items-center justify-center gap-2"
            >
              {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              {t.generate}
            </button>
          </div>

          {/* Progress Stepper */}
          <div className="bg-card p-6 rounded-3xl border border-border shadow-sm space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Workflow className="w-5 h-5 text-primary" />
              {t.agentProgress}
            </h3>
            <div className="space-y-4">
              {steps.map((step, idx) => (
                <div key={step.id} className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                    currentStep > step.id ? 'bg-green-500 text-white' : 
                    currentStep === step.id ? 'bg-primary text-white ring-4 ring-primary/20' : 
                    'bg-secondary text-text/30'
                  }`}>
                    {currentStep > step.id ? <CheckCircle2 className="w-6 h-6" /> : <step.icon className="w-5 h-5" />}
                  </div>
                  <div className="flex-1">
                    <span className={`text-sm font-bold ${currentStep === step.id ? 'text-primary' : 'text-text/50'}`}>
                      {step.label}
                    </span>
                    {currentStep === step.id && isGenerating && (
                      <div className="w-full h-1 bg-secondary rounded-full mt-2 overflow-hidden">
                        <motion.div 
                          initial={{ x: '-100%' }}
                          animate={{ x: '100%' }}
                          transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                          className="w-1/2 h-full bg-primary"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Artifact Viewer */}
        <div className="lg:col-span-8 flex flex-col min-h-[600px]">
          <div className="bg-card rounded-3xl border border-border shadow-sm flex-1 flex flex-col overflow-hidden">
            <div className="p-6 border-b border-border flex items-center justify-between bg-secondary/20">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <History className="w-5 h-5" />
                {t.artifactViewer}
              </h3>
              {currentArtifact && !editingId && (
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleStartEdit(currentArtifact)}
                    className="p-2 hover:bg-secondary rounded-xl transition-colors text-primary"
                  >
                    <Edit3 className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => onApprove(currentArtifact.type)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:shadow-lg transition-all"
                  >
                    {t.approve}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
              {editingId && (
                <div className="flex gap-2">
                  <button 
                    onClick={() => setEditingId(null)}
                    className="p-2 hover:bg-red-500/10 text-red-500 rounded-xl transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={handleSaveEdit}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl text-sm font-bold hover:shadow-lg transition-all"
                  >
                    <Save className="w-4 h-4" />
                    {t.save}
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1 p-8 overflow-y-auto bg-card">
              {editingId ? (
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full h-full p-6 rounded-2xl bg-secondary/10 border border-border focus:ring-2 focus:ring-primary/20 outline-none font-mono text-sm resize-none"
                />
              ) : currentArtifact ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="markdown-body prose prose-slate max-w-none dark:prose-invert"
                >
                  <ReactMarkdown>{currentArtifact.content}</ReactMarkdown>
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-12 opacity-30">
                  <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-6">
                    <FileText className="w-10 h-10" />
                  </div>
                  <h4 className="text-xl font-bold mb-2">No Artifact Generated</h4>
                  <p className="max-w-xs">Start the pipeline by providing regulatory text and a template.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
