// Utility function to ensure image URLs have proper parameters
export function ensureImageParams(url: string): string {
  // If the URL already has parameters, return it as is
  if (url.includes('?')) {
    return url;
  }
  
  // Add standard parameters for Unsplash images
  return `${url}?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80`;
}

// Global registry for tracking used images
export class ImageTracker {
  private static instance: ImageTracker;
  private usedImages: Set<string> = new Set();
  private categoryCache: Map<string, string[]> = new Map();

  private constructor() {}

  public static getInstance(): ImageTracker {
    if (!ImageTracker.instance) {
      ImageTracker.instance = new ImageTracker();
    }
    return ImageTracker.instance;
  }

  public isImageUsed(image: string): boolean {
    return this.usedImages.has(image);
  }

  public markImageAsUsed(image: string): void {
    this.usedImages.add(image);
  }

  public getUnusedImagesForCategory(category: string, allImages: string[]): string[] {
    // Cache the original images for this category
    if (!this.categoryCache.has(category)) {
      this.categoryCache.set(category, [...allImages]);
    }

    // Filter out images that are already used
    const unusedImages = allImages.filter(img => !this.usedImages.has(img));

    // If we're running out of unused images for this category, reset tracking
    if (unusedImages.length < 3) {
      // Remember images from other categories
      const otherCategoryImages: string[] = [];
      this.usedImages.forEach(img => {
        if (!allImages.includes(img)) {
          otherCategoryImages.push(img);
        }
      });

      // Clear used images
      this.usedImages.clear();

      // Re-add images from other categories
      otherCategoryImages.forEach(img => {
        this.usedImages.add(img);
      });

      // Return fresh list of unused images
      return allImages.filter(img => !this.usedImages.has(img));
    }

    return unusedImages;
  }

  public getUniqueImageForRecipe(category: string, allImages: string[], title: string, forceUnique: boolean = false): string {
    // First ensure all image URLs have proper parameters
    const processedImages = allImages.map(img => ensureImageParams(img));
    
    let unusedImages = this.getUnusedImagesForCategory(category, processedImages);
    
    // Force uniqueness by clearing used images if we need more unique images
    if (forceUnique && unusedImages.length === 0) {
      console.log('Forcing image uniqueness for:', category);
      // Clear used images for this category only
      const usedImagesFromThisCategory = processedImages.filter(img => this.usedImages.has(img));
      usedImagesFromThisCategory.forEach(img => this.usedImages.delete(img));
      // Get fresh list of unused images
      unusedImages = processedImages;
    }
    
    // Get a consistent but pseudo-random index based on the recipe title
    const hash = (str: string): number => {
      let hashValue = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hashValue = ((hashValue << 5) - hashValue) + char;
        hashValue = hashValue & hashValue; // Convert to 32bit integer
      }
      return Math.abs(hashValue);
    };
    
    // Add some randomness to the hash based on current timestamp
    // This helps make different calls produce different results
    const timeBasedRandomizer = Date.now() % 100;
    const combinedHash = hash(title + timeBasedRandomizer.toString());
    
    let selectedImage: string;
    
    if (unusedImages.length > 0) {
      // Use hash of recipe title to select a specific image from unused ones
      const index = combinedHash % unusedImages.length;
      selectedImage = unusedImages[index];
    } else {
      // Fallback - use hash of recipe title to select any image
      const index = combinedHash % processedImages.length;
      selectedImage = processedImages[index];
    }
    
    // Mark this image as used
    this.markImageAsUsed(selectedImage);
    
    // Ensure the selected image has proper parameters
    return selectedImage;
  }
}

export default ImageTracker.getInstance();
