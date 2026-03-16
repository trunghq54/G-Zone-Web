import React, { useEffect, useState } from 'react';
import { getMyOrders, Order } from '@/features/orders/api/order-api';

const statusClass = (status: string) => {
  const key = status.toLowerCase();
  if (key.includes('pending')) return 'bg-yellow-500/15 text-yellow-300';
  if (key.includes('process')) return 'bg-blue-500/15 text-blue-300';
  if (key.includes('ship')) return 'bg-indigo-500/15 text-indigo-300';
  if (key.includes('deliver')) return 'bg-green-500/15 text-green-300';
  if (key.includes('cancel')) return 'bg-red-500/15 text-red-300';
  return 'bg-white/10 text-white';
};

const MyOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        const result = await getMyOrders(1, 50);
        setOrders(result.items);
        setError(null);
      } catch (err: any) {
        console.error('Failed to load my orders', err);
        setError(err?.response?.data?.message || 'Failed to load your order history.');
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10">
      <div className="mb-6 border-b border-surface-border pb-4">
        <h1 className="text-3xl font-black uppercase tracking-tight text-white">My Orders</h1>
        <p className="mt-2 text-text-muted">Track your COD order progress and payment status.</p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-red-300">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-surface-border bg-surface-dark">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#2a1212] text-xs uppercase tracking-wider text-text-muted">
              <tr>
                <th className="px-5 py-3">Order</th>
                <th className="px-5 py-3">Created</th>
                <th className="px-5 py-3">Payment</th>
                <th className="px-5 py-3">Total</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-text-muted">Loading your orders...</td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-text-muted">No orders yet.</td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.orderId} className="border-t border-surface-border text-sm">
                    <td className="px-5 py-4 text-white font-bold">{order.orderNumber}</td>
                    <td className="px-5 py-4 text-text-muted">{new Date(order.createdAt).toLocaleString()}</td>
                    <td className="px-5 py-4">
                      <p className="text-white">{order.paymentMethod}</p>
                      <p className="text-xs text-text-muted">{order.paymentStatus}</p>
                    </td>
                    <td className="px-5 py-4 text-white font-bold">${order.totalAmount.toFixed(2)}</td>
                    <td className="px-5 py-4">
                      <span className={`rounded px-2 py-1 text-xs font-bold uppercase ${statusClass(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
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

export default MyOrders;
