import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import '../App.css';

const Layout = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();

    // Do not show back button on main dashboard if needed, or always show.
    // Assuming root '/' is dashboard, maybe hide there? For now, always show if not root?
    const showBackBtn = location.pathname !== '/';

    return (
        <div className="layout-container">
            <Sidebar />
            <div className="content-area">
                <header className="content-header">
                    <div className="header-left">
                        {/* Empty or Breadcrumbs */}
                    </div>
                    <div className="header-right">
                        <button onClick={() => navigate(-1)} className="nav-back-btn" title="Regresar">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="19" y1="12" x2="5" y2="12"></line>
                                <polyline points="12 19 5 12 12 5"></polyline>
                            </svg>
                        </button>
                    </div>
                </header>
                <main className="content-body">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
