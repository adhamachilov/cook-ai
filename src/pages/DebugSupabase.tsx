import React, { useState } from 'react';
import Button from '../components/ui/Button';
import { testSupabaseConnection } from '../services/test-supabase';
import { storeRecipe } from '../services/supabase';

const DebugSupabase: React.FC = () => {
  const [testResult, setTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const runConnectionTest = async () => {
    setIsLoading(true);
    setTestResult('Testing Supabase connection...');
    
    try {
      const success = await testSupabaseConnection();
      if (success) {
        setTestResult('✅ Supabase connection successful! Check the console for details.');
      } else {
        setTestResult('❌ Supabase connection failed. Check the console for error details.');
      }
    } catch (error) {
      console.error('Error in test:', error);
      setTestResult(`❌ Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const createTestRecipe = async () => {
    setIsLoading(true);
    setTestResult('Creating test recipe...');
    
    try {
      // Create a simple test recipe
      const testRecipe = {
        id: `test-${Date.now()}`,
        title: `Test Recipe ${new Date().toLocaleTimeString()}`,
        ingredients: ['Test ingredient 1', 'Test ingredient 2'],
        instructions: ['Step 1: Test', 'Step 2: Test more'],
        likes: 999 // Very high likes to ensure it appears at the top
      };
      
      const result = await storeRecipe(testRecipe);
      
      if (result) {
        setTestResult(`✅ Test recipe created successfully with ID: ${result.id}`);
        console.log('Created recipe:', result);
      } else {
        setTestResult('❌ Failed to create test recipe. Check console for details.');
      }
    } catch (error) {
      console.error('Error creating test recipe:', error);
      setTestResult(`❌ Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-6">Supabase Debug Tools</h1>
      
      <div className="space-y-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Test Supabase Connection</h2>
          <p className="mb-4 text-gray-700">
            This will test if we can connect to your Supabase database and check if the recipes table exists.
          </p>
          <Button 
            onClick={runConnectionTest} 
            disabled={isLoading}
          >
            {isLoading ? 'Testing...' : 'Run Connection Test'}
          </Button>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Create Test Recipe</h2>
          <p className="mb-4 text-gray-700">
            This will create a test recipe with 999 likes to check if it appears on the Popular page.
          </p>
          <Button 
            onClick={createTestRecipe} 
            disabled={isLoading}
          >
            {isLoading ? 'Creating...' : 'Create Test Recipe'}
          </Button>
        </div>
        
        {testResult && (
          <div className={`p-4 rounded-lg ${testResult.includes('✅') ? 'bg-green-100' : 'bg-red-100'}`}>
            <p className="font-medium">{testResult}</p>
          </div>
        )}
        
        <div className="bg-amber-100 rounded-lg p-4">
          <h3 className="font-semibold mb-2">Important</h3>
          <p>Make sure you've executed the SQL setup script in your Supabase project to create the recipes table:</p>
          <ol className="list-decimal ml-5 mt-2 space-y-1">
            <li>Go to your Supabase dashboard</li>
            <li>Open the SQL Editor</li>
            <li>Run the SQL from the setup-database.sql file</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default DebugSupabase;
