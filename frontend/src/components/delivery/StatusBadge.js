"use client"

import { Badge } from "@/components/ui/badge"
import { getStatusColor } from "../utils/helpers"

export const StatusBadge = ({ status }) => {
  const colorClass = getStatusColor(status)

  return <Badge className={colorClass}>{status}</Badge>
}
