"use client"

import { useState } from "react"
import { useDeliveryData } from "../../hooks/useDeliveryData"
import { useQRScanner } from "../../hooks/useQRScanner"
import { Spinner, LoadingOverlay } from "../../components/common/Loading"
import { SimplePagination } from '../../components/common/Pagination'
import { OrdersTable } from "../../components/delivery/OrdersTable"
import { QuetQR } from "./QuetQR"
import { KetQuaKiemTra } from "./KetQuaKiemTra"
import './KiemTraGiaoHang.css';

const KiemTraGiaoHang = () => {
  const {
    orders,
    stores,
    pagination,
    selectedStore,
    currentPage,
    ordersLoading,
    storesLoading,
    ordersError,
    storesError,
    handleStoreChange,
    handlePageChange,
    refreshOrders,
    setOrders,
  } = useDeliveryData()

  // QR Scanner
  const handleOrderConfirmed = (orderId) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, isConfirmed: true, status: "Đã xác nhận" } : order,
      ),
    )
  }

  const { qrInput, setQrInput, scanningOrderId, isDialogOpen, confirmLoading, startScan, confirmQRCode, closeDialog } =
    useQRScanner(handleOrderConfirmed)

  // Order detail dialog
  const [showDetailDialog, setShowDetailDialog] = useState(false)
  const [selectedOrderDetail, setSelectedOrderDetail] = useState(null)

  const handleViewDetail = (order) => {
    setSelectedOrderDetail(order)
    setShowDetailDialog(true)
  }

  // Statistics calculation
  const getOrderStatistics = () => {
    return {
      total: orders.length,
      confirmed: orders.filter((o) => o.isConfirmed).length,
      unconfirmed: orders.filter((o) => !o.isConfirmed).length,
      inDelivery: orders.filter((o) => o.status === "Đang giao").length,
    }
  }

  const stats = getOrderStatistics()

  // Error state
  if (ordersError || storesError) {
    return (
      <div className="kgh-min-h-screen">
        <div className="kgh-card">
          <div className="kgh-text-red">❌</div>
          <h3 className="kgh-title">Có lỗi xảy ra</h3>
          <p className="kgh-text-gray">{ordersError || storesError}</p>
          <button
            onClick={refreshOrders}
            className="kgh-btn-refresh"
          >
            <span>🔄</span>
            Thử lại
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="kgh-container">
      <div className="kgh-content-wrapper">
        <div className="kgh-padding">
          <div className="kgh-max-width">
            {/* Header */}
            <div className="kgh-header-section">
              <div className="kgh-header-flex">
                <div>
                  <h1 className="kgh-main-title">
                    <span className="kgh-icon-large">📦</span>✅ Kiểm Tra Giao Hàng
                  </h1>
                </div>
                <button
                  onClick={refreshOrders}
                  disabled={ordersLoading}
                  className="kgh-refresh-btn"
                >
                  <span className={ordersLoading ? "kgh-spin" : ""}>🔄</span>
                  Làm mới
                </button>
              </div>
            </div>

            {/* Statistics */}
            <div className="kgh-stats-grid">
              <div className="kgh-stat-card kgh-stat-card-hover">
                <div className="kgh-stat-content">
                  <div className="kgh-stat-number kgh-stat-blue">{stats.total}</div>
                  <div className="kgh-stat-label">Tổng đơn hàng</div>
                </div>
              </div>
              <div className="kgh-stat-card kgh-stat-card-hover">
                <div className="kgh-stat-content">
                  <div className="kgh-stat-number kgh-stat-green">{stats.confirmed}</div>
                  <div className="kgh-stat-label">Đã xác nhận</div>
                </div>
              </div>
              <div className="kgh-stat-card kgh-stat-card-hover">
                <div className="kgh-stat-content">
                  <div className="kgh-stat-number kgh-stat-yellow">{stats.unconfirmed}</div>
                  <div className="kgh-stat-label">Chưa xác nhận</div>
                </div>
              </div>
              <div className="kgh-stat-card kgh-stat-card-hover">
                <div className="kgh-stat-content">
                  <div className="kgh-stat-number kgh-stat-purple">{stats.inDelivery}</div>
                  <div className="kgh-stat-label">Đang giao</div>
                </div>
              </div>
            </div>

            Store Filter
            <div className="kgh-filter-card">
              <div className="kgh-card-header">
                <h2 className="kgh-section-title">Bộ lọc</h2>
              </div>
              <div className="kgh-card-body">
                <div className="kgh-filter-row">
                  <div className="kgh-filter-item">
                    <label className="kgh-label">Chọn cửa hàng</label>
                    {storesLoading ? (
                      <div className="kgh-loading-row">
                        <Spinner size="small" />
                        <span className="kgh-loading-text">Đang tải cửa hàng...</span>
                      </div>
                    ) : (
                      <select
                        className="kgh-select"
                        value={selectedStore}
                        onChange={(e) => handleStoreChange(e.target.value)}
                      >
                        {stores.map((store) => (
                          <option key={store.id} value={store.id}>
                            {store.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Orders Table */}
            <div className="kgh-orders-card">
              <div className="kgh-card-header">
                <div className="kgh-orders-header">
                  <h2 className="kgh-orders-title">
                    Danh sách đơn hàng ({pagination.totalItems}){ordersLoading && <Spinner size="small" />}
                  </h2>
                  <div className="kgh-pagination-info">
                    Trang {pagination.currentPage} / {pagination.totalPages}
                  </div>
                </div>
              </div>
              <div className="kgh-card-body">
                {ordersLoading ? (
                  <LoadingOverlay message="Đang tải danh sách đơn hàng..." />
                ) : (
                  <>
                    <OrdersTable
                      orders={orders}
                      onQRScan={startScan}
                      onViewDetail={handleViewDetail}
                      confirmLoading={confirmLoading}
                      scanningOrderId={scanningOrderId}
                    />

                    <SimplePagination
                      currentPage={pagination.currentPage}
                      totalPages={pagination.totalPages}
                      onPageChange={handlePageChange}
                    />
                  </>
                )}
              </div>
            </div>
            {/* QR Scanner Dialog */}
            <QuetQR
              isOpen={isDialogOpen}
              onClose={closeDialog}
              qrInput={qrInput}
              onQrInputChange={setQrInput}
              onConfirm={confirmQRCode}
              confirmLoading={confirmLoading}
            />

            {/* Order Detail Dialog */}
            <KetQuaKiemTra
              isOpen={showDetailDialog}
              onClose={() => setShowDetailDialog(false)}
              orderDetail={selectedOrderDetail}
              onQRScan={startScan}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default KiemTraGiaoHang;