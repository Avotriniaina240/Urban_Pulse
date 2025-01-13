import React from 'react';
import ComparisonComponent from '../components/feature-specific/Comparaison/ComparisonComponent';
import Navbar from '../components/layouts/Navbar/Navbar';
import Sidebar from '../components/layouts/Sidebar/SidebarCarte';

const Comparison = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Navbar at top */}
      <div className="fixed top-0 w-full z-50">
        <Navbar />
      </div>

      {/* Main content with sidebar */}
      <div className="flex pt-16"> {/* pt-16 accounts for navbar height */}
        {/* Fixed Sidebar */}
        <div className="fixed left-0 h-[calc(100vh-4rem)] w-64">
          <Sidebar />
        </div>

        {/* Main content area with proper offset for navbar and sidebar */}
        <main className="ml-64 w-full min-h-[calc(100vh-4rem)]">
          <div className="p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <ComparisonComponent />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Comparison;