import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';  // Don't forget to import axios
import { useAuth } from '../AuthContext.jsx';  // Import useAuth hook

function Login() {
  const navigate = useNavigate();
  const { setIsLoggedIn, setUser } = useAuth(); // Use context to update auth state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Loading state for button
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true while the login request is being made
    try {
      const response = await axios.post(`${backendURL}/login`, {
        email,
        password
      }, {
        withCredentials: true
      });

      toast.success('Login successful!');
      // Update AuthContext after login
      setIsLoggedIn(true);
      setUser(response.data.user); // Assuming response contains user data
      navigate('/view-passwords');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data || "Something went wrong.");
    } finally {
      setLoading(false); // Reset loading state after the request completes
    }

    setEmail('');
    setPassword('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-200 px-4">
      <Toaster />
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">LOGIN</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Sign Up
            </button>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              disabled={loading} // Disable the button if loading is true
            >
              {loading ? 'Logging in...' : 'Log In'} {/* Show loading text */}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
