import { AIRecipeRequest, Recipe } from '../types';
import { GoogleGenerativeAI } from '@google/generative-ai';

// API key for Google Generative AI
const API_KEY = 'AIzaSyCUNZNb-Z696gRKZr_rh7KwdTJaG-_iYIw';

// Fallback recipes that will always work if the AI fails
const FALLBACK_RECIPES: Recipe[] = [
  {
    id: 'fallback-pasta',
    title: 'Quick Pasta Primavera',
    description: 'A simple and delicious pasta dish with fresh vegetables',
    imageUrl: '',
    ingredients: [
      '8 oz pasta',
      '2 tbsp olive oil',
      '2 cloves garlic, minced',
      '1 cup mixed vegetables (bell peppers, zucchini, cherry tomatoes)',
      '1/4 cup grated parmesan',
      'Salt and pepper to taste'
    ],
    instructions: [
      'Cook pasta according to package instructions',
      'Heat olive oil in a large pan over medium heat',
      'Add garlic and sauté until fragrant',
      'Add vegetables and cook until tender',
      'Toss with cooked pasta and parmesan',
      'Season with salt and pepper to taste'
    ],
    cookingTime: 20,
    servings: 2,
    calories: 450,
    tags: ['quick', 'vegetarian', 'pasta'],
    cuisineType: 'Italian',
    dietaryInfo: {
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: false,
      isDairyFree: false
    }
  },
  {
    id: 'fallback-salad',
    title: 'Fresh Garden Salad',
    description: 'A refreshing salad with mixed greens and your favorite toppings',
    imageUrl: '',
    ingredients: [
      '4 cups mixed greens',
      '1 cucumber, sliced',
      '1 cup cherry tomatoes, halved',
      '1/4 red onion, thinly sliced',
      '2 tbsp olive oil',
      '1 tbsp balsamic vinegar',
      'Salt and pepper to taste'
    ],
    instructions: [
      'Wash and dry all vegetables',
      'Combine greens, cucumber, tomatoes, and onion in a large bowl',
      'Whisk together olive oil, vinegar, salt, and pepper',
      'Drizzle dressing over salad and toss to combine',
      'Serve immediately'
    ],
    cookingTime: 10,
    servings: 2,
    calories: 150,
    tags: ['salad', 'quick', 'healthy'],
    cuisineType: 'International',
    dietaryInfo: {
      isVegetarian: true,
      isVegan: true,
      isGlutenFree: true,
      isDairyFree: true
    }
  }
];

// Track used recipe IDs to avoid duplicates
const usedRecipeIds = new Set<string>();

// Initialize API with proper error handling
let genAI: GoogleGenerativeAI | null = null;
let model: any = null;

/**
 * Initialize the AI model
 * @returns boolean indicating if initialization was successful
 */
function initializeAI(): boolean {
  try {
    if (!API_KEY || API_KEY.length < 10) {
      console.error('Invalid API key configuration');
      return false;
    }
    
    genAI = new GoogleGenerativeAI(API_KEY);
    model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    console.log('AI model initialized successfully');
    return true;
  } catch (error) {
    console.error('Failed to initialize AI model:', error);
    model = null;
    return false;
  }
}

// Initialize on module load
initializeAI();

/**
 * Clear used recipe IDs to ensure we don't filter out recipes across different searches
 */
function clearUsedRecipeIds(): void {
  usedRecipeIds.clear();
  console.log('Cleared used recipe IDs');
}

/**
 * Generate a prompt for the AI based on the user's request
 * @param request The recipe request containing ingredients and preferences
 * @returns A formatted prompt string
 */
function generatePrompt(request: AIRecipeRequest): string {
  const { ingredients, cuisineType, dietaryPreferences } = request;
  
  console.log('Generating prompt with:', { ingredients, cuisineType, dietaryPreferences });
  
  if (!ingredients || ingredients.length === 0) {
    throw new Error('No ingredients provided for recipe generation');
  }
  
  // Start with a clear instruction
  let prompt = `Generate 3 detailed and UNIQUE recipes that MUST use these specific ingredients as their MAIN components: ${ingredients.join(', ')}.\n\n`;
  prompt += 'CRITICAL RULES FOR RECIPE GENERATION (MUST FOLLOW):\n';
  prompt += '1. IMPORTANT: Each recipe MUST prominently feature the ingredients I provided\n';
  prompt += '2. The recipe title MUST start with the main ingredient and reflect the dish type\n';
  prompt += '3. Ingredients should be listed with quantities and specific preparation notes\n';
  prompt += '4. Instructions should be detailed, step-by-step, and include cooking times\n';
  prompt += '5. Do NOT include any image references or URLs\n\n';
  
  // Add cuisine type if specified
  if (cuisineType && cuisineType !== 'Any') {
    prompt += `Cuisine: ${cuisineType}.\n`;
  }
  
  // Add dietary preferences if any
  if (dietaryPreferences && dietaryPreferences.length > 0) {
    prompt += `Dietary needs: ${dietaryPreferences.join(', ')}.\n`;
  }
  
  // Format instructions for the output
  prompt += '\nIMPORTANT: Return the recipes in valid JSON format as an array of recipe objects.\n';
  prompt += 'Each recipe should include: title, description, ingredients, instructions, cookingTime, servings, calories, tags, cuisineType, and dietaryInfo.\n';
  
  return prompt;
}

