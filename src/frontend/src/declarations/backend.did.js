// @ts-nocheck
export const idlFactory = ({ IDL }) => {
  const RecipeIngredient = IDL.Record({
    name: IDL.Text,
    unit: IDL.Text,
    amount: IDL.Text,
  });
  const Recipe = IDL.Record({
    id: IDL.Nat,
    title: IDL.Text,
    authorId: IDL.Principal,
    createdAt: IDL.Int,
    cookTime: IDL.Nat,
    description: IDL.Text,
    steps: IDL.Vec(IDL.Text),
    imageUrl: IDL.Text,
    prepTime: IDL.Nat,
    recipeIngredients: IDL.Vec(RecipeIngredient),
    category: IDL.Text,
    servings: IDL.Nat,
  });
  const Ingredient = IDL.Record({
    name: IDL.Text,
    unit: IDL.Text,
    category: IDL.Text,
  });
  const Feedback = IDL.Record({
    id: IDL.Nat,
    name: IDL.Text,
    submittedAt: IDL.Int,
    email: IDL.Text,
    message: IDL.Text,
    phone: IDL.Text,
  });
  const JobApplication = IDL.Record({
    id: IDL.Nat,
    name: IDL.Text,
    post: IDL.Text,
    submittedAt: IDL.Int,
    email: IDL.Text,
    phone: IDL.Text,
  });
  const LocalUser = IDL.Record({
    name: IDL.Text,
    email: IDL.Text,
    passwordHash: IDL.Text,
    registeredAt: IDL.Int,
  });
  const RegisterLocalUserResult = IDL.Variant({
    ok: IDL.Null,
    err: IDL.Text,
  });
  return IDL.Service({
    addIngredient: IDL.Func([Ingredient], [], []),
    createRecipe: IDL.Func([Recipe], [IDL.Nat], []),
    deleteIngredient: IDL.Func([IDL.Text], [], []),
    deleteRecipe: IDL.Func([IDL.Nat], [], []),
    filterByCategory: IDL.Func([IDL.Text], [IDL.Vec(Recipe)], ['query']),
    getFeedbackList: IDL.Func([], [IDL.Vec(Feedback)], ['query']),
    getIngredient: IDL.Func([IDL.Text], [IDL.Opt(Ingredient)], ['query']),
    getJobApplications: IDL.Func([], [IDL.Vec(JobApplication)], ['query']),
    getLocalUsers: IDL.Func([], [IDL.Vec(LocalUser)], ['query']),
    getRecipe: IDL.Func([IDL.Nat], [IDL.Opt(Recipe)], ['query']),
    initializeSeeds: IDL.Func([], [], []),
    listIngredients: IDL.Func([], [IDL.Vec(Ingredient)], ['query']),
    listRecipes: IDL.Func([], [IDL.Vec(Recipe)], ['query']),
    registerLocalUser: IDL.Func(
      [IDL.Text, IDL.Text, IDL.Text],
      [RegisterLocalUserResult],
      []
    ),
    searchRecipes: IDL.Func([IDL.Text], [IDL.Vec(Recipe)], ['query']),
    submitFeedback: IDL.Func([IDL.Text, IDL.Text, IDL.Text, IDL.Text], [], []),
    submitJobApplication: IDL.Func(
      [IDL.Text, IDL.Text, IDL.Text, IDL.Text],
      [],
      []
    ),
    updateRecipe: IDL.Func([IDL.Nat, Recipe], [], []),
  });
};
export const init = ({ IDL }) => [];
