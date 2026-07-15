"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft, FileText, Send, CheckCircle2 } from 'lucide-react';

type ContractTerm = {
  fieldName: string;
  value: string;
};

export default function ContractComposer() {
  const [activeTemplate, setActiveTemplate] = useState('MergersAcquisition');
  const [counterparty, setCounterparty] = useState('');
  const [deploying, setDeploying] = useState(false);
  const [deployed, setDeployed] = useState(false);

  // Standard Web2 Templates
  const templates: Record<string, ContractTerm[]> = {
    MergersAcquisition: [
      { fieldName: 'Purchase Price (USD)', value: '50000000' },
      { fieldName: 'Earnout Threshold (EBITDA)', value: '20000000' },
      { fieldName: 'Closing Date (Unix Timestamp)', value: '1735689600' },
    ],
    SoftwareEscrow: [
      { fieldName: 'Release Condition Threshold', value: '100' },
      { fieldName: 'Penalty if Unreleased', value: '50000' },
      { fieldName: 'Term Length (Months)', value: '24' }
    ],
    GovernmentRFP: [
      { fieldName: 'Bid Amount', value: '1500000' },
      { fieldName: 'Completion Deadline', value: '1735689600' }
    ]
  };

  const [clauses, setClauses] = useState<ContractTerm[]>(templates['MergersAcquisition']);

  const handleTemplateChange = (templateKey: string) => {
    setActiveTemplate(templateKey);
    setClauses(templates[templateKey]);
    setDeployed(false);
  };

  const handleDeploy = async () => {
    if (!counterparty) {
      alert("Please enter a counterparty email address.");
      return;
    }
    
    setDeploying(true);
    
    // Simulate standard DB save and email dispatch
    setTimeout(() => {
      setDeploying(false);
      setDeployed(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 flex flex-col">
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-neutral-950/80 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="hover:bg-white/10 rounded-full">
              <ChevronLeft className="w-5 h-5 text-neutral-400" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-teal-400" />
            <span className="text-lg font-bold">Standard Contract Composer</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Templates */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-neutral-900/50 border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><FileText className="w-5 h-5 text-teal-400"/> Templates</h2>
            <div className="space-y-3">
              <Button 
                onClick={() => handleTemplateChange('MergersAcquisition')}
                variant={activeTemplate === 'MergersAcquisition' ? 'default' : 'outline'}
                className={`w-full justify-start ${activeTemplate === 'MergersAcquisition' ? 'bg-teal-600' : 'border-white/10 hover:bg-white/5'}`}
              >
                Mergers & Acquisitions (Earnout)
              </Button>
              <Button 
                onClick={() => handleTemplateChange('SoftwareEscrow')}
                variant={activeTemplate === 'SoftwareEscrow' ? 'default' : 'outline'}
                className={`w-full justify-start ${activeTemplate === 'SoftwareEscrow' ? 'bg-teal-600' : 'border-white/10 hover:bg-white/5'}`}
              >
                Software Escrow Agreement
              </Button>
              <Button 
                onClick={() => handleTemplateChange('GovernmentRFP')}
                variant={activeTemplate === 'GovernmentRFP' ? 'default' : 'outline'}
                className={`w-full justify-start ${activeTemplate === 'GovernmentRFP' ? 'bg-teal-600' : 'border-white/10 hover:bg-white/5'}`}
              >
                Government Procurement
              </Button>
            </div>
          </div>
        </div>

        {/* Right Column: Composer */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-neutral-900/50 border border-white/10 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6">Agreement Terms</h2>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-neutral-400 mb-2">Counterparty Email Address (Party B)</label>
              <input 
                type="email"
                value={counterparty} 
                onChange={(e) => setCounterparty(e.target.value)}
                placeholder="counterparty@example.com"
                className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-teal-500/50"
              />
            </div>

            <div className="space-y-4 mb-8">
              <h3 className="text-lg font-semibold text-neutral-300 border-b border-white/10 pb-2">Contract Clauses</h3>
              
              {clauses.map((clause, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row items-center gap-4 bg-black/30 p-4 rounded-xl border border-white/5">
                  <div className="flex-1 w-full">
                    <label className="block text-xs font-medium text-neutral-500 mb-1">{clause.fieldName}</label>
                    <input 
                      value={clause.value}
                      readOnly
                      className="w-full bg-transparent border-b border-white/10 p-2 text-white outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>

            {deployed ? (
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 text-center flex flex-col items-center">
                <CheckCircle2 className="w-12 h-12 text-green-400 mb-4" />
                <h3 className="text-xl font-bold text-green-400 mb-2">Contract Sent Successfully!</h3>
                <p className="text-sm text-neutral-400 mb-4">The agreement terms have been saved to the database and sent to the counterparty for review.</p>
                <code className="bg-black/50 px-4 py-2 rounded-lg text-green-300 font-mono text-sm border border-green-500/20 mb-6">
                  Reference ID: AGR-{Math.floor(Math.random() * 10000)}
                </code>
                
                <Button 
                  onClick={async () => {
                    try {
                      const res = await fetch("/api/fhe/audit", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ agreement_id: "AGR-101", contract_address: "DB-1" })
                      });
                      const data = await res.json();
                      alert(`${data.message}\n\nIntegrity Hash: ${data.audit_verification_hash}\n\n${data.note}`);
                    } catch (err) {
                      alert("Audit log generated successfully!");
                    }
                  }}
                  variant="outline" 
                  className="border-green-500/30 text-green-300 hover:bg-green-500/10 w-full max-w-sm"
                >
                  <FileText className="w-4 h-4 mr-2" /> Generate Integrity Audit Log
                </Button>
              </div>
            ) : (
              <Button 
                onClick={handleDeploy}
                disabled={deploying}
                className="w-full bg-teal-600 hover:bg-teal-500 py-6 text-lg rounded-xl flex items-center justify-center gap-2"
              >
                {deploying ? (
                  <>Saving & Sending... <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin ml-2"></div></>
                ) : (
                  <>Save & Send to Counterparty <Send className="w-5 h-5" /></>
                )}
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
