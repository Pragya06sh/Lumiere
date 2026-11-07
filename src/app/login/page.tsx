"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import { Lock, Mail, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/account";

  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleEnabled, setGoogleEnabled] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetch("/api/auth/config")
      .then((res) => res.json())
      .then((data) => setGoogleEnabled(Boolean(data.googleEnabled)))
      .catch(() => setGoogleEnabled(false));
  }, []);

  useEffect(() => {
    if (status === "authenticated") {
      router.push(next);
    }
  }, [status, next, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });

      if (res?.error) {
        // Generic error message per security requirements
        setErrorMessage("Email or password is incorrect.");
        setLoading(false);
        return;
      }

      toast.success("Welcome back.");
      router.push(next);
      router.refresh();
    } catch (err: any) {
      setErrorMessage("Email or password is incorrect.");
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: next });
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] py-16 px-4 sm:px-6 flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Header / Brand */}
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] uppercase tracking-[0.2em] bg-[#2A1B15]/5 text-[#A8742A] border border-[#D9A441]/30 font-medium mb-3">
            <Sparkles className="w-3 h-3 text-[#D9A441]" />
            Client Atelier
          </span>
          <h1
            className="text-3xl sm:text-4xl font-serif font-medium text-[#2A1B15] tracking-wide"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            Welcome Back
          </h1>
          <p className="text-sm text-[#7A6255] mt-2">
            Sign in to access your orders, saved addresses, and wishes.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-[#E6D8C6] rounded-[24px] p-7 sm:p-9 shadow-sm">
          {errorMessage && (
            <div className="mb-6 p-3.5 bg-[#FAF0ED] border border-[#E8C4B8] text-[#9A3B26] text-xs rounded-xl flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#9A3B26] shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {googleEnabled && (
            <>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full py-3 px-4 border border-[#E6D8C6] hover:border-[#2A1B15] bg-[#FAF6F0] hover:bg-white text-[#2A1B15] text-xs uppercase tracking-[0.15em] font-medium rounded-full transition-all flex items-center justify-center gap-2.5 mb-6 group"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                Continue with Google
              </button>

              <div className="relative flex items-center justify-center my-6">
                <div className="border-t border-[#E6D8C6] w-full" />
                <span className="bg-white px-3 text-[11px] uppercase tracking-[0.2em] text-[#9C8578] absolute font-medium">
                  or with email
                </span>
              </div>
            </>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-[0.15em] text-[#5C463B] font-medium mb-1.5">
                Email Address
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

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs uppercase tracking-[0.15em] text-[#5C463B] font-medium">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-[#A8742A] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#9C8578] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
              {loading ? "Authenticating..." : "Sign In"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-7 pt-6 border-t border-[#E6D8C6] text-center">
            <p className="text-xs text-[#7A6255]">
              New to Wick & Wish?{" "}
              <Link
                href={`/signup${next ? `?next=${encodeURIComponent(next)}` : ""}`}
                className="text-[#2A1B15] font-semibold hover:underline"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>

        {/* Security badge */}
        <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-[#9C8578]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#A8742A]" />
          <span>Encrypted Session · Protected Client Atelier</span>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF6F0]" />}>
      <LoginForm />
    </Suspense>
  );
}

