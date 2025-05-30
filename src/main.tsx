import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';

// Optional: Add a loading fallback (remove if not needed)
const Loading = () => <div className="text-center p-10 text-lg">Loading...</div>;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      {/* Only use Suspense if you're using React.lazy for lazy-loaded components */}
      <App />
    </BrowserRouter>
  </StrictMode>
);
