import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Instagram, Mail, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import type { Recipe } from "./backend.d";
import Header from "./components/Header";
import { useLocalAuth } from "./hooks/useLocalAuth";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminPanel from "./pages/AdminPanel";
import BrowseView from "./pages/BrowseView";
import ContactPage from "./pages/ContactPage";
import IngredientsManager from "./pages/IngredientsManager";
import JobApplicationPage from "./pages/JobApplicationPage";
import RecipeDetail from "./pages/RecipeDetail";
import RecipeForm from "./pages/RecipeForm";
import UserAuthPage from "./pages/UserAuthPage";
import WelcomePage from "./pages/WelcomePage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 1 },
  },
});

export type View =
  | "browse"
  | "detail"
  | "form"
  | "ingredients"
  | "contact"
  | "admin";

type WelcomeScreen =
  | "welcome"
  | "userAuth"
  | "adminLogin"
  | "jobApply"
  | "contactPublic";

function AppInner() {
  const { isLocalAdmin, localUser } = useLocalAuth();

  const isLoggedIn = !!localUser || isLocalAdmin;

  const [welcomeScreen, setWelcomeScreen] = useState<WelcomeScreen>("welcome");
  const [view, setView] = useState<View>("browse");
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [editRecipe, setEditRecipe] = useState<Recipe | null>(null);

  const isAdmin = isLocalAdmin;

  // Admin secret hash URL
  useEffect(() => {
    if (window.location.hash === "#admin-omawasthi07122006") {
      setWelcomeScreen("adminLogin");
    }
  }, []);

  const navigateTo = (v: View) => {
    setView(v);
    if (v !== "detail") setSelectedRecipe(null);
    if (v !== "form") setEditRecipe(null);
  };

  // ─── Pre-login welcome flow ───────────────────────────────────────────────
  if (!isLoggedIn) {
    if (welcomeScreen === "userAuth") {
      return (
        <>
          <UserAuthPage onBack={() => setWelcomeScreen("welcome")} />
          <Toaster richColors position="top-right" />
        </>
      );
    }
    if (welcomeScreen === "adminLogin") {
      return (
        <>
          <AdminLoginPage onBack={() => setWelcomeScreen("welcome")} />
          <Toaster richColors position="top-right" />
        </>
      );
    }
    if (welcomeScreen === "jobApply") {
      return (
        <QueryClientProvider client={queryClient}>
          <JobApplicationPage onBack={() => setWelcomeScreen("welcome")} />
          <Toaster richColors position="top-right" />
        </QueryClientProvider>
      );
    }
    if (welcomeScreen === "contactPublic") {
      return (
        <QueryClientProvider client={queryClient}>
          <ContactPage onBack={() => setWelcomeScreen("welcome")} />
          <Toaster richColors position="top-right" />
        </QueryClientProvider>
      );
    }
    // Default welcome screen
    return (
      <>
        <WelcomePage onNavigate={setWelcomeScreen} />
        <Toaster richColors position="top-right" />
      </>
    );
  }

  // ─── Main app (logged in) ────────────────────────────────────────────────
  const userName = isLocalAdmin ? "Om Awasthi" : (localUser?.name ?? null);

  return (
    <div className="min-h-screen bg-background">
      <Header
        currentView={view}
        onNavigate={navigateTo}
        isAdmin={isAdmin}
        userName={userName}
      />

      <main>
        {view === "browse" && (
          <BrowseView
            onSelectRecipe={(recipe) => {
              setSelectedRecipe(recipe);
              setView("detail");
            }}
            onAddRecipe={() => {
              setEditRecipe(null);
              setView("form");
            }}
          />
        )}
        {view === "detail" && selectedRecipe && (
          <RecipeDetail
            recipe={selectedRecipe}
            onBack={() => {
              setView("browse");
              setSelectedRecipe(null);
            }}
            onEdit={(recipe) => {
              setEditRecipe(recipe);
              setView("form");
            }}
            isAdmin={isAdmin}
          />
        )}
        {view === "form" && (
          <RecipeForm
            editRecipe={editRecipe}
            onBack={() => {
              setView("browse");
              setEditRecipe(null);
            }}
            onSuccess={(recipe) => {
              if (recipe) {
                setSelectedRecipe(recipe);
                setView("detail");
              } else {
                setView("browse");
              }
            }}
          />
        )}
        {view === "ingredients" && (
          <IngredientsManager onBack={() => setView("browse")} />
        )}
        {view === "contact" && <ContactPage />}
        {view === "admin" && <AdminPanel />}
      </main>

      <footer className="mt-16 border-t border-border bg-card/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">
              Built by Om Awasthi — The App Developer
            </span>
            <div className="flex items-center gap-5">
              <a
                href="tel:8081024044"
                className="flex items-center gap-1.5 hover:text-primary transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>8081024044</span>
              </a>
              <a
                href="mailto:omawasthi379@gmail.com"
                className="flex items-center gap-1.5 hover:text-primary transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>omawasthi379@gmail.com</span>
              </a>
              <a
                href="https://instagram.com/om_awasthi11"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-primary transition-colors"
              >
                <Instagram className="w-3.5 h-3.5" />
                <span>@om_awasthi11</span>
              </a>
            </div>
          </div>
        </div>
      </footer>

      <Toaster richColors position="top-right" />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppInner />
    </QueryClientProvider>
  );
}
