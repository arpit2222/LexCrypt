"use client";

import React, { useState } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight, Scale, Shield, FileText, Users, Menu, X } from "lucide-react";

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 selection:bg-teal-500/30">
      {/* Background gradients */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-teal-900/20 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/20 blur-[120px]" />
      </div>

      {/* Navbar */}
      <nav className="relative z-20 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto border-b border-white/5">
        <div className="flex items-center gap-2">
          <Scale className="w-8 h-8 text-teal-400" />
          <span className="text-xl font-bold tracking-wider">NYAYA SETU</span>
        </div>
        
        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-6 text-sm font-medium">
          <Link href="#features" className="text-neutral-400 hover:text-white transition-colors">Features</Link>
          <Link href="#how-it-works" className="text-neutral-400 hover:text-white transition-colors">How it works</Link>
          <div className="flex items-center gap-4 ml-4">
            <Link href="/citizen" className={cn(buttonVariants({ variant: "ghost" }), "text-neutral-300 hover:text-white hover:bg-white/5")}>
              Citizen Login
            </Link>
            <Link href="/student" className={cn(buttonVariants({ variant: "ghost" }), "text-neutral-300 hover:text-white hover:bg-white/5")}>
              Student Login
            </Link>
            <Link href="/lawyer" className={cn(buttonVariants({ variant: "ghost" }), "text-neutral-300 hover:text-white hover:bg-white/5")}>
              Lawyer Login
            </Link>
            <Link href="/login" className={cn(buttonVariants({ variant: "outline" }), "border-teal-500/30 text-teal-400 hover:bg-teal-500/10")}>
              Supreme Court
            </Link>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="lg:hidden p-2 text-neutral-400 hover:text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-[85px] left-0 right-0 bg-neutral-950/95 backdrop-blur-xl border-b border-white/10 z-50 p-6 flex flex-col gap-4 shadow-2xl">
          <Link href="#features" onClick={() => setIsMobileMenuOpen(false)} className="text-neutral-300 font-medium py-2">Features</Link>
          <Link href="#how-it-works" onClick={() => setIsMobileMenuOpen(false)} className="text-neutral-300 font-medium py-2">How it works</Link>
          <hr className="border-white/5 my-2" />
          <Link href="/citizen" onClick={() => setIsMobileMenuOpen(false)} className={cn(buttonVariants({ variant: "secondary" }), "w-full justify-center")}>
            Citizen Login
          </Link>
          <Link href="/student" onClick={() => setIsMobileMenuOpen(false)} className={cn(buttonVariants({ variant: "secondary" }), "w-full justify-center")}>
            Student Login
          </Link>
          <Link href="/lawyer" onClick={() => setIsMobileMenuOpen(false)} className={cn(buttonVariants({ variant: "secondary" }), "w-full justify-center")}>
            Lawyer Login
          </Link>
          <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className={cn(buttonVariants({ variant: "default" }), "w-full justify-center bg-teal-600 hover:bg-teal-500")}>
            Supreme Court
          </Link>
        </div>
      )}

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center px-4 pt-32 pb-24 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-teal-300 mb-8 backdrop-blur-sm">
          <span className="flex w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
           Powered by Enterprise-Grade Proprietary AI
        </div>
        
        <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-neutral-200 to-neutral-500 mb-8 leading-tight">
          Intelligent Legal Workflows.
        </h1>
        
        <p className="text-lg md:text-xl text-neutral-400 max-w-3xl mb-12 leading-relaxed">
          The legal industry runs on data. LexCrypt transforms your firm's historical documents into an exclusive, highly-secure AI Copilot that automatically triages cases, drafts contracts, and speeds up research.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link href="/login" className={cn(buttonVariants({ size: "lg" }), "h-14 px-8 text-lg bg-white text-black hover:bg-neutral-200 rounded-full font-semibold transition-all")}>
              Launch Venture Console <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
          <Link href="#features" className={cn(buttonVariants({ size: "lg" }), "bg-transparent h-14 px-8 text-lg border border-white/20 text-white hover:bg-white/10 hover:text-white rounded-full font-medium transition-all")}>
              Explore Platform
          </Link>
        </div>
      </main>

      {/* Features Grid */}
      <section id="features" className="relative z-10 py-24 bg-black/40 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Empowering Every User</h2>
            <p className="text-neutral-400 max-w-xl mx-auto">A multi-layered legal intelligence platform tailored for citizens, lawyers, and institutions.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <Shield className="w-8 h-8 text-blue-400" />,
                title: "Proprietary Data Moats",
                desc: "Your data is your firm's biggest asset. We train private AI models entirely on your historical case files and templates."
              },
              {
                icon: <FileText className="w-8 h-8 text-purple-400" />,
                title: "Automated Intake",
                desc: "A multilingual citizen-facing portal that triages issues and hands them directly to your associates, saving hours of manual work."
              },
              {
                icon: <Users className="w-8 h-8 text-teal-400" />,
                title: "Clinical Education",
                desc: "An advanced Moot Court Arena where students can practice arguments against an AI judge in real-time."
              }
            ].map((feat, i) => (
              <div key={i} className="p-8 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors backdrop-blur-sm group">
                <div className="mb-6 p-4 bg-white/5 rounded-xl inline-block group-hover:scale-110 transition-transform">
                  {feat.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feat.title}</h3>
                <p className="text-neutral-400 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* How it Works Section */}
      <section id="how-it-works" className="relative z-10 py-24 bg-neutral-950">
        <div className="max-w-5xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">The End-to-End Workflow</h2>
            <p className="text-neutral-400 max-w-xl mx-auto">See how LexCrypt connects citizens with your law firm seamlessly.</p>
          </div>
          
          <div className="relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-white/10 -translate-x-1/2" />
            
            <div className="space-y-12">
              {/* Step 1 */}
              <div className="relative flex flex-col md:flex-row items-center gap-8 md:gap-16">
                <div className="md:w-1/2 text-center md:text-right">
                  <h3 className="text-2xl font-bold text-white mb-2">1. Citizen Intake</h3>
                  <p className="text-neutral-400">A potential client visits your website and chats with the AI in their native language (Hindi, Marathi, etc.) to explain their legal problem.</p>
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-teal-600 border-4 border-neutral-950 flex items-center justify-center font-bold text-white z-10 hidden md:flex">1</div>
                <div className="md:w-1/2" />
              </div>
              
              {/* Step 2 */}
              <div className="relative flex flex-col md:flex-row items-center gap-8 md:gap-16">
                <div className="md:w-1/2" />
                <div className="absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-purple-600 border-4 border-neutral-950 flex items-center justify-center font-bold text-white z-10 hidden md:flex">2</div>
                <div className="md:w-1/2 text-center md:text-left">
                  <h3 className="text-2xl font-bold text-white mb-2">2. AI Triage & Translation</h3>
                  <p className="text-neutral-400">The platform automatically translates the query into formal English, assesses the severity of the case, and prepares an initial legal brief.</p>
                </div>
              </div>
              
              {/* Step 3 */}
              <div className="relative flex flex-col md:flex-row items-center gap-8 md:gap-16">
                <div className="md:w-1/2 text-center md:text-right">
                  <h3 className="text-2xl font-bold text-white mb-2">3. Lawyer Handoff</h3>
                  <p className="text-neutral-400">The triaged lead instantly appears on your firm's private Lawyer Dashboard. You can review the AI-generated brief and jump on a video call with one click.</p>
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-emerald-600 border-4 border-neutral-950 flex items-center justify-center font-bold text-white z-10 hidden md:flex">3</div>
                <div className="md:w-1/2" />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="relative z-10 py-12 border-t border-white/5 text-center text-neutral-500 text-sm">
        <p>© 2026 Nyaya Setu. All rights reserved.</p>
        
      </footer>
    </div>
  );
}
