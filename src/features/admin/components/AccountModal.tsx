import React, { useState, useEffect } from "react";
import {
  Account,
  UpdateAccountRequest,
  UpdateAccountRoleRequest,
  UpdateAccountPasswordRequest,
} from "../api/account-api";

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit" | "changeRole" | "changePassword";
  onSave: (data: UpdateAccountRequest) => Promise<void>;
  onCreate: (data: any) => Promise<void>;
  onSaveRole: (data: UpdateAccountRoleRequest) => Promise<void>;
  onSavePassword: (data: UpdateAccountPasswordRequest) => Promise<void>;
  initialData?: Account | null;
}

const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  mode,
  onSave,
  onCreate,
  onSaveRole,
  onSavePassword,
  initialData,
}) => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    phone: "",
    "full-name": "",
    role: "Customer",
    status: "Normal",
    "is-active": true,
    "date-of-birth": "",
    gender: "Other",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const resetState = {
        email: initialData?.email || "",
        username: initialData?.username || "",
        password: "",
        confirmPassword: "",
        phone: initialData?.phone || "",
        "full-name": initialData?.["full-name"] || "",
        role: initialData?.role || "Customer",
        status: initialData?.status || "Normal",
        "is-active": initialData?.["is-active"] ?? true,
        "date-of-birth": initialData?.["date-of-birth"]
          ? new Date(initialData["date-of-birth"]).toISOString().split("T")[0]
          : "",
        gender: initialData?.gender || "Other",
      };
      if (!initialData) {
        // Reset for create mode
        resetState.email = "";
        resetState.username = "";
        resetState.phone = "";
        resetState["full-name"] = "";
        resetState.role = "Customer";
        resetState.status = "Normal";
        resetState["is-active"] = true;
        resetState["date-of-birth"] = "";
        resetState.gender = "Other";
      }
      setFormData(resetState);
    }
  }, [initialData, isOpen]);

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

    if (!initialData && mode !== "create") return;

    setLoading(true);
    try {
      switch (mode) {
        case "edit":
          if (!initialData) break;
          const payload: UpdateAccountRequest = {
            id: initialData.id,
            email: formData.email,
            phone: formData.phone,
            "full-name": formData["full-name"],
            status: formData.status,
            "is-active": formData["is-active"],
            "date-of-birth": formData["date-of-birth"]
              ? new Date(formData["date-of-birth"]).toISOString()
              : undefined,
            gender: formData.gender,
          };
          await onSave(payload);
          break;
        case "create":
          await onCreate({
            username: formData.username,
            email: formData.email,
            password: formData.password,
          });
          break;
        case "changeRole":
          if (!initialData) break;
          await onSaveRole({ id: initialData.id, role: formData.role });
          break;
        case "changePassword":
          if (!initialData) break;
          if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            setLoading(false);
            return;
          }
          await onSavePassword({
            id: initialData.id,
            password: formData.password,
          });
          break;
      }
      onClose();
    } catch (error: any) {
      console.error(error.response?.data || error);

      const errorData = error.response?.data;
      let errorMessage = "An unexpected error occurred.";

      if (errorData) {
        if (errorData.errors) {
          const validationErrors = Object.entries(errorData.errors)
            .map(
              ([field, messages]) =>
                `${field}: ${(messages as string[]).join(" ")}`,
            )
            .join("\n");
          errorMessage = `Validation failed:\n${validationErrors}`;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.title) {
          errorMessage = errorData.title;
        }
      }

      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    switch (mode) {
      case "create":
        return "New Account";
      case "edit":
        return "Edit Account";
      case "changeRole":
        return "Change Role";
      case "changePassword":
        return "Change Password";
    }
  };

  const renderFields = () => {
    switch (mode) {
      case "create":
        return (
          <>
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
        );
      case "edit":
        return (
          <>
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
        );
      case "changeRole":
        return (
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
        );
      case "changePassword":
        return (
          <>
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                New Password
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
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full bg-[#2a1212] border border-surface-border rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-surface-dark border border-surface-border p-6 rounded-xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6 border-b border-surface-border pb-4">
          <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">
            {getTitle()}
          </h2>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {renderFields()}

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
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountModal;
