import React, { useEffect, useState } from 'react'
import Logo from '../../assets/logo.png'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa'
import PersonIcon from '@mui/icons-material/Person';
import { Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText } from '@mui/material'
import { LogOut, User } from 'lucide-react'

const InHeader = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = sessionStorage.getItem('userToken');
        const res = await axios.get('http://localhost:8000/api/me/profile', {
          headers: {
            'x-auth-token': token,
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
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

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 mb-4">{error}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-10">
        <p className="mb-4">You haven&apos;t created a profile yet.</p>
        <button
          onClick={() => navigate("/ProfileFrom")}
          className="p-3 rounded-full mr-3 bg-white hover:bg-gray-100 transition-colors"
        >
          Create Your Profile
        </button>
      </div>
    );
  }

  return (
    <>
      <div className='flex justify-between items-center bg-yellow-400 p-4 relative w-full top-0 z-50 shadow-md'>
        {/* Logo */}
        <div className="flex items-center">
          <img className='h-16 md:h-20' src={Logo} alt="Logo" />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-4 items-center">
          <button
            onClick={() => navigate("/ProfileView")}
            className="p-3 rounded-full bg-white hover:bg-gray-100 transition-colors whitespace-nowrap"
          >
            <PersonIcon />
            {profile.username}
          </button>
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="p-3 rounded-full flex items-center gap-2 bg-white hover:bg-gray-100 transition-colors"
          >
            <FaSignOutAlt className="text-xl" />
            <span className="hidden lg:inline">Logout</span>
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <IconButton
            edge="end"
            color="default"
            aria-label="menu"
            onClick={toggleSidebar}
          >
            {isSidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </IconButton>
        </div>
      </div>

      {/* Mobile Sidebar Drawer */}
      <Drawer
        anchor="right"
        open={isSidebarOpen}
        onClose={toggleSidebar}
        sx={{ '& .MuiDrawer-paper': { width: 250 } }}
      >
        <List>
          <ListItem
            button
            onClick={() => {
              navigate("/ProfileView");
              toggleSidebar();
            }}
          >
            <ListItemIcon>
              <User />
            </ListItemIcon>
            <ListItemText primary={profile.username} />
          </ListItem>
          <ListItem
            button
            onClick={() => {
              setShowLogoutConfirm(true);
              toggleSidebar();
            }}
          >
            <ListItemIcon>
              <LogOut />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>

      {/* Confirmation Dialog */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-11/12 sm:w-auto">
            <h3 className="text-xl font-bold mb-4">Confirm Logout</h3>
            <p className="mb-6">Are you sure you want to logout?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  sessionStorage.removeItem('userToken');
                  sessionStorage.removeItem('token');
                  navigate("/");
                }}
                className="px-4 py-2 bg-[#ffc13b] rounded hover:bg-[#e6ac35] transition-colors"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default InHeader;