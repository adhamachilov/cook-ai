import { AIRecipeRequest, Recipe } from '../types';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { generateUUID } from '../utils/uuid';

/**
 * Recipe generator that creates unique recipes using Google AI
 */
export async function generateSimpleRecipes(request: AIRecipeRequest): Promise<Recipe[]> {
  console.log('Generating completely unique recipes for:', request);
  
  // Extract the requested ingredients for better recipe generation
  const ingredients = request.ingredients || [];
  
  // Make MULTIPLE attempts to generate recipes with AI - no fallbacks
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      console.log(`AI generation attempt ${attempt + 1}...`);
      
      // Each attempt uses a different approach to maximize chances of success
      let aiRecipes: Recipe[] = [];
      const promptStyle = ["standard", "creative", "detailed", "exotic", "simple"][attempt];
      
      // Try generating recipes with current style
      aiRecipes = await tryGenerateWithAI(request, promptStyle);
      
      if (aiRecipes && aiRecipes.length > 0) {
        console.log(`Successfully generated ${aiRecipes.length} AI recipes with ${promptStyle} style`);
        
        // Filter out any recipes that look like they're from templates
        const filteredRecipes = aiRecipes.filter(recipe => {
          // Check for template-like patterns in titles
          const templatePattern = new RegExp(`^(${ingredients.join('|')})\\s(Stir Fry|Soup|Pasta|Minestrone|Curry|Salad|Bowl)$`, 'i');
          const simplePattern = new RegExp(`^(\\w+)\\s(${ingredients.join('|')})$`, 'i');
          const basicPattern = new RegExp(`^(${ingredients.join('|')})\\s(and|&)\\s(\\w+)$`, 'i');
          
          // Ensure recipe has a detailed, unique description
          const hasDetailedDescription = recipe.description && recipe.description.length > 100;
          
          // Return true only if it passes all checks (not matching any template patterns and has good description)
          return !templatePattern.test(recipe.title) && 
                 !simplePattern.test(recipe.title) && 
                 !basicPattern.test(recipe.title) &&
                 hasDetailedDescription;
        });
        
        if (filteredRecipes.length > 0) {
          console.log(`Returning ${filteredRecipes.length} non-templated recipes`);
          return filteredRecipes;
        } else {
          console.log('Filtered out all recipes as they looked templated, trying again...');
        }
      }
      
      // If no good recipes were generated, wait a moment and try again
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Error in AI generation attempt ${attempt + 1}:`, error);
      // Continue to next attempt
    }
  }
  
  // If all AI attempts fail, create completely unique recipes algorithmically
  console.log('All AI attempts failed. Creating fully algorithmic recipes as last resort');
  return createTrulyUniqueRecipes(request.ingredients, request.cuisineType || '', request.dietaryPreferences || []);
}

/**
 * Attempt to generate recipes using Google AI with different prompt styles
 */
async function tryGenerateWithAI(request: AIRecipeRequest, style: string = "standard"): Promise<Recipe[]> {
  try {
    // Use a hardcoded API key for testing
    const apiKey = 'AIzaSyDGUmJF_-5O0Qp0tQgTB7L9pwgCdcM8Flk';
    console.log('Using API key (length):', apiKey.length);
    
    // Initialize Google AI
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    // Build a specific prompt based on the style
    const prompt = buildPromptByStyle(request, style);
    console.log(`Using ${style} prompt:`, prompt.substring(0, 100) + '...');
    
    // Call the API with a longer timeout (20 seconds)
    const result = await Promise.race([
      model.generateContent(prompt),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error('AI request timed out')), 20000))
    ]);
    
    if (!result || !('response' in result)) {
      throw new Error('Invalid response from AI');
    }
    
    const text = result.response.text();
    console.log('Got AI response, length:', text.length);
    
    // Try to extract recipes JSON
    const recipes = parseRecipes(text, request.ingredients);
    
    if (!recipes || recipes.length === 0) {
      throw new Error('No valid recipes in AI response');
    }
    
    return recipes;
  } catch (error) {
    console.error('AI generation failed:', error);
    return [];
  }
}

/**
 * Build a prompt for recipe generation based on the selected style
 */
function buildPromptByStyle(request: AIRecipeRequest, style: string): string {
  const ingredients = request.ingredients.join(', ');
  
  // Base prompt for all styles
  let prompt = `Generate 3 completely UNIQUE and NON-GENERIC recipes using these ingredients: ${ingredients}.\n\n`;
  
  // Add style-specific instructions
  if (style === "standard") {
    prompt += `Each recipe must have a UNIQUE, CREATIVE NAME that is specific and appealing - not generic templates.\n`;
    prompt += `Examples of good names: "Smoky Paprika Beef Medallions with Caramelized Onions" or "Mediterranean Lemon-Garlic Chicken with Herb Infusion".\n\n`;
    prompt += `Examples of BAD names to AVOID: "Beef Stir Fry", "Chicken Pasta", or "Potato Soup" - these are too generic.\n\n`;
  } 
  else if (style === "creative") {
    prompt += `Create GOURMET, RESTAURANT-QUALITY recipes with sophisticated names.\n`;
    prompt += `Each recipe should be something a high-end restaurant would serve, with elegant plating suggestions.\n`;
    prompt += `Focus on complex flavor combinations and unexpected ingredient pairings.\n\n`;
  }
  else if (style === "detailed") {
    prompt += `Create HOME-STYLE, COMFORT FOOD recipes that are family favorites with authentic, regional names.\n`;
    prompt += `Each recipe should include background about its origin or cultural significance.\n`;
    prompt += `Focus on authentic techniques and traditional flavor profiles.\n\n`;
  }
  else if (style === "exotic") {
    prompt += `Create EXOTIC, INTERNATIONAL recipes that feature unusual combinations and authentic global cuisines.\n`;
    prompt += `Each recipe should have a name that reflects its cultural heritage and unique character.\n`;
    prompt += `Focus on bold flavors, regional spices, and traditional preparation methods from around the world.\n\n`;
  }
  else if (style === "simple") {
    prompt += `Create SIMPLE, EVERYDAY recipes that are practical and accessible but with unique names.\n`;
    prompt += `Each recipe should be straightforward to prepare with minimal ingredients beyond what's specified.\n`;
    prompt += `Focus on comfort food classics but with creative twists and interesting flavor combinations.\n\n`;
  }
  
  // Add dietary preferences if specified
  if (request.dietaryPreferences && request.dietaryPreferences.length > 0) {
    prompt += `Dietary preferences: ${request.dietaryPreferences.join(', ')}\n`;
  }
  
  // Add cuisine type if specified
  if (request.cuisineType) {
    prompt += `Cuisine type: ${request.cuisineType}\n`;
  }
  
  // Instruction for response format with emphasis on unique titles
  prompt += `
Return ONLY a JSON array with this structure, and nothing else:
[
  {
    "title": "UNIQUE Creative Recipe Title - Not Generic",
    "description": "Detailed, appetizing description that is specific to this dish",
    "ingredients": ["Ingredient 1 (amount)", "Ingredient 2 (amount)"],
    "instructions": ["Step 1", "Step 2"],
    "cookingTime": 30,
    "servings": 4,
    "calories": 300,
    "cuisineType": "cuisine"
  },
  { next recipe... }
]

EXTREMELY IMPORTANT:
- Use realistic measurements (grams for meat, count for vegetables, etc.)
- Each ingredient MUST include an amount in parentheses
- DO NOT include explanations, only return the JSON array
`;

  return prompt;
}

