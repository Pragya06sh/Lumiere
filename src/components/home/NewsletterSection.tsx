"use client";

import { useState } from "react";
import { Sparkles, CheckCircle, ArrowRight } from "lucide-react";
import { Section } from "@/components/shared/Section";
import { Badge } from "@/components/shared/Badge";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid email address");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus("success");
        setMessage("Welcome. Use code FIRST100 for ₹100 off your order.");
        setEmail("");
      } else {
        setStatus("error");
        setMessage("Could not subscribe. Please try again.");
      }
    } catch {
      setStatus("success");
      setMessage("Welcome to our circle. Use code FIRST100 for ₹100 off.");
      setEmail("");
    }
  };

  return (
    <Section
      background="dark"
      headerAlign="center"
      badge={
        <Badge variant="orange">
          <Sparkles className="w-3.5 h-3.5 text-[#F28A3D]" />
          The Atelier Circle
        </Badge>
      }
      title="Enjoy ₹100 off your order"
      subtitle="Subscribe for private releases, seasonal candle notes, and signature surprise reveals."
    >
      <div className="max-w-md mx-auto space-y-4">
        {status === "success" ? (
          <div className="p-5 bg-[#241510] border border-[#D9A441]/40 rounded-[24px] text-[#F8EFE6] flex items-center justify-center gap-3 text-sm shadow-md">
            <CheckCircle className="w-5 h-5 text-[#81C784] shrink-0" />
            <p className="font-light">{message}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === "loading"}
                className="flex-1 bg-[#241510] border border-[#D9A441]/40 text-[#F8EFE6] px-5 py-3.5 text-sm rounded-full placeholder-[#CDB8A6]/60 focus:outline-none focus:border-[#F28A3D] shadow-inner transition-colors"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="btn-primary text-sm py-3.5 px-7 shadow-md flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
              >
                <span>{status === "loading" ? "Subscribing..." : "Join Circle"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            {status === "error" && (
              <p className="text-xs text-[#E57373] text-center font-light">{message}</p>
            )}
            <p className="text-[11px] text-[#CDB8A6]/70 text-center font-light">
              We send thoughtful updates only. Unsubscribe at any time.
            </p>
          </form>
        )}
      </div>
    </Section>
  );
}
