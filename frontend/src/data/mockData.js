// Mock data để mô phỏng API response
export const mockStores = [
    { id: "all", name: "Tất cả cửa hàng" },
    { id: "store1", name: "Cửa hàng Quận 1" },
    { id: "store2", name: "Cửa hàng Quận 3" },
    { id: "store3", name: "Cửa hàng Quận 7" },
    { id: "store4", name: "Cửa hàng Thủ Đức" },
    { id: "store5", name: "Cửa hàng Bình Thạnh" },
  ]
  
  export const mockOrders = [
    {
      id: "DH001",
      orderCode: "DH001",
      targetStore: "Cửa hàng Quận 1",
      storeId: "store1",
      status: "Đang giao",
      isConfirmed: false,
      qrCode: "DH001",
      customerName: "Nguyễn Văn A",
      customerPhone: "0901234567",
      customerAddress: "123 Nguyễn Huệ, Quận 1, TP.HCM",
      orderDate: "2024-01-15",
      deliveryDate: "2024-01-16",
      totalAmount: 250000,
      items: [
        { name: "Áo thun nam", quantity: 2, price: 100000 },
        { name: "Quần jean", quantity: 1, price: 150000 },
      ],
      notes: "Giao hàng trước 5h chiều",
      createdAt: "2024-01-15T08:30:00Z",
    },
    {
      id: "DH002",
      orderCode: "DH002",
      targetStore: "Cửa hàng Quận 3",
      storeId: "store2",
      status: "Chờ xử lý",
      isConfirmed: false,
      qrCode: "DH002",
      customerName: "Trần Thị B",
      customerPhone: "0912345678",
      customerAddress: "456 Võ Văn Tần, Quận 3, TP.HCM",
      orderDate: "2024-01-15",
      deliveryDate: "2024-01-17",
      totalAmount: 180000,
      items: [{ name: "Váy đầm", quantity: 1, price: 180000 }],
      notes: "Khách yêu cầu gọi trước khi giao",
      createdAt: "2024-01-15T09:15:00Z",
    },
    {
      id: "DH003",
      orderCode: "DH003",
      targetStore: "Cửa hàng Quận 7",
      storeId: "store3",
      status: "Đã giao",
      isConfirmed: true,
      qrCode: "DH003",
      customerName: "Lê Văn C",
      customerPhone: "0923456789",
      customerAddress: "789 Nguyễn Thị Thập, Quận 7, TP.HCM",
      orderDate: "2024-01-14",
      deliveryDate: "2024-01-15",
      totalAmount: 320000,
      items: [{ name: "Giày thể thao", quantity: 1, price: 320000 }],
      notes: "Đã giao thành công",
      createdAt: "2024-01-14T10:00:00Z",
    },
    {
      id: "DH004",
      orderCode: "DH004",
      targetStore: "Cửa hàng Thủ Đức",
      storeId: "store4",
      status: "Đang giao",
      isConfirmed: false,
      qrCode: "DH004",
      customerName: "Phạm Thị D",
      customerPhone: "0934567890",
      customerAddress: "321 Võ Văn Ngân, Thủ Đức, TP.HCM",
      orderDate: "2024-01-16",
      deliveryDate: "2024-01-17",
      totalAmount: 450000,
      items: [
        { name: "Áo khoác", quantity: 1, price: 300000 },
        { name: "Túi xách", quantity: 1, price: 150000 },
      ],
      notes: "Giao vào buổi sáng",
      createdAt: "2024-01-16T07:45:00Z",
    },
    {
      id: "DH005",
      orderCode: "DH005",
      targetStore: "Cửa hàng Quận 1",
      storeId: "store1",
      status: "Chờ xử lý",
      isConfirmed: false,
      qrCode: "DH005",
      customerName: "Hoàng Văn E",
      customerPhone: "0945678901",
      customerAddress: "654 Lê Lợi, Quận 1, TP.HCM",
      orderDate: "2024-01-16",
      deliveryDate: "2024-01-18",
      totalAmount: 200000,
      items: [{ name: "Quần short", quantity: 2, price: 100000 }],
      notes: "",
      createdAt: "2024-01-16T11:20:00Z",
    },
    {
      id: "DH006",
      orderCode: "DH006",
      targetStore: "Cửa hàng Bình Thạnh",
      storeId: "store5",
      status: "Đang giao",
      isConfirmed: false,
      qrCode: "DH006",
      customerName: "Ngô Thị F",
      customerPhone: "0956789012",
      customerAddress: "987 Xô Viết Nghệ Tĩnh, Bình Thạnh, TP.HCM",
      orderDate: "2024-01-16",
      deliveryDate: "2024-01-17",
      totalAmount: 380000,
      items: [{ name: "Đầm dạ hội", quantity: 1, price: 380000 }],
      notes: "Hàng dễ vỡ, cẩn thận",
      createdAt: "2024-01-16T13:10:00Z",
    },
  ]
  
  // Mock API functions với delay để mô phỏng network request
  export const mockApiService = {
    // Lấy danh sách cửa hàng
    async getStores() {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            data: mockStores,
          })
        }, 800) // Delay 800ms để mô phỏng network
      })
    },
  
    // Lấy danh sách đơn hàng với filter và pagination
    async getOrders(storeId = "all", page = 1, limit = 10) {
      return new Promise((resolve) => {
        setTimeout(() => {
          let filteredOrders = mockOrders
  
          // Filter theo store
          if (storeId && storeId !== "all") {
            filteredOrders = mockOrders.filter((order) => order.storeId === storeId)
          }
  
          // Pagination
          const startIndex = (page - 1) * limit
          const endIndex = startIndex + limit
          const paginatedOrders = filteredOrders.slice(startIndex, endIndex)
  
          resolve({
            success: true,
            data: paginatedOrders,
            pagination: {
              currentPage: page,
              totalPages: Math.ceil(filteredOrders.length / limit),
              totalItems: filteredOrders.length,
              itemsPerPage: limit,
            },
          })
        }, 1000) // Delay 1s để mô phỏng network
      })
    },
  
    // Lấy chi tiết đơn hàng
    async getOrderDetail(orderId) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const order = mockOrders.find((o) => o.id === orderId)
          if (order) {
            resolve({
              success: true,
              data: order,
            })
          } else {
            reject({
              success: false,
              message: "Không tìm thấy đơn hàng",
            })
          }
        }, 600)
      })
    },
  
    // Xác nhận đơn hàng bằng QR
    async confirmOrder(orderId, qrCode) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const orderIndex = mockOrders.findIndex((o) => o.id === orderId)
  
          if (orderIndex === -1) {
            reject({
              success: false,
              message: "Không tìm thấy đơn hàng",
            })
            return
          }
  
          const order = mockOrders[orderIndex]
  
          if (order.qrCode !== qrCode) {
            reject({
              success: false,
              message: "Mã QR không đúng",
            })
            return
          }
  
          if (order.isConfirmed) {
            reject({
              success: false,
              message: "Đơn hàng đã được xác nhận trước đó",
            })
            return
          }
  
          // Cập nhật trạng thái
          mockOrders[orderIndex] = {
            ...order,
            isConfirmed: true,
            status: "Đã xác nhận",
            confirmedAt: new Date().toISOString(),
          }
  
          resolve({
            success: true,
            message: "Xác nhận đơn hàng thành công",
            data: mockOrders[orderIndex],
          })
        }, 1200) // Delay 1.2s để mô phỏng network
      })
    },
  
    // Cập nhật trạng thái đơn hàng
    async updateOrderStatus(orderId, newStatus) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const orderIndex = mockOrders.findIndex((o) => o.id === orderId)
  
          if (orderIndex === -1) {
            reject({
              success: false,
              message: "Không tìm thấy đơn hàng",
            })
            return
          }
  
          mockOrders[orderIndex] = {
            ...mockOrders[orderIndex],
            status: newStatus,
            updatedAt: new Date().toISOString(),
          }
  
          resolve({
            success: true,
            message: "Cập nhật trạng thái thành công",
            data: mockOrders[orderIndex],
          })
        }, 800)
      })
    },
  }
  