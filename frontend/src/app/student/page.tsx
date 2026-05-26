"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, GraduationCap, Gavel, FileText, ArrowRight } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useWalletClient } from 'wagmi';

export default function StudentDashboard() {
  const { data: walletClient } = useWalletClient();

  const mockCases = [
    {
      id: "C-001",
      title: "Constitutional Law: Freedom of Speech",
      description: "A journalist has been arrested for a controversial tweet. Defend their fundamental rights under Article 19(1)(a).",
      difficulty: "Intermediate",
      tag: "Constitutional Law"
    },
    {
      id: "C-002",
      title: "Corporate Law: Breach of Contract",
      description: "A tech startup failed to deliver software on time due to a server crash. Argue Force Majeure on behalf of the startup.",
      difficulty: "Advanced",
      tag: "Corporate Law"
    },
    {
      id: "C-003",
      title: "Criminal Law: Self Defense",
      description: "A shop owner used force to stop a robbery. Argue the limits of private defense under the Indian Penal Code.",
      difficulty: "Beginner",
      tag: "Criminal Law"
    }
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 flex flex-col">
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-neutral-950/80 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="hover:bg-white/10 rounded-full">
              <ChevronLeft className="w-5 h-5 text-neutral-400" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-indigo-400" />
            <span className="text-lg font-bold">Nyaya Student Hub</span>
          </div>
        </div>
        <ConnectButton />
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto p-8">
        {!walletClient ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <GraduationCap className="w-20 h-20 text-neutral-800 mb-6" />
            <h2 className="text-2xl font-bold mb-4">Connect Wallet to Practice</h2>
            <p className="text-neutral-400 max-w-md">Please connect your Web3 wallet to access the Moot Court Simulator and save your grades.</p>
          </div>
        ) : (
          <>
            <div className="mb-12">
              <h1 className="text-4xl font-bold mb-4">Welcome to Moot Court</h1>
              <p className="text-neutral-400 text-lg">Select a mock case below to enter the practice arena. Argue your case against an AI Judge and receive an instant score.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockCases.map((c) => (
                <div key={c.id} className="bg-neutral-900/50 border border-white/10 rounded-2xl p-6 flex flex-col hover:border-indigo-500/50 transition-colors group">
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-medium border border-indigo-500/20">
                      {c.tag}
                    </span>
                    <span className={`text-xs font-semibold ${c.difficulty === 'Beginner' ? 'text-green-400' : c.difficulty === 'Intermediate' ? 'text-yellow-400' : 'text-red-400'}`}>
                      {c.difficulty}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-indigo-300 transition-colors">{c.title}</h3>
                  <p className="text-sm text-neutral-400 mb-6 flex-1">{c.description}</p>
                  
                  <Link href={`/student/practice?case=${c.id}`}>
                    <Button className="w-full bg-white text-black hover:bg-neutral-200">
                      Start Simulation <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
