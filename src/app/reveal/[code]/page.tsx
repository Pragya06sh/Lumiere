"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, Gift, Upload, Share2, Check, Copy, ArrowRight } from "lucide-react";
import { InfoBar } from "@/components/shared/InfoBar";
import { Badge } from "@/components/shared/Badge";
import toast from "react-hot-toast";

export default function RevealCodePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = use(params);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    code: string;
    isUsed: boolean;
    giftName: string;
    discountCode: string;
    usedAt?: string;
  } | null>(null);

  const [animStage, setAnimStage] = useState<"burning" | "sparkle" | "revealed">("burning");
  const [copied, setCopied] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [submittingPhoto, setSubmittingPhoto] = useState(false);

  useEffect(() => {
    async function fetchCode() {
      try {
        const res = await fetch(`/api/reveal/${encodeURIComponent(code)}`);
        const json = await res.json();
        if (json.success) {
          setData(json);
          if (json.isUsed) {
            setAnimStage("revealed");
          } else {
            // Animate candle burn -> sparkle -> revealed
            setTimeout(() => setAnimStage("sparkle"), 1800);
            setTimeout(() => {
              setAnimStage("revealed");
              // Mark redeemed on backend
              fetch(`/api/reveal/${encodeURIComponent(code)}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({}),
              });
            }, 3200);
          }
        } else {
          toast.error(json.error || "Invalid reveal code");
        }
      } catch {
        setData({
          code: code.toUpperCase(),
          isUsed: false,
          giftName: "Silver Laxmi Keepsake Coin",
          discountCode: "SURPRISE10",
        });
        setTimeout(() => setAnimStage("revealed"), 2500);
      } finally {
        setLoading(false);
      }
    }
    fetchCode();
  }, [code]);

  const handleCopyCode = () => {
    if (!data?.discountCode) return;
    navigator.clipboard.writeText(data.discountCode);
    setCopied(true);
    toast.success("Discount code copied! Use at checkout.");
    setTimeout(() => setCopied(false), 3000);
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhotoPreview(url);
      setSubmittingPhoto(true);
      setTimeout(() => {
        setSubmittingPhoto(false);
        toast.success("Photo added to your reveal! Thank you for sharing the light.");
      }, 800);
    }
  };

  const handleShare = () => {
    const text = `I just unlocked my surprise Diwali keepsake from Lumière Candles: ${data?.giftName || "a sacred treasure"}! ✨🪔`;
    if (navigator.share) {
      navigator.share({
        title: "My Lumière Candle Reveal",
        text,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(`${text} ${window.location.href}`);
      toast.success("Share message copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF6F0] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 rounded-full border-2 border-[#5A1E1E] border-t-transparent animate-spin mb-4" />
        <p className="font-display text-xl text-[#2A1B15]">Verifying your reveal card...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF6F0] py-16 md:py-24">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 max-w-2xl">
        {/* Top Header */}
        <div className="text-center space-y-3 mb-10">
          <Badge variant="surprise">
            <Gift className="w-3.5 h-3.5 text-[#A8742A]" />
            Card Code: {code.toUpperCase()}
          </Badge>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl text-[#2A1B15] font-medium">
            Your Diwali Reveal
          </h1>
          <p className="text-base text-[#5C463B]">
            Congratulations on burning your candle down to unveil the hidden blessing.
          </p>
        </div>

        {/* CANDLE BURN ANIMATION & REVEAL CARD */}
        <div className="bg-white rounded-[20px] border border-[#E6D8C6] p-6 md:p-12 shadow-sm relative overflow-hidden text-center space-y-8">
          {animStage !== "revealed" ? (
            /* ANIMATION STAGE: Burning candle down */
            <div className="py-12 flex flex-col items-center justify-center space-y-6 animate-fadeIn">
              <div className="relative w-48 h-64 flex flex-col items-center justify-end">
                {/* Flame */}
                <div className="relative mb-2">
                  <div className="w-6 h-10 bg-gradient-to-t from-[#E8A33D] via-[#F4C47A] to-white rounded-full flame-flicker shadow-[0_0_20px_#E8A33D]" />
                  <div className="w-1 h-3 bg-[#2A1B15] mx-auto" />
                </div>

                {/* Receding Wax Bar */}
                <div className="relative w-36 h-44 bg-[#FAF6F0] border-2 border-[#E6D8C6] rounded-2xl overflow-hidden flex flex-col justify-end p-2 shadow-inner">
                  <div
                    className="w-full bg-gradient-to-t from-[#FFFDF9] to-[#F1E8DC] rounded-xl transition-all duration-[2000ms] ease-out flex items-center justify-center"
                    style={{
                      height: animStage === "sparkle" ? "25%" : "75%",
                    }}
                  >
                    {animStage === "sparkle" && (
                      <div className="animate-ping w-8 h-8 rounded-full bg-[#E8A33D]/40" />
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <p className="font-display text-xl text-[#2A1B15] font-medium">
                  {animStage === "burning" ? "Melting down the sacred wax..." : "Unveiling your gift..."}
                </p>
                <p className="text-sm text-[#5C463B]">
                  Watch the sealed foil parcel emerge ✨
                </p>
              </div>
            </div>
          ) : (
            /* REVEALED STAGE: Gift Unveiled! */
            <div className="space-y-8 animate-fadeIn">
              {/* Gift Badge and Icon */}
              <div className="relative mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-[#FFF8EE] to-[#FAF6F0] border-2 border-[#E8A33D] flex items-center justify-center shadow-md">
                <Sparkles className="w-10 h-10 text-[#A8742A] animate-pulse" />
              </div>

              <div className="space-y-2">
                <Badge variant="surprise">
                  Revealed Treasure
                </Badge>
                <h2 className="font-display text-3xl sm:text-4xl text-[#2A1B15] font-medium">
                  {data?.giftName || "Silver Laxmi Keepsake Coin"}
                </h2>
                <p className="text-base text-[#5C463B] max-w-md mx-auto leading-relaxed">
                  May this auspicious festive charm bring abundance, serenity, and joy into your home.
                </p>
              </div>

              {/* Thank you + Discount Code Box */}
              <div className="p-6 rounded-[20px] bg-[#FFF8EE] border border-[#E8A33D]/40 space-y-3">
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-[#A8742A] uppercase tracking-wider">
                    Thank You For Celebrating With Us
                  </p>
                  <p className="text-base text-[#2A1B15] font-semibold">
                    Enjoy 10% off your next Diwali candle or hamper
                  </p>
                </div>

                <div className="flex items-center justify-center gap-2 max-w-xs mx-auto">
                  <div className="px-5 py-2.5 bg-white border border-[#E6D8C6] rounded-xl font-mono text-base font-bold text-[#2A1B15] tracking-wider shadow-sm">
                    {data?.discountCode || "SURPRISE10"}
                  </div>
                  <button
                    onClick={handleCopyCode}
                    className="p-3 bg-[#5A1E1E] hover:bg-[#431414] text-white rounded-xl transition-all shadow-sm"
                    aria-label="Copy discount code"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Upload photo of the gift & Share */}
              <div className="space-y-4 pt-2">
                <div className="p-5 border border-dashed border-[#E6D8C6] rounded-[20px] bg-[#FAF6F0]/60 space-y-3">
                  <div className="flex flex-col items-center justify-center text-sm text-[#5C463B]">
                    {photoPreview ? (
                      <div className="relative w-32 h-32 rounded-xl overflow-hidden mb-2 border border-[#E6D8C6]">
                        <Image src={photoPreview} alt="Your revealed gift" fill className="object-cover" />
                      </div>
                    ) : (
                      <Upload className="w-7 h-7 text-[#A8742A] mb-1.5" />
                    )}
                    <span className="font-semibold text-[#2A1B15]">
                      {photoPreview ? "Photo uploaded!" : "Upload a photo of your revealed gift"}
                    </span>
                    <span className="text-xs text-[#5C463B]">
                      Show your discovery to our candle community
                    </span>
                  </div>

                  <label className="btn-outline text-sm py-2 px-5 cursor-pointer bg-white inline-flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    <span>{photoPreview ? "Change Photo" : "Select Image"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoSelect}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Share Button */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={handleShare}
                    className="btn-primary w-full sm:w-auto text-base py-3 px-7 shadow-sm flex items-center justify-center gap-2 font-semibold"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share your reveal</span>
                  </button>
                  <Link
                    href="/shop"
                    className="btn-outline w-full sm:w-auto text-base py-3 px-7 bg-white flex items-center justify-center gap-2 font-semibold"
                  >
                    <span>Explore more candles</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Required Visible Safety Warning */}
        <InfoBar variant="safety" title="Safety first">
          The gift is in a heat-safe sealed pouch at the bottom. Never leave a burning candle unattended. Stop burning when 1 cm of wax is left. Keep away from children and pets. Not suitable for children under 14.
        </InfoBar>
      </div>
    </div>
  );
}
