import { GoogleGenerativeAI } from '@google/generative-ai';
// No need to import Recipe since we're using specific parameters instead

// Initialize the Google Generative AI with the provided API key
const API_KEY = 'AIzaSyCUNZNb-Z696gRKZr_rh7KwdTJaG-_iYIw';
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

// Cache for storing image URLs to avoid redundant searches
const imageCache = new Map<string, string[]>();

// Track used images to ensure uniqueness
const usedImages = new Set<string>();

/**
 * Uses Google's AI to find relevant food images based on recipe details
 */
export async function findImageForRecipe(
  title: string,
  cuisineType: string = '',
  tags: string[] = [], 
  dietaryInfo: { isVegetarian: boolean; isVegan: boolean } = { isVegetarian: false, isVegan: false },
  ingredients: string = '',
  forceUnique: boolean = false
): Promise<string> {
  try {
    // Create a search query based on recipe details
    let searchQuery = `high quality food photo of ${title || 'food'}`;
    
    if (cuisineType) {
      searchQuery += ` ${cuisineType} cuisine`;
    }
    
    // Add dietary info
    if (dietaryInfo?.isVegetarian) {
      searchQuery += ' vegetarian dish';
    } else if (dietaryInfo?.isVegan) {
      searchQuery += ' vegan dish';
    }
    
    // Add key ingredients if available
    if (ingredients) {
      // Extract first few ingredients
      const mainIngredients = ingredients.split(',').slice(0, 2).join(', ');
      if (mainIngredients) {
        searchQuery += ` with ${mainIngredients}`;
      }
    }
    
    // Add key tags
    if (tags && tags.length > 0) {
      const relevantTags = tags.slice(0, 2).join(', ');
      searchQuery += ` ${relevantTags}`;
    }
    
    // Add quality and styling requirements matching dark amber theme
    searchQuery += ' professional food photography, dark amber lighting, high resolution';
    
    // Check cache first
    const cacheKey = searchQuery.toLowerCase();
    if (imageCache.has(cacheKey)) {
      const cachedImages = imageCache.get(cacheKey)!;
      
      if (forceUnique) {
        // Find an unused image if possible
        const unusedImages = cachedImages.filter(img => !usedImages.has(img));
        
        if (unusedImages.length > 0) {
          const selectedImage = unusedImages[Math.floor(Math.random() * unusedImages.length)];
          usedImages.add(selectedImage);
          return selectedImage;
        }
        
        // If we need unique images but all are used, clear the used status for this category
        cachedImages.forEach(img => usedImages.delete(img));
      }
      
      // Select a random image from cache
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
    
    console.log(`Finding AI images for: ${searchQuery}`);
    
    // Generate content from AI
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    // Extract URLs from response
    const urlMatch = text.match(/\[\s\S]*\]/);
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
            // Select and mark as used
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
    const fallbackImage = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';
    return fallbackImage;
  } catch (error) {
    console.error('Error finding image for recipe:', error);
    // Fallback to a default image
    return 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';
  }
}

/**
 * Get a placeholder image while the AI is searching for a better match
 */
export function getPlaceholderImage(): string {
  // Return a food placeholder with dark amber styling
  return 'https://images.unsplash.com/photo-1506368249639-73a05d6f6488?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80&blur=20';
}

/**
 * Clear the image cache
 */
export function clearImageCache(): void {
  imageCache.clear();
  usedImages.clear();
}
