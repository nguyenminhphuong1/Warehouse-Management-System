// src/pages/XuatHang/InQRDon.js - In mã QR cho đơn hàng

import React, { useState, useEffect, useRef } from 'react';
import './InQRDon.css';

// Mock QR Code component (trong thực tế sẽ import từ thư viện)
const QRCodeGenerator = ({ value, size = 128, level = 'M' }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      // Simple mock QR code generation
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, size, size);
      
      // Create a simple pattern to simulate QR code
      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < size; i += 8) {
        for (let j = 0; j < size; j += 8) {
          if ((i + j) % 16 === 0) {
            ctx.fillRect(i, j, 6, 6);
          }
        }
      }
      
      // Add some random patterns
      for (let i = 0; i < 50; i++) {
        const x = Math.floor(Math.random() * (size - 4));
        const y = Math.floor(Math.random() * (size - 4));
        ctx.fillStyle = Math.random() > 0.5 ? '#000000' : '#ffffff';
        ctx.fillRect(x, y, 4, 4);
      }
    }
  }, [value, size]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      style={{ border: '1px solid #e5e7eb' }}
    />
  );
};

const InQRDon = ({ orders = [] }) => {
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [printSettings, setPrintSettings] = useState({
    labelSize: 'medium', // small, medium, large
    includeOrderInfo: true,
    includeStoreInfo: true,
    includeQRCode: true,
    includeBarcode: false,
    copiesPerOrder: 1,
    paperSize: 'A4',
    orientation: 'portrait'
  });
  
  const [previewMode, setPreviewMode] = useState('grid'); // grid, list, sheet
  const [isGenerating, setIsGenerating] = useState(false);
  const printRef = useRef(null);

  const labelSizes = [
    { id: 'small', name: 'Nhỏ (5x3 cm)', width: '5cm', height: '3cm', qrSize: 64 },
    { id: 'medium', name: 'Trung bình (7x5 cm)', width: '7cm', height: '5cm', qrSize: 96 },
    { id: 'large', name: 'Lớn (10x7 cm)', width: '10cm', height: '7cm', qrSize: 128 }
  ];

  const paperSizes = [
    { id: 'A4', name: 'A4 (210 x 297 mm)', width: 210, height: 297 },
    { id: 'A5', name: 'A5 (148 x 210 mm)', width: 148, height: 210 },
    { id: 'letter', name: 'Letter (216 x 279 mm)', width: 216, height: 279 }
  ];

  useEffect(() => {
    setSelectedOrders(orders.map(order => order.id));
  }, [orders]);

  const generateQRData = (order) => {
    return JSON.stringify({
      orderCode: order.code,
      orderId: order.id,
      storeName: order.storeName,
      storeAddress: order.storeAddress,
      totalItems: order.totalItems,
      totalQuantity: order.totalQuantity,
      priority: order.priority,
      createdDate: order.createdDate,
      requestedDate: order.requestedDate,
      warehouse: 'WH-001',
      zone: 'A',
      timestamp: new Date().toISOString()
    });
  };

  const generateBarcode = (orderCode) => {
    // Simple barcode generation (mock)
    return orderCode.replace(/[^0-9]/g, '').padEnd(12, '0');
  };

  const handleOrderToggle = (orderId) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectAll = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders.map(order => order.id));
    }
  };

  const handlePrint = async () => {
    setIsGenerating(true);
    
    try {
      // Simulate label generation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Print the preview area
      const printContent = printRef.current;
      const printWindow = window.open('', '_blank');
      
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>In nhãn QR Code - ${selectedOrders.length} đơn hàng</title>
            <style>
              body { 
                margin: 0; 
                padding: 20px; 
                font-family: Arial, sans-serif; 
                background: white;
              }
              .print-container { 
                display: grid; 
                gap: 10px;
              }
              .label-item { 
                border: 1px solid #000; 
                page-break-inside: avoid;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                padding: 8px;
              }
              @media print {
                body { margin: 0; padding: 0; }
                .label-item { margin-bottom: 5mm; }
              }
            </style>
          </head>
          <body>
            ${printContent.innerHTML}
          </body>
        </html>
      `);
      
      printWindow.document.close();
      printWindow.focus();
      
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
      
    } catch (error) {
      console.error('Print failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportPDF = async () => {
    setIsGenerating(true);
    
    try {
      // Simulate PDF generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In thực tế sẽ sử dụng thư viện như jsPDF
      const link = document.createElement('a');
      link.href = '#'; // URL của PDF được generate
      link.download = `QR_Labels_${new Date().toISOString().split('T')[0]}.pdf`;
      link.click();
      
    } catch (error) {
      console.error('PDF export failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const currentLabelSize = labelSizes.find(size => size.id === printSettings.labelSize);
  const selectedOrdersData = orders.filter(order => selectedOrders.includes(order.id));

  const renderLabel = (order, index) => {
    const qrData = generateQRData(order);
    const barcode = generateBarcode(order.code);
    
    return (
      <div 
        key={`${order.id}-${index}`}
        className="label-item"
        style={{
          width: currentLabelSize.width,
          height: currentLabelSize.height,
          minHeight: currentLabelSize.height
        }}
      >
        <div className="label-header">
          {printSettings.includeOrderInfo && (
            <div className="order-code">{order.code}</div>
          )}
          {printSettings.includeStoreInfo && (
            <div className="store-name">{order.storeName}</div>
          )}
        </div>
        
        <div className="label-content">
          <div className="label-left">
            {printSettings.includeQRCode && (
              <div className="qr-section">
                <QRCodeGenerator 
                  value={qrData} 
                  size={currentLabelSize.qrSize}
                />
              </div>
            )}
          </div>
          
          <div className="label-right">
            <div className="order-info">
              <div className="info-item">
                <span className="info-label">SP:</span>
                <span className="info-value">{order.totalItems}</span>
              </div>
              <div className="info-item">
                <span className="info-label">SL:</span>
                <span className="info-value">{order.totalQuantity}</span>
              </div>
              <div className="info-item">
                <span className="info-label">ƯT:</span>
                <span className={`priority-${order.priority}`}>
                  {order.priority === 'high' ? 'Cao' : 
                   order.priority === 'medium' ? 'TB' : 'Thấp'}
                </span>
              </div>
            </div>
            
            {printSettings.includeStoreInfo && (
              <div className="store-address">
                {order.storeAddress.substring(0, 50)}
                {order.storeAddress.length > 50 ? '...' : ''}
              </div>
            )}
          </div>
        </div>
        
        <div className="label-footer">
          <div className="footer-left">
            <div className="date">{new Date().toLocaleDateString('vi-VN')}</div>
          </div>
          
          {printSettings.includeBarcode && (
            <div className="footer-right">
              <div className="barcode">||||| {barcode} |||||</div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="in-qr-don-container">
      {/* Header */}
      <div className="print-header">
        <div className="header-content">
          <h2>In mã QR cho đơn hàng</h2>
          
        </div>
        
        <div className="header-stats">
          <div className="stat-row">
            <div className="stat-item">
              <span className="stat-label">Tổng đơn hàng:</span>
              <span className="stat-value">{orders.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Đã chọn:</span>
              <span className="stat-value">{selectedOrders.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Tổng nhãn:</span>
              <span className="stat-value">{selectedOrders.length * printSettings.copiesPerOrder}</span>
            </div>
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default InQRDon;