import { AIRecipeRequest, Recipe } from '../types';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { buildPrompt } from './buildPrompt';
import { storeGeneratedRecipes } from './recipe-storage';
import { generateUUID } from '../utils/uuid';
import { normalizeIngredientMeasurements } from '../utils/recipe-normalizer';

/**
 * Calculate similarity between two strings using Levenshtein distance
 * Returns a value between 0 (completely different) and 1 (identical)
 */
function calculateStringSimilarity(str1: string, str2: string): number {
  // If either string is empty, return 0
  if (!str1 || !str2) return 0;
  
  // If strings are identical, return 1
  if (str1 === str2) return 1;
  
  // Calculate Levenshtein distance
  const len1 = str1.length;
  const len2 = str2.length;
  const matrix: number[][] = [];
  
  // Initialize matrix
  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }
  
  // Fill matrix
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i-1] === str2[j-1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i-1][j] + 1,      // deletion
        matrix[i][j-1] + 1,      // insertion
        matrix[i-1][j-1] + cost  // substitution
      );
    }
  }
  
  // Calculate similarity as 1 - normalized distance
  const maxLen = Math.max(len1, len2);
  return maxLen > 0 ? 1 - matrix[len1][len2] / maxLen : 1;
}

// We'll use timestamps in the recipe ID generation to ensure uniqueness

// Store previous recipe IDs to ensure uniqueness across requests
const previousRecipeIds = new Map<string, Set<string>>();

/**
 * Generates unique recipes based on provided ingredients and preferences
 * Can generate up to 6 recipes with maxResults parameter
 */
