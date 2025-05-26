import React, { useEffect, useState } from 'react'

import Logo from '../../assets/logo.png'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const InHeader = () => {

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('userToken');
        const res = await axios.get('http://localhost:8000/api/me/profile', {
          headers: {
            'x-auth-token': token
          }
        });
        setProfile(res.data);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }
  if (!profile) {
    return (
      <div className="text-center py-10">
        <p className="mb-4">You haven&apos;t created a profile yet.</p>
        <button
          onClick={() => navigate("/ProfileFrom")}
          className="p-3 rounded-full mr-3 bg-white"
        >
          Create Your Profile
        </button>
      </div>
    );
  }

  return (
    <div className='flex justify-between items-center bg-yellow-400 p-4 relative w-full top-0 z-50 shadow-md
       '>
      <div className="">
        <img className='h-20' src={Logo} alt="" />
      </div>
      <div className="">
        <button
          onClick={() => navigate("/ProfileView")}
          className="p-3 rounded-full mr-3 bg-white"
        >
          {profile.username}
        </button>
      </div>
    </div>
  )
}

export default InHeader
