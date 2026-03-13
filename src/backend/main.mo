import Map "mo:core/Map";
import Set "mo:core/Set";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Principal "mo:core/Principal";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
  };

  public type Ingredient = {
    name : Text;
    unit : Text;
    category : Text;
  };

  public type RecipeIngredient = {
    name : Text;
    amount : Text;
    unit : Text;
  };

  public type Recipe = {
    id : Nat;
    title : Text;
    description : Text;
    category : Text;
    prepTime : Nat;
    cookTime : Nat;
    servings : Nat;
    imageUrl : Text;
    recipeIngredients : [RecipeIngredient];
    steps : [Text];
    authorId : Principal;
    createdAt : Int;
  };

  var nextRecipeId = 1;

  let recipes = Map.empty<Nat, Recipe>();
  let ingredients = Map.empty<Text, Ingredient>();
  let userFavorites = Map.empty<Principal, Set.Set<Nat>>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Recipe CRUD
  public shared ({ caller }) func createRecipe(recipe : Recipe) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can create recipes");
    };

    let recipeId = nextRecipeId;
    nextRecipeId += 1;

    let newRecipe : Recipe = {
      id = recipeId;
      title = recipe.title;
      description = recipe.description;
      category = recipe.category;
      prepTime = recipe.prepTime;
      cookTime = recipe.cookTime;
      servings = recipe.servings;
      imageUrl = recipe.imageUrl;
      recipeIngredients = recipe.recipeIngredients;
      steps = recipe.steps;
      authorId = caller;
      createdAt = Time.now();
    };

    recipes.add(recipeId, newRecipe);
    recipeId;
  };

  public query ({ caller }) func getRecipe(id : Nat) : async ?Recipe {
    recipes.get(id);
  };

  public shared ({ caller }) func updateRecipe(id : Nat, updatedRecipe : Recipe) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can update recipes");
    };

    let existingRecipe = switch (recipes.get(id)) {
      case (null) { Runtime.trap("Recipe not found") };
      case (?recipe) { recipe };
    };

    if (existingRecipe.authorId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only the author or admin can update this recipe");
    };

    recipes.add(id, updatedRecipe);
  };

  public shared ({ caller }) func deleteRecipe(id : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can delete recipes");
    };

    let existingRecipe = switch (recipes.get(id)) {
      case (null) { Runtime.trap("Recipe not found") };
      case (?recipe) { recipe };
    };

    if (existingRecipe.authorId != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only the author or admin can delete this recipe");
    };

    recipes.remove(id);
  };

  public query ({ caller }) func listRecipes() : async [Recipe] {
    recipes.values().toArray();
  };

  // Ingredient CRUD
  public shared ({ caller }) func addIngredient(ingredient : Ingredient) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can add ingredients");
    };
    ingredients.add(ingredient.name, ingredient);
  };

  public query ({ caller }) func getIngredient(name : Text) : async ?Ingredient {
    ingredients.get(name);
  };

  public query ({ caller }) func listIngredients() : async [Ingredient] {
    ingredients.values().toArray();
  };

  // Favorites
  public shared ({ caller }) func addFavorite(recipeId : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can add favorites");
    };

    if (not recipes.containsKey(recipeId)) {
      Runtime.trap("Recipe does not exist");
    };

    let favorites = switch (userFavorites.get(caller)) {
      case (null) { Set.singleton<Nat>(recipeId) };
      case (?set) {
        set.add(recipeId);
        set;
      };
    };

    userFavorites.add(caller, favorites);
  };

  public shared ({ caller }) func removeFavorite(recipeId : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can remove favorites");
    };

    switch (userFavorites.get(caller)) {
      case (null) {
        Runtime.trap("No favorites found for user");
      };
      case (?favorites) {
        if (favorites.contains(recipeId)) {
          let newFavorites = favorites.clone();
          newFavorites.remove(recipeId);
          if (newFavorites.isEmpty()) {
            userFavorites.remove(caller);
          } else {
            userFavorites.add(caller, newFavorites);
          };
        };
      };
    };
  };

  public query ({ caller }) func getFavorites() : async [Nat] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view favorites");
    };

    switch (userFavorites.get(caller)) {
      case (null) { [] };
      case (?favorites) { favorites.toArray() };
    };
  };

  public query ({ caller }) func isFavorite(recipeId : Nat) : async Bool {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can check favorites");
    };

    switch (userFavorites.get(caller)) {
      case (null) { false };
      case (?favorites) { favorites.contains(recipeId) };
    };
  };

  // Search and Filter
  public query ({ caller }) func searchRecipes(keyword : Text) : async [Recipe] {
    recipes.values().toArray().filter(
      func(r) {
        r.title.toLower().contains(#text(keyword.toLower()));
      }
    );
  };

  public query ({ caller }) func filterByCategory(category : Text) : async [Recipe] {
    recipes.values().toArray().filter(
      func(r) { r.category.toLower() == category.toLower() }
    );
  };

  // Seed data
  public shared ({ caller }) func initializeSeeds() : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can initialize seeds");
    };

    let sampleIngredients = [
      {
        name = "Flour";
        unit = "g";
        category = "Baking";
      },
      {
        name = "Milk";
        unit = "ml";
        category = "Dairy";
      },
      {
        name = "Sugar";
        unit = "g";
        category = "Baking";
      },
      {
        name = "Salt";
        unit = "tsp";
        category = "Spices";
      },
      {
        name = "Butter";
        unit = "g";
        category = "Dairy";
      },
      {
        name = "Eggs";
        unit = "pcs";
        category = "Baking";
      },
      {
        name = "Carrots";
        unit = "g";
        category = "Vegetables";
      },
      {
        name = "Water";
        unit = "ml";
        category = "Beverages";
      },
      {
        name = "Chicken";
        unit = "g";
        category = "Meat";
      },
      {
        name = "Tomatoes";
        unit = "pcs";
        category = "Vegetables";
      },
    ];

    for (ingredient in sampleIngredients.values()) {
      ingredients.add(ingredient.name, ingredient);
    };
  };
};
