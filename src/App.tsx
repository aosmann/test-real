import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import StudioPage from './pages/StudioPage';
import PropertyPage from './pages/PropertyPage';
import BuyPage from './pages/BuyPage';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/studio" element={<StudioPage />} />
        <Route path="/property/:id" element={<PropertyPage />} />
        <Route path="/buy" element={<BuyPage />} />
      </Routes>
    </div>
  );
}

export default App;