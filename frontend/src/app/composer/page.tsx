"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Lock, Eye, FileText, Send, CheckCircle2 } from 'lucide-react';
import { ConnectButton } from "@rainbow-me/rainbowkit";

type ContractTerm = {
  fieldName: string;
  value: string;
  encrypted: boolean;
  type: string;
};

export default function ContractComposer() {
  const [activeTemplate, setActiveTemplate] = useState('MergersAcquisition');
  const [counterparty, setCounterparty] = useState('');
  const [deploying, setDeploying] = useState(false);
  const [deployed, setDeployed] = useState(false);

  // Hardcoded templates from Wave 4 Requirements
  const templates: Record<string, ContractTerm[]> = {
    MergersAcquisition: [
      { fieldName: 'Purchase Price (USD)', value: '50000000', encrypted: true, type: 'euint32' },
      { fieldName: 'Earnout Threshold (EBITDA)', value: '20000000', encrypted: true, type: 'euint32' },
      { fieldName: 'Closing Date (Unix Timestamp)', value: '1735689600', encrypted: false, type: 'uint32' },
    ],
    SoftwareEscrow: [
      { fieldName: 'Release Condition Threshold', value: '100', encrypted: true, type: 'euint32' },
      { fieldName: 'Penalty if Unreleased', value: '50000', encrypted: true, type: 'euint32' },
      { fieldName: 'Term Length (Months)', value: '24', encrypted: false, type: 'uint32' }
    ],
    GovernmentRFP: [
      { fieldName: 'Sealed Bid Amount', value: '1500000', encrypted: true, type: 'euint32' },
      { fieldName: 'Completion Deadline', value: '1735689600', encrypted: false, type: 'uint32' }
    ]
  };

  const [clauses, setClauses] = useState<ContractTerm[]>(templates['MergersAcquisition']);

  const handleTemplateChange = (templateKey: string) => {
    setActiveTemplate(templateKey);
    setClauses(templates[templateKey]);
    setDeployed(false);
  };

  const toggleEncryption = (index: number) => {
    const newClauses = [...clauses];
    newClauses[index].encrypted = !newClauses[index].encrypted;
    setClauses(newClauses);
  };

  const handleDeploy = async () => {
    if (!counterparty) {
      alert("Please enter a counterparty wallet address.");
      return;
    }
    
    setDeploying(true);
    
    // Simulate Fhenix FHE Encryption & Smart Contract Deployment
    setTimeout(() => {
      console.log("[FHE] Encrypting terms using Fhenix CoFHE...");
      console.log("[WEB3] Deploying LegalContractFHE.sol to Base Sepolia...");
      setDeploying(false);
      setDeployed(true);
    }, 3000);
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
            <Lock className="w-6 h-6 text-indigo-400" />
            <span className="text-lg font-bold">Confidential Contract Composer</span>
          </div>
        </div>
        <ConnectButton />
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Templates */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-neutral-900/50 border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><FileText className="w-5 h-5 text-indigo-400"/> Templates</h2>
            <div className="space-y-3">
              <Button 
                onClick={() => handleTemplateChange('MergersAcquisition')}
                variant={activeTemplate === 'MergersAcquisition' ? 'default' : 'outline'}
                className={`w-full justify-start ${activeTemplate === 'MergersAcquisition' ? 'bg-indigo-600' : 'border-white/10 hover:bg-white/5'}`}
              >
                Mergers & Acquisitions (Earnout)
              </Button>
              <Button 
                onClick={() => handleTemplateChange('SoftwareEscrow')}
                variant={activeTemplate === 'SoftwareEscrow' ? 'default' : 'outline'}
                className={`w-full justify-start ${activeTemplate === 'SoftwareEscrow' ? 'bg-indigo-600' : 'border-white/10 hover:bg-white/5'}`}
              >
                Software Escrow Agreement
              </Button>
              <Button 
                onClick={() => handleTemplateChange('GovernmentRFP')}
                variant={activeTemplate === 'GovernmentRFP' ? 'default' : 'outline'}
                className={`w-full justify-start ${activeTemplate === 'GovernmentRFP' ? 'bg-indigo-600' : 'border-white/10 hover:bg-white/5'}`}
              >
                Sealed-Bid Gov Procurement
              </Button>
            </div>
            
            <div className="mt-8 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
              <h3 className="text-sm font-semibold text-indigo-300 mb-2">FHE Privacy Model</h3>
              <p className="text-xs text-neutral-400">
                Variables marked as <Lock className="inline w-3 h-3 mx-1"/> Encrypted are stored as <code className="text-indigo-300">euint32</code> on-chain. The smart contract logic executes mathematically on the ciphertext without ever decrypting it.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Composer */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-neutral-900/50 border border-white/10 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6">Agreement Terms</h2>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-neutral-400 mb-2">Counterparty Wallet Address (Party B)</label>
              <input 
                value={counterparty} 
                onChange={(e) => setCounterparty(e.target.value)}
                placeholder="0x..."
                className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-indigo-500/50"
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
                  
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-neutral-500 bg-white/5 px-2 py-1 rounded">{clause.type}</span>
                    <Button 
                      variant="outline" 
                      onClick={() => toggleEncryption(idx)}
                      className={`min-w-[140px] border ${clause.encrypted ? 'border-green-500/30 text-green-400 hover:bg-green-500/10' : 'border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10'}`}
                    >
                      {clause.encrypted ? <><Lock className="w-4 h-4 mr-2" /> Encrypted</> : <><Eye className="w-4 h-4 mr-2" /> Public</>}
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {deployed ? (
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 text-center">
                <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-green-400 mb-2">Contract Deployed Successfully!</h3>
                <p className="text-sm text-neutral-400 mb-4">The agreement terms have been FHE-encrypted and deployed to Base Sepolia.</p>
                <code className="bg-black/50 px-4 py-2 rounded-lg text-green-300 font-mono text-sm border border-green-500/20">
                  Contract Address: 0x8f2A...3b9C
                </code>
              </div>
            ) : (
              <Button 
                onClick={handleDeploy}
                disabled={deploying}
                className="w-full bg-indigo-600 hover:bg-indigo-500 py-6 text-lg rounded-xl flex items-center justify-center gap-2"
              >
                {deploying ? (
                  <>Encrypting & Deploying... <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin ml-2"></div></>
                ) : (
                  <>Sign & Deploy to Base Sepolia <Send className="w-5 h-5" /></>
                )}
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
