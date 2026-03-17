import React from 'react';

const AdminDashboard: React.FC = () => {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white mb-2">Overview</h1>
        <p className="text-text-muted">Welcome to the G-Zone Admin Dashboard.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="bg-surface-dark border border-surface-border p-6 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-text-muted text-sm font-bold uppercase tracking-wider mb-1">Total Sales</p>
            <p className="text-3xl font-black text-white">$24,500</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
            <span className="material-symbols-outlined">payments</span>
          </div>
        </div>

        <div className="bg-surface-dark border border-surface-border p-6 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-text-muted text-sm font-bold uppercase tracking-wider mb-1">Active Orders</p>
            <p className="text-3xl font-black text-white">142</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
            <span className="material-symbols-outlined">local_shipping</span>
          </div>
        </div>

        <div className="bg-surface-dark border border-surface-border p-6 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-text-muted text-sm font-bold uppercase tracking-wider mb-1">Total Products</p>
            <p className="text-3xl font-black text-white">85</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500">
            <span className="material-symbols-outlined">two_wheeler</span>
          </div>
        </div>

        <div className="bg-surface-dark border border-surface-border p-6 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-text-muted text-sm font-bold uppercase tracking-wider mb-1">Registered Users</p>
            <p className="text-3xl font-black text-white">1,204</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500">
            <span className="material-symbols-outlined">group</span>
          </div>
        </div>
      </div>

      {/* Quick Actions / Recent Additions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface-dark border border-surface-border rounded-xl flex flex-col">
          <div className="p-6 border-b border-surface-border flex justify-between items-center">
            <h2 className="text-lg font-bold uppercase text-white">Recent Orders</h2>
            <button className="text-primary text-sm font-bold uppercase hover:underline">View All</button>
          </div>
          <div className="p-6">
            <p className="text-text-muted italic text-sm">Loading recent orders from API...</p>
          </div>
        </div>

        <div className="bg-surface-dark border border-surface-border rounded-xl flex flex-col">
          <div className="p-6 border-b border-surface-border flex justify-between items-center">
            <h2 className="text-lg font-bold uppercase text-white">Top Products</h2>
            <button className="text-primary text-sm font-bold uppercase hover:underline">View Inventory</button>
          </div>
          <div className="p-6">
            <p className="text-text-muted italic text-sm">Loading top products from API...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;