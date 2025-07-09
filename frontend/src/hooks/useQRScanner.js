"use client"

import { useState } from "react"
import { mockApiService } from "../services/mockApiService"

export const useQRScanner = (onOrderConfirmed) => {
  const [qrInput, setQrInput] = useState("")
  const [scanningOrderId, setScanningOrderId] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)

  const startScan = (orderId) => {
    setScanningOrderId(orderId)
    setQrInput("")
    setIsDialogOpen(true)
  }

  const confirmQRCode = async () => {
    if (!qrInput.trim()) return

    try {
      setConfirmLoading(true)
      console.log(`🔄 Đang xác nhận đơn hàng ${scanningOrderId} với QR: ${qrInput}`)

      const response = await mockApiService.confirmOrder(scanningOrderId, qrInput)

      if (response.success) {
        console.log("✅ Xác nhận thành công:", response.message)

        // Callback để update parent component
        if (onOrderConfirmed) {
          onOrderConfirmed(scanningOrderId)
        }

        alert(`✅ ${response.message}`)
        closeDialog()
        return { success: true, message: response.message }
      }
    } catch (error) {
      console.error("❌ Lỗi xác nhận:", error)
      alert(`❌ ${error.message}`)
      return { success: false, message: error.message }
    } finally {
      setConfirmLoading(false)
    }
  }

  const closeDialog = () => {
    setIsDialogOpen(false)
    setScanningOrderId(null)
    setQrInput("")
  }

  return {
    qrInput,
    setQrInput,
    scanningOrderId,
    isDialogOpen,
    confirmLoading,
    startScan,
    confirmQRCode,
    closeDialog,
  }
}
