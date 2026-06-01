"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Send, Scale, User, CheckCircle, RefreshCcw } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

function PracticeArenaContent() {
  const searchParams = useSearchParams();
  const caseId = searchParams.get("case") || "C-001";
  
  const [messages, setMessages] = useState([
    {
      role: "ai",
      content: `Welcome Counselor. I am the presiding judge for Case ${caseId}. Please state your appearance and present your opening arguments.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Grading Modal State
  const [scoreData, setScoreData] = useState<any>(null);
  const [isGrading, setIsGrading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading || isGrading) return;
    const userMessage = input;
    
    const newHistory = [...messages, { role: "user", content: userMessage }];
    setMessages(newHistory);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/simulation/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history: newHistory }),
      });
      const data = await response.json();
      
      setMessages([...newHistory, { role: "ai", content: data.reply }]);
    } catch (error) {
      setMessages([...newHistory, { role: "ai", content: "Error connecting to the Court simulator." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitForGrading = async () => {
    setIsGrading(true);
    // Combine the student's arguments into one string for the backend to score
    const studentArguments = messages
      .filter(m => m.role === "user")
      .map(m => m.content)
      .join("\n\n");

    try {
      const response = await fetch("/api/simulation/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ case_id: caseId, student_argument: studentArguments }),
      });
      const data = await response.json();
      setScoreData(data);
    } catch (error) {
      alert("Failed to grade the simulation.");
    } finally {
      setIsGrading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-neutral-950/80 sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <Link href="/student">
            <Button variant="ghost" size="icon" className="hover:bg-white/10 rounded-full">
              <ChevronLeft className="w-5 h-5 text-neutral-400" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Scale className="w-6 h-6 text-indigo-400" />
            <span className="text-lg font-bold">Moot Court Arena</span>
            <span className="ml-2 px-2 py-0.5 rounded-full bg-white/10 text-xs text-neutral-400">Case {caseId}</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            onClick={handleSubmitForGrading}
            disabled={messages.length < 3 || isGrading || !!scoreData}
            className="bg-indigo-600 hover:bg-indigo-500 text-white"
          >
            {isGrading ? "Grading..." : "Submit for Grading"}
          </Button>
          <ConnectButton />
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 flex flex-col gap-6 overflow-y-auto pt-8 pb-32">
        {messages.map((msg, index) => (
          <div key={index} className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
              msg.role === "ai" ? "bg-indigo-900/50 border border-indigo-500/30" : "bg-neutral-800"
            }`}>
              {msg.role === "ai" ? <Scale className="w-5 h-5 text-indigo-400" /> : <User className="w-5 h-5 text-neutral-300" />}
            </div>
            
            <div className={`max-w-[80%] rounded-2xl p-4 whitespace-pre-wrap shadow-lg ${
              msg.role === "user" 
                ? "bg-indigo-600 text-white rounded-tr-none" 
                : "bg-neutral-900 border border-white/5 rounded-tl-none text-neutral-200"
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-indigo-900/50 border border-indigo-500/30">
              <Scale className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="bg-neutral-900 border border-white/5 rounded-2xl rounded-tl-none p-4 text-neutral-400 flex items-center gap-2">
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
      </main>

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-neutral-950 via-neutral-950 to-transparent z-30">
        <div className="max-w-4xl mx-auto relative flex items-center">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={loading || !!scoreData}
            placeholder={scoreData ? "Simulation Complete" : "Present your argument..."}
            className="w-full bg-neutral-900/90 backdrop-blur-md border border-white/10 rounded-full py-4 pl-6 pr-16 text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all text-white placeholder-neutral-500 shadow-xl disabled:opacity-50"
          />
          <Button 
            onClick={handleSend}
            disabled={loading || !input.trim() || !!scoreData}
            className="absolute right-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full h-10 w-10 p-0 shadow-lg disabled:opacity-50"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </Button>
        </div>
      </div>

      {/* Score Modal Overlay */}
      {scoreData && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-white/10 rounded-3xl max-w-lg w-full p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
            
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 rounded-full bg-indigo-500/10 border-4 border-indigo-500/30 flex items-center justify-center flex-col">
                <span className="text-3xl font-black text-indigo-400">{scoreData.score || "85"}</span>
                <span className="text-xs text-indigo-300 font-medium">/100</span>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-center mb-6">Simulation Graded</h2>
            
            <div className="space-y-4 mb-8">
              <div className="bg-white/5 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-neutral-300 mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400"/> Strengths
                </h3>
                <p className="text-sm text-neutral-400">{scoreData.feedback || "Good structure and clear argumentation."}</p>
              </div>
              
              <div className="bg-white/5 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-neutral-300 mb-2 flex items-center gap-2">
                  <RefreshCcw className="w-4 h-4 text-yellow-400"/> Areas for Improvement
                </h3>
                <p className="text-sm text-neutral-400">{scoreData.improvement || "Consider citing more recent Supreme Court precedents."}</p>
              </div>
            </div>
            
            <Link href="/student">
              <Button className="w-full bg-white text-black hover:bg-neutral-200 py-6 text-lg rounded-xl">
                Return to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PracticeArena() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white">Loading Arena...</div>}>
      <PracticeArenaContent />
    </Suspense>
  );
}
