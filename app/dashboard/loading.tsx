export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-6">
      <div className="relative h-24 w-24">
        {/* nucleus */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-blue-500 shadow-[0_0_15px_#3b82f6] z-10" />

        {/* orbit 1 + electron */}
        <div className="absolute inset-0 border-2 border-dashed border-zinc-800 rounded-full animate-orbit-1">
           <div className="h-2 w-2 rounded-full bg-blue-400 electron-1-pos" />
        </div>

        {/* orbit 2 + electron */}
        <div className="absolute inset-0 border-2 border-dashed border-zinc-800 rounded-full animate-orbit-2">
           <div className="h-2 w-2 rounded-full bg-blue-400 electron-2-pos" />
        </div>

        {/* orbit 3 + electron */}
        <div className="absolute inset-0 border-2 border-dashed border-zinc-800 rounded-full animate-orbit-3">
           <div className="h-2 w-2 rounded-full bg-blue-400 electron-3-pos" />
        </div>
      </div>

      <div className="text-center space-y-1">
        <h2 className="text-sm font-bold tracking-widest uppercase text-zinc-600 animate-pulse">
          Initialising Console
        </h2>
        <p className="text-xs text-zinc-700 font-mono">
          Connecting to ScrapIt Engine...
        </p>
      </div>
    </div>
  );
}