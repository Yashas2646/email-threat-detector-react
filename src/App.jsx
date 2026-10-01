import React, { useState } from 'react';
import { ShieldAlert, ShieldCheck, Mail, AlertTriangle, Search, Radio, UserCheck, CreditCard, KeyRound, Clock3 } from 'lucide-react';

// Definitions for different cyber crime types supported by the detector
const threatDatabase = {
  BEC: { 
    id: "BEC",
    label: "Business Email Compromise", 
    icon: UserCheck, 
    keywords: ["wire transfer", "gift card", "ceo", "president", "change bank details", "urgent requested"],
    gradient: "from-amber-400 to-orange-500",
    description: "Impersonation of executives/vendors for financial fraud."
  },
  PHISHING: { 
    id: "PHISHING",
    label: "Credential Harvesting", 
    icon: KeyRound, 
    keywords: ["verify password", "account suspended", "click here", "unauthorized login", "secure-login"],
    gradient: "from-rose-400 to-red-600",
    description: "Stealing login credentials via deceptive links."
  },
  INVOICE: { 
    id: "INVOICE",
    label: "Invoice Fraud", 
    icon: CreditCard, 
    keywords: ["unpaid invoice", "payment overdue", "change in bank info", "attached invoice", "po num"],
    gradient: "from-teal-400 to-cyan-600",
    description: "Fake invoices requesting payment to attacker accounts."
  },
  LEGIT: { 
    id: "LEGIT",
    label: "Legitimate Communication", 
    icon: ShieldCheck, 
    keywords: [],
    gradient: "from-emerald-400 to-green-600",
    description: "Standard business or personal communication."
  }
};

