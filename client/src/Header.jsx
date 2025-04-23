import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

function Header() {
  const navigate = useNavigate();
  const { isLoggedIn, user, logout } = useAuth(); // ✅ use logout from context

  const handleLogout = async () => {
    await logout();        
    toast.success('Logged out successfully');       // ✅ call context logout function
    navigate('/login');           // ✅ then navigate
  };

  return (
    <header className="bg-gray-900 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
        <h1 className="text-2xl font-semibold tracking-wide uppercase">
          🔐 Password Vault
        </h1>

        <nav className="flex items-center gap-10 text-sm md:text-base">
          {isLoggedIn ? (
            <>
              <Link
                to="/view-passwords"
                className="hover:text-purple-400 transition duration-300 ease-in-out transform hover:scale-105"
              >
                Vault
              </Link>
              <Link
                to="/add-password"
                className="hover:text-purple-400 transition duration-300 ease-in-out transform hover:scale-105"
              >
                Store New
              </Link>
              <span className="text-green-300">
                👋 {user?.username || user?.email || 'User'}
              </span>
              <button
                onClick={handleLogout}
                className="text-white bg-red-500 hover:bg-red-600 transition duration-300 ease-in-out transform hover:scale-105 font-bold px-3 rounded-sm border border-white py-1 text-center"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/register"
                className="hover:text-green-400 transition duration-300 ease-in-out transform hover:scale-105"
              >
                Register
              </Link>
              <Link
                to="/login"
                className="hover:text-blue-400 transition duration-300 ease-in-out transform hover:scale-105"
              >
                Login
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
