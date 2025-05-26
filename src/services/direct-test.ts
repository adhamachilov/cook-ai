/**
 * This is a direct test file to fix the database connection issues
 */
export const runDirectDatabaseTest = async () => {
  try {
    console.log('DIRECT TEST: Starting direct database test...');
    
    // First try to fetch all recipes to make sure the connection works at all
    console.log('DIRECT TEST: Testing read access...');
    try {
      const readTestResponse = await fetch('https://ymbmwarbczwbnthhmhfu.supabase.co/rest/v1/recipes?limit=1', {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltYm13YXJiY3p3Ym50aGhtaGZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxNTMwMjksImV4cCI6MjA2MzcyOTAyOX0.MaLlsNQbRkAzJlEcvFBt1ALezgbD7DlQs0oWQcQ9LuQ',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltYm13YXJiY3p3Ym50aGhtaGZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxNTMwMjksImV4cCI6MjA2MzcyOTAyOX0.MaLlsNQbRkAzJlEcvFBt1ALezgbD7DlQs0oWQcQ9LuQ'
        }
      });
      
      if (!readTestResponse.ok) {
        const errorText = await readTestResponse.text();
        console.error('DIRECT TEST: Cannot read from database:', errorText);
        return {
          success: false,
          error: `Read access error: ${errorText}`
        };
      }
      
      const existingRecipes = await readTestResponse.json();
      console.log('DIRECT TEST: Read access successful, found:', existingRecipes.length, 'recipes');
    } catch (error: any) {
      console.error('DIRECT TEST: Read test error:', error);
      return {
        success: false,
        error: `Read test error: ${error.message || JSON.stringify(error)}`
      };
    }
    
    // 1. Create a test recipe with proper UUID format
    // Generate a proper UUID v4 format
    const uuid = (() => {
      // This creates a proper UUID v4 format
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    })();
    
    const testRecipe = {
      // Use proper UUID format
      id: uuid,
      title: `Test Recipe ${new Date().toLocaleTimeString()}`,
      description: 'This is a test recipe',
      likes: 10,
      ingredients: ['Test ingredient 1', 'Test ingredient 2'],
      instructions: ['Step 1', 'Step 2'],
      created_at: new Date().toISOString()
    };
    
    // 2. Try to insert directly with raw fetch
    console.log('DIRECT TEST: Inserting test recipe...');
    const insertResponse = await fetch('https://ymbmwarbczwbnthhmhfu.supabase.co/rest/v1/recipes', {
      method: 'POST',
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltYm13YXJiY3p3Ym50aGhtaGZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxNTMwMjksImV4cCI6MjA2MzcyOTAyOX0.MaLlsNQbRkAzJlEcvFBt1ALezgbD7DlQs0oWQcQ9LuQ',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltYm13YXJiY3p3Ym50aGhtaGZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxNTMwMjksImV4cCI6MjA2MzcyOTAyOX0.MaLlsNQbRkAzJlEcvFBt1ALezgbD7DlQs0oWQcQ9LuQ',
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(testRecipe)
    });
    
    if (!insertResponse.ok) {
      const errorText = await insertResponse.text();
      console.error('DIRECT TEST: Insert failed with error:', errorText);
      
      // Try with different table name based on the error
      if (errorText.includes('does not exist')) {
        console.log('DIRECT TEST: Table might not exist, checking available tables...');
        
        // List tables
        const tablesResponse = await fetch('https://ymbmwarbczwbnthhmhfu.supabase.co/rest/v1/', {
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltYm13YXJiY3p3Ym50aGhtaGZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxNTMwMjksImV4cCI6MjA2MzcyOTAyOX0.MaLlsNQbRkAzJlEcvFBt1ALezgbD7DlQs0oWQcQ9LuQ',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltYm13YXJiY3p3Ym50aGhtaGZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxNTMwMjksImV4cCI6MjA2MzcyOTAyOX0.MaLlsNQbRkAzJlEcvFBt1ALezgbD7DlQs0oWQcQ9LuQ'
          }
        });
        
        if (tablesResponse.ok) {
          const tables = await tablesResponse.json();
          console.log('DIRECT TEST: Available tables:', tables);
        }
      }
      
      return {
        success: false,
        error: errorText
      };
    }
    
    const insertResult = await insertResponse.json();
    console.log('DIRECT TEST: Insert successful:', insertResult);
    
    // 3. Now try to fetch all recipes
    console.log('DIRECT TEST: Fetching all recipes...');
    const fetchResponse = await fetch('https://ymbmwarbczwbnthhmhfu.supabase.co/rest/v1/recipes?order=created_at.desc', {
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltYm13YXJiY3p3Ym50aGhtaGZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxNTMwMjksImV4cCI6MjA2MzcyOTAyOX0.MaLlsNQbRkAzJlEcvFBt1ALezgbD7DlQs0oWQcQ9LuQ',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltYm13YXJiY3p3Ym50aGhtaGZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxNTMwMjksImV4cCI6MjA2MzcyOTAyOX0.MaLlsNQbRkAzJlEcvFBt1ALezgbD7DlQs0oWQcQ9LuQ'
      }
    });
    
    if (!fetchResponse.ok) {
      const errorText = await fetchResponse.text();
      console.error('DIRECT TEST: Fetch failed with error:', errorText);
      
      return {
        success: false,
        error: errorText
      };
    }
    
    const fetchResult = await fetchResponse.json();
    console.log('DIRECT TEST: Fetch successful, found', fetchResult.length, 'recipes');
    
    return {
      success: true,
      insertResult,
      fetchResult
    };
    
  } catch (error: any) {
    console.error('DIRECT TEST: Error in direct test:', error);
    return {
      success: false,
      error: error.message || JSON.stringify(error)
    };
  }
};
