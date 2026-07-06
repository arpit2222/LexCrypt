"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Scale, Users, FileText, Lock, Activity, ShieldCheck, Database, Plus, Mail, Key, Building2, Coins, Menu, LayoutDashboard } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [firmName, setFirmName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [quota, setQuota] = useState(500);
  const [isUnlimited, setIsUnlimited] = useState(false);
  const [creating, setCreating] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/users")
      ]);
      const statsData = await statsRes.json();
      const usersData = await usersRes.json();
      setStats(statsData);
      setUsers(usersData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          name: "Admin User",
          role: "lawyer",
          firm_name: firmName,
          tokens_remaining: isUnlimited ? 999999 : parseInt(quota.toString())
        })
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.detail || "Failed to create firm");
      }
      alert(`Firm ${firmName} provisioned successfully!`);
      setFirmName("");
      setEmail("");
      setPassword("");
      setQuota(500);
      fetchData(); // Refresh users list
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 flex">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-white/5 bg-neutral-900/95 backdrop-blur-xl flex flex-col transform transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}>
        <div className="p-6 flex items-center gap-3 border-b border-white/5">
          <Link href="/" className="flex items-center gap-3">
            <Scale className="w-8 h-8 text-indigo-400" />
            <span className="font-bold text-xl tracking-wide">Nyaya AI</span>
          </Link>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 bg-indigo-600/10 text-indigo-300 rounded-xl font-medium">
            <LayoutDashboard className="w-5 h-5" /> Network Overview
          </Link>
          <a href="#users" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 px-4 py-3 text-neutral-400 hover:text-white hover:bg-white/5 rounded-xl font-medium transition-colors">
            <Users className="w-5 h-5" /> User Directory
          </a>
          <a href="#provision" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-3 px-4 py-3 text-neutral-400 hover:text-white hover:bg-white/5 rounded-xl font-medium transition-colors">
            <Plus className="w-5 h-5" /> Provision Firm
          </a>
        </nav>
      </aside>

      <main className="flex-1 flex flex-col max-h-screen overflow-y-auto">
        <header className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-neutral-950/80 sticky top-0 z-30 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <button className="md:hidden p-2 -ml-2 text-neutral-400 hover:text-white rounded-lg hover:bg-white/5" onClick={() => setIsSidebarOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold flex items-center gap-2 hidden md:flex"><Scale className="w-6 h-6 text-indigo-400"/> Venture Studio Console</h1>
            <span className="font-bold text-lg md:hidden">Venture Studio</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/lawyer" className="text-xs md:text-sm font-medium text-neutral-400 hover:text-white px-2 md:px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors">Lawyer</Link>
            <Link href="/citizen" className="text-xs md:text-sm font-medium text-neutral-400 hover:text-white px-2 md:px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors">Citizen</Link>
            <Link href="/student" className="text-sm font-medium text-neutral-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors hidden md:block">Student</Link>
          </div>
        </header>

        <div className="max-w-7xl w-full mx-auto p-4 md:p-8">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <div className="bg-gradient-to-br from-indigo-900/40 to-neutral-900/50 border border-indigo-500/20 rounded-2xl p-6 relative overflow-hidden">
                <Users className="absolute -right-4 -bottom-4 w-24 h-24 text-indigo-500/10" />
                <h3 className="text-sm font-medium text-indigo-300 mb-1">Total Citizens</h3>
                <p className="text-4xl font-black">{stats.total_citizens.toLocaleString()}</p>
                <p className="text-xs text-green-400 mt-2 flex items-center">↑ 12% this week</p>
              </div>
              
              <div className="bg-gradient-to-br from-blue-900/40 to-neutral-900/50 border border-blue-500/20 rounded-2xl p-6 relative overflow-hidden">
                <Building2 className="absolute -right-4 -bottom-4 w-24 h-24 text-blue-500/10" />
                <h3 className="text-sm font-medium text-blue-300 mb-1">Partner Law Firms</h3>
                <p className="text-4xl font-black">{users.filter(u => u.role === 'lawyer').length}</p>
                <p className="text-xs text-green-400 mt-2 flex items-center">↑ Enterprise Tier</p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-900/40 to-neutral-900/50 border border-purple-500/20 rounded-2xl p-6 relative overflow-hidden">
                <FileText className="absolute -right-4 -bottom-4 w-24 h-24 text-purple-500/10" />
                <h3 className="text-sm font-medium text-purple-300 mb-1">Active Cases</h3>
                <p className="text-4xl font-black">{stats.active_cases}</p>
                <p className="text-xs text-neutral-400 mt-2">Assigned & In Progress</p>
              </div>

              <div className="bg-gradient-to-br from-emerald-900/40 to-neutral-900/50 border border-emerald-500/20 rounded-2xl p-6 relative overflow-hidden">
                <Activity className="absolute -right-4 -bottom-4 w-24 h-24 text-emerald-500/10" />
                <h3 className="text-sm font-medium text-emerald-300 mb-1">AI Tokens Processed</h3>
                <p className="text-4xl font-black">{(stats.ai_requests / 1000).toFixed(1)}k</p>
                <p className="text-xs text-emerald-400 mt-2">Azure OpenAI GPT-5.4</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Organization Management */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* Firm Provisioning Form */}
                <div className="bg-neutral-900/50 border border-white/10 rounded-2xl p-8">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold flex items-center gap-2"><Plus className="w-5 h-5 text-indigo-400" /> Provision New Firm</h3>
                  </div>
                  
                  <form onSubmit={handleCreateFirm} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-neutral-400 mb-1">Firm Name</label>
                      <div className="relative">
                        <Building2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                        <input type="text" required value={firmName} onChange={e=>setFirmName(e.target.value)} className="w-full bg-neutral-800 border border-white/10 rounded-lg py-2 pl-9 pr-3 text-sm focus:outline-none focus:border-indigo-500" placeholder="e.g. Khaitan & Co" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-neutral-400 mb-1">AI Quota (Tokens)</label>
                      <div className="flex gap-4 items-center">
                        <div className="relative flex-1">
                          <Coins className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                          <input type="number" required={!isUnlimited} disabled={isUnlimited} value={isUnlimited ? '' : quota} onChange={e=>setQuota(parseInt(e.target.value))} className="w-full bg-neutral-800 border border-white/10 rounded-lg py-2 pl-9 pr-3 text-sm focus:outline-none focus:border-indigo-500 disabled:opacity-50" placeholder={isUnlimited ? "∞" : "500"} />
                        </div>
                        <label className="flex items-center gap-2 text-sm text-neutral-300 whitespace-nowrap cursor-pointer">
                          <input type="checkbox" checked={isUnlimited} onChange={e=>setIsUnlimited(e.target.checked)} className="rounded border-white/10 bg-neutral-800" />
                          Unlimited
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-neutral-400 mb-1">Company Email</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                        <input type="email" required value={email} onChange={e=>setEmail(e.target.value)} className="w-full bg-neutral-800 border border-white/10 rounded-lg py-2 pl-9 pr-3 text-sm focus:outline-none focus:border-indigo-500" placeholder="admin@khaitan.com" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-neutral-400 mb-1">Password</label>
                      <div className="relative">
                        <Key className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                        <input type="password" required value={password} onChange={e=>setPassword(e.target.value)} className="w-full bg-neutral-800 border border-white/10 rounded-lg py-2 pl-9 pr-3 text-sm focus:outline-none focus:border-indigo-500" placeholder="••••••••" />
                      </div>
                    </div>
                    <div className="md:col-span-2 mt-2">
                      <Button type="submit" disabled={creating} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white">
                        {creating ? "Provisioning..." : "Create Firm Credential"}
                      </Button>
                    </div>
                  </form>
                </div>

                {/* User Directory */}
                <div className="bg-neutral-900/50 border border-white/10 rounded-2xl overflow-hidden">
                  <div className="p-6 border-b border-white/5">
                     <h3 className="text-xl font-bold flex items-center gap-2"><Database className="w-5 h-5 text-indigo-400" /> Registered Organizations</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-neutral-800/50 text-neutral-400">
                        <tr>
                          <th className="px-6 py-3 font-medium">Firm / Name</th>
                          <th className="px-6 py-3 font-medium">Email</th>
                          <th className="px-6 py-3 font-medium">Role</th>
                          <th className="px-6 py-3 font-medium text-right">Quota Remaining</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {users.map((u, i) => (
                          <tr key={i} className="hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4 font-medium">{u.firm_name || u.name}</td>
                            <td className="px-6 py-4 text-neutral-400">{u.email}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded text-xs font-semibold uppercase ${
                                u.role === 'admin' ? 'bg-red-500/20 text-red-400' :
                                u.role === 'lawyer' ? 'bg-purple-500/20 text-purple-400' :
                                'bg-indigo-500/20 text-indigo-400'
                              }`}>
                                {u.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="inline-flex items-center gap-2">
                                <span className="font-mono text-white">{(u.tokens_remaining ?? 0) >= 900000 ? '∞' : u.tokens_remaining}</span>
                                <Coins className="w-4 h-4 text-emerald-400" />
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>

              {/* Right Column: Live Feed */}
              <div className="bg-neutral-900/50 border border-white/10 rounded-2xl p-6 flex flex-col h-fit sticky top-24">
                <h3 className="text-lg font-bold flex items-center gap-2 mb-6"><Activity className="w-5 h-5 text-indigo-400" /> Recent Network Activity</h3>
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
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
