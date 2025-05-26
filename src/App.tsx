/* App component for routing */
import { Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/layout/Layout';
import About from './pages/About';
import Home from './pages/Home';
import Popular from './pages/Popular';
import Contact from './pages/Contact';
import Search from './pages/Search';
import Favorites from './pages/Favorites';
import RecipeDetails from './pages/RecipeDetails';
import DebugSupabase from './pages/DebugSupabase';
import TestRecipe from './pages/TestRecipe';
import DiagnosePage from './pages/Diagnose';
import AllRecipes from './pages/AllRecipes';
import DuplicateRemover from './pages/DuplicateRemover';
import { AnimatePresence } from 'framer-motion';

function App() {
  const location = useLocation();
  
  return (
    <>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="search" element={<Search />} />
            <Route path="popular" element={<Popular />} />
            <Route path="favorites" element={<Favorites />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="recipe/:recipeId" element={<RecipeDetails />} />
            <Route path="debug" element={<DebugSupabase />} />
            <Route path="test" element={<TestRecipe />} />
            <Route path="diagnose" element={<DiagnosePage />} />
            <Route path="all" element={<AllRecipes />} />
            <Route path="remove-duplicates" element={<DuplicateRemover />} />
          </Route>
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default App;