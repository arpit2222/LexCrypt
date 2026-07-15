"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, GraduationCap, Gavel, FileText, ArrowRight, Menu, Scale, LayoutDashboard, LogOut } from "lucide-react";
import { mockCases } from "@/lib/cases";

export default function StudentDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("nyaya_token");
    localStorage.removeItem("nyaya_email");
    localStorage.removeItem("nyaya_role");
    router.push("/login");
  };

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
            <Scale className="w-8 h-8 text-teal-400" />
            <span className="font-bold text-xl tracking-wide">Nyaya Setu</span>
          </Link>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link href="/student" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 px-4 py-3 bg-teal-600/10 text-teal-300 rounded-xl font-medium">
            <GraduationCap className="w-5 h-5" /> Moot Court Arena
          </Link>
          <a href="#" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 px-4 py-3 text-neutral-400 hover:text-white hover:bg-white/5 rounded-xl font-medium transition-colors">
            <FileText className="w-5 h-5" /> My Scores
          </a>
        </nav>
        <div className="p-4 border-t border-white/5 mt-auto">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-xl font-medium transition-colors">
            <LogOut className="w-5 h-5" /> Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col max-h-screen overflow-y-auto">
        <header className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-neutral-950/80 sticky top-0 z-30 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <button className="md:hidden p-2 -ml-2 text-neutral-400 hover:text-white rounded-lg hover:bg-white/5" onClick={() => setIsSidebarOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold flex items-center gap-2 hidden md:flex"><GraduationCap className="w-6 h-6 text-teal-400"/> Nyaya Student Hub</h1>
            <span className="font-bold text-lg md:hidden">Student Hub</span>
          </div>
        </header>

        <div className="max-w-5xl w-full mx-auto p-4 md:p-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Welcome to Moot Court</h1>
          <p className="text-neutral-400 text-lg">Select a mock case below to enter the practice arena. Argue your case against an AI Judge and receive an instant score.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockCases.map((c) => (
            <div key={c.id} className="bg-neutral-900/50 border border-white/10 rounded-2xl p-6 flex flex-col hover:border-teal-500/50 transition-colors group">
              <div className="flex justify-between items-start mb-4">
                <span className="px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 text-xs font-medium border border-teal-500/20">
                  {c.tag}
                </span>
                <span className={`text-xs font-semibold ${c.difficulty === 'Beginner' ? 'text-green-400' : c.difficulty === 'Intermediate' ? 'text-yellow-400' : 'text-red-400'}`}>
                  {c.difficulty}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-teal-300 transition-colors">{c.title}</h3>
              <p className="text-sm text-neutral-400 mb-6 flex-1">{c.description}</p>
              
              <Link href={`/student/practice?case=${c.id}`}>
                <Button className="w-full bg-white text-black hover:bg-neutral-200">
                  Start Simulation <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          ))}
        </div>
        </div>
      </main>
    </div>
  );
}
