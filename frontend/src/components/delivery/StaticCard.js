"use client"

import { Card, CardContent } from "@/components/ui/card"
import { getOrderStatistics } from "../utils/helpers"
import './StaticCard.css';

export const StatisticsCards = ({ orders }) => {
  const stats = getOrderStatistics(orders)

  const statisticsData = [
    {
      value: stats.total,
      label: "Tổng đơn hàng",
      color: "sc-blue",
    },
    {
      value: stats.confirmed,
      label: "Đã xác nhận",
      color: "sc-green",
    },
    {
      value: stats.unconfirmed,
      label: "Chưa xác nhận",
      color: "sc-yellow",
    },
    {
      value: stats.inDelivery,
      label: "Đang giao",
      color: "sc-purple",
    },
  ]

  return (
    <div className="sc-container">
      {statisticsData.map((stat, index) => (
        <Card key={index}>
          <CardContent className="sc-card-content">
            <div className={`sc-value ${stat.color}`}>{stat.value}</div>
            <div className="sc-label">{stat.label}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
