import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useQueryClient } from "@tanstack/react-query";
import {
  BookOpen,
  ChefHat,
  Heart,
  LogIn,
  LogOut,
  Menu,
  MessageCircle,
  Settings,
  Share2,
  Shield,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { View } from "../App";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useLocalAuth } from "../hooks/useLocalAuth";

interface HeaderProps {
  currentView: View;
  onNavigate: (view: View) => void;
  isAdmin: boolean;
  userName: string | null;
  onLoginClick: () => void;
}

export default function Header({
  currentView,
  onNavigate,
  isAdmin,
  userName,
  onLoginClick,
}: HeaderProps) {
  const { clear, identity } = useInternetIdentity();
  const { localUser, localLogout } = useLocalAuth();
  const queryClient = useQueryClient();
  const isAuthenticated = !!identity || !!localUser;
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    localLogout();
    if (identity) {
      await clear();
      queryClient.clear();
    }
    window.location.reload();
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: "omawasthi rasoiee", url });
      } catch {
        // user cancelled
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied!");
    }
  };

  const handleMobileNavigate = (view: View) => {
    onNavigate(view);
    setMobileOpen(false);
  };

  const displayName = userName || localUser?.name || null;

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
            omawasthi rasoiee
          </span>
        </motion.div>

        {/* Desktop Nav */}
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
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="gap-2"
            data-ocid="nav.share.button"
          >
            <Share2 className="w-4 h-4" />
            Share
          </Button>
        </nav>

        {/* Right: Auth + mobile menu */}
        <div className="flex items-center gap-2">
          {isAuthenticated && displayName && (
            <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
              <User className="w-4 h-4" />
              <span className="font-medium text-foreground">{displayName}</span>
            </div>
          )}
          {isAuthenticated ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="gap-2"
              data-ocid="nav.logout.button"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={onLoginClick}
              className="gap-2"
              data-ocid="nav.login.button"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </Button>
          )}

          {/* Mobile hamburger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                data-ocid="nav.mobile.open_modal_button"
              >
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-72"
              data-ocid="nav.mobile.sheet"
            >
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
                    <ChefHat className="w-4 h-4 text-primary-foreground" />
                  </div>
                  omawasthi rasoiee
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 mt-6">
                <Button
                  variant={currentView === "browse" ? "secondary" : "ghost"}
                  className="w-full justify-start gap-3"
                  onClick={() => handleMobileNavigate("browse")}
                  data-ocid="nav.mobile.browse.link"
                >
                  <BookOpen className="w-4 h-4" />
                  Browse Recipes
                </Button>
                {isAuthenticated && (
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3"
                    onClick={() => handleMobileNavigate("browse")}
                    data-ocid="nav.mobile.favorites.link"
                  >
                    <Heart className="w-4 h-4" />
                    My Favorites
                  </Button>
                )}
                {isAdmin && (
                  <Button
                    variant={
                      currentView === "ingredients" ? "secondary" : "ghost"
                    }
                    className="w-full justify-start gap-3"
                    onClick={() => handleMobileNavigate("ingredients")}
                    data-ocid="nav.mobile.ingredients.link"
                  >
                    <Settings className="w-4 h-4" />
                    Ingredients
                  </Button>
                )}
                {isAdmin && (
                  <Button
                    variant={currentView === "admin" ? "secondary" : "ghost"}
                    className="w-full justify-start gap-3"
                    onClick={() => handleMobileNavigate("admin")}
                    data-ocid="nav.mobile.admin.link"
                  >
                    <Shield className="w-4 h-4" />
                    Admin Panel
                  </Button>
                )}
                <Button
                  variant={currentView === "contact" ? "secondary" : "ghost"}
                  className="w-full justify-start gap-3"
                  onClick={() => handleMobileNavigate("contact")}
                  data-ocid="nav.mobile.contact.link"
                >
                  <MessageCircle className="w-4 h-4" />
                  Contact
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3"
                  onClick={() => {
                    handleShare();
                    setMobileOpen(false);
                  }}
                  data-ocid="nav.mobile.share.button"
                >
                  <Share2 className="w-4 h-4" />
                  Share App
                </Button>

                <div className="border-t border-border mt-4 pt-4">
                  {isAuthenticated ? (
                    <Button
                      variant="outline"
                      className="w-full gap-2"
                      onClick={() => {
                        handleLogout();
                        setMobileOpen(false);
                      }}
                      data-ocid="nav.mobile.logout.button"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </Button>
                  ) : (
                    <Button
                      className="w-full gap-2"
                      onClick={() => {
                        setMobileOpen(false);
                        onLoginClick();
                      }}
                      data-ocid="nav.mobile.login.button"
                    >
                      <LogIn className="w-4 h-4" />
                      Sign In / Sign Up
                    </Button>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
