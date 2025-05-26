import React, { useState } from 'react';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import { supabase } from '../services/supabase-minimal';

const DeleteRecipes: React.FC = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState('');

  const handleDeleteAllRecipes = async () => {
    if (!window.confirm('Are you sure you want to delete ALL recipes? This cannot be undone.')) {
      return;
    }
    
    setIsDeleting(true);
    setMessage('Deleting all recipes...');
    
    try {
      const { error } = await supabase
        .from('recipes')
        .delete()
        .neq('id', 'placeholder'); // Delete all recipes
        
      if (error) {
        throw new Error(`Failed to delete recipes: ${error.message}`);
      }
      
      setMessage('Successfully deleted all recipes!');
    } catch (err) {
      setMessage(`Error: ${err instanceof Error ? err.message : 'Unknown error occurred'}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen pt-10 pb-20">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mb-10 text-center">
          <h1 className="relative inline-block text-4xl font-bold text-white mb-3">
            Delete All Recipes
            <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 rounded"></span>
          </h1>
          <p className="text-white text-lg max-w-2xl mx-auto">
            Use this page to delete all recipes from the database
          </p>
        </div>
        
        <div className="bg-amber-800/30 p-6 rounded-lg mb-8 max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold text-white mb-4">Warning: This Action Cannot Be Undone</h2>
          
          <p className="text-amber-100 mb-6">
            Clicking the button below will permanently delete all recipes from the database. 
            This is useful when you want to start fresh with new recipes.
          </p>
          
          <Button 
            onClick={handleDeleteAllRecipes} 
            disabled={isDeleting}
            className="w-full bg-red-700 hover:bg-red-800"
          >
            {isDeleting ? (
              <>
                <Spinner size="sm" /> 
                Deleting All Recipes...
              </>
            ) : 'Delete All Recipes'}
          </Button>
          
          {message && (
            <div className={`mt-4 p-3 rounded ${message.includes('Error') ? 'bg-red-900/50 text-red-100' : 'bg-green-900/50 text-green-100'}`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeleteRecipes;
