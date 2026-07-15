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

  useEffect(() => {
    // Auth Check
    const token = localStorage.getItem("nyaya_token");
    const email = localStorage.getItem("nyaya_email") || "admin@nyayasetu.ai"; // fallback for demo if skipped
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
    <div className="flex flex-col h-full p-4 md:p-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 pt-4 md:pt-0">
          <h1 className="text-xl md:text-2xl font-bold">Dashboard</h1>
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 md:gap-6 w-full md:w-auto">
            <div className="flex justify-between items-center gap-4">
              <Button 
                variant="outline" 
                onClick={() => setWhiteLabel(!whiteLabel)} 
                className={`text-xs flex-1 ${whiteLabel ? 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10' : 'border-teal-500/30 text-teal-400 hover:bg-teal-500/10'}`}
              >
                Toggle Demo Branding
              </Button>
              <Button variant="ghost" size="icon" className="relative text-neutral-400 hover:text-white shrink-0">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-teal-500 rounded-full"></span>
              </Button>
            </div>
            <div className="relative w-full md:w-auto">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input 
                type="text" 
                placeholder="Search cases, laws, precedents..." 
                className="bg-neutral-900 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-teal-500/50 w-full md:w-64 text-white"
              />
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="overflow-y-auto">
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
                <Button variant="link" className="text-teal-400">View All</Button>
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
                          {(consult.citizen || "?").charAt(0)}
                        </div>
                        <div className="max-w-md">
                          <p className="font-semibold text-white mb-1 truncate">{consult.citizen || "Unknown Client"}</p>
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
                        <Button variant="outline" size="sm" onClick={() => setActiveCall(consult.citizen)} className="border-teal-500/30 text-teal-400 hover:bg-teal-500/10 shrink-0">
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
              <div className="p-6 rounded-2xl bg-gradient-to-b from-teal-900/20 to-transparent border border-teal-500/20 h-[300px] flex flex-col justify-between">
                <div>
                  <Bot className={`w-8 h-8 mb-4 ${whiteLabel ? 'text-emerald-400' : 'text-teal-400'}`} />
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

      {/* Video Call Modal (Jitsi Iframe) */}
      {activeCall && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center p-4 md:p-8">
          <div className="w-full max-w-5xl bg-neutral-900 rounded-2xl overflow-hidden flex flex-col border border-white/10 shadow-2xl">
            <div className="flex justify-between items-center p-4 border-b border-white/10 bg-neutral-950">
              <h3 className="font-bold flex items-center gap-2 text-white">
                <Video className="w-5 h-5 text-teal-400"/> Consultation Room: {activeCall}
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
