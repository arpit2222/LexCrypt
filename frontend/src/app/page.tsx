import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Scale, Shield, FileText, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 selection:bg-indigo-500/30">
      {/* Background gradients */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/20 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/20 blur-[120px]" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto border-b border-white/5">
        <div className="flex items-center gap-2">
          <Scale className="w-8 h-8 text-indigo-400" />
          <span className="text-xl font-bold tracking-wider">NYAYA AI</span>
        </div>
        <div className="flex items-center gap-6 text-sm font-medium">
          <Link href="#features" className="text-neutral-400 hover:text-white transition-colors">Features</Link>
          <Link href="#how-it-works" className="text-neutral-400 hover:text-white transition-colors">How it works</Link>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 ml-4">
            <Button asChild variant="ghost" className="text-neutral-300 hover:text-white hover:bg-white/5">
              <Link href="/citizen">Citizen Login</Link>
            </Button>
            <Button asChild variant="ghost" className="text-neutral-300 hover:text-white hover:bg-white/5 hidden md:inline-flex">
              <Link href="/student">Student Login</Link>
            </Button>
            <Button asChild variant="ghost" className="text-neutral-300 hover:text-white hover:bg-white/5 hidden md:inline-flex">
              <Link href="/lawyer">Lawyer Login</Link>
            </Button>
            <Button asChild variant="outline" className="border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10">
              <Link href="/login">Supreme Court</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center px-4 pt-32 pb-24 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-indigo-300 mb-8 backdrop-blur-sm">
          <span className="flex w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
           Powered by Enterprise-Grade Proprietary AI
        </div>
        
        <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-neutral-200 to-neutral-500 mb-8 leading-tight">
          Intelligent Legal Workflows.
        </h1>
        
        <p className="text-lg md:text-xl text-neutral-400 max-w-3xl mb-12 leading-relaxed">
          The legal industry runs on data. LexCrypt transforms your firm's historical documents into an exclusive, highly-secure AI Copilot that automatically triages cases, drafts contracts, and speeds up research.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Button asChild size="lg" className="h-14 px-8 text-lg bg-white text-black hover:bg-neutral-200 rounded-full font-semibold transition-all">
            <Link href="/login">
              Launch Venture Console <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-14 px-8 text-lg border-white/10 hover:bg-white/5 rounded-full font-medium">
            <Link href="#features">
              Explore Platform
            </Link>
          </Button>
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
                icon: <Users className="w-8 h-8 text-indigo-400" />,
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
                <div className="absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-indigo-600 border-4 border-neutral-950 flex items-center justify-center font-bold text-white z-10 hidden md:flex">1</div>
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
        <p>© 2026 Nyaya AI. All rights reserved.</p>
        <p className="mt-2">Built with Next.js & OpenAI ❤️</p>
      </footer>
    </div>
  );
}