/**
 * Parse the AI response into Recipe objects
 * @param responseText The text response from the AI
 * @returns An array of Recipe objects
 */
function parseAIResponse(responseText: string): Recipe[] {
  console.log('Parsing AI response...');
  
  // Try different parsing strategies
  let recipes: Recipe[] = [];
  
  // Strategy 1: Try to parse as a direct JSON array
  recipes = tryParseJsonArray(responseText);
  if (recipes.length > 0) return processRecipes(recipes);
  
  // Strategy 2: Try to extract JSON from markdown code blocks
  recipes = tryExtractJsonFromMarkdown(responseText);
  if (recipes.length > 0) return processRecipes(recipes);
  
  // Strategy 3: Try to find JSON-like structure in the text
  recipes = tryFindJsonInText(responseText);
  if (recipes.length > 0) return processRecipes(recipes);
  
  // Strategy 4: Try to parse as a single recipe object
  recipes = tryParseAsSingleRecipe(responseText);
  if (recipes.length > 0) return processRecipes(recipes);
  
  // If all strategies fail, return an empty array
  console.error('Failed to parse AI response with any strategy');
  return [];
}

/**
 * Try to parse the text as a direct JSON array
 * @param text The text to parse
 * @returns An array of any objects that might be recipes
 */
function tryParseJsonArray(text: string): any[] {
  try {
    const trimmedText = text.trim();
    const parsedData = JSON.parse(trimmedText);
    
    if (Array.isArray(parsedData)) {
      console.log('Successfully parsed as JSON array');
      return parsedData;
    }
    
    return [];
  } catch (error) {
    return [];
  }
}

/**
 * Try to extract JSON from markdown code blocks
 * @param text The text to parse
 * @returns An array of any objects that might be recipes
 */
function tryExtractJsonFromMarkdown(text: string): any[] {
  try {
    // Look for JSON inside markdown code blocks
    const codeBlockRegex = /```(?:json)?\s*([\s\S]*?)```/g;
    const match = codeBlockRegex.exec(text);
    
    if (match && match[1]) {
      const jsonContent = match[1].trim();
      const parsedData = JSON.parse(jsonContent);
      
      if (Array.isArray(parsedData)) {
        console.log('Successfully extracted JSON from markdown code block');
        return parsedData;
      }
    }
    
    return [];
  } catch (error) {
    return [];
  }
}

/**
 * Try to find JSON-like structure in the text
 * @param text The text to parse
 * @returns An array of any objects that might be recipes
 */
function tryFindJsonInText(text: string): any[] {
  try {
    // Look for text that starts with [ and ends with ]
    const jsonRegex = /\[\s*{[\s\S]*}\s*\]/g;
    const match = jsonRegex.exec(text);
    
    if (match && match[0]) {
      const jsonContent = match[0].trim();
      const parsedData = JSON.parse(jsonContent);
      
      if (Array.isArray(parsedData)) {
        console.log('Successfully found JSON-like structure in text');
        return parsedData;
      }
    }
    
    return [];
  } catch (error) {
    return [];
  }
}

/**
 * Try to parse the text as a single recipe object
 * @param text The text to parse
 * @returns An array containing the single recipe if successful
 */
function tryParseAsSingleRecipe(text: string): any[] {
  try {
    // Look for text that looks like a single JSON object
    const objectRegex = /{[\s\S]*}/g;
    const match = objectRegex.exec(text);
    
    if (match && match[0]) {
      const jsonContent = match[0].trim();
      const parsedData = JSON.parse(jsonContent);
      
      if (typeof parsedData === 'object' && !Array.isArray(parsedData)) {
        console.log('Successfully parsed as single recipe object');
        return [parsedData];
      }
    }
    
    return [];
  } catch (error) {
    return [];
  }
}

/**
 * Process and validate recipe objects, assigning unique IDs
 * @param items Array of objects to process into valid Recipe objects
 * @returns Array of valid Recipe objects
 */
