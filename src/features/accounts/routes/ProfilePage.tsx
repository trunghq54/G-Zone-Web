import React, { useEffect, useState, useRef } from "react";
import {
  updateAccount,
  updateAvatar,
} from "@/features/accounts/api/account-api";
import { useAuth } from "@/providers/AuthProvider";
import { getMyOrders, Order } from "@/features/orders/api/order-api";
import { Link } from "react-router-dom";
import { useToast } from "@/providers/ToastProvider";

// ---- Order helpers --------------------------------------------------------

const statusClass = (status: string) => {
  const key = status.toLowerCase();
  if (key.includes("pending")) return "bg-yellow-500/15 text-yellow-300 border-yellow-500/30";
  if (key.includes("process")) return "bg-blue-500/15 text-blue-300 border-blue-500/30";
  if (key.includes("ship")) return "bg-indigo-500/15 text-indigo-300 border-indigo-500/30";
  if (key.includes("deliver")) return "bg-green-500/15 text-green-300 border-green-500/30";
  if (key.includes("cancel")) return "bg-red-500/15 text-red-300 border-red-500/30";
  return "bg-white/10 text-white border-white/10";
};

// ---- Profile Tab ----------------------------------------------------------

const ProfileTab: React.FC = () => {
  const { user: profile, avatarUrl, refreshUser } = useAuth();
  const { showToast } = useToast();
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
      refreshUser();
    }
  }, [profile, refreshUser]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    const payload = { ...profile, ...formData };
    if (payload["date-of-birth"] && !payload["date-of-birth"].includes("T")) {
      payload["date-of-birth"] = new Date(payload["date-of-birth"]).toISOString();
    }
    try {
      await updateAccount(payload);
      showToast("Profile updated successfully.");
      await refreshUser();
      setIsEditing(false);
    } catch (err) {
      setError("Failed to update profile. Please check your data.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIsUploadingAvatar(true);
      setError(null);
      try {
        await updateAvatar(file);
        showToast("Avatar updated successfully.");
        await refreshUser();
      } catch {
        setError("Failed to update avatar.");
      } finally {
        setIsUploadingAvatar(false);
      }
    }
  };

  if (!profile || !formData) {
    return <p className="text-text-muted py-10 text-center">Loading profile...</p>;
  }

  const inputCls = "w-full bg-surface-dark border border-surface-border rounded-lg px-4 py-2.5 mt-1 text-white text-sm focus:outline-none focus:border-primary transition-colors";
  const labelCls = "text-xs font-bold uppercase tracking-wider text-text-muted";

  return (
    <div className="space-y-8">
      {/* Avatar + name card */}
      <div className="flex items-center gap-5 p-6 rounded-xl border border-surface-border bg-surface-dark">
        <div className="relative group cursor-pointer shrink-0" onClick={() => avatarFileRef.current?.click()}>
          {avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" className="w-20 h-20 rounded-full object-cover border-2 border-primary" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-[#2a2a2a] border-2 border-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl text-white/40">person</span>
            </div>
          )}
          <div className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="material-symbols-outlined text-white text-lg">{isUploadingAvatar ? "hourglass_top" : "photo_camera"}</span>
          </div>
          <input type="file" ref={avatarFileRef} onChange={handleAvatarChange} accept="image/*" className="hidden" disabled={isUploadingAvatar} />
        </div>
        <div>
          <p className="text-xl font-bold text-white">{profile["full-name"]}</p>
          <p className="text-sm text-text-muted">{profile["email"]}</p>
          <p className="text-xs text-text-muted mt-1 opacity-60">Click avatar to change photo</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSave} className="rounded-xl border border-surface-border bg-surface-dark p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-surface-border pb-4">
          <h3 className="text-lg font-bold text-white">Account Details</h3>
          {!isEditing && (
            <button type="button" onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 rounded-lg border border-border-dark px-4 py-2 text-sm font-bold text-white hover:border-primary transition-colors">
              <span className="material-symbols-outlined text-sm">edit</span> Edit
            </button>
          )}
        </div>

        {error && isEditing && (
          <p className="text-red-400 text-sm rounded-lg border border-red-500/30 bg-red-500/10 p-3">{error}</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="sm:col-span-2">
            <label className={labelCls}>Full Name</label>
            {isEditing ? (
              <input type="text" name="full-name" value={formData["full-name"] || ""} onChange={handleInputChange} className={inputCls} />
            ) : (
              <p className="mt-1 text-white font-medium">{profile["full-name"]}</p>
            )}
          </div>
          <div>
            <label className={labelCls}>Phone</label>
            {isEditing ? (
              <input type="text" name="phone" value={formData["phone"] || ""} onChange={handleInputChange} className={inputCls} />
            ) : (
              <p className="mt-1 text-white font-medium">{profile["phone"] || "Not set"}</p>
            )}
          </div>
          <div>
            <label className={labelCls}>Date of Birth</label>
            {isEditing ? (
              <input type="date" name="date-of-birth" value={formData["date-of-birth"] ? formData["date-of-birth"].split("T")[0] : ""} onChange={handleInputChange} className={inputCls} />
            ) : (
              <p className="mt-1 text-white font-medium">{profile["date-of-birth"] ? new Date(profile["date-of-birth"]).toLocaleDateString() : "Not set"}</p>
            )}
          </div>
          <div>
            <label className={labelCls}>Gender</label>
            {isEditing ? (
              <select name="gender" value={formData["gender"] || ""} onChange={handleInputChange} className={inputCls}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            ) : (
              <p className="mt-1 text-white font-medium">{profile["gender"] || "Not set"}</p>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => { setFormData(profile); setIsEditing(false); }}
              className="rounded-lg border border-border-dark px-5 py-2 text-sm font-bold text-white hover:border-primary transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={isSaving}
              className="rounded-lg bg-primary px-5 py-2 text-sm font-bold text-white hover:bg-red-600 transition-colors disabled:opacity-50">
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

// ---- Orders Tab ----------------------------------------------------------

interface OrdersTabProps {
  orders: Order[];
  loading: boolean;
  error: string | null;
}

const OrdersTab: React.FC<OrdersTabProps> = ({ orders, loading, error }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (loading) return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-18 rounded-xl border border-surface-border bg-surface-dark animate-pulse h-16" />)}
    </div>
  );

  if (error) return <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-300 text-sm">{error}</div>;

  if (orders.length === 0) return (
    <div className="flex flex-col items-center py-20 text-center">
      <span className="material-symbols-outlined text-5xl text-white/15 mb-3">receipt_long</span>
      <p className="text-white font-bold mb-1">No orders yet</p>
      <p className="text-text-muted text-sm">Your order history will appear here.</p>
    </div>
  );

  return (
    <div className="space-y-3">
      {orders.map((order) => {
        const expanded = expandedId === order.orderId;
        return (
          <div key={order.orderId} className="rounded-xl border border-surface-border bg-surface-dark overflow-hidden">
            <button onClick={() => setExpandedId(expanded ? null : order.orderId)}
              className="w-full text-left px-5 py-4 flex items-center gap-4 hover:bg-white/[0.02] transition-colors">
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-sm">{order.orderNumber}</p>
                <p className="text-text-muted text-xs">{new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</p>
              </div>
              <p className="text-primary font-black text-base shrink-0">${order.totalAmount.toFixed(2)}</p>
              <span className={`rounded-lg border px-3 py-1 text-xs font-bold uppercase whitespace-nowrap shrink-0 ${statusClass(order.status)}`}>{order.status}</span>
              <span className={`material-symbols-outlined text-text-muted text-base transition-transform shrink-0 ${expanded ? "rotate-180" : ""}`}>expand_more</span>
            </button>
            {expanded && order.orderDetails && order.orderDetails.length > 0 && (
              <div className="border-t border-surface-border bg-black/20 px-5 py-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-text-muted text-xs uppercase">
                      <th className="pb-2 text-left">Product</th>
                      <th className="pb-2 text-right">Qty</th>
                      <th className="pb-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.orderDetails.map((item) => (
                      <tr key={item.orderDetailId} className="border-t border-surface-border/50">
                        <td className="py-2 text-white">{item.productName}</td>
                        <td className="py-2 text-text-muted text-right">{item.quantity}</td>
                        <td className="py-2 text-primary font-bold text-right">${item.totalPrice.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// ---- ProfilePage ---------------------------------------------------------

type Tab = "profile" | "orders";

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: "profile", label: "My Profile", icon: "person" },
  { key: "orders", label: "My Orders", icon: "receipt_long" },
];

const ProfilePage: React.FC = () => {
  const { user: profile, avatarUrl } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState<string | null>(null);

  useEffect(() => {
    getMyOrders(1, 50)
      .then((res) => setOrders(res.items))
      .catch((err) => setOrdersError(err?.response?.data?.message || "Failed to load orders."))
      .finally(() => setOrdersLoading(false));
  }, []);

  const pendingCount = orders.filter((order) => {
    const status = order.status.toLowerCase();
    return status.includes("pending") || status.includes("process") || status.includes("ship");
  }).length;

  const deliveredCount = orders.filter((order) => order.status.toLowerCase().includes("deliver")).length;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 md:py-10">
      <section className="mb-8 overflow-hidden rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(230,0,0,0.14),_transparent_28%),linear-gradient(180deg,_rgba(255,255,255,0.03),_rgba(255,255,255,0.01))] p-6 md:p-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr),380px] lg:items-end">
          <div>
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.26em] text-primary">My account</p>
            <h1 className="text-4xl font-black uppercase tracking-tight text-white md:text-5xl">Customer Area, Not A Random Form</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/68 md:text-base">
              This section now follows a more standard shop account layout: summary first, clear navigation on the side, and order history inside the same account shell instead of feeling detached.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/shop" className="rounded-full bg-primary px-6 py-3 text-xs font-black uppercase tracking-[0.2em] text-white transition-colors hover:bg-red-600">
                Continue shopping
              </Link>
              <Link to="/profile/orders" className="rounded-full border border-white/12 bg-white/[0.03] px-6 py-3 text-xs font-black uppercase tracking-[0.2em] text-white transition-colors hover:bg-white/[0.08]">
                Full orders page
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Orders</p>
              <p className="mt-2 text-3xl font-black text-white">{orders.length}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Active</p>
              <p className="mt-2 text-3xl font-black text-white">{pendingCount}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Delivered</p>
              <p className="mt-2 text-3xl font-black text-white">{deliveredCount}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-[280px,minmax(0,1fr)]">
        <aside className="space-y-4">
          <div className="rounded-[26px] border border-surface-border bg-surface-dark p-5">
            <div className="flex items-center gap-4">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="h-16 w-16 rounded-full object-cover border border-primary/40" />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-primary">
                  <span className="material-symbols-outlined">person</span>
                </div>
              )}
              <div className="min-w-0">
                <p className="truncate text-lg font-bold text-white">{profile?.["full-name"] || 'Rider'}</p>
                <p className="truncate text-sm text-text-muted">{profile?.email || 'Signed in customer'}</p>
              </div>
            </div>
            <div className="mt-5 grid gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white/60">
              <div className="rounded-xl border border-white/8 bg-black/15 px-3 py-3">Centralized account navigation</div>
              <div className="rounded-xl border border-white/8 bg-black/15 px-3 py-3">Inline order overview</div>
              <div className="rounded-xl border border-white/8 bg-black/15 px-3 py-3">Cleaner profile editing</div>
            </div>
          </div>

          <nav className="rounded-[26px] border border-surface-border bg-surface-dark p-3">
            <ul className="space-y-1">
            {TABS.map((tab) => (
              <li key={tab.key}>
                <button
                  onClick={() => setActiveTab(tab.key)}
                    className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-left transition-colors ${activeTab === tab.key ? "bg-primary/15 text-primary border border-primary/30" : "text-text-muted hover:bg-white/5 border border-transparent"}`}
                >
                  <span className="material-symbols-outlined text-base">{tab.icon}</span>
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
          </nav>
        </aside>

        <div className="flex-1 min-w-0">
          {activeTab === "profile" && <ProfileTab />}
          {activeTab === "orders" && <OrdersTab orders={orders} loading={ordersLoading} error={ordersError} />}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

