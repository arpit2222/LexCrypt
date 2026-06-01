"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Scale, Lock, Gavel, CheckCircle2 } from "lucide-react";

export default function SealedBidRFP() {
  const [step, setStep] = useState(1);
  const [bids, setBids] = useState(0);

  const simulateBidSubmission = () => {
    setStep(2);
    setTimeout(() => setBids(1), 1000);
    setTimeout(() => setBids(3), 3000);
    setTimeout(() => setBids(5), 5000);
  };

  const evaluateBids = () => {
    setStep(3);
    setTimeout(() => setStep(4), 4000);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 flex flex-col items-center pt-20 px-4">
      <div className="max-w-2xl w-full">
        <Link href="/citizen">
          <Button variant="ghost" className="mb-6 hover:bg-white/10"><ChevronLeft className="mr-2 h-4 w-4"/> Back</Button>
        </Link>
        
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3"><Gavel className="text-indigo-400" /> Sealed-Bid Legal Marketplace</h1>
        <p className="text-neutral-400 mb-8">Post your case and allow top lawyers to submit FHE-encrypted bids. The smart contract finds the lowest retainer fee without exposing the bids to the public.</p>

        {step === 1 && (
          <div className="bg-neutral-900 border border-white/10 p-6 rounded-2xl">
            <h2 className="text-xl font-semibold mb-4">Post Request for Proposal (RFP)</h2>
            <textarea className="w-full bg-black/50 border border-white/5 rounded-xl p-4 text-sm text-neutral-300 h-32 mb-4" defaultValue="I need representation for a corporate restructuring. Budget is flexible but seeking the most competitive retainer fee." />
            <Button onClick={simulateBidSubmission} className="w-full bg-indigo-600 hover:bg-indigo-500 py-6 text-lg"><Lock className="w-4 h-4 mr-2" /> Publish Encrypted RFP</Button>
          </div>
        )}

        {step === 2 && (
          <div className="bg-neutral-900 border border-white/10 p-6 rounded-2xl text-center">
            <div className="w-16 h-16 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin mx-auto mb-6" />
            <h2 className="text-xl font-semibold mb-2">RFP Active</h2>
            <p className="text-neutral-400 mb-6">Lawyers are currently submitting encrypted bids.</p>
            <div className="text-4xl font-black text-indigo-400 mb-8">{bids} Bids Received</div>
            <Button onClick={evaluateBids} disabled={bids < 5} className="w-full bg-indigo-600 hover:bg-indigo-500 py-6 text-lg"><Gavel className="w-4 h-4 mr-2" /> Evaluate Lowest Bid (FHE)</Button>
          </div>
        )}

        {step === 3 && (
          <div className="bg-neutral-900 border border-white/10 p-6 rounded-2xl text-center">
            <Scale className="w-16 h-16 text-indigo-400 animate-pulse mx-auto mb-6" />
            <h2 className="text-xl font-semibold mb-2">Computing on Ciphertexts...</h2>
            <p className="text-neutral-400 font-mono text-xs">Executing FHE.lt(bids[i].encryptedFee, lowestFee) on Arbitrum CoFHE</p>
          </div>
        )}

        {step === 4 && (
          <div className="bg-green-500/10 border border-green-500/30 p-6 rounded-2xl text-center">
            <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-6" />
            <h2 className="text-xl font-bold text-green-400 mb-2">Winner Selected!</h2>
            <p className="text-neutral-300 mb-4">The smart contract has successfully evaluated all encrypted bids and assigned the lawyer with the lowest retainer.</p>
            <code className="bg-black/50 px-4 py-2 rounded-lg text-green-300 font-mono text-sm block mb-6">
              Assigned Lawyer: 0x4a9C...2f8B
            </code>
            <Button onClick={() => setStep(1)} variant="outline" className="w-full border-green-500/30 text-green-400 hover:bg-green-500/10">Post Another RFP</Button>
          </div>
        )}
      </div>
    </div>
  );
}
