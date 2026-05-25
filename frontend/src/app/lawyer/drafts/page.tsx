"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, FileText, Send, Download } from "lucide-react";

export default function LawyerDrafts() {
  const [prompt, setPrompt] = useState("");
  const [draft, setDraft] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerateDraft = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    
    try {
      const res = await fetch("/api/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          details: prompt,
          document_type: "Legal Notice / Pleading"
        })
      });
      const data = await res.json();
      setDraft(data.draft);
    } catch(err) {
      setDraft("Error generating draft. Please try again.");
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
        <h1 className="text-xl font-bold flex items-center gap-2"><FileText className="w-6 h-6 text-indigo-400"/> AI Drafts & Documents</h1>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side: Input */}
        <div className="flex flex-col space-y-4">
          <div className="bg-neutral-900/50 border border-white/10 rounded-2xl p-6 flex flex-col h-full">
            <h2 className="text-xl font-bold mb-2">Drafting Instructions</h2>
            <p className="text-sm text-neutral-400 mb-6">Describe the case details, parties involved, and the type of document you want the AI to draft (e.g. Legal Notice for Eviction).</p>
            
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Draft a legal notice on behalf of my client Mr. Sharma against his tenant Mr. Verma for non-payment of rent for 3 months..."
              className="w-full flex-1 bg-neutral-950 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-indigo-500/50 resize-none min-h-[300px]"
            />
            
            <Button 
              onClick={handleGenerateDraft}
              disabled={loading || !prompt}
              className="w-full mt-6 bg-indigo-600 hover:bg-indigo-500 py-6 text-lg rounded-xl flex items-center justify-center gap-2"
            >
              {loading ? "Generating Draft..." : "Generate Legal Draft"} <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Right Side: Output */}
        <div className="flex flex-col h-full">
          <div className="bg-white text-neutral-950 rounded-2xl flex flex-col h-full overflow-hidden shadow-2xl relative">
            <div className="bg-neutral-200 border-b border-neutral-300 p-4 flex justify-between items-center">
              <span className="font-semibold text-neutral-600">Preview</span>
              {draft && (
                <Button variant="outline" size="sm" className="border-indigo-500/30 text-indigo-600">
                  <Download className="w-4 h-4 mr-2"/> Export PDF
                </Button>
              )}
            </div>
            
            <div className="p-8 overflow-y-auto flex-1 whitespace-pre-wrap font-serif text-sm md:text-base leading-relaxed">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full text-neutral-400 space-y-4">
                  <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                  <p>AI is drafting the document...</p>
                </div>
              ) : draft ? (
                draft
              ) : (
                <div className="flex items-center justify-center h-full text-neutral-400 text-center italic">
                  Your generated draft will appear here.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
