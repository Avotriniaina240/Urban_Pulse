import React, { useState, useEffect } from 'react';
import { 
  Home,
  MessageSquare,
  Bell,
} from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import AuthService from '../../../services/authService';

const Navbar = ({ onSearchChange }) => {
  const [notifications, setNotifications] = useState([]);
  const [userRole, setUserRole] = useState('');
  const [userAvatar, setUserAvatar] = useState('');
  const [userName, setUserName] = useState('');

  const loadAndDisplayNotifications = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_NOTIFICATIONS_API_URL);
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error('Failed to load notifications', error);
    }
  };

  const loadUserAvatar = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token missing');
        return;
      }

      const decodedToken = jwtDecode(token);
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/users/${decodedToken.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUserAvatar(response.data.profilePictureUrl || '/image/profil-defaut.jpg');
      setUserName(response.data.username || '');
    } catch (error) {
      console.error('Failed to load user avatar', error);
      setUserAvatar('/image/profil-defaut.jpg');
    }
  };

  const handleNotification = () => {
    loadAndDisplayNotifications();
  };

  const fetchUserRole = async () => {
    try {
      const user = await AuthService.getCurrentUser();
      if (user && user.role) {
        setUserRole(user.role);
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
    }
  };

  useEffect(() => {
    fetchUserRole();
    loadUserAvatar();
  }, []);

  const NavLink = ({ href, icon: Icon, label }) => {
    return (
      <a href={href} className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-lime-600 transition-colors rounded-lg">
        <Icon className="w-5 h-5" />
        <span className="hidden md:block">{label}</span>
      </a>
    );
  };

  const AvatarLink = ({ href }) => {
    // Get first letter of username for fallback
    const initial = userName ? userName[0].toUpperCase() : '?';
    
    return (
      <a 
        href={href} 
        className="relative flex items-center justify-center"
      >
        <div className="relative group">
          {/* Outer circle with gradient border */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-lime-500 to-cyan-500 p-0.5">
            {/* Inner circle with image */}
            <div className="w-full h-full rounded-full overflow-hidden bg-white">
              {userAvatar ? (
                <img 
                  src={userAvatar} 
                  alt="Profile" 
                  className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-600 font-semibold">
                  {initial}
                </div>
              )}
            </div>
          </div>
          
          {/* Active status indicator */}
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
        </div>
        
        {/* Username tooltip on hover */}
        <div className="hidden group-hover:block absolute top-full mt-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap">
          {userName || 'Profile'}
        </div>
      </a>
    );
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold bg-gradient-to-r from-lime-500 to-cyan-500 bg-clip-text text-transparent">
              Urban Pulse
            </span>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <NavLink 
              href="vue-ensemble"
              icon={Home} 
              label="Dashboard" 
            />
            <NavLink 
              href="forum-page" 
              icon={MessageSquare} 
              label="Forum" 
            />

            {/* Notification Icon */}
            <div className="relative">
              <Bell 
                className="w-6 h-6 text-gray-600 hover:text-lime-600 transition-colors cursor-pointer"
                onClick={handleNotification}
              />
            </div>

            {/* Profile Avatar */}
            <AvatarLink href="profile" />
          </div>
        </div>
      </div>
      <ToastContainer />
    </nav>
  );
};

export default Navbar;