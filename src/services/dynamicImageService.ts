import { GoogleGenerativeAI } from '@google/generative-ai';
import { Recipe } from '../types';

// Initialize the Google Generative AI with the provided API key
const API_KEY = 'AIzaSyCUNZNb-Z696gRKZr_rh7KwdTJaG-_iYIw';
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

// Cache for storing image URLs to avoid redundant searches
const imageCache = new Map<string, string[]>();

// Track used images to ensure uniqueness in a session
const usedImages = new Set<string>();

/**
 * Class to dynamically find and manage food images for recipes
 */
class DynamicImageService {
  private static instance: DynamicImageService;

  private constructor() {}

  public static getInstance(): DynamicImageService {
    if (!DynamicImageService.instance) {
      DynamicImageService.instance = new DynamicImageService();
    }
    return DynamicImageService.instance;
  }

  /**
   * Generates a search query based on recipe details
   */
  private generateSearchQuery(recipe: Partial<Recipe>): string {
    const { title, cuisineType, tags, dietaryInfo, ingredients } = recipe;
    
    // Create a search query based on recipe details
    let searchQuery = `high quality food photo of ${title || 'food'}`;
    
    if (cuisineType) {
      searchQuery += ` ${cuisineType} cuisine`;
    }
    
    // Add dietary info
    if (dietaryInfo?.isVegetarian) {
      searchQuery += ' vegetarian';
    } else if (dietaryInfo?.isVegan) {
      searchQuery += ' vegan';
    }
    
    // Add key ingredients if available
    if (ingredients && Array.isArray(ingredients) && ingredients.length > 0) {
      // Take first 3 main ingredients
      const mainIngredients = ingredients.slice(0, 3).join(', ');
      searchQuery += ` with ${mainIngredients}`;
    } else if (typeof ingredients === 'string' && ingredients) {
      searchQuery += ` with ${ingredients.split(',')[0]}`;
    }
    
    // Add key tags
    if (tags && tags.length > 0) {
      const relevantTags = tags.slice(0, 2).join(', ');
      searchQuery += ` ${relevantTags}`;
    }
    
    // Add professional photo qualifiers
    searchQuery += ' professional food photography, dark amber lighting, high resolution';
    
    return searchQuery;
  }
  
  /**
   * Find relevant image for a recipe using AI
   */
  public async findImageForRecipe(recipe: Partial<Recipe>, forceUnique: boolean = false): Promise<string> {
    try {
      // Generate search query
      const searchQuery = this.generateSearchQuery(recipe);
      
      // Check cache first
      const cacheKey = searchQuery.toLowerCase();
      if (imageCache.has(cacheKey)) {
        const cachedImages = imageCache.get(cacheKey)!;
        
        // Find an unused image from the cache if possible
        if (forceUnique) {
          const unusedImages = cachedImages.filter(img => !usedImages.has(img));
          
          if (unusedImages.length > 0) {
            const selectedImage = unusedImages[Math.floor(Math.random() * unusedImages.length)];
            usedImages.add(selectedImage);
            return selectedImage;
          }
          
          // If all images were used and we need a unique one, clear used status for this cache
          if (forceUnique) {
            cachedImages.forEach(img => usedImages.delete(img));
          }
        }
        
        // Return a random image from the cached results
        const selectedImage = cachedImages[Math.floor(Math.random() * cachedImages.length)];
        usedImages.add(selectedImage);
        return selectedImage;
      }
      
      // Create a prompt for the AI to find image URLs
      const prompt = `
        I need a valid, high-quality food image URL for: "${searchQuery}".
        
        IMPORTANT REQUIREMENTS:
        1. ONLY return direct image URLs (https://...) from reputable sources like Unsplash, Pexels, or other free-to-use sources
        2. The image MUST be a food photo in landscape orientation that looks appetizing
        3. Return exactly 5 valid image URLs as a JSON array, nothing else
        4. Ensure the URLs end with image extensions (.jpg, .jpeg, .png, etc.) or include proper query parameters
        5. Make sure they work directly when pasted in a browser - NO broken URLs
        6. The images should have a dark amber mood/lighting that looks professional
        7. DO NOT include stock photo watermarks
        
        Format your response as a JSON array of strings ONLY, like this: ["url1", "url2", "url3", "url4", "url5"]
      `;
      
      // Generate content from AI
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      
      // Extract URLs from response
      const urlMatch = text.match(/\[[\s\S]*\]/);
      if (urlMatch) {
        try {
          const urls = JSON.parse(urlMatch[0]) as string[];
          if (urls && urls.length > 0) {
            // Filter to ensure they're valid image URLs
            const validUrls = urls.filter(url => 
              url.startsWith('http') && 
              (url.match(/\.(jpeg|jpg|png|webp)/i) || 
               url.includes('unsplash.com') || 
               url.includes('pexels.com'))
            );
            
            if (validUrls.length > 0) {
              // Store in cache
              imageCache.set(cacheKey, validUrls);
              // Mark as used and return
              const selectedImage = validUrls[0];
              usedImages.add(selectedImage);
              return selectedImage;
            }
          }
        } catch (error) {
          console.error('Error parsing image URLs:', error);
        }
      }
      
      // Fallback to a default Unsplash food image with proper dark amber lighting
      const fallbackImage = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80&auto=enhance&amber=40';
      usedImages.add(fallbackImage);
      return fallbackImage;
    } catch (error) {
      console.error('Error finding image for recipe:', error);
      // Fallback to a default image
      const fallbackImage = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80&auto=enhance&amber=40';
      usedImages.add(fallbackImage);
      return fallbackImage;
    }
  }
  
  /**
   * A synchronous version that returns a placeholder and updates the image later
   */
  public getImageWithPlaceholder(recipe: Partial<Recipe>, updateCallback: (imageUrl: string) => void): string {
    // Return a placeholder immediately
    const placeholderImage = 'https://images.unsplash.com/photo-1506368249639-73a05d6f6488?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80&blur=20';
    
    // Fetch the real image asynchronously
    this.findImageForRecipe(recipe).then(imageUrl => {
      // Call the callback with the real image when ready
      updateCallback(imageUrl);
    }).catch(err => {
      console.error('Error getting image:', err);
      // Use placeholder as fallback
      updateCallback(placeholderImage);
    });
    
    // Return placeholder immediately
    return placeholderImage;
  }
  
  /**
   * Clear the image cache
   */
  public clearCache(): void {
    imageCache.clear();
    usedImages.clear();
  }
}

// Export singleton instance
export default DynamicImageService.getInstance();
