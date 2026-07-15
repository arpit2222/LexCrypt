"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Briefcase, CheckCircle2, Clock, MessageSquare, Video } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { ChatBox } from "@/components/ChatBox";

export default function CitizenCases() {
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [chatCaseId, setChatCaseId] = useState<string | null>(null);
  
  useEffect(() => {
    const email = localStorage.getItem("nyaya_email") || "citizen@nyaya.ai";
    fetch(`/api/cases/citizen?citizen_wallet=${email}`)
      .then(res => res.json())
      .then(data => {
        setCases(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 flex flex-col">
      <header className="flex items-center px-6 py-4 border-b border-white/5 bg-neutral-950/80 sticky top-0 z-50">
        <Link href="/citizen">
          <Button variant="ghost" size="icon" className="mr-4 hover:bg-white/10 rounded-full">
            <ChevronLeft className="w-5 h-5 text-neutral-400" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold flex items-center gap-2"><Briefcase className="w-5 h-5 text-teal-400"/> My Cases</h1>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-8">
        {loading ? (
          <p className="text-neutral-400 text-center mt-10">Loading your cases...</p>
        ) : cases.length === 0 ? (
          <p className="text-neutral-400 text-center mt-10">You have no active cases with any lawyers.</p>
        ) : (
          <div className="space-y-6">
            {cases.map((c) => (
              <div key={c._id} className="bg-neutral-900/50 border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3 mb-2">
                    {c.status === "PENDING" ? (
                      <span className="px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-400 text-xs font-medium border border-yellow-500/20 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> PENDING LAWYER REVIEW
                      </span>
                    ) : c.status === "ACCEPTED" ? (
                      <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-medium border border-green-500/20 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> LAWYER ACCEPTED
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-xs font-medium border border-red-500/20 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> {c.status}
                      </span>
                    )}
                    <span className="text-xs text-neutral-500">{new Date(c.timestamp).toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-neutral-400"><span className="text-neutral-300 font-semibold">Lawyer ID:</span> {c.lawyer_id}</p>
                  
                  <div className="bg-black/30 p-4 rounded-xl border border-white/5 text-sm text-neutral-300 mt-2">
                    <p className="font-semibold text-teal-300 mb-2">Your Query:</p>
                    <div className="text-sm text-neutral-300 leading-relaxed max-h-[200px] overflow-y-auto pr-2">
                      <ReactMarkdown>{c.query_details || c.query}</ReactMarkdown>
                    </div>
                  </div>
                </div>
                
                {c.status === "ACCEPTED" && (
                  <div className="flex flex-col gap-3 w-full md:w-auto md:min-w-[140px]">
                    <Button 
                      onClick={() => setChatCaseId(c._id)}
                      className="bg-teal-600 hover:bg-teal-500 text-white w-full flex items-center justify-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4" /> Message Lawyer
                    </Button>
                    <Button variant="outline" className="border-teal-500/30 text-teal-400 w-full flex justify-center gap-2">
                      <Video className="w-4 h-4" /> Join Video Call
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
          currentUserRole="citizen" 
          onClose={() => setChatCaseId(null)} 
        />
      )}
    </div>
  );
}
