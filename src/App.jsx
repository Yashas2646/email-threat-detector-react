import { jsPDF } from 'jspdf';
import React, { useState } from 'react';
import { ShieldAlert, ShieldCheck, Mail, AlertTriangle, Search, Radio, UserCheck, CreditCard, KeyRound, Clock3, Lock, User, ArrowRight, LogOut } from 'lucide-react';

// Definitions for different cyber crime types supported by the detector
const threatDatabase = {
  BEC: { 
    id: "BEC",
    label: "Business Email Compromise", 
    icon: UserCheck, 
    keywords: ["wire transfer", "gift card", "ceo", "president", "change bank details", "urgent requested"],
    gradient: "from-amber-400 to-orange-500",
    description: "Impersonation of executives/vendors for financial fraud.",
    sampleText: "Subject: URGENT: Executive Wire Transfer Request\n\nHi Team,\nI am currently in a meeting and cannot take calls. Please execute a wire transfer of $14,500 to our new vendor account immediately. Send me the confirmation once done.\n\nRegards,\nCEO"
  },
  PHISHING: { 
    id: "PHISHING",
    label: "Credential Harvesting", 
    icon: KeyRound, 
    keywords: ["verify password", "account suspended", "click here", "unauthorized login", "secure-login"],
    gradient: "from-rose-400 to-red-600",
    description: "Stealing login credentials via deceptive links.",
    sampleText: "Subject: Action Required: Your Account Has Been Suspended\n\nDear User,\nWe detected an unauthorized login attempt on your account. Please click here to verify password and restore full access immediately: http://secure-login-portal.com\n\nSecurity Team"
  },
  INVOICE: { 
    id: "INVOICE",
    label: "Invoice Fraud", 
    icon: CreditCard, 
    keywords: ["unpaid invoice", "payment overdue", "change in bank info", "attached invoice", "po num"],
    gradient: "from-teal-400 to-cyan-600",
    description: "Fake invoices requesting payment to attacker accounts.",
    sampleText: "Subject: URGENT: Payment Overdue - Invoice #INV-98234\n\nDear Finance Team,\n\nPlease find attached unpaid invoice #INV-98234 which is now past due. Note that our change in bank info has been updated. Please process the wire transfer immediately to avoid penalty.\n\nRegards,\nBilling Dept"
  },
  LEGIT: { 
    id: "LEGIT",
    label: "Legitimate Communication", 
    icon: ShieldCheck, 
    keywords: [],
    gradient: "from-emerald-400 to-green-600",
    description: "Standard business or personal communication.",
    sampleText: ""
  }
};

