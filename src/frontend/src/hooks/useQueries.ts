import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Ingredient, Recipe, UserProfile } from "../backend.d";
import { useActor } from "./useActor";

export function useListRecipes() {
  const { actor, isFetching } = useActor();
  return useQuery<Recipe[]>({
    queryKey: ["recipes"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listRecipes();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetRecipe(id: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Recipe | null>({
    queryKey: ["recipe", id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getRecipe(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useSearchRecipes(keyword: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Recipe[]>({
    queryKey: ["recipes", "search", keyword],
    queryFn: async () => {
      if (!actor) return [];
      if (!keyword.trim()) return actor.listRecipes();
      return actor.searchRecipes(keyword);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useListIngredients() {
  const { actor, isFetching } = useActor();
  return useQuery<Ingredient[]>({
    queryKey: ["ingredients"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listIngredients();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetFavorites() {
  const { actor, isFetching } = useActor();
  return useQuery<bigint[]>({
    queryKey: ["favorites"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFavorites();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const query = useQuery<UserProfile | null>({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useCreateRecipe() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (recipe: Recipe) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.createRecipe(recipe);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["recipes"] }),
  });
}

export function useUpdateRecipe() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, recipe }: { id: bigint; recipe: Recipe }) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.updateRecipe(id, recipe);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["recipes"] }),
  });
}

export function useDeleteRecipe() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.deleteRecipe(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["recipes"] }),
  });
}

export function useAddFavorite() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (recipeId: bigint) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.addFavorite(recipeId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["favorites"] }),
  });
}

export function useRemoveFavorite() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (recipeId: bigint) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.removeFavorite(recipeId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["favorites"] }),
  });
}

export function useAddIngredient() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (ingredient: Ingredient) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.addIngredient(ingredient);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ingredients"] }),
  });
}

export function useSaveUserProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["currentUserProfile"] }),
  });
}

export function useInitializeSeeds() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.initializeSeeds();
    },
  });
}
