"use client"

import { useState, useEffect } from "react"
import { mockApiService } from "../services/mockApiService"

export const useDeliveryData = () => {
  const [allOrders, setAllOrders] = useState([]) // Lưu toàn bộ dữ liệu
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

  // Pagination info (tính toán từ allOrders)
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

  // Fetch all orders (không phân trang)
  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        setOrdersLoading(true)
        setOrdersError(null)
        console.log(`🔄 Đang tải toàn bộ đơn hàng - Store: ${selectedStore}`)

        // Gọi API để lấy toàn bộ dữ liệu (không truyền currentPage và pageSize)
        const response = await mockApiService.getAllOrders(selectedStore)
        if (response.success) {
          setAllOrders(response.data)
          
          // Tính toán pagination từ toàn bộ dữ liệu
          const totalItems = response.data.length
          const totalPages = Math.ceil(totalItems / pageSize)
          
          setPagination({
            currentPage: 1, // Reset về trang 1 khi thay đổi store
            totalPages,
            totalItems,
            itemsPerPage: pageSize,
          })
          
          setCurrentPage(1) // Reset về trang 1
          
          console.log("✅ Tải toàn bộ đơn hàng thành công:", response.data.length, "đơn hàng")
        }
      } catch (error) {
        console.error("❌ Lỗi khi tải đơn hàng:", error)
        setOrdersError(error.message || "Không thể tải danh sách đơn hàng")
      } finally {
        setOrdersLoading(false)
      }
    }

    fetchAllOrders()
  }, [selectedStore]) // Chỉ fetch lại khi thay đổi store

  // Tính toán orders cho trang hiện tại từ allOrders
  const orders = allOrders.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  // Cập nhật pagination khi currentPage thay đổi
  useEffect(() => {
    const totalItems = allOrders.length
    const totalPages = Math.ceil(totalItems / pageSize)
    
    setPagination({
      currentPage,
      totalPages,
      totalItems,
      itemsPerPage: pageSize,
    })
  }, [currentPage, allOrders, pageSize])

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

      const response = await mockApiService.getAllOrders(selectedStore)
      if (response.success) {
        setAllOrders(response.data)
        
        const totalItems = response.data.length
        const totalPages = Math.ceil(totalItems / pageSize)
        
        setPagination({
          currentPage: 1,
          totalPages,
          totalItems,
          itemsPerPage: pageSize,
        })
        
        setCurrentPage(1)
        
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
    orders, // Dữ liệu của trang hiện tại
    allOrders, // Toàn bộ dữ liệu (để filter)
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
    setOrders: setAllOrders, // Update toàn bộ dữ liệu
  }
}
