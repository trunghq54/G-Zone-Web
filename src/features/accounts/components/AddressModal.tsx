import React, { useState, useEffect } from "react";
import { UserAddress, createUserAddress, updateUserAddress } from "@/features/accounts/api/address-api";
import { useAuth } from "@/providers/AuthProvider";

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  address: UserAddress | null;
}

const AddressModal: React.FC<AddressModalProps> = ({
  isOpen,
  onClose,
  onSave,
  address,
}) => {
  const [formData, setFormData] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (address) {
      setFormData(address);
    } else {
      setFormData({
        "address-label": "",
        "receiver-name": "",
        "receiver-phone": "",
        address: "",
        city: "",
        district: "",
        ward: "",
        "is-default": false,
      });
    }
  }, [address, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      if (address) {
        await updateUserAddress(formData);
      } else {
        const payload = { ...formData, "account-id": user["account-id"] };
        console.log("Create Address Payload:", JSON.stringify(payload, null, 2));
        await createUserAddress(payload);
      }
      onSave();
      onClose();
    } catch (err) {
      setError("Failed to save address.");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-background-dark text-white rounded-2xl shadow-2xl w-full max-w-lg mx-4">
        <form onSubmit={handleSubmit} className="p-8">
          <h2 className="text-2xl font-bold text-primary mb-6">
            {address ? "Edit Address" : "Add New Address"}
          </h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-2">Address Label</label>
              <input type="text" name="address-label" value={formData["address-label"] || ""} onChange={handleInputChange} className="w-full bg-black/30 border border-surface-border rounded-lg p-3" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Receiver Name</label>
              <input type="text" name="receiver-name" value={formData["receiver-name"] || ""} onChange={handleInputChange} className="w-full bg-black/30 border border-surface-border rounded-lg p-3" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Receiver Phone</label>
              <input type="text" name="receiver-phone" value={formData["receiver-phone"] || ""} onChange={handleInputChange} className="w-full bg-black/30 border border-surface-border rounded-lg p-3" required />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-2">Address</label>
              <input type="text" name="address" value={formData.address || ""} onChange={handleInputChange} className="w-full bg-black/30 border border-surface-border rounded-lg p-3" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">City</label>
              <input type="text" name="city" value={formData.city || ""} onChange={handleInputChange} className="w-full bg-black/30 border border-surface-border rounded-lg p-3" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">District</label>
              <input type="text" name="district" value={formData.district || ""} onChange={handleInputChange} className="w-full bg-black/30 border border-surface-border rounded-lg p-3" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Ward</label>
              <input type="text" name="ward" value={formData.ward || ""} onChange={handleInputChange} className="w-full bg-black/30 border border-surface-border rounded-lg p-3" required />
            </div>
            <div className="sm:col-span-2 flex items-center gap-4">
              <input type="checkbox" name="is-default" checked={formData["is-default"] || false} onChange={handleInputChange} className="h-5 w-5 bg-black/30 border-surface-border rounded text-primary focus:ring-primary" />
              <label className="text-sm font-medium text-gray-400">Set as default address</label>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-surface-border flex justify-end gap-4">
            <button type="button" onClick={onClose} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded-lg">
              Cancel
            </button>
            <button type="submit" disabled={isSaving} className="bg-primary hover:bg-primary-hover text-white font-bold py-2 px-6 rounded-lg disabled:opacity-50">
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressModal;
