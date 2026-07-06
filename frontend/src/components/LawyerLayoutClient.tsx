"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Scale, Briefcase, LayoutDashboard, MessageSquare, FileText, Coins, Menu } from "lucide-react";

export default function LawyerLayoutClient({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [tokens, setTokens] = useState<number | null>(null);
  const [whiteLabel, setWhiteLabel] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const email = localStorage.getItem("nyaya_email") || "admin@nyaya.ai";
    const fetchData = async () => {
      try {
        const userRes = await fetch(`/api/user/me?email=${email}`);
        if(userRes.ok) {
           const userData = await userRes.json();
           setTokens(userData.tokens_remaining);
        }
      } catch (err) {}
    };
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 flex font-sans selection:bg-indigo-500/30">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-white/5 bg-neutral-900/95 backdrop-blur-xl flex flex-col transform transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}>
        <div className="p-6 flex items-center gap-3 border-b border-white/5">
          <Link href="/" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 group">
            {whiteLabel ? <Briefcase className="w-8 h-8 text-emerald-400 group-hover:text-emerald-300 transition-colors" /> : <Scale className="w-8 h-8 text-indigo-400 group-hover:text-indigo-300 transition-colors" />}
            <span className="font-bold tracking-wide group-hover:text-white text-neutral-200 transition-colors">{whiteLabel ? "Sharma & Associates" : "Nyaya Hub"}</span>
          </Link>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link href="/lawyer" onClick={() => setIsSidebarOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${pathname === '/lawyer' ? 'bg-indigo-600/10 text-indigo-300' : 'text-neutral-400 hover:text-white hover:bg-white/5'}`}>
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </Link>
          <Link href="/lawyer/cases" onClick={() => setIsSidebarOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${pathname === '/lawyer/cases' ? 'bg-indigo-600/10 text-indigo-300' : 'text-neutral-400 hover:text-white hover:bg-white/5'}`}>
            <Briefcase className="w-5 h-5" /> Active Cases
          </Link>
          <Link href="/lawyer/copilot" onClick={() => setIsSidebarOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${pathname === '/lawyer/copilot' ? 'bg-indigo-600/10 text-indigo-300' : 'text-neutral-400 hover:text-white hover:bg-white/5'}`}>
            <MessageSquare className="w-5 h-5" /> AI Copilot
          </Link>
          <Link href="/lawyer/drafts" onClick={() => setIsSidebarOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${pathname === '/lawyer/drafts' ? 'bg-indigo-600/10 text-indigo-300' : 'text-neutral-400 hover:text-white hover:bg-white/5'}`}>
            <FileText className="w-5 h-5" /> Drafts & Documents
          </Link>
        </nav>
        <div className="p-4 border-t border-white/5 space-y-4">
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

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
         {/* Universal Mobile Header */}
         <header className="md:hidden flex items-center px-4 py-4 border-b border-white/5 bg-neutral-950/80 sticky top-0 z-30 backdrop-blur-md">
           <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 text-neutral-400 hover:text-white rounded-lg hover:bg-white/5">
             <Menu className="w-6 h-6" />
           </button>
           <div className="ml-2 flex items-center gap-2 font-bold text-lg">
             <Briefcase className="w-5 h-5 text-emerald-400" /> {whiteLabel ? "Sharma & Assoc." : "Nyaya"}
           </div>
         </header>
         {/* Page Content */}
         <div className="flex-1 overflow-y-auto">
            {children}
         </div>
      </main>
    </div>
  );
}
