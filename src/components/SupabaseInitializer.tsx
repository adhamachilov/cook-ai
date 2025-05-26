import { useEffect } from 'react';
import { supabase } from '../services/supabase';

const SupabaseInitializer = () => {
  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        // Check if the recipes table exists
        const { error } = await supabase
          .from('recipes')
          .select('id')
          .limit(1);
        
        if (error) {
          console.log('Creating recipes table...');
          // Table doesn't exist or error occurred, so create it
          const createTableResponse = await supabase.rpc('create_recipes_table');
          if (createTableResponse.error) {
            console.error('Error creating recipes table:', createTableResponse.error);
          } else {
            console.log('Recipes table created successfully!');
          }
        } else {
          console.log('Recipes table exists, no need to create it.');
        }
      } catch (error) {
        console.error('Error initializing database:', error);
      }
    };
    
    initializeDatabase();
  }, []);
  
  return null; // This component doesn't render anything
};

export default SupabaseInitializer;
