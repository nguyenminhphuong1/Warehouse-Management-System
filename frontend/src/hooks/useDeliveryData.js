"use client"

import { useState, useEffect } from "react"
import { mockApiService } from "../services/mockApiService"

export const useDeliveryData = () => {
  // States
  const [orders, setOrders] = useState([])
  const [stores, setStores] = useState([])
  const [selectedStore, setSelectedStore] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(5)

  // Loading states
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [storesLoading, setStoresLoading] = useState(false)

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

  // Fetch stores
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

  // Fetch orders
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

  // Reset page when store changes
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1)
    }
  }, [selectedStore])

  // Handlers
  const handleStoreChange = (storeId) => {
    console.log(`🏪 Thay đổi cửa hàng: ${storeId}`)
    setSelectedStore(storeId)
  }

  const handlePageChange = (page) => {
    console.log(`📄 Thay đổi trang: ${page}`)
    setCurrentPage(page)
  }

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

    // Error states
    ordersError,
    storesError,

    // Actions
    handleStoreChange,
    handlePageChange,
    refreshOrders,
    setOrders, // Để update local state sau khi confirm
  }
}
