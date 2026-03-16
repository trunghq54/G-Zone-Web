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
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
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
        payload["date-of-birth"],
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
    <div className="bg-background-dark text-white min-h-screen p-4 sm:p-8 flex items-center justify-center">
      <div className="w-full max-w-5xl mx-auto bg-black/30 backdrop-blur-sm border border-surface-border rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-6 sm:p-8">
          <h1 className="text-3xl font-bold text-primary mb-2">My Profile</h1>
          <p className="text-base text-gray-400 mb-8">
            Manage your account details and preferences.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Avatar and Info */}
            <div className="lg:col-span-1 flex flex-col items-center text-center">
              <div className="relative group w-40 h-40 mb-4">
                <div
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  onClick={handleAvatarClick}
                >
                  <div className="text-center">
                    <span className="material-symbols-outlined text-4xl">
                      {isUploadingAvatar ? "progress_activity" : "photo_camera"}
                    </span>
                    <p className="text-xs font-bold mt-1">
                      {isUploadingAvatar ? "Uploading..." : "Change Avatar"}
                    </p>
                  </div>
                </div>

                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Avatar"
                    className={`w-40 h-40 rounded-full object-cover border-4 border-primary transition-all ${
                      isUploadingAvatar ? "opacity-50" : ""
                    }`}
                  />
                ) : (
                  <div className="w-40 h-40 rounded-full bg-gray-800 border-4 border-gray-700 flex items-center justify-center">
                    <span className="material-symbols-outlined text-6xl text-gray-500">
                      person
                    </span>
                  </div>
                )}
                <input
                  type="file"
                  ref={avatarFileRef}
                  onChange={handleAvatarChange}
                  accept="image/*"
                  className="hidden"
                  disabled={isUploadingAvatar}
                />
              </div>
              <h2 className="text-2xl font-semibold">{profile["full-name"]}</h2>
              <p className="text-gray-400">{profile["email"]}</p>
            </div>

            {/* Right Column: Form */}
            <form
              className="lg:col-span-2"
              onSubmit={handleSave}
            >
              <h3 className="text-xl font-bold mb-6 border-b border-surface-border pb-3">
                Account Details
              </h3>
              {error && isEditing && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg mb-6">
                  {error}
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="sm:col-span-2">
                  <label
                    className="block text-sm font-medium text-gray-400 mb-2"
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
                      className="w-full bg-background-dark border border-surface-border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  ) : (
                    <p className="font-medium text-lg">
                      {profile["full-name"]}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label
                    className="block text-sm font-medium text-gray-400 mb-2"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData["email"] || ""}
                      onChange={handleInputChange}
                      className="w-full bg-background-dark border border-surface-border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  ) : (
                    <p className="font-medium text-lg">{profile["email"]}</p>
                  )}
                </div>

                <div>
                  <label
                    className="block text-sm font-medium text-gray-400 mb-2"
                    htmlFor="phone"
                  >
                    Phone
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="phone"
                      id="phone"
                      value={formData["phone"] || ""}
                      onChange={handleInputChange}
                      className="w-full bg-background-dark border border-surface-border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  ) : (
                    <p className="font-medium text-lg">
                      {profile["phone"] || (
                        <span className="text-gray-500">Not set</span>
                      )}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    className="block text-sm font-medium text-gray-400 mb-2"
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
                      className="w-full bg-background-dark border border-surface-border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  ) : (
                    <p className="font-medium text-lg">
                      {profile["date-of-birth"] ? (
                        new Date(
                          profile["date-of-birth"]
                        ).toLocaleDateString()
                      ) : (
                        <span className="text-gray-500">Not set</span>
                      )}
                    </p>
                  )}
                </div>
                <div className="col-span-2">
                  <label
                    className="block text-sm font-medium text-gray-400 mb-2"
                    htmlFor="gender"
                  >
                    Gender
                  </label>
                  {isEditing ? (
                    <select
                      name="gender"
                      id="gender"
                      value={formData["gender"] || ""}
                      onChange={handleInputChange}
                      className="w-full bg-background-dark border border-surface-border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  ) : (
                    <p className="font-medium text-lg">
                      {profile["gender"] || (
                        <span className="text-gray-500">Not set</span>
                      )}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-surface-border flex justify-end gap-4">
                {isEditing ? (
                  <>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="bg-primary hover:bg-primary-hover text-white font-bold py-2 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="bg-primary hover:bg-primary-hover text-white font-bold py-2 px-6 rounded-lg transition-colors"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
