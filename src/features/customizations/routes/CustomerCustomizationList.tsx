import React, { useEffect, useState } from 'react';
import { getCustomizations, CustomizationResponse } from '../api/customization-api';
import { useAuth } from '@/providers/AuthProvider';

const CustomerCustomizationList: React.FC = () => {
  const { user } = useAuth();
  const [customizations, setCustomizations] = useState<CustomizationResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyRequests = async () => {
      try {
        setLoading(true);
        const myId = user?.["account-id"] || user?.id;
        const res = await getCustomizations(1, 100);
        
        // Filter by user
        const myRequests = res.filter(x => x.customerId === myId);
        setCustomizations(myRequests);
      } catch (error) {
        console.error('Failed to load customizations', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchMyRequests();
    }
  }, [user]);
  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending': return <span className="px-3 py-1 rounded bg-yellow-500/10 text-yellow-500 text-xs font-bold uppercase">Pending</span>;
      case 'processing': return <span className="px-3 py-1 rounded bg-blue-500/10 text-blue-500 text-xs font-bold uppercase">Processing</span>;
      case 'completed': return <span className="px-3 py-1 rounded bg-green-500/10 text-green-500 text-xs font-bold uppercase">Completed</span>;
      case 'rejected': return <span className="px-3 py-1 rounded bg-red-500/10 text-red-500 text-xs font-bold uppercase">Rejected</span>;
      default: return <span className="px-3 py-1 rounded bg-gray-500/10 text-gray-400 text-xs font-bold uppercase">{status || 'Unknown'}</span>;
    }
  };

  return (
    <div className="bg-surface-dark border border-surface-border rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">Custom Requests</h2>
          <p className="text-text-muted text-sm mt-1">Review standard products you've requested to be modified.</p>
        </div>
      </div>

      {loading ? (
        <div className="py-10 text-center text-text-muted">Loading requests...</div>
      ) : customizations.length === 0 ? (
        <div className="py-10 text-center border border-dashed border-surface-border rounded-xl">
          <span className="material-symbols-outlined text-[48px] text-text-muted mb-4 opacity-50">design_services</span>
          <p className="text-text-muted">You haven't submitted any customization requests yet.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {customizations.map(item => (
            <div key={item.customId} className="flex flex-col md:flex-row gap-4 justify-between bg-[#2a1212] p-5 rounded-lg border border-surface-border">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-white uppercase tracking-tight">{item.name}</h3>
                  {getStatusBadge(item.status)}
                </div>
                <p className="text-sm text-text-muted mb-1">Based on Product: <span className="text-white">{item.productName || item.productId}</span></p>
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-text-muted mt-3">
                  <span className="bg-black/30 px-2 py-1 rounded">Color: <strong className="text-white">{item.color}</strong></span>
                  <span className="bg-black/30 px-2 py-1 rounded">Size: <strong className="text-white">{item.size}</strong></span>
                  <span className="bg-black/30 px-2 py-1 rounded">SKU: <strong className="text-white">{item.sku}</strong></span>
                </div>
                {item.staffNote && (
                  <div className="mt-4 p-3 bg-black/40 border border-surface-border/50 rounded text-sm">
                    <span className="text-xs font-bold text-text-muted uppercase mb-1 block">Request Details / Notes</span>
                    <p className="text-gray-300 italic">{item.staffNote}</p>
                  </div>
                )}
              </div>
              <div className="flex flex-col justify-center items-start md:items-end text-left md:text-right border-t md:border-t-0 md:border-l border-surface-border pt-4 md:pt-0 md:pl-6">
                <span className="text-xs font-bold text-text-muted uppercase mb-1">Quoted Price</span>
                <span className="text-2xl font-black text-primary">
                  {item.quotedPrice > 0 ? `$${item.quotedPrice.toFixed(2)}` : 'Awaiting Quote'}
                </span>
                {item.quotedPrice > 0 && item.status.toLowerCase() === 'processing' && (
                  <button className="mt-3 px-4 py-2 bg-primary text-white text-xs font-bold uppercase rounded hover:bg-red-700 transition">
                    Checkout Item
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerCustomizationList;
