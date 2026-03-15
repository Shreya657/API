"use client";

import { useState } from "react";
import axios from "axios";

export default function TestFetch() {
  const [res, setRes] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testApi = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("https://api-ten-sepia-10.vercel.app/actions/extract", {
        params: { url: "https://github.com" },
        headers: { 
          "x-api-key": "la_5b45d5798fe8a86e436a8b275d1fb8b7645731e76cc6c6d9" // Put your key here
        }
      });
      console.log(data);
      setRes(data);
    } catch (err: any) {
        console.log(err);
      setRes({ error: err.response?.data || err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 bg-zinc-950 min-h-screen text-white font-mono">
      <button 
        onClick={testApi}
        disabled={loading}
        className="bg-blue-600 px-6 py-2 rounded-lg font-bold hover:bg-blue-500 disabled:opacity-50"
      >
        {loading ? "Fetching..." : "Test ScrapIt API"}
      </button>

      {res && (
        <pre className="mt-10 p-4 bg-zinc-900 border border-zinc-800 rounded text-xs overflow-auto">
          {JSON.stringify(res, null, 2)}
        </pre>
      )}
    </div>
  );
}