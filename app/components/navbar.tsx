"use client"; 

import Link from "next/link";
import { useUser, UserButton, SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const { isSignedIn, isLoaded } = useUser();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold tracking-tighter text-white">
          scrap<span className="text-blue-500"> It</span>
        </Link>
        
        <div className="flex items-center gap-4">
          {!isLoaded ? (
            <div className="h-9 w-20 animate-pulse rounded-md bg-white/5" />
          ) : !isSignedIn ? (
            <>
              <SignInButton mode="modal">
                <Button variant="ghost" className="text-white hover:bg-white/10">
                  Sign In
                </Button>
              </SignInButton>
              <SignInButton mode="modal">
                <Button className="bg-white text-black hover:bg-gray-200">
                  Get Started
                </Button>
              </SignInButton>
            </>
          ) : (
            <>
              <Link href="/dashboard">
                <Button variant="ghost" className="text-white bg-white/10 ">
                  Dashboard
                </Button>
              </Link>
              <UserButton appearance={{ elements: { avatarBox: "h-9 w-9" } }} />
            </>
          )}
        </div>
      </div>
    </nav>
  );
}