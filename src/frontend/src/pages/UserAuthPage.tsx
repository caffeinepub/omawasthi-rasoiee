import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, ChefHat, Loader2, LogIn, UserPlus } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useLocalAuth } from "../hooks/useLocalAuth";
import { useRegisterLocalUser } from "../hooks/useQueries";

interface UserAuthPageProps {
  onBack: () => void;
}

function simpleHash(password: string): string {
  return btoa(encodeURIComponent(password));
}

export default function UserAuthPage({ onBack }: UserAuthPageProps) {
  const { userSignup, userLogin } = useLocalAuth();
  const { mutateAsync: registerLocalUser } = useRegisterLocalUser();

  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Sign In
  const [siEmail, setSiEmail] = useState("");
  const [siPassword, setSiPassword] = useState("");

  // Sign Up
  const [suName, setSuName] = useState("");
  const [suEmail, setSuEmail] = useState("");
  const [suPassword, setSuPassword] = useState("");
  const [suConfirm, setSuConfirm] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!siEmail.trim() || !siPassword.trim()) {
      setError("Email and password are required.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      userLogin(siEmail.trim(), siPassword);
      toast.success("omawasthi rasoiee mein aapka swagat hai! 🎉", {
        description: "Login successful",
        duration: 4000,
      });
    } catch (err: unknown) {
      setError((err as Error)?.message ?? "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!suName.trim() || !suEmail.trim() || !suPassword.trim()) {
      setError("Name, email and password are required.");
      return;
    }
    if (suPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (suPassword !== suConfirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      userSignup(suName.trim(), suEmail.trim(), suPassword);
      // Also register in backend
      try {
        await registerLocalUser({
          name: suName.trim(),
          email: suEmail.trim(),
          passwordHash: simpleHash(suPassword),
        });
      } catch {
        // Backend registration optional
      }
      toast.success(`Welcome to omawasthi rasoiee, ${suName.trim()}! 🎉`, {
        description: "Account created successfully",
        duration: 4000,
      });
    } catch (err: unknown) {
      setError((err as Error)?.message ?? "Sign up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.97 0.012 75) 0%, oklch(0.94 0.02 55) 100%)",
      }}
    >
      {/* Back button */}
      <button
        type="button"
        onClick={onBack}
        className="absolute top-6 left-6 flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        data-ocid="auth.back.button"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary mb-4 shadow-lg">
            <ChefHat className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            omawasthi rasoiee
          </h1>
          <p className="text-muted-foreground mt-1">
            Sign in or create an account
          </p>
        </div>

        {/* Card */}
        <div className="bg-card rounded-3xl border border-border shadow-card p-8">
          <Tabs
            value={tab}
            onValueChange={(v) => {
              setTab(v as "signin" | "signup");
              setError("");
            }}
          >
            <TabsList className="w-full mb-6">
              <TabsTrigger
                value="signin"
                className="flex-1 gap-2"
                data-ocid="auth.signin.tab"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="flex-1 gap-2"
                data-ocid="auth.signup.tab"
              >
                <UserPlus className="w-4 h-4" />
                Sign Up
              </TabsTrigger>
            </TabsList>

            {/* SIGN IN */}
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="si-email">Email</Label>
                  <Input
                    id="si-email"
                    type="email"
                    placeholder="your@email.com"
                    value={siEmail}
                    onChange={(e) => setSiEmail(e.target.value)}
                    autoComplete="email"
                    data-ocid="auth.signin.email.input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="si-password">Password</Label>
                  <Input
                    id="si-password"
                    type="password"
                    placeholder="••••••••"
                    value={siPassword}
                    onChange={(e) => setSiPassword(e.target.value)}
                    autoComplete="current-password"
                    data-ocid="auth.signin.password.input"
                  />
                </div>
                {error && (
                  <p
                    className="text-sm text-destructive font-medium"
                    data-ocid="auth.signin.error_state"
                  >
                    {error}
                  </p>
                )}
                <Button
                  type="submit"
                  className="w-full gap-2"
                  disabled={loading}
                  data-ocid="auth.signin.submit_button"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <LogIn className="w-4 h-4" />
                  )}
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>

            {/* SIGN UP */}
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="su-name">Full Name</Label>
                  <Input
                    id="su-name"
                    type="text"
                    placeholder="Your full name"
                    value={suName}
                    onChange={(e) => setSuName(e.target.value)}
                    autoComplete="name"
                    data-ocid="auth.signup.name.input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="su-email">Email</Label>
                  <Input
                    id="su-email"
                    type="email"
                    placeholder="your@email.com"
                    value={suEmail}
                    onChange={(e) => setSuEmail(e.target.value)}
                    autoComplete="email"
                    data-ocid="auth.signup.email.input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="su-password">Password</Label>
                  <Input
                    id="su-password"
                    type="password"
                    placeholder="Min. 6 characters"
                    value={suPassword}
                    onChange={(e) => setSuPassword(e.target.value)}
                    autoComplete="new-password"
                    data-ocid="auth.signup.password.input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="su-confirm">Confirm Password</Label>
                  <Input
                    id="su-confirm"
                    type="password"
                    placeholder="Repeat password"
                    value={suConfirm}
                    onChange={(e) => setSuConfirm(e.target.value)}
                    autoComplete="new-password"
                    data-ocid="auth.signup.confirm.input"
                  />
                </div>
                {error && (
                  <p
                    className="text-sm text-destructive font-medium"
                    data-ocid="auth.signup.error_state"
                  >
                    {error}
                  </p>
                )}
                <Button
                  type="submit"
                  className="w-full gap-2"
                  disabled={loading}
                  data-ocid="auth.signup.submit_button"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <UserPlus className="w-4 h-4" />
                  )}
                  {loading ? "Creating account..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>
    </div>
  );
}
