import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useDeleteRecipe } from "@/hooks/useQueries";
import {
  ArrowLeft,
  ChefHat,
  Clock,
  Edit2,
  Heart,
  Timer,
  Trash2,
  Users,
  UtensilsCrossed,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Recipe } from "../backend.d";
import { useLocalAuth } from "../hooks/useLocalAuth";

interface RecipeDetailProps {
  recipe: Recipe;
  onBack: () => void;
  onEdit: (recipe: Recipe) => void;
  isAdmin: boolean;
}

export default function RecipeDetail({
  recipe,
  onBack,
  onEdit,
  isAdmin,
}: RecipeDetailProps) {
  const { localUser } = useLocalAuth();
  const isAuthenticated = !!localUser || isAdmin;
  const canModify = isAuthenticated;

  const deleteRecipe = useDeleteRecipe();

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isFavorite, setIsFavorite] = useState(() => {
    try {
      const stored = JSON.parse(
        localStorage.getItem("favorites") || "[]",
      ) as string[];
      return stored.includes(recipe.id.toString());
    } catch {
      return false;
    }
  });

  const toggleFavorite = () => {
    if (!isAuthenticated) {
      toast.error("Sign in to save favorites");
      return;
    }
    const stored = (() => {
      try {
        return JSON.parse(
          localStorage.getItem("favorites") || "[]",
        ) as string[];
      } catch {
        return [] as string[];
      }
    })();
    const id = recipe.id.toString();
    const next = stored.includes(id)
      ? stored.filter((f) => f !== id)
      : [...stored, id];
    localStorage.setItem("favorites", JSON.stringify(next));
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? "Removed from favorites" : "Added to favorites");
  };

  const handleDelete = async () => {
    try {
      await deleteRecipe.mutateAsync(recipe.id);
      toast.success("Recipe deleted");
      setShowDeleteDialog(false);
      onBack();
    } catch {
      toast.error("Failed to delete recipe");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen"
    >
      {/* Hero */}
      <div className="relative h-72 sm:h-96 overflow-hidden bg-muted">
        {recipe.imageUrl ? (
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <UtensilsCrossed className="w-16 h-16 text-muted-foreground/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

        {/* Back button */}
        <div className="absolute top-4 left-4">
          <Button
            variant="secondary"
            size="sm"
            onClick={onBack}
            className="gap-2 bg-card/80 backdrop-blur-sm"
            data-ocid="detail.back.button"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>

        {/* Action buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          {isAuthenticated && (
            <Button
              variant="secondary"
              size="icon"
              onClick={toggleFavorite}
              className={`bg-card/80 backdrop-blur-sm ${
                isFavorite ? "text-rose-500" : ""
              }`}
              data-ocid="detail.favorite.button"
            >
              <Heart
                className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`}
              />
            </Button>
          )}
          {canModify && (
            <>
              <Button
                variant="secondary"
                size="icon"
                onClick={() => onEdit(recipe)}
                className="bg-card/80 backdrop-blur-sm"
                data-ocid="detail.edit.button"
              >
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                onClick={() => setShowDeleteDialog(true)}
                className="bg-card/80 backdrop-blur-sm text-destructive hover:text-destructive"
                data-ocid="detail.delete.button"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-3xl -mt-8 relative z-10">
        <motion.div
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Badge variant="secondary" className="mb-3">
            {recipe.category}
          </Badge>
          <h1 className="font-display text-3xl sm:text-4xl font-bold mb-4 leading-tight">
            {recipe.title}
          </h1>
          <p className="text-muted-foreground leading-relaxed mb-6">
            {recipe.description}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-muted/60 rounded-xl p-4 text-center">
              <Clock className="w-5 h-5 mx-auto mb-1 text-primary" />
              <div className="font-semibold text-sm">
                {Number(recipe.prepTime)} min
              </div>
              <div className="text-xs text-muted-foreground">Prep</div>
            </div>
            <div className="bg-muted/60 rounded-xl p-4 text-center">
              <Timer className="w-5 h-5 mx-auto mb-1 text-primary" />
              <div className="font-semibold text-sm">
                {Number(recipe.cookTime)} min
              </div>
              <div className="text-xs text-muted-foreground">Cook</div>
            </div>
            <div className="bg-muted/60 rounded-xl p-4 text-center">
              <Users className="w-5 h-5 mx-auto mb-1 text-primary" />
              <div className="font-semibold text-sm">
                {Number(recipe.servings)}
              </div>
              <div className="text-xs text-muted-foreground">Servings</div>
            </div>
          </div>

          <Separator className="mb-8" />

          {/* Ingredients */}
          <section className="mb-8">
            <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-primary" />
              Ingredients
            </h2>
            <ul className="space-y-2">
              {recipe.recipeIngredients.map((ing, i) => (
                <li
                  // biome-ignore lint/suspicious/noArrayIndexKey: static render list
                  key={i}
                  className="flex items-center gap-3 py-2.5 border-b border-border/60 last:border-0"
                >
                  <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                  <span className="font-medium text-sm min-w-[80px]">
                    {ing.amount} {ing.unit}
                  </span>
                  <span className="text-sm text-foreground">{ing.name}</span>
                </li>
              ))}
            </ul>
          </section>

          <Separator className="mb-8" />

          {/* Instructions */}
          <section>
            <h2 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
              <UtensilsCrossed className="w-5 h-5 text-primary" />
              Instructions
            </h2>
            <ol className="space-y-4">
              {recipe.steps.map((step, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: steps list is static
                <li key={i} className="flex gap-4">
                  <span className="shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </span>
                  <p className="text-sm leading-relaxed pt-1">{step}</p>
                </li>
              ))}
            </ol>
          </section>
        </motion.div>
      </div>

      {/* Delete confirm dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent data-ocid="detail.delete.dialog">
          <DialogHeader>
            <DialogTitle className="font-display">Delete Recipe?</DialogTitle>
            <DialogDescription>
              This will permanently delete "{recipe.title}". This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              data-ocid="detail.delete.cancel_button"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteRecipe.isPending}
              data-ocid="detail.delete.confirm_button"
            >
              {deleteRecipe.isPending ? "Deleting..." : "Delete Recipe"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

export function RecipeDetailSkeleton() {
  return (
    <div data-ocid="detail.loading_state">
      <Skeleton className="h-72 sm:h-96 w-full" />
      <div className="container mx-auto px-4 py-8 max-w-3xl space-y-4">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-20 w-full" />
      </div>
    </div>
  );
}
