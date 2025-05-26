import React, { useState } from 'react';
import { insertTestRecipe, fetchAllRecipes } from '../services/direct-db-test';
import Button from '../components/ui/Button';

const DbTest: React.FC = () => {
  const [testResult, setTestResult] = useState<any>(null);
  const [fetchResult, setFetchResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const runInsertTest = async () => {
    setIsLoading(true);
    try {
      const result = await insertTestRecipe();
      setTestResult(result);
    } catch (error) {
      setTestResult({ success: false, error });
    } finally {
      setIsLoading(false);
    }
  };

  const runFetchTest = async () => {
    setIsLoading(true);
    try {
      const result = await fetchAllRecipes();
      setFetchResult(result);
    } catch (error) {
      setFetchResult({ success: false, error });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 mt-16 mb-20">
      <h1 className="text-3xl font-bold mb-6">Database Test Page</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Test Recipe Insertion</h2>
        <Button onClick={runInsertTest} disabled={isLoading}>
          {isLoading ? 'Adding Test Recipe...' : 'Add Test Recipe to Database'}
        </Button>
        
        {testResult && (
          <div className="mt-4 p-4 rounded bg-amber-100">
            <h3 className="font-bold mb-2">
              {testResult.success ? '✅ Success!' : '❌ Failed!'}
            </h3>
            <pre className="overflow-auto max-h-60 p-2 bg-white rounded">
              {JSON.stringify(testResult, null, 2)}
            </pre>
          </div>
        )}
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Test Recipe Fetching</h2>
        <Button onClick={runFetchTest} disabled={isLoading}>
          {isLoading ? 'Fetching Recipes...' : 'Fetch All Recipes from Database'}
        </Button>
        
        {fetchResult && (
          <div className="mt-4 p-4 rounded bg-amber-100">
            <h3 className="font-bold mb-2">
              {fetchResult.success ? `✅ Success! Found ${fetchResult.recipes?.length || 0} recipes` : '❌ Failed!'}
            </h3>
            <pre className="overflow-auto max-h-60 p-2 bg-white rounded">
              {JSON.stringify(fetchResult, null, 2)}
            </pre>
          </div>
        )}
      </div>
      
      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h3 className="font-bold mb-2">Troubleshooting Tips:</h3>
        <ul className="list-disc pl-5">
          <li>Make sure your Supabase table is created with the correct schema</li>
          <li>Check that all security policies are correctly set up</li>
          <li>Verify API keys are correct and have the right permissions</li>
          <li>Look for CORS errors in the browser console</li>
        </ul>
      </div>
    </div>
  );
};

export default DbTest;
