import React, { useEffect, useState } from "react";
import {
  getUserAddresses,
  deleteUserAddress,
  UserAddress,
} from "@/features/accounts/api/address-api";
import AddressModal from "@/features/accounts/components/AddressModal";

const AddressPage: React.FC = () => {
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<UserAddress | null>(
    null
  );

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const data = await getUserAddresses();
      setAddresses(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch addresses.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      try {
        await deleteUserAddress(id);
        alert("Address deleted successfully!");
        fetchAddresses(); // Refresh the list
      } catch (err) {
        setError("Failed to delete address.");
        console.error(err);
      }
    }
  };

  const openModal = (address: UserAddress | null = null) => {
    setSelectedAddress(address);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAddress(null);
  };

  const handleSave = () => {
    fetchAddresses();
    closeModal();
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Loading addresses...</p>
      </div>
    );
  }

  if (error && addresses.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-background-dark text-white min-h-screen p-4 sm:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-primary">Manage Addresses</h1>
            <button
              onClick={() => openModal()}
              className="bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              Add New Address
            </button>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <div className="space-y-6">
            {addresses.length > 0 ? (
              addresses.map((address) => (
                <div
                  key={address["address-id"]}
                  className="bg-black/30 backdrop-blur-sm border border-surface-border rounded-2xl p-6 flex justify-between items-start"
                >
                  <div>
                    <div className="flex items-center gap-4 mb-2">
                      <h2 className="text-xl font-semibold">
                        {address["address-label"]}
                      </h2>
                      {address["is-default"] && (
                        <span className="bg-primary/20 text-primary text-xs font-bold px-2 py-1 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400">
                      {address["receiver-name"]} - {address["receiver-phone"]}
                    </p>
                    <p className="text-gray-400">{address.address}</p>
                    <p className="text-gray-400">
                      {address.ward}, {address.district}, {address.city}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openModal(address)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <span className="material-symbols-outlined">edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(address["address-id"])}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-black/20 rounded-2xl">
                <p className="text-gray-400">You have no saved addresses.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <AddressModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSave}
        address={selectedAddress}
      />
    </>
  );
};

export default AddressPage;
