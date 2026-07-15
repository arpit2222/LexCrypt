"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Bot, Send, User, Paperclip, Loader2, FileText, X } from "lucide-react";
import ReactMarkdown from 'react-markdown';

export default function CopilotChat() {
  const [messages, setMessages] = useState<{role: string, content: string, file?: {filename: string, text: string} | null}[]>([
    {
      role: "ai",
      content: "Namaste, Advocate. I am Nyaya Copilot, your secure legal research assistant. How can I assist you with your case today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [attachedDoc, setAttachedDoc] = useState<{filename: string, text: string} | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const handleLoad = (e: any) => {
      setSessionId(e.detail._id);
      if (e.detail.history && e.detail.history.length > 0) {
        setMessages(e.detail.history);
      }
    };
    window.addEventListener('load-history', handleLoad);
    return () => window.removeEventListener('load-history', handleLoad);
  }, []);

  const handleSend = async () => {
    if (!input.trim() && !attachedDoc) return;

    const userContent = input;
    const newMsg = { role: "user", content: userContent, file: attachedDoc };
    const currentHistory = [...messages, newMsg];
    
    setMessages(currentHistory);
    setInput("");
    setAttachedDoc(null);
    setIsLoading(true);

    try {
      const lawyerEmail = localStorage.getItem("nyaya_email") || "lawyer@nyayasetu.ai";
      const payloadHistory = currentHistory.map(m => ({
        role: m.role,
        content: m.file ? `(Attached Document: ${m.file.filename})\n\n${m.file.text}\n\nUser Question: ${m.content}` : m.content
      })).filter(m => m.content !== "Namaste, Advocate. I am Nyaya Copilot, your secure legal research assistant. How can I assist you with your case today?");

      const response = await fetch("/api/copilot/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          history: payloadHistory, 
          session_id: sessionId,
          email: lawyerEmail
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || "Server error");
      }

      setMessages((prev) => [
        ...prev,
        { role: "ai", content: data.reply }
      ]);
      
      if (data.session_id) setSessionId(data.session_id);
    } catch (error: any) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: `API Error: ${error.message}` }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/copilot/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      
      if (response.ok) {
        setAttachedDoc({ filename: data.filename, text: data.text.substring(0, 10000) });
      } else {
        alert("Failed to extract text from document.");
      }
    } catch (error) {
      alert("Error uploading document.");
    } finally {
      e.target.value = "";
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-neutral-950 rounded-lg border border-white/5 overflow-hidden relative shadow-2xl">
      <div className="flex items-center justify-between px-6 py-4 bg-neutral-950/95 backdrop-blur-md border-b border-white/5 z-10 h-16 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
            <Bot className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <h2 className="text-white font-semibold tracking-wide text-sm">Nyaya Copilot</h2>
            <p className="text-[10px] text-neutral-400 font-medium uppercase tracking-widest">Advanced Legal Intelligence</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-2.5 py-1 bg-emerald-500/10 rounded-md border border-emerald-500/20">
           <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
           <span className="text-[10px] text-emerald-400 font-medium uppercase tracking-wider">Online</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scroll-smooth bg-[#09090b]">
        {messages.map((msg, index) => {
          const isUser = msg.role === "user";
          return (
            <div key={index} className={`w-full group animate-in fade-in slide-in-from-bottom-2 duration-500`}>
              <div className="flex gap-4 sm:gap-6">
                <div className="shrink-0 mt-1">
                  {isUser ? (
                    <div className="w-8 h-8 bg-neutral-800 rounded-md flex items-center justify-center border border-white/10 shadow-sm">
                      <User className="w-4 h-4 text-neutral-300" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center shadow-md shadow-blue-500/20">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0 flex flex-col pt-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-sm font-medium text-neutral-200">{isUser ? "You" : "Nyaya Copilot"}</span>
                    <span className="text-[10px] text-neutral-500 font-medium tracking-wider">Just now</span>
                  </div>
                  
                  <div className={`text-[14px] sm:text-[15px] leading-relaxed ${isUser ? 'text-neutral-300' : 'text-neutral-200'}`}>
                    {isUser && msg.file && (
                      <div className="flex items-center gap-3 mb-4 bg-white/5 hover:bg-white/10 transition-colors p-3 rounded-lg border border-white/5 w-max max-w-full">
                        <FileText className="w-4 h-4 text-blue-400 shrink-0" />
                        <span className="text-sm font-medium text-neutral-300 truncate">{msg.file.filename}</span>
                      </div>
                    )}
                    
                    {isUser ? (
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                    ) : (
                      <div className="prose prose-invert prose-sm sm:prose-base max-w-none prose-p:leading-relaxed prose-pre:bg-neutral-900 prose-pre:border prose-pre:border-white/10 prose-headings:font-semibold">
                        <ReactMarkdown
                          components={{
                            p: ({node, ...props}) => <p className="mb-4 last:mb-0" {...props} />,
                            ul: ({node, ...props}) => <ul className="list-disc ml-4 mb-4 space-y-1.5 marker:text-neutral-500" {...props} />,
                            ol: ({node, ...props}) => <ol className="list-decimal ml-4 mb-4 space-y-1.5 marker:text-neutral-500" {...props} />,
                            li: ({node, ...props}) => <li className="pl-1" {...props} />,
                            strong: ({node, ...props}) => <strong className="text-white font-semibold" {...props} />,
                            a: ({node, ...props}) => <a className="text-blue-400 hover:text-blue-300 underline underline-offset-2 decoration-blue-500/30 hover:decoration-blue-400 transition-all cursor-pointer font-medium" target="_blank" rel="noopener noreferrer" {...props} />,
                            h3: ({node, ...props}) => <h3 className="text-white font-bold text-lg mt-6 mb-3" {...props} />,
                            h4: ({node, ...props}) => <h4 className="text-white font-semibold text-base mt-4 mb-2" {...props} />
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {isLoading && (
          <div className="w-full animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex gap-4 sm:gap-6">
              <div className="shrink-0 mt-1">
                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center shadow-md shadow-blue-500/20">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="flex-1 flex flex-col pt-3">
                <div className="flex gap-1.5 items-center">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse delay-150" />
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse delay-300" />
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 sm:p-6 bg-neutral-950/95 border-t border-white/5 backdrop-blur-md relative z-20 shrink-0">
        <div className="max-w-4xl mx-auto relative w-full">
          
          {attachedDoc && (
            <div className="absolute -top-12 left-0 animate-in slide-in-from-bottom-2 fade-in bg-blue-500/10 border border-blue-500/20 backdrop-blur-md px-3 py-1.5 rounded-md flex items-center gap-2 w-max max-w-full z-50 shadow-lg">
              <FileText className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span className="text-xs text-blue-200 truncate">{attachedDoc.filename}</span>
              <button 
                onClick={() => setAttachedDoc(null)} 
                className="text-blue-400 hover:text-white transition-colors ml-1"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          <div className="flex items-center bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-lg shadow-sm p-1 transition-all focus-within:bg-neutral-900/80 focus-within:border-blue-500/30">
            <label className="cursor-pointer p-2.5 text-neutral-400 hover:text-white transition-colors shrink-0 rounded-md hover:bg-white/5 group">
              <input type="file" className="hidden" onChange={handleFileUpload} accept=".pdf,.txt" />
              <Paperclip className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </label>
            
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (input.trim() || attachedDoc) && handleSend()}
              placeholder="Ask Copilot for research, drafting, or case analysis..."
              className="flex-1 bg-transparent border-none py-3 px-2 text-white placeholder-neutral-500 focus:outline-none focus:ring-0 text-[15px] min-w-0"
              disabled={isLoading}
            />
            
            <Button
              onClick={handleSend}
              disabled={(!input.trim() && !attachedDoc) || isLoading}
              className="ml-1 bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 rounded-md px-4 py-2 h-auto flex items-center gap-2 transition-all shadow-sm"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><span className="hidden sm:inline font-medium">Send</span> <Send className="w-4 h-4" /></>}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
