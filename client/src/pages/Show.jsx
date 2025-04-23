// 
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';

function Show() {
  const [passwords, setPasswords] = useState([]);
  const [decryptedPasswords, setDecryptedPasswords] = useState({});
  const [visiblePasswords, setVisiblePasswords] = useState({});  // Track visibility of passwords
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      toast.error("Please login first.");
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    const getPasswords = async () => {
      try {
        const response = await axios.get(`${backendURL}/showpasswords`, {
          withCredentials: true
        });
        setPasswords(response.data.data);
      } catch (error) {
        console.error("Error fetching passwords:", error);
      }
    };
    
    getPasswords();
  }, []);


  const deletePassword = async (id) => {
    try {
      await axios.delete(`${backendURL}/deletepassword/${id}`, {
        withCredentials: true
      });
      // Optional: remove it from local state
      setPasswords(prev => prev.filter(p => p.id !== id));
      toast.success("Password deleted successfully.");
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete password.");
    }
  };

  const decryptPassword = async ({ password, iv, id }) => {
    // If password is already decrypted, just toggle visibility
    if (decryptedPasswords[id]) {
      setVisiblePasswords(prev => ({
        ...prev,
        [id]: !prev[id]
      }));
      return;
    }
  
    try {
      const response = await axios.post(`${backendURL}/decryptpassword`, {
        password,
        iv
      },{
        withCredentials: true
      });
      setDecryptedPasswords(prev => ({ ...prev, [id]: response.data }));
      setVisiblePasswords(prev => ({ ...prev, [id]: true }));
    } catch (error) {
      console.error("Error decrypting password:", error);
    }
  };

  return (
    <>
    <Toaster/>
    <div className='w-full bg-amber-200 overflow-auto px-16'>
      {passwords.length > 0 ?
      <div className='mt-6 min-h-auto flex gap-0.5 flex-col'>
        {passwords.map((item, idx) => (
          <div
            key={idx}
            className='flex justify-between items-center px-5 py-3 font-bold text-xl bg-white my-2 rounded shadow cursor-pointer hover:bg-gray-100 transition'
            onClick={() => decryptPassword({
              password: item.site_password,
              iv: item.iv,
              id: item.id
            })}
          >
            <span>{item.site_name}</span>
            <span className="text-sm text-gray-500">
              {decryptedPasswords[item.id] && visiblePasswords[item.id]
                ? `🔓 ${decryptedPasswords[item.id]}`
                : '🔐 Click to decrypt'}
            </span>
            <button
            onClick={()=> deletePassword(item.id)}
            className="text-white bg-red-500 hover:bg-red-600 transition duration-300 ease-in-out transform hover:scale-105 font-bold px-3 rounded-sm border border-white flex items-center justify-center text-sm">X</button>
          </div>
        ))}
      </div>: <div className='font-bold text-2xl mt-8'> No Passwords Available... </div>}
    </div>
    </>
  );
}

export default Show;
