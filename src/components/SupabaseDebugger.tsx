import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

const SupabaseDebugger: React.FC = () => {
  const [tables, setTables] = useState<any[]>([]);
  const [columns, setColumns] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSchema = async () => {
      try {
        setIsLoading(true);
        
        // First, try to get a list of tables
        const { data: tableData, error: tableError } = await supabase
          .from('recipes')
          .select('*')
          .limit(1);

        if (tableError) {
          setError(`Error fetching recipes: ${tableError.message}`);
          
          // Try to see if the table exists
          const { data: tableList, error: listError } = await supabase
            .rpc('list_tables');
            
          if (!listError && tableList) {
            setTables(tableList);
          } else {
            setError(`Table error: ${tableError.message}, List error: ${listError?.message || 'none'}`);
          }
        } else {
          // If we got data, try to extract column names
          if (tableData && tableData.length > 0) {
            // Get all column names from the first record
            const columnNames = Object.keys(tableData[0]);
            setColumns(columnNames.map(name => ({ name })));
            setTables([{ name: 'recipes' }]);
          } else {
            setError('No data found in recipes table');
          }
        }
      } catch (err) {
        setError(`Unexpected error: ${(err as Error).message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchema();
  }, []);

  // Function to create the recipes table if it doesn't exist
  const createRecipesTable = async () => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase.rpc('create_recipes_table');
      
      if (error) {
        // If RPC doesn't exist, try SQL query directly
        const result = await supabase.from('recipes').insert([
          {
            title: 'Test Recipe',
            description: 'Test description',
            imageUrl: 'https://example.com/image.jpg',
            cookingTime: 30,
            servings: 4,
            ingredients: ['Test ingredient'],
            instructions: ['Test instruction'],
            likes: 10
          }
        ]);
        
        if (result.error) {
          setError(`Failed to create test recipe: ${result.error.message}`);
        } else {
          setError(null);
          // Refresh the page to see the changes
          window.location.reload();
        }
      } else {
        setError(null);
        // Refresh the page to see the changes
        window.location.reload();
      }
    } catch (err) {
      setError(`Error creating table: ${(err as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-amber-900/80 text-white p-4 rounded-lg shadow-lg max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Supabase Database Debugger</h2>
      
      {isLoading ? (
        <p>Loading database information...</p>
      ) : error ? (
        <div>
          <p className="text-red-300 mb-4">Error: {error}</p>
          <button 
            onClick={createRecipesTable}
            className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded"
          >
            Create Recipes Table
          </button>
        </div>
      ) : (
        <div>
          <h3 className="text-xl font-semibold mb-2">Tables:</h3>
          <ul className="mb-4 list-disc pl-5">
            {tables.map((table, i) => (
              <li key={i}>{table.name}</li>
            ))}
          </ul>
          
          <h3 className="text-xl font-semibold mb-2">Columns in Recipes Table:</h3>
          <ul className="list-disc pl-5">
            {columns.map((column, i) => (
              <li key={i}>{column.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SupabaseDebugger;
