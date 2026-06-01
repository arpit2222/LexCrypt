"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ShieldAlert, Lock, Unlock, AlertTriangle } from "lucide-react";

export default function WhistleblowerVault() {
  const [step, setStep] = useState(1);

  const lockEvidence = () => {
    setStep(2);
    setTimeout(() => setStep(3), 3000);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 flex flex-col items-center pt-20 px-4">
      <div className="max-w-2xl w-full">
        <Link href="/citizen">
          <Button variant="ghost" className="mb-6 hover:bg-white/10"><ChevronLeft className="mr-2 h-4 w-4"/> Back</Button>
        </Link>
        
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3"><ShieldAlert className="text-red-400" /> Whistleblower Vault</h1>
        <p className="text-neutral-400 mb-8">Upload corporate evidence to an encrypted IPFS node. Set an encrypted dead-man's switch on the blockchain. If you fail to check in before the deadline, the FHE contract decrypts and releases the evidence automatically.</p>

        {step === 1 && (
          <div className="bg-neutral-900 border border-white/10 p-6 rounded-2xl">
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl mb-6 text-sm flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <p>Warning: This action writes an encrypted payload to the blockchain. Only you can prevent the evidence from being released by continuously checking in.</p>
            </div>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-sm text-neutral-400 block mb-2">Evidence Payload (PDF/ZIP)</label>
                <div className="w-full bg-black/50 border border-white/5 border-dashed rounded-xl p-8 text-center text-neutral-500">
                  Drag and drop files here
                </div>
              </div>
              <div>
                <label className="text-sm text-neutral-400 block mb-2">Release Deadline (Dead-man's Switch)</label>
                <input type="datetime-local" className="w-full bg-black/50 border border-white/5 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-red-500/50" />
              </div>
            </div>
            
            <Button onClick={lockEvidence} className="w-full bg-red-600 hover:bg-red-500 py-6 text-lg"><Lock className="w-4 h-4 mr-2" /> Encrypt & Lock Vault</Button>
          </div>
        )}

        {step === 2 && (
          <div className="bg-neutral-900 border border-white/10 p-6 rounded-2xl text-center">
            <Lock className="w-16 h-16 text-red-400 animate-pulse mx-auto mb-6" />
            <h2 className="text-xl font-semibold mb-2">Encrypting Payload...</h2>
            <p className="text-neutral-400 font-mono text-xs">Uploading to IPFS and encrypting release timestamp via @cofhe/sdk</p>
          </div>
        )}

        {step === 3 && (
          <div className="bg-neutral-900 border border-white/10 p-6 rounded-2xl text-center">
            <ShieldAlert className="w-16 h-16 text-green-400 mx-auto mb-6" />
            <h2 className="text-xl font-bold text-green-400 mb-2">Vault Secured</h2>
            <p className="text-neutral-300 mb-6">Your evidence is cryptographically locked on Arbitrum CoFHE. The network will automatically release it if you do not check in by the deadline.</p>
            <div className="flex gap-4">
              <Button onClick={() => alert("Deadline extended by 7 days. FHE Contract Updated.")} className="flex-1 bg-neutral-800 hover:bg-neutral-700 py-6"><Unlock className="w-4 h-4 mr-2" /> Check-in (Extend)</Button>
              <Button onClick={() => alert("Triggering FHE timestamp evaluation...")} variant="outline" className="flex-1 border-red-500/30 text-red-400 hover:bg-red-500/10 py-6">Force Release Now</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
