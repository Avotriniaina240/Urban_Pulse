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
      <a href={href} className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:text-lime-600 hover:bg-gradient-to-r hover:from-lime-50 hover:to-cyan-50 transition-all duration-300 rounded-xl font-medium">
        <Icon className="w-5 h-5" />
        <span className="hidden md:block">{label}</span>
      </a>
    );
  };

  const AvatarLink = ({ href }) => {
    const initial = userName ? userName[0].toUpperCase() : '?';
    
    return (
      <a 
        href={href} 
        className="relative flex items-center justify-center group"
      >
        <div className="relative">
          {/* Outer circle with enhanced gradient border */}
          <div className="w-11 h-11 rounded-full bg-gradient-to-r from-lime-400 via-cyan-500 to-blue-500 p-0.5 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
            {/* Inner circle with image */}
            <div className="w-full h-full rounded-full overflow-hidden bg-white">
              {userAvatar ? (
                <img 
                  src={userAvatar} 
                  alt="Profile" 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 text-gray-600 font-semibold text-sm">
                  {initial}
                </div>
              )}
            </div>
          </div>
          
          {/* Enhanced active status indicator */}
          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full shadow-sm animate-pulse"></div>
        </div>
        
        {/* Enhanced username tooltip */}
        <div className="opacity-0 group-hover:opacity-100 absolute top-full mt-3 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap transition-opacity duration-200 shadow-lg">
          {userName || 'Profile'}
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
        </div>
      </a>
    );
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-gray-200 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Enhanced Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-lime-500 to-cyan-500 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">UP</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-lime-600 to-cyan-600 bg-clip-text text-transparent">
              Urban Pulse
            </span>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-2">
            <NavLink 
              href="admin-dashboard"
              icon={Home} 
              label="Dashboard" 
            />
            <NavLink 
              href="forum-page" 
              icon={MessageSquare} 
              label="Forum" 
            />

            {/* Enhanced Notification Icon */}
            <div className="relative p-2">
              <Bell 
                className="w-6 h-6 text-gray-600 hover:text-lime-600 transition-all duration-300 cursor-pointer hover:scale-110"
                onClick={handleNotification}
              />
              {/* Notification badge */}
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></div>
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