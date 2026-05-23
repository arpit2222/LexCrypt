"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, FileText, Loader2, Download } from "lucide-react";

export default function Drafting() {
  const [docType, setDocType] = useState("Legal Notice");
  const [details, setDetails] = useState("");
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!details.trim()) return;
    setLoading(true);
    setDraft("");
    
    try {
      const res = await fetch("http://localhost:8000/api/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ document_type: docType, details })
      });
      const data = await res.json();
      setDraft(data.draft_content);
    } catch (err) {
      setDraft("Error connecting to backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 flex flex-col">
      <header className="flex items-center px-6 py-4 border-b border-white/5 bg-neutral-950/80 sticky top-0 z-50">
        <Link href="/citizen">
          <Button variant="ghost" size="icon" className="mr-4 hover:bg-white/10 rounded-full">
            <ChevronLeft className="w-5 h-5 text-neutral-400" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Smart Legal Drafting</h1>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-2">Document Type</label>
            <select 
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              className="w-full bg-neutral-900 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500/50"
            >
              <option>Legal Notice</option>
              <option>RTI Application</option>
              <option>Consumer Complaint</option>
              <option>Employment Agreement</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-2">Key Facts / Details</label>
            <textarea 
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="E.g., I bought a defected washing machine from XYZ Corp on 12 Oct 2024..."
              className="w-full h-48 bg-neutral-900 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-indigo-500/50 resize-none"
            />
          </div>
          <Button 
            onClick={handleGenerate} 
            disabled={loading || !details}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-6 text-lg rounded-xl shadow-lg"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <FileText className="w-5 h-5 mr-2" />}
            Generate Draft
          </Button>
        </div>

        {/* Output Section */}
        <div className="bg-neutral-900/50 border border-white/5 rounded-2xl p-6 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-lg">AI Generated Draft</h2>
            {draft && (
              <Button variant="outline" size="sm" className="border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/10">
                <Download className="w-4 h-4 mr-2" /> Export PDF
              </Button>
            )}
          </div>
          <div className="flex-1 bg-white/5 border border-white/5 rounded-xl p-4 whitespace-pre-wrap overflow-y-auto text-sm text-neutral-300 font-mono">
            {draft || (loading ? "Generating your legal document..." : "Your draft will appear here.")}
          </div>
        </div>
      </main>
    </div>
  );
}
