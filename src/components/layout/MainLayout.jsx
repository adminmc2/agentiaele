// ========================================
// MAIN LAYOUT - Layout principal con Header
// ======================================== */

import { Outlet } from 'react-router-dom';
import Header from './Header';
import './MainLayout.css';

const MainLayout = () => {
  return (
    <div className="main-layout">
      <Header />
      <main className="content-area">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
