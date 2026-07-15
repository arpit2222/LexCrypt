"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, GraduationCap, Users, TrendingUp, BookOpen } from "lucide-react";

export default function FacultyDashboard() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 flex flex-col">
      <header className="flex items-center px-6 py-4 border-b border-white/5 bg-neutral-950/80 sticky top-0 z-50">
        <Link href="/">
          <Button variant="ghost" size="icon" className="mr-4 hover:bg-white/10 rounded-full">
            <ChevronLeft className="w-5 h-5 text-neutral-400" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold flex items-center gap-2"><GraduationCap className="w-6 h-6 text-emerald-400"/> Vakil Guru: Faculty Portal</h1>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            { label: "Active Cohort", value: "LLB Batch 2026", icon: <Users className="w-6 h-6 text-blue-400" /> },
            { label: "Avg. Class Score", value: "78.4/100", icon: <TrendingUp className="w-6 h-6 text-emerald-400" /> },
            { label: "Active Modules", value: "4 Assigned", icon: <BookOpen className="w-6 h-6 text-purple-400" /> }
          ].map((stat, i) => (
            <div key={i} className="bg-neutral-900/50 border border-white/5 rounded-2xl p-6 flex items-center gap-4">
              <div className="p-3 bg-white/5 rounded-xl">{stat.icon}</div>
              <div>
                <p className="text-xl font-bold">{stat.value}</p>
                <p className="text-sm text-neutral-400">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-neutral-900/50 border border-white/5 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Student AI Evaluation Analytics</h2>
            <Button variant="outline" className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10">Assign New Case</Button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-neutral-400 bg-white/5">
                <tr>
                  <th className="px-6 py-4 rounded-tl-xl font-medium">Student Name</th>
                  <th className="px-6 py-4 font-medium">Module</th>
                  <th className="px-6 py-4 font-medium">AI Score</th>
                  <th className="px-6 py-4 font-medium">Core Mistake Identified</th>
                  <th className="px-6 py-4 rounded-tr-xl font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[
                  { name: "Anil Kapoor", mod: "Sec 138 NI Act", score: 85, error: "Missed limitation period exception" },
                  { name: "Simran Desai", mod: "Sec 138 NI Act", score: 92, error: "None" },
                  { name: "Vijay Singh", mod: "Sec 138 NI Act", score: 64, error: "Incorrect application of precedent" },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-white/5">
                    <td className="px-6 py-4 font-medium text-white">{row.name}</td>
                    <td className="px-6 py-4 text-neutral-300">{row.mod}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-md font-bold ${row.score >= 80 ? 'text-emerald-400 bg-emerald-400/10' : 'text-yellow-400 bg-yellow-400/10'}`}>
                        {row.score}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-neutral-400">{row.error}</td>
                    <td className="px-6 py-4">
                      <Button variant="link" className="text-teal-400 px-0">Review Submission</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
