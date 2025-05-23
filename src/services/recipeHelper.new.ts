import { Recipe } from '../types';
import { getFoodImageByRecipe } from './ai';

/**
 * Provides a diverse set of fallback recipes that can be filtered based on search criteria
 */
export function getRelevantRecipes(ingredients: string[] = [], dietaryPreferences: string[] = [], cuisineType?: string, offset: number = 0): Recipe[] {
  console.log('Getting relevant recipes for ingredients:', ingredients);
  console.log('Offset for pagination:', offset);
  
  // A diverse set of recipes covering different ingredients and dietary preferences
  const allRecipes: Recipe[] = [
    // Chicken & Rice (only shown when explicitly requested)
    {
      id: 'recipe-fixed-1',
      title: 'One-Pot Chicken and Rice',
      description: 'A comforting and flavorful one-pot meal with tender chicken and fluffy rice cooked in aromatic spices.',
      imageUrl: getFoodImageByRecipe('comfort', 'One-Pot Chicken and Rice', ['chicken', 'rice', 'one-pot'], { isVegetarian: false, isVegan: false }),
      ingredients: [
        '1.5 lbs boneless chicken thighs, cut into pieces',
        '2 cups long-grain white rice, rinsed and drained',
        '1 onion, finely diced',
        '3 cloves garlic, minced',
        '1 red bell pepper, diced',
        '1 cup carrots, diced',
        '3 1/2 cups chicken broth',
        '2 tbsp olive oil',
        '1 tsp paprika',
        '1 tsp ground cumin',
        '1/2 tsp turmeric',
        'Salt and pepper to taste',
        'Fresh cilantro for garnish'
      ],
      instructions: [
        'Season chicken pieces with salt, pepper, and paprika.',
        'Heat olive oil in a large pot over medium-high heat.',
        'Add chicken and cook until browned on all sides, about 5-6 minutes. Remove and set aside.',
        'In the same pot, add onions and cook until softened, about 3 minutes.',
        'Add garlic, bell pepper, and carrots. Cook for another 2-3 minutes.',
        'Stir in rice, remaining spices. Toast the rice for 1-2 minutes.',
        'Return chicken to the pot and add chicken broth. Stir well.',
        'Bring to a boil, then reduce heat to low. Cover and simmer for 20 minutes.',
        'Fluff with a fork, garnish with fresh herbs, and serve.'
      ],
      cookingTime: 40,
      servings: 6,
      calories: 420,
      tags: ['chicken', 'rice', 'one-pot', 'dinner'],
      cuisineType: 'International',
      dietaryInfo: {
        isVegetarian: false,
        isVegan: false,
        isGlutenFree: true,
        isDairyFree: true
      }
    },
    
    // Vegetable-focused
    {
      id: 'recipe-fixed-2',
      title: 'Vegetable Stir Fry with Tofu',
      description: 'A colorful vegetable stir fry with crispy tofu in a savory sauce.',
      imageUrl: getFoodImageByRecipe('asian', 'Vegetable Stir Fry with Tofu', ['vegetables', 'tofu', 'vegan'], { isVegetarian: true, isVegan: true }),
      ingredients: [
        '14 oz extra-firm tofu, pressed and cubed',
        '2 tbsp cornstarch',
        '3 tbsp vegetable oil',
        '1 red bell pepper, sliced',
        '1 yellow bell pepper, sliced',
        '2 cups broccoli florets',
        '1 carrot, julienned',
        '1 cup snow peas',
        '3 cloves garlic, minced',
        '1 tbsp ginger, minced',
        '3 tbsp soy sauce or tamari',
        '1 tbsp rice vinegar',
        '1 tbsp maple syrup',
        'Sesame seeds for garnish'
      ],
      instructions: [
        'Toss tofu cubes in cornstarch to coat lightly.',
        'Heat oil in a large wok over medium-high heat.',
        'Add tofu and cook until crispy on all sides, about 5-7 minutes. Remove and set aside.',
        'Add garlic and ginger, stir-fry for 30 seconds.',
        'Add vegetables and stir-fry for 4-5 minutes until crisp-tender.',
        'Make a sauce with soy sauce, rice vinegar, and maple syrup.',
        'Return tofu to the wok, add sauce and toss to combine.',
        'Garnish with sesame seeds before serving.'
      ],
      cookingTime: 25,
      servings: 4,
      calories: 250,
      tags: ['vegetable', 'tofu', 'stir fry', 'vegan'],
      cuisineType: 'Asian',
      dietaryInfo: {
        isVegetarian: true,
        isVegan: true,
        isGlutenFree: false,
        isDairyFree: true
      }
    },
    
    // Rice-based (non-chicken)
    {
      id: 'recipe-fixed-3',
      title: 'Mushroom Risotto',
      description: 'Creamy Italian risotto with mixed mushrooms and Parmesan cheese.',
      imageUrl: getFoodImageByRecipe('italian', 'Mushroom Risotto', ['rice', 'mushroom', 'vegetarian'], { isVegetarian: true, isVegan: false }),
      ingredients: [
        '1 1/2 cups Arborio rice',
        '6 cups vegetable broth, kept warm',
        '1 lb mixed mushrooms, sliced',
        '1 small onion, finely diced',
        '3 cloves garlic, minced',
        '1/2 cup dry white wine',
        '3 tbsp butter, divided',
        '2 tbsp olive oil',
        '1/2 cup grated Parmesan cheese',
        '2 tbsp fresh herbs',
        'Salt and black pepper to taste'
      ],
      instructions: [
        'Heat vegetable broth in a separate pot; keep warm.',
        'In a large pan, heat olive oil and butter over medium heat.',
        'Add mushrooms and cook until browned, about 8 minutes. Remove and set aside.',
        'Add onion and cook until translucent, about 4 minutes.',
        'Add rice and stir for 2 minutes until translucent at edges.',
        'Add wine and stir until absorbed.',
        'Add warm broth 1/2 cup at a time, stirring constantly until absorbed.',
        'Continue this process for about 20 minutes until rice is creamy but al dente.',
        'Stir in mushrooms, Parmesan cheese, and herbs.'
      ],
      cookingTime: 40,
      servings: 4,
      calories: 380,
      tags: ['rice', 'mushroom', 'risotto', 'vegetarian'],
      cuisineType: 'Italian',
      dietaryInfo: {
        isVegetarian: true,
        isVegan: false,
        isGlutenFree: true,
        isDairyFree: false
      }
    },
    
    // Bean-based
    {
      id: 'recipe-fixed-4',
      title: 'Three Bean Vegetarian Chili',
      description: 'Hearty vegetarian chili with three types of beans, vegetables, and warm spices.',
      imageUrl: getFoodImageByRecipe('mexican', 'Vegetarian Chili', ['beans', 'vegetarian', 'chili'], { isVegetarian: true, isVegan: true }),
      ingredients: [
        '1 can black beans, drained',
        '1 can kidney beans, drained',
        '1 can pinto beans, drained',
        '1 can diced tomatoes',
        '1 can tomato paste',
        '1 large onion, diced',
        '1 red bell pepper, diced',
        '1 green bell pepper, diced',
        '3 cloves garlic, minced',
        '2 cups vegetable broth',
        '2 tbsp olive oil',
        '2 tbsp chili powder',
        '1 tbsp ground cumin',
        '1 tsp smoked paprika',
        'Salt and pepper to taste'
      ],
      instructions: [
        'Heat olive oil in a large pot over medium heat.',
        'Add onion and bell peppers. Cook until softened, about 5-7 minutes.',
        'Add garlic, cook for another minute until fragrant.',
        'Stir in spices. Cook for 1 minute to bloom spices.',
        'Add tomatoes, beans, and vegetable broth. Stir to combine.',
        'Bring to a boil, then reduce heat and simmer for 30 minutes.',
        'Season with salt and pepper to taste.'
      ],
      cookingTime: 50,
      servings: 6,
      calories: 280,
      tags: ['beans', 'chili', 'vegan', 'gluten-free'],
      cuisineType: 'Mexican',
      dietaryInfo: {
        isVegetarian: true,
        isVegan: true,
        isGlutenFree: true,
        isDairyFree: true
      }
    },
    
    // Pasta-based
    {
      id: 'recipe-fixed-5',
      title: 'Fresh Vegetable Pasta Primavera',
      description: 'Light pasta dish with spring vegetables in a lemon garlic sauce.',
      imageUrl: getFoodImageByRecipe('italian', 'Pasta Primavera', ['pasta', 'vegetables', 'primavera'], { isVegetarian: true, isVegan: false }),
      ingredients: [
        '12 oz fettuccine pasta',
        '2 cups broccoli florets',
        '1 cup asparagus, cut into pieces',
        '1 bell pepper, thinly sliced',
        '1 cup cherry tomatoes, halved',
        '1 medium zucchini, sliced',
        '3 cloves garlic, minced',
        '1/4 cup olive oil',
        '2 tbsp lemon juice',
        '1/2 cup grated Parmesan cheese',
        '1/4 cup fresh herbs (basil, parsley)',
        'Red pepper flakes (optional)',
        'Salt and pepper to taste'
      ],
      instructions: [
        'Cook pasta according to package directions. Reserve 1/2 cup pasta water before draining.',
        'In a large skillet, heat olive oil over medium heat.',
        'Add garlic and cook for 30 seconds until fragrant.',
        'Add broccoli, asparagus, and bell pepper. Cook for 3-4 minutes.',
        'Add zucchini and tomatoes, cook for another 2 minutes.',
        'Add cooked pasta, lemon juice, and a splash of pasta water.',
        'Toss everything together, adding more pasta water if needed.',
        'Remove from heat and stir in Parmesan and herbs.',
        'Season with salt, pepper, and red pepper flakes if desired.'
      ],
      cookingTime: 25,
      servings: 4,
      calories: 350,
      tags: ['pasta', 'vegetarian', 'vegetables', 'Italian'],
      cuisineType: 'Italian',
      dietaryInfo: {
        isVegetarian: true,
        isVegan: false,
        isGlutenFree: false,
        isDairyFree: false
      }
    },
    
    // Beef-based recipes
    {
      id: 'recipe-fixed-6',
      title: 'Beef and Rice Stuffed Peppers',
      description: 'Bell peppers stuffed with a savory mixture of ground beef, rice, and tomato sauce.',
      imageUrl: getFoodImageByRecipe('comfort', 'Stuffed Peppers', ['beef', 'rice', 'peppers'], { isVegetarian: false, isVegan: false }),
      ingredients: [
        '6 large bell peppers, tops removed and seeded',
        '1 lb ground beef',
        '1 cup cooked rice',
        '1 onion, finely diced',
        '2 cloves garlic, minced',
        '1 can (14.5 oz) diced tomatoes',
        '1 can (8 oz) tomato sauce',
        '1 tsp Italian seasoning',
        '1/2 tsp paprika',
        '1 cup shredded cheese (optional)',
        '2 tbsp olive oil',
        'Salt and pepper to taste',
        'Fresh parsley for garnish'
      ],
      instructions: [
        'Preheat oven to 375°F (190°C).',
        'In a large skillet, heat olive oil over medium heat.',
        'Add onion and cook until softened, about 3-4 minutes.',
        'Add ground beef and garlic, cook until beef is browned.',
        'Stir in diced tomatoes, half the tomato sauce, cooked rice, and seasonings.',
        'Fill each bell pepper with the beef and rice mixture.',
        'Place peppers in a baking dish and pour remaining tomato sauce over them.',
        'Cover with foil and bake for 35 minutes.',
        'If using cheese, remove foil, sprinkle cheese on top, and bake uncovered for 10 more minutes.',
        'Garnish with fresh parsley before serving.'
      ],
      cookingTime: 55,
      servings: 6,
      calories: 320,
      tags: ['beef', 'rice', 'peppers', 'dinner'],
      cuisineType: 'American',
      dietaryInfo: {
        isVegetarian: false,
        isVegan: false,
        isGlutenFree: true,
        isDairyFree: false
      }
    },
    
    // Beef and tomato based
    {
      id: 'recipe-fixed-7',
      title: 'Classic Beef and Tomato Stew',
      description: 'Hearty beef stew with tender chunks of beef, tomatoes, and vegetables in a rich broth.',
      imageUrl: getFoodImageByRecipe('comfort', 'Beef Stew', ['beef', 'tomato', 'stew'], { isVegetarian: false, isVegan: false }),
      ingredients: [
        '2 lbs beef chuck, cut into 1-inch cubes',
        '2 tbsp olive oil',
        '1 large onion, diced',
        '3 cloves garlic, minced',
        '2 carrots, sliced',
        '2 celery stalks, sliced',
        '1 can (28 oz) diced tomatoes',
        '2 tbsp tomato paste',
        '3 cups beef broth',
        '2 bay leaves',
        '1 tsp dried thyme',
        '1 tsp dried rosemary',
        '1 tbsp Worcestershire sauce',
        '2 potatoes, cubed',
        'Salt and pepper to taste',
        'Fresh parsley for garnish'
      ],
      instructions: [
        'Season beef cubes with salt and pepper.',
        'In a large pot or Dutch oven, heat oil over medium-high heat.',
        'Add beef in batches and brown on all sides. Remove and set aside.',
        'In the same pot, add onions and cook until softened.',
        'Add garlic, carrots, and celery. Cook for 3-4 minutes.',
        'Stir in tomato paste and cook for 1 minute.',
        'Return beef to the pot. Add diced tomatoes, beef broth, herbs, and Worcestershire sauce.',
        'Bring to a boil, then reduce heat to low. Cover and simmer for 1.5 hours.',
        'Add potatoes and continue to simmer for 30-40 minutes until beef and potatoes are tender.',
        'Remove bay leaves before serving. Garnish with fresh parsley.'
      ],
      cookingTime: 150,
      servings: 6,
      calories: 380,
      tags: ['beef', 'tomato', 'stew', 'dinner'],
      cuisineType: 'American',
      dietaryInfo: {
        isVegetarian: false,
        isVegan: false,
        isGlutenFree: true,
        isDairyFree: true
      }
    },
    
    // Another beef dish
    {
      id: 'recipe-fixed-8',
      title: 'Beef and Broccoli Stir Fry',
      description: 'Quick and flavorful stir fry with tender beef strips and crisp broccoli in a savory sauce.',
      imageUrl: getFoodImageByRecipe('asian', 'Beef and Broccoli', ['beef', 'broccoli', 'stir fry'], { isVegetarian: false, isVegan: false }),
      ingredients: [
        '1 lb flank steak, thinly sliced against the grain',
        '3 cups broccoli florets',
        '1 red bell pepper, sliced',
        '1 onion, thinly sliced',
        '3 cloves garlic, minced',
        '1 tbsp ginger, minced',
        '3 tbsp soy sauce',
        '1 tbsp oyster sauce',
        '1 tbsp hoisin sauce',
        '1 tsp sesame oil',
        '1 tbsp cornstarch',
        '1/4 cup beef broth',
        '2 tbsp vegetable oil',
        'Sesame seeds for garnish',
        'Green onions, sliced, for garnish'
      ],
      instructions: [
        'In a bowl, whisk together soy sauce, oyster sauce, hoisin sauce, sesame oil, cornstarch, and beef broth.',
        'Heat vegetable oil in a wok or large skillet over high heat.',
        'Add beef and stir-fry until browned, about 2-3 minutes. Remove and set aside.',
        'In the same wok, add garlic and ginger. Stir-fry for 30 seconds.',
        'Add broccoli, bell pepper, and onion. Stir-fry for 4-5 minutes until vegetables are crisp-tender.',
        'Return beef to the wok and add the sauce mixture.',
        'Cook, stirring, until the sauce thickens, about 1-2 minutes.',
        'Garnish with sesame seeds and green onions before serving.'
      ],
      cookingTime: 20,
      servings: 4,
      calories: 320,
      tags: ['beef', 'broccoli', 'stir fry', 'asian'],
      cuisineType: 'Asian',
      dietaryInfo: {
        isVegetarian: false,
        isVegan: false,
        isGlutenFree: false,
        isDairyFree: true
      }
    }
  ];

  // Define interface for scored recipe
  interface ScoredRecipe {
    recipe: Recipe;
    score: number;
    matchCount: number;
    isRelevant: boolean;
  }

  // Convert ingredients to lowercase for case-insensitive matching
  const normalizedIngredients = ingredients.map(ing => ing.toLowerCase());
  
  // Check if ingredients contain certain key terms
  const hasChicken = normalizedIngredients.some(ing => ing.includes('chicken'));
  const hasRice = normalizedIngredients.some(ing => ing.includes('rice'));
  const hasBeef = normalizedIngredients.some(ing => ing.includes('beef'));
  const hasTomato = normalizedIngredients.some(ing => ing.includes('tomato'));
  
  // Score and filter recipes based on how well they match the search criteria
  let scoredRecipes: ScoredRecipe[] = allRecipes.map(recipe => {
    let score = 0;
    let matchCount = 0;
    
    // If no ingredients specified, base score on other factors
    if (ingredients.length === 0) {
      score = 10; // Base score
    } else {
      // Check each requested ingredient against the recipe
      for (const ingredient of normalizedIngredients) {
        let foundMatch = false;
        
        // Title match (highest weight)
        if (recipe.title.toLowerCase().includes(ingredient)) {
          score += 5;
          foundMatch = true;
        }
        
        // Check recipe ingredients (most important)
        for (const recipeIngredient of recipe.ingredients) {
          if (recipeIngredient.toLowerCase().includes(ingredient)) {
            score += 10;
            foundMatch = true;
            break;
          }
        }
        
        // Check tags (good indicator)
        if (recipe.tags.some(tag => tag.toLowerCase().includes(ingredient))) {
          score += 3;
          foundMatch = true;
        }
        
        // Count matching ingredients
        if (foundMatch) {
          matchCount++;
        }
      }
    }
    
    // Special case for beef and rice
    if (hasBeef && hasRice && 
        recipe.title.toLowerCase().includes('beef') && 
        recipe.ingredients.some(i => i.toLowerCase().includes('rice'))) {
      score += 25;
    }
    
    // Special case for beef and tomato
    if (hasBeef && hasTomato && 
        recipe.title.toLowerCase().includes('beef') && 
        recipe.ingredients.some(i => i.toLowerCase().includes('tomato'))) {
      score += 25;
    }
    
    // Check dietary preferences
    if (dietaryPreferences.includes('vegetarian') && !recipe.dietaryInfo.isVegetarian) {
      score -= 30;
    }
    
    if (dietaryPreferences.includes('vegan') && !recipe.dietaryInfo.isVegan) {
      score -= 30;
    }
    
    if (dietaryPreferences.includes('gluten-free') && !recipe.dietaryInfo.isGlutenFree) {
      score -= 30;
    }
    
    if (dietaryPreferences.includes('dairy-free') && !recipe.dietaryInfo.isDairyFree) {
      score -= 30;
    }
    
    // Cuisine type matching
    if (cuisineType && recipe.cuisineType.toLowerCase() === cuisineType.toLowerCase()) {
      score += 10;
    }
    
    // A recipe is relevant if it has at least one matching ingredient or no ingredients were specified
    const isRelevant = ingredients.length === 0 || matchCount > 0;
    
    return { recipe, score, matchCount, isRelevant };
  });
  
  // Filter out irrelevant recipes when ingredients are specified
  if (ingredients.length > 0) {
    scoredRecipes = scoredRecipes.filter(item => item.isRelevant);
    console.log('Filtered recipes after ingredient matching:', scoredRecipes.map(r => r.recipe.title));
  }
  
  // Sort by score (highest first)
  scoredRecipes.sort((a, b) => b.score - a.score);
  
  // No search criteria? Return a diverse set by default (non-chicken focused)
  if (!ingredients.length && !dietaryPreferences.length && !cuisineType) {
    // Return default recipes with pagination
    const defaultRecipes = [allRecipes[1], allRecipes[2], allRecipes[4], allRecipes[5], allRecipes[6], allRecipes[7]];
    return defaultRecipes.slice(offset, offset + 3);
  }
  
  // If we have any scored recipes after filtering
  if (scoredRecipes.length > 0) {
    // Return 3 recipes with pagination (offset)
    return scoredRecipes
      .map(item => item.recipe)
      .slice(offset, offset + 3);
  }
  
  // If we don't have any matches after filtering, use a diverse fallback set
  // but only if offset is 0 (first page)
  if (offset === 0) {
    return [allRecipes[1], allRecipes[4], allRecipes[6]];
  }
  
  // For pagination with no matches, return empty array
  return [];
}
