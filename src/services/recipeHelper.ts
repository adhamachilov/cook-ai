import { Recipe, AIRecipeRequest } from '../types';
import { findImageForRecipe, getPlaceholderImage } from './imageSearchService';
import { getRecipeSuggestionsFromAI } from './ai';

// Track used recipe IDs to avoid duplicates
const usedRecipeIds = new Set<string>();

/**
 * Function to get an appropriate food image based on recipe details and ingredients
 */
export async function getFoodImageByRecipe(
  cuisineType: string = '', 
  title: string = '', 
  tags: string[] = [], 
  dietaryInfo: { isVegetarian: boolean; isVegan: boolean } = { isVegetarian: false, isVegan: false },
  ingredients: string = ''
): Promise<string> {
  try {
    console.log(`Finding image for recipe: ${title}`);
    
    // Use the image search service
    return await findImageForRecipe(
      title,
      cuisineType,
      tags,
      dietaryInfo,
      ingredients
    );
  } catch (error) {
    console.error('Error in getFoodImageByRecipe:', error);
    // Return a placeholder image if the service fails
    return getPlaceholderImage();
  }
}

/**
 * Gets relevant recipes based on ingredients using API calls only
 * This function uses the AI service to fetch recipes
 */
export async function getRelevantRecipes(
  ingredients: string[] = [], 
  dietaryPreferences: string[] = [], 
  cuisineType?: string, 
  offset: number = 0
): Promise<Recipe[]> {
  console.log('Getting API-based recipes for ingredients:', ingredients);
  console.log('Offset for pagination:', offset);
  
  try {
    // Create a request object
    const request: AIRecipeRequest = {
      ingredients,
      dietaryPreferences,
      cuisineType: cuisineType || ''
    };
    
    // Get recipes from AI service
    let recipes = await getRecipeSuggestionsFromAI(request, offset);
    
    // Filter out any recipes that were already used
    recipes = recipes.filter(recipe => !usedRecipeIds.has(recipe.id));
    
    // If AI successfully returned recipes, process them
    if (recipes && recipes.length > 0) {
      console.log(`Returning ${recipes.length} AI-generated recipes`);
      
      // Mark these as used
      recipes.forEach(recipe => usedRecipeIds.add(recipe.id));
      
      // Ensure each recipe has an image (async loading pattern)
      for (const recipe of recipes) {
        // Set a placeholder image initially
        recipe.imageUrl = getPlaceholderImage();
        
        // Start async image generation in the background
        getFoodImageByRecipe(
          recipe.cuisineType || '',
          recipe.title,
          recipe.tags || [],
          { 
            isVegetarian: recipe.dietaryInfo?.isVegetarian || false, 
            isVegan: recipe.dietaryInfo?.isVegan || false 
          },
          Array.isArray(recipe.ingredients) ? recipe.ingredients.join(', ') : ''
        ).then(imageUrl => {
          recipe.imageUrl = imageUrl;
        }).catch((error) => {
          console.error('Error setting recipe image:', error);
          // Keep the placeholder if image generation fails
        });
      }
      
      return recipes;
    } else {
      console.warn('AI service didn\'t return any recipes');
      return [];
    }
  } catch (error) {
    console.error('Error getting recipes from AI service:', error);
    return [];
  }
}
