import React from 'react';
import { GoogleGenAI } from "@google/genai";
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { MDRI } from './components/MDRI';
import { AgentStudio } from './components/AgentStudio';
import { Settings } from './components/Settings';
import { FollowUp } from './components/FollowUp';
import { 
  Language, 
  Theme, 
  PantoneStyle, 
  Artifact, 
  LogEntry, 
  Telemetry,
  ArtifactType
} from './types';
import { PANTONE_STYLES } from './constants';

const INITIAL_TELEMETRY: Telemetry = {
  activeJobs: 0,
  tokenUsage: 12450,
  avgLatency: 450,
  providerHealth: 'healthy',
};

const DEFAULT_TEMPLATE = `美國 FDA 醫療器材品質管理體系法規 (QMSR) 指南草案全面綜述
一、 前言與法規背景
二、 從 QSR 到 QMSR：法規範式的轉移
三、 上市前申請 (PMA/HDE) 中的 QMS 資訊提交架構
四、 建立 QMS 的具體要求：對標 ISO 13485
五、 21 CFR 820.10：法規補充要求
六、 記錄控制與標籤包裝 (820.35 與 820.45)
七、 過渡期安排與業界應對策略
八、 結論`;

export default function App() {
  const [activeTab, setActiveTab] = React.useState('dashboard');
  const [language, setLanguage] = React.useState<Language>('zh');
  const [theme, setTheme] = React.useState<Theme>('light');
  const [currentStyle, setCurrentStyle] = React.useState<PantoneStyle>(PANTONE_STYLES[0]);
  const [artifacts, setArtifacts] = React.useState<Artifact[]>([]);
  const [logs, setLogs] = React.useState<LogEntry[]>([]);
  const [telemetry, setTelemetry] = React.useState<Telemetry>(INITIAL_TELEMETRY);
  const [currentStep, setCurrentStep] = React.useState(1);
  const [isGenerating, setIsGenerating] = React.useState(false);

  const addLog = (level: LogEntry['level'], message: string) => {
    const newLog: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      level,
      message,
    };
    setLogs(prev => [newLog, ...prev].slice(0, 50));
  };

  const handleGenerate = async (input: string, template: string) => {
    setIsGenerating(true);
    addLog('info', `Starting MDRI Pipeline Step 1: Web Research...`);
    setTelemetry(prev => ({ ...prev, activeJobs: prev.activeJobs + 1 }));

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      
      // Step 1: Web Research & Summary
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Research the following regulatory text and provide a 2000-word comprehensive summary grounded in current web data. Use the googleSearch tool to find latest FDA guidances. Input: ${input}`,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const summary: Artifact = {
        id: Math.random().toString(36).substr(2, 9),
        title: 'Step 1: Web Research Summary',
        content: response.text || 'No content generated.',
        type: 'summary',
        timestamp: Date.now(),
        model: 'gemini-3-flash-preview',
        version: 1,
      };

      setArtifacts(prev => [...prev, summary]);
      addLog('success', `Step 1 complete. Summary generated.`);
      setTelemetry(prev => ({ 
        ...prev, 
        tokenUsage: prev.tokenUsage + 1500,
        avgLatency: 520
      }));
    } catch (error) {
      addLog('error', `Pipeline failed: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsGenerating(false);
      setTelemetry(prev => ({ ...prev, activeJobs: Math.max(0, prev.activeJobs - 1) }));
    }
  };

  const handleApprove = async (type: ArtifactType) => {
    if (type === 'summary') {
      setCurrentStep(2);
      addLog('info', `Summary approved. Moving to Step 2: Report Generation.`);
      // In a real app, we would trigger Step 2 here
      await generateReport();
    } else if (type === 'report') {
      setCurrentStep(3);
      addLog('info', `Report approved. Moving to Step 3: Skill Creation.`);
      await generateSkill();
    } else {
      addLog('success', `Pipeline complete. All artifacts generated.`);
    }
  };

  const generateReport = async () => {
    setIsGenerating(true);
    addLog('info', `Starting MDRI Pipeline Step 2: Report Generation...`);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const summary = artifacts.find(a => a.type === 'summary')?.content;
      
      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: `Align the following research summary with the provided professional template. Ensure all headings and sub-headings are strictly followed. Summary: ${summary}. Template: ${DEFAULT_TEMPLATE}`,
      });

      const report: Artifact = {
        id: Math.random().toString(36).substr(2, 9),
        title: 'Step 2: Comprehensive Regulation Report',
        content: response.text || 'No content generated.',
        type: 'report',
        timestamp: Date.now(),
        model: 'gemini-3.1-pro-preview',
        version: 1,
      };

      setArtifacts(prev => [...prev, report]);
      addLog('success', `Step 2 complete. Report generated.`);
    } catch (error) {
      addLog('error', `Step 2 failed: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateSkill = async () => {
    setIsGenerating(true);
    addLog('info', `Starting MDRI Pipeline Step 3: Skill Creation...`);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const report = artifacts.find(a => a.type === 'report')?.content;
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze the following regulatory report and generate a reusable skill.md file that encodes the logic of the process. Report: ${report}`,
      });

      const skill: Artifact = {
        id: Math.random().toString(36).substr(2, 9),
        title: 'Step 3: Reusable Regulatory Skill',
        content: response.text || 'No content generated.',
        type: 'skill',
        timestamp: Date.now(),
        model: 'gemini-3-flash-preview',
        version: 1,
      };

      setArtifacts(prev => [...prev, skill]);
      addLog('success', `Step 3 complete. Skill generated.`);
    } catch (error) {
      addLog('error', `Step 3 failed: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveArtifact = (id: string, content: string) => {
    setArtifacts(prev => prev.map(a => a.id === id ? { ...a, content, version: a.version + 1 } : a));
    addLog('info', `Artifact ${id} updated to version ${artifacts.find(a => a.id === id)?.version || 1 + 1}`);
  };

  const handleJackslot = () => {
    const randomStyle = PANTONE_STYLES[Math.floor(Math.random() * PANTONE_STYLES.length)];
    setCurrentStyle(randomStyle);
    addLog('info', `Jackslot reset: Applied ${randomStyle.name} style.`);
  };

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      language={language} 
      theme={theme} 
      currentStyle={currentStyle}
    >
      {activeTab === 'dashboard' && (
        <>
          <Dashboard language={language} telemetry={telemetry} logs={logs} />
          <FollowUp language={language} />
        </>
      )}
      {activeTab === 'mdri' && (
        <MDRI 
          language={language} 
          onGenerate={handleGenerate} 
          onApprove={handleApprove}
          onSaveArtifact={handleSaveArtifact}
          artifacts={artifacts}
          currentStep={currentStep}
          isGenerating={isGenerating}
        />
      )}
      {activeTab === 'studio' && (
        <AgentStudio language={language} />
      )}
      {activeTab === 'settings' && (
        <Settings 
          language={language} 
          setLanguage={setLanguage} 
          theme={theme} 
          setTheme={setTheme} 
          currentStyle={currentStyle}
          setCurrentStyle={setCurrentStyle}
          onJackslot={handleJackslot}
        />
      )}
    </Layout>
  );
}
