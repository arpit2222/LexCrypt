"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, FileText, Send, Download, History } from "lucide-react";

export default function LawyerDrafts() {
  const [prompt, setPrompt] = useState("");
  const [draft, setDraft] = useState<string | null>(null);
  const [instructions, setInstructions] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleLoad = (e: any) => {
      setPrompt(e.detail.details);
      setDraft(e.detail.draft_content || e.detail.draft);
      setInstructions(e.detail.instructions || null);
    };
    window.addEventListener('load-history', handleLoad);
    return () => window.removeEventListener('load-history', handleLoad);
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
      setDraft(data.draft || data.draft_content);
      setInstructions(data.instructions || null);
      window.dispatchEvent(new Event('refresh-history'));
    } catch(err) {
      setDraft("Error generating draft. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    if (!draft) return;
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF();
      
      const margin = 15;
      const pageWidth = doc.internal.pageSize.getWidth();
      const maxLineWidth = pageWidth - margin * 2;
      
      doc.setFont("times", "normal");
      doc.setFontSize(12);
      
      const textLines = doc.splitTextToSize(draft, maxLineWidth);
      
      let cursorY = margin;
      const pageHeight = doc.internal.pageSize.getHeight();
      
      for (let i = 0; i < textLines.length; i++) {
        if (cursorY > pageHeight - margin) {
          doc.addPage();
          cursorY = margin;
        }
        doc.text(textLines[i], margin, cursorY);
        cursorY += 7; // line height
      }
      
      doc.save("Nyaya_Legal_Draft.pdf");
    } catch (e) {
      console.error("PDF generation error", e);
      alert("Failed to generate PDF. Falling back to text file.");
      const blob = new Blob([draft], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Nyaya_Legal_Draft.txt";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="flex flex-col h-full p-4 md:p-8">
      <header className="mb-8 pt-4 md:pt-0">
        <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2"><FileText className="w-6 h-6 text-indigo-400"/> AI Drafts & Documents</h1>
      </header>

      <main className="flex-1 w-full max-w-5xl mx-auto flex flex-col gap-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Side: Input */}
          <div className="flex flex-col space-y-4">
          <div className="bg-neutral-900/50 border border-white/10 rounded-2xl p-6 flex flex-col h-full">
            <h2 className="text-xl font-bold mb-2">Drafting Instructions</h2>
            <p className="text-sm text-neutral-400 mb-6">Describe the case details, parties involved, and the type of document you want the AI to draft (e.g. Legal Notice for Eviction).</p>
            
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Draft a legal notice on behalf of my client Mr. Sharma against his tenant Mr. Verma for non-payment of rent for 3 months..."
              className="w-full flex-1 bg-neutral-950 border border-white/10 rounded-xl p-4 text-sm md:text-base text-white focus:outline-none focus:border-indigo-500/50 resize-none min-h-[200px] md:min-h-[300px]"
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
        <div className="flex flex-col h-full min-h-[50vh] md:min-h-0">
          <div className="bg-white text-neutral-950 rounded-2xl flex flex-col h-full overflow-hidden shadow-2xl relative">
            <div className="bg-neutral-200 border-b border-neutral-300 p-4 flex justify-between items-center">
              <span className="font-semibold text-neutral-600">Preview</span>
              {draft && (
                <Button onClick={handleExport} variant="outline" size="sm" className="border-indigo-500/30 text-indigo-600">
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
                <div className="flex flex-col gap-6">
                  {instructions && (
                    <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-300 font-sans text-sm">
                      <p className="font-semibold mb-2">AI Instructions & Context:</p>
                      {instructions}
                    </div>
                  )}
                  <div className="text-black">
                    {draft}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-neutral-400 text-center italic">
                  Your generated draft will appear here.
                </div>
              )}
            </div>
          </div>
        </div>
        </div>
      </main>
    </div>
  );
}
