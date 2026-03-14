import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useInitializeSeeds, useListRecipes } from "@/hooks/useQueries";
import { Principal } from "@icp-sdk/core/principal";
import {
  Clock,
  Heart,
  Plus,
  Search,
  Users,
  UtensilsCrossed,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import type { Recipe } from "../backend.d";
import { useLocalAuth } from "../hooks/useLocalAuth";

const CATEGORIES = ["All", "Breakfast", "Lunch", "Dinner", "Dessert", "Snack"];

const SEED_RECIPES: Recipe[] = [
  {
    id: 1n,
    title: "Grandmother's Sourdough Bread",
    authorId: Principal.anonymous(),
    createdAt: BigInt(Date.now()),
    cookTime: 45n,
    description:
      "A rustic, golden-crusted sourdough loaf with a chewy crumb and tangy flavor — passed down through generations.",
    steps: [
      "Mix flour, water, starter and salt",
      "Autolyse for 30 minutes",
      "Fold dough every 30 minutes for 3 hours",
      "Shape and proof overnight in fridge",
      "Bake in Dutch oven at 500°F",
    ],
    imageUrl: "/assets/generated/recipe-sourdough.dim_600x400.jpg",
    prepTime: 30n,
    recipeIngredients: [
      { name: "Bread Flour", unit: "g", amount: "500" },
      { name: "Water", unit: "ml", amount: "375" },
      { name: "Sourdough Starter", unit: "g", amount: "100" },
      { name: "Salt", unit: "g", amount: "10" },
    ],
    category: "Breakfast",
    servings: 8n,
  },
  {
    id: 2n,
    title: "Roman Spaghetti Carbonara",
    authorId: Principal.anonymous(),
    createdAt: BigInt(Date.now()),
    cookTime: 20n,
    description:
      "The authentic Roman recipe — silky eggs, sharp Pecorino Romano, crispy guanciale, and nothing else.",
    steps: [
      "Cook spaghetti in salted boiling water",
      "Fry guanciale until crispy",
      "Whisk eggs with Pecorino and pepper",
      "Combine hot pasta off heat with egg mixture",
      "Add pasta water to emulsify",
    ],
    imageUrl: "/assets/generated/recipe-carbonara.dim_600x400.jpg",
    prepTime: 10n,
    recipeIngredients: [
      { name: "Spaghetti", unit: "g", amount: "400" },
      { name: "Guanciale", unit: "g", amount: "200" },
      { name: "Eggs", unit: "whole", amount: "4" },
      { name: "Pecorino Romano", unit: "g", amount: "100" },
    ],
    category: "Dinner",
    servings: 4n,
  },
  {
    id: 3n,
    title: "Thai Green Curry",
    authorId: Principal.anonymous(),
    createdAt: BigInt(Date.now()),
    cookTime: 30n,
    description:
      "Fragrant, creamy Thai green curry with fresh vegetables and jasmine rice.",
    steps: [
      "Fry green curry paste in coconut cream",
      "Add chicken and coat well",
      "Pour in remaining coconut milk",
      "Add vegetables and fish sauce",
      "Serve with jasmine rice and Thai basil",
    ],
    imageUrl: "/assets/generated/recipe-thai-curry.dim_600x400.jpg",
    prepTime: 15n,
    recipeIngredients: [
      { name: "Green Curry Paste", unit: "tbsp", amount: "3" },
      { name: "Coconut Milk", unit: "ml", amount: "400" },
      { name: "Chicken Thighs", unit: "g", amount: "500" },
      { name: "Thai Basil", unit: "handful", amount: "1" },
    ],
    category: "Dinner",
    servings: 4n,
  },
  {
    id: 4n,
    title: "Chocolate Lava Cake",
    authorId: Principal.anonymous(),
    createdAt: BigInt(Date.now()),
    cookTime: 12n,
    description:
      "Individual warm chocolate cakes with a molten center. Serve with vanilla ice cream.",
    steps: [
      "Melt chocolate and butter together",
      "Whisk eggs, yolks, and sugar",
      "Fold in chocolate mixture and flour",
      "Pour into buttered ramekins",
      "Bake at 425°F for 12 minutes",
    ],
    imageUrl: "/assets/generated/recipe-lava-cake.dim_600x400.jpg",
    prepTime: 15n,
    recipeIngredients: [
      { name: "Dark Chocolate", unit: "g", amount: "170" },
      { name: "Butter", unit: "g", amount: "115" },
      { name: "Eggs", unit: "whole", amount: "4" },
      { name: "Sugar", unit: "g", amount: "120" },
      { name: "Flour", unit: "tbsp", amount: "2" },
    ],
    category: "Dessert",
    servings: 4n,
  },
  {
    id: 5n,
    title: "Smashed Avocado Toast",
    authorId: Principal.anonymous(),
    createdAt: BigInt(Date.now()),
    cookTime: 5n,
    description:
      "Creamy smashed avocado on toasted sourdough with poached eggs and microgreens.",
    steps: [
      "Toast thick sourdough slices",
      "Poach eggs in simmering water",
      "Smash avocados with lemon and salt",
      "Spread on toast and top with eggs",
      "Finish with microgreens and seasoning",
    ],
    imageUrl: "/assets/generated/recipe-avocado-toast.dim_600x400.jpg",
    prepTime: 10n,
    recipeIngredients: [
      { name: "Sourdough Bread", unit: "slices", amount: "2" },
      { name: "Ripe Avocados", unit: "whole", amount: "2" },
      { name: "Eggs", unit: "whole", amount: "2" },
      { name: "Lemon", unit: "whole", amount: "0.5" },
    ],
    category: "Breakfast",
    servings: 2n,
  },
  {
    id: 6n,
    title: "Smash Burger with Crispy Fries",
    authorId: Principal.anonymous(),
    createdAt: BigInt(Date.now()),
    cookTime: 15n,
    description:
      "Crispy-edged smash burgers on brioche buns with caramelized onions and special sauce.",
    steps: [
      "Form beef into loose balls",
      "Smash on screaming-hot griddle",
      "Season and add cheese to melt",
      "Stack on brioche with special sauce",
      "Serve with seasoned fries",
    ],
    imageUrl: "/assets/generated/recipe-burger.dim_600x400.jpg",
    prepTime: 20n,
    recipeIngredients: [
      { name: "Ground Beef 80/20", unit: "g", amount: "450" },
      { name: "Brioche Buns", unit: "whole", amount: "4" },
      { name: "Cheddar Cheese", unit: "slices", amount: "4" },
      { name: "Russet Potatoes", unit: "g", amount: "600" },
    ],
    category: "Lunch",
    servings: 4n,
  },
];

interface BrowseViewProps {
  onSelectRecipe: (recipe: Recipe) => void;
  onAddRecipe: () => void;
}

export default function BrowseView({
  onSelectRecipe,
  onAddRecipe,
}: BrowseViewProps) {
  const { localUser, isLocalAdmin } = useLocalAuth();
  const isAuthenticated = !!localUser || isLocalAdmin;

  const { data: backendRecipes, isLoading, isFetched } = useListRecipes();
  const initSeeds = useInitializeSeeds();

  const [favorites, setFavorites] = useState<bigint[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("favorites") || "[]").map(BigInt);
    } catch {
      return [];
    }
  });

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [seedsInitialized, setSeedsInitialized] = useState(false);

  const allRecipes: Recipe[] = useMemo(() => {
    if (backendRecipes && backendRecipes.length > 0) return backendRecipes;
    return SEED_RECIPES;
  }, [backendRecipes]);

  useEffect(() => {
    if (
      isFetched &&
      backendRecipes &&
      backendRecipes.length === 0 &&
      !seedsInitialized
    ) {
      setSeedsInitialized(true);
      initSeeds.mutate(undefined, { onError: () => {} });
    }
  }, [isFetched, backendRecipes, seedsInitialized, initSeeds]);

  const favoriteSet = useMemo(
    () => new Set(favorites.map((f) => f.toString())),
    [favorites],
  );

  const toggleFavorite = (id: bigint) => {
    setFavorites((prev) => {
      const next = prev.some((f) => f.toString() === id.toString())
        ? prev.filter((f) => f.toString() !== id.toString())
        : [...prev, id];
      localStorage.setItem("favorites", JSON.stringify(next.map(String)));
      return next;
    });
  };

  const filtered = useMemo(() => {
    let list = allRecipes;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q),
      );
    }
    if (category !== "All") {
      list = list.filter((r) => r.category === category);
    }
    if (showFavoritesOnly && isAuthenticated) {
      list = list.filter((r) => favoriteSet.has(r.id.toString()));
    }
    return list;
  }, [
    allRecipes,
    search,
    category,
    showFavoritesOnly,
    isAuthenticated,
    favoriteSet,
  ]);

  const handleToggleFavorite = (e: React.MouseEvent, recipe: Recipe) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error("Sign in to save favorites");
      return;
    }
    const isFav = favoriteSet.has(recipe.id.toString());
    toggleFavorite(recipe.id);
    toast.success(isFav ? "Removed from favorites" : "Added to favorites");
  };

  return (
    <div className="min-h-screen">
      {/* Hero banner */}
      <div
        className="relative h-52 sm:h-64 overflow-hidden grain-overlay"
        style={{
          backgroundImage: `url('/assets/generated/recipe-bg-texture.dim_1200x400.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/30 via-foreground/20 to-background" />
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-end pb-8">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-display text-4xl sm:text-5xl font-bold text-white drop-shadow-md"
          >
            Discover Recipes
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-white/80 mt-1 text-sm sm:text-base"
          >
            Explore, cook, and share your favorite dishes
          </motion.p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search + Add */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search recipes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
              data-ocid="browse.search_input"
            />
          </div>
          {isAuthenticated && (
            <Button
              onClick={onAddRecipe}
              className="gap-2 shrink-0"
              data-ocid="browse.add_recipe.button"
            >
              <Plus className="w-4 h-4" />
              Add Recipe
            </Button>
          )}
        </div>

        {/* Category tabs + favorites toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-8">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                type="button"
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
                  category === cat
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                }`}
                data-ocid="browse.category.tab"
              >
                {cat}
              </button>
            ))}
          </div>
          {isAuthenticated && (
            <button
              type="button"
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all border sm:ml-auto ${
                showFavoritesOnly
                  ? "bg-rose-500 text-white border-rose-500"
                  : "bg-card text-muted-foreground border-border hover:border-rose-300"
              }`}
              data-ocid="browse.favorites.toggle"
            >
              <Heart
                className={`w-3.5 h-3.5 ${showFavoritesOnly ? "fill-current" : ""}`}
              />
              Favorites Only
            </button>
          )}
        </div>

        {/* Loading */}
        {isLoading && (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            data-ocid="browse.loading_state"
          >
            {Array.from({ length: 6 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholder
              <div key={i} className="space-y-3">
                <Skeleton className="h-52 rounded-xl" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && filtered.length === 0 && (
          <div
            className="flex flex-col items-center justify-center py-24 text-center"
            data-ocid="recipe.card.empty_state"
          >
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <UtensilsCrossed className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-display text-xl font-semibold mb-2">
              No recipes found
            </h3>
            <p className="text-muted-foreground text-sm max-w-xs">
              {search
                ? `No results for "${search}"`
                : "No recipes in this category yet."}
            </p>
            {isAuthenticated && (
              <Button onClick={onAddRecipe} className="mt-6 gap-2">
                <Plus className="w-4 h-4" />
                Add the first recipe
              </Button>
            )}
          </div>
        )}

        {/* Recipe grid */}
        {!isLoading && filtered.length > 0 && (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
          >
            <AnimatePresence>
              {filtered.map((recipe, index) => (
                <RecipeCard
                  key={recipe.id.toString()}
                  recipe={recipe}
                  index={index + 1}
                  isFavorite={favoriteSet.has(recipe.id.toString())}
                  onSelect={() => onSelectRecipe(recipe)}
                  onToggleFavorite={(e) => handleToggleFavorite(e, recipe)}
                  isAuthenticated={isAuthenticated}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}

interface RecipeCardProps {
  recipe: Recipe;
  index: number;
  isFavorite: boolean;
  onSelect: () => void;
  onToggleFavorite: (e: React.MouseEvent) => void;
  isAuthenticated: boolean;
}

function RecipeCard({
  recipe,
  index,
  isFavorite,
  onSelect,
  onToggleFavorite,
  isAuthenticated,
}: RecipeCardProps) {
  const totalTime = Number(recipe.prepTime) + Number(recipe.cookTime);

  return (
    <motion.article
      variants={{
        hidden: { opacity: 0, y: 16 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
      }}
      className="group bg-card rounded-xl overflow-hidden shadow-card recipe-card-hover cursor-pointer border border-border/60"
      onClick={onSelect}
      data-ocid={`recipe.card.${index}`}
    >
      <div className="relative h-48 overflow-hidden bg-muted">
        {recipe.imageUrl ? (
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <UtensilsCrossed className="w-12 h-12 text-muted-foreground/30" />
          </div>
        )}
        <div className="absolute top-3 left-3">
          <Badge
            variant="secondary"
            className="text-xs font-medium bg-card/90 backdrop-blur-sm border-0"
          >
            {recipe.category}
          </Badge>
        </div>
        {isAuthenticated && (
          <button
            type="button"
            onClick={onToggleFavorite}
            className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all backdrop-blur-sm ${
              isFavorite
                ? "bg-rose-500 text-white shadow-md"
                : "bg-card/80 text-muted-foreground hover:bg-rose-50 hover:text-rose-500"
            }`}
            data-ocid={`recipe.favorite.button.${index}`}
            aria-label={
              isFavorite ? "Remove from favorites" : "Add to favorites"
            }
          >
            <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
          </button>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-display font-semibold text-base text-card-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {recipe.title}
        </h3>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {totalTime} min
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            {Number(recipe.servings)} servings
          </span>
        </div>
      </div>
    </motion.article>
  );
}
