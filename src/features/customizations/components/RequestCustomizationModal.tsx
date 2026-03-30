import React, { useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { createCustomization, CustomizationCreateRequest } from '../api/customization-api';
import { useToast } from '@/providers/ToastProvider';

interface RequestCustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
  productSku: string;
}

const RequestCustomizationModal: React.FC<RequestCustomizationModalProps> = ({
  isOpen,
  onClose,
  productId,
  productName,
  productSku,
}) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: `Custom ${productName}`,
    color: 'Red',
    size: 'M',
    weight: 0,
    staffNote: '', // Here we map customer's notes using staffNote property for now
  });

  const COLORS = [
    { name: "Red", value: "Red", class: "bg-red-500" },
    { name: "Black", value: "Black", class: "bg-black" },
    { name: "White", value: "White", class: "bg-white border" },
    { name: "Blue", value: "Blue", class: "bg-blue-500" },
    { name: "Gray", value: "Gray", class: "bg-gray-400" },
  ];

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'weight' ? parseFloat(value) || 0 : value
    }));
  };

  const handleColorSelect = (color: string) => {
    setFormData(prev => ({ ...prev, color }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const customerId = user?.id || user?.accountId || user?.['account-id'];
    if (!customerId) {
      showToast('Please login to request customization', 'error');
      return;
    }

    setLoading(true);
    try {
      const payload: CustomizationCreateRequest = {
        name: formData.name,
        sku: `${productSku}-CUSTOM`,
        color: formData.color,
        size: formData.size,
        weight: formData.weight,
        staffNote: `[Customer Req] ${formData.staffNote}`,
        customerId: customerId,
        productId: productId,
      };

      console.log('Sending Customization Payload:', payload);
      await createCustomization(payload);
      showToast('Customization requested successfully! Admin will review your request.', 'success');
      onClose();
    } catch (error: any) {
      console.error('Failed to create customization', error);
      let errorMsg = error.response?.data?.message || error.response?.data?.title || error.message || 'Unknown error';
      if (error.response?.data?.errors) {
        errorMsg = Object.values(error.response.data.errors).flat().join(", ");
      }
      showToast(`Failed: ${errorMsg}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm overflow-y-auto py-10">
      <div className="bg-surface-dark border border-surface-border p-6 rounded-xl w-full max-w-lg shadow-2xl my-auto">
        <div className="flex justify-between items-center mb-6 border-b border-surface-border pb-4">
          <div>
            <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">
              Request Customization
            </h2>
            <p className="text-sm text-text-muted mt-1">Based on: <span className="text-white font-bold">{productName}</span></p>
          </div>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
              Custom Name / Reference
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-[#2a1212] border border-surface-border rounded-lg px-4 py-3 text-white focus:border-primary transition-colors focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                Preferred Color
              </label>
              <div className="flex gap-2">
                {COLORS.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => handleColorSelect(c.value)}
                    className={`w-8 h-8 rounded-full shadow-md ${c.class} ${
                      formData.color === c.value ? "ring-2 ring-primary ring-offset-2 ring-offset-surface-dark" : "border border-white/20"
                    }`}
                    title={c.name}
                  />
                ))}
              </div>
              <div className="mt-2 text-xs text-text-muted">
                Selected: <span className="font-bold text-white">{formData.color || 'None'}</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                Size
              </label>
              <select
                name="size"
                required
                value={formData.size}
                onChange={handleChange}
                className="w-full bg-[#2a1212] border border-surface-border rounded-lg px-4 py-3 text-white focus:border-primary transition-colors focus:outline-none"
              >
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
              Target Weight (kg) - Optional
            </label>
            <input
              type="number"
              name="weight"
              step="0.1"
              value={formData.weight || ''}
              onChange={handleChange}
              placeholder="e.g. 1.2"
              className="w-full bg-[#2a1212] border border-surface-border rounded-lg px-4 py-3 text-white focus:border-primary transition-colors focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
              Specific Instructions / Notes
            </label>
            <textarea
              name="staffNote"
              rows={4}
              value={formData.staffNote}
              onChange={handleChange}
              placeholder="Describe your design, decals, or modifications you want..."
              className="w-full bg-[#2a1212] border border-surface-border rounded-lg px-4 py-3 text-white focus:border-primary transition-colors focus:outline-none resize-none"
            />
          </div>

          <div className="flex gap-4 mt-4 pt-4 border-t border-surface-border">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-lg border border-surface-border text-white font-bold uppercase tracking-wider hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 rounded-lg bg-primary hover:bg-red-700 text-white font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Send Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestCustomizationModal;
