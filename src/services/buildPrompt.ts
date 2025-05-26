import { AIRecipeRequest } from '../types';

/**
 * Builds a prompt for the AI model
 */
export function buildPrompt(request: AIRecipeRequest, offset: number): string {
  const { ingredients, cuisineType, dietaryPreferences } = request;
  
  // Start with a clear instruction
  // Determine how many recipes to generate (default to 3 if not specified)
  const recipeCount = request.maxResults || 3;
  let prompt = `Generate EXACTLY ${recipeCount} unique recipes that MUST use these specific ingredients as their MAIN components: ${ingredients.join(', ')}.

`;
  
  // Add specificity about unique recipe generation
  if (offset > 0 || request.excludeIds?.length) {
    const exclusionCount = offset || (request.excludeIds?.length || 0);
    prompt += `IMPORTANT: I've already seen ${exclusionCount} recipes with these ingredients. Please provide COMPLETELY DIFFERENT recipes than before - different cooking styles, cuisines, and preparation methods.

`;
    prompt += `Do NOT repeat any recipes or close variations of recipes I've already seen.

`;
  }
  
  // If we have specific recipe IDs to exclude, emphasize that
  if (request.excludeIds && request.excludeIds.length > 0) {
    prompt += `CRITICAL: Generate recipes that are FUNDAMENTALLY DIFFERENT in style, ingredients used, and cooking methods from previous recipes. Ensure maximum diversity and creativity.

`;
    
    // Extract recipe titles from IDs for more specific exclusion
    const titlesToExclude = request.excludeIds.map(id => id.split('-').slice(1).join('-')).join(', ');
    if (titlesToExclude) {
      prompt += `Specifically, DO NOT create recipes similar to these previously generated recipes: ${titlesToExclude}

`;
    }
  }
  
  // If diversity is explicitly requested
  if (request.ensureDiversity) {
    prompt += `EXTREMELY IMPORTANT: Each recipe MUST be COMPLETELY DIFFERENT from the others in cooking style, cuisine type, preparation method, and overall concept. Maximum diversity is required!

`;
  }
  
  prompt += 'CRITICAL RULES FOR RECIPE GENERATION (MUST FOLLOW):\n';
  prompt += `1. Each recipe MUST prominently use the following ingredients: ${ingredients.join(', ')}\n`;
  prompt += '2. The recipe title MUST start with the main ingredient\n';
  prompt += '3. EXTREMELY IMPORTANT - Ingredients MUST use PROPER CULINARY MEASUREMENTS ONLY:\n';
  prompt += '   - Meats: ALWAYS use weight (8 oz chicken breast, 1 lb ground beef, 200g steak)\n';
  prompt += '   - NEVER measure meat in cups, tablespoons, or similar volume measurements\n';
  prompt += '   - Vegetables: Use counts for whole items (2 carrots, 1 onion) or weight for chopped (150g broccoli)\n';
  prompt += '   - NEVER measure vegetables in tablespoons except for very small amounts\n';
  prompt += '   - Cheese: Use weight measurements (50g feta, 2 oz cheddar) NEVER "a pinch"\n';
  prompt += '   - Spices: Use realistic small amounts (1/2 tsp oregano, 1/4 tsp salt)\n';
  prompt += '   - Liquids: Use appropriate measures (2 tbsp olive oil, 1/4 cup vinegar)\n';
  prompt += '4. Instructions should be detailed and step-by-step\n';
  prompt += '5. Each recipe MUST be different in style, cooking method, and flavor profile\n';
  prompt += '6. Format each ingredient on its own line with correct measurements as: "ingredient (amount)"\n';
  prompt += '7. STRICTLY FORBIDDEN: 1 cup chicken, a pinch of cheese, 3 tbsp olives, 1/4 cup cucumber - these are WRONG\n';
  
  // Add cuisine type if specified
  if (cuisineType && cuisineType !== 'Any') {
    prompt += `\nCuisine type: ${cuisineType}\n`;
  }
  
  // Add dietary preferences if specified
  if (dietaryPreferences && dietaryPreferences.length > 0) {
    prompt += `\nDietary preferences: ${dietaryPreferences.join(', ')}\n`;
  }
  
  // Add timestamp to ensure different results each time
  prompt += `\nGeneration timestamp: ${Date.now()}\n`;
  
  // Instructions for JSON format
  prompt += '\nRETURN THE RECIPES AS A VALID JSON ARRAY with the following structure for each recipe:\n';
  prompt += `{
  "title": "Recipe Title",
  "description": "Brief description",
  "ingredients": ["ingredient 1", "ingredient 2", ...],
  "instructions": ["step 1", "step 2", ...],
  "cookingTime": 30,
  "servings": 4,
  "calories": 400,
  "tags": ["tag1", "tag2", ...],
  "cuisineType": "Cuisine",
  "dietaryInfo": {
    "isVegetarian": true/false,
    "isVegan": true/false,
    "isGlutenFree": true/false,
    "isDairyFree": true/false
  }
}

`;

  prompt += 'ONLY RETURN THE JSON. Do not include any other text, explanations, or markdown formatting.\n';
  
  return prompt;
}
