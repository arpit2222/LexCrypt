import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Send, Loader2, X } from "lucide-react";

export function ChatBox({ caseId, currentUserRole, onClose }: { caseId: string, currentUserRole: string, onClose: () => void }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchChat = async () => {
    try {
      const res = await fetch(`/api/cases/chat/history?case_id=${caseId}`);
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchChat();
    const interval = setInterval(fetchChat, 5000); // Simple polling
    return () => clearInterval(interval);
  }, [caseId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const text = input;
    setInput("");
    setLoading(true);
    
    // Optimistic update
    setMessages(prev => [...prev, { sender: currentUserRole, text, timestamp: new Date().toISOString() }]);

    try {
      await fetch("/api/cases/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          case_id: caseId,
          sender: currentUserRole,
          text: text,
          file_url: ""
        })
      });
      await fetchChat();
    } catch (err) {
      alert("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-[350px] max-h-[500px] h-[80vh] bg-neutral-900 border border-white/10 rounded-xl shadow-2xl flex flex-col z-[100]">
      <div className="flex justify-between items-center p-4 border-b border-white/10 bg-neutral-950 rounded-t-xl">
        <h3 className="font-bold text-white text-sm">Secure Messages</h3>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6 rounded-full hover:bg-white/10">
          <X className="w-4 h-4 text-neutral-400" />
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <p className="text-neutral-500 text-center text-sm mt-10">No messages yet. Start the conversation!</p>
        ) : (
          messages.map((m, i) => (
            <div key={i} className={`flex ${m.sender === currentUserRole ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${m.sender === currentUserRole ? 'bg-indigo-600 text-white rounded-br-sm' : 'bg-neutral-800 text-neutral-200 rounded-bl-sm'}`}>
                <p className="text-[10px] opacity-50 mb-1 font-semibold uppercase">{m.sender === "lawyer" ? "Lawyer" : "Citizen"}</p>
                {m.text}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 border-t border-white/10 bg-neutral-950 rounded-b-xl flex gap-2">
        <input 
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Type a message..."
          className="flex-1 bg-neutral-900 border border-white/10 rounded-lg px-3 text-sm text-white focus:outline-none focus:border-indigo-500"
        />
        <Button onClick={handleSend} disabled={loading || !input.trim()} className="bg-indigo-600 hover:bg-indigo-500 rounded-lg px-3">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  );
}
