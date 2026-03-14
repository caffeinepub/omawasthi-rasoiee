import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2, Shield } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useLocalAuth } from "../hooks/useLocalAuth";

interface AdminLoginPageProps {
  onBack: () => void;
}

export default function AdminLoginPage({ onBack }: AdminLoginPageProps) {
  const { adminLogin } = useLocalAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Username and password are required.");
      return;
    }
    setLoading(true);
    setError("");
    await new Promise((r) => setTimeout(r, 400));
    const ok = adminLogin(username.trim(), password);
    setLoading(false);
    if (ok) {
      toast.success("Admin access granted! Welcome, Om Awasthi 🎉", {
        description: "Admin panel is now accessible",
        duration: 4000,
      });
    } else {
      setError("Invalid username or password.");
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.15 0.04 160) 0%, oklch(0.18 0.05 180) 100%)",
      }}
    >
      {/* Decorative glow */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, oklch(0.55 0.15 160 / 0.12), transparent 70%)",
        }}
      />

      {/* Back button */}
      <button
        type="button"
        onClick={onBack}
        className="absolute top-6 left-6 flex items-center gap-2 text-sm font-medium transition-colors"
        style={{ color: "oklch(0.65 0.08 160)" }}
        data-ocid="admin.back.button"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-sm relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-xl"
            style={{ background: "oklch(0.45 0.15 160)" }}
          >
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1
            className="font-display text-3xl font-bold"
            style={{ color: "oklch(0.97 0.01 160)" }}
          >
            Admin Login
          </h1>
          <p className="mt-1" style={{ color: "oklch(0.6 0.05 160)" }}>
            Restricted access — authorised only
          </p>
        </div>

        {/* Form card */}
        <div
          className="rounded-3xl p-8"
          style={{
            background: "oklch(0.22 0.04 160 / 0.8)",
            backdropFilter: "blur(20px)",
            border: "1px solid oklch(0.45 0.15 160 / 0.3)",
            boxShadow: "0 24px 80px oklch(0 0 0 / 0.5)",
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label
                htmlFor="admin-username"
                style={{ color: "oklch(0.8 0.04 160)" }}
              >
                Username
              </Label>
              <Input
                id="admin-username"
                type="text"
                placeholder="Admin username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                data-ocid="admin.username.input"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-emerald-500/50"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="admin-password"
                style={{ color: "oklch(0.8 0.04 160)" }}
              >
                Password
              </Label>
              <Input
                id="admin-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                data-ocid="admin.password.input"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-emerald-500/50"
              />
            </div>
            {error && (
              <p
                className="text-sm font-medium"
                style={{ color: "oklch(0.65 0.18 25)" }}
                data-ocid="admin.login.error_state"
              >
                {error}
              </p>
            )}
            <Button
              type="submit"
              className="w-full gap-2"
              disabled={loading}
              data-ocid="admin.login.submit_button"
              style={{
                background: loading ? undefined : "oklch(0.45 0.15 160)",
              }}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Shield className="w-4 h-4" />
              )}
              {loading ? "Verifying..." : "Login as Admin"}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
