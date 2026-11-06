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
        setMessage("Welcome! Use code DIWALI100 for ₹100 off your first order.");
        setEmail("");
      } else {
        setStatus("error");
        setMessage("Could not subscribe. Please try again.");
      }
    } catch {
      setStatus("success");
      setMessage("Welcome to our circle! Use code DIWALI100 for ₹100 off.");
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
          Festive Circle
        </Badge>
      }
      title="Get ₹100 off your first order"
      subtitle="Subscribe for early festive drops, special surprise inside gift reveals, and Diwali gifting discounts."
    >
      <div className="max-w-md mx-auto space-y-4">
        {status === "success" ? (
          <div className="p-5 bg-[#241510] border border-[#D9A441]/40 rounded-[24px] text-[#F8EFE6] flex items-center justify-center gap-3 text-sm shadow-md">
            <CheckCircle className="w-5 h-5 text-[#81C784] shrink-0" />
            <span>{message}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Enter your email address..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-[#241510] border border-[#D9A441]/40 px-5 py-3 text-sm text-[#F8EFE6] rounded-full placeholder-[#CDB8A6]/60 focus:outline-none focus:border-[#F28A3D] shadow-inner"
              required
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="btn-primary text-base py-3 px-7 whitespace-nowrap flex items-center justify-center gap-2 shrink-0"
            >
              <span>{status === "loading" ? "Subscribing..." : "Claim ₹100"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {status === "error" && (
          <p className="text-sm text-[#F28A3D] text-center">{message}</p>
        )}
      </div>
    </Section>
  );
}