function processRecipes(items: any[]): Recipe[] {
  const validRecipes: Recipe[] = [];
  
  // Process each item into a valid Recipe object
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    
    try {
      // Skip if missing required fields
      if (!item.title || !item.ingredients || !item.instructions) {
        console.warn('Skipping recipe due to missing required fields:', item.title || 'Untitled');
        continue;
      }
      
      // Generate a unique ID based on title and timestamp
      const timestamp = Date.now();
      const randomId = Math.floor(Math.random() * 10000);
      const id = `recipe-${timestamp}-${randomId}`;
      
      // Create a valid Recipe object
      const recipe: Recipe = {
        id,
        title: item.title,
        description: item.description || `A delicious recipe featuring ${item.title.toLowerCase()}`,
        imageUrl: item.imageUrl || '',
        ingredients: Array.isArray(item.ingredients) ? item.ingredients : [],
        instructions: Array.isArray(item.instructions) ? item.instructions : [],
        cookingTime: item.cookingTime || 30,
        servings: item.servings || 4,
        calories: item.calories || 0,
        tags: Array.isArray(item.tags) ? item.tags : [],
        cuisineType: item.cuisineType || 'International',
        dietaryInfo: {
          isVegetarian: item.dietaryInfo?.isVegetarian || false,
          isVegan: item.dietaryInfo?.isVegan || false,
          isGlutenFree: item.dietaryInfo?.isGlutenFree || false,
          isDairyFree: item.dietaryInfo?.isDairyFree || false
        }
      };
      
      validRecipes.push(recipe);
    } catch (error) {
      console.error('Error processing recipe:', error);
    }
  }
  
  console.log(`Processed ${validRecipes.length} valid recipes`);
  return validRecipes;
}

/**
 * Get recipe suggestions from the AI with fallback to local recipes
 * @param request The recipe request containing ingredients and preferences
 * @param offset Offset for loading more recipes
 * @returns Promise resolving to an array of Recipe objects
 */
async function getRecipeSuggestionsFromAI(request: AIRecipeRequest, offset: number = 0): Promise<Recipe[]> {
  // Clear used recipe IDs if this is a new search
  if (offset === 0) {
    clearUsedRecipeIds();
  }
  
  console.log('getRecipeSuggestionsFromAI called with request:', {
    ingredients: request.ingredients,
    cuisineType: request.cuisineType,
    dietaryPreferences: request.dietaryPreferences,
    offset
  });
  
  // If model failed to initialize, try to reinitialize
  if (!model) {
    console.log('Model not available, attempting to initialize...');
    const initialized = initializeAI();
    
    if (!initialized || !model) {
      console.log('Initialization failed, using fallback recipes');
      return [...FALLBACK_RECIPES];
    }
    
    console.log('Model initialized successfully');
  }
  
  try {
    // Generate prompt with offset information to get different recipes
    const offsetPrompt = offset > 0 ? 
      `\n\nIMPORTANT: I've already seen ${offset} recipes. Please provide completely different recipes than before.` : '';
    
    const prompt = generatePrompt(request) + offsetPrompt;
    
    console.log('Generated prompt length:', prompt.length, 'characters');
    console.log('Request ingredients:', request.ingredients.join(', '));
    
    // Add timeout handling for the API call
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('API request timed out after 15 seconds')), 15000);
    });
    
    // Call the API with timeout handling
    const apiPromise = model.generateContent(prompt);
    const result = await Promise.race([apiPromise, timeoutPromise]) as any;
    
    if (!result || !result.response) {
      throw new Error('No response from AI model');
    }
    
    const response = result.response;
    const text = response.text().trim();
    
    console.log('Raw AI response received, length:', text.length, 'characters');
    console.log('First 200 chars of response:', text.substring(0, 200));
    
    if (!text) {
      throw new Error('Empty response from AI');
    }
    
    // Parse the response
    const recipes = parseAIResponse(text);
    console.log(`Successfully parsed ${recipes.length} recipes`);
    
    // Check if recipes include the requested ingredients
    let foundRequestedIngredients = false;
    if (recipes.length > 0) {
      for (const recipe of recipes) {
        const recipeIngredients = recipe.ingredients.join(' ').toLowerCase();
        for (const ingredient of request.ingredients) {
          if (recipeIngredients.includes(ingredient.toLowerCase())) {
            foundRequestedIngredients = true;
            break;
          }
        }
        if (foundRequestedIngredients) break;
      }
      
      if (!foundRequestedIngredients) {
        console.warn('None of the recipes contain the requested ingredients');
        throw new Error('Invalid recipe response - ingredients not included');
      }
    }
    
    // If no recipes were parsed, use fallback
    if (recipes.length === 0) {
      console.warn('No valid recipes could be parsed from the response, using fallback');
      return [...FALLBACK_RECIPES];
    }
    
    // Filter out any recipes that were already used
    const uniqueRecipes = recipes.filter((recipe: Recipe) => !usedRecipeIds.has(recipe.id));
    
    // If all recipes were already used, use fallback
    if (uniqueRecipes.length === 0) {
      console.log('All recipes were already used, using fallback');
      return [...FALLBACK_RECIPES];
    }
    
    // Mark these recipes as used
    uniqueRecipes.forEach((recipe: Recipe) => usedRecipeIds.add(recipe.id));
    
    console.log(`Returning ${uniqueRecipes.length} new recipes`);
    return uniqueRecipes;
    
  } catch (error) {
    console.error('Error in getRecipeSuggestionsFromAI, using fallback recipes:', error);
    return [...FALLBACK_RECIPES];
  }
}

export { getRecipeSuggestionsFromAI, parseAIResponse, generatePrompt };
