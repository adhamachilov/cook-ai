/* App component for routing */
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Search from './pages/Search';
import Popular from './pages/Popular';
import Favorites from './pages/Favorites';
import About from './pages/About';
import Contact from './pages/Contact';
import RecipeDetails from './pages/RecipeDetails';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/popular" element={<Popular />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/recipe/:id" element={<RecipeDetails />} />
      </Routes>
    </Layout>
  );
}

export default App;