import Link from "next/link";
import { Sparkles, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center bg-[#FAF6F0] p-6 text-center">
      <div className="bg-white border border-[#B8893C]/25 p-8 md:p-12 rounded-3xl max-w-lg space-y-6 shadow-sm">
        <div className="w-14 h-14 bg-[#FFF8EE] border border-[#E8A33D]/40 rounded-full flex items-center justify-center mx-auto text-[#E8A33D] shadow-xs">
          <Sparkles className="w-7 h-7" />
        </div>

        <div>
          <span className="text-xs text-[#B8893C] uppercase tracking-wider block mb-1">
            Page Not Found • 404
          </span>
          <h1 className="text-3xl sm:text-4xl font-display text-[#3A2A22] font-medium">
            A Wandering Flame
          </h1>
          <p className="text-sm text-[#6B5548] mt-2">
            The festive page or candle edition you are searching for may have been moved or is resting in our workshop.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link href="/" className="btn-primary text-xs py-3 px-6 shadow-xs flex items-center justify-center gap-1.5">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return home</span>
          </Link>
          <Link href="/shop" className="btn-outline text-xs py-3 px-6 bg-white">
            <span>Explore all candles</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
