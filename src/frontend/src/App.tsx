import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Instagram, Mail, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import type { Recipe } from "./backend.d";
import Header from "./components/Header";
import LoginModal from "./components/LoginModal";
import ProfileSetupModal from "./components/ProfileSetupModal";
import RegistrationModal from "./components/RegistrationModal";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useLocalAuth } from "./hooks/useLocalAuth";
import {
  useGetCallerUserProfile,
  useIsAdmin,
  useIsUserRegistered,
} from "./hooks/useQueries";
import AdminPanel from "./pages/AdminPanel";
import BrowseView from "./pages/BrowseView";
import ContactPage from "./pages/ContactPage";
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

export type View =
  | "browse"
  | "detail"
  | "form"
  | "ingredients"
  | "contact"
  | "admin";

function AppInner() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { isLocalAdmin, localUser } = useLocalAuth();

  const [view, setView] = useState<View>("browse");
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [editRecipe, setEditRecipe] = useState<Recipe | null>(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const {
    data: userProfile,
    isLoading: profileLoading,
    isFetched: profileFetched,
  } = useGetCallerUserProfile();
  const { data: isAdminFromBackend = false } = useIsAdmin();
  const { data: isRegistered, isFetched: registrationFetched } =
    useIsUserRegistered();

  const isAdmin = isAdminFromBackend || isLocalAdmin;

  const showProfileSetup =
    isAuthenticated &&
    !profileLoading &&
    profileFetched &&
    userProfile === null;

  const showRegistrationModal =
    isAuthenticated &&
    !showProfileSetup &&
    registrationFetched &&
    isRegistered === false;

  // Admin secret URL hash access
  useEffect(() => {
    if (window.location.hash === "#admin-omawasthi07122006") {
      setView("admin");
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated && !localUser) {
      setView("browse");
      setSelectedRecipe(null);
      setEditRecipe(null);
    }
  }, [isAuthenticated, localUser]);

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
    setView("browse");
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
        onLoginClick={() => setLoginModalOpen(true)}
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

      <LoginModal open={loginModalOpen} onOpenChange={setLoginModalOpen} />

      <ProfileSetupModal
        open={showProfileSetup}
        onComplete={() =>
          queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] })
        }
      />

      <RegistrationModal
        open={showRegistrationModal}
        onComplete={() => {
          queryClient.invalidateQueries({ queryKey: ["isUserRegistered"] });
          queryClient.invalidateQueries({ queryKey: ["registeredUsers"] });
        }}
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
