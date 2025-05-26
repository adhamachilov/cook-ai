/**
 * Utility to normalize ingredient measurements to realistic values
 */

// Define measurement correction rules
const ingredientRules: {
  type: string;
  keywords: string[];
  correctMeasurements: string[];
  incorrectPatterns: RegExp[];
}[] = [
  {
    type: 'meat',
    keywords: ['chicken', 'beef', 'pork', 'steak', 'lamb', 'turkey', 'fish', 'salmon', 'tuna', 'shrimp'],
    correctMeasurements: ['oz', 'lb', 'g', 'kg', 'pound', 'ounce', 'grams'],
    incorrectPatterns: [/cup/i, /tbsp/i, /tablespoon/i, /tsp/i, /teaspoon/i, /pinch/i]
  },
  {
    type: 'vegetable',
    keywords: ['onion', 'garlic', 'carrot', 'broccoli', 'spinach', 'kale', 'lettuce', 'cucumber', 'potato', 'tomato', 'celery', 'pepper'],
    correctMeasurements: ['whole', 'g', 'kg', 'lb', 'oz', 'clove', 'head', 'stalk', 'bunch', 'bulb'],
    incorrectPatterns: [/cup/i, /tbsp/i, /tablespoon/i, /pinch/i]
  },
  {
    type: 'herb',
    keywords: ['basil', 'oregano', 'thyme', 'rosemary', 'parsley', 'cilantro', 'mint', 'sage', 'bay leaf', 'bay leaves', 'dill'],
    correctMeasurements: ['tsp', 'tbsp', 'teaspoon', 'tablespoon', 'sprig', 'leaf', 'leaves'],
    incorrectPatterns: [/cup/i, /pound/i, /lb/i, /kg/i, /g(?![a-z])/i]
  },
  {
    type: 'spice',
    keywords: ['salt', 'pepper', 'paprika', 'cumin', 'coriander', 'cinnamon', 'nutmeg', 'clove', 'allspice', 'cayenne'],
    correctMeasurements: ['tsp', 'pinch', 'dash', 'teaspoon'],
    incorrectPatterns: [/cup/i, /tbsp/i, /tablespoon/i, /pound/i, /lb/i, /kg/i, /g(?![a-z])/i]
  },
  {
    type: 'grain',
    keywords: ['rice', 'pasta', 'noodle', 'quinoa', 'couscous', 'barley', 'oat', 'oatmeal'],
    correctMeasurements: ['g', 'oz', 'lb', 'kg', 'cup'],
    incorrectPatterns: [/tsp/i, /teaspoon/i, /pinch/i, /sliced/i]
  },
  {
    type: 'liquid',
    keywords: ['water', 'oil', 'milk', 'cream', 'broth', 'stock', 'wine', 'vinegar', 'juice', 'sauce'],
    correctMeasurements: ['cup', 'ml', 'l', 'liter', 'tbsp', 'tablespoon', 'tsp', 'teaspoon', 'fl oz', 'fluid ounce', 'quart', 'pint', 'gallon'],
    incorrectPatterns: [/pinch/i, /g(?![a-z])/i, /kg/i, /lb/i, /pound/i]
  },
  {
    type: 'cheese',
    keywords: ['cheese', 'cheddar', 'mozzarella', 'parmesan', 'feta', 'gouda', 'brie', 'ricotta'],
    correctMeasurements: ['g', 'oz', 'lb', 'kg', 'cup'],
    incorrectPatterns: [/pinch/i, /tsp/i, /teaspoon/i]
  }
];

