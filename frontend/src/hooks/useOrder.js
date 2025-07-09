"use client"

import { useState, useEffect } from "react"
import { mockApiService } from "../data/mockData"

export const useOrders = () => {
  // States
  const [orders, setOrders] = useState([])
  const [stores, setStores] = useState([])
  const [selectedStore, setSelectedStore] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(5) // Giảm xuống 5 để test pagination

  // Loading states
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [storesLoading, setStoresLoading] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)

  // Error states
  const [ordersError, setOrdersError] = useState(null)
  const [storesError, setStoresError] = useState(null)

  // Pagination info
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 5,
  })

  // Fetch stores khi component mount
  useEffect(() => {
    const fetchStores = async () => {
      try {
        setStoresLoading(true)
        setStoresError(null)

        console.log("🔄 Đang tải danh sách cửa hàng...")
        const response = await mockApiService.getStores()

        if (response.success) {
          setStores(response.data)
          console.log("✅ Tải cửa hàng thành công:", response.data.length, "cửa hàng")
        }
      } catch (error) {
        console.error("❌ Lỗi khi tải cửa hàng:", error)
        setStoresError(error.message || "Không thể tải danh sách cửa hàng")
      } finally {
        setStoresLoading(false)
      }
    }

    fetchStores()
  }, [])

  // Fetch orders khi selectedStore hoặc currentPage thay đổi
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setOrdersLoading(true)
        setOrdersError(null)

        console.log(`🔄 Đang tải đơn hàng - Store: ${selectedStore}, Page: ${currentPage}`)
        const response = await mockApiService.getOrders(selectedStore, currentPage, pageSize)

        if (response.success) {
          setOrders(response.data)
          setPagination(response.pagination)
          console.log("✅ Tải đơn hàng thành công:", response.data.length, "đơn hàng")
          console.log("📊 Pagination:", response.pagination)
        }
      } catch (error) {
        console.error("❌ Lỗi khi tải đơn hàng:", error)
        setOrdersError(error.message || "Không thể tải danh sách đơn hàng")
      } finally {
        setOrdersLoading(false)
      }
    }

    fetchOrders()
  }, [selectedStore, currentPage, pageSize])

  // Reset về trang 1 khi thay đổi store
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1)
    }
  }, [selectedStore])

  // Confirm order function
  const confirmOrder = async (orderId, qrCode) => {
    try {
      setConfirmLoading(true)

      console.log(`🔄 Đang xác nhận đơn hàng ${orderId} với QR: ${qrCode}`)
      const response = await mockApiService.confirmOrder(orderId, qrCode)

      if (response.success) {
        console.log("✅ Xác nhận thành công:", response.message)

        // Cập nhật local state
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, isConfirmed: true, status: "Đã xác nhận" } : order,
          ),
        )

        return { success: true, message: response.message }
      }
    } catch (error) {
      console.error("❌ Lỗi xác nhận:", error)
      return { success: false, message: error.message || "Xác nhận thất bại" }
    } finally {
      setConfirmLoading(false)
    }
  }

  // Refresh orders function
  const refreshOrders = async () => {
    try {
      setOrdersLoading(true)
      setOrdersError(null)

      console.log("🔄 Đang refresh danh sách đơn hàng...")
      const response = await mockApiService.getOrders(selectedStore, currentPage, pageSize)

      if (response.success) {
        setOrders(response.data)
        setPagination(response.pagination)
        console.log("✅ Refresh thành công")
      }
    } catch (error) {
      console.error("❌ Lỗi refresh:", error)
      setOrdersError(error.message || "Không thể refresh danh sách")
    } finally {
      setOrdersLoading(false)
    }
  }

  // Handle store change
  const handleStoreChange = (storeId) => {
    console.log(`🏪 Thay đổi cửa hàng: ${storeId}`)
    setSelectedStore(storeId)
  }

  // Handle page change
  const handlePageChange = (page) => {
    console.log(`📄 Thay đổi trang: ${page}`)
    setCurrentPage(page)
  }

  return {
    // Data
    orders,
    stores,
    pagination,

    // Current states
    selectedStore,
    currentPage,
    pageSize,

    // Loading states
    ordersLoading,
    storesLoading,
    confirmLoading,

    // Error states
    ordersError,
    storesError,

    // Actions
    confirmOrder,
    refreshOrders,
    handleStoreChange,
    handlePageChange,
  }
}