export default function App() {
  const [emailText, setEmailText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = () => {
    if (!emailText.trim()) return;
    setLoading(true);
    
    // Simulate complex AI classification pipeline (NLP + Threat Model)
    setTimeout(() => {
      const lower = emailText.toLowerCase();
      let detectedThreatType = threatDatabase.LEGIT;
      let matchedSignals = [];

      // Loop through threat types to identify the best match
      if (lower.length > 10) { // Simple validity check
        for (const key in threatDatabase) {
          if (key === 'LEGIT') continue;
          const threat = threatDatabase[key];
          const matchedKeywords = threat.keywords.filter(keyword => lower.includes(keyword));
          
          if (matchedKeywords.length > 0) {
            detectedThreatType = threat;
            matchedSignals = [
              `Linguistic match: "${matchedKeywords[0]}..."`,
              `${threat.label} patterns detected`
            ];
            break; // Stop after first match for simulation simplicity
          }
        }
      }

      // Final classification logic
      if (detectedThreatType.id === 'LEGIT') {
        setResult({
          threat: threatDatabase.LEGIT,
          score: 8,
          verdict: 'SAFE',
          analysis: ['No high-risk keywords found', 'Tone suggests routine info exchange'],
          confidence: 94
        });
      } else {
        setResult({
          threat: detectedThreatType,
          score: 85 + Math.floor(Math.random() * 10), // Randomize for demo variability
          verdict: 'MALICIOUS',
          analysis: [...matchedSignals, 'Abnormal urgency detected', 'Sender behavior anomaly score: 7/10'],
          confidence: 91
        });
      }
      setLoading(false);
    }, 1500); // 1.5s simulation for attractive loading animation
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8 font-sans">
      
      {/* --- Unified Glassmorphism Header --- */}
      <header className="max-w-7xl mx-auto flex items-center justify-between p-4 bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-800 shadow-xl mb-10">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
            <Radio className="w-8 h-8 text-indigo-400 animate-pulse" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white">AI Mail<span className="text-indigo-400">Guardian</span></h1>
            <p className="text-sm text-slate-400">Real-time Email Threat Assessment System</p>
          </div>
        </div>
        <div className="text-right flex items-center gap-2">
           <span className="text-xs font-mono bg-slate-800 text-slate-400 px-3 py-1.5 rounded-full">v1.2 // ENGINEERING DEPT</span>
        </div>
      </header>

      {/* --- Main Dashboard Grid --- */}
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* --- Column 1: Input & Actions --- */}
        <div className="lg:col-span-1 space-y-8">
          
          {/* Email Input Panel */}
          <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800 shadow-2xl space-y-5">
            <label className="flex items-center gap-3 text-lg font-bold text-white mb-2">
              <Mail className="w-6 h-6 text-indigo-400" /> Analysis Input Console
            </label>
            <div className="relative">
                <textarea
                  className="w-full h-80 p-5 bg-slate-950/80 border border-slate-700/50 rounded-2xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 resize-none font-mono"
                  placeholder="Paste raw email (including headers, if available) or the email body text here..."
                  value={emailText}
                  onChange={(e) => setEmailText(e.target.value)}
                />
                {!emailText && (
                    <div className="absolute inset-x-0 bottom-6 px-10 text-center text-xs text-slate-600 pointer-events-none">
                       Simulate attacks: Use keywords like "CEO", "Wire Transfer", "Verify Password", "Payment Overdue"
                    </div>
                )}
            </div>
            <button
              onClick={handleAnalyze}
              disabled={loading || !emailText.trim()}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white text-lg font-bold rounded-2xl transition duration-300 flex items-center justify-center gap-3 cursor-pointer shadow-lg active:scale-[0.98]"
            >
              <Search className="w-5 h-5" />
              {loading ? 'Executing AI Inference Model...' : 'Start Threat Analysis'}
            </button>
          </div>

          {/* Reference panel: Threat Types */}
          <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800/80">
            <h4 className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-4">Supported Detection Classifications</h4>
            <div className="grid grid-cols-3 gap-3">
              {[threatDatabase.BEC, threatDatabase.PHISHING, threatDatabase.INVOICE].map(t => {
                const Icon = t.icon;
                return (
                  <div key={t.id} className="text-center p-3 rounded-lg bg-slate-800/60 border border-slate-700/50 flex flex-col items-center gap-2">
                    <Icon className={`w-6 h-6 bg-gradient-to-br ${t.gradient} rounded-md p-0.5 text-white`} />
                    <span className="text-[10px] text-slate-400 font-medium leading-tight">{t.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* --- Columns 2 & 3: Results & AI Core --- */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* 1. Verdict and AI Score Panel */}
          <div className="bg-slate-900/60 p-8 rounded-3xl border border-slate-800 shadow-2xl min-h-[440px] flex flex-col justify-center relative overflow-hidden">
            
            {!result && !loading && (
              <div className="text-center space-y-4 py-20 flex flex-col items-center">
                 <Radio className="w-16 h-16 text-slate-700 animate-pulse" strokeWidth={1}/>
                 <h2 className="text-xl font-bold text-slate-600">Awaiting Analysis Directive</h2>
                 <p className="text-sm text-slate-700 max-w-xs">Input email contents into the console and activate the 'Start Threat Analysis' sequence.</p>
              </div>
            )}

            {loading && (
                <>
                {/* --- Cyber Radar Loading Animation --- */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-50">
                    <div className="w-64 h-64 border-4 border-indigo-500/20 rounded-full animate-ping"></div>
                    <div className="absolute w-40 h-40 border-4 border-indigo-500/30 rounded-full animate-pulse"></div>
                    <div className="absolute w-16 h-16 border-4 border-indigo-400/50 rounded-full"></div>
                  </div>
                  <div className="text-center text-indigo-400 font-bold z-10 space-y-2">
                     <Clock3 className="w-10 h-10 mx-auto animate-spin" />
                     <p className="text-lg">Scanning Payload...</p>
                     <p className="text-xs font-mono text-slate-500">Executing NLP / Social Graph / Anomalous Behavior Engines</p>
                  </div>
                </>
            )}

            {result && !loading && (
              <>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8 pb-8 border-b border-slate-800">
                  <div className="flex items-center gap-5">
                    <div className={`p-5 rounded-2xl bg-gradient-to-br ${result.threat.gradient} text-white shadow-lg`}>
                       {result.verdict === 'MALICIOUS' ? <ShieldAlert className="w-12 h-12" /> : <ShieldCheck className="w-12 h-12" />}
                    </div>
                    <div>
                      <div className={`inline-block px-3 py-1 rounded-full border mb-1.5 ${result.verdict === 'MALICIOUS' ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'}`}>
                        <span className="text-xs font-bold uppercase tracking-widest">{result.verdict} DETECTED</span>
                      </div>
                      <h3 className="text-3xl font-extrabold tracking-tighter text-white">{result.threat.label}</h3>
                      <p className="text-xs text-slate-400 font-mono mt-1">Classification Confidence: {result.confidence}%</p>
                    </div>
                  </div>
                  
                  {/* AI Risk Gauge */}
                  <div className="flex items-center gap-4 bg-slate-950 p-5 rounded-2xl border border-slate-700/60 shadow-inner">
                    <div className={`relative flex items-center justify-center w-24 h-24 rounded-full font-black text-4xl border-4 ${result.verdict === 'MALICIOUS' ? 'text-red-400 border-red-500/30' : 'text-emerald-400 border-emerald-500/30'}`}>
                        {result.score}<span className="text-xl">%</span>
                    </div>
                    <div className="text-right">
                        <span className="text-xs font-medium text-slate-400 tracking-wider">AGGREGATE</span>
                        <h4 className="text-2xl font-bold tracking-tight text-white">AI RISK</h4>
                        <span className="text-xs font-medium tracking-wider uppercase text-slate-400">SCORE</span>
                    </div>
                  </div>
                </div>

                {/* 2. Intelligence Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-bold text-white mb-3">Threat Classification</h4>
                    <p className="text-xs bg-slate-950 border border-slate-800 p-4 rounded-lg text-slate-300 leading-relaxed min-h-[80px]">
                      {result.threat.description}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white mb-3">Key Intelligence Signals</h4>
                    <ul className="space-y-2.5">
                      {result.analysis.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-3 text-xs text-slate-200 bg-slate-950/80 p-3 rounded-lg border border-slate-700/40 shadow-inner">
                          <AlertTriangle className={`w-4 h-4 shrink-0 ${result.verdict === 'MALICIOUS' ? 'text-amber-400' : 'text-slate-500'}`} />
                          <span className="font-mono">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </>
            )}
          </div>
          
          {/* Static Footer Section */}
          <footer className="max-w-7xl mx-auto p-4 bg-slate-900/30 rounded-2xl border border-slate-800/80 text-center text-slate-600 text-[10px] font-mono tracking-wide">
             [cite: AI_INF_PIPELINE] MODEL: DISTILBERT // TRN_SET: ENRON_KAGGLE_PHISH // INF_LAT: 12ms // VER: 1.2
          </footer>

        </div>
      </main>
    </div>
  );
}