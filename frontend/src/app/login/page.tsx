"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Scale, LogIn, Loader2 } from "lucide-react";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.detail || "Login failed");

      // Save token and route based on role
      localStorage.setItem("nyaya_token", data.access_token);
      localStorage.setItem("nyaya_role", data.role);
      localStorage.setItem("nyaya_name", data.name);
      localStorage.setItem("nyaya_email", email);

      switch(data.role) {
        case "citizen": router.push("/citizen"); break;
        case "lawyer": router.push("/lawyer"); break;
        case "associate": router.push("/associate"); break;
        case "admin": router.push("/admin"); break;
        default: router.push("/");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-neutral-900/50 border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
        <div className="flex flex-col items-center mb-8">
          <Scale className="w-10 h-10 text-teal-400 mb-4" />
          <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
          <p className="text-neutral-400 mt-2 text-sm">Sign in to your Nyaya AI account</p>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm mb-6 text-center">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-1">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-neutral-800 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500/50"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-1">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-neutral-800 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500/50"
              placeholder="••••••••"
            />
          </div>
          
          <Button 
            type="submit" 
            disabled={loading}
            className="w-full bg-teal-600 hover:bg-teal-500 text-white py-6 mt-4"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><LogIn className="w-4 h-4 mr-2" /> Sign In</>}
          </Button>
        </form>

        <p className="text-center text-sm text-neutral-500 mt-6">
          Don't have an account? <Link href="/register" className="text-teal-400 hover:text-teal-300 font-medium">Create one</Link>
        </p>
      </div>
    </div>
  );
}
