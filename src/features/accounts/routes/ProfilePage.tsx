import React, { useEffect, useState, useRef } from "react";
import {
  updateAccount,
  updateAvatar,
} from "@/features/accounts/api/account-api";
import { useAuth } from "@/providers/AuthProvider";

const ProfilePage: React.FC = () => {
  const { user: profile, avatarUrl, refreshUser } = useAuth();

  const [formData, setFormData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const avatarFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile) {
      setFormData(profile);
    } else {
      // If the page is loaded directly and the user context is not yet populated,
      // trigger a refresh to fetch the user data.
      refreshUser();
    }
  }, [profile, refreshUser]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    const payload = { ...profile, ...formData };

    if (payload["date-of-birth"] && !payload["date-of-birth"].includes("T")) {
      payload["date-of-birth"] = new Date(
        payload["date-of-birth"]
      ).toISOString();
    }

    try {
      await updateAccount(payload);
      alert("Profile updated successfully!");
      await refreshUser(); // Refresh global user state
      setIsEditing(false); // Exit edit mode
    } catch (err) {
      setError("Failed to update profile. Please check your data.");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
  };

  const handleAvatarClick = () => {
    avatarFileRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIsUploadingAvatar(true);
      setError(null);
      try {
        await updateAvatar(file);
        alert("Avatar updated successfully!");
        await refreshUser(); // Refresh global user state
      } catch (err) {
        setError("Failed to update avatar.");
        console.error(err);
      } finally {
        setIsUploadingAvatar(false);
      }
    }
  };

  if (!profile || !formData) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error && !isEditing) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-[#1a1a1a] text-white min-h-screen">
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8 text-primary">My Profile</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 flex flex-col items-center">
            <div className="relative group">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Avatar"
                  className="w-40 h-40 rounded-full object-cover border-4 border-primary mb-4"
                />
              ) : (
                <div className="w-40 h-40 rounded-full bg-gray-700 border-4 border-primary mb-4"></div>
              )}
              <input
                type="file"
                ref={avatarFileRef}
                onChange={handleAvatarChange}
                accept="image/*"
                className="hidden"
                disabled={isUploadingAvatar}
              />
              <div
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={handleAvatarClick}
              >
                <p className="text-white text-center">
                  {isUploadingAvatar ? "Uploading..." : "Change Avatar"}
                </p>
              </div>
            </div>
            <h2 className="text-2xl font-semibold">{profile["full-name"]}</h2>
            <p className="text-gray-400">{profile["email"]}</p>
          </div>

          <form
            className="md:col-span-2 bg-[#2a2a2a] p-6 rounded-lg"
            onSubmit={handleSave}
          >
            <h3 className="text-xl font-bold mb-6 border-b border-gray-600 pb-2">
              Account Details
            </h3>
            {error && isEditing && (
              <p className="text-red-500 mb-4">{error}</p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="col-span-2">
                <label
                  className="text-sm text-gray-400"
                  htmlFor="full-name"
                >
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="full-name"
                    id="full-name"
                    value={formData["full-name"] || ""}
                    onChange={handleInputChange}
                    className="w-full bg-[#1a1a1a] border border-gray-600 rounded-md p-2 mt-1 focus:outline-none focus:border-primary"
                  />
                ) : (
                  <p className="font-medium">{profile["full-name"]}</p>
                )}
              </div>
              <div>
                <label className="text-sm text-gray-400" htmlFor="phone">
                  Phone
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="phone"
                    id="phone"
                    value={formData["phone"] || ""}
                    onChange={handleInputChange}
                    className="w-full bg-[#1a1a1a] border border-gray-600 rounded-md p-2 mt-1 focus:outline-none focus:border-primary"
                  />
                ) : (
                  <p className="font-medium">{profile["phone"] || "Not set"}</p>
                )}
              </div>
              <div>
                <label
                  className="text-sm text-gray-400"
                  htmlFor="date-of-birth"
                >
                  Date of Birth
                </label>
                {isEditing ? (
                  <input
                    type="date"
                    name="date-of-birth"
                    id="date-of-birth"
                    value={
                      formData["date-of-birth"]
                        ? formData["date-of-birth"].split("T")[0]
                        : ""
                    }
                    onChange={handleInputChange}
                    className="w-full bg-[#1a1a1a] border border-gray-600 rounded-md p-2 mt-1 focus:outline-none focus:border-primary"
                  />
                ) : (
                  <p className="font-medium">
                    {profile["date-of-birth"]
                      ? new Date(
                          profile["date-of-birth"]
                        ).toLocaleDateString()
                      : "Not set"}
                  </p>
                )}
              </div>
              <div className="col-span-2">
                <label className="text-sm text-gray-400" htmlFor="gender">
                  Gender
                </label>
                {isEditing ? (
                  <select
                    name="gender"
                    id="gender"
                    value={formData["gender"] || ""}
                    onChange={handleInputChange}
                    className="w-full bg-[#1a1a1a] border border-gray-600 rounded-md p-2 mt-1 focus:outline-none focus:border-primary"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                ) : (
                  <p className="font-medium">{profile["gender"] || "Not set"}</p>
                )}
              </div>
            </div>
            <div className="mt-8 text-right flex justify-end gap-4">
              {isEditing ? (
                <>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="bg-primary hover:bg-primary-hover text-white font-bold py-2 px-4 rounded-lg transition-colors"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
