# Recipes Book

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Recipe browsing: list all recipes with search and category filter
- Recipe detail view: full recipe with ingredients, steps, and metadata
- Recipe CRUD: create, edit, and delete recipes with complex form (title, description, category, prep/cook time, servings, image URL, ingredients list, step-by-step instructions)
- Ingredient management: global ingredient library with CRUD (name, unit, category)
- Favorites: authenticated users can save/unsave recipes to a personal favorites list
- User authentication via authorization component
- Sample seed data for recipes and ingredients

### Modify
N/A

### Remove
N/A

## Implementation Plan
1. Backend: recipes store (id, title, description, category, prepTime, cookTime, servings, imageUrl, ingredients[], steps[], authorId, createdAt), ingredients store (id, name, unit, category), favorites per user
2. Backend APIs: CRUD for recipes, CRUD for ingredients, toggle/list favorites, search + filter recipes
3. Frontend: 4 main views - Browse (recipe grid), Recipe Detail, Recipe Form (create/edit), Ingredients Manager
4. Navigation with auth-aware header
5. Complex form: dynamic ingredient rows (add/remove), dynamic step rows, validation
