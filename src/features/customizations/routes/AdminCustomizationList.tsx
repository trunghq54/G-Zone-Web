import React, { useEffect, useState } from 'react';
import { getCustomizations, updateCustomization, CustomizationResponse } from '../api/customization-api';
import { useAuth } from '@/providers/AuthProvider';
import { useToast } from '@/providers/ToastProvider';

const AdminCustomizationList: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [customizations, setCustomizations] = useState<CustomizationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Edit form state
  const [quotedPrice, setQuotedPrice] = useState<number>(0);
  const [status, setStatus] = useState<string>('');
  const [staffNote, setStaffNote] = useState<string>('');

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await getCustomizations(1, 100);
      setCustomizations(res);
    } catch (error) {
      console.error('Failed to load customizations', error);
      showToast('Failed to load customizations', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleEditClick = (item: CustomizationResponse) => {
    setEditingId(item.customId);
    setQuotedPrice(item.quotedPrice || 0);
    setStatus(item.status || 'Pending');
    setStaffNote(item.staffNote || ''); // Optional field for staff
  };

  const handleSave = async (item: CustomizationResponse) => {
    try {
      await updateCustomization(item.customId, {
        name: item.name,
        color: item.color,
        size: item.size,
        weight: parseFloat(item.weight) || 0,
        staffNote: staffNote || "",
        quotedPrice: quotedPrice,
        status: status,
        confirmedByStaffId: user?.["account-id"] || user?.id
      });
      showToast('Customization updated successfully', 'success');
      setEditingId(null);
      fetchItems();
    } catch (error) {
      console.error('Update failed', error);
      showToast('Failed to update customization', 'error');
    }
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white mb-1">Custom Requests</h1>
          <p className="text-text-muted">Manage customer customization requests, provide quotes, and update statuses.</p>
        </div>
      </div>

      <div className="bg-surface-dark border border-surface-border rounded-xl flex-1 overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#2a1212] text-text-muted text-xs uppercase tracking-widest border-b border-surface-border">
                <th className="px-6 py-4 font-bold">Request Info</th>
                <th className="px-6 py-4 font-bold">Product Base</th>
                <th className="px-6 py-4 font-bold">Details</th>
                <th className="px-6 py-4 font-bold">Quote Price</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-text-muted">Loading requests...</td></tr>
              ) : customizations.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-text-muted">No customization requests found.</td></tr>
              ) : (
                customizations.map(item => (
                  <tr key={item.customId} className="border-b border-surface-border hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-white font-bold">{item.name}</p>
                      <p className="text-xs text-text-muted">{item.sku}</p>
                      <p className="text-xs text-primary mt-1">By: {item.customerName}</p>
                    </td>
                    <td className="px-6 py-4 text-text-muted text-sm">{item.productName || item.productId}</td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-text-muted">Color: <span className="text-white">{item.color}</span></p>
                      <p className="text-xs text-text-muted">Size: <span className="text-white">{item.size}</span></p>
                      {item.staffNote && (
                        <p className="text-xs text-text-muted mt-2 border-t border-surface-border pt-1">
                          Note: <span className="text-gray-300 italic">{item.staffNote}</span>
                        </p>
                      )}
                    </td>
                    
                    {/* Editable / Read View */}
                    {editingId === item.customId ? (
                      <>
                        <td className="px-6 py-4">
                          <input
                            type="number"
                            value={quotedPrice}
                            onChange={e => setQuotedPrice(parseFloat(e.target.value))}
                            className="w-24 bg-black border border-surface-border rounded px-2 py-1 text-white text-sm"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={status}
                            onChange={e => setStatus(e.target.value)}
                            className="bg-black border border-surface-border rounded px-2 py-1 text-white text-sm"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Completed">Completed</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => handleSave(item)} className="text-green-500 hover:text-green-400 mr-3 text-sm font-bold uppercase">Save</button>
                          <button onClick={() => setEditingId(null)} className="text-text-muted hover:text-white text-sm font-bold uppercase">Cancel</button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-6 py-4 text-white font-bold">
                          {item.quotedPrice > 0 ? `$${item.quotedPrice.toFixed(2)}` : <span className="text-yellow-500 text-xs text-normal">Needs Quote</span>}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                            item.status?.toLowerCase() === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                            item.status?.toLowerCase() === 'processing' ? 'bg-blue-500/10 text-blue-500' :
                            item.status?.toLowerCase() === 'completed' ? 'bg-green-500/10 text-green-500' :
                            'bg-red-500/10 text-red-500'
                          }`}>
                            {item.status || 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleEditClick(item)}
                            className="w-8 h-8 rounded bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition-colors flex flex-col items-center justify-center ml-auto"
                          >
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminCustomizationList;
