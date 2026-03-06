import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Trash2, Key, Calendar,  Activity, Zap, ArrowLeft, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { prisma } from "@/utils/prisma";
import KeyManager from "../components/keyManager";
import DeleteKeyButton from "../components/deleteKeyButton";
import Link from "next/link";
import UsageChart from "../components/usageChart";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { apiKeys: { orderBy: { createdAt: 'desc' } } },
  });

  if (!user?.username) redirect("/onboarding");

const totalRequests = await prisma.usageLog.count({
  where: {
    apiKey: {
      userId: userId
    }
  }
});

//for stats and data
const recentLogs = await prisma.usageLog.findMany({
  where: {
    apiKey: {
      userId: userId
    }
  },
  orderBy: { timestamp: 'desc' },
  take: 5,
  include: { apiKey: true }
});

//for chart data - the last 7 days of usage
const sevenDaysAgo = new Date();
sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

const chartDataRaw = await prisma.usageLog.findMany({
  where: {
    apiKey: { userId: userId },
    timestamp: { gte: sevenDaysAgo }
  },
  select: { timestamp: true }
});


const chartData = Array.from({ length: 7 }).map((_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (6 - i));
  const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  
  const count = chartDataRaw.filter(log => 
    new Date(log.timestamp).toDateString() === d.toDateString()
  ).length;

  return { date: dateStr, count };
});

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* header */}
        <div className="flex justify-between items-end border-b border-zinc-800 pb-8">
          <div className="space-y-2">
            <Link href="/" className="text-sm text-zinc-500 flex items-center hover:text-blue-400 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-1" /> back
            </Link>
            <div className="flex items-center gap-2">
               <span className="text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Member: {user.username}
               </span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight">Console</h1>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" asChild className="border-zinc-800 bg-zinc-500/50 hover:bg-zinc-800 hover:text-white text-zinc-300">
              <Link href="/docs">
                <Terminal className="h-4 w-4 mr-2" /> Quick Start
              </Link>
            </Button>
            <KeyManager />
          </div>
        </div>

        <UsageChart data={chartData} />


        <div className="max-w-5xl mx-auto space-y-10">

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-md">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-zinc-500 text-sm font-medium uppercase">Total Extractions</p>
          <h2 className="text-4xl font-bold mt-2 text-white">{totalRequests}</h2>
        </div>
        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
          <Activity className="h-5 w-5" />
        </div>
      </div>
      <p className="text-zinc-500 text-xs mt-4">Across all active API keys</p>
    </div>

    <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-md">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-zinc-500 text-sm font-medium uppercase">Active Keys</p>
          <h2 className="text-4xl font-bold mt-2 text-white">{user.apiKeys.length}</h2>
        </div>
        <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
          <Key className="h-5 w-5" />
        </div>
      </div>
      <p className="text-zinc-500 text-xs mt-4">Manage your developer credentials</p>
    </div>
  </div>


  {/* 2. tables */}

        {user.apiKeys.length > 0 ? (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 backdrop-blur-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="border-b border-zinc-800 bg-zinc-900/50 text-zinc-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-semibold">Name</th>
                  <th className="px-6 py-4 font-semibold">Key Hash</th>
                  <th className="px-6 py-4 font-semibold">Created</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {user.apiKeys.map((key) => (
                  <tr key={key.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                          <Key className="h-4 w-4" />
                        </div>
                        <span className="font-medium text-zinc-200">{key.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-zinc-500">
                      {key.keyHash.substring(0, 16)}...
                    </td>
                    

                    <td className="px-6 py-4 text-sm text-zinc-500">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(key.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DeleteKeyButton keyId={key.id}/>
                     
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-zinc-800 rounded-3xl bg-zinc-900/10">
            <div className="p-4 rounded-full bg-zinc-900 mb-4">
              <Key className="h-10 w-10 text-zinc-600" />
            </div>
            <h3 className="text-xl font-semibold">No API Keys</h3>
            <p className="text-zinc-500 mt-2 max-w-sm text-center">
              You haven't generated any keys yet. Create your first key to start using the LinkAura scraper API.
            </p>
            <div className="mt-6">
               <KeyManager />
            </div>
          </div>
        )}
      </div>

{/* 3. recent activity */}
      {recentLogs.length > 0 && (
    <section className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/20 overflow-hidden">
        {recentLogs.map((log) => (
          <div key={log.id} className="flex items-center justify-between p-4 border-b border-zinc-800 last:border-0 hover:bg-white/[0.01]">
            <div className="flex items-center gap-4">
              <div className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" />
              <div>
                <p className="text-sm font-medium text-zinc-200">Successful Extraction</p>
                <p className="text-xs text-zinc-500">Using key: {log.apiKey.name}</p>
              </div>
            </div>
          <p className="text-xs text-zinc-500">
  {new Date(log.timestamp).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })}
</p>
          </div>
        ))}
      </div>
    </section>
  )}
</div>
    </div>
  );
}