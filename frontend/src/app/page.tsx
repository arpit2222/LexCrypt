import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Scale, Shield, FileText, Users } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

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
          <div className="flex items-center gap-4 ml-4">
            <Link href="/citizen">
              <Button variant="ghost" className="text-neutral-300 hover:text-white hover:bg-white/5">
                Citizen Login
              </Button>
            </Link>
            <Link href="/student">
              <Button variant="ghost" className="text-neutral-300 hover:text-white hover:bg-white/5">
                Student Login
              </Button>
            </Link>
            <Link href="/lawyer">
              <Button variant="ghost" className="text-neutral-300 hover:text-white hover:bg-white/5">
                Lawyer Login
              </Button>
            </Link>
            <Link href="/admin">
              <Button variant="outline" className="border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10">
                Supreme Court
              </Button>
            </Link>
            <ConnectButton />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center px-4 pt-32 pb-24 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-indigo-300 mb-8 backdrop-blur-sm">
          <span className="flex w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
           Powered by Fhenix Fully Homomorphic Encryption
        </div>
        
        <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-neutral-200 to-neutral-500 mb-8 leading-tight">
          Privacy-First Smart Contracts for Legal.
        </h1>
        
        <p className="text-lg md:text-xl text-neutral-400 max-w-3xl mb-12 leading-relaxed">
          The $200B legal industry can't use public blockchains due to confidentiality conflicts. LexCrypt solves this by executing legal logic—like M&A earnouts and blind auctions—on <strong>encrypted data</strong> without ever decrypting it on-chain.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link href="/composer">
            <Button size="lg" className="h-14 px-8 text-lg bg-white text-black hover:bg-neutral-200 rounded-full font-semibold transition-all">
              Launch Contract Composer <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <Link href="/docs/whitepaper.md">
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-white/10 hover:bg-white/5 rounded-full font-medium">
              Read FHE Whitepaper
            </Button>
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
                title: "Confidential M&A Agreements",
                desc: "Store purchase prices and earnout formulas as euint32. Smart contracts release payments automatically without ever exposing the reserve price."
              },
              {
                icon: <FileText className="w-8 h-8 text-purple-400" />,
                title: "Sealed-Bid Procurements",
                desc: "Government RFPs where bids are encrypted. The contract compares bids and selects the winner using FHE, maintaining absolute secrecy of losing bids."
              },
              {
                icon: <Users className="w-8 h-8 text-indigo-400" />,
                title: "Enterprise Payroll Compliance",
                desc: "Process payroll on-chain while keeping salaries encrypted. 100% GDPR and CCPA compliant privacy-by-design."
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
      
      {/* Footer */}
      <footer className="relative z-10 py-12 border-t border-white/5 text-center text-neutral-500 text-sm">
        <p>© 2026 Nyaya AI. All rights reserved.</p>
        <p className="mt-2">Built on Arbitrum & Fhenix with ❤️</p>
      </footer>
    </div>
  );
}
