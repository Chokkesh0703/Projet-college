import React, { useEffect, useState } from 'react'
import Logo from '../../assets/logo.png'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa'
import PersonIcon from '@mui/icons-material/Person';

const InHeader = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-800 focus:outline-none"
          >
            {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
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
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-yellow-400 p-4 shadow-md">
          <div className="flex flex-col gap-4">
            <button
              onClick={() => {
                navigate("/ProfileView");
                setMobileMenuOpen(false);
              }}
              className="w-full px-4 py-2 rounded-full bg-white hover:bg-gray-100 transition-colors text-left"
            >
              {profile.username}
            </button>
            <button
              onClick={() => {
                setShowLogoutConfirm(true);
                setMobileMenuOpen(false);
              }}
              className="w-full px-4 py-2 rounded-full flex items-center gap-2 bg-white hover:bg-gray-100 transition-colors"
            >
              <FaSignOutAlt className="text-xl" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}

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
                onClick={() => navigate("/")}
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

// import React, { useEffect, useState } from 'react'

// import Logo from '../../assets/logo.png'
// import { useNavigate } from 'react-router-dom'
// import axios from 'axios'
// import { FaSignOutAlt } from 'react-icons/fa'

// const InHeader = () => {

//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();
//   const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

//   // useEffect(() => {
//   //   const fetchProfile = async () => {
//   //     try {
//   //       const token = localStorage.getItem('userToken');
//   //       const res = await axios.get('http://localhost:8000/api/me/profile', {
//   //         headers: {
//   //           'x-auth-token': token
//   //         }
//   //       });
//   //       setProfile(res.data);
//   //     } catch (err) {
//   //       console.error('Error fetching profile:', err);
//   //       setError('Failed to load profile. Please try again later.');
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   };

//   //   fetchProfile();
//   // }, []);
//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const token = sessionStorage.getItem('userToken'); // Changed to sessionStorage
//         const res = await axios.get('http://localhost:8000/api/me/profile', {
//           headers: {
//             'x-auth-token': token,
//             Authorization: `Bearer ${sessionStorage.getItem("token")}`,
//           }
//         });
//         setProfile(res.data);
//       } catch (err) {
//         console.error('Error fetching profile:', err);
//         setError('Failed to load profile. Please try again later.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading your profile...</p>
//         </div>
//       </div>
//     );
//   }
//   if (!profile) {
//     return (
//       <div className="text-center py-10">
//         <p className="mb-4">You haven&apos;t created a profile yet.</p>
//         <button
//           onClick={() => navigate("/ProfileFrom")}
//           className="p-3 rounded-full mr-3 bg-white"
//         >
//           Create Your Profile
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className='flex justify-between items-center bg-yellow-400 p-4 relative w-full top-0 z-50 shadow-md
//        '>
//       <div className="">
//         <img className='h-20' src={Logo} alt="" />
//       </div>
//       <div className="flex gap-4 justify-center items-center">
//         <div className="">
//           <button
//             onClick={() => navigate("/ProfileView")}
//             className="p-3 rounded-full mr-3 bg-white"
//           >
//             {profile.username}
//           </button>
//         </div>
//         <div className="flex justify-center items-center gap-4">
//           <div className="">
//             <button
//               onClick={() => setShowLogoutConfirm(true)}
//               className="p-3 rounded-full flex justify-center items-center gap-2"
//               style={{
//                 backgroundColor: "#ffffff",
//               }}
//             >
//               <FaSignOutAlt className="text-xl" />
//               <p>Logout</p>
//             </button>
//           </div>
//         </div>
//         {/* Confirmation Dialog */}
//         {showLogoutConfirm && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className=" items-center bg-white p-6 rounded-lg max-w-md">
//               <h3 className="text-xl font-bold mb-4">Confirm Logout</h3>
//               <p className="mb-6">Are you sure you want to logout?</p>
//               <div className="flex justify-end gap-3">
//                 <button
//                   onClick={() => setShowLogoutConfirm(false)}
//                   className="px-4 py-2 border border-gray-300 rounded"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={() => navigate("/")}
//                   className="px-4 py-2 bg-[#ffc13b] rounded"
//                 >
//                   Yes, Logout
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// export default InHeader
