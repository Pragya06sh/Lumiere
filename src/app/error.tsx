"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Sparkles, RefreshCw, Home } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[75vh] flex items-center justify-center bg-[#FAF6F0] p-6 text-center text-[#3A2A22]">
      <div className="bg-white border border-[#B8893C]/25 p-8 md:p-12 rounded-3xl max-w-lg space-y-6 shadow-sm">
        <div className="w-14 h-14 bg-[#FFF8EE] border border-[#E8A33D]/40 rounded-full flex items-center justify-center mx-auto text-[#E8A33D] shadow-xs">
          <Sparkles className="w-7 h-7" />
        </div>

        <div>
          <span className="text-xs text-[#B8893C] uppercase tracking-wider block mb-1">
            Unexpected Encounter
          </span>
          <h1 className="text-2xl sm:text-3xl font-display text-[#3A2A22] font-medium">
            Something went awry
          </h1>
          <p className="text-xs sm:text-sm text-[#6B5548] mt-2">
            We encountered a temporary hiccup loading this page. Please try refreshing or return to the main sanctuary.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <button
            onClick={() => reset()}
            className="btn-primary text-xs py-2.5 px-6 shadow-xs flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
          <Link
            href="/"
            className="btn-outline text-xs py-2.5 px-6 bg-white flex items-center justify-center gap-1.5"
          >
            <Home className="w-3.5 h-3.5 text-[#B8893C]" />
            <span>Return Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
