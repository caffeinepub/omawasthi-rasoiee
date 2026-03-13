import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAddIngredient, useListIngredients } from "@/hooks/useQueries";
import { ArrowLeft, Edit2, Package, Plus } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Ingredient } from "../backend.d";

const INGREDIENT_CATEGORIES = [
  "produce",
  "dairy",
  "meat",
  "grains",
  "spices",
  "other",
];

interface IngredientsManagerProps {
  onBack: () => void;
}

export default function IngredientsManager({
  onBack,
}: IngredientsManagerProps) {
  const { data: ingredients = [], isLoading } = useListIngredients();
  const addIngredient = useAddIngredient();

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editIngredient, setEditIngredient] = useState<Ingredient | null>(null);
  const [newName, setNewName] = useState("");
  const [newUnit, setNewUnit] = useState("");
  const [newCategory, setNewCategory] = useState("other");
  const [nameError, setNameError] = useState("");

  const openAdd = () => {
    setEditIngredient(null);
    setNewName("");
    setNewUnit("");
    setNewCategory("other");
    setNameError("");
    setShowAddDialog(true);
  };

  const openEdit = (ingredient: Ingredient) => {
    setEditIngredient(ingredient);
    setNewName(ingredient.name);
    setNewUnit(ingredient.unit);
    setNewCategory(ingredient.category || "other");
    setNameError("");
    setShowAddDialog(true);
  };

  const handleSave = async () => {
    if (!newName.trim()) {
      setNameError("Name is required");
      return;
    }
    try {
      await addIngredient.mutateAsync({
        name: newName.trim(),
        unit: newUnit.trim(),
        category: newCategory,
      });
      toast.success(editIngredient ? "Ingredient updated" : "Ingredient added");
      setShowAddDialog(false);
    } catch {
      toast.error("Failed to save ingredient");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen"
    >
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="font-display text-2xl font-bold">
                Ingredients Manager
              </h1>
              <p className="text-muted-foreground text-sm">
                Manage global ingredients library
              </p>
            </div>
          </div>
          <Button
            onClick={openAdd}
            className="gap-2"
            data-ocid="ingredients.add.button"
          >
            <Plus className="w-4 h-4" />
            Add Ingredient
          </Button>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholder
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && ingredients.length === 0 && (
          <div
            className="flex flex-col items-center justify-center py-24 text-center"
            data-ocid="ingredients.empty_state"
          >
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <Package className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-display text-xl font-semibold mb-2">
              No ingredients yet
            </h3>
            <p className="text-muted-foreground text-sm">
              Add your first ingredient to the library.
            </p>
            <Button onClick={openAdd} className="mt-6 gap-2">
              <Plus className="w-4 h-4" />
              Add Ingredient
            </Button>
          </div>
        )}

        {/* Table */}
        {!isLoading && ingredients.length > 0 && (
          <div className="rounded-xl border border-border overflow-hidden">
            <Table data-ocid="ingredients.table">
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Name</TableHead>
                  <TableHead className="font-semibold">Unit</TableHead>
                  <TableHead className="font-semibold">Category</TableHead>
                  <TableHead className="text-right font-semibold">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ingredients.map((ingredient, index) => (
                  <TableRow
                    key={ingredient.name}
                    data-ocid={`ingredients.row.${index + 1}`}
                  >
                    <TableCell className="font-medium">
                      {ingredient.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {ingredient.unit}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-accent text-accent-foreground text-xs capitalize">
                        {ingredient.category}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEdit(ingredient)}
                          className="h-8 w-8"
                          data-ocid={`ingredients.edit_button.${index + 1}`}
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent data-ocid="ingredients.dialog">
          <DialogHeader>
            <DialogTitle className="font-display">
              {editIngredient ? "Edit Ingredient" : "Add Ingredient"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="ing-name">Name *</Label>
              <Input
                id="ing-name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. All-Purpose Flour"
              />
              {nameError && (
                <p className="text-destructive text-xs">{nameError}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="ing-unit">Unit</Label>
              <Input
                id="ing-unit"
                value={newUnit}
                onChange={(e) => setNewUnit(e.target.value)}
                placeholder="e.g. g, ml, cups"
              />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={newCategory} onValueChange={setNewCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {INGREDIENT_CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c} className="capitalize">
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddDialog(false)}
              data-ocid="ingredients.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={addIngredient.isPending}
              data-ocid="ingredients.save_button"
            >
              {addIngredient.isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
