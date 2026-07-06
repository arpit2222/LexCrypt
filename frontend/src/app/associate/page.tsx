"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Scale, Users, FileSearch, Inbox, ArrowRight, ShieldCheck, Menu } from "lucide-react";

export default function AssociateDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
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
            <Scale className="w-8 h-8 text-blue-400" />
            <span className="font-bold text-xl tracking-wide">Nyaya Connect</span>
          </Link>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link href="#" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 px-4 py-3 bg-blue-600/10 text-blue-300 rounded-xl font-medium">
            <Inbox className="w-5 h-5" /> Intake Queue
          </Link>
          <Link href="#" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 px-4 py-3 text-neutral-400 hover:text-white hover:bg-white/5 rounded-xl font-medium">
            <Users className="w-5 h-5" /> Client Directory
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col max-h-screen overflow-y-auto">
        <header className="flex items-center px-6 py-4 border-b border-white/5 bg-neutral-950/80 sticky top-0 z-30 backdrop-blur-md mb-8">
          <button className="md:hidden p-2 -ml-2 text-neutral-400 hover:text-white rounded-lg hover:bg-white/5 mr-4" onClick={() => setIsSidebarOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex-1 flex justify-between items-center">
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Intake Review Queue</h1>
              <p className="text-sm md:text-base text-neutral-400 hidden sm:block">Review AI summaries and assign to relevant lawyers.</p>
            </div>
            <div className="flex items-center gap-2 bg-blue-500/10 text-blue-400 px-3 md:px-4 py-2 rounded-full text-xs md:text-sm font-medium border border-blue-500/20">
              <ShieldCheck className="w-4 h-4" /> <span className="hidden sm:inline">12 Pending Reviews</span><span className="sm:hidden">12</span>
            </div>
          </div>
        </header>

        <div className="px-4 md:px-8 space-y-6">
          {[
            { id: "C-1049", user: "Ramesh K.", issue: "Property encroachment dispute in rural Maharashtra", lang: "Marathi", urgency: "High" },
            { id: "C-1050", user: "Sneha M.", issue: "Workplace harassment complaint formulation", lang: "English", urgency: "Medium" },
          ].map((caseItem, idx) => (
            <div key={idx} className="bg-neutral-900/50 border border-white/5 rounded-2xl p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-neutral-800 rounded-full flex items-center justify-center font-bold">
                    {caseItem.user.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold">{caseItem.user} <span className="text-neutral-500 text-sm font-normal ml-2">ID: {caseItem.id}</span></h3>
                    <p className="text-sm text-neutral-400">Language preference: {caseItem.lang}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${caseItem.urgency === 'High' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'}`}>
                  {caseItem.urgency} Priority
                </span>
              </div>
              
              <div className="bg-white/5 rounded-xl p-4 mb-6">
                <p className="text-sm font-medium text-blue-300 mb-2 flex items-center gap-2"><FileSearch className="w-4 h-4" /> AI Generated Summary</p>
                <p className="text-sm text-neutral-300">{caseItem.issue}. The AI has classified this under Civil Litigation and pulled relevant state property codes. The user has uploaded 2 documents which have been verified via OCR.</p>
              </div>

              <div className="flex gap-4">
                <Button className="bg-blue-600 hover:bg-blue-500 text-white">
                  Assign to Lawyer <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button variant="outline" className="border-white/10 text-neutral-300 hover:bg-white/5">
                  Request More Info
                </Button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
