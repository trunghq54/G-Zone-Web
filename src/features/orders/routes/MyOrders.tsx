import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrders, Order, patchOrder } from '@/features/orders/api/order-api';

const statusClass = (status: string) => {
  const key = status.toLowerCase();
  if (key.includes('pending')) return 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30';
  if (key.includes('process')) return 'bg-blue-500/15 text-blue-300 border-blue-500/30';
  if (key.includes('ship')) return 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30';
  if (key.includes('deliver')) return 'bg-green-500/15 text-green-300 border-green-500/30';
  if (key.includes('cancel')) return 'bg-red-500/15 text-red-300 border-red-500/30';
  return 'bg-white/10 text-white border-white/10';
};

const statusIcon = (status: string) => {
  const key = status.toLowerCase();
  if (key.includes('pending')) return 'schedule';
  if (key.includes('process')) return 'sync';
  if (key.includes('ship')) return 'local_shipping';
  if (key.includes('deliver')) return 'check_circle';
  if (key.includes('cancel')) return 'cancel';
  return 'receipt';
};

const STEPS = ['Pending', 'Processing', 'Shipping', 'Delivered'];

const OrderProgress: React.FC<{ status: string }> = ({ status }) => {
  const key = status.toLowerCase();
  const cancelled = key.includes('cancel');
  const stepIndex = cancelled ? -1
    : key.includes('deliver') ? 3
    : key.includes('ship') ? 2
    : key.includes('process') ? 1
    : 0;

  if (cancelled) {
    return (
      <div className="flex items-center gap-2 text-red-400 text-xs font-bold">
        <span className="material-symbols-outlined text-sm">cancel</span>
        Order Cancelled
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      {STEPS.map((step, i) => (
        <React.Fragment key={step}>
          <div className="flex flex-col items-center gap-1">
            <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold border ${i <= stepIndex ? 'bg-primary border-primary text-white' : 'bg-surface-dark border-border-dark text-text-muted'}`}>
              {i < stepIndex ? <span className="material-symbols-outlined text-xs">check</span> : i + 1}
            </div>
            <span className={`text-[9px] font-semibold uppercase ${i <= stepIndex ? 'text-primary' : 'text-text-muted'}`}>{step}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`h-px flex-1 mb-4 min-w-[16px] ${i < stepIndex ? 'bg-primary' : 'bg-border-dark'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

const MyOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const PAGE_SIZE = 10;

  const loadOrders = async () => {
    try {
      setLoading(true);
      const result = await getMyOrders(1, 100);
      setOrders(result.items);
      setError(null);
    } catch (err: any) {
      console.error('Failed to load my orders', err);
      setError(err?.response?.data?.message || 'Failed to load your order history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const totalPages = Math.max(1, Math.ceil(orders.length / PAGE_SIZE));
  const paged = orders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggle = (id: string) => setExpandedId((prev) => (prev === id ? null : id));

  const onCancelOrder = async (orderId: string) => {
    try {
      setUpdatingOrderId(orderId);
      await patchOrder(orderId, { status: 'Cancelled' });
      await loadOrders();
    } catch (err: any) {
      console.error('Failed to cancel order', err);
      alert(err?.response?.data?.message || 'Failed to cancel order');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const onConfirmReceived = async (orderId: string) => {
    try {
      setUpdatingOrderId(orderId);
      await patchOrder(orderId, { status: 'Delivered' });
      await loadOrders();
    } catch (err: any) {
      console.error('Failed to confirm order delivered', err);
      alert(err?.response?.data?.message || 'Failed to confirm received');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between border-b border-surface-border pb-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white">My Orders</h1>
          <p className="mt-1 text-text-muted text-sm">Track your order progress and manage your orders.</p>
        </div>
        <Link to="/shop" className="hidden sm:inline-flex items-center gap-2 rounded-lg border border-border-dark bg-surface-dark px-4 py-2 text-sm font-bold text-white hover:border-primary transition-colors">
          <span className="material-symbols-outlined text-sm">shopping_bag</span>
          Continue Shopping
        </Link>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-red-300 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 rounded-xl border border-surface-border bg-surface-dark animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <span className="material-symbols-outlined text-6xl text-white/15 mb-4">receipt_long</span>
          <p className="text-xl font-bold text-white mb-2">No orders yet</p>
          <p className="text-text-muted text-sm mb-6">Looks like you haven't placed an order yet.</p>
          <Link to="/shop" className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-bold text-white hover:bg-red-600 transition-colors">
            <span className="material-symbols-outlined text-sm">shopping_bag</span>
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {paged.map((order) => {
            const isExpanded = expandedId === order.orderId;
            const statusKey = order.status.toLowerCase();
            const isUpdating = updatingOrderId === order.orderId;
            const canCancel = statusKey.includes('process');
            const canConfirmReceived = statusKey.includes('ship');

            return (
              <div key={order.orderId} className="rounded-xl border border-surface-border bg-surface-dark overflow-hidden">
                <div className="w-full text-left px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className={`material-symbols-outlined text-xl shrink-0 ${statusClass(order.status).split(' ')[1]}`}>
                      {statusIcon(order.status)}
                    </span>
                    <div className="min-w-0">
                      <p className="text-white font-bold text-sm">{order.orderNumber}</p>
                      <p className="text-text-muted text-xs">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap justify-end">
                    <span className={`rounded-lg border px-3 py-1 text-xs font-bold uppercase whitespace-nowrap ${statusClass(order.status)}`}>
                      {order.status}
                    </span>

                    <button
                      onClick={() => toggle(order.orderId)}
                      className="inline-flex items-center gap-1 rounded border border-border-dark px-3 py-1.5 text-xs font-bold text-white hover:border-primary"
                    >
                      <span className="material-symbols-outlined text-sm">visibility</span>
                      {isExpanded ? 'Hide details' : 'View details'}
                    </button>

                    <button
                      onClick={() => onCancelOrder(order.orderId)}
                      disabled={!canCancel || isUpdating}
                      className="inline-flex items-center gap-1 rounded border border-red-500/40 bg-red-500/10 px-3 py-1.5 text-xs font-bold text-red-300 hover:bg-red-500/20 disabled:opacity-40"
                    >
                      <span className="material-symbols-outlined text-sm">cancel</span>
                      Cancel order
                    </button>

                    {canConfirmReceived && (
                      <button
                        onClick={() => onConfirmReceived(order.orderId)}
                        disabled={isUpdating}
                        className="inline-flex items-center gap-1 rounded border border-green-500/40 bg-green-500/10 px-3 py-1.5 text-xs font-bold text-green-300 hover:bg-green-500/20 disabled:opacity-40"
                      >
                        <span className="material-symbols-outlined text-sm">check_circle</span>
                        Confirm received
                      </button>
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-surface-border px-5 py-5 bg-black/20 space-y-5">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3">Order Progress</p>
                      <OrderProgress status={order.status} />
                    </div>

                    {order.orderDetails && order.orderDetails.length > 0 && (
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3">Items Ordered</p>
                        <div className="rounded-lg border border-surface-border overflow-hidden">
                          <table className="w-full text-sm">
                            <thead className="bg-[#1e1e1e] text-text-muted text-xs uppercase tracking-wider">
                              <tr>
                                <th className="px-4 py-2 text-left">Product</th>
                                <th className="px-4 py-2 text-right">Qty</th>
                                <th className="px-4 py-2 text-right">Unit Price</th>
                                <th className="px-4 py-2 text-right">Subtotal</th>
                              </tr>
                            </thead>
                            <tbody>
                              {order.orderDetails.map((item) => (
                                <tr key={item.orderDetailId} className="border-t border-surface-border">
                                  <td className="px-4 py-3 text-white font-medium">{item.productName}</td>
                                  <td className="px-4 py-3 text-text-muted text-right">{item.quantity}</td>
                                  <td className="px-4 py-3 text-text-muted text-right">${item.unitPrice.toFixed(2)}</td>
                                  <td className="px-4 py-3 text-primary font-bold text-right">${item.totalPrice.toFixed(2)}</td>
                                </tr>
                              ))}
                            </tbody>
                            <tfoot className="bg-[#1e1e1e] border-t border-surface-border">
                              <tr>
                                <td colSpan={3} className="px-4 py-2 text-right text-text-muted text-xs font-bold uppercase">Order Total</td>
                                <td className="px-4 py-2 text-right text-primary font-black text-base">${order.totalAmount.toFixed(2)}</td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div className="rounded-lg border border-surface-border bg-surface-dark p-4">
                        <p className="text-xs font-bold uppercase tracking-wider text-text-muted mb-2">Shipping To</p>
                        <p className="text-white font-semibold">{order.receiverName}</p>
                        <p className="text-text-muted">{order.receiverPhone}</p>
                        <p className="text-text-muted mt-1">{[order.shippingAddress, order.shippingWard, order.shippingDistrict, order.shippingCity].filter(Boolean).join(', ')}</p>
                      </div>
                      <div className="rounded-lg border border-surface-border bg-surface-dark p-4">
                        <p className="text-xs font-bold uppercase tracking-wider text-text-muted mb-2">Payment</p>
                        <p className="text-white font-semibold">{order.paymentMethod}</p>
                        <span className={`mt-1 inline-block rounded px-2 py-0.5 text-xs font-bold ${order.paymentStatus?.toLowerCase().includes('paid') ? 'bg-green-500/15 text-green-300' : 'bg-yellow-500/15 text-yellow-300'}`}>
                          {order.paymentStatus}
                        </span>
                        {order.note && <p className="text-text-muted text-xs mt-2">Note: {order.note}</p>}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                className="h-9 w-9 rounded-lg border border-border-dark bg-surface-dark text-white disabled:opacity-30 hover:border-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-sm">chevron_left</span>
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setPage(p)}
                  className={`h-9 w-9 rounded-lg border text-sm font-bold ${p === page ? 'border-primary bg-primary text-white' : 'border-border-dark bg-surface-dark text-white hover:border-primary'}`}>
                  {p}
                </button>
              ))}
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="h-9 w-9 rounded-lg border border-border-dark bg-surface-dark text-white disabled:opacity-30 hover:border-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