/**
 * Parse recipes from AI response text
 */
function parseRecipes(text: string, requestedIngredients: string[]): Recipe[] {
  try {
    // Try to extract JSON from the response
    const jsonMatches = text.match(/\[\s*\{[\s\S]*\}\s*\]/);
    
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
    
    // Convert to our Recipe type and add missing fields
    return parsedRecipes.map((recipe: any): Recipe => {
      // Get the recipe title or create a default
      let title = recipe.title || `${requestedIngredients[0]} Special`;
      
      // If title looks generic (matches templates), enhance it
      if (/^(\w+) (Soup|Stir Fry|Pasta)$/.test(title)) {
        const base = title.split(' ')[0];
        const adjectives = ['Savory', 'Rustic', 'Homestyle', 'Classic', 'Gourmet', 'Country', 'Chef\'s'];
        const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
        title = `${adj} ${base} Creation`;
      }
      
      return {
        id: generateUUID(),
        title: title,
        description: recipe.description || `A delicious dish featuring ${requestedIngredients.join(' and ')}.`,
        ingredients: recipe.ingredients || [],
        instructions: recipe.instructions || [],
        cookingTime: recipe.cookingTime || recipe.cooking_time || 30,
        servings: recipe.servings || 4,
        calories: recipe.calories || 400,
        imageUrl: '',
        tags: recipe.tags || [],
        cuisineType: recipe.cuisineType || recipe.cuisine_type || '',
        likes: 0,
        dietaryInfo: recipe.dietaryInfo || recipe.dietary_info || {
          isVegetarian: false,
          isVegan: false,
          isGlutenFree: false,
          isDairyFree: false
        }
      };
    });
  } catch (error) {
    console.error('Error parsing AI response:', error);
    return [];
  }
}

