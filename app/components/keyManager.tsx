"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Copy, Check, AlertTriangle } from "lucide-react";
import { createApiKey } from "../actions/key";

export default function KeyManager() {
  const [name, setName] = useState("");
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCreate = async () => {
    const { rawKey } = await createApiKey(name);
    setGeneratedKey(rawKey);
  };

  const copyToClipboard = () => {
    if (generatedKey) {
      navigator.clipboard.writeText(generatedKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Dialog onOpenChange={(open) => !open && setGeneratedKey(null)}>
      <DialogTrigger asChild>
        <Button variant="default" className="bg-blue-600 hover:bg-blue-700 text-white">
  Generate New Key
</Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-950 border-zinc-800 text-white">
        <DialogHeader>
          <DialogTitle>{generatedKey ? "Save your key" : "Create API Key"}</DialogTitle>
        </DialogHeader>

        {!generatedKey ? (
          <div className="space-y-4">
            <Input 
              placeholder="Key Name (e.g. Production)" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-zinc-900 border-zinc-800"
            />
            <Button onClick={handleCreate} className="w-full">Create Key</Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-md text-amber-500 text-sm">
              <AlertTriangle className="h-4 w-4" />
              <p>For security, we can only show this key once.</p>
            </div>
            
            <div className="flex items-center gap-2 p-3 bg-zinc-900 rounded-md border border-zinc-800">
              <code className="flex-1 font-mono text-sm break-all">{generatedKey}</code>
              <Button size="icon" variant="ghost" onClick={copyToClipboard}>
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}