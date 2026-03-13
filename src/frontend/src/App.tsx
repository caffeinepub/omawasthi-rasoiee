import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import type { Recipe } from "./backend.d";
import Header from "./components/Header";
import ProfileSetupModal from "./components/ProfileSetupModal";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useGetCallerUserProfile, useIsAdmin } from "./hooks/useQueries";
import BrowseView from "./pages/BrowseView";
import IngredientsManager from "./pages/IngredientsManager";
import RecipeDetail from "./pages/RecipeDetail";
import RecipeForm from "./pages/RecipeForm";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
});

type View = "browse" | "detail" | "form" | "ingredients";

function AppInner() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const [view, setView] = useState<View>("browse");
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [editRecipe, setEditRecipe] = useState<Recipe | null>(null);

  const {
    data: userProfile,
    isLoading: profileLoading,
    isFetched: profileFetched,
  } = useGetCallerUserProfile();
  const { data: isAdmin = false } = useIsAdmin();

  const showProfileSetup =
    isAuthenticated &&
    !profileLoading &&
    profileFetched &&
    userProfile === null;

  // Reset to browse when logging out
  useEffect(() => {
    if (!isAuthenticated) {
      setView("browse");
      setSelectedRecipe(null);
      setEditRecipe(null);
    }
  }, [isAuthenticated]);

  const navigateTo = (v: View) => {
    setView(v);
    if (v !== "detail") setSelectedRecipe(null);
    if (v !== "form") setEditRecipe(null);
  };

  const handleSelectRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setView("detail");
  };

  const handleAddRecipe = () => {
    setEditRecipe(null);
    setView("form");
  };

  const handleEditRecipe = (recipe: Recipe) => {
    setEditRecipe(recipe);
    setView("form");
  };

  const handleFormSuccess = (recipe?: Recipe) => {
    if (recipe) {
      setSelectedRecipe(recipe);
      setView("detail");
    } else {
      setView("browse");
    }
  };

  const handleBack = () => {
    if (view === "detail" || view === "form") setView("browse");
    else setView("browse");
    setSelectedRecipe(null);
    setEditRecipe(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        currentView={view}
        onNavigate={navigateTo}
        isAdmin={isAdmin}
        userName={userProfile?.name ?? null}
      />

      <main>
        {view === "browse" && (
          <BrowseView
            onSelectRecipe={handleSelectRecipe}
            onAddRecipe={handleAddRecipe}
          />
        )}
        {view === "detail" && selectedRecipe && (
          <RecipeDetail
            recipe={selectedRecipe}
            onBack={handleBack}
            onEdit={handleEditRecipe}
            isAdmin={isAdmin}
          />
        )}
        {view === "form" && (
          <RecipeForm
            editRecipe={editRecipe}
            onBack={handleBack}
            onSuccess={handleFormSuccess}
          />
        )}
        {view === "ingredients" && <IngredientsManager onBack={handleBack} />}
      </main>

      <footer className="mt-16 border-t border-border bg-card/50">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </div>
      </footer>

      <ProfileSetupModal
        open={showProfileSetup}
        onComplete={() =>
          queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] })
        }
      />

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
