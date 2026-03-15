"use client";

import { useState, Suspense } from "react"; // added Suspense
import { completeOnboarding } from "@/app/actions/user";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation"; 

//  all the logic into a sub-component
function OnboardingForm() {
  const searchParams = useSearchParams();
  const isEditing = searchParams.get("edit") === "true";
  const currentUsername = searchParams.get("current") || "";

  const [username, setUsername] = useState(currentUsername);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username === currentUsername && isEditing) {
      window.location.href = "/dashboard";
      return;
    }
    
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
    <Card className="w-full max-w-md border-white/10 bg-zinc-950 text-white shadow-2xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          {isEditing ? "Update Username" : "Welcome to ScrapIt"}
        </CardTitle>
        <CardDescription className="text-zinc-400">
          {isEditing ? "Changing your handle will update your profile." : "Choose a unique username to get started."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
             <label className="text-xs uppercase tracking-widest text-zinc-500 font-bold">New Username</label>
             <Input
              placeholder="e.g. jason_dev"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, ""))}
              className="bg-zinc-900 border-zinc-800 focus:ring-blue-500 text-white"
              required
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex gap-3">
             {isEditing && (
               <Button 
                 type="button" 
                 variant="outline" 
                 onClick={() => window.location.href = "/dashboard"} 
                 className="flex-1 bg-transparent border-zinc-800 text-zinc-400 hover:bg-zinc-900"
               >
                 Cancel
               </Button>
             )}
             <Button className="flex-[2] bg-blue-600 hover:bg-blue-700 transition-colors font-bold" disabled={loading}>
               {loading ? "Updating..." : isEditing ? "Save Changes" : "Start Building"}
             </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

//the main export just wraps the form in Suspense
export default function Onboarding() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4 font-sans">
      <Suspense fallback={
        <div className="text-white font-mono animate-pulse">Loading setup...</div>
      }>
        <OnboardingForm />
      </Suspense>
    </div>
  );
}