export async function generateUniqueRecipes(request: AIRecipeRequest, offset = 0): Promise<Recipe[]> {
  console.log('Generating recipes with:', request);
  
  // Create a unique request key based on the ingredients
  const requestKey = request.ingredients.sort().join('-').toLowerCase();
  
  // Initialize recipe ID tracking for this request if needed
  if (!previousRecipeIds.has(requestKey)) {
    previousRecipeIds.set(requestKey, new Set());
  }
  
  // Get the set of previously used recipe identifiers for this ingredient combination
  const usedIds = previousRecipeIds.get(requestKey)!;
  
  // Clear previous recipes if this is a new search (offset === 0 means first request)
  if (offset === 0) {
    console.log('New search, clearing previous recipe tracking');
    usedIds.clear();
  }
  
  try {
    // For debugging purposes, add a direct log of the API key
    const apiKey = process.env.GOOGLE_API_KEY || 'AIzaSyDGUmJF_-5O0Qp0tQgTB7L9pwgCdcM8Flk';
    console.log('Using API key (length):', apiKey.length);
    
    // Initialize the Google AI client
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    // Build the prompt for the AI - include offset to match expected arguments
    const offset = 0; // Default offset to 0
    const prompt = buildPrompt(request, offset);
    console.log('Using prompt:', prompt);
    
    try {
      // Generate the content
      const result = await model.generateContent(prompt);
      
      if (!result.response) {
        throw new Error('No response from AI model');
      }
      
      const text = result.response.text();
      console.log('Got response from API, length:', text.length);
      
      // Parse the recipes from the response
      const recipes = parseRecipes(text, request.ingredients);
      
      // If we couldn't parse any recipes, throw an error
      if (!recipes || recipes.length === 0) {
        throw new Error('Failed to parse recipes from response');
      }
      
      console.log(`Successfully generated ${recipes.length} recipes`);
      
      // Make sure to return the recipes at the end of the try block
      return ensureDistinctRecipes(recipes, request.maxResults || 6);
    } catch (aiError) {
      console.error('AI generation error:', aiError);
      // Fallback to predefined recipes if AI fails
      console.log('Using fallback recipes instead');
      return createFallbackRecipes(request.ingredients);
    }
    
    // Take only distinct recipes with maximum variety
    const ensureDistinctRecipes = (allRecipes: Recipe[], maxCount: number = 6): Recipe[] => {
      // If we don't have enough recipes, return what we have
      if (allRecipes.length <= maxCount) {
        return allRecipes;
      }
      
      // Get distinct recipe types to maximize variety
      const categorizedRecipes = new Map<string, Recipe[]>();
      
      // Group recipes by cuisine/cooking method
      allRecipes.forEach(recipe => {
        const category = recipe.cuisineType || 'Other';
        if (!categorizedRecipes.has(category)) {
          categorizedRecipes.set(category, []);
        }
        categorizedRecipes.get(category)!.push(recipe);
      });
      
      // Pick from different categories when possible
      const result: Recipe[] = [];
      const categories = Array.from(categorizedRecipes.keys());
      
      // First try to get one recipe from each different category
      for (let i = 0; i < categories.length && result.length < maxCount; i++) {
        const categoryRecipes = categorizedRecipes.get(categories[i])!;
        if (categoryRecipes.length > 0) {
          result.push(categoryRecipes.shift()!);
        }
      }
      
      // Fill remaining slots from any category
      while (result.length < maxCount && categories.some(cat => categorizedRecipes.get(cat)!.length > 0)) {
        for (let i = 0; i < categories.length && result.length < maxCount; i++) {
          const categoryRecipes = categorizedRecipes.get(categories[i])!;
          if (categoryRecipes.length > 0) {
            result.push(categoryRecipes.shift()!);
          }
        }
      }
      
      // Return exactly the requested number of recipes or all we have if less
      return result.slice(0, maxCount);
    };
    
    // Filter recipes that have already been shown to the user
    const nonRepeatingRecipes = recipes.filter((recipe: Recipe) => {
      // Generate a fingerprint for the recipe based on title and content
      const titleKey = recipe.title.toLowerCase().replace(/\s+/g, '');
      
      // Create a fingerprint of the recipe content to detect similar recipes
      const ingredientsKey = recipe.ingredients
        .map(i => i.toLowerCase().replace(/\s+/g, ''))
        .sort()
        .join('');
      
      const instructionsKey = recipe.instructions
        .map(i => i.toLowerCase().slice(0, 20)) // Take first 20 chars of each instruction
        .join('');
      
      // Combine into a single fingerprint
      const recipeFingerprint = `${titleKey}-${ingredientsKey.substring(0, 50)}-${instructionsKey.substring(0, 50)}`;
      
      // Check if we've seen a similar recipe before using the fingerprint
      const hasBeenSeen = Array.from(usedIds).some(id => {
        // Split the stored ID to get the title and fingerprint parts
        const parts = id.split('-fingerprint-');
        if (parts.length < 2) return false;
        
        // Compare fingerprints to detect similar recipes
        const storedFingerprint = parts[1];
        const similarity = calculateStringSimilarity(recipeFingerprint, storedFingerprint);
        
        // If similarity is above 0.7 (70%), consider it a repeat recipe
        return similarity > 0.7;
      });
      
      return !hasBeenSeen;
    });
    
    // Get distinct recipes based on requested count (max 6)
    const requestedCount = request.maxResults || 3; // Default to 3 if not specified
    const distinctRecipes = ensureDistinctRecipes(nonRepeatingRecipes, requestedCount);
    
    // If we couldn't get enough unique recipes, add some fallbacks
    const finalRecipes = distinctRecipes.length === requestedCount ? distinctRecipes : 
      [...distinctRecipes, ...createFallbackRecipes(request.ingredients).slice(0, requestedCount - distinctRecipes.length)];
    
    // Save recipe identifiers to prevent repeats in subsequent requests
    finalRecipes.forEach(recipe => {
      const titleKey = recipe.title.toLowerCase().replace(/\s+/g, '');
      
      // Create a fingerprint of the recipe content to detect similar recipes
      const ingredientsKey = recipe.ingredients
        .map(i => typeof i === 'string' ? i.toLowerCase().replace(/\s+/g, '') : '')
        .sort()
        .join('');
      
      const instructionsKey = recipe.instructions
        .map(i => typeof i === 'string' ? i.toLowerCase().slice(0, 20) : '') // Take first 20 chars of each instruction
        .join('');
      
      // Combine into a single fingerprint
      const recipeFingerprint = `${titleKey}-${ingredientsKey.substring(0, 50)}-${instructionsKey.substring(0, 50)}`;
      
      // Store the recipe ID with its fingerprint
      usedIds.add(`${recipe.id}-fingerprint-${recipeFingerprint}`);
    });
    
    // Ensure we're returning the requested number of recipes (max 6)
    console.log(`Returning ${finalRecipes.length} unique recipes (requested: ${requestedCount})`);
    
    // Save recipes to Supabase before returning them
    const recipesToReturn = finalRecipes.slice(0, requestedCount);
    storeGeneratedRecipes(recipesToReturn);
    
    return recipesToReturn;
    
  } catch (error) {
    console.error('Error generating recipes:', error);
    
    // Create fallback recipes with a warning message
    const fallbackRecipes = createFallbackRecipes(request.ingredients);
    console.log('Using fallback recipes');
    // Return the requested number of recipes (default to 3 if not specified)
    const requestedCount = request.maxResults || 3;
    return fallbackRecipes.slice(0, requestedCount);
  }
}

/**
 * Parses recipes from the AI response
 */
