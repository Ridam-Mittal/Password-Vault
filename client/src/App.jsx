import { Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Show from './pages/Show.jsx';
import Store from './pages/Store';
import Layout from './Layout';
import { useAuth } from './AuthContext.jsx';
import './app.css';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function App() {
  const { isLoggedIn, loading, setLoading } = useAuth();  // Added loading state from useAuth()

 
  return (
    <Routes>
      {/* Protected Routes with Layout */}
      <Route element={<Layout />}>
        <Route path="/" element={isLoggedIn ? <Navigate to="/view-passwords" /> : <Navigate to="/login" />} />
        <Route path="/add-password" element={isLoggedIn ? <Store /> : <Navigate to="/login" />} />
        <Route path="/view-passwords" element={isLoggedIn ? <Show /> : <Navigate to="/login" />} />
      </Route>

      {/* Auth Routes without layout */}
      <Route path="/login" element={isLoggedIn ? <Navigate to="/view-passwords" /> : <Login />} />
      <Route path="/register" element={isLoggedIn ? <Navigate to="/view-passwords" /> : <Register />} />
    </Routes>
  );
}

export default App;