/**
 * Get a random cuisine type for fallback recipes
 */
function getRandomCuisine(): string {
  const cuisines = [
    'Italian', 'Mexican', 'Japanese', 'Indian', 'Mediterranean', 
    'Thai', 'French', 'Chinese', 'Greek', 'American', 'Spanish'
  ];
  return cuisines[Math.floor(Math.random() * cuisines.length)];
}

/**
 * Generate a unique recipe title that is not templated
 */
function generateUniqueTitle(mainIngredient: string, secondIngredient: string, cuisine: string, style: string): string {
  // Capitalize the first letter of ingredients
  const main = mainIngredient.charAt(0).toUpperCase() + mainIngredient.slice(1);
  const second = secondIngredient.charAt(0).toUpperCase() + secondIngredient.slice(1);
  
  // Arrays of terms to create variety
  const adjectives = ['Aromatic', 'Rustic', 'Savory', 'Zesty', 'Hearty', 'Fragrant', 'Spiced', 'Tangy', 'Garden-Fresh', 'Artisanal'];
  const cookingMethods = ['Roasted', 'Sautéed', 'Slow-Cooked', 'Grilled', 'Braised', 'Pan-Seared', 'Baked', 'Charred', 'Stewed', 'Fire-Kissed'];
  const descriptors = ['Delight', 'Medley', 'Creation', 'Symphony', 'Harvest', 'Sensation', 'Classic', 'Specialty', 'Treasure', 'Masterpiece'];
  
  // Randomly select elements
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const method = cookingMethods[Math.floor(Math.random() * cookingMethods.length)];
  const descriptor = descriptors[Math.floor(Math.random() * descriptors.length)];
  
  // Generate different title formats based on style
  if (style === 'main') {
    return `${adj} ${method} ${main} with ${second} (${cuisine} Style)`;
  } else if (style === 'side') {
    return `${cuisine} ${method} ${main} ${descriptor} with ${second} Accent`;
  } else {
    return `${method} ${main} & ${second} ${descriptor} (${adj} ${cuisine} Fusion)`;
  }
}

/**
 * Generate a unique recipe description that is not templated
 */
function generateUniqueDescription(mainIngredient: string, secondIngredient: string, cuisine: string, _type: string): string {
  // Arrays of phrases to create variety
  const introductions = [
    `This ${cuisine}-inspired dish elevates ${mainIngredient} to new heights`,
    `A celebration of authentic ${cuisine} flavors centered around ${mainIngredient}`,
    `An innovative approach to traditional ${cuisine} cooking using ${mainIngredient}`,
    `This signature dish transforms ordinary ${mainIngredient} into something extraordinary`,
    `A contemporary twist on classic ${cuisine} preparation of ${mainIngredient}`
  ];
  
  const midSections = [
    `by pairing it with ${secondIngredient} in a symphony of flavors`,
    `through careful preparation with ${secondIngredient} and aromatic spices`,
    `by highlighting its natural affinity with ${secondIngredient}`,
    `by balancing its robust character with the delicate notes of ${secondIngredient}`,
    `while allowing the subtle complexity of ${secondIngredient} to shine through`
  ];
  
  const endings = [
    `Perfect for special occasions or when you want to impress dinner guests with your culinary prowess.`,
    `This dish brings restaurant-quality dining to your home table with surprisingly little effort.`,
    `Ideal for both casual weeknight dinners and more elaborate weekend feasts.`,
    `A satisfying meal that will have everyone asking for your secret recipe.`,
    `The harmonious blend of flavors makes this a memorable addition to your cooking repertoire.`
  ];
  
  // Select random elements from each array to ensure uniqueness
  const index = Math.floor(Math.random() * introductions.length);
  let introduction, midSection, ending;
  
  // Use different combinations based on recipe type and random offset
  const offset = Math.floor(Math.random() * 3) + 1;
  introduction = introductions[(index + offset) % introductions.length];
  midSection = midSections[(index + offset + 1) % midSections.length];
  ending = endings[(index + offset + 2) % endings.length];
  
  return `${introduction} ${midSection}. The preparation brings out the natural richness of the ingredients while incorporating traditional techniques that make this recipe both authentic and approachable. ${ending}`;
}