// Default replacements for unrealistic measurements
const defaultReplacements: Record<string, Record<string, string>> = {
  meat: {
    'cup': '8 oz',
    'tablespoon': '2 oz',
    'tbsp': '2 oz',
    'teaspoon': '1 oz',
    'tsp': '1 oz',
    'pinch': '4 oz'
  },
  vegetable: {
    'tablespoon': '1/4 cup',
    'tbsp': '1/4 cup',
    'teaspoon': '1 tbsp',
    'tsp': '1 tbsp',
    'pinch': '1/2 cup'
  },
  herb: {
    'cup': '2 tbsp',
    'pound': '1/4 cup',
    'lb': '1/4 cup',
    'kg': '1/2 cup',
    'g': '1 tbsp'
  },
  spice: {
    'cup': '1 tbsp',
    'tablespoon': '1 tsp',
    'tbsp': '1 tsp',
    'pound': '2 tbsp',
    'lb': '2 tbsp',
    'kg': '3 tbsp',
    'g': '1/2 tsp'
  },
  grain: {
    'teaspoon': '1 cup',
    'tsp': '1 cup',
    'pinch': '1/2 cup',
    'sliced': ''
  },
  liquid: {
    'pinch': '1/4 cup',
    'g': '1 cup',
    'kg': '4 cups',
    'lb': '2 cups',
    'pound': '2 cups'
  },
  cheese: {
    'pinch': '1 oz',
    'teaspoon': '1 tbsp',
    'tsp': '1 tbsp'
  }
};

/**
 * Normalizes ingredient measurements to be more realistic
 * @param ingredients Array of ingredient strings
 * @returns Array of ingredients with corrected measurements
 */
export function normalizeIngredientMeasurements(ingredients: string[]): string[] {
  return ingredients.map(ingredient => {
    // Check if ingredient matches the pattern "ingredient (measurement)"
    const matchPattern = /(.+?)\s*\((.+?)\)$/;
    const match = ingredient.match(matchPattern);
    
    if (!match) return ingredient;
    
    const [_, ingredientName, measurement] = match;
    const normalizedIngredient = ingredientName.trim().toLowerCase();
    const originalMeasurement = measurement.trim();
    
    // Find the ingredient type based on keywords
    let ingredientType = '';
    let unrealisticMeasurement = false;
    
    for (const rule of ingredientRules) {
      if (rule.keywords.some(keyword => normalizedIngredient.includes(keyword.toLowerCase()))) {
        ingredientType = rule.type;
        
        // Check if the measurement is unrealistic
        unrealisticMeasurement = rule.incorrectPatterns.some(pattern => 
          pattern.test(originalMeasurement)
        );
        
        break;
      }
    }
    
    // If we found an unrealistic measurement, replace it
    if (ingredientType && unrealisticMeasurement) {
      // Find which incorrect pattern matched
      let incorrectUnit = '';
      const typeRules = ingredientRules.find(rule => rule.type === ingredientType);
      
      if (typeRules) {
        for (const pattern of typeRules.incorrectPatterns) {
          const unitMatch = originalMeasurement.match(pattern);
          if (unitMatch) {
            incorrectUnit = unitMatch[0].toLowerCase();
            break;
          }
        }
      }
      
      // If we found the incorrect unit, get its replacement
      if (incorrectUnit && defaultReplacements[ingredientType] && 
          defaultReplacements[ingredientType][incorrectUnit]) {
        
        // Extract any numeric value from the original measurement
        const numericMatch = originalMeasurement.match(/(\d+(\.\d+)?)/);
        const numericValue = numericMatch ? numericMatch[1] : '';
        
        // Get the replacement unit
        const replacementUnit = defaultReplacements[ingredientType][incorrectUnit];
        
        // Create the new measurement, preserving any numeric value if possible
        let newMeasurement = replacementUnit;
        
        if (numericValue && !replacementUnit.match(/^\d/)) {
          // If the replacement doesn't start with a number, add the original number
          newMeasurement = `${numericValue} ${replacementUnit}`;
        }
        
        // Replace sliced with a more appropriate term for pasta
        if (ingredientType === 'grain' && incorrectUnit === 'sliced') {
          return `${ingredientName} (${originalMeasurement.replace('sliced', 'dry')})`;
        }
        
        // Special case for bay leaves
        if (normalizedIngredient.includes('bay leaf') || normalizedIngredient.includes('bay leaves')) {
          const count = parseInt(numericValue) || 1;
          return `${ingredientName} (${count > 1 ? count : 1} leaf${count > 1 ? 'ves' : ''})`;
        }
        
        return `${ingredientName} (${newMeasurement})`;
      }
    }
    
    // Return the original ingredient if we didn't need to change it
    return ingredient;
  });
}
