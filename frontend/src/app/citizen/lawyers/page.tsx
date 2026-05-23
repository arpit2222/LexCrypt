"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Star, MapPin, Search, CalendarCheck, Video } from "lucide-react";

export default function LawyerMarketplace() {
  const [lawyers, setLawyers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookedLawyerName, setBookedLawyerName] = useState<string | null>(null);
  const [activeCall, setActiveCall] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:8000/api/lawyers")
      .then(res => res.json())
      .then(data => {
        setLawyers(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleBook = async (lawyer: any) => {
    try {
      const res = await fetch("http://localhost:8000/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lawyer_id: lawyer.id, date: "2026-06-01", time: "14:00", issue_summary: "Legal Consultation" })
      });
      const data = await res.json();
      alert(`Booking Successful! ID: ${data.booking_id}`);
      setBookedLawyerName(lawyer.name);
    } catch(err) {
      alert("Booking failed");
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
        <h1 className="text-xl font-bold">Find a Lawyer</h1>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto p-8">
        <div className="relative mb-8">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input 
            type="text" 
            placeholder="Search by specialty, location, or language..." 
            className="w-full bg-neutral-900 border border-white/10 rounded-full py-4 pl-12 pr-4 text-white focus:outline-none focus:border-indigo-500/50"
          />
        </div>

        {loading ? (
          <div className="text-center text-neutral-500 mt-20">Loading lawyers...</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {lawyers.map(lawyer => (
              <div key={lawyer.id} className="bg-neutral-900/50 border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-white">{lawyer.name}</h2>
                      <p className="text-indigo-400 text-sm font-medium">{lawyer.specialty}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-yellow-500/10 text-yellow-400 px-2 py-1 rounded-md text-sm font-medium">
                      <Star className="w-4 h-4 fill-current" /> {lawyer.rating}
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-sm text-neutral-400">
                      <MapPin className="w-4 h-4" /> {lawyer.location}
                    </div>
                    <div className="text-sm text-neutral-400">
                      <span className="font-medium text-neutral-300">Languages:</span> {lawyer.languages.join(", ")}
                    </div>
                    <div className="text-sm text-neutral-400">
                      <span className="font-medium text-neutral-300">Consultation Fee:</span> {lawyer.fee}
                    </div>
                  </div>
                </div>
                
                {bookedLawyerName === lawyer.name ? (
                  <Button 
                    onClick={() => setActiveCall(lawyer.name)}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white"
                  >
                    <Video className="w-4 h-4 mr-2" /> Join Video Call
                  </Button>
                ) : (
                  <Button 
                    onClick={() => handleBook(lawyer)}
                    className="w-full bg-white/10 hover:bg-indigo-600 text-white"
                  >
                    <CalendarCheck className="w-4 h-4 mr-2" /> Book Consultation
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Video Call Modal (Jitsi Iframe) */}
      {activeCall && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center p-4 md:p-8">
          <div className="w-full max-w-5xl bg-neutral-900 rounded-2xl overflow-hidden flex flex-col border border-white/10 shadow-2xl">
            <div className="flex justify-between items-center p-4 border-b border-white/10 bg-neutral-950">
              <h3 className="font-bold flex items-center gap-2 text-white">
                <Video className="w-5 h-5 text-indigo-400"/> Consultation Room: Adv. {activeCall}
              </h3>
              <Button variant="destructive" onClick={() => setActiveCall(null)}>End Call</Button>
            </div>
            <iframe 
              allow="camera; microphone; fullscreen; display-capture" 
              src={`https://meet.jit.si/NyayaConsultation-${activeCall.replace(/\s+/g, '')}`} 
              style={{ height: "75vh", width: "100%", border: 0 }} 
            />
          </div>
        </div>
      )}
    </div>
  );
}
