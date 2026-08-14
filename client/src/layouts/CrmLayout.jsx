import React from 'react';
import Sidebar from '../components/crm/Sidebar';
import Topbar from '../components/crm/Topbar';

const CrmLayout = ({ children }) => {
  return (
    <div className="crm-container">
      <Sidebar />
      <div className="crm-content">
        <Topbar />
        <main className="p-4 flex-grow-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default CrmLayout;
