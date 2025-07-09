"use client"
import { OrderStatusBadge } from "./OrderStatusBadge"
import { Spinner } from "../common/Loading"
import './OrdersTable.css';

export const OrdersTable = ({ orders, onQRScan, onViewDetail, confirmLoading, scanningOrderId }) => {
  return (
    <div className="ot-container">
      <table className="ot-table">
        <thead>
          <tr className="ot-header-row">
            <th className="ot-th ot-th-left">Mã đơn hàng</th>
            <th className="ot-th ot-th-left">Cửa hàng đích</th>
            <th className="ot-th ot-th-left">Trạng thái</th>
            <th className="ot-th ot-th-center">Đã xác nhận</th>
            <th className="ot-th ot-th-center">Quét mã QR</th>
            <th className="ot-th ot-th-center">Chi tiết đơn</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan={6} className="ot-empty-cell">
                <div className="ot-empty-content">
                  <div className="ot-empty-icon">📦</div>
                  <p>Không có đơn hàng nào</p>
                </div>
              </td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr key={order.id} className="ot-row">
                <td className="ot-td ot-font-medium">{order.orderCode}</td>
                <td className="ot-td">{order.targetStore}</td>
                <td className="ot-td">
                  <OrderStatusBadge status={order.status} />
                </td>
                <td className="ot-td ot-text-center">
                  {order.isConfirmed ? (
                    <span className="ot-confirmed">✅</span>
                  ) : (
                    <span className="ot-unconfirmed">❌</span>
                  )}
                </td>
                <td className="ot-td ot-text-center">
                  <button
                    onClick={() => onQRScan(order.id)}
                    disabled={order.isConfirmed || (confirmLoading && scanningOrderId === order.id)}
                    className={`ot-btn-qr ${order.isConfirmed ? 'ot-btn-disabled' : 'ot-btn-active'}`}
                  >
                    {confirmLoading && scanningOrderId === order.id ? <Spinner size="small" /> : <span>📱</span>}
                    {order.isConfirmed ? "Đã quét" : "Quét QR"}
                  </button>
                </td>
                <td className="ot-td ot-text-center">
                  <button
                    onClick={() => onViewDetail(order)}
                    className="ot-btn-detail"
                  >
                    <span>👁️</span>
                    Xem chi tiết
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
