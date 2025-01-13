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
      className={`flex items-center gap-5 px-3 py-2 rounded-lg transition-colors ${
        isActive(to)
          ? "bg-gradient-to-r from-[#9fdc23]/20 to-[#00b8e4]/20 text-[#9fdc23]"
          : "text-gray-600 hover:bg-gray-50 hover:text-[#00b8e4]"
      } ${className}`}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <span className={`text-sm font-medium ${sidebarCollapsed ? 'hidden' : 'block'}`}>{label}</span>
    </Link>
  );

  const SubmenuItem = ({ to, label }) => (
    <Link
      to={to}
      className={`flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
        isActive(to)
          ? "text-[#00b8e4] bg-[#00b8e4]/10"
          : "text-gray-600 hover:bg-gray-50 hover:text-[#9fdc23]"
      } ${sidebarCollapsed ? 'hidden' : 'ml-6'}`}
    >
      {label}
    </Link>
  );

  const renderComplaintMenu = () => (
    <div ref={complaintMenuRef} className="relative">
      <div
        onClick={() => setShowComplaintMenu(!showComplaintMenu)}
        className={`flex items-center justify-between w-full px-3 py-2 text-gray-600 rounded-lg transition-colors ${
          isActive('/reports') || isActive('/reports-liste') || isActive('/manage-reports') || isActive('/analyze-reports')
            ? "bg-gradient-to-r from-[#9fdc23]/20 to-[#00b8e4]/20 text-[#9fdc23]"
            : "hover:bg-gray-50 hover:text-[#00b8e4]"
        }`}
      >
        <div className="flex items-center gap-5">
          <FileText className="w-5 h-5" />
          <span className={`text-sm font-medium ${sidebarCollapsed ? 'hidden' : 'block'}`}>Rapports</span>
        </div>
        {!sidebarCollapsed && (
          <ChevronDown className={`w-4 h-4 transition-transform ${showComplaintMenu ? 'rotate-180' : ''}`} />
        )}
      </div>
      {showComplaintMenu && !sidebarCollapsed && (
        <div className="mt-1 space-y-1">
          <SubmenuItem to="/reports" label="Déposer une plainte" />
          <SubmenuItem to="/reports-liste" label="Liste des plaintes" />
          <SubmenuItem to="/manage-reports" label="Gérer les plaintes" />
          <SubmenuItem to="/analyze-reports" label="Analyser les plaintes" />
        </div>
      )}
    </div>
  );

  const renderUserMenu = () => (
    <div ref={userMenuRef} className="relative">
      <div
        onClick={() => setShowUserMenu(!showUserMenu)}
        className={`flex items-center justify-between w-full px-3 py-2 text-gray-600 rounded-lg transition-colors ${
          isActive('/gestion-user') || isActive('/register-admin')
            ? "bg-gradient-to-r from-[#9fdc23]/20 to-[#00b8e4]/20 text-[#9fdc23]"
            : "hover:bg-gray-50 hover:text-[#00b8e4]"
        }`}
      >
        <div className="flex items-center gap-5">
          <Users className="w-5 h-5" />
          <span className={`text-sm font-medium ${sidebarCollapsed ? 'hidden' : 'block'}`}>Utilisateurs</span>
        </div>
        {!sidebarCollapsed && (
          <ChevronDown className={`w-4 h-4 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
        )}
      </div>
      {showUserMenu && !sidebarCollapsed && (
        <div className="mt-1 space-y-1">
          <SubmenuItem to="/register-admin" label="Ajouter un utilisateur" />
          <SubmenuItem to="/gestion-user" label="Gérer les utilisateurs" />
        </div>
      )}
    </div>
  );

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <aside 
      className={`fixed top-0 left-0 h-full ${
        sidebarCollapsed ? 'w-16' : 'w-64'
      } bg-white border-r border-gray-200 transition-all duration-300 ease-in-out pt-16`}
    >
      <div className="flex flex-col h-full overflow-y-auto">
        <nav className="flex-1 p-4 space-y-4">
          <div
            onClick={toggleSidebar}
            className="top-20 right-4 bg-transparent text-gray-600 hover:text-[#00b8e4] cursor-pointer transition-colors duration-200"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
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