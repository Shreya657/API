import { Button } from "@/components/ui/button";
import Link from "next/link";
import Navbar from "./components/navbar";

export default function Home() {

  return (
    <div className="min-h-screen bg-black text-white ">
      <Navbar/>
      <main className="container mx-auto px-4 pt-12 text-center">
        <div className="inline-block select-none rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-gray-400 mb-6">
          Now in Private Beta
        </div>
        <h1 className="mb-6 text-6xl select-none font-extrabold tracking-tight lg:text-7xl">
          Metadata extraction <br />
          <span className="bg-gradient-to-r select-none from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            for modern developers.
          </span>
        </h1>
        <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-400 select-none ">
          Fast, rate-limited, and cached. Get social graph data and URL metadata 
          with a single API call. Built for scale.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/dashboard">
            <Button size="lg" className="h-12 px-8  text-lg bg-white text-black hover:bg-gray-200">
              Start Building Free
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="h-12 px-8 text-lg border-white/10 hover:bg-white/5 text-black hover:bg-gray-200">
            Documentation
          </Button>
        </div>
      </main>
    </div>
  );
}