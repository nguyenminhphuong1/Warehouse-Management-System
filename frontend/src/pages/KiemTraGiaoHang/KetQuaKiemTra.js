"use client"
import { OrderStatusBadge } from "../../components/delivery/OrderStatusBadge"
import './KetQuaKiemTra.css';

export const KetQuaKiemTra = ({ isOpen, onClose, orderDetail, onQRScan }) => {
  if (!isOpen || !orderDetail) return null

  return (
    <div className="kqkt-modal-overlay">
      <div className="kqkt-modal-card">
        <div className="kqkt-modal-header">
          <div className="kqkt-modal-header-left">
            <span className="kqkt-modal-icon">📦</span>
            <h3 className="kqkt-modal-title">Chi tiết đơn hàng {orderDetail.orderCode}</h3>
          </div>
          <button
            onClick={onClose}
            className="kqkt-btn-close"
          >
            ✕
          </button>
        </div>

        <div className="kqkt-modal-body">
          {/* Thông tin khách hàng */}
          <div>
            <h4 className="kqkt-section-title">👤 Thông tin khách hàng</h4>
            <div className="kqkt-section-box">
              <div className="kqkt-row">
                <span className="kqkt-label">Tên khách hàng:</span>
                <span className="kqkt-value">{orderDetail.customerName}</span>
              </div>
              <div className="kqkt-row">
                <span className="kqkt-label">Số điện thoại:</span>
                <span className="kqkt-value">{orderDetail.customerPhone}</span>
              </div>
              <div className="kqkt-row">
                <span className="kqkt-label">Địa chỉ:</span>
                <span className="kqkt-value kqkt-text-right kqkt-max-w-xs">{orderDetail.customerAddress}</span>
              </div>
            </div>
          </div>

          {/* Thông tin đơn hàng */}
          <div>
            <h4 className="kqkt-section-title">📦 Thông tin đơn hàng</h4>
            <div className="kqkt-section-box">
              <div className="kqkt-row">
                <span className="kqkt-label">Mã đơn hàng:</span>
                <span className="kqkt-value">{orderDetail.orderCode}</span>
              </div>
              <div className="kqkt-row">
                <span className="kqkt-label">Cửa hàng đích:</span>
                <span className="kqkt-value">{orderDetail.targetStore}</span>
              </div>
              <div className="kqkt-row">
                <span className="kqkt-label">Trạng thái:</span>
                <OrderStatusBadge status={orderDetail.status} />
              </div>
              <div className="kqkt-row">
                <span className="kqkt-label">Ngày đặt hàng:</span>
                <span className="kqkt-value">{orderDetail.orderDate}</span>
              </div>
              <div className="kqkt-row">
                <span className="kqkt-label">Ngày giao hàng:</span>
                <span className="kqkt-value">{orderDetail.deliveryDate}</span>
              </div>
              <div className="kqkt-row">
                <span className="kqkt-label">Xác nhận:</span>
                <span className="kqkt-confirm-status">
                  {orderDetail.isConfirmed ? (
                    <>
                      <span className="kqkt-confirm-yes">✅</span>
                      <span className="kqkt-confirm-yes kqkt-font-medium">Đã xác nhận</span>
                    </>
                  ) : (
                    <>
                      <span className="kqkt-confirm-no">❌</span>
                      <span className="kqkt-confirm-no kqkt-font-medium">Chưa xác nhận</span>
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Danh sách sản phẩm */}
          <div>
            <h4 className="kqkt-section-title">🛍️ Danh sách sản phẩm</h4>
            <div className="kqkt-section-box">
              <table className="kqkt-table">
                <thead>
                  <tr className="kqkt-table-header-row">
                    <th className="kqkt-th-left">Sản phẩm</th>
                    <th className="kqkt-th-center">SL</th>
                    <th className="kqkt-th-right">Đơn giá</th>
                    <th className="kqkt-th-right">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {orderDetail.items?.map((item, index) => (
                    <tr key={index} className="kqkt-table-row">
                      <td className="kqkt-td kqkt-td-left">{item.name}</td>
                      <td className="kqkt-td kqkt-td-center">{item.quantity}</td>
                      <td className="kqkt-td kqkt-td-right">{item.price?.toLocaleString("vi-VN")}đ</td>
                      <td className="kqkt-td kqkt-td-right kqkt-font-medium">
                        {(item.quantity * item.price)?.toLocaleString("vi-VN")}đ
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="kqkt-total-row">
                <span className="kqkt-total-label">Tổng cộng:</span>
                <span className="kqkt-total-value">
                  {orderDetail.totalAmount?.toLocaleString("vi-VN")}đ
                </span>
              </div>
            </div>
          </div>

          {/* Ghi chú */}
          {orderDetail.notes && (
            <div>
              <h4 className="kqkt-section-title">📝 Ghi chú</h4>
              <div className="kqkt-notes-box">
                <p className="kqkt-notes-text">{orderDetail.notes}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="kqkt-modal-actions">
            <button
              onClick={onClose}
              className="kqkt-btn-confirm"
            >
              Đóng
            </button>
            {!orderDetail.isConfirmed && (
              <button
                onClick={() => {
                  onClose()
                  onQRScan(orderDetail.id)
                }}
                className="kqkt-btn-qr"
              >
                <span>📱</span>
                Quét QR xác nhận
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
