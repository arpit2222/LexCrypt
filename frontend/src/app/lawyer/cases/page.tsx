"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Briefcase, CheckCircle2, XCircle, Clock, MessageSquare } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { ChatBox } from "@/components/ChatBox";

export default function LawyerCases() {
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "ACCEPTED">("ALL");
  const [chatCaseId, setChatCaseId] = useState<string | null>(null);
  
  // Hardcoded to simulate lawyer "1" login for the MVP
  const lawyerId = "1";

  const fetchCases = async () => {
    try {
      const res = await fetch(`/api/cases/lawyer?lawyer_id=${lawyerId}`);
      const data = await res.json();
      setCases(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const handleAction = async (caseId: string, action: "ACCEPT" | "REJECT") => {
    try {
      const res = await fetch("/api/cases/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ case_id: caseId, action })
      });
      const data = await res.json();
      alert(data.message);
      
      // Refresh cases list
      fetchCases();
    } catch (err) {
      alert("Failed to perform action");
    }
  };

  return (
    <div className="flex flex-col h-full p-4 md:p-8">
      <header className="mb-8 pt-4 md:pt-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2"><Briefcase className="w-6 h-6 text-teal-400"/> Active & Pending Cases</h1>
        <div className="flex bg-neutral-900 border border-white/10 rounded-lg p-1 self-start md:self-auto">
          <button 
            onClick={() => setFilter("ALL")}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${filter === "ALL" ? "bg-teal-600 text-white shadow" : "text-neutral-400 hover:text-white hover:bg-white/5"}`}
          >
            All Cases
          </button>
          <button 
            onClick={() => setFilter("PENDING")}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${filter === "PENDING" ? "bg-teal-600 text-white shadow" : "text-neutral-400 hover:text-white hover:bg-white/5"}`}
          >
            Pending
          </button>
          <button 
            onClick={() => setFilter("ACCEPTED")}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${filter === "ACCEPTED" ? "bg-teal-600 text-white shadow" : "text-neutral-400 hover:text-white hover:bg-white/5"}`}
          >
            Accepted
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto">
        {loading ? (
          <p className="text-neutral-400 text-center mt-10">Loading cases...</p>
        ) : cases.length === 0 ? (
          <p className="text-neutral-400 text-center mt-10">No cases assigned to you at the moment.</p>
        ) : cases.filter(c => filter === "ALL" ? true : c.status === filter).length === 0 ? (
          <p className="text-neutral-400 text-center mt-10">No {filter.toLowerCase()} cases found.</p>
        ) : (
          <div className="space-y-6">
            {cases.filter(c => filter === "ALL" ? true : c.status === filter).map((c) => (
              <div key={c._id} className="bg-neutral-900/50 border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3 mb-2">
                    {c.status === "PENDING" ? (
                      <span className="px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-400 text-xs font-medium border border-yellow-500/20 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> PENDING REVIEW
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-medium border border-green-500/20 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> ACCEPTED
                      </span>
                    )}
                    <span className="text-xs text-neutral-500">{new Date(c.timestamp).toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-neutral-400"><span className="text-neutral-300 font-semibold">Client Wallet/Email:</span> {c.citizen}</p>
                  <div className="bg-black/30 p-4 rounded-xl border border-white/5 text-sm text-neutral-300">
                    <p className="font-semibold text-teal-300 mb-2">Case Summary (AI Generated):</p>
                    <div className="text-sm text-neutral-300 leading-relaxed">
                      <ReactMarkdown
                        components={{
                          h1: ({node, ...props}) => <h1 className="text-lg font-bold text-white mt-4 mb-2" {...props} />,
                          h2: ({node, ...props}) => <h2 className="text-base font-bold text-white mt-3 mb-2" {...props} />,
                          h3: ({node, ...props}) => <h3 className="text-sm font-bold text-white mt-2 mb-1" {...props} />,
                          p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                          ul: ({node, ...props}) => <ul className="list-disc pl-5 space-y-1 mb-2" {...props} />,
                          ol: ({node, ...props}) => <ol className="list-decimal pl-5 space-y-1 mb-2" {...props} />,
                          strong: ({node, ...props}) => <strong className="font-semibold text-white" {...props} />
                        }}
                      >
                        {c.query}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
                
                {c.status === "PENDING" && (
                  <div className="flex flex-col gap-3 w-full md:w-auto md:min-w-[140px]">
                    <Button 
                      onClick={() => handleAction(c._id, "ACCEPT")}
                      className="bg-green-600 hover:bg-green-500 w-full flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Accept Case
                    </Button>
                    <Button 
                      onClick={() => handleAction(c._id, "REJECT")}
                      variant="outline" 
                      className="border-red-500/30 text-red-400 hover:bg-red-500/10 w-full flex items-center gap-2"
                    >
                      <XCircle className="w-4 h-4" /> Reject & Reassign
                    </Button>
                  </div>
                )}
                
                {c.status === "ACCEPTED" && (
                  <div className="flex flex-col gap-3 min-w-[140px]">
                    <Button 
                      onClick={() => setChatCaseId(c._id)}
                      className="bg-teal-600 hover:bg-teal-500 text-white w-full flex items-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4" /> Chat with Client
                    </Button>
                    <Button variant="outline" className="border-teal-500/30 text-teal-400 w-full">
                      Start Video Call
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
      
      {chatCaseId && (
        <ChatBox 
          caseId={chatCaseId} 
          currentUserRole="lawyer" 
          onClose={() => setChatCaseId(null)} 
        />
      )}
    </div>
  );
}
