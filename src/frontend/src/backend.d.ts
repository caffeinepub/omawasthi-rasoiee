import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface RecipeIngredient {
    name: string;
    unit: string;
    amount: string;
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
export interface Ingredient {
    name: string;
    unit: string;
    category: string;
}
export interface UserProfile {
    name: string;
}
export interface RegisteredUser {
    principal: Principal;
    naam: string;
    email: string;
    mobile: string;
    registeredAt: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addFavorite(recipeId: bigint): Promise<void>;
    addIngredient(ingredient: Ingredient): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createRecipe(recipe: Recipe): Promise<bigint>;
    deleteRecipe(id: bigint): Promise<void>;
    filterByCategory(category: string): Promise<Array<Recipe>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getFavorites(): Promise<Array<bigint>>;
    getIngredient(name: string): Promise<Ingredient | null>;
    getRecipe(id: bigint): Promise<Recipe | null>;
    getRegisteredUsers(): Promise<Array<RegisteredUser>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    initializeSeeds(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    isFavorite(recipeId: bigint): Promise<boolean>;
    isUserRegistered(): Promise<boolean>;
    listIngredients(): Promise<Array<Ingredient>>;
    listRecipes(): Promise<Array<Recipe>>;
    registerUser(naam: string, email: string, mobile: string): Promise<void>;
    removeFavorite(recipeId: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchRecipes(keyword: string): Promise<Array<Recipe>>;
    updateRecipe(id: bigint, updatedRecipe: Recipe): Promise<void>;
}