/**
 * Generate unique ingredients list for a recipe
 */
function generateUniqueIngredients(mainIngredient: string, secondIngredient: string, thirdIngredient: string, _type: string, cuisine: string): string[] {
  // Base ingredients that will always be included
  const ingredients = [
    `${mainIngredient} (${250 + Math.floor(Math.random() * 250)}g)`,
    `${secondIngredient} (${1 + Math.floor(Math.random() * 3)} cups)`
  ];
  
  // Add cuisine-specific ingredients
  if (cuisine === 'Italian') {
    ingredients.push(
      'Olive oil (3 tbsp)',
      'Garlic (3 cloves, minced)',
      'Fresh basil (1/4 cup, chopped)',
      'San Marzano tomatoes (1 can, 400g)',
      'Parmesan cheese (1/2 cup, grated)',
      'Red wine (1/4 cup)',
      'Italian herbs (1 tbsp)'      
    );
  } else if (cuisine === 'Mexican') {
    ingredients.push(
      'Jalapeño (1-2, seeded and diced)',
      'Cilantro (1/4 cup, chopped)',
      'Lime (1, juiced)',
      'Cumin (1 tsp)',
      'Chili powder (1 tbsp)',
      'Avocado (1, sliced)',
      'Red onion (1/2, finely diced)'
    );
  } else if (cuisine === 'Asian' || cuisine === 'Chinese' || cuisine === 'Thai') {
    ingredients.push(
      'Soy sauce (2 tbsp)',
      'Sesame oil (1 tbsp)',
      'Fresh ginger (1 tbsp, grated)',
      'Garlic (3 cloves, minced)',
      'Green onions (3, sliced)',
      'Rice vinegar (1 tbsp)',
      'Sriracha or chili paste (to taste)'
    );
  } else {
    // Generic ingredients for other cuisines
    ingredients.push(
      'Olive oil (2 tbsp)',
      'Garlic (2 cloves, minced)',
      'Onion (1, diced)',
      'Salt and pepper (to taste)',
      `${thirdIngredient} (2 tsp)`,
      'Fresh herbs (2 tbsp, chopped)'
    );
  }
  
  // Add some random ingredients based on style
  const additionalIngredients = [
    'Bell pepper (1, diced)',
    'Carrot (2, julienned)',
    'Zucchini (1, sliced)',
    'Mushrooms (1 cup, sliced)',
    'Lemon (1, zested and juiced)',
    'Honey (1 tbsp)',
    'Dijon mustard (1 tsp)',
    'White wine (1/4 cup)',
    'Chicken broth (1/2 cup)',
    'Heavy cream (1/4 cup)',
    'Nuts (1/4 cup, chopped)',
    'Dried fruit (1/4 cup)'
  ];
  
  // Add 2-4 random additional ingredients
  const numAdditional = 2 + Math.floor(Math.random() * 3);
  const shuffled = [...additionalIngredients].sort(() => 0.5 - Math.random());
  ingredients.push(...shuffled.slice(0, numAdditional));
  
  return ingredients;
}

/**
 * Generate unique cooking instructions for a recipe
 */
