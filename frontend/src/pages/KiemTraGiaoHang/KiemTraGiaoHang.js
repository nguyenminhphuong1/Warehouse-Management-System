"use client"
import { useState, useMemo } from "react"
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
    allOrders,
    stores,
    pagination,
    selectedStore,
    ordersLoading,
    storesLoading,
    ordersError,
    storesError,
    handleStoreChange,
    handlePageChange,
    refreshOrders,
    setOrders,
  } = useDeliveryData()

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("")
  const [confirmationFilter, setConfirmationFilter] = useState("all") // "all", "confirmed", "unconfirmed"
  const [sortOrder, setSortOrder] = useState("desc") // "asc", "desc"

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

  // Filter and sort orders
  const filteredAndSortedOrders = useMemo(() => {
    let filtered = allOrders

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(allOrders => 
        allOrders.orderCode.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        allOrders.targetStore?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply confirmation filter
    if (confirmationFilter === "confirmed") {
      filtered = filtered.filter(order => order.isConfirmed)
    } else if (confirmationFilter === "unconfirmed") {
      filtered = filtered.filter(order => !order.isConfirmed)
    }

    // Apply sorting by created date
    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt || a.ngayTao || Date.now())
      const dateB = new Date(b.createdAt || b.ngayTao || Date.now())
      
      if (sortOrder === "desc") {
        return dateB - dateA
      } else {
        return dateA - dateB
      }
    })

    return filtered
  }, [orders, searchTerm, confirmationFilter, sortOrder])

  // Statistics calculation using filtered orders
  const getOrderStatistics = () => {
    return {
      total: allOrders.length,
      confirmed: allOrders.filter((o) => o.isConfirmed).length,
      unconfirmed: allOrders.filter((o) => !o.isConfirmed).length,
      inDelivery: allOrders.filter((o) => o.status === "Đang giao").length,
    }
  }

  const stats = getOrderStatistics()

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("")
    setConfirmationFilter("all")
    setSortOrder("desc")
  }

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
                  <div className="kgh-stat-number kgh-stat-yellow">{stats.unconfirmed}</div>
                  <div className="kgh-stat-label">Chưa xác nhận</div>
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
                  <div className="kgh-stat-number kgh-stat-purple">{stats.inDelivery}</div>
                  <div className="kgh-stat-label">Đang giao</div>
                </div>
              </div>
            </div>

            {/* Enhanced Filter Section */}
            <div className="kgh-filter-card">
              <div className="kgh-card-header">
                <div className="kgh-filter-header">
                  <h2 className="kgh-section-title">Bộ lọc & Tìm kiếm</h2>
                  <button 
                    onClick={clearFilters}
                    className="kgh-clear-filters-btn"
                  >
                    <span>🧹</span>
                    Xóa bộ lọc
                  </button>
                </div>
              </div>
              <div className="kgh-card-body">
                {/* Search Box */}
                <div className="kgh-search-section">
                  <div className="kgh-search-box">
                    <input
                      type="text"
                      placeholder="Tìm kiếm theo mã đơn hàng, tên cửa hàng..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="kgh-search-input"
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm("")}
                        className="kgh-search-clear"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                {/* Filter Row */}
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

                  <div className="kgh-filter-item">
                    <label className="kgh-label">Trạng thái xác nhận</label>
                    <select
                      className="kgh-select"
                      value={confirmationFilter}
                      onChange={(e) => setConfirmationFilter(e.target.value)}
                    >
                      <option value="all">Tất cả</option>
                      <option value="confirmed">Đã xác nhận</option>
                      <option value="unconfirmed">Chưa xác nhận</option>
                    </select>
                  </div>
                  <div className="kgh-filter-item">
                    <label className="kgh-label">Sắp xếp theo ngày tạo</label>
                    <select
                      className="kgh-select"
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value)}
                    >
                      <option value="desc">Mới nhất</option>
                      <option value="asc">Cũ nhất</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Orders Table */}
            <div className="kgh-orders-card">
              <div className="kgh-card-header">
                <div className="kgh-orders-header">
                  <h2 className="kgh-orders-title">
                    Danh sách đơn hàng ({filteredAndSortedOrders.length}){ordersLoading && <Spinner size="small" />}
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
                      orders={filteredAndSortedOrders}
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