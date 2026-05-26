"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Scale, Users, FileText, Lock, Activity, ShieldCheck, Database } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
    
    // Simulate real-time updates
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 flex flex-col">
      <header className="flex items-center px-6 py-4 border-b border-white/5 bg-neutral-950/80 sticky top-0 z-50">
        <Link href="/">
          <Button variant="ghost" size="icon" className="mr-4 hover:bg-white/10 rounded-full">
            <ChevronLeft className="w-5 h-5 text-neutral-400" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold flex items-center gap-2"><Scale className="w-6 h-6 text-indigo-400"/> Supreme Court Command Center</h1>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-8">
        <div className="mb-12 flex justify-between items-end">
          <div>
            <h2 className="text-4xl font-bold mb-2">Network Overview</h2>
            <p className="text-neutral-400">Real-time macro analytics for the Nyaya AI Ecosystem.</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Live
          </div>
        </div>

        {loading || !stats ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-neutral-900/50 rounded-2xl border border-white/5"></div>
            ))}
          </div>
        ) : (
          <>
            {/* Top Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-indigo-900/40 to-neutral-900/50 border border-indigo-500/20 rounded-2xl p-6 relative overflow-hidden">
                <Users className="absolute -right-4 -bottom-4 w-24 h-24 text-indigo-500/10" />
                <h3 className="text-sm font-medium text-indigo-300 mb-1">Total Citizens</h3>
                <p className="text-4xl font-black">{stats.total_citizens.toLocaleString()}</p>
                <p className="text-xs text-green-400 mt-2 flex items-center">↑ 12% this week</p>
              </div>
              
              <div className="bg-gradient-to-br from-blue-900/40 to-neutral-900/50 border border-blue-500/20 rounded-2xl p-6 relative overflow-hidden">
                <ShieldCheck className="absolute -right-4 -bottom-4 w-24 h-24 text-blue-500/10" />
                <h3 className="text-sm font-medium text-blue-300 mb-1">Registered Lawyers</h3>
                <p className="text-4xl font-black">{stats.total_lawyers}</p>
                <p className="text-xs text-green-400 mt-2 flex items-center">↑ 3 pending verification</p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-900/40 to-neutral-900/50 border border-purple-500/20 rounded-2xl p-6 relative overflow-hidden">
                <FileText className="absolute -right-4 -bottom-4 w-24 h-24 text-purple-500/10" />
                <h3 className="text-sm font-medium text-purple-300 mb-1">Active Cases</h3>
                <p className="text-4xl font-black">{stats.active_cases}</p>
                <p className="text-xs text-neutral-400 mt-2">Assigned & In Progress</p>
              </div>

              <div className="bg-gradient-to-br from-emerald-900/40 to-neutral-900/50 border border-emerald-500/20 rounded-2xl p-6 relative overflow-hidden">
                <Lock className="absolute -right-4 -bottom-4 w-24 h-24 text-emerald-500/10" />
                <h3 className="text-sm font-medium text-emerald-300 mb-1">Escrow TVL (ETH)</h3>
                <p className="text-4xl font-black">{stats.tvl_eth} Ξ</p>
                <p className="text-xs text-emerald-400 mt-2">Locked in Smart Contracts</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: AI & Security Stats */}
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-neutral-900/50 border border-white/10 rounded-2xl p-8">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold flex items-center gap-2"><Activity className="w-5 h-5 text-indigo-400" /> Infrastructure Usage</h3>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-neutral-400">Azure AI Tokens Processed</span>
                        <span className="font-mono">{stats.ai_requests.toLocaleString()}</span>
                      </div>
                      <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 w-[78%] rounded-full"></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-neutral-400">Fhenix FHE Encryptions</span>
                        <span className="font-mono">{stats.fhe_encryptions.toLocaleString()}</span>
                      </div>
                      <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 w-[42%] rounded-full"></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-neutral-400">Arbitrum Transactions (Settlements)</span>
                        <span className="font-mono">{(stats.active_cases * 2).toLocaleString()}</span>
                      </div>
                      <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 w-[60%] rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Live Feed */}
              <div className="bg-neutral-900/50 border border-white/10 rounded-2xl p-6 flex flex-col">
                <h3 className="text-lg font-bold flex items-center gap-2 mb-6"><Database className="w-5 h-5 text-indigo-400" /> Recent Network Activity</h3>
                <div className="space-y-4 flex-1">
                  {stats.recent_users.map((u: any, i: number) => (
                    <div key={i} className="flex gap-4 items-start p-3 rounded-xl hover:bg-white/5 transition-colors">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        u.role === 'citizen' ? 'bg-indigo-500/20 text-indigo-400' :
                        u.role === 'lawyer' ? 'bg-purple-500/20 text-purple-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {u.role.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{u.email}</p>
                        <p className="text-xs text-neutral-500">Joined {u.joined} as {u.role}</p>
                      </div>
                    </div>
                  ))}
                  <div className="flex gap-4 items-start p-3 rounded-xl hover:bg-white/5 transition-colors">
                     <div className="w-8 h-8 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center shrink-0"><Lock className="w-4 h-4"/></div>
                     <div>
                        <p className="text-sm font-medium">Escrow Locked</p>
                        <p className="text-xs text-neutral-500">0.01 ETH locked for Case #902</p>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
