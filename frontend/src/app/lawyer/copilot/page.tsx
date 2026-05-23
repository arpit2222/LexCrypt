"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Bot, Send, BookOpen } from "lucide-react";

export default function LawyerCopilot() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleResearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    
    try {
      const res = await fetch("http://localhost:8000/api/copilot/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query })
      });
      const data = await res.json();
      setResponse(data);
    } catch(err) {
      setResponse({ summary: "Error connecting to backend.", citations: [] });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 flex flex-col">
      <header className="flex items-center px-6 py-4 border-b border-white/5 bg-neutral-950/80 sticky top-0 z-50">
        <Link href="/lawyer">
          <Button variant="ghost" size="icon" className="mr-4 hover:bg-white/10 rounded-full">
            <ChevronLeft className="w-5 h-5 text-neutral-400" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold flex items-center gap-2"><Bot className="w-6 h-6 text-indigo-400"/> AI Legal Copilot</h1>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto p-8 flex flex-col">
        <div className="bg-gradient-to-br from-indigo-900/20 to-transparent border border-indigo-500/20 rounded-2xl p-8 mb-8 text-center">
          <h2 className="text-2xl font-bold mb-4">What do you need to research?</h2>
          <div className="relative max-w-2xl mx-auto">
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleResearch()}
              placeholder="e.g. Latest Supreme Court ruling on Section 138 NI Act..."
              className="w-full bg-neutral-900 border border-white/10 rounded-full py-4 pl-6 pr-16 text-white focus:outline-none focus:border-indigo-500/50 shadow-xl"
            />
            <Button 
              onClick={handleResearch}
              disabled={loading || !query}
              className="absolute right-2 top-2 rounded-full h-10 w-10 p-0 bg-indigo-600 hover:bg-indigo-500"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </Button>
          </div>
        </div>

        {loading && <div className="text-center text-indigo-400 my-10 animate-pulse">Running semantic search across Indian Kanoon...</div>}

        {response && !loading && (
          <div className="space-y-6">
            <div className="bg-neutral-900/50 border border-white/5 rounded-2xl p-6">
              <h3 className="font-semibold text-lg flex items-center gap-2 mb-4"><BookOpen className="w-5 h-5 text-indigo-400" /> AI Summary</h3>
              <p className="text-neutral-300 leading-relaxed">{response.summary}</p>
            </div>
            
            <div className="bg-neutral-900/50 border border-white/5 rounded-2xl p-6">
              <h3 className="font-semibold text-lg mb-4">Cited Precedents</h3>
              <ul className="space-y-3">
                {response.citations.map((cit: string, i: number) => (
                  <li key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl text-sm font-medium text-neutral-300 border border-white/5">
                    <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-xs">{i+1}</span>
                    {cit}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
