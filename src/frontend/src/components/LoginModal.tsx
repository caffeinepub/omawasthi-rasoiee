import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, LogIn, UserPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useLocalAuth } from "../hooks/useLocalAuth";
import { useRegisterUser } from "../hooks/useQueries";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function LoginModal({ open, onOpenChange }: LoginModalProps) {
  const { login } = useInternetIdentity();
  const { localLogin } = useLocalAuth();
  const { mutateAsync: registerUser } = useRegisterUser();

  const [tab, setTab] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Login form
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Signup form
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupMobile, setSignupMobile] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirm, setSignupConfirm] = useState("");

  const resetForms = () => {
    setLoginEmail("");
    setLoginPassword("");
    setSignupName("");
    setSignupEmail("");
    setSignupMobile("");
    setSignupPassword("");
    setSignupConfirm("");
    setError("");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setError("Email aur password required hai.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const isAdmin = localLogin(loginEmail, loginPassword);
      // Also trigger Internet Identity login in background
      try {
        await login();
      } catch {
        // II optional — local login already succeeded
      }
      if (isAdmin) {
        toast.success("Admin login successful! 🎉");
      } else {
        toast.success("Login successful!");
      }
      resetForms();
      onOpenChange(false);
      // Reload to refresh admin state
      setTimeout(() => window.location.reload(), 300);
    } catch (err: any) {
      setError(err?.message ?? "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupName.trim() || !signupEmail.trim() || !signupPassword.trim()) {
      setError("Name, email aur password required hain.");
      return;
    }
    if (signupPassword !== signupConfirm) {
      setError("Passwords match nahi kar rahe.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      localLogin(signupEmail, signupPassword, signupName, signupMobile);
      // Try II login
      try {
        await login();
      } catch {
        // optional
      }
      // Register in backend
      try {
        await registerUser({
          naam: signupName,
          email: signupEmail,
          mobile: signupMobile,
        });
      } catch {
        // registration might fail if II not authenticated — ok
      }
      toast.success("Account bana liya! Welcome 🎉");
      resetForms();
      onOpenChange(false);
    } catch (err: any) {
      setError(err?.message ?? "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!loading) {
          resetForms();
          onOpenChange(v);
        }
      }}
    >
      <DialogContent className="sm:max-w-md" data-ocid="auth.dialog">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <span className="text-2xl">👨‍🍳</span>
            omawasthi rasoiee
          </DialogTitle>
        </DialogHeader>

        <Tabs
          value={tab}
          onValueChange={(v) => {
            setTab(v as "login" | "signup");
            setError("");
          }}
        >
          <TabsList className="w-full">
            <TabsTrigger
              value="login"
              className="flex-1 gap-2"
              data-ocid="auth.login.tab"
            >
              <LogIn className="w-4 h-4" />
              Login
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

          {/* LOGIN TAB */}
          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4 mt-2">
              <div className="space-y-1.5">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="apna@email.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  autoComplete="email"
                  data-ocid="auth.login.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="login-password">Password</Label>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  autoComplete="current-password"
                  data-ocid="auth.login.input"
                />
              </div>

              {error && (
                <p
                  className="text-sm text-destructive"
                  data-ocid="auth.login.error_state"
                >
                  {error}
                </p>
              )}

              <Button
                type="submit"
                className="w-full gap-2"
                disabled={loading}
                data-ocid="auth.login.submit_button"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <LogIn className="w-4 h-4" />
                )}
                {loading ? "Login ho raha hai..." : "Login"}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Admin? Email: omawasthi379@gmail.com
              </p>
            </form>
          </TabsContent>

          {/* SIGNUP TAB */}
          <TabsContent value="signup">
            <form onSubmit={handleSignup} className="space-y-4 mt-2">
              <div className="space-y-1.5">
                <Label htmlFor="signup-name">Naam (Name)</Label>
                <Input
                  id="signup-name"
                  type="text"
                  placeholder="Apna naam likhein"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  autoComplete="name"
                  data-ocid="auth.signup.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="apna@email.com"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  autoComplete="email"
                  data-ocid="auth.signup.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="signup-mobile">Mobile Number</Label>
                <Input
                  id="signup-mobile"
                  type="tel"
                  placeholder="10-digit number"
                  value={signupMobile}
                  onChange={(e) => setSignupMobile(e.target.value)}
                  autoComplete="tel"
                  data-ocid="auth.signup.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="••••••••"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  autoComplete="new-password"
                  data-ocid="auth.signup.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="signup-confirm">Confirm Password</Label>
                <Input
                  id="signup-confirm"
                  type="password"
                  placeholder="••••••••"
                  value={signupConfirm}
                  onChange={(e) => setSignupConfirm(e.target.value)}
                  autoComplete="new-password"
                  data-ocid="auth.signup.input"
                />
              </div>

              {error && (
                <p
                  className="text-sm text-destructive"
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
                {loading ? "Account ban raha hai..." : "Sign Up"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
