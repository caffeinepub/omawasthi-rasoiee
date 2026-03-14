import Map "mo:core/Map";
import Set "mo:core/Set";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Keep accessControlState to avoid compatibility error with previous version
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

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

  public type Ingredient = {
    name : Text;
    unit : Text;
    category : Text;
  };

  public type UserProfile = {
    name : Text;
  };

  public type RegisteredUser = {
    principal : Principal;
    naam : Text;
    email : Text;
    mobile : Text;
    registeredAt : Int;
  };

  public type LocalUser = {
    name : Text;
    email : Text;
    passwordHash : Text;
    registeredAt : Int;
  };

  public type JobApplication = {
    id : Nat;
    name : Text;
    email : Text;
    phone : Text;
    post : Text;
    submittedAt : Int;
  };

  public type Feedback = {
    id : Nat;
    name : Text;
    email : Text;
    phone : Text;
    message : Text;
    submittedAt : Int;
  };

  public type RegisterLocalUserResult = {
    #ok;
    #err : Text;
  };

  var nextRecipeId = 1;
  var nextJobApplicationId = 1;
  var nextFeedbackId = 1;

  let recipes = Map.empty<Nat, Recipe>();
  let ingredients = Map.empty<Text, Ingredient>();
  // Keep these stable vars to avoid compatibility errors with previous version
  let userFavorites = Map.empty<Principal, Set.Set<Nat>>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let registeredUsers = Map.empty<Principal, RegisteredUser>();
  let localUsers = Map.empty<Text, LocalUser>();
  let jobApplications = Map.empty<Nat, JobApplication>();
  let feedbacks = Map.empty<Nat, Feedback>();

  // Recipes - no auth required
  public query func listRecipes() : async [Recipe] {
    recipes.values().toArray();
  };

  public query func getRecipe(id : Nat) : async ?Recipe {
    recipes.get(id);
  };

  public shared ({ caller }) func createRecipe(recipe : Recipe) : async Nat {
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

  public shared func updateRecipe(id : Nat, recipe : Recipe) : async () {
    recipes.add(id, recipe);
  };

  public shared func deleteRecipe(id : Nat) : async () {
    recipes.remove(id);
  };

  public query func searchRecipes(keyword : Text) : async [Recipe] {
    recipes.values().toArray().filter(
      func(r) {
        r.title.toLower().contains(#text(keyword.toLower()));
      }
    );
  };

  public query func filterByCategory(category : Text) : async [Recipe] {
    recipes.values().toArray().filter(
      func(r) { r.category.toLower() == category.toLower() }
    );
  };

  // Ingredients
  public query func listIngredients() : async [Ingredient] {
    ingredients.values().toArray();
  };

  public query func getIngredient(name : Text) : async ?Ingredient {
    ingredients.get(name);
  };

  public shared func addIngredient(ingredient : Ingredient) : async () {
    ingredients.add(ingredient.name, ingredient);
  };

  public shared func deleteIngredient(name : Text) : async () {
    ingredients.remove(name);
  };

  // Local Users
  public shared func registerLocalUser(name : Text, email : Text, passwordHash : Text) : async RegisterLocalUserResult {
    if (localUsers.containsKey(email)) {
      return #err("User already registered with this email");
    };
    let user : LocalUser = {
      name;
      email;
      passwordHash;
      registeredAt = Time.now();
    };
    localUsers.add(email, user);
    #ok;
  };

  public query func getLocalUsers() : async [LocalUser] {
    localUsers.values().toArray();
  };

  // Job Applications
  public shared func submitJobApplication(name : Text, email : Text, phone : Text, post : Text) : async () {
    let application : JobApplication = {
      id = nextJobApplicationId;
      name;
      email;
      phone;
      post;
      submittedAt = Time.now();
    };
    jobApplications.add(nextJobApplicationId, application);
    nextJobApplicationId += 1;
  };

  public query func getJobApplications() : async [JobApplication] {
    jobApplications.values().toArray();
  };

  // Feedback
  public shared func submitFeedback(name : Text, email : Text, phone : Text, message : Text) : async () {
    let feedback : Feedback = {
      id = nextFeedbackId;
      name;
      email;
      phone;
      message;
      submittedAt = Time.now();
    };
    feedbacks.add(nextFeedbackId, feedback);
    nextFeedbackId += 1;
  };

  public query func getFeedbackList() : async [Feedback] {
    feedbacks.values().toArray();
  };

  // Seeds
  public shared func initializeSeeds() : async () {
    let sampleIngredients = [
      { name = "Flour"; unit = "g"; category = "Baking" },
      { name = "Milk"; unit = "ml"; category = "Dairy" },
      { name = "Sugar"; unit = "g"; category = "Baking" },
      { name = "Salt"; unit = "tsp"; category = "Spices" },
      { name = "Butter"; unit = "g"; category = "Dairy" },
      { name = "Eggs"; unit = "pcs"; category = "Baking" },
      { name = "Carrots"; unit = "g"; category = "Vegetables" },
      { name = "Water"; unit = "ml"; category = "Beverages" },
      { name = "Chicken"; unit = "g"; category = "Meat" },
      { name = "Tomatoes"; unit = "pcs"; category = "Vegetables" },
    ];
    for (ingredient in sampleIngredients.values()) {
      ingredients.add(ingredient.name, ingredient);
    };
  };
};
