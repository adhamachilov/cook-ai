export interface Recipe {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  ingredients: string[];
  instructions: string[];
  cookingTime: number;
  servings: number;
  calories: number;
  tags: string[];
  cuisineType: string;
  dietaryInfo: {
    isVegetarian: boolean;
    isVegan: boolean;
    isGlutenFree: boolean;
    isDairyFree: boolean;
  };
}

export interface IngredientItem {
  id: string;
  name: string;
}

export interface AIRecipeRequest {
  ingredients: string[];
  dietaryPreferences?: string[];
  excludeIngredients?: string[];
  cuisineType?: string;
  useAI?: boolean;
}

export interface AIRecipeResponse {
  recipes: Recipe[];
}

export type DietaryPreference = 'vegetarian' | 'vegan' | 'gluten-free' | 'dairy-free';

export type CuisineType = 
  'italian' | 
  'mexican' | 
  'chinese' | 
  'indian' | 
  'french' | 
  'japanese' | 
  'american' | 
  'mediterranean' | 
  'thai' | 
  'korean';