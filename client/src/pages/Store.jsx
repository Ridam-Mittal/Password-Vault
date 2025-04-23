import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';

function Store() {

  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const { user } = useAuth();
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (!isLoggedIn) {
      toast.error("Please login first.");
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);
  const [sitename, setSitename] = useState('');
  const [siteusername, setSiteusername] = useState('');
  const [sitepassword, setSitepassword] = useState('');
  const [note, setNote] = useState('');



  const [showPassword, setShowpassword] = useState(false);

  const storeinfo = async (e) => {
    e.preventDefault();

    const newEntry = {
      sitename,
      siteusername,
      sitepassword,
      note,
    };

    try {
      const response = await axios.post(`${backendURL}/addpassword`, newEntry, {
        withCredentials: true
      });
      toast.success(response.data);
      console.log(response.data);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data || "Something went wrong.");
    }
    
    setSitename('');
    setSiteusername('');
    setSitepassword('');
    setNote('');
  };

  return (
    <>
    <Toaster/>
    <div className="bg-amber-200 flex items-center justify-center px-4"
      style={{
        overflow: 'hidden',
      }}>
      <form
        onSubmit={storeinfo}
        className="w-1/3 bg-blue-200 p-4 mb-6.5 mt-6.5  rounded-xl shadow-xl space-y-4 border border-gray-300"
      >
        <h2 className="text-xl font-semibold text-center">Hello {user?.username || 'User'},</h2>
        <h2 className="text-2xl font-bold text-center mb-4">ADD PASSWORD</h2>

        <div>
          <label htmlFor="site_name" className="block mb-1 font-semibold">
            Website Name:
          </label>
          <input
            type="text"
            id="site_name"
            name="site_name"
            value={sitename}
            onChange={(e) => setSitename(e.target.value)}
            className="w-full p-2 rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. Facebook"
            required
          />
        </div>

        <div>
          <label htmlFor="site_username" className="block mb-1 font-semibold">
            Website Username:
          </label>
          <input
            type="text"
            id="site_username"
            name="site_username"
            value={siteusername}
            onChange={(e) => setSiteusername(e.target.value)}
            className="w-full p-2 rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. joehenry"
            required
          />
        </div>

        <div className='relative'>
          <label htmlFor="site_password" className="block mb-1 font-semibold">
            Website Password:
          </label>
          <input
            type={showPassword ? "text" : "password"}
            id="site_password"
            name="site_password"
            value={sitepassword}
            onChange={(e) => setSitepassword(e.target.value)}
            className="w-full p-2 rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. password123"
            required
          />
          <button
            type="button"
            onClick={() => setShowpassword(!showPassword)}
            className="absolute right-2 top-7/10 transform -translate-y-1/2 text-black"
          >
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </button>
        </div>
        <div>
          <label htmlFor="note" className="block mb-1 font-semibold">
            Note (optional):
          </label>
          <textarea
            id="note"
            name="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows="4"
            className="w-full p-2 rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. Why did I create this account?"
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 transition-colors duration-200 text-white font-bold py-2 rounded"
        >
          Save Info
        </button>
      </form>
    </div>
    </>
  );
}

export default Store;