import React, { useState, useEffect } from "react";
import { Account, UpdateAccountRequest } from "../api/account-api";
import { registerApi } from "../../auth/api/auth-api";

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: UpdateAccountRequest) => Promise<void>;
  onCreate: (data: any) => Promise<void>;
  initialData?: Account | null;
}

const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onCreate,
  initialData,
}) => {
  const isEditMode = !!initialData;
  const [formData, setFormData] = useState({
    // Fields for both modes
    email: "",
    // Create mode fields
    username: "",
    password: "",
    // Edit mode fields
    phone: "",
    "full-name": "",
    role: "Member",
    status: "Normal",
    "is-active": true,
    "date-of-birth": "",
    gender: "Other",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (isEditMode && initialData) {
        setFormData({
          email: initialData.email,
          phone: initialData.phone || "",
          "full-name": initialData["full-name"] || "",
          role: initialData.role,
          status: initialData.status,
          "is-active": initialData["is-active"],
          "date-of-birth": initialData["date-of-birth"]
            ? new Date(initialData["date-of-birth"]).toISOString().split("T")[0]
            : "",
          gender: initialData.gender || "Other",
          // Fields not in edit mode
          username: "",
          password: "",
        });
      } else {
        // Reset for create mode
        setFormData({
          email: "",
          username: "",
          password: "",
          phone: "",
          "full-name": "",
          role: "Member",
          status: "Normal",
          "is-active": true,
          "date-of-birth": "",
          gender: "Other",
        });
      }
    }
  }, [initialData, isOpen, isEditMode]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditMode && initialData) {
        const payload: UpdateAccountRequest = {
          id: initialData.id,
          email: formData.email,
          phone: formData.phone,
          "full-name": formData["full-name"],
          role: formData.role,
          status: formData.status,
          "is-active": formData["is-active"],
          "date-of-birth": formData["date-of-birth"]
            ? new Date(formData["date-of-birth"]).toISOString()
            : undefined,
          gender: formData.gender,
        };
        await onSave(payload);
      } else {
        // Create mode
        const { username, email, password } = formData;
        await onCreate({ username, email, password });
      }
      onClose();
    } catch (error: any) {
      console.error(error.response?.data || error);

      // --- Start of new error handling ---
      const errorData = error.response?.data;
      let errorMessage = "An unexpected error occurred.";

      if (errorData) {
        if (errorData.errors) {
          // Handle ASP.NET Core validation errors
          const validationErrors = Object.entries(errorData.errors)
            .map(([field, messages]) => {
              // 'messages' is an array of strings
              return `${field}: ${(messages as string[]).join(" ")}`;
            })
            .join("\n");
          errorMessage = `Validation failed:\n${validationErrors}`;
        } else if (errorData.message) {
          // Handle general error messages from the API
          errorMessage = errorData.message;
        } else if (errorData.title) {
          // Fallback to the title
          errorMessage = errorData.title;
        }
      }
      // --- End of new error handling ---

      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-surface-dark border border-surface-border p-6 rounded-xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6 border-b border-surface-border pb-4">
          <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">
            {isEditMode ? "Edit Account" : "New Account"}
          </h2>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {isEditMode ? (
            <>
              {/* Edit Mode Fields */}
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#2a1212] border border-surface-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="full-name"
                  value={formData["full-name"]}
                  onChange={handleChange}
                  className="w-full bg-[#2a1212] border border-surface-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                  Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-[#2a1212] border border-surface-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="date-of-birth"
                    value={formData["date-of-birth"]}
                    onChange={handleChange}
                    className="w-full bg-[#2a1212] border border-surface-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full bg-[#2a1212] border border-surface-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                    Role
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full bg-[#2a1212] border border-surface-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Staff">Staff</option>
                    <option value="Customer">Customer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full bg-[#2a1212] border border-surface-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                  >
                    <option value="Normal">Normal</option>
                    <option value="Suspend">Suspend</option>
                    <option value="Abandoned">Abandoned</option>
                    <option value="Spam">Spam</option>
                    <option value="Banned">Banned</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="flex items-center gap-3 cursor-pointer mt-2">
                  <input
                    type="checkbox"
                    name="is-active"
                    checked={formData["is-active"]}
                    onChange={handleChange}
                    className="w-4 h-4 accent-primary"
                  />
                  <span className="text-white text-sm font-medium">
                    Account is Active
                  </span>
                </label>
              </div>
            </>
          ) : (
            <>
              {/* Create Mode Fields */}
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                  Username *
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#2a1212] border border-surface-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#2a1212] border border-surface-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#2a1212] border border-surface-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </>
          )}

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-surface-border">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-2 rounded font-bold uppercase tracking-wider text-text-muted hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-primary hover:bg-red-600 text-white px-6 py-2 rounded font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : isEditMode
                  ? "Save Changes"
                  : "Create Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountModal;
