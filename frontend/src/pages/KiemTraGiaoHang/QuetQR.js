"use client"
import { Spinner } from "../../components/common/Loading"
import './QuetQR.css';

export const QuetQR = ({ isOpen, onClose, qrInput, onQrInputChange, onConfirm, confirmLoading }) => {
  if (!isOpen) return null

  return (
    <div className="qqr-modal-overlay">
      <div className="qqr-modal-card">
        <div className="qqr-modal-header">
          <span className="qqr-modal-icon">📱</span>
          <h3 className="qqr-modal-title">Quét mã QR</h3>
        </div>

        <div className="qqr-modal-body">
          <div className="qqr-modal-desc">Nhập mã QR hoặc mã đơn hàng để xác nhận:</div>

          <div className="qqr-modal-input-group">
            <label className="qqr-modal-label">Mã QR / Mã đơn hàng:</label>
            <input
              type="text"
              value={qrInput}
              onChange={(e) => onQrInputChange(e.target.value)}
              placeholder="Nhập mã..."
              disabled={confirmLoading}
              className="qqr-modal-input"
            />
          </div>

          <div className="qqr-modal-hint">💡 Gợi ý: Thử nhập mã đơn hàng (ví dụ: DH001, DH002, DH003...)</div>

          <div className="qqr-modal-actions">
            <button
              onClick={onConfirm}
              disabled={!qrInput.trim() || confirmLoading}
              className="qqr-btn-confirm"
            >
              {confirmLoading ? (
                <>
                  <Spinner size="small" />
                  Đang xác nhận...
                </>
              ) : (
                "Xác nhận"
              )}
            </button>

            <button
              onClick={onClose}
              disabled={confirmLoading}
              className="qqr-btn-cancel"
            >
              Hủy
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
