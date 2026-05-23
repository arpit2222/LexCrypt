"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogOut, Users, Scale, FileText, Activity, Server, Shield } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    // Check if admin is logged in (mock check)
    const role = localStorage.getItem("nyaya_role");
    if (role !== "admin") {
      router.push("/login");
    }

    fetch("http://localhost:8000/api/admin/stats")
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(console.error);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("nyaya_token");
    localStorage.removeItem("nyaya_role");
    localStorage.removeItem("nyaya_name");
    router.push("/login");
  };

  if (!stats) return <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-neutral-900/30 flex flex-col">
        <div className="p-6 flex items-center gap-3 border-b border-white/5">
          <Shield className="w-8 h-8 text-red-400" />
          <span className="font-bold tracking-wide">Nyaya Admin</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link href="#" className="flex items-center gap-3 px-4 py-3 bg-red-600/10 text-red-300 rounded-xl font-medium">
            <Activity className="w-5 h-5" /> Overview
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-3 text-neutral-400 hover:text-white hover:bg-white/5 rounded-xl font-medium">
            <Users className="w-5 h-5" /> User Management
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-3 text-neutral-400 hover:text-white hover:bg-white/5 rounded-xl font-medium">
            <Server className="w-5 h-5" /> AI Engine Logs
          </Link>
        </nav>
        <div className="p-4 border-t border-white/5">
          <Button onClick={handleLogout} variant="ghost" className="w-full justify-start text-neutral-400 hover:text-white hover:bg-white/5">
            <LogOut className="w-5 h-5 mr-3" /> Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <header className="mb-10">
          <h1 className="text-2xl font-bold">Platform Overview</h1>
          <p className="text-neutral-400">Monitor Nyaya AI platform health and user activity.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-neutral-900/50 border border-white/5 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2 text-indigo-400"><Users className="w-5 h-5"/> Citizens</div>
            <p className="text-3xl font-bold">{stats.total_citizens}</p>
          </div>
          <div className="bg-neutral-900/50 border border-white/5 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2 text-blue-400"><Scale className="w-5 h-5"/> Lawyers</div>
            <p className="text-3xl font-bold">{stats.total_lawyers}</p>
          </div>
          <div className="bg-neutral-900/50 border border-white/5 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2 text-yellow-400"><FileText className="w-5 h-5"/> Active Cases</div>
            <p className="text-3xl font-bold">{stats.active_cases}</p>
          </div>
          <div className="bg-neutral-900/50 border border-white/5 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2 text-emerald-400"><Server className="w-5 h-5"/> AI Inferences</div>
            <p className="text-3xl font-bold">{stats.ai_requests}</p>
          </div>
        </div>

        <div className="bg-neutral-900/50 border border-white/5 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-6">Recent Registrations</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-neutral-400 bg-white/5">
                <tr>
                  <th className="px-6 py-4 rounded-tl-xl font-medium">User Email</th>
                  <th className="px-6 py-4 font-medium">Role</th>
                  <th className="px-6 py-4 font-medium">Joined</th>
                  <th className="px-6 py-4 rounded-tr-xl font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {stats.recent_users.map((user: any, i: number) => (
                  <tr key={i} className="hover:bg-white/5">
                    <td className="px-6 py-4 font-medium text-white">{user.email}</td>
                    <td className="px-6 py-4 capitalize text-neutral-300">{user.role}</td>
                    <td className="px-6 py-4 text-neutral-400">{user.joined}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-md text-xs font-bold bg-emerald-500/10 text-emerald-400">Active</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
