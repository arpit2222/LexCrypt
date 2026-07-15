  "use client";

  import React, { useState, useEffect, useRef } from "react";
  import Link from "next/link";
  import { useRouter } from "next/navigation";
  import { Button } from "@/components/ui/button";
  import { Scale, Send, Mic, Paperclip, Bot, User, ChevronLeft, Bookmark, History, Volume2, Briefcase, Copy, Search, Plus, Menu, LogOut, FileText, X } from "lucide-react";
  import ReactMarkdown from 'react-markdown';

  export default function CitizenDashboard() {
    const [messages, setMessages] = useState<{role: string, content: string, file?: {filename: string, text: string} | null}[]>([
      {
        role: "ai",
        content: "Namaste. I am Nyaya AI, your secure legal intelligence partner. Please describe your legal matter, and I will prepare a preliminary brief.",
      },
    ]);
    const [input, setInput] = useState("");
    const [showHistory, setShowHistory] = useState(false);
    const [historyList, setHistoryList] = useState<any[]>([]);
    const [isListening, setIsListening] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [sessionId, setSessionId] = useState("");
    const [attachedDoc, setAttachedDoc] = useState<{filename: string, text: string} | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const handleLogout = () => {
      localStorage.removeItem("nyaya_token");
      localStorage.removeItem("nyaya_email");
      localStorage.removeItem("nyaya_role");
      router.push("/login");
    };

    const isHome = messages.length === 1;
    const isReadOnly = messages.length === 2 && messages[0].role === "user";

    useEffect(() => {
      // Enforce Login
      const token = localStorage.getItem("nyaya_token");
      if (!token && window.location.pathname === "/citizen") {
        window.location.href = "/login";
        return;
      }

      if (!isHome) {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    }, [messages, isHome]);

    const handleNewCase = () => {
      setMessages([
        {
          role: "ai",
          content: "Namaste. I am Nyaya AI, your secure legal intelligence partner. Please describe your legal matter, and I will prepare a preliminary brief.",
        },
      ]);
      setInput("");
      setSessionId("");
      setAttachedDoc(null);
    };

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
          setInput((prev) => prev + (prev ? " " : "") + transcript);
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
      if (!input.trim() && !attachedDoc) return;
      
      const userContent = input;
      const newMsg = { role: "user", content: userContent, file: attachedDoc };
      const currentHistory = [...messages, newMsg];
      
      setMessages(currentHistory);
      setInput("");
      setAttachedDoc(null);
      setIsLoading(true);

      try {
        const userIdentifier = localStorage.getItem("nyaya_email") || "citizen@nyaya.ai";
        
        const payloadHistory = currentHistory.map(m => ({
          role: m.role,
          content: m.file ? `(Attached Document: ${m.file.filename})\\n\\n${m.file.text}\\n\\nUser Question: ${m.content}` : m.content
        })).filter(m => m.content !== "Namaste. I am Nyaya AI, your secure legal intelligence partner. Please describe your legal matter, and I will prepare a preliminary brief.");
        
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ history: payloadHistory, session_id: sessionId, user_id: userIdentifier }),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.detail || "Server error");
        }

        setMessages(prev => [
          ...prev,
          { role: "ai", content: data.reply }
        ]);
        
        if (data.session_id) setSessionId(data.session_id);
      } catch (error: any) {
        setMessages(prev => [
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
      <div className="min-h-screen bg-[#0a0a0a] text-neutral-50 flex font-sans selection:bg-neutral-800">
        
        {/* Mobile Backdrop */}
        {isSidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-[50] md:hidden" onClick={() => setIsSidebarOpen(false)} />
        )}

        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-[60] w-64 border-r border-white/5 bg-[#0a0a0a]/95 backdrop-blur-xl flex flex-col transform transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}>
          <div className="p-6 flex items-center gap-3 border-b border-white/5">
            <Link href="/" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-2 cursor-pointer group">
              <Scale className="w-6 h-6 text-teal-400 group-hover:text-white transition-colors" />
              <span className="text-xl font-bold tracking-widest text-neutral-200 group-hover:text-white transition-colors uppercase">Nyaya</span>
            </Link>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-2">
            <button onClick={() => { handleNewCase(); setIsSidebarOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 bg-teal-600/10 text-teal-300 rounded-xl font-medium">
              <Plus className="w-5 h-5" /> New Case
            </button>
            <button onClick={() => { fetchHistory(); setIsSidebarOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 text-neutral-400 hover:text-white hover:bg-white/5 rounded-xl font-medium transition-colors">
              <History className="w-5 h-5" /> Case History
            </button>
          </nav>
          <div className="p-4 border-t border-white/5 mt-auto">
            <button onClick={handleLogout} className="w-full flex items-center justify-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-xl font-medium transition-colors">
              <LogOut className="w-5 h-5" /> Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
          <header className="md:hidden flex items-center justify-between px-6 py-4 z-50 border-b border-white/5">
            <div className="flex items-center gap-4">
              <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 text-neutral-400 hover:text-white">
                <Menu className="w-6 h-6" />
              </button>
              <span className="text-lg font-bold">Nyaya Citizen</span>
            </div>
          </header>

          {/* Desktop Header Top Links (Optional now that we have a sidebar) */}
          <div className="hidden md:flex absolute top-6 right-8 z-50 gap-4 text-sm font-medium">
            <button onClick={handleNewCase} className="text-neutral-400 hover:text-white transition-colors flex items-center gap-2">
              <Plus className="w-4 h-4" /> New Case
            </button>
            <button onClick={fetchHistory} className="text-neutral-400 hover:text-white transition-colors flex items-center gap-2">
              <History className="w-4 h-4" /> History
            </button>
          </div>

        {/* Main Container */}
        <main className={`flex-1 flex flex-col w-full max-w-4xl mx-auto px-4 overflow-y-auto transition-all duration-700 ease-in-out ${isHome ? 'justify-center pb-32' : 'justify-start pt-8 pb-40'}`}>
          
          {/* Home State Greeting */}
          {isHome && (
            <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-white mb-4 leading-tight">
                What legal matter can we assist you with?
              </h1>
              <p className="text-lg text-neutral-500">
                Describe your issue securely. Nyaya AI will triage your case and prepare it for our advocates.
              </p>
            </div>
          )}

          {/* Chat Interface (Hidden on Home) */}
          {!isHome && (
            <div className="flex flex-col gap-10 overflow-y-auto">
              {messages.map((msg, index) => {
                // Skip the welcome message if not in home state
                if (index === 0) return null;

                const isUser = msg.role === "user";

                return (
                  <div key={index} className={`flex flex-col ${isUser ? "items-end" : "items-start"} animate-in fade-in slide-in-from-bottom-2 duration-500`}>
                    
                    {/* Avatar / Role Indicator */}
                    <div className="flex items-center gap-2 mb-2 text-xs font-semibold tracking-wider text-neutral-500 uppercase">
                      {isUser ? (
                        <>You <User className="w-3 h-3" /></>
                      ) : (
                        <><Scale className="w-3 h-3" /> Nyaya AI</>
                      )}
                    </div>

                    {isUser ? (
                      <div className="bg-neutral-800/50 text-neutral-200 px-6 py-4 rounded-2xl rounded-tr-sm max-w-[85%] leading-relaxed border border-white/5">
                        {msg.file && (
                          <div className="flex items-center gap-2 mb-3 bg-neutral-900/50 p-2 rounded-lg border border-white/5 w-fit">
                            <FileText className="w-4 h-4 text-teal-400" />
                            <span className="text-xs font-medium text-neutral-300">{msg.file.filename}</span>
                          </div>
                        )}
                        {msg.content}
                      </div>
                    ) : (
                      <div className="text-neutral-300 w-full leading-relaxed text-[15px]">
                        <ReactMarkdown
                          components={{
                            p: ({node, ...props}) => <p className="mb-4" {...props} />,
                            ul: ({node, ...props}) => <ul className="list-disc ml-6 mb-4 space-y-2 marker:text-neutral-600" {...props} />,
                            ol: ({node, ...props}) => <ol className="list-decimal ml-6 mb-4 space-y-2 marker:text-neutral-600" {...props} />,
                            li: ({node, ...props}) => <li className="pl-1" {...props} />,
                            strong: ({node, ...props}) => <strong className="text-white font-semibold" {...props} />
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    )}

                    {/* Action Buttons (Only for AI) */}
                    {!isUser && (
                      <div className="flex gap-4 mt-2 opacity-0 hover:opacity-100 focus-within:opacity-100 transition-opacity">
                        <button onClick={() => handleSpeak(msg.content)} className="flex items-center gap-1 text-xs font-medium text-neutral-500 hover:text-white transition-colors">
                          <Volume2 className="w-3 h-3" /> Listen
                        </button>
                        <button onClick={() => { navigator.clipboard.writeText(msg.content); alert("Copied to clipboard!"); }} className="flex items-center gap-1 text-xs font-medium text-neutral-500 hover:text-white transition-colors">
                          <Copy className="w-3 h-3" /> Copy
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
              {isLoading && (
                <div className="flex flex-col items-start animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <div className="flex items-center gap-2 mb-2 text-xs font-semibold tracking-wider text-neutral-500 uppercase">
                    <Scale className="w-3 h-3" /> Nyaya AI
                  </div>
                  <div className="flex gap-1.5 items-center bg-neutral-900/50 px-5 py-4 rounded-2xl rounded-tl-sm border border-white/5 h-12 w-20">
                    <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </main>

        {/* Floating Input Bar */}
        {!isReadOnly && (
        <div className={`absolute left-0 right-0 z-40 transition-all duration-700 ease-in-out px-4 ${isHome ? 'bottom-1/3 translate-y-1/2' : 'bottom-8'}`}>
          <div className="max-w-3xl mx-auto relative group">
            {attachedDoc && (
              <div className="absolute -top-12 left-0 animate-in slide-in-from-bottom-2 fade-in bg-teal-500/10 border border-teal-500/20 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-3 w-max max-w-[90%] z-50">
                <FileText className="w-4 h-4 text-teal-400 shrink-0" />
                <span className="text-sm text-teal-200 truncate">{attachedDoc.filename}</span>
                <button 
                  onClick={() => setAttachedDoc(null)} 
                  className="text-teal-400 hover:text-white transition-colors ml-2"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-800/20 to-neutral-800/20 rounded-2xl blur-xl transition-opacity opacity-0 group-hover:opacity-100 pointer-events-none" />
            
            <div className="relative flex items-center bg-[#111111]/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl p-1.5 md:p-2 transition-all">
              
              <label className="cursor-pointer p-2 md:p-3 text-neutral-500 hover:text-white transition-colors shrink-0">
                <input type="file" className="hidden" onChange={handleFileUpload} />
                <Paperclip className="w-4 h-4 md:w-5 md:h-5" />
              </label>
              
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (input.trim() || attachedDoc) && handleSend()}
                placeholder="Message Nyaya AI..."
                className="flex-1 bg-transparent border-none py-3 px-1 md:px-2 text-white placeholder-neutral-600 focus:outline-none focus:ring-0 text-sm md:text-[15px] min-w-0"
              />
              
              <div className="flex items-center shrink-0 pr-1">
                <button 
                  onClick={handleMicClick}
                  className={`p-2 md:p-3 rounded-xl transition-all ${isListening ? 'bg-red-500/20 text-red-400' : 'text-neutral-500 hover:text-white hover:bg-white/5'}`}
                >
                  <Mic className="w-4 h-4 md:w-5 md:h-5" />
                </button>
                <button 
                  onClick={handleSend}
                  disabled={!input.trim() && !attachedDoc}
                  className="p-2.5 md:p-3 bg-white text-black hover:bg-neutral-200 disabled:opacity-50 disabled:hover:bg-white rounded-xl transition-all ml-1"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="text-center mt-3 hidden md:block">
              <span className="text-xs text-neutral-600">Nyaya AI can make mistakes. Consider verifying important information.</span>
            </div>

            {isHome && (
              <div className="flex flex-wrap justify-center gap-3 mt-8 relative z-50">
                {[
                  "My tenant is refusing to vacate my property.",
                  "Review this employment contract.",
                  "How do I file for a mutual divorce?"
                ].map((suggestion, i) => (
                  <button 
                    key={i}
                    type="button"
                    onClick={() => {
                      setInput(suggestion);
                    }}
                    className="px-4 py-2 rounded-full border border-white/10 bg-neutral-900/50 hover:bg-white/10 text-neutral-400 hover:text-white text-sm transition-all animate-in fade-in slide-in-from-bottom-2"
                    style={{ animationDelay: `${i * 150}ms` }}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        )}

        {/* History Sidebar */}
        {showHistory && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex justify-end">
            <div className="w-full max-w-md bg-[#111111] h-full border-l border-white/10 p-6 overflow-y-auto flex flex-col">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-lg font-semibold text-white tracking-wide">Case History</h2>
                <button onClick={() => setShowHistory(false)} className="text-neutral-500 hover:text-white text-sm font-medium">Close</button>
              </div>
              
              <div className="space-y-6 flex-1">
                {historyList.length === 0 ? (
                  <p className="text-neutral-500 text-center mt-10">No history found.</p>
                ) : (
                  historyList.map((item, idx) => (
                    <div key={idx} className="group border border-white/5 hover:border-white/10 bg-neutral-900/30 rounded-2xl p-5 transition-all cursor-pointer" onClick={() => {
                      setMessages([
                        { role: "ai", content: "Namaste. I am Nyaya AI, your secure legal intelligence partner. Please describe your legal matter, and I will prepare a preliminary brief." },
                        ...(item.history || [])
                      ]);
                      setSessionId(item._id || "");
                      setShowHistory(false);
                    }}>
                      <p className="text-[10px] uppercase tracking-widest text-neutral-600 mb-3">{new Date(item.timestamp).toLocaleDateString()}</p>
                      <p className="text-sm text-white font-medium mb-2">{item.title || "Case Session"}</p>
                      <p className="text-xs text-neutral-400 line-clamp-3 leading-relaxed mb-4">{item.history ? item.history[item.history.length-1].content : ""}</p>
                      <button 
                        onClick={async (e) => {
                          e.stopPropagation();
                          const target = e.currentTarget;
                          const citizen = localStorage.getItem("nyaya_email") || "citizen@nyaya.ai";
                          try {
                            const res = await fetch("/api/cases/hire", {
                              method: "POST",
                              headers: {"Content-Type": "application/json"},
                              body: JSON.stringify({ 
                                citizen_wallet: citizen, 
                                lawyer_id: "1", 
                                query_details: `Citizen Chat Session (${item.title || 'Case'}):\\n\\n` + (item.history || []).map((m: any) => `${m.role.toUpperCase()}: ${m.content}`).join('\\n\\n')
                              })
                            });
                            if(res.ok) {
                              target.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg> Assigned to Legal Team';
                              target.classList.add('bg-green-500', 'text-white');
                              target.classList.remove('bg-white', 'text-black');
                            } else {
                              alert("Failed to assign case.");
                            }
                          } catch(err) {
                            alert("Failed to assign case.");
                          }
                        }}
                        className="w-full bg-white text-black hover:bg-neutral-200 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                      >
                        <Briefcase className="w-3 h-3" /> Assign to Legal Team
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
        </main>
      </div>
    );
  }