function parseRecipes(text: string, requestedIngredients: string[]): Recipe[] {
  try {
    // Try to extract JSON from the response
    const jsonMatches = text.match(/\[\s\S]*\]/);
    
    if (!jsonMatches) {
      console.error('No JSON array found in response');
      return [];
    }
    
    const jsonStr = jsonMatches[0];
    const parsedRecipes = JSON.parse(jsonStr);

    if (!Array.isArray(parsedRecipes)) {
      console.error('Parsed content is not an array');
      return [];
    }

    // Transform the parsed recipes into our Recipe type
    return parsedRecipes.map((recipe: any) => {
      // Generate a proper UUID for Supabase compatibility
      const uuid = generateUUID();
      
      // Get the original ingredients
      const originalIngredients = Array.isArray(recipe.ingredients) ? recipe.ingredients : [];
      
      // Apply our normalizer to fix unrealistic measurements
      const normalizedIngredients = normalizeIngredientMeasurements(originalIngredients);
      console.log('Normalized ingredients:', normalizedIngredients);

      // Ensure all required fields are present
      const transformedRecipe: Recipe = {
        id: uuid,
        title: recipe.title || `Recipe with ${requestedIngredients[0]}`,
        description: recipe.description || 'A delicious recipe made with your ingredients',
        ingredients: normalizedIngredients, // Use normalized ingredients
        instructions: Array.isArray(recipe.instructions) ? recipe.instructions : [],
        cookingTime: recipe.cookingTime || 30,
        servings: recipe.servings || 4,
        calories: recipe.calories || 0,
        imageUrl: '',  // We'll use placeholder images
        tags: Array.isArray(recipe.tags) ? recipe.tags : [],
        cuisineType: recipe.cuisineType || '',
        dietaryInfo: {
          isVegetarian: recipe.dietaryInfo?.isVegetarian || false,
          isVegan: recipe.dietaryInfo?.isVegan || false,
          isGlutenFree: recipe.dietaryInfo?.isGlutenFree || false,
          isDairyFree: recipe.dietaryInfo?.isDairyFree || false
        }
      };
      
      // Validate that the recipe contains the requested ingredients
      const ingredientsLower = transformedRecipe.ingredients.map(ing => ing.toLowerCase());
      const hasRequiredIngredients = requestedIngredients.every(ing => 
        ingredientsLower.some(recipeIng => recipeIng.includes(ing.toLowerCase()))
      );
      
      if (!hasRequiredIngredients) {
        console.warn('Recipe missing required ingredients, adding them');
        // Add the missing ingredients
        requestedIngredients.forEach(ing => {
          if (!ingredientsLower.some(recipeIng => recipeIng.includes(ing.toLowerCase()))) {
            transformedRecipe.ingredients.push(`${ing} (to taste)`);
          }
        });
      }
      
      return transformedRecipe;
    });
  } catch (error) {
    console.error('Error parsing recipes:', error);
    return [];
  }
}

/**
 * Creates diverse fallback recipes when API fails
 */
