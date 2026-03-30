import React, { useEffect, useState } from 'react';
import { Order, getOrderById, getOrders, patchOrder } from '@/features/orders/api/order-api';

const statusBadgeClass = (status: string) => {
  const key = status.toLowerCase();
  if (key.includes('process')) return 'bg-blue-500/20 text-blue-300';
  if (key.includes('ship')) return 'bg-yellow-500/20 text-yellow-300';
  if (key.includes('deliver')) return 'bg-green-500/20 text-green-300';
  if (key.includes('cancel')) return 'bg-red-500/20 text-red-300';
  return 'bg-white/10 text-white';
};

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
    totalCount: 0,
    totalPage: 0,
  });

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await getOrders(pagination.pageIndex, pagination.pageSize);
      setOrders(data.items);
      const totalPage = Math.ceil((data.totalCount || 0) / pagination.pageSize);
      setPagination((prev) => ({
        ...prev,
        totalCount: data.totalCount || 0,
        totalPage,
      }));
      setError(null);
    } catch (err: any) {
      console.error('Failed to load orders', err);
      setError(err?.response?.data?.message || 'Failed to load all orders. Please check admin permission and API.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [pagination.pageIndex, pagination.pageSize]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= pagination.totalPage) {
      setPagination((prev) => ({ ...prev, pageIndex: newPage }));
    }
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = Number(e.target.value);
    setPagination((prev) => ({
      ...prev,
      pageSize: newSize,
      pageIndex: 1,
    }));
  };

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= pagination.totalPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`w-8 h-8 rounded text-sm flex items-center justify-center transition-colors ${
            pagination.pageIndex === i
              ? 'bg-primary text-white font-bold'
              : 'bg-surface-light text-text-muted hover:bg-white/10'
          }`}
        >
          {i}
        </button>,
      );
    }

    return pages;
  };

  const openDetails = async (orderId: string) => {
    try {
      setDetailLoading(true);
      const order = await getOrderById(orderId);
      setSelectedOrder(order);
    } catch (err: any) {
      console.error('Failed to load order details', err);
      alert(err?.response?.data?.message || 'Failed to load order details');
    } finally {
      setDetailLoading(false);
    }
  };

  const closeDetails = () => {
    setSelectedOrder(null);
  };

  const updateStatus = async (orderId: string, status: string) => {
    try {
      setUpdatingOrderId(orderId);
      await patchOrder(orderId, { status });
      await loadOrders();
      if (selectedOrder?.orderId === orderId) {
        const refreshed = await getOrderById(orderId);
        setSelectedOrder(refreshed);
      }
    } catch (err: any) {
      console.error('Failed to update order status', err);
      alert(err?.response?.data?.message || 'Failed to update order status');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6 h-full relative">
      <div>
        <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white mb-1">Orders</h1>
        <p className="text-text-muted">Manage all customer orders and shipping flow.</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl">
          {error}
        </div>
      )}

      <div className="bg-surface-dark border border-surface-border rounded-xl flex-1 overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#2a1212] text-text-muted text-xs uppercase tracking-widest border-b border-surface-border">
                <th className="px-6 py-4 font-bold">Order</th>
                <th className="px-6 py-4 font-bold">Receiver</th>
                <th className="px-6 py-4 font-bold">Payment</th>
                <th className="px-6 py-4 font-bold">Total</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-text-muted">Loading orders...</td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-text-muted">No orders found.</td>
                </tr>
              ) : (
                orders.map((order) => {
                  const statusKey = order.status.toLowerCase();
                  const canConfirmShipping = statusKey.includes('process') || statusKey.includes('pending');
                  const canCancel = !statusKey.includes('deliver') && !statusKey.includes('cancel');
                  const isUpdating = updatingOrderId === order.orderId;

                  return (
                    <tr key={order.orderId} className="border-b border-surface-border hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-white font-bold">{order.orderNumber}</p>
                        <p className="text-xs text-text-muted">{new Date(order.createdAt).toLocaleString()}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-white text-sm">{order.receiverName}</p>
                        <p className="text-xs text-text-muted">{order.receiverPhone}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-white text-sm">{order.paymentMethod}</p>
                        <p className="text-xs text-text-muted">{order.paymentStatus}</p>
                      </td>
                      <td className="px-6 py-4 text-white font-bold">${order.totalAmount.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className={`rounded px-2 py-1 text-[10px] font-bold uppercase ${statusBadgeClass(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openDetails(order.orderId)}
                            className="h-8 w-8 inline-flex items-center justify-center rounded bg-white/10 text-white hover:bg-white/20"
                            title="View details"
                          >
                            <span className="material-symbols-outlined text-base">visibility</span>
                          </button>

                          <button
                            onClick={() => updateStatus(order.orderId, 'Shipping')}
                            disabled={!canConfirmShipping || isUpdating}
                            className="h-8 w-8 inline-flex items-center justify-center rounded bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30 disabled:opacity-40"
                            title="Confirm to shipping"
                          >
                            <span className="material-symbols-outlined text-base">check_circle</span>
                          </button>

                          <button
                            onClick={() => updateStatus(order.orderId, 'Cancelled')}
                            disabled={!canCancel || isUpdating}
                            className="h-8 w-8 inline-flex items-center justify-center rounded bg-red-500/20 text-red-300 hover:bg-red-500/30 disabled:opacity-40"
                            title="Cancel order"
                          >
                            <span className="material-symbols-outlined text-base">cancel</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="p-4 border-t border-surface-border flex justify-end items-center mt-auto">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-sm text-text-muted">
            <span>Rows per page:</span>
            <select
              value={pagination.pageSize}
              onChange={handlePageSizeChange}
              className="bg-background-dark border border-surface-border rounded px-2 py-1 text-white focus:outline-none"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(pagination.pageIndex - 1)}
              disabled={pagination.pageIndex <= 1}
              className="w-8 h-8 flex items-center justify-center rounded bg-surface-light text-text-muted hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <div className="flex items-center gap-1">{renderPageNumbers()}</div>
            <button
              onClick={() => handlePageChange(pagination.pageIndex + 1)}
              disabled={pagination.pageIndex >= pagination.totalPage || pagination.totalPage === 0}
              className="w-8 h-8 flex items-center justify-center rounded bg-surface-light text-text-muted hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {(selectedOrder || detailLoading) && (
        <div className="fixed inset-0 z-40 bg-black/70 flex items-center justify-center p-4">
          <div className="w-full max-w-3xl rounded-xl border border-surface-border bg-surface-dark shadow-2xl">
            <div className="px-5 py-4 border-b border-surface-border flex items-center justify-between">
              <div>
                <p className="text-sm text-text-muted">Order Details</p>
                <h3 className="text-white font-black text-lg">{selectedOrder?.orderNumber || 'Loading...'}</h3>
              </div>
              <button
                onClick={closeDetails}
                className="h-8 w-8 inline-flex items-center justify-center rounded bg-white/10 text-white hover:bg-white/20"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <div className="p-5 max-h-[75vh] overflow-auto">
              {detailLoading || !selectedOrder ? (
                <p className="text-text-muted">Loading order details...</p>
              ) : (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="rounded-lg border border-surface-border p-4">
                      <p className="text-xs text-text-muted uppercase font-bold mb-2">Receiver</p>
                      <p className="text-white font-semibold">{selectedOrder.receiverName}</p>
                      <p className="text-text-muted">{selectedOrder.receiverPhone}</p>
                      <p className="text-text-muted mt-1">{[selectedOrder.shippingAddress, selectedOrder.shippingWard, selectedOrder.shippingDistrict, selectedOrder.shippingCity].filter(Boolean).join(', ')}</p>
                    </div>
                    <div className="rounded-lg border border-surface-border p-4">
                      <p className="text-xs text-text-muted uppercase font-bold mb-2">Payment</p>
                      <p className="text-white">Method: {selectedOrder.paymentMethod}</p>
                      <p className="text-white">Status: {selectedOrder.paymentStatus}</p>
                      <p className="text-primary font-bold mt-2">Total: ${selectedOrder.totalAmount.toFixed(2)}</p>
                    </div>
                  </div>

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
                        {selectedOrder.orderDetails?.map((item) => (
                          <tr key={item.orderDetailId} className="border-t border-surface-border">
                            <td className="px-4 py-3 text-white">{item.productName}</td>
                            <td className="px-4 py-3 text-right text-text-muted">{item.quantity}</td>
                            <td className="px-4 py-3 text-right text-text-muted">${item.unitPrice.toFixed(2)}</td>
                            <td className="px-4 py-3 text-right text-primary font-bold">${item.totalPrice.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
