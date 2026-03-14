import type { Principal } from "@icp-sdk/core/principal";
export interface LocalUser {
    name: string;
    email: string;
    passwordHash: string;
    registeredAt: bigint;
}
export type RegisterLocalUserResult = {
    __kind__: "ok";
    ok: null;
} | {
    __kind__: "err";
    err: string;
};
export interface Ingredient {
    name: string;
    unit: string;
    category: string;
}
export interface Feedback {
    id: bigint;
    name: string;
    submittedAt: bigint;
    email: string;
    message: string;
    phone: string;
}
export interface JobApplication {
    id: bigint;
    name: string;
    post: string;
    submittedAt: bigint;
    email: string;
    phone: string;
}
export interface Recipe {
    id: bigint;
    title: string;
    authorId: Principal;
    createdAt: bigint;
    cookTime: bigint;
    description: string;
    steps: Array<string>;
    imageUrl: string;
    prepTime: bigint;
    recipeIngredients: Array<RecipeIngredient>;
    category: string;
    servings: bigint;
}
export interface RecipeIngredient {
    name: string;
    unit: string;
    amount: string;
}
export interface backendInterface {
    addIngredient(ingredient: Ingredient): Promise<void>;
    createRecipe(recipe: Recipe): Promise<bigint>;
    deleteIngredient(name: string): Promise<void>;
    deleteRecipe(id: bigint): Promise<void>;
    filterByCategory(category: string): Promise<Array<Recipe>>;
    getFeedbackList(): Promise<Array<Feedback>>;
    getIngredient(name: string): Promise<Ingredient | null>;
    getJobApplications(): Promise<Array<JobApplication>>;
    getLocalUsers(): Promise<Array<LocalUser>>;
    getRecipe(id: bigint): Promise<Recipe | null>;
    initializeSeeds(): Promise<void>;
    listIngredients(): Promise<Array<Ingredient>>;
    listRecipes(): Promise<Array<Recipe>>;
    registerLocalUser(name: string, email: string, passwordHash: string): Promise<RegisterLocalUserResult>;
    searchRecipes(keyword: string): Promise<Array<Recipe>>;
    submitFeedback(name: string, email: string, phone: string, message: string): Promise<void>;
    submitJobApplication(name: string, email: string, phone: string, post: string): Promise<void>;
    updateRecipe(id: bigint, updatedRecipe: Recipe): Promise<void>;
}
