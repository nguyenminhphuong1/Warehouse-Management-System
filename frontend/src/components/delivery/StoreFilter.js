"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { stores } from "../data/mockData"
import './StoreFilter.css';

export const StoreFilter = ({ selectedStore, onStoreChange }) => {
  return (
    <Card className="sf-card">
      <CardHeader>
        <CardTitle className="sf-title">Bộ lọc</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="sf-content">
          <div className="sf-select-group">
            <label className="sf-label">Chọn cửa hàng</label>
            <Select value={selectedStore} onValueChange={onStoreChange}>
              <SelectTrigger className="sf-select-trigger">
                <SelectValue placeholder="Chọn cửa hàng" />
              </SelectTrigger>
              <SelectContent>
                {stores.map((store) => (
                  <SelectItem key={store.id} value={store.id}>
                    {store.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
