"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Lock, ArrowRight, CheckCircle2, ShieldCheck, Sparkles, AlertCircle } from "lucide-react";
import { resetPasswordSchema } from "@/lib/authValidators";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!token) {
      setErrorMessage("Missing reset token. Please use the link sent to your email.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please verify both fields.");
      return;
    }

    const clientValidation = resetPasswordSchema.safeParse({
      token,
      password,
    });

    if (!clientValidation.success) {
      setErrorMessage(clientValidation.error.issues[0]?.message || "Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Unable to reset password.");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);
    } catch (err: any) {
      setErrorMessage("An unexpected network error occurred. Please try again.");
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
            Client Security
          </span>
          <h1
            className="text-3xl sm:text-4xl font-serif font-medium text-[#2A1B15] tracking-wide"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            Create New Password
          </h1>
          <p className="text-sm text-[#7A6255] mt-2">
            Choose a strong password with at least 8 characters.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-[#E6D8C6] rounded-[24px] p-7 sm:p-9 shadow-sm">
          {!token ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-12 h-12 bg-[#FAF0ED] border border-[#E8C4B8] rounded-full flex items-center justify-center mx-auto text-[#9A3B26]">
                <AlertCircle className="w-6 h-6 text-[#9A3B26]" />
              </div>
              <h2 className="text-xl font-serif font-medium text-[#2A1B15]">
                Invalid Link
              </h2>
              <p className="text-sm text-[#5C463B] leading-relaxed">
                This password reset link is missing a valid security token. Please request a new link.
              </p>
              <div className="pt-4">
                <Link
                  href="/forgot-password"
                  className="inline-flex items-center justify-center gap-2 py-2.5 px-6 bg-[#2A1B15] hover:bg-[#3D2820] text-[#FAF6F0] text-xs uppercase tracking-[0.2em] font-medium rounded-full transition-all"
                >
                  Request Reset Link
                </Link>
              </div>
            </div>
          ) : success ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-12 h-12 bg-[#FAF6F0] border border-[#D9A441]/40 rounded-full flex items-center justify-center mx-auto text-[#A8742A]">
                <CheckCircle2 className="w-6 h-6 text-[#A8742A]" />
              </div>
              <h2 className="text-xl font-serif font-medium text-[#2A1B15]">
                Password Updated
              </h2>
              <p className="text-sm text-[#5C463B] leading-relaxed">
                Your password has been changed successfully. You may now sign in with your new credentials.
              </p>
              <div className="pt-4">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 py-2.5 px-6 bg-[#2A1B15] hover:bg-[#3D2820] text-[#FAF6F0] text-xs uppercase tracking-[0.2em] font-medium rounded-full transition-all"
                >
                  Sign In Now
                  <ArrowRight className="w-3.5 h-3.5" />
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
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#9C8578] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      minLength={8}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#FAF6F0] border border-[#E6D8C6] rounded-xl text-sm text-[#2A1B15] placeholder-[#9C8578] focus:outline-none focus:border-[#D9A441] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-[0.15em] text-[#5C463B] font-medium mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#9C8578] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      minLength={8}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 bg-[#FAF6F0] border border-[#E6D8C6] rounded-xl text-sm text-[#2A1B15] placeholder-[#9C8578] focus:outline-none focus:border-[#D9A441] transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3 px-6 bg-[#2A1B15] hover:bg-[#3D2820] text-[#FAF6F0] text-xs uppercase tracking-[0.2em] font-medium rounded-full transition-all flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
                >
                  {loading ? "Updating Password..." : "Update Password"}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </>
          )}
        </div>

        {/* Security badge */}
        <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-[#9C8578]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#A8742A]" />
          <span>Secure salted hash encryption</span>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF6F0]" />}>
      <ResetPasswordForm />
    </Suspense>
  );
}

