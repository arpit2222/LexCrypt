"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Scale, Search, Bell, LayoutDashboard, Briefcase, FileText, CheckCircle2, ChevronRight, MessageSquare, Clock, Video, Bot } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function LawyerDashboard() {
  const [activeCall, setActiveCall] = useState<string | null>(null);
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-neutral-900/30 flex flex-col hidden md:flex">
        <div className="p-6 flex items-center gap-3 border-b border-white/5">
          <Scale className="w-8 h-8 text-indigo-400" />
          <span className="font-bold tracking-wide">Nyaya Hub</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link href="/lawyer" className="flex items-center gap-3 px-4 py-3 bg-indigo-600/10 text-indigo-300 rounded-xl font-medium">
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </Link>
          <Link href="/lawyer/cases" className="flex items-center gap-3 px-4 py-3 text-neutral-400 hover:text-white hover:bg-white/5 rounded-xl font-medium transition-colors">
            <Briefcase className="w-5 h-5" /> Active Cases
          </Link>
          <Link href="/lawyer/copilot" className="flex items-center gap-3 px-4 py-3 text-neutral-400 hover:text-white hover:bg-white/5 rounded-xl font-medium transition-colors">
            <MessageSquare className="w-5 h-5" /> AI Copilot
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-3 text-neutral-400 hover:text-white hover:bg-white/5 rounded-xl font-medium transition-colors">
            <FileText className="w-5 h-5" /> Drafts & Documents
          </Link>
        </nav>
        <div className="p-4 border-t border-white/5">
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
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-20 border-b border-white/5 px-8 flex items-center justify-between sticky top-0 bg-neutral-950/80 backdrop-blur-md z-10">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-6">
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
            <ConnectButton />
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
                {[
                  { name: "Rahul Verma", time: "Today, 2:00 PM", issue: "Property Dispute (Civil)", aiStatus: "AI Brief Ready" },
                  { name: "Priya Singh", time: "Today, 4:30 PM", issue: "Consumer Complaint", aiStatus: "AI Brief Ready" },
                  { name: "Amit Patel", time: "Tomorrow, 10:00 AM", issue: "Employment Contract", aiStatus: "Processing" },
                ].map((consult, i) => (
                  <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all flex items-center justify-between group cursor-pointer">
                    <div className="flex gap-4 items-center">
                      <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center font-bold text-lg text-neutral-300">
                        {consult.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-white mb-1">{consult.name}</p>
                        <div className="flex items-center gap-3 text-sm text-neutral-400">
                          <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {consult.time}</span>
                          <span className="w-1 h-1 bg-neutral-600 rounded-full"></span>
                          <span>{consult.issue}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {consult.aiStatus === "AI Brief Ready" ? (
                        <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-medium border border-green-500/20 flex items-center gap-1 hidden md:flex">
                          <CheckCircle2 className="w-3 h-3" /> {consult.aiStatus}
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-400 text-xs font-medium border border-yellow-500/20 flex items-center gap-1 hidden md:flex">
                          <Clock className="w-3 h-3" /> {consult.aiStatus}
                        </span>
                      )}
                      <Button variant="outline" size="sm" onClick={() => setActiveCall(consult.name)} className="border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10">
                        <Video className="w-4 h-4 mr-2"/> Join
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Copilot Quick Access */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">AI Copilot</h3>
              <div className="p-6 rounded-2xl bg-gradient-to-b from-indigo-900/20 to-transparent border border-indigo-500/20 h-[300px] flex flex-col justify-between">
                <div>
                  <Bot className="w-8 h-8 text-indigo-400 mb-4" />
                  <p className="text-lg font-medium text-white mb-2">Need quick research?</p>
                  <p className="text-sm text-neutral-400">Ask Nyaya AI for precedents, case summaries, or legal drafting assistance.</p>
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
