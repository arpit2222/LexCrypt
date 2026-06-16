"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Scale, Send, Mic, Paperclip, Bot, User, ChevronLeft, Bookmark, History, Volume2, Briefcase, Copy } from "lucide-react";
import ReactMarkdown from 'react-markdown';

export default function CitizenDashboard() {
  const [messages, setMessages] = useState([
    {
      role: "ai",
      content: "Namaste! I am Nyaya AI. Please describe your legal issue in plain language. You can type in English, Hindi, Marathi, or Gujarati.",
    },
  ]);
  const [input, setInput] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [historyList, setHistoryList] = useState<any[]>([]);
  const [isListening, setIsListening] = useState(false);

  const handleMicClick = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert("Speech Recognition is not supported in this browser.");
        return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN'; 
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => prev + " " + transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  const handleSpeak = (text: string) => {
    if (!('speechSynthesis' in window)) {
        alert("Text-to-Speech is not supported in this browser.");
        return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-IN';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const fetchHistory = async () => {
    const userIdentifier = localStorage.getItem("nyaya_email") || "citizen@nyaya.ai";
    try {
      const res = await fetch(`/api/chat/history?email=${userIdentifier}`);
      const data = await res.json();
      setHistoryList(data);
      setShowHistory(true);
    } catch (err) {
      alert("Error fetching history");
    }
  };

  const handleSave = async (index: number) => {
    const ai_response = messages[index].content;
    const query = messages[index-1]?.content || "Document Upload / General Chat";
    const userIdentifier = localStorage.getItem("nyaya_email") || "citizen@nyaya.ai";
    
    try {
      const res = await fetch("/api/chat/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_email: userIdentifier, query, ai_response })
      });
      if(res.ok) alert("Saved to history!");
    } catch(err) {
      alert("Failed to save");
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = input;
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    
    // Show typing state
    setMessages(prev => [
      ...prev, 
      { role: "ai", content: "I am analyzing your issue against Indian legal precedents. Please give me a moment..." }
    ]);

    try {
      const userIdentifier = localStorage.getItem("nyaya_email") || "citizen@nyaya.ai";
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, user_id: userIdentifier }),
      });
      
      const data = await response.json();
      
      if (!response.ok && response.status === 429) {
          setMessages(prev => [
            ...prev.slice(0, -1),
            { role: "ai", content: "🚨 **Weekly Limit Reached** 🚨\n\nYou have reached your limit of 1 case per week on the free tier. Please wait 7 days to initiate a new case, or upgrade to Nyaya Premium." }
          ]);
          return;
      }
      
      setMessages(prev => [
        ...prev.slice(0, -1), // remove typing state
        { role: "ai", content: data.reply }
      ]);
    } catch (error) {
      setMessages(prev => [
        ...prev.slice(0, -1),
        { role: "ai", content: "Error connecting to Nyaya AI backend. Please ensure the FastAPI server is running." }
      ]);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMessages(prev => [
      ...prev,
      { role: "user", content: `📎 Uploaded Document: ${file.name}` },
      { role: "ai", content: "Analyzing document... Please wait." }
    ]);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      
      setMessages(prev => [
        ...prev.slice(0, -1),
        { role: "ai", content: `Document Analyzed:\n- Type: ${data.document_type}\n- Summary: ${data.summary}` }
      ]);
    } catch (error) {
      setMessages(prev => [
        ...prev.slice(0, -1),
        { role: "ai", content: "Error uploading document." }
      ]);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-neutral-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="hover:bg-white/10 rounded-full">
              <ChevronLeft className="w-5 h-5 text-neutral-400" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Scale className="w-6 h-6 text-indigo-400" />
            <span className="text-lg font-bold">Nyaya Citizen</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button onClick={fetchHistory} variant="outline" className="border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/10 hidden md:flex">
            <History className="w-4 h-4 mr-2" /> Query History
          </Button>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 flex flex-col gap-6 overflow-y-auto pt-8">
        {messages.map((msg, index) => (
          <div key={index} className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
              msg.role === "ai" ? "bg-indigo-900/50 border border-indigo-500/30" : "bg-neutral-800"
            }`}>
              {msg.role === "ai" ? <Bot className="w-5 h-5 text-indigo-400" /> : <User className="w-5 h-5 text-neutral-300" />}
            </div>
            
            {msg.role === "user" ? (
              <div className="max-w-[80%] rounded-2xl p-4 whitespace-pre-wrap bg-indigo-600 text-white rounded-tr-none shadow-[0_4px_20px_rgba(79,70,229,0.2)]">
                {msg.content}
              </div>
            ) : (
              <div className="flex flex-col items-start max-w-[80%]">
                <div className="rounded-2xl p-4 bg-neutral-900 border border-white/5 rounded-tl-none text-neutral-200 text-sm md:text-base">
                  <ReactMarkdown
                    components={{
                      p: ({node, ...props}) => <p className="mb-3 leading-relaxed" {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc ml-5 mb-3 space-y-1" {...props} />,
                      ol: ({node, ...props}) => <ol className="list-decimal ml-5 mb-3 space-y-1" {...props} />,
                      li: ({node, ...props}) => <li className="pl-1" {...props} />,
                      strong: ({node, ...props}) => <strong className="text-white font-semibold" {...props} />
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>
                {msg.content !== "Analyzing document... Please wait." && !msg.content.includes("give me a moment") && (
                  <div className="flex gap-2 mt-1">
                    <Button variant="ghost" size="sm" onClick={() => handleSave(index)} className="text-neutral-500 h-6 hover:text-indigo-400 px-2">
                      <Bookmark className="w-3 h-3 mr-1" /> Save
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleSpeak(msg.content)} className="text-neutral-500 h-6 hover:text-indigo-400 px-2">
                      <Volume2 className="w-3 h-3 mr-1" /> Listen
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => { navigator.clipboard.writeText(msg.content); alert("Copied to clipboard!"); }} className="text-neutral-500 h-6 hover:text-indigo-400 px-2">
                      <Copy className="w-3 h-3 mr-1" /> Copy
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </main>

      {/* History Sidebar Modal Overlay */}
      {showHistory && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex justify-end">
          <div className="w-full max-w-md bg-neutral-900 h-full border-l border-white/10 p-6 overflow-y-auto flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2"><History className="w-5 h-5 text-indigo-400" /> Saved Queries</h2>
              <Button variant="ghost" onClick={() => setShowHistory(false)}>Close</Button>
            </div>
            <div className="space-y-4 flex-1">
              {historyList.length === 0 ? (
                <p className="text-neutral-500 text-center mt-10">No saved queries yet.</p>
              ) : (
                historyList.map((item, idx) => (
                  <div key={idx} className="bg-neutral-800/50 p-4 rounded-xl border border-white/5 flex flex-col gap-3">
                    <p className="text-xs text-neutral-500">{new Date(item.timestamp).toLocaleString()}</p>
                    <p className="text-sm text-indigo-300 font-medium border-b border-white/5 pb-2">Q: {item.query}</p>
                    <p className="text-sm text-neutral-300 line-clamp-3">A: {item.ai_response}</p>
                    <Button 
                      onClick={async () => {
                        const citizen = localStorage.getItem("nyaya_email") || "citizen@nyaya.ai";
                        try {
                          const res = await fetch("/api/cases/hire", {
                            method: "POST",
                            headers: {"Content-Type": "application/json"},
                            body: JSON.stringify({ citizen_wallet: citizen, lawyer_id: "1", query_details: item.query })
                          });
                          if(res.ok) alert("Case successfully sent to Advocate! They will review it shortly.");
                        } catch(e: any) {
                          alert("Failed to assign case: " + e.message);
                        }
                      }}
                      className="w-full mt-2 bg-indigo-600 hover:bg-indigo-500" size="sm"
                    >
                      <Briefcase className="w-3 h-3 mr-2" /> Assign to Advocate
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 bg-gradient-to-t from-neutral-950 to-transparent sticky bottom-0">
        <div className="max-w-4xl mx-auto relative flex items-center">
          <div className="absolute left-4 flex gap-2">
            <label className="cursor-pointer">
              <input type="file" className="hidden" onChange={handleFileUpload} />
              <div className="text-neutral-400 hover:text-white hover:bg-white/5 rounded-full h-8 w-8 flex items-center justify-center transition-colors">
                <Paperclip className="w-4 h-4" />
              </div>
            </label>
          </div>
          
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={"Type your legal problem or upload a document..."}
            className="w-full bg-neutral-900/80 border border-white/10 rounded-full py-4 pl-16 pr-24 text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all text-white placeholder-neutral-500 shadow-xl"
          />
          
          <div className="absolute right-2 flex gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleMicClick}
              className={`rounded-full h-10 w-10 ${isListening ? 'text-red-400 bg-red-400/10 animate-pulse' : 'text-neutral-400 hover:text-white hover:bg-white/5'}`}
            >
              <Mic className="w-5 h-5" />
            </Button>
            <Button 
              onClick={handleSend}
              className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-full h-10 w-10 p-0 shadow-lg"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </Button>
          </div>
        </div>
        <p className="text-center text-xs text-neutral-500 mt-4 pb-2">
          Nyaya AI is an AI tool and not a substitute for professional legal advice. Responses are generated based on Indian legal precedents.
        </p>
      </div>
    </div>
  );
}
