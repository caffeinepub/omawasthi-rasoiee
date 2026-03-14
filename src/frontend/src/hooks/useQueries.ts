import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Feedback,
  Ingredient,
  JobApplication,
  LocalUser,
  Recipe,
} from "../backend.d";
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

export function useGetLocalUsers() {
  const { actor, isFetching } = useActor();
  return useQuery<LocalUser[]>({
    queryKey: ["localUsers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLocalUsers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetJobApplications() {
  const { actor, isFetching } = useActor();
  return useQuery<JobApplication[]>({
    queryKey: ["jobApplications"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getJobApplications();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetFeedbackList() {
  const { actor, isFetching } = useActor();
  return useQuery<Feedback[]>({
    queryKey: ["feedbackList"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFeedbackList();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitJobApplication() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      email,
      phone,
      post,
    }: {
      name: string;
      email: string;
      phone: string;
      post: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.submitJobApplication(name, email, phone, post);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["jobApplications"] }),
  });
}

export function useSubmitFeedback() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      email,
      phone,
      message,
    }: {
      name: string;
      email: string;
      phone: string;
      message: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.submitFeedback(name, email, phone, message);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["feedbackList"] }),
  });
}

export function useRegisterLocalUser() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      name,
      email,
      passwordHash,
    }: {
      name: string;
      email: string;
      passwordHash: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.registerLocalUser(name, email, passwordHash);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["localUsers"] }),
  });
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

export function useInitializeSeeds() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.initializeSeeds();
    },
  });
}

export function useDeleteIngredient() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.deleteIngredient(name);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["ingredients"] }),
  });
}
