"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowRight, ArrowLeft, CheckCircle2, Sparkles, ShieldCheck } from "lucide-react";
import { forgotPasswordSchema } from "@/lib/authValidators";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const clientValidation = forgotPasswordSchema.safeParse({
      email: email.trim().toLowerCase(),
    });

    if (!clientValidation.success) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Unable to process request.");
        setLoading(false);
        return;
      }

      setSubmitted(true);
      setLoading(false);
    } catch (err: any) {
      setErrorMessage("A network error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] py-16 px-4 sm:px-6 flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Header / Brand */}
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] uppercase tracking-[0.2em] bg-[#2A1B15]/5 text-[#A8742A] border border-[#D9A441]/30 font-medium mb-3">
            <Sparkles className="w-3 h-3 text-[#D9A441]" />
            Account Recovery
          </span>
          <h1
            className="text-3xl sm:text-4xl font-serif font-medium text-[#2A1B15] tracking-wide"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            Reset Password
          </h1>
          <p className="text-sm text-[#7A6255] mt-2">
            Enter your email to receive a secure, single-use password reset link.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-[#E6D8C6] rounded-[24px] p-7 sm:p-9 shadow-sm">
          {submitted ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-12 h-12 bg-[#FAF6F0] border border-[#D9A441]/40 rounded-full flex items-center justify-center mx-auto text-[#A8742A]">
                <CheckCircle2 className="w-6 h-6 text-[#A8742A]" />
              </div>
              <h2 className="text-xl font-serif font-medium text-[#2A1B15]">
                Reset Link Dispatched
              </h2>
              <p className="text-sm text-[#5C463B] leading-relaxed">
                If an account exists with that email address, a password reset link has been dispatched.
                The link is valid for 30 minutes.
              </p>
              <div className="pt-4">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 py-2.5 px-6 bg-[#2A1B15] hover:bg-[#3D2820] text-[#FAF6F0] text-xs uppercase tracking-[0.2em] font-medium rounded-full transition-all"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Return to Sign In
                </Link>
              </div>
            </div>
          ) : (
            <>
              {errorMessage && (
                <div className="mb-6 p-3.5 bg-[#FAF0ED] border border-[#E8C4B8] text-[#9A3B26] text-xs rounded-xl flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9A3B26] shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-[0.15em] text-[#5C463B] font-medium mb-1.5">
                    Account Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#9C8578] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#FAF6F0] border border-[#E6D8C6] rounded-xl text-sm text-[#2A1B15] placeholder-[#9C8578] focus:outline-none focus:border-[#D9A441] transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3 px-6 bg-[#2A1B15] hover:bg-[#3D2820] text-[#FAF6F0] text-xs uppercase tracking-[0.2em] font-medium rounded-full transition-all flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
                >
                  {loading ? "Dispatching..." : "Send Reset Link"}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="mt-7 pt-6 border-t border-[#E6D8C6] text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-xs text-[#7A6255] hover:text-[#2A1B15] font-medium transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to Sign In
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Security badge */}
        <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-[#9C8578]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#A8742A]" />
          <span>Single-use 30-minute token security</span>
        </div>
      </div>
    </div>
  );
}

