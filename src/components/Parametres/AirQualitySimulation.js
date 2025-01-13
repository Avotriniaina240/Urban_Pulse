import React, { useState } from 'react';
import { 
  ChevronDown, 
  Layout, 
  BarChart2, 
  FileText, 
  GitCompare, 
  Map,
  Clock,
  Home,
  Menu,
  X
} from 'lucide-react';

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeItem, setActiveItem] = useState('vue-ensemble');
  const [isReportExpanded, setIsReportExpanded] = useState(false);

  const menuItems = [
    { id: 'vue-ensemble', label: 'Vue ensemble', icon: Home },
    { id: 'analyse', label: 'Analyse urbaine', icon: BarChart2 },
    { 
      id: 'rapport', 
      label: 'Rapport', 
      icon: FileText,
      subItems: [
        { id: 'soumission', label: 'Soumission' },
        { id: 'management', label: 'Management' },
        { id: 'liste', label: 'Liste' },
        { id: 'analyse-rapport', label: 'Analyse' }
      ]
    },
    { id: 'comparaison', label: 'Comparaison', icon: GitCompare },
    { id: 'prediction', label: 'Prédiction future', icon: Clock },
    { id: 'carte', label: 'Carte', icon: Map }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 text-gray-600 hover:text-lime-600 transition-colors"
            >
              {isSidebarOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
            <span className="text-xl font-bold bg-gradient-to-r from-lime-500 to-cyan-500 bg-clip-text text-transparent">
              UrbanPulse
            </span>
          </div>
          
          <div className="flex items-center gap-4">
          </div>
        </div>
      </nav>

      <aside className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 transition-all duration-300 z-40 
        ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="p-4">
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <div key={item.id}>
                <button
                  onClick={() => {
                    if (item.subItems) {
                      setIsReportExpanded(!isReportExpanded);
                    } else {
                      setActiveItem(item.id);
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 transition-colors
                    ${activeItem === item.id ? 'text-lime-600' : 'text-gray-600 hover:text-lime-600'}
                    ${isSidebarOpen ? 'justify-start' : 'justify-center'}`}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {isSidebarOpen && (
                    <>
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.subItems && (
                        <ChevronDown className={`w-4 h-4 transition-transform ${isReportExpanded ? 'rotate-180' : ''}`} />
                      )}
                    </>
                  )}
                </button>

                {item.subItems && isReportExpanded && isSidebarOpen && (
                  <div className="ml-8 mt-1 space-y-1">
                    {item.subItems.map((subItem) => (
                      <button
                        key={subItem.id}
                        onClick={() => setActiveItem(subItem.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 transition-colors
                          ${activeItem === subItem.id ? 'text-lime-600' : 'text-gray-600 hover:text-lime-600'}`}
                      >
                        <span className="flex-1 text-left text-sm">{subItem.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </aside>

      <main className={`pt-16 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;