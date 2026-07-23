"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { signIn } from "@/lib/api-client";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  Lock,
  Mail,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";

export function LoginPage() {
  const { navigate, refreshSession } = useStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const ok = await signIn(email, password);
    if (!ok) {
      setError("Invalid email or password.");
      setLoading(false);
      return;
    }
    await refreshSession();
    toast.success("Signed in successfully.");
    setLoading(false);
    // Route based on role
    const { user } = useStore.getState();
    if (user?.role === "ADMIN") {
      navigate({ type: "admin", view: "dashboard" });
    } else {
      navigate({ type: "editor", view: "dashboard" });
    }
  };

  const fillDemo = (kind: "admin" | "editor") => {
    if (kind === "admin") {
      setEmail("admin@dispatch.test");
      setPassword("admin123");
    } else {
      setEmail("editor@dispatch.test");
      setPassword("editor123");
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <button
          onClick={() => navigate({ type: "home" })}
          className="inline-flex items-center gap-1.5 font-ui text-xs text-ink-secondary hover:text-brand transition-colors mb-6"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to homepage
        </button>

        <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-sm">
          <div className="text-center mb-6">
            <div className="font-display text-2xl font-extrabold mb-1">
              News<span className="text-brand">varta</span>
            </div>
            <h1 className="font-display text-xl font-bold mt-4">Sign in to the newsroom</h1>
            <p className="font-ui text-sm text-ink-secondary mt-1">
              Editor and admin access only.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-md bg-destructive/10 border border-destructive/30 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
              <p className="font-ui text-sm text-destructive">{error}</p>
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block font-ui text-xs font-semibold uppercase tracking-wider text-ink-secondary mb-1.5">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-tertiary" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  className="w-full h-11 pl-10 pr-4 rounded-md border border-border bg-background font-ui text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                  placeholder="you@dispatch.test"
                />
              </div>
            </div>

            <div>
              <label className="block font-ui text-xs font-semibold uppercase tracking-wider text-ink-secondary mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-tertiary" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="w-full h-11 pl-10 pr-4 rounded-md border border-border bg-background font-ui text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 inline-flex items-center justify-center gap-2 rounded-md bg-brand hover:bg-brand-dark text-white font-ui text-sm font-semibold transition-colors disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 pt-6 border-t border-border">
            <p className="font-ui text-[11px] font-bold uppercase tracking-wider text-ink-tertiary mb-2">
              Demo credentials
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => fillDemo("admin")}
                className="p-3 rounded-md border border-border hover:border-foreground/30 hover:bg-muted text-left transition-colors"
              >
                <p className="font-ui text-xs font-semibold text-foreground">Admin</p>
                <p className="font-ui text-[11px] text-ink-tertiary mt-0.5 truncate">
                  admin@dispatch.test
                </p>
              </button>
              <button
                onClick={() => fillDemo("editor")}
                className="p-3 rounded-md border border-border hover:border-foreground/30 hover:bg-muted text-left transition-colors"
              >
                <p className="font-ui text-xs font-semibold text-foreground">Editor</p>
                <p className="font-ui text-[11px] text-ink-tertiary mt-0.5 truncate">
                  editor@dispatch.test
                </p>
              </button>
            </div>
            <p className="font-ui text-[11px] text-ink-tertiary mt-3">
              Click a card to autofill the form. Passwords:{" "}
              <code className="font-mono text-[10px]">admin123</code> /{" "}
              <code className="font-mono text-[10px]">editor123</code>.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
