"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, GraduationCap, Gavel, CheckCircle, Send, User } from "lucide-react";

export default function StudentSimulation() {
  const [messages, setMessages] = useState<{role: string, content: string}[]>([
    {
      role: "ai",
      content: "[JUDGE]: Welcome to the simulation. You are the Defense. The Prosecution will respond to your arguments. You may begin your defense."
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = input;
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    setLoading(true);
    
    // Show typing state
    setMessages(prev => [
      ...prev, 
      { role: "ai", content: "..." }
    ]);

    try {
      const historyForApi = messages.map(m => ({ role: m.role === "ai" ? "assistant" : "user", content: m.content }));
      historyForApi.push({ role: "user", content: userMessage });

      const response = await fetch("/api/simulation/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history: historyForApi }),
      });
      const data = await response.json();
      
      setMessages(prev => [
        ...prev.slice(0, -1), // remove typing state
        { role: "ai", content: data.reply }
      ]);
    } catch (error) {
      setMessages(prev => [
        ...prev.slice(0, -1),
        { role: "ai", content: "Error connecting to AI Evaluator." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 flex flex-col">
      <header className="flex items-center px-6 py-4 border-b border-white/5 bg-neutral-950/80 sticky top-0 z-50">
        <Link href="/">
          <Button variant="ghost" size="icon" className="mr-4 hover:bg-white/10 rounded-full">
            <ChevronLeft className="w-5 h-5 text-neutral-400" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold flex items-center gap-2"><GraduationCap className="w-6 h-6 text-emerald-400"/> Vakil Guru: Case Simulation</h1>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 bg-neutral-900/50 border border-white/5 rounded-2xl p-6 h-fit">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-lg font-semibold flex items-center gap-2"><Gavel className="w-5 h-5 text-emerald-400"/> Module 4</h2>
          </div>
          
          <div className="prose prose-invert prose-sm">
            <p><strong>Facts of the Case:</strong></p>
            <p>Mr. A issued a post-dated cheque of ₹1,00,000 to Mr. B. On the date of presentation, the cheque bounced due to 'Insufficient Funds'. Mr. B sent a legal notice 45 days after receiving the return memo from the bank.</p>
            <p><strong>Your Task:</strong></p>
            <p>Act as the Defense. Argue why the complaint filed by Mr. B under Section 138 NI Act is NOT maintainable.</p>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6 flex flex-col bg-neutral-900/30 border border-white/5 rounded-2xl overflow-hidden h-[70vh]">
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  msg.role === "ai" ? "bg-emerald-900/50 border border-emerald-500/30" : "bg-neutral-800"
                }`}>
                  {msg.role === "ai" ? <Gavel className="w-4 h-4 text-emerald-400" /> : <User className="w-4 h-4 text-neutral-300" />}
                </div>
                
                {msg.role === "user" ? (
                  <div className="max-w-[85%] rounded-2xl p-4 whitespace-pre-wrap bg-emerald-600 text-white rounded-tr-none shadow-[0_4px_20px_rgba(16,185,129,0.2)]">
                    {msg.content}
                  </div>
                ) : (
                  <div className="flex flex-col items-start max-w-[85%]">
                    <div className="rounded-2xl p-4 whitespace-pre-wrap bg-neutral-900 border border-white/5 rounded-tl-none text-neutral-200">
                      {msg.content}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-white/5 bg-neutral-900/50">
            <div className="relative flex items-center">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="State your argument to the court..." 
                className="w-full bg-neutral-800/80 border border-white/10 rounded-full py-3 pl-6 pr-14 text-sm focus:outline-none focus:border-emerald-500/50 text-white"
                disabled={loading}
              />
              <Button 
                onClick={handleSend}
                disabled={loading}
                className="absolute right-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full h-10 w-10 p-0"
              >
                <Send className="w-4 h-4 ml-0.5" />
              </Button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