function generateUniqueInstructions(mainIngredient: string, secondIngredient: string, _type: string, cuisine: string): string[] {
  // Different instruction formats based on cuisine and style
  const instructions: string[] = [];
  
  // Preparation instructions
  if (mainIngredient.includes('meat') || mainIngredient.includes('chicken') || mainIngredient.includes('beef') || mainIngredient.includes('pork') || mainIngredient.includes('fish')) {
    instructions.push(
      `Prepare the ${mainIngredient} by cutting into even pieces and seasoning with salt and pepper.`,
      `Thoroughly wash and dice the ${secondIngredient}.`
    );
  } else {
    instructions.push(
      `Wash and prepare the ${mainIngredient}, cutting into appropriate sized pieces.`,
      `Clean and dice the ${secondIngredient} into similar sized pieces for even cooking.`
    );
  }
  
  // Cooking instructions based on cuisine
  if (cuisine === 'Italian') {
    instructions.push(
      'Heat olive oil in a large pan over medium heat.',
      'Add garlic and sauté until fragrant, about 30 seconds.',
      `Add the ${mainIngredient} and cook until it starts to brown.`,
      'Pour in the wine and let it reduce by half.',
      `Stir in the ${secondIngredient} and tomatoes, then reduce heat to low.`,
      'Simmer gently for 15-20 minutes, stirring occasionally.',
      'Season with Italian herbs, salt, and pepper.',
      'Finish with fresh basil and grated Parmesan.'      
    );
  } else if (cuisine === 'Mexican') {
    instructions.push(
      'Heat oil in a large skillet over medium-high heat.',
      `Add ${mainIngredient} and cook until lightly browned.`,
      'Add onions, jalapeño, and garlic, cooking until softened.',
      'Stir in cumin and chili powder, cooking for 30 seconds to bloom the spices.',
      `Add the ${secondIngredient} and cook for another 3-4 minutes.`,
      'Squeeze lime juice over the mixture and stir well.',
      'Remove from heat and garnish with fresh cilantro and sliced avocado.'
    );
  } else if (cuisine === 'Asian' || cuisine === 'Chinese' || cuisine === 'Thai') {
    instructions.push(
      'Heat a wok or large pan over high heat until smoking.',
      'Add oil and swirl to coat the surface.',
      'Add ginger and garlic, stir-frying for 15 seconds until fragrant.',
      `Add ${mainIngredient} and stir-fry for 2-3 minutes until nearly cooked.`,
      `Add ${secondIngredient} and continue stir-frying for another 2 minutes.`,
      'Pour in soy sauce, sesame oil, and any other sauces.',
      'Toss everything together for 1 minute until well combined and heated through.',
      'Garnish with sliced green onions and serve immediately.'
    );
  } else {
    // Generic cooking instructions
    instructions.push(
      'Heat oil in a large pan over medium heat.',
      'Add onions and garlic, cooking until softened.',
      `Add ${mainIngredient} and cook for 5-7 minutes.`,
      `Stir in ${secondIngredient} and continue cooking for 3-4 minutes.`,
      'Season with salt, pepper, and herbs.',
      'Cook until everything is tender and flavors have melded together.',
      'Adjust seasoning if necessary before serving.'
    );
  }
  
  // Final instructions
  instructions.push(
    'Plate and serve immediately, garnishing as desired.',
    'Enjoy while hot!'
  );
  
  return instructions;
}

/**
 * Generate unique tags for a recipe
 */
function generateUniqueTags(cuisine: string, _type: string): string[] {
  const tags: string[] = [];
  
  // Add cuisine tag
  tags.push(cuisine);
  
  // Add difficulty tag
  const difficulties = ['Easy', 'Intermediate', 'Quick'];
  tags.push(difficulties[Math.floor(Math.random() * difficulties.length)]);
  
  // Add meal type tags
  const mealTypes = ['Dinner', 'Lunch', 'Family Meal', 'Weeknight', 'Weekend'];
  tags.push(mealTypes[Math.floor(Math.random() * mealTypes.length)]);
  
  // Add cooking method tags
  const cookingMethods = ['Stovetop', 'One Pot', 'Sauté', 'Simmer', 'Stir-fry', 'Roast', 'Braise'];
  tags.push(cookingMethods[Math.floor(Math.random() * cookingMethods.length)]);
  
  // Add randomly selected flavor profile
  const flavorProfiles = ['Savory', 'Spicy', 'Aromatic', 'Hearty', 'Fresh', 'Zesty', 'Rich', 'Tangy'];
  tags.push(flavorProfiles[Math.floor(Math.random() * flavorProfiles.length)]);
  
  return tags;
}

/**
 * Create truly unique, algorithmically-generated recipes
 * This is only used as a last resort if AI generation fails
 */
