// Các hàm tiện ích
export const getStatusColor = (status) => {
    switch (status) {
      case "Đã giao":
        return "bg-green-100 text-green-800"
      case "Đang giao":
        return "bg-blue-100 text-blue-800"
      case "Chờ xử lý":
        return "bg-yellow-100 text-yellow-800"
      case "Đã xác nhận":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }
  
  export const filterOrdersByStore = (orders, storeId) => {
    if (storeId === "all") {
      return orders
    }
    return orders.filter((order) => order.storeId === storeId)
  }
  
  export const getOrderStatistics = (orders) => {
    return {
      total: orders.length,
      confirmed: orders.filter((o) => o.isConfirmed).length,
      unconfirmed: orders.filter((o) => !o.isConfirmed).length,
      inDelivery: orders.filter((o) => o.status === "Đang giao").length,
    }
  }
  