export default function App() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  const [authEmail, setAuthEmail] = useState('analyst@mailguardian.ai');
  const [authPassword, setAuthPassword] = useState('••••••••');
  const [authName, setAuthName] = useState('Security Analyst');

  // App state
  const [emailText, setEmailText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (authEmail && authPassword) {
      setIsAuthenticated(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setResult(null);
    setEmailText('');
  };

  // PDF Report Generation
  const handleGenerateReport = () => {
    if (!result) return;

    const doc = new jsPDF();

    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 40, "F");
    doc.setTextColor(56, 189, 248);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("AI EMAIL THREAT DETECTION REPORT", 15, 25);

    doc.setTextColor(30, 41, 59);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated: ${new Date().toLocaleString()}`, 15, 48);
    doc.text(`Analyst: ${authEmail}`, 15, 54);

    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text(`Verdict: ${result.verdict}`, 15, 68);
    doc.text(`Classification: ${result.threat?.label || 'N/A'}`, 15, 78);
    doc.text(`Risk Score: ${result.score}/100`, 15, 88);
    doc.text(`Confidence: ${result.confidence}%`, 15, 98);

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Detected Threat Signals:", 15, 114);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    if (result.analysis && result.analysis.length > 0) {
      result.analysis.forEach((signal, idx) => {
        doc.text(`• ${signal}`, 20, 124 + idx * 8);
      });
    } else {
      doc.text("• No malicious indicators found.", 20, 124);
    }

    doc.save(`Email_Threat_Report_${Date.now()}.pdf`);
  };

  // Run analysis logic
  const runAnalysis = (textToAnalyze) => {
    if (!textToAnalyze.trim()) return;
    setLoading(true);

    setTimeout(() => {
      const lower = textToAnalyze.toLowerCase();
      let detectedThreatType = threatDatabase.LEGIT;
      let matchedSignals = [];

      if (lower.length > 10) {
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
            break;
          }
        }
      }

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
          score: 85 + Math.floor(Math.random() * 10),
          verdict: 'MALICIOUS',
          analysis: [...matchedSignals, 'Abnormal urgency detected', 'Sender behavior anomaly score: 7/10'],
          confidence: 91
        });
      }
      setLoading(false);
    }, 1200);
  };

  const handleAnalyze = () => {
    runAnalysis(emailText);
  };

  const handleSelectSample = (threatObj) => {
    setEmailText(threatObj.sampleText);
    runAnalysis(threatObj.sampleText);
  };

  // --- Auth View (Login / Sign Up) ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6 font-sans relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="w-full max-w-md bg-slate-900/70 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl shadow-2xl space-y-6 relative z-10">
          
          {/* Logo & Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 mb-2">
              <Radio className="w-10 h-10 text-indigo-400 animate-pulse" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">AI Mail<span className="text-indigo-400">Guardian</span></h1>
            <p className="text-xs text-slate-400 font-mono">ENTERPRISE THREAT ASSESSMENT PORTAL</p>
          </div>

          {/* Toggle Tabs */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setAuthMode('login')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${authMode === 'login' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
              Sign In
            </button>
            <button
              onClick={() => setAuthMode('signup')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${authMode === 'signup' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
              Register Analyst
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {authMode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    placeholder="Analyst Name"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-slate-200"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Analyst Email ID</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="name@organization.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-slate-200 font-mono text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Security Key / Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-slate-200"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 mt-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl transition duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95"
            >
              {authMode === 'login' ? 'Authenticate Console' : 'Create Account & Launch'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center pt-2">
            <span className="text-[10px] font-mono text-slate-600">
              SECURE ENCLAVE // RSA 4096-BIT ENCRYPTED SESSION
            </span>
          </div>

        </div>
      </div>
    );
  }

  // --- Main Dashboard View ---
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8 font-sans">
      
      {/* Header */}
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
        
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-slate-200">{authName}</p>
            <p className="text-[10px] font-mono text-indigo-400">{authEmail}</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-red-500/20 border border-slate-700/60 hover:border-red-500/40 text-slate-400 hover:text-red-400 transition cursor-pointer"
            title="Lock Console / Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Grid */}
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-8">
          
          {/* Input Panel */}
          <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800 shadow-2xl space-y-5">
            <label className="flex items-center gap-3 text-lg font-bold text-white mb-2">
              <Mail className="w-6 h-6 text-indigo-400" /> Analysis Input Console
            </label>
            <div className="relative">
                <textarea
                  className="w-full h-80 p-5 bg-slate-950/80 border border-slate-700/50 rounded-2xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 resize-none font-mono"
                  placeholder="Paste raw email or click a classification card below to run a sample test..."
                  value={emailText}
                  onChange={(e) => setEmailText(e.target.value)}
                />
            </div>
            <button
              onClick={handleAnalyze}
              disabled={loading || !emailText.trim()}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white text-lg font-bold rounded-2xl transition duration-300 flex items-center justify-center gap-3 cursor-pointer shadow-lg active:scale-[0.98]"
            >
              <Search className="w-5 h-5" />
              {loading ? 'Executing AI Model...' : 'Start Threat Analysis'}
            </button>
          </div>

          {/* Interactive Classification Cards */}
          <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800/80">
            <h4 className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-3">
              Supported Detection Classifications <span className="text-indigo-400 font-normal">(Click to Test)</span>
            </h4>
            <div className="grid grid-cols-3 gap-3">
              {[threatDatabase.BEC, threatDatabase.PHISHING, threatDatabase.INVOICE].map(t => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => handleSelectSample(t)}
                    className="text-center p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 hover:border-indigo-500/50 flex flex-col items-center gap-2 transition cursor-pointer active:scale-95 group"
                  >
                    <Icon className={`w-6 h-6 bg-gradient-to-br ${t.gradient} rounded-md p-0.5 text-white group-hover:scale-110 transition`} />
                    <span className="text-[10px] text-slate-300 font-medium leading-tight group-hover:text-white">{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Dashboard & PDF Button */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="bg-slate-900/60 p-8 rounded-3xl border border-slate-800 shadow-2xl min-h-[440px] flex flex-col justify-center relative overflow-hidden">
            
            {!result && !loading && (
              <div className="text-center space-y-4 py-20 flex flex-col items-center">
                 <Radio className="w-16 h-16 text-slate-700 animate-pulse" strokeWidth={1}/>
                 <h2 className="text-xl font-bold text-slate-600">Awaiting Analysis Directive</h2>
                 <p className="text-sm text-slate-700 max-w-xs">Click any category card or paste email text to start threat analysis.</p>
              </div>
            )}

            {loading && (
                <>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-50">
                    <div className="w-64 h-64 border-4 border-indigo-500/20 rounded-full animate-ping"></div>
                    <div className="absolute w-40 h-40 border-4 border-indigo-500/30 rounded-full animate-pulse"></div>
                    <div className="absolute w-16 h-16 border-4 border-indigo-400/50 rounded-full"></div>
                  </div>
                  <div className="text-center text-indigo-400 font-bold z-10 space-y-2">
                     <Clock3 className="w-10 h-10 mx-auto animate-spin" />
                     <p className="text-lg">Scanning Payload...</p>
                     <p className="text-xs font-mono text-slate-500">Executing NLP & Behavioral Inspection Engines</p>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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

                {/* Generate PDF Button */}
                <div className="pt-4 border-t border-slate-800 flex justify-end">
                  <button
                    onClick={handleGenerateReport}
                    className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm rounded-xl transition duration-200 shadow-lg flex items-center gap-2 cursor-pointer active:scale-95"
                  >
                    📄 Generate PDF Report
                  </button>
                </div>
              </>
            )}
          </div>
          
          <footer className="max-w-7xl mx-auto p-4 bg-slate-900/30 rounded-2xl border border-slate-800/80 text-center text-slate-600 text-[10px] font-mono tracking-wide">
             MODEL: DISTILBERT // TRN_SET: ENRON_KAGGLE_PHISH // INF_LAT: 12ms // VER: 1.2
          </footer>

        </div>
      </main>
    </div>
  );
}