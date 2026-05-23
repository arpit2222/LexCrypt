"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, FileText, User, Calendar, MessageSquare } from "lucide-react";

export default function LawyerCaseView() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 flex flex-col">
      <header className="flex items-center px-6 py-4 border-b border-white/5 bg-neutral-950/80 sticky top-0 z-50">
        <Link href="/lawyer">
          <Button variant="ghost" size="icon" className="mr-4 hover:bg-white/10 rounded-full">
            <ChevronLeft className="w-5 h-5 text-neutral-400" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Case Review: C-1049</h1>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Facts & Docs */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-neutral-900/50 border border-white/5 rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><User className="w-5 h-5 text-indigo-400" /> Client Information</h2>
            <div className="grid grid-cols-2 gap-4 text-sm text-neutral-300">
              <div><span className="text-neutral-500">Name:</span> Rahul Verma</div>
              <div><span className="text-neutral-500">Phone:</span> +91 98xxxxxx21</div>
              <div><span className="text-neutral-500">Language:</span> Hindi</div>
              <div><span className="text-neutral-500">Location:</span> Mumbai, MH</div>
            </div>
          </div>
          
          <div className="bg-neutral-900/50 border border-white/5 rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><MessageSquare className="w-5 h-5 text-indigo-400" /> User Narrative</h2>
            <p className="text-neutral-300 text-sm leading-relaxed p-4 bg-white/5 rounded-xl border border-white/5">
              "My neighbor is trying to encroach on 10 feet of my land. I have the property papers from 1995, but he brought some local thugs to intimidate me. What are my rights?"
            </p>
          </div>

          <div className="bg-neutral-900/50 border border-white/5 rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><FileText className="w-5 h-5 text-indigo-400" /> Documents Attached</h2>
            <div className="p-4 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between hover:border-white/10 transition-colors cursor-pointer mb-2">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-medium">Property_Deed_1995.pdf</span>
              </div>
              <span className="text-xs text-neutral-500 bg-neutral-800 px-2 py-1 rounded">OCR Verified</span>
            </div>
          </div>
        </div>

        {/* Right Column: AI Brief */}
        <div className="space-y-6">
          <div className="bg-indigo-900/20 border border-indigo-500/20 rounded-2xl p-6 h-full shadow-[0_0_40px_rgba(79,70,229,0.1)]">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-indigo-100">
              <FileText className="w-5 h-5 text-indigo-400" /> AI Case Brief
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-indigo-300 mb-2">Legal Classification</h3>
                <p className="text-sm text-neutral-300">Civil Litigation - Property Dispute / Encroachment</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-indigo-300 mb-2">Relevant Statutes</h3>
                <ul className="text-sm text-neutral-300 list-disc pl-4 space-y-1">
                  <li>Specific Relief Act, 1963 (Sec 38)</li>
                  <li>Indian Penal Code (Sec 441, 503)</li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-medium text-indigo-300 mb-2">Suggested Next Steps</h3>
                <p className="text-sm text-neutral-300 mb-3">1. File an injunction suit immediately under Order 39 Rules 1 & 2 of CPC.</p>
                <p className="text-sm text-neutral-300">2. File an FIR for criminal intimidation.</p>
              </div>
              <div className="pt-4 mt-6 border-t border-indigo-500/20">
                <Button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white">Accept Case & Notify Client</Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
