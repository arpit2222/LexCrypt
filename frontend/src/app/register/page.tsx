"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Scale, UserPlus, Loader2 } from "lucide-react";

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("citizen");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role })
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.detail || "Registration failed");

      // Redirect to login after successful registration
      router.push("/login");
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
          <Scale className="w-10 h-10 text-indigo-400 mb-4" />
          <h1 className="text-2xl font-bold text-white">Create an Account</h1>
          <p className="text-neutral-400 mt-2 text-sm">Join the Nyaya AI platform</p>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm mb-6 text-center">{error}</div>}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-1">Full Name</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-neutral-800 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-1">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-neutral-800 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50"
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
              className="w-full bg-neutral-800 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-1">Account Type</label>
            <select 
              value={role}
              onChange={e => setRole(e.target.value)}
              className="w-full bg-neutral-800 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500/50"
            >
              <option value="citizen">Citizen (Seeking Legal Help)</option>
              <option value="lawyer">Lawyer / Advocate</option>
              <option value="associate">Paralegal / Associate</option>
            </select>
          </div>
          
          <Button 
            type="submit" 
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-6 mt-4"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><UserPlus className="w-4 h-4 mr-2" /> Sign Up</>}
          </Button>
        </form>

        <p className="text-center text-sm text-neutral-500 mt-6">
          Already have an account? <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
