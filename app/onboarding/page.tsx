"use client";

import { useState } from "react";
import { completeOnboarding } from "@/app/actions/user";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Onboarding() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await completeOnboarding(username);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <Card className="w-full max-w-md border-white/10 bg-zinc-950 text-white shadow-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Welcome to LinkAura</CardTitle>
          <CardDescription className="text-zinc-400">Choose a unique username to get started.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="e.g. jason_dev"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, ""))}
              className="bg-zinc-900 border-zinc-800 focus:ring-blue-500"
              required
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button className="w-full bg-blue-600 hover:bg-blue-700 transition-colors" disabled={loading}>
              {loading ? "Finalizing..." : "Start Building"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}