import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';

const AdminLayout: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth(); // getting logic from AuthProvider.

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: 'dashboard' },
    { name: 'Products', href: '/admin/products', icon: 'two_wheeler' },
    { name: 'Categories', href: '/admin/categories', icon: 'category' },
    { name: 'Orders', href: '/admin/orders', icon: 'local_mall' },
    { name: 'Users', href: '/admin/users', icon: 'group' },
  ];

  return (
    <div className="flex h-screen bg-background-dark text-white font-display">
      {/* Sidebar */}
      <aside className="w-64 bg-surface-dark border-r border-surface-border flex flex-col">
        <div className="p-6 md:px-6 md:py-8 border-b border-surface-border">
          <Link to="/" className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-3xl">local_fire_department</span>
            <div className="flex flex-col">
              <span className="text-xl font-black italic tracking-tighter leading-none bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 uppercase">G-ZONE</span>
              <span className="text-[10px] text-primary font-bold tracking-widest uppercase leading-none mt-0.5">Admin Panel</span>
            </div>
          </Link>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all group ${
                  isActive 
                    ? "bg-primary/20 border-l-4 border-primary text-white" 
                    : "text-text-muted hover:bg-[#2a1212] hover:text-white"
                }`}
              >
                <span className={`material-symbols-outlined ${isActive ? "text-primary" : "group-hover:text-primary"}`}>{item.icon}</span>
                <p className="text-sm font-bold uppercase tracking-wide">{item.name}</p>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-surface-border">
          <button onClick={logout} className="flex items-center w-full gap-3 px-4 py-3 rounded-lg text-text-muted hover:bg-red-500/10 hover:text-red-500 transition-all group">
            <span className="material-symbols-outlined">logout</span>
            <p className="text-sm font-bold uppercase tracking-wide">Logout</p>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col max-h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-surface-dark border-b border-surface-border flex items-center justify-between px-8 flex-shrink-0">
          <h2 className="text-lg font-bold uppercase tracking-widest text-text-muted">G-Zone Management System</h2>
          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <p className="text-sm font-bold text-white">{user?.Username || user?.username || 'Admin User'}</p>
              <p className="text-xs text-primary">{user?.Role || user?.role || 'Administrator'}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">admin_panel_settings</span>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;