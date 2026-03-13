import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import {
  BookOpen,
  ChefHat,
  Heart,
  LogIn,
  LogOut,
  MessageCircle,
  Settings,
  Shield,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import type { View } from "../App";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface HeaderProps {
  currentView: View;
  onNavigate: (view: View) => void;
  isAdmin: boolean;
  userName: string | null;
}

export default function Header({
  currentView,
  onNavigate,
  isAdmin,
  userName,
}: HeaderProps) {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: any) {
        if (error.message === "User is already authenticated") {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border shadow-xs">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2.5 cursor-pointer select-none"
          onClick={() => onNavigate("browse")}
        >
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <ChefHat className="w-4.5 h-4.5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-semibold text-foreground tracking-tight">
            Recipes Book
          </span>
        </motion.div>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-1">
          <Button
            variant={currentView === "browse" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => onNavigate("browse")}
            className="gap-2"
            data-ocid="nav.browse.link"
          >
            <BookOpen className="w-4 h-4" />
            Browse
          </Button>
          {isAuthenticated && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate("browse")}
              className="gap-2"
              data-ocid="nav.favorites.link"
            >
              <Heart className="w-4 h-4" />
              My Favorites
            </Button>
          )}
          {isAdmin && (
            <Button
              variant={currentView === "ingredients" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => onNavigate("ingredients")}
              className="gap-2"
              data-ocid="nav.ingredients.link"
            >
              <Settings className="w-4 h-4" />
              Ingredients
            </Button>
          )}
          {isAdmin && (
            <Button
              variant={currentView === "admin" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => onNavigate("admin")}
              className="gap-2"
              data-ocid="nav.admin.link"
            >
              <Shield className="w-4 h-4" />
              Admin
            </Button>
          )}
          <Button
            variant={currentView === "contact" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => onNavigate("contact")}
            className="gap-2"
            data-ocid="nav.contact.link"
          >
            <MessageCircle className="w-4 h-4" />
            Contact
          </Button>
        </nav>

        {/* Auth */}
        <div className="flex items-center gap-3">
          {isAuthenticated && userName && (
            <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
              <User className="w-4 h-4" />
              <span className="font-medium text-foreground">{userName}</span>
            </div>
          )}
          {isAuthenticated ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleAuth}
              className="gap-2"
              data-ocid="nav.logout.button"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={handleAuth}
              disabled={isLoggingIn}
              className="gap-2"
              data-ocid="nav.login.button"
            >
              <LogIn className="w-4 h-4" />
              {isLoggingIn ? "Signing in..." : "Sign In"}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