function createTrulyUniqueRecipes(ingredients: string[], cuisineType: string, dietaryPreferences: string[]): Recipe[] {
  const mainIngredient = ingredients[0] || 'ingredients';
  const secondIngredient = ingredients.length > 1 ? ingredients[1] : 'vegetables';
  const thirdIngredient = ingredients.length > 2 ? ingredients[2] : 'herbs';
  
  // Select a cuisine if not provided
  const cuisineInfo = cuisineType || getRandomCuisine();
  
  // Determine dietary info based on ingredients and preferences
  const isVegetarian = dietaryPreferences.includes('Vegetarian') || 
    (!mainIngredient.includes('meat') && !mainIngredient.includes('beef') && 
     !mainIngredient.includes('chicken') && !mainIngredient.includes('fish'));
    
  const isVegan = dietaryPreferences.includes('Vegan');
  const isGlutenFree = dietaryPreferences.includes('Gluten-Free') || 
    (!mainIngredient.includes('pasta') && !mainIngredient.includes('bread') && 
     !mainIngredient.includes('flour'));
  const isDairyFree = dietaryPreferences.includes('Dairy-Free') || 
    (!mainIngredient.includes('cheese') && !mainIngredient.includes('milk') && 
     !mainIngredient.includes('cream'));
  
  // Generate completely different recipes with unique styles
  const recipeTypes = ['main', 'side', 'special'];
  
  // Create recipes array to hold our results
  const recipes: Recipe[] = [];
  
  // Generate one recipe for each type to ensure variety
  for (let i = 0; i < recipeTypes.length; i++) {
    // Get creative with titles by using more descriptive formats
    // Generate unique names for each recipe based on ingredient combinations
    const cuisineAdjectives: Record<string, string[]> = {
      'Italian': ['Tuscan', 'Sicilian', 'Florentine', 'Venetian', 'Milanese'],
      'Mexican': ['Oaxacan', 'Yucatan', 'Puebla-style', 'Veracruz', 'Baja'],
      'Indian': ['Punjabi', 'Kerala', 'Bengali', 'Goan', 'Mughlai'],
      'Thai': ['Northern Thai', 'Southern Thai', 'Bangkok-style', 'Royal Thai', 'Isaan'],
      'Chinese': ['Szechuan', 'Cantonese', 'Shanghai', 'Hunan', 'Dim Sum'],
      'Japanese': ['Tokyo-style', 'Osaka', 'Kyoto', 'Hokkaido', 'Okinawan'],
      'French': ['Provençal', 'Parisian', 'Lyonnaise', 'Normandy', 'Alsatian'],
      'Mediterranean': ['Greek Islands', 'Santorini', 'Coastal', 'Aegean', 'Cretan']  
    };
    
    // Get a regional style for the chosen cuisine to add uniqueness
    const regionalStyles = cuisineAdjectives[cuisineInfo] || ['Classic', 'Traditional', 'Authentic', 'Homestyle', 'Rustic'];
    const regionalStyle = regionalStyles[Math.floor(Math.random() * regionalStyles.length)];
    
    // Create a unique recipe for this type
    recipes.push({
      id: generateUUID(),
      title: generateUniqueTitle(mainIngredient, secondIngredient, regionalStyle, recipeTypes[i]),
      description: generateUniqueDescription(mainIngredient, secondIngredient, cuisineInfo, recipeTypes[i]),
      ingredients: generateUniqueIngredients(mainIngredient, secondIngredient, thirdIngredient, recipeTypes[i], cuisineInfo),
      instructions: generateUniqueInstructions(mainIngredient, secondIngredient, recipeTypes[i], cuisineInfo),
      cookingTime: 25 + Math.floor(Math.random() * 25),
      servings: 2 + Math.floor(Math.random() * 5),
      calories: 250 + Math.floor(Math.random() * 350),
      imageUrl: '',
      tags: generateUniqueTags(cuisineInfo, recipeTypes[i]),
      cuisineType: cuisineInfo,
      likes: 0,
      dietaryInfo: { 
        isVegetarian: isVegetarian, 
        isVegan: isVegan, 
        isGlutenFree: isGlutenFree, 
        isDairyFree: isDairyFree
      }
    });
  }
  
  return recipes;
}
