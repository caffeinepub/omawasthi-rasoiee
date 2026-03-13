import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useCreateRecipe, useUpdateRecipe } from "@/hooks/useQueries";
import { Principal } from "@dfinity/principal";
import { ArrowLeft, GripVertical, Loader2, Plus, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Recipe, RecipeIngredient } from "../backend.d";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const CATEGORIES = ["Breakfast", "Lunch", "Dinner", "Dessert", "Snack"];

interface RecipeFormProps {
  editRecipe?: Recipe | null;
  onBack: () => void;
  onSuccess: (recipe?: Recipe) => void;
}

interface FormIngredient {
  id: number;
  name: string;
  amount: string;
  unit: string;
}

export default function RecipeForm({
  editRecipe,
  onBack,
  onSuccess,
}: RecipeFormProps) {
  const { identity } = useInternetIdentity();
  const createRecipe = useCreateRecipe();
  const updateRecipe = useUpdateRecipe();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Dinner");
  const [prepTime, setPrepTime] = useState("15");
  const [cookTime, setCookTime] = useState("30");
  const [servings, setServings] = useState("4");
  const [imageUrl, setImageUrl] = useState("");
  const [ingredients, setIngredients] = useState<FormIngredient[]>([
    { id: Date.now(), name: "", amount: "", unit: "" },
  ]);
  const [steps, setSteps] = useState<Array<{ id: number; text: string }>>([
    { id: Date.now(), text: "" },
  ]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editRecipe) {
      setTitle(editRecipe.title);
      setDescription(editRecipe.description);
      setCategory(editRecipe.category);
      setPrepTime(String(editRecipe.prepTime));
      setCookTime(String(editRecipe.cookTime));
      setServings(String(editRecipe.servings));
      setImageUrl(editRecipe.imageUrl);
      setIngredients(
        editRecipe.recipeIngredients.length > 0
          ? editRecipe.recipeIngredients.map((ing, idx) => ({
              id: Date.now() + idx,
              name: ing.name,
              amount: ing.amount,
              unit: ing.unit,
            }))
          : [{ id: Date.now(), name: "", amount: "", unit: "" }],
      );
      setSteps(
        editRecipe.steps.length > 0
          ? editRecipe.steps.map((s, idx) => ({
              id: Date.now() + idx,
              text: s,
            }))
          : [{ id: Date.now(), text: "" }],
      );
    }
  }, [editRecipe]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = "Title is required";
    const validIngredients = ingredients.filter((i) => i.name.trim());
    if (validIngredients.length === 0)
      errs.ingredients = "At least one ingredient is required";
    const validSteps = steps.filter((s) => s.text.trim());
    if (validSteps.length === 0) errs.steps = "At least one step is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const authorId = identity?.getPrincipal() ?? Principal.anonymous();
    const recipeData: Recipe = {
      id: editRecipe ? editRecipe.id : 0n,
      title: title.trim(),
      description: description.trim(),
      category,
      prepTime: BigInt(Number.parseInt(prepTime) || 0),
      cookTime: BigInt(Number.parseInt(cookTime) || 0),
      servings: BigInt(Number.parseInt(servings) || 1),
      imageUrl: imageUrl.trim(),
      recipeIngredients: ingredients
        .filter((i) => i.name.trim())
        .map(
          (i): RecipeIngredient => ({
            name: i.name,
            amount: i.amount,
            unit: i.unit,
          }),
        ),
      steps: steps.filter((s) => s.text.trim()).map((s) => s.text),
      authorId,
      createdAt: editRecipe ? editRecipe.createdAt : BigInt(Date.now()),
    };

    try {
      if (editRecipe) {
        await updateRecipe.mutateAsync({
          id: editRecipe.id,
          recipe: recipeData,
        });
        toast.success("Recipe updated!");
      } else {
        const newId = await createRecipe.mutateAsync(recipeData);
        toast.success("Recipe created!");
        recipeData.id = newId;
      }
      onSuccess(recipeData);
    } catch {
      toast.error("Failed to save recipe");
    }
  };

  const isPending = createRecipe.isPending || updateRecipe.isPending;

  const addIngredient = () =>
    setIngredients((prev) => [
      ...prev,
      { id: Date.now(), name: "", amount: "", unit: "" },
    ]);
  const removeIngredient = (i: number) =>
    setIngredients((prev) => prev.filter((_, idx) => idx !== i));
  const updateIngredient = (
    i: number,
    field: keyof FormIngredient,
    value: string,
  ) =>
    setIngredients((prev) =>
      prev.map((ing, idx) => (idx === i ? { ...ing, [field]: value } : ing)),
    );

  const addStep = () =>
    setSteps((prev) => [...prev, { id: Date.now(), text: "" }]);
  const removeStep = (i: number) =>
    setSteps((prev) => prev.filter((_, idx) => idx !== i));
  const updateStep = (i: number, value: string) =>
    setSteps((prev) =>
      prev.map((s, idx) => (idx === i ? { ...s, text: value } : s)),
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen"
    >
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-display text-2xl font-bold">
            {editRecipe ? "Edit Recipe" : "Create New Recipe"}
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-8"
          data-ocid="form.loading_state"
        >
          {/* Basic info */}
          <section className="space-y-4">
            <h2 className="font-display text-lg font-semibold">
              Basic Information
            </h2>
            <Separator />

            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Grandma's Apple Pie"
                data-ocid="form.title.input"
              />
              {errors.title && (
                <p className="text-destructive text-xs">{errors.title}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your recipe..."
                rows={3}
                data-ocid="form.description.textarea"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger data-ocid="form.category.select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="servings">Servings</Label>
                <Input
                  id="servings"
                  type="number"
                  min="1"
                  value={servings}
                  onChange={(e) => setServings(e.target.value)}
                  data-ocid="form.servings.input"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="preptime">Prep Time (min)</Label>
                <Input
                  id="preptime"
                  type="number"
                  min="0"
                  value={prepTime}
                  onChange={(e) => setPrepTime(e.target.value)}
                  data-ocid="form.preptime.input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cooktime">Cook Time (min)</Label>
                <Input
                  id="cooktime"
                  type="number"
                  min="0"
                  value={cookTime}
                  onChange={(e) => setCookTime(e.target.value)}
                  data-ocid="form.cooktime.input"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageurl">Image URL</Label>
              <Input
                id="imageurl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
                data-ocid="form.imageurl.input"
              />
            </div>
          </section>

          {/* Ingredients */}
          <section className="space-y-4">
            <h2 className="font-display text-lg font-semibold">Ingredients</h2>
            <Separator />
            {errors.ingredients && (
              <p className="text-destructive text-xs">{errors.ingredients}</p>
            )}

            <div className="space-y-3">
              {ingredients.map((ing, i) => (
                <div
                  key={ing.id}
                  className="flex gap-2 items-start"
                  data-ocid={`form.ingredient.input.${i + 1}`}
                >
                  <div className="grid grid-cols-3 gap-2 flex-1">
                    <Input
                      placeholder="Ingredient name"
                      value={ing.name}
                      onChange={(e) =>
                        updateIngredient(i, "name", e.target.value)
                      }
                      className="col-span-3 sm:col-span-1"
                    />
                    <Input
                      placeholder="Amount"
                      value={ing.amount}
                      onChange={(e) =>
                        updateIngredient(i, "amount", e.target.value)
                      }
                    />
                    <Input
                      placeholder="Unit"
                      value={ing.unit}
                      onChange={(e) =>
                        updateIngredient(i, "unit", e.target.value)
                      }
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeIngredient(i)}
                    disabled={ingredients.length === 1}
                    className="shrink-0 text-muted-foreground hover:text-destructive"
                    data-ocid={`form.ingredient.remove_button.${i + 1}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addIngredient}
              className="gap-2"
              data-ocid="form.add_ingredient.button"
            >
              <Plus className="w-4 h-4" />
              Add Ingredient
            </Button>
          </section>

          {/* Steps */}
          <section className="space-y-4">
            <h2 className="font-display text-lg font-semibold">Instructions</h2>
            <Separator />
            {errors.steps && (
              <p className="text-destructive text-xs">{errors.steps}</p>
            )}

            <div className="space-y-3">
              {steps.map((step, i) => (
                <div key={step.id} className="flex gap-2 items-start">
                  <span className="shrink-0 w-7 h-7 mt-2 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </span>
                  <Textarea
                    placeholder={`Step ${i + 1}...`}
                    value={step.text}
                    onChange={(e) => updateStep(i, e.target.value)}
                    rows={2}
                    className="flex-1"
                    data-ocid={`form.step.textarea.${i + 1}`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeStep(i)}
                    disabled={steps.length === 1}
                    className="shrink-0 mt-1 text-muted-foreground hover:text-destructive"
                    data-ocid={`form.step.remove_button.${i + 1}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addStep}
              className="gap-2"
              data-ocid="form.add_step.button"
            >
              <Plus className="w-4 h-4" />
              Add Step
            </Button>
          </section>

          {/* Submit */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isPending}
              className="flex-1 gap-2"
              data-ocid="form.save.submit_button"
            >
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {isPending
                ? "Saving..."
                : editRecipe
                  ? "Update Recipe"
                  : "Create Recipe"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              data-ocid="form.cancel.button"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
