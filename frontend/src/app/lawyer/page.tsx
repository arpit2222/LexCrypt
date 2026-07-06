"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Scale, Search, Bell, LayoutDashboard, Briefcase, FileText, CheckCircle2, ChevronRight, MessageSquare, Clock, Video, Bot, Coins, Menu } from "lucide-react";

export default function LawyerDashboard() {
  const [activeCall, setActiveCall] = useState<string | null>(null);
  const [liveCases, setLiveCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [whiteLabel, setWhiteLabel] = useState(true);
  const [tokens, setTokens] = useState<number | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // Auth Check
    const token = localStorage.getItem("nyaya_token");
    const email = localStorage.getItem("nyaya_email") || "admin@nyaya.ai"; // fallback for demo if skipped
    if (!token && window.location.pathname === "/lawyer") {
       window.location.href = "/login";
       return;
    }

    const fetchData = async () => {
      try {
        const userRes = await fetch(`/api/user/me?email=${email}`);
        if(userRes.ok) {
           const userData = await userRes.json();
           setTokens(userData.tokens_remaining);
        }

        const res = await fetch("/api/cases/lawyer?lawyer_id=1");
        const data = await res.json();
        setLiveCases(data);
      } catch (err) {
        console.error("Failed to fetch cases", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    // Poll every 5 seconds for live demo effect
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 flex">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-white/5 bg-neutral-900/95 backdrop-blur-xl flex flex-col transform transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}>
        <div className="p-6 flex items-center gap-3 border-b border-white/5">
          <Link href="/" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3">
            {whiteLabel ? <Briefcase className="w-8 h-8 text-emerald-400" /> : <Scale className="w-8 h-8 text-indigo-400" />}
            <span className="font-bold tracking-wide">{whiteLabel ? "Sharma & Associates" : "Nyaya Hub"}</span>
          </Link>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link href="/lawyer" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 px-4 py-3 bg-indigo-600/10 text-indigo-300 rounded-xl font-medium">
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </Link>
          <Link href="/lawyer/cases" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 px-4 py-3 text-neutral-400 hover:text-white hover:bg-white/5 rounded-xl font-medium transition-colors">
            <Briefcase className="w-5 h-5" /> Active Cases
          </Link>
          <Link href="/lawyer/copilot" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 px-4 py-3 text-neutral-400 hover:text-white hover:bg-white/5 rounded-xl font-medium transition-colors">
            <MessageSquare className="w-5 h-5" /> AI Copilot
          </Link>
          <Link href="/lawyer/drafts" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 px-4 py-3 text-neutral-400 hover:text-white hover:bg-white/5 rounded-xl font-medium transition-colors">
            <FileText className="w-5 h-5" /> Drafts & Documents
          </Link>
        </nav>
        <div className="p-4 border-t border-white/5 space-y-4">
          {/* Token Display */}
          <div className="px-4 py-3 bg-neutral-900 rounded-xl border border-white/5">
            <p className="text-xs text-neutral-400 mb-1 font-semibold uppercase tracking-wider">AI Quota</p>
            <div className="flex items-center gap-2">
               <Coins className="w-4 h-4 text-emerald-400" />
               <span className="font-mono text-sm text-white">{tokens !== null ? tokens : '...'}</span>
               <span className="text-xs text-neutral-500">remaining</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold">A</div>
            <div>
              <p className="text-sm font-medium text-white">Adv. Sharma</p>
              <p className="text-xs text-neutral-500">Corporate Law</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col max-h-screen overflow-y-auto">
        {/* Header */}
        <header className="h-20 border-b border-white/5 px-4 md:px-8 flex items-center justify-between sticky top-0 bg-neutral-950/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <button className="md:hidden p-2 -ml-2 text-neutral-400 hover:text-white rounded-lg hover:bg-white/5" onClick={() => setIsSidebarOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl md:text-2xl font-bold">Dashboard</h1>
          </div>
          <div className="flex items-center gap-6">
            <Button 
              variant="outline" 
              onClick={() => setWhiteLabel(!whiteLabel)} 
              className={`text-xs ${whiteLabel ? 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10' : 'border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10'}`}
            >
              Toggle Demo Branding
            </Button>
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input 
                type="text" 
                placeholder="Search cases, laws, precedents..." 
                className="bg-neutral-900 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-indigo-500/50 w-64 text-white"
              />
            </div>
            <Button variant="ghost" size="icon" className="relative text-neutral-400 hover:text-white">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full"></span>
            </Button>
          </div>
        </header>

        {/* Content */}
        <div className="p-8 overflow-y-auto">
          {/* Welcome & Stats */}
          <div className="mb-10">
            <h2 className="text-xl text-neutral-400 mb-6">Welcome back, <span className="text-white font-medium">Advocate Sharma</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: "Pending Consultations", value: "4", icon: <Clock className="w-6 h-6 text-yellow-400" /> },
                { label: "Active Cases", value: "12", icon: <Briefcase className="w-6 h-6 text-blue-400" /> },
                { label: "AI Briefs Ready", value: "3", icon: <CheckCircle2 className="w-6 h-6 text-green-400" /> }
              ].map((stat, i) => (
                <div key={i} className="p-6 rounded-2xl bg-neutral-900/50 border border-white/5 flex items-center gap-4">
                  <div className="p-3 bg-white/5 rounded-xl">{stat.icon}</div>
                  <div>
                    <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                    <p className="text-sm text-neutral-400">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Upcoming Consultations */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Upcoming Consultations</h3>
                <Button variant="link" className="text-indigo-400">View All</Button>
              </div>
              <div className="space-y-4">
                {loading ? (
                  <div className="text-neutral-500 text-sm py-4">Loading active cases...</div>
                ) : liveCases.length === 0 ? (
                  <div className="text-neutral-500 text-sm py-4">No active cases assigned yet.</div>
                ) : (
                  liveCases.map((consult, i) => (
                    <div key={consult._id} className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all flex items-center justify-between group cursor-pointer">
                      <div className="flex gap-4 items-center">
                        <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center font-bold text-lg text-neutral-300 uppercase">
                          {consult.citizen.charAt(0)}
                        </div>
                        <div className="max-w-md">
                          <p className="font-semibold text-white mb-1 truncate">{consult.citizen}</p>
                          <div className="flex items-center gap-3 text-sm text-neutral-400">
                            <span className="flex items-center gap-1 shrink-0"><Clock className="w-4 h-4" /> {new Date(consult.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            <span className="w-1 h-1 bg-neutral-600 rounded-full shrink-0"></span>
                            <span className="truncate">{consult.query}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {consult.status === "ACCEPTED" ? (
                          <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-medium border border-green-500/20 flex items-center gap-1 hidden md:flex shrink-0">
                            <CheckCircle2 className="w-3 h-3" /> Assigned
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-400 text-xs font-medium border border-yellow-500/20 flex items-center gap-1 hidden md:flex shrink-0">
                            <Clock className="w-3 h-3" /> New Lead
                          </span>
                        )}
                        <Button variant="outline" size="sm" onClick={() => setActiveCall(consult.citizen)} className="border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10 shrink-0">
                          <Video className="w-4 h-4 mr-2"/> Join
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* AI Copilot Quick Access */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">AI Copilot</h3>
              <div className="p-6 rounded-2xl bg-gradient-to-b from-indigo-900/20 to-transparent border border-indigo-500/20 h-[300px] flex flex-col justify-between">
                <div>
                  <Bot className={`w-8 h-8 mb-4 ${whiteLabel ? 'text-emerald-400' : 'text-indigo-400'}`} />
                  <p className="text-lg font-medium text-white mb-2">Private Firm AI</p>
                  <p className="text-sm text-neutral-400">Ask your Copilot to search your firm's historical templates and past judgments.</p>
                </div>
                <div className="space-y-3">
                  <Link href="/lawyer/copilot" className="block w-full text-left px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-sm text-neutral-300 transition-colors border border-white/5">
                    "Find recent Supreme Court judgments on Section 138 NI Act"
                  </Link>
                  <Link href="/lawyer/copilot" className="block w-full text-left px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-sm text-neutral-300 transition-colors border border-white/5">
                    "Draft a legal notice for breach of contract"
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Video Call Modal (Jitsi Iframe) */}
      {activeCall && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center p-4 md:p-8">
          <div className="w-full max-w-5xl bg-neutral-900 rounded-2xl overflow-hidden flex flex-col border border-white/10 shadow-2xl">
            <div className="flex justify-between items-center p-4 border-b border-white/10 bg-neutral-950">
              <h3 className="font-bold flex items-center gap-2 text-white">
                <Video className="w-5 h-5 text-indigo-400"/> Consultation Room: {activeCall}
              </h3>
              <Button variant="destructive" onClick={() => setActiveCall(null)}>End Call</Button>
            </div>
            <iframe 
              allow="camera; microphone; fullscreen; display-capture" 
              src={`https://meet.jit.si/NyayaConsultation-${activeCall.replace(/\s+/g, '')}`} 
              style={{ height: "75vh", width: "100%", border: 0 }} 
            />
          </div>
        </div>
      )}
    </div>
  );
}
