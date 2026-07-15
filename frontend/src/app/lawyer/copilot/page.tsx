"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Bot, Send, User, Paperclip, Loader2, FileText, X } from "lucide-react";
import ReactMarkdown from 'react-markdown';

export default function LawyerCopilot() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [uploading, setUploading] = useState(false);
  const [attachedDoc, setAttachedDoc] = useState<{filename: string, text: string} | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    const handleLoad = (e: any) => {
      setMessages(e.detail.history || []);
      setSessionId(e.detail._id || "");
    };
    window.addEventListener('load-history', handleLoad);
    return () => window.removeEventListener('load-history', handleLoad);
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    
    try {
      const res = await fetch("/api/copilot/upload", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      
      if (res.ok) {
        const text = data.text.substring(0, 10000); 
        setAttachedDoc({ filename: data.filename, text });
      } else {
        alert("Failed to extract text from document.");
      }
    } catch(err) {
      alert("Error uploading document.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleResearch = async () => {
    if (!input.trim() && !attachedDoc) return;
    
    const newMsg = { role: "user", content: input, file: attachedDoc };
    const currentHistory = [...messages, newMsg];
    
    setMessages(currentHistory);
    setInput("");
    setAttachedDoc(null);
    setLoading(true);
    
    try {
      const email = localStorage.getItem("nyaya_email") || "admin@nyaya.ai";
      
      const payloadHistory = currentHistory.map(m => ({
        role: m.role,
        content: m.file ? `(Attached Document: ${m.file.filename})\\n\\n${m.file.text}\\n\\nUser Question: ${m.content}` : m.content
      }));

      const res = await fetch("/api/copilot/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history: payloadHistory, session_id: sessionId, email })
      });
      const data = await res.json();
      
      setMessages([...currentHistory, { role: "assistant", content: data.summary }]);
      if (data.session_id) {
        setSessionId(data.session_id);
      }
      window.dispatchEvent(new Event('refresh-history'));
    } catch(err) {
      setMessages([...currentHistory, { role: "assistant", content: "Error connecting to backend." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      <header className="p-4 md:p-8 md:pb-4 shrink-0">
        <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2"><Bot className="w-6 h-6 text-indigo-400"/> AI Legal Copilot</h1>
      </header>

      <main className="flex-1 w-full max-w-4xl mx-auto flex flex-col overflow-hidden px-4 md:px-8 pb-32">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center opacity-50">
            <Bot className="w-16 h-16 text-indigo-400 mb-4" />
            <h2 className="text-xl font-semibold mb-2">How can I help you today?</h2>
            <p className="max-w-md text-sm">Ask any legal question, request case law summaries, or explore legal strategies. I specialize in Indian Law.</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-6 pr-2">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === "user" ? "bg-indigo-600" : "bg-neutral-800 border border-white/10"}`}>
                  {msg.role === "user" ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-indigo-400" />}
                </div>
                <div className={`max-w-[85%] rounded-2xl p-4 ${msg.role === "user" ? "bg-indigo-600 text-white" : "bg-neutral-900/80 border border-white/5 prose prose-invert"}`}>
                  {msg.role === "user" ? (
                    <div className="flex flex-col gap-2">
                      {msg.file && (
                        <div className="flex items-center gap-2 bg-black/20 p-2 rounded-lg text-sm w-fit">
                          <FileText className="w-4 h-4" />
                          <span className="truncate max-w-[200px]">{msg.file.filename}</span>
                        </div>
                      )}
                      {msg.content && <p className="whitespace-pre-wrap text-sm">{msg.content}</p>}
                    </div>
                  ) : (
                    <ReactMarkdown
                       components={{
                         h1: ({node, ...props}) => <h1 className="text-xl font-bold text-white mt-6 mb-3" {...props} />,
                         h2: ({node, ...props}) => <h2 className="text-lg font-bold text-indigo-300 mt-5 mb-2 border-b border-white/10 pb-1" {...props} />,
                         h3: ({node, ...props}) => <h3 className="text-base font-bold text-white mt-4 mb-2" {...props} />,
                         p: ({node, ...props}) => <p className="mb-3 last:mb-0 text-sm leading-relaxed" {...props} />,
                         ul: ({node, ...props}) => <ul className="list-disc pl-5 space-y-2 mb-3 text-sm" {...props} />,
                         ol: ({node, ...props}) => <ol className="list-decimal pl-5 space-y-2 mb-3 text-sm" {...props} />,
                         li: ({node, ...props}) => <li className="leading-relaxed" {...props} />,
                         strong: ({node, ...props}) => <strong className="font-semibold text-white" {...props} />
                       }}
                    >{msg.content}</ReactMarkdown>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-4">
                <div className="shrink-0 w-8 h-8 rounded-full bg-neutral-800 border border-white/10 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="bg-neutral-900/80 border border-white/5 rounded-2xl p-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-.3s]" />
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-.5s]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent pt-10 pb-4 md:pb-8 px-4">
        <div className="max-w-3xl mx-auto relative flex flex-col">
          {attachedDoc && (
            <div className="mb-2 ml-14 flex items-center gap-2 bg-neutral-800/80 border border-white/10 w-fit p-2 pr-3 rounded-lg backdrop-blur-md">
              <FileText className="w-4 h-4 text-indigo-400" />
              <span className="text-xs text-neutral-300 truncate max-w-[150px]">{attachedDoc.filename}</span>
              <button 
                onClick={() => setAttachedDoc(null)}
                className="ml-1 p-0.5 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
          <div className="relative flex items-center">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              className="hidden" 
              accept=".pdf,.txt" 
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading || loading}
              className="text-neutral-400 hover:text-indigo-400 transition-colors disabled:opacity-50"
              title="Upload PDF or TXT"
            >
              {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Paperclip className="w-5 h-5" />}
            </button>
          </div>
          <textarea 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleResearch();
              }
            }}
            placeholder="Ask a legal question or attach a document..."
            className="w-full bg-neutral-900 border border-white/10 rounded-2xl py-3 pl-12 pr-12 text-sm text-white focus:outline-none focus:border-indigo-500/50 shadow-xl resize-none min-h-[52px] max-h-32"
            rows={1}
          />
          <Button 
            onClick={handleResearch}
            disabled={loading || !input.trim()}
            className="absolute right-2 bottom-2 rounded-xl h-9 w-9 p-0 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 z-10"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
