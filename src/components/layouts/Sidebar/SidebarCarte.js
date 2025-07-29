import React, { useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, BarChart3, FileText, Scale, TrendingUp, Map,
  ChevronDown, Users, Settings, ChevronLeft, ChevronRight } from 'lucide-react';

const SidebarCarte = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showComplaintMenu, setShowComplaintMenu] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const userMenuRef = useRef(null);
  const complaintMenuRef = useRef(null);

  const handleLogout = () => {
    try {
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');
      navigate('/login');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const isActive = (path) => location.pathname === path;

  const MenuItem = ({ to, icon: Icon, label, onClick, className = "" }) => (
    <Link
      to={to}
      onClick={onClick}
      className={`
        group flex items-center gap-5 px-2 py-2 rounded-lg transition-all duration-300 ease-out
        transform hover:translate-x-1 hover:scale-[1.02]
        ${isActive(to)
          ? "bg-gradient-to-r from-[#9fdc23]/20 to-[#00b8e4]/20 text-[#9fdc23] animate-pulse"
          : "text-gray-600 hover:bg-gray-50 hover:text-[#00b8e4] hover:shadow-md"
        } ${className}
      `}
    >
      <Icon className="w-5 h-5 flex-shrink-0 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110" />
      <span className={`text-sm font-medium transition-all duration-300 ${sidebarCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
        {label}
      </span>
    </Link>
  );

  const SubmenuItem = ({ to, label }) => (
    <Link
      to={to}
      className={`
        group flex items-center px-3 py-2 text-sm rounded-lg transition-all duration-300 ease-out
        transform hover:translate-x-2 hover:scale-[1.01]
        ${isActive(to)
          ? "text-[#00b8e4] bg-[#00b8e4]/10 shadow-sm animate-pulse"
          : "text-gray-600 hover:bg-gray-50 hover:text-[#9fdc23] hover:shadow-sm"
        } ${sidebarCollapsed ? 'opacity-0 max-h-0 overflow-hidden' : 'opacity-100 max-h-10 ml-6'}
      `}
    >
      <span className="transition-all duration-300 group-hover:font-medium">
        {label}
      </span>
    </Link>
  );

  const renderComplaintMenu = () => (
    <div ref={complaintMenuRef} className="relative">
      <div
        onClick={() => setShowComplaintMenu(!showComplaintMenu)}
        className={`
          group flex items-center justify-between w-full px-3 py-2 text-gray-600 rounded-lg 
          transition-all duration-300 ease-out cursor-pointer
          transform hover:translate-x-1 hover:scale-[1.02]
          ${isActive('/reports') || isActive('/reports-liste') || isActive('/manage-reports') || isActive('/analyze-reports')
            ? "bg-gradient-to-r from-[#9fdc23]/20 to-[#00b8e4]/20 text-[#9fdc23] animate-pulse"
            : "hover:bg-gray-50 hover:text-[#00b8e4] hover:shadow-md"
          }
        `}
      >
        <div className="flex items-center gap-5">
          <FileText className="w-5 h-5 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110" />
          <span className={`text-sm font-medium transition-all duration-300 ${sidebarCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
            Rapports
          </span>
        </div>
        {!sidebarCollapsed && (
          <ChevronDown className={`
            w-4 h-4 transition-all duration-300 ease-out
            ${showComplaintMenu ? 'rotate-180 scale-110' : 'group-hover:rotate-12'}
          `} />
        )}
      </div>
      <div className={`
        overflow-hidden transition-all duration-500 ease-in-out
        ${showComplaintMenu && !sidebarCollapsed ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
      `}>
        <div className="mt-1 space-y-1 transform transition-all duration-300 ease-out">
          <SubmenuItem to="/reports" label="Déposer une plainte" />
          <SubmenuItem to="/reports-liste" label="Liste des plaintes" />
          <SubmenuItem to="/manage-reports" label="Gérer les plaintes" />
          <SubmenuItem to="/analyze-reports" label="Analyser les plaintes" />
        </div>
      </div>
    </div>
  );

  const renderUserMenu = () => (
    <div ref={userMenuRef} className="relative">
      <div
        onClick={() => setShowUserMenu(!showUserMenu)}
        className={`
          group flex items-center justify-between w-full px-3 py-2 text-gray-600 rounded-lg 
          transition-all duration-300 ease-out cursor-pointer
          transform hover:translate-x-1 hover:scale-[1.02]
          ${isActive('/gestion-user') || isActive('/register-admin')
            ? "bg-gradient-to-r from-[#9fdc23]/20 to-[#00b8e4]/20 text-[#9fdc23] animate-pulse"
            : "hover:bg-gray-50 hover:text-[#00b8e4] hover:shadow-md"
          }
        `}
      >
        <div className="flex items-center gap-5">
          <Users className="w-5 h-5 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110" />
          <span className={`text-sm font-medium transition-all duration-300 ${sidebarCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
            Utilisateurs
          </span>
        </div>
        {!sidebarCollapsed && (
          <ChevronDown className={`
            w-4 h-4 transition-all duration-300 ease-out
            ${showUserMenu ? 'rotate-180 scale-110' : 'group-hover:rotate-12'}
          `} />
        )}
      </div>
      <div className={`
        overflow-hidden transition-all duration-500 ease-in-out
        ${showUserMenu && !sidebarCollapsed ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
      `}>
        <div className="mt-1 space-y-1 transform transition-all duration-300 ease-out">
          <SubmenuItem to="/register-admin" label="Ajouter un utilisateur" />
          <SubmenuItem to="/gestion-user" label="Gérer les utilisateurs" />
        </div>
      </div>
    </div>
  );

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <aside 
      className={`
        fixed top-0 left-0 h-full bg-white border-r border-gray-200 pt-16
        transition-all duration-300 ease-in-out
        ${sidebarCollapsed ? 'w-16' : 'w-64'}
        hover:shadow-lg
      `}
    >
      <div className="flex flex-col h-full overflow-y-auto">
        <nav className="flex-1 p-4 space-y-4">
          <div
            onClick={toggleSidebar}
            className="
              cursor-pointer transition-all ease-out p-2 rounded-full hover:bg-gray-100
            "
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-5 h-5 transition-all duration-300 group-hover:translate-x-1" />
            ) : (
              <ChevronLeft className="w-5 h-5 transition-all duration-300 group-hover:-translate-x-1" />
            )}
          </div>

          <MenuItem to="/vue-ensemble" icon={LayoutDashboard} label="Vue d'ensemble" />
          <MenuItem to="/urban-analysis" icon={BarChart3} label="Analyse urbaine" />
          {renderComplaintMenu()}
          <MenuItem to="/comparison" icon={Scale} label="Comparaison" />
          <MenuItem to="/historique-prediction" icon={TrendingUp} label="Données historiques" />
          <MenuItem to="/map" icon={Map} label="Cartographie" />
          {renderUserMenu()}
        </nav>
      </div>
    </aside>
  );
};

export default SidebarCarte;