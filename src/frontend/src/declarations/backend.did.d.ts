/* eslint-disable */

// @ts-nocheck

import type { ActorMethod } from '@icp-sdk/core/agent';
import type { IDL } from '@icp-sdk/core/candid';
import type { Principal } from '@icp-sdk/core/principal';

export interface Feedback {
  'id' : bigint,
  'name' : string,
  'submittedAt' : bigint,
  'email' : string,
  'message' : string,
  'phone' : string,
}
export interface Ingredient {
  'name' : string,
  'unit' : string,
  'category' : string,
}
export interface JobApplication {
  'id' : bigint,
  'name' : string,
  'post' : string,
  'submittedAt' : bigint,
  'email' : string,
  'phone' : string,
}
export interface LocalUser {
  'name' : string,
  'email' : string,
  'passwordHash' : string,
  'registeredAt' : bigint,
}
export interface Recipe {
  'id' : bigint,
  'title' : string,
  'authorId' : Principal,
  'createdAt' : bigint,
  'cookTime' : bigint,
  'description' : string,
  'steps' : Array<string>,
  'imageUrl' : string,
  'prepTime' : bigint,
  'recipeIngredients' : Array<RecipeIngredient>,
  'category' : string,
  'servings' : bigint,
}
export interface RecipeIngredient {
  'name' : string,
  'unit' : string,
  'amount' : string,
}
export type RegisterLocalUserResult = { 'ok' : null } |
  { 'err' : string };
export interface _SERVICE {
  'addIngredient' : ActorMethod<[Ingredient], undefined>,
  'createRecipe' : ActorMethod<[Recipe], bigint>,
  'deleteIngredient' : ActorMethod<[string], undefined>,
  'deleteRecipe' : ActorMethod<[bigint], undefined>,
  'filterByCategory' : ActorMethod<[string], Array<Recipe>>,
  'getFeedbackList' : ActorMethod<[], Array<Feedback>>,
  'getIngredient' : ActorMethod<[string], [] | [Ingredient]>,
  'getJobApplications' : ActorMethod<[], Array<JobApplication>>,
  'getLocalUsers' : ActorMethod<[], Array<LocalUser>>,
  'getRecipe' : ActorMethod<[bigint], [] | [Recipe]>,
  'initializeSeeds' : ActorMethod<[], undefined>,
  'listIngredients' : ActorMethod<[], Array<Ingredient>>,
  'listRecipes' : ActorMethod<[], Array<Recipe>>,
  'registerLocalUser' : ActorMethod<
    [string, string, string],
    RegisterLocalUserResult
  >,
  'searchRecipes' : ActorMethod<[string], Array<Recipe>>,
  'submitFeedback' : ActorMethod<[string, string, string, string], undefined>,
  'submitJobApplication' : ActorMethod<
    [string, string, string, string],
    undefined
  >,
  'updateRecipe' : ActorMethod<[bigint, Recipe], undefined>,
}
export declare const idlService: IDL.ServiceClass;
export declare const idlInitArgs: IDL.Type[];
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
