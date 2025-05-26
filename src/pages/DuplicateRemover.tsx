import React, { useState } from 'react';
import Button from '../components/ui/Button';

const DuplicateRemover: React.FC = () => {
  const [status, setStatus] = useState('Click the button to remove duplicate recipes');
  const [isWorking, setIsWorking] = useState(false);
  
  const SUPABASE_URL = 'https://jcswgbrzelleyxfeckhr.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impjc3dnYnJ6ZWxsZXl4ZmVja2hyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxNzE3NDQsImV4cCI6MjA2Mzc0Nzc0NH0.EnBiPpGWrWKumER7eeFV3LAIyGQ0jzWEUq9KXzUCLA0';

  const removeDuplicates = async () => {
    if (isWorking) return;
    
    setIsWorking(true);
    setStatus('Looking for duplicate recipes...');
    
    try {
      // Get all recipes
      const response = await fetch(`${SUPABASE_URL}/rest/v1/recipes?select=id,title`, {
        method: 'GET',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch recipes: ${response.statusText}`);
      }
      
      const recipes = await response.json();
      setStatus(`Found ${recipes.length} total recipes. Checking for duplicates...`);
      
      // Find duplicates by title
      const titleMap = new Map<string, string>();
      const duplicates: string[] = [];
      
      recipes.forEach((recipe: {id: string, title: string}) => {
        if (!titleMap.has(recipe.title)) {
          titleMap.set(recipe.title, recipe.id);
        } else {
          // This is a duplicate
          duplicates.push(recipe.id);
        }
      });
      
      setStatus(`Found ${duplicates.length} duplicate recipes. Removing them...`);
      
      // Delete each duplicate
      for (const id of duplicates) {
        const deleteResponse = await fetch(`${SUPABASE_URL}/rest/v1/recipes?id=eq.${id}`, {
          method: 'DELETE',
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`
          }
        });
        
        if (!deleteResponse.ok) {
          throw new Error(`Failed to delete recipe ${id}: ${deleteResponse.statusText}`);
        }
      }
      
      if (duplicates.length > 0) {
        setStatus(`✅ Successfully removed ${duplicates.length} duplicate recipes! Refresh the Popular page to see the changes.`);
      } else {
        setStatus('✅ No duplicate recipes found. Your database is clean!');
      }
    } catch (error) {
      console.error('Error removing duplicates:', error);
      setStatus(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsWorking(false);
    }
  };
  
  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-4">Recipe Duplicate Remover</h2>
      <p className="mb-4">This tool finds and removes duplicate recipes from your database.</p>
      <div className="mb-4 p-4 bg-gray-100 rounded">
        <p>{status}</p>
      </div>
      <Button 
        onClick={removeDuplicates} 
        disabled={isWorking}
        className="w-full"
      >
        {isWorking ? 'Working...' : 'Remove Duplicate Recipes'}
      </Button>
    </div>
  );
};

export default DuplicateRemover;
