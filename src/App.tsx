import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import StudioPage from './pages/StudioPage';
import PropertyPage from './pages/PropertyPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/studio" element={<StudioPage />} />
      <Route path="/property/:id" element={<PropertyPage />} />
    </Routes>
  );
}

export default App;