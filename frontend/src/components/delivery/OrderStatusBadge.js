import './OrderStatusBadge.css';

export const OrderStatusBadge = ({ status }) => {
    const statusConfig = {
      "Đã giao": "osb-delivered",
      "Đang giao": "osb-delivering",
      "Chờ xử lý": "osb-pending",
      "Đã xác nhận": "osb-confirmed",
    }
  
    const className = statusConfig[status] || "osb-default"
  
    return (
      <span className={`osb-badge ${className}`}>
        {status}
      </span>
    )
  }
  