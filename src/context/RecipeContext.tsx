import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Recipe, AIRecipeRequest } from '../types';
import { getRecipeSuggestionsFromAI } from '../services/ai';

interface RecipeContextType {
  recipes: Recipe[];
  favoriteRecipes: Recipe[];
  popularRecipes: Recipe[];
  isLoading: boolean;
  addToFavorites: (recipe: Recipe) => void;
  removeFromFavorites: (recipeId: string) => void;
  isFavorite: (recipeId: string) => boolean;
  getRecipes: (request: AIRecipeRequest, offset?: number) => Promise<Recipe[]>;
  loadMoreRecipes: (request: AIRecipeRequest, currentRecipes: Recipe[]) => Promise<Recipe[]>;
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export const RecipeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>(() => {
    const savedFavorites = localStorage.getItem('favoriteRecipes');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });
  const [popularRecipes, setPopularRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Save favorite recipes to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('favoriteRecipes', JSON.stringify(favoriteRecipes));
  }, [favoriteRecipes]);

  // Initialize with popular recipes
  useEffect(() => {
    const initialPopularRecipes: Recipe[] = [
      {
        id: 'pop-1',
        title: 'Mediterranean Grilled Chicken Salad',
        imageUrl: 'https://images.pexels.com/photos/6249321/pexels-photo-6249321.jpeg',
        description: 'A refreshing salad with grilled chicken, mixed greens, feta cheese, olives, and a zesty lemon dressing.',
        cookingTime: 30,
        servings: 2,
        calories: 320,
        ingredients: [
          '2 boneless chicken breasts',
          '4 cups mixed greens',
          '1/4 cup feta cheese, crumbled',
          '1/4 cup kalamata olives, pitted',
          '1 cucumber, diced',
          '1 red bell pepper, sliced',
          '1/4 red onion, thinly sliced',
          '2 tablespoons olive oil',
          '1 tablespoon lemon juice',
          '1 teaspoon dried oregano',
          'Salt and pepper to taste'
        ],
        instructions: [
          'Season chicken breasts with salt, pepper, and oregano.',
          'Grill chicken for 6-7 minutes per side until fully cooked.',
          'Let chicken rest for 5 minutes, then slice.',
          'In a large bowl, combine mixed greens, cucumber, bell pepper, and onion.',
          'Top with sliced chicken, feta cheese, and olives.',
          'Whisk together olive oil, lemon juice, oregano, salt, and pepper.',
          'Drizzle dressing over salad and serve immediately.'
        ],
        tags: ['Healthy', 'High Protein', 'Mediterranean', 'Salad', 'Quick Meal'],
        cuisineType: 'Mediterranean',
        dietaryInfo: {
          isVegetarian: false,
          isVegan: false,
          isGlutenFree: true,
          isDairyFree: false
        }
      },
      {
        id: 'pop-2',
        title: 'Classic Beef Bolognese',
        imageUrl: 'https://images.pexels.com/photos/6287465/pexels-photo-6287465.jpeg',
        description: 'A rich and hearty Italian pasta sauce with ground beef, tomatoes, and aromatic herbs and vegetables.',
        cookingTime: 80,
        servings: 6,
        calories: 450,
        ingredients: [
          '1 lb ground beef',
          '1 onion, finely chopped',
          '2 carrots, finely diced',
          '2 celery stalks, finely diced',
          '4 garlic cloves, minced',
          '1 can (28 oz) crushed tomatoes',
          '1/4 cup tomato paste',
          '1 cup beef broth',
          '1/2 cup red wine (optional)',
          '2 bay leaves',
          '1 teaspoon dried oregano',
          '1/2 teaspoon dried thyme',
          '1/4 cup fresh basil, chopped',
          '1/4 cup heavy cream (optional)',
          'Salt and pepper to taste',
          '1 lb spaghetti pasta',
          'Grated Parmesan cheese for serving'
        ],
        instructions: [
          'Heat olive oil in a large pot over medium heat.',
          'Add onion, carrots, and celery, and sauté until softened, about 5-7 minutes.',
          'Add garlic and cook for 1 minute until fragrant.',
          'Increase heat to medium-high and add ground beef, breaking it apart with a spoon.',
          'Cook until beef is browned, about 5-7 minutes.',
          'Add tomato paste and cook for 2 minutes.',
          'Pour in red wine (if using) and simmer until reduced by half.',
          'Add crushed tomatoes, beef broth, bay leaves, oregano, and thyme.',
          'Bring to a boil, then reduce heat to low and simmer uncovered for 45-60 minutes.',
          'Cook pasta according to package instructions.',
          'Remove bay leaves from sauce and stir in chopped basil and cream (if using).',
          'Season with salt and pepper to taste.',
          'Serve sauce over pasta with grated Parmesan cheese.'
        ],
        tags: ['Italian', 'Pasta', 'Dinner', 'Comfort Food'],
        cuisineType: 'Italian',
        dietaryInfo: {
          isVegetarian: false,
          isVegan: false,
          isGlutenFree: false,
          isDairyFree: false
        }
      },
      {
        id: 'pop-3',
        title: 'Double Chocolate Brownies',
        imageUrl: 'https://images.pexels.com/photos/2067396/pexels-photo-2067396.jpeg',
        description: 'Decadent, fudgy brownies with rich chocolate flavor and chunks of chocolate throughout.',
        cookingTime: 40,
        servings: 16,
        calories: 280,
        ingredients: [
          '1 cup unsalted butter',
          '2 cups granulated sugar',
          '4 large eggs',
          '1 tablespoon vanilla extract',
          '1 cup all-purpose flour',
          '1 cup unsweetened cocoa powder',
          '1/2 teaspoon salt',
          '1 cup chocolate chips',
          '1/2 cup chopped walnuts (optional)'
        ],
        instructions: [
          'Preheat oven to 350°F (175°C). Line a 9x13 inch baking dish with parchment paper.',
          'Melt butter in a large microwave-safe bowl.',
          'Whisk in sugar until combined.',
          'Add eggs one at a time, whisking well after each addition.',
          'Stir in vanilla extract.',
          'In a separate bowl, whisk together flour, cocoa powder, and salt.',
          'Gradually add dry ingredients to wet ingredients, stirring until just combined.',
          'Fold in chocolate chips and walnuts (if using).',
          'Pour batter into prepared baking dish and spread evenly.',
          'Bake for 25-30 minutes, or until a toothpick inserted in the center comes out with a few moist crumbs.',
          'Allow to cool completely before cutting into squares.'
        ],
        tags: ['Dessert', 'Chocolate', 'Baking', 'Sweet Treats'],
        cuisineType: 'American',
        dietaryInfo: {
          isVegetarian: true,
          isVegan: false,
          isGlutenFree: false,
          isDairyFree: false
        }
      },
      {
        id: 'pop-4',
        title: 'Beef & Tomato Stuffed Peppers',
        imageUrl: 'https://images.pexels.com/photos/4201784/pexels-photo-4201784.jpeg',
        description: 'Bell peppers stuffed with seasoned ground beef, rice, and tomatoes.',
        cookingTime: 50,
        servings: 4,
        calories: 400,
        ingredients: [
          '4 bell peppers, any color',
          '1 lb ground beef',
          '1 cup cooked rice',
          '1 can (14.5 oz) diced tomatoes',
          '1 onion, finely chopped',
          '2 cloves garlic, minced',
          '1 teaspoon paprika',
          'Salt and pepper to taste',
          'Shredded cheddar cheese for serving (optional)'
        ],
        instructions: [
          'Preheat oven to 375°F (190°C).',
          'Cut off tops of peppers and remove seeds and membranes.',
          'In a large skillet, cook ground beef over medium-high heat until browned, breaking it apart with a spoon.',
          'Add onion and garlic to skillet and cook until softened.',
          'Stir in cooked rice, diced tomatoes, paprika, salt, and pepper.',
          'Stuff each pepper with beef and rice mixture and top with cheese (if using).',
          'Bake for 25-30 minutes, or until peppers are tender.'
        ],
        tags: ['Beef', 'Stuffed Peppers', 'Dinner', 'Comfort Food'],
        cuisineType: 'American',
        dietaryInfo: {
          isVegetarian: false,
          isVegan: false,
          isGlutenFree: false,
          isDairyFree: false
        }
      },
      {
        id: 'pop-5',
        title: 'Beef Quesadillas',
        description: 'A layered quesadilla stack featuring seasoned ground beef and melted cheese.',
        imageUrl: 'https://images.pexels.com/photos/9004509/pexels-photo-9004509.jpeg',
        ingredients: [
          'Flour tortillas', 'Ground beef', 'Taco seasoning', 'Cheese', 'Tomatoes', 
          'Onion', 'Jalapeños', 'Sour cream', 'Salsa', 'Cilantro'
        ],
        instructions: [
          'Season and cook ground beef.',
          'Layer tortillas with beef and cheese.',
          'Cook in skillet until cheese melts and tortillas are crisp.',
          'Cut into wedges and serve with salsa and sour cream.'
        ],
        cookingTime: 45,
        servings: 4,
        calories: 600,
        tags: ['mexican', 'beef', 'cheese'],
        cuisineType: 'mexican',
        dietaryInfo: {
          isVegetarian: false,
          isVegan: false,
          isGlutenFree: false,
          isDairyFree: false
        }
      },
      {
        id: 'pop-6',
        title: 'Mediterranean Beef & Rice Skillet',
        description: 'A flavorful skillet dish with ground beef, rice, and Mediterranean spices.',
        imageUrl: 'https://images.pexels.com/photos/7625056/pexels-photo-7625056.jpeg',
        ingredients: [
          'Ground beef', 'Rice', 'Tomatoes', 'Onion', 'Bell pepper', 
          'Garlic', 'Oregano', 'Cinnamon', 'Cumin', 'Olive oil', 'Feta cheese'
        ],
        instructions: [
          'Brown beef with onions and garlic.',
          'Add rice, tomatoes, and spices.',
          'Simmer until rice is tender.',
          'Top with crumbled feta cheese.',
          'Garnish with fresh herbs before serving.'
        ],
        cookingTime: 45,
        servings: 4,
        calories: 520,
        tags: ['mediterranean', 'beef', 'one-pot'],
        cuisineType: 'mediterranean',
        dietaryInfo: {
          isVegetarian: false,
          isVegan: false,
          isGlutenFree: true,
          isDairyFree: false
        }
      }
    ];

    setPopularRecipes(initialPopularRecipes);
  }, []);

  const addToFavorites = (recipe: Recipe) => {
    if (!favoriteRecipes.some(r => r.id === recipe.id)) {
      setFavoriteRecipes([...favoriteRecipes, recipe]);
    }
  };

  const removeFromFavorites = (recipeId: string) => {
    setFavoriteRecipes(favoriteRecipes.filter(recipe => recipe.id !== recipeId));
  };

  const isFavorite = (recipeId: string) => {
    return favoriteRecipes.some(recipe => recipe.id === recipeId);
  };

  const getRecipes = async (request: AIRecipeRequest, offset: number = 0): Promise<Recipe[]> => {
    console.log('getRecipes called with request:', request, 'offset:', offset);
    setIsLoading(true);
    try {
      console.log('Calling getRecipeSuggestionsFromAI...');
      const newRecipes = await getRecipeSuggestionsFromAI(request, offset);
      console.log('Received recipes from AI:', newRecipes);
      setRecipes(newRecipes);
      return newRecipes;
    } catch (error) {
      console.error('Error fetching recipes:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };
  
  const loadMoreRecipes = async (request: AIRecipeRequest, currentRecipes: Recipe[]): Promise<Recipe[]> => {
    setIsLoading(true);
    try {
      // Calculate the offset based on the number of current recipes
      const offset = currentRecipes.length;
      
      // Get more recipes - pass current recipes to avoid duplicates
      const result = await getRecipeSuggestionsFromAI(request, offset);
      
      // Combine with existing recipes
      const combinedRecipes = [...currentRecipes, ...result];
      setRecipes(combinedRecipes);
      return combinedRecipes;
    } catch (error) {
      console.error('Error fetching more recipes:', error);
      return currentRecipes; // Return the current recipes if there's an error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RecipeContext.Provider
      value={{
        recipes,
        favoriteRecipes,
        popularRecipes,
        isLoading,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        getRecipes,
        loadMoreRecipes
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
};

export const useRecipes = () => {
  const context = useContext(RecipeContext);
  if (context === undefined) {
    throw new Error('useRecipes must be used within a RecipeProvider');
  }
  return context;
};