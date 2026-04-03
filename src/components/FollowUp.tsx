import React from 'react';
import { motion } from 'motion/react';
import { HelpCircle, ChevronRight } from 'lucide-react';
import { Language } from '../types';

const QUESTIONS = [
  "How can I add my own custom Pantone colors to the style palette?",
  "Which Gemini model is best for the 'Web Research' step versus the 'Report Writing' step?",
  "How does the system handle conflicting information found on the web during the research phase?",
  "If I provide a Traditional Chinese input but select English output, how does the system handle technical terminology translation?",
  "Can I revert to a previous version of a summary after I have already approved it?",
  "How do I define 'Required Sections' in a custom template to ensure the agent doesn't skip them?",
  "Is there a way to limit the word count of the summary to save on token usage?",
  "Can the Jackslot be configured to only cycle through 'Dark Mode' compatible styles?",
  "How does the system verify the credibility of the sources listed in the Evidence Map?",
  "How do I actually 'run' a generated skill.md file in a future session?",
  "How are the 'Token Usage' estimates calculated, and how accurate are they?",
  "Is any of the pasted regulation text stored on a server, or is it all handled in the session?",
  "How often should I update the default FDA template as new guidances are released?",
  "What happens if the Gemini API times out during the 4000-word report generation?",
  "Does the system support rendering complex diagrams (like Mermaid.js) within the reports?",
  "Can I export the entire 'MDRI Bundle' (Summary, Report, Skill, Logs) as a single ZIP file?",
  "Can the system automatically detect the jurisdiction (e.g., US vs EU) based on the input text?",
  "How can I modify the 'Agent Studio' prompts to include specific company-level compliance rules?",
  "Are there plans to implement 'streaming' for the long report generation to improve the user experience?",
  "How many concurrent 'Agent Chains' can the system handle before performance degrades?"
];

interface FollowUpProps {
  language: Language;
}

export const FollowUp: React.FC<FollowUpProps> = ({ language }) => {
  return (
    <div className="mt-12 space-y-6">
      <h3 className="text-2xl font-black tracking-tight flex items-center gap-2">
        <HelpCircle className="w-6 h-6 text-primary" />
        20 Comprehensive Follow-up Questions
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {QUESTIONS.map((q, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-4 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all cursor-pointer flex items-center gap-3 group"
          >
            <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-[10px] font-bold shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
              {i + 1}
            </div>
            <span className="text-sm font-medium opacity-80 group-hover:opacity-100 transition-opacity">{q}</span>
            <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
          </motion.div>
        ))}
      </div>
    </div>
  );
};
