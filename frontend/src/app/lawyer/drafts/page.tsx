"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, FileText, Send, Download, History } from "lucide-react";

export default function LawyerDrafts() {
  const [prompt, setPrompt] = useState("");
  const [draft, setDraft] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<any[]>([]);

  const fetchHistory = async () => {
    const email = localStorage.getItem("nyaya_email") || "admin@nyaya.ai";
    try {
      const res = await fetch(`/api/draft/history?email=${email}`);
      if(res.ok) {
        setHistory(await res.json());
      }
    } catch(err) {}
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleGenerateDraft = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    
    try {
      const email = localStorage.getItem("nyaya_email") || "admin@nyaya.ai";
      const res = await fetch("/api/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          details: prompt,
          document_type: "Legal Notice / Pleading",
          email
        })
      });
      const data = await res.json();
      setDraft(data.draft_content);
      fetchHistory();
    } catch(err) {
      setDraft("Error generating draft. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full p-4 md:p-8">
      <header className="mb-8 pt-4 md:pt-0">
        <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2"><FileText className="w-6 h-6 text-indigo-400"/> AI Drafts & Documents</h1>
      </header>

      <main className="flex-1 w-full mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
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
        </div>

        {/* Right Side: History Panel */}
        <div className="bg-neutral-900/50 border border-white/5 rounded-2xl p-6 flex flex-col h-[600px] overflow-hidden">
          <h3 className="font-semibold text-lg flex items-center gap-2 mb-6 text-white">
            <History className="w-5 h-5 text-indigo-400" /> Draft History
          </h3>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {history.length === 0 ? (
              <p className="text-neutral-500 text-sm italic">No past drafts found.</p>
            ) : (
              history.map((item, idx) => (
                <div key={idx} className="p-4 bg-black/40 rounded-xl border border-white/5 hover:border-white/10 cursor-pointer transition-colors" onClick={() => {
                  setPrompt(item.details);
                  setDraft(item.draft_content);
                }}>
                  <p className="text-[10px] text-neutral-500 mb-1 uppercase tracking-widest">{new Date(item.timestamp).toLocaleDateString()}</p>
                  <p className="text-sm font-medium text-indigo-100 mb-2">{item.document_type}</p>
                  <p className="text-xs text-neutral-400 line-clamp-2">{item.details}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