function createFallbackRecipes(ingredients: string[]): Recipe[] {
  // Generate diverse fallback recipes based on the requested ingredients
  const recipeVariations = [
    {
      type: 'Stir-Fry',
      cuisine: 'Asian',
      uniqueIngredients: ['soy sauce', 'ginger', 'sesame oil', 'bell peppers', 'bean sprouts'],
      cookTime: 20,
      calories: 320,
      instructions: [
        'Heat wok or large skillet over high heat.',
        'Add oil and minced garlic, stir quickly.',
        'Add proteins and cook until almost done.',
        'Add vegetables and stir-fry for 3-4 minutes.',
        'Pour sauce mixture over and toss to coat.',
        'Garnish with green onions and serve with rice.'
      ]
    },
    {
      type: 'Soup',
      cuisine: 'Comfort Food',
      uniqueIngredients: ['vegetable broth', 'bay leaf', 'thyme', 'celery', 'carrots'],
      cookTime: 45,
      calories: 280,
      instructions: [
        'Sauté onions, celery, and carrots in a large pot.',
        'Add broth, herbs, and main ingredients.',
        'Bring to a boil, then reduce to simmer for 30 minutes.',
        'Add any quick-cooking ingredients in the last 10 minutes.',
        'Adjust seasoning with salt and pepper.',
        'Serve hot with crusty bread or crackers.'
      ]
    },
    {
      type: 'Baked Casserole',
      cuisine: 'Homestyle',
      uniqueIngredients: ['breadcrumbs', 'mozzarella cheese', 'oregano', 'parsley', 'white sauce'],
      cookTime: 50,
      calories: 420,
      instructions: [
        'Preheat oven to 375°F (190°C).',
        'Prepare all ingredients and layer in a baking dish.',
        'Mix herbs into sauce and pour over the layers.',
        'Top with cheese and breadcrumbs.',
        'Bake covered for 30 minutes, then uncovered for 15 minutes until golden brown.',
        'Let rest for 10 minutes before serving.'
      ]
    },
    {
      type: 'Fresh Salad',
      cuisine: 'Mediterranean',
      uniqueIngredients: ['olive oil', 'lemon juice', 'cucumber', 'feta cheese', 'kalamata olives'],
      cookTime: 15,
      calories: 210,
      instructions: [
        'Wash and chop all vegetables into bite-sized pieces.',
        'Crumble cheese and prepare dressing by mixing oil, lemon juice, and herbs.',
        'Combine all ingredients in a large bowl.',
        'Toss with dressing just before serving.',
        'Garnish with fresh herbs and serve chilled.',
        'Can be stored in refrigerator for up to 24 hours.'
      ]
    },
    {
      type: 'One-Pot Wonder',
      cuisine: 'Fusion',
      uniqueIngredients: ['coconut milk', 'curry powder', 'turmeric', 'cilantro', 'lime'],
      cookTime: 35,
      calories: 380,
      instructions: [
        'Heat oil in a large pot over medium heat.',
        'Add aromatics and spices, cook until fragrant.',
        'Add main ingredients and stir to coat with spices.',
        'Pour in liquid ingredients and bring to a simmer.',
        'Cover and cook until all ingredients are tender.',
        'Finish with fresh herbs and a squeeze of lime.'
      ]
    },
    {
      type: 'Grilled Delight',
      cuisine: 'American',
      uniqueIngredients: ['barbecue sauce', 'honey', 'mustard', 'rosemary', 'lemon zest'],
      cookTime: 25,
      calories: 350,
      instructions: [
        'Preheat grill to medium-high heat.',
        'Prepare marinade by combining all sauce ingredients.',
        'Marinate main ingredients for at least 15 minutes.',
        'Grill, turning occasionally, until cooked through with nice grill marks.',
        'Brush with additional sauce during the last few minutes.',
        'Let rest before serving with your favorite sides.'
      ]
    }
  ];
  
  // Create diverse recipes using the variations and user ingredients
  return recipeVariations.map((variation, index) => {
    // Choose a different main ingredient for each recipe to increase diversity
    const mainIngredient = ingredients[index % ingredients.length] || ingredients[0] || 'Food';
    const recipeId = `fallback-${Date.now()}-${index}`;
    
    // Create a unique title combining the main ingredient and cooking method
    const title = `${mainIngredient} ${variation.type}`;
    
    // Create a more descriptive and unique description
    const description = `A delicious ${variation.cuisine.toLowerCase()} inspired ${variation.type.toLowerCase()} featuring ${mainIngredient} with ${variation.uniqueIngredients.slice(0, 2).join(' and ')}.`;
    
    // Create a unique ingredient list combining user ingredients and recipe-specific ingredients
    const recipeIngredients = [
      // Use the main ingredient with a specific quantity
      `${mainIngredient} (${index % 2 === 0 ? '2 cups, diced' : '400g'})`,
      // Add some of the other user-provided ingredients with different preparations
      ...ingredients
        .filter(ing => ing.toLowerCase() !== mainIngredient.toLowerCase())
        .slice(0, 3)
        .map((ing, i) => {
          const preps = ['sliced', 'diced', 'chopped', 'minced', 'grated'];
          const amounts = ['1 cup', '2 tablespoons', '100g', '1/2 cup', 'to taste'];
          return `${ing} (${amounts[i % amounts.length]}, ${preps[i % preps.length]})`;
        }),
      // Add the unique ingredients for this variation
      ...variation.uniqueIngredients.map((ing, i) => {
        const amounts = ['1 tablespoon', '2 teaspoons', '1/4 cup', 'a pinch', '3 tablespoons'];
        return `${ing} (${amounts[i % amounts.length]})`;
      })
    ];
    
    return {
      id: recipeId,
      title,
      description,
      ingredients: recipeIngredients,
      instructions: variation.instructions,
      cookingTime: variation.cookTime,
      servings: 3 + (index % 4), // Vary servings between 3-6
      calories: variation.calories + (index * 15), // Slightly vary calories
      imageUrl: '',
      tags: [variation.type, mainIngredient, variation.cuisine, ingredients[1] || 'Easy'],
      cuisineType: variation.cuisine,
      dietaryInfo: {
        isVegetarian: !ingredients.some(ing => ['chicken', 'beef', 'pork', 'fish', 'meat'].includes(ing.toLowerCase())),
        isVegan: !ingredients.some(ing => ['chicken', 'beef', 'pork', 'fish', 'meat', 'milk', 'cheese', 'egg', 'honey'].includes(ing.toLowerCase())),
        isGlutenFree: !ingredients.some(ing => ['flour', 'bread', 'pasta', 'wheat'].includes(ing.toLowerCase())),
        isDairyFree: !ingredients.some(ing => ['milk', 'cheese', 'cream', 'butter', 'yogurt'].includes(ing.toLowerCase()))
      }
    };
  });
}

// Export the function for use in the app
export const getRecipes = generateUniqueRecipes;
