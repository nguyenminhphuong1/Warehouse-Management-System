// frontend/src/pages/NhapHang/ThemPallet.js

import React, { useState, useEffect } from 'react';
import LocationSelector from '../../components/warehouse/LocationSelector';
import './ThemPallet.css';

const ThemPallet = ({ onSubmit, onCancel, products, suppliers, warehouseAreas, loading }) => {
  const [formData, setFormData] = useState({
    san_pham: '',
    nha_cung_cap: '',
    so_thung_ban_dau: '',
    ngay_san_xuat: '',
    han_su_dung: '',
    ngay_kiem_tra_cl: '',
    lo_san_xuat: '',
    so_phieu_nhap: '',
    trong_luong_thung: '',
    chieu_cao: '150',
    chieu_dai: '120',
    chieu_rong: '80',
    nhiet_do_bao_quan: '',
    do_am_bao_quan: '',
    vi_tri_kho: null,
    ghi_chu: '',
    nguoi_tao: 'admin' // Will be replaced with actual user
  });

  const [errors, setErrors] = useState({});
  const [showLocationSelector, setShowLocationSelector] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [calculatedValues, setCalculatedValues] = useState({
    total_weight: 0,
    total_volume: 0,
    days_until_expiry: 0
  });

  // Auto-calculate values when form data changes
  useEffect(() => {
    const weight = parseFloat(formData.trong_luong_thung) * parseInt(formData.so_thung_ban_dau) || 0;
    const volume = (parseFloat(formData.chieu_dai) * parseFloat(formData.chieu_rong) * parseFloat(formData.chieu_cao)) / 1000000 || 0; // m³
    
    let daysUntilExpiry = 0;
    if (formData.han_su_dung) {
      const today = new Date();
      const expiryDate = new Date(formData.han_su_dung);
      daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
    }

    setCalculatedValues({
      total_weight: weight,
      total_volume: volume,
      days_until_expiry: daysUntilExpiry
    });
  }, [formData.trong_luong_thung, formData.so_thung_ban_dau, formData.chieu_dai, formData.chieu_rong, formData.chieu_cao, formData.han_su_dung]);

  // Auto-calculate quality check date when production date changes
  useEffect(() => {
    if (formData.ngay_san_xuat && selectedProduct) {
      const productionDate = new Date(formData.ngay_san_xuat);
      const checkCycle = selectedProduct.chu_ky_kiem_tra_cl || 30;
      const checkDate = new Date(productionDate);
      checkDate.setDate(checkDate.getDate() + checkCycle);
      
      setFormData(prev => ({
        ...prev,
        ngay_kiem_tra_cl: checkDate.toISOString().split('T')[0]
      }));
    }
  }, [formData.ngay_san_xuat, selectedProduct]);

  // Auto-calculate expiry date when production date changes
  useEffect(() => {
    if (formData.ngay_san_xuat && selectedProduct) {
      const productionDate = new Date(formData.ngay_san_xuat);
      const shelfLife = selectedProduct.han_su_dung_mac_dinh || 365;
      const expiryDate = new Date(productionDate);
      expiryDate.setDate(expiryDate.getDate() + shelfLife);
      
      setFormData(prev => ({
        ...prev,
        han_su_dung: expiryDate.toISOString().split('T')[0]
      }));
    }
  }, [formData.ngay_san_xuat, selectedProduct]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Handle product selection
    if (name === 'san_pham') {
      const product = products.find(p => p.id === parseInt(value));
      setSelectedProduct(product);
      
      // Auto-fill product-related fields
      if (product) {
        setFormData(prev => ({
          ...prev,
          trong_luong_thung: product.trong_luong_thung || '',
          nhiet_do_bao_quan: product.nhiet_do_bao_quan || '',
          do_am_bao_quan: product.do_am_bao_quan || ''
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.san_pham) newErrors.san_pham = 'Vui lòng chọn sản phẩm';
    if (!formData.so_thung_ban_dau) newErrors.so_thung_ban_dau = 'Vui lòng nhập số thùng';
    if (!formData.ngay_san_xuat) newErrors.ngay_san_xuat = 'Vui lòng chọn ngày sản xuất';
    if (!formData.han_su_dung) newErrors.han_su_dung = 'Vui lòng chọn hạn sử dụng';
    if (!formData.vi_tri_kho) newErrors.vi_tri_kho = 'Vui lòng chọn vị trí lưu trữ';

    // Number validation
    if (formData.so_thung_ban_dau && (parseInt(formData.so_thung_ban_dau) <= 0 || parseInt(formData.so_thung_ban_dau) > 1000)) {
      newErrors.so_thung_ban_dau = 'Số thùng phải từ 1 đến 1000';
    }

    if (formData.trong_luong_thung && (parseFloat(formData.trong_luong_thung) <= 0 || parseFloat(formData.trong_luong_thung) > 100)) {
      newErrors.trong_luong_thung = 'Trọng lượng thùng phải từ 0.1 đến 100 kg';
    }

    // Date validation
    const today = new Date();
    const productionDate = new Date(formData.ngay_san_xuat);
    const expiryDate = new Date(formData.han_su_dung);

    if (productionDate > today) {
      newErrors.ngay_san_xuat = 'Ngày sản xuất không được ở tương lai';
    }

    if (expiryDate <= productionDate) {
      newErrors.han_su_dung = 'Hạn sử dụng phải sau ngày sản xuất';
    }

    // Physical dimensions
    const dimensions = ['chieu_cao', 'chieu_dai', 'chieu_rong'];
    dimensions.forEach(dim => {
      if (formData[dim] && (parseFloat(formData[dim]) <= 0 || parseFloat(formData[dim]) > 500)) {
        newErrors[dim] = 'Kích thước phải từ 1 đến 500 cm';
      }
    });

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Find selected product and position details
    const product = products.find(p => p.id === parseInt(formData.san_pham));
    const supplier = suppliers.find(s => s.id === parseInt(formData.nha_cung_cap));

    const palletData = {
      ...formData,
      san_pham: product,
      nha_cung_cap: supplier,
      so_thung_ban_dau: parseInt(formData.so_thung_ban_dau),
      so_thung_con_lai: parseInt(formData.so_thung_ban_dau),
      trong_luong_thung: parseFloat(formData.trong_luong_thung) || 0,
      chieu_cao: parseFloat(formData.chieu_cao) || 0,
      chieu_dai: parseFloat(formData.chieu_dai) || 120,
      chieu_rong: parseFloat(formData.chieu_rong) || 80,
      nhiet_do_bao_quan: formData.nhiet_do_bao_quan ? parseFloat(formData.nhiet_do_bao_quan) : null,
      do_am_bao_quan: formData.do_am_bao_quan ? parseFloat(formData.do_am_bao_quan) : null
    };

    onSubmit(palletData);
  };

  const handleLocationSelect = (position) => {
    setFormData(prev => ({ ...prev, vi_tri_kho: position }));
    setShowLocationSelector(false);
    if (errors.vi_tri_kho) {
      setErrors(prev => ({ ...prev, vi_tri_kho: '' }));
    }
  };

  const getExpiryWarning = () => {
    if (calculatedValues.days_until_expiry <= 0) {
      return { type: 'error', message: 'Hàng đã hết hạn!' };
    } else if (calculatedValues.days_until_expiry <= 30) {
      return { type: 'warning', message: `Sắp hết hạn trong ${calculatedValues.days_until_expiry} ngày` };
    } else if (calculatedValues.days_until_expiry <= 90) {
      return { type: 'info', message: `Còn ${calculatedValues.days_until_expiry} ngày đến hạn` };
    }
    return null;
  };

  const expiryWarning = getExpiryWarning();

  return (
    <div className="them-pallet">
      <div className="form-header">
        <h2>
          <i className="icon-plus-circle"></i>
          Nhập hàng mới
        </h2>
        <p>Tạo pallet mới và phân bổ vị trí lưu trữ trong kho</p>
      </div>

      <form onSubmit={handleSubmit} className="pallet-form">
        {/* Product Information */}
        <div className="form-section">
          <h3>
            <i className="icon-package"></i>
            Thông tin sản phẩm
          </h3>
          
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="san_pham">Sản phẩm *</label>
              <select
                id="san_pham"
                name="san_pham"
                value={formData.san_pham}
                onChange={handleInputChange}
                className={errors.san_pham ? 'error' : ''}
                required
              >
                <option value="">-- Chọn sản phẩm --</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.ten_san_pham} ({product.ma_san_pham})
                  </option>
                ))}
              </select>
              {errors.san_pham && <span className="error-message">{errors.san_pham}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="nha_cung_cap">Nhà cung cấp</label>
              <select
                id="nha_cung_cap"
                name="nha_cung_cap"
                value={formData.nha_cung_cap}
                onChange={handleInputChange}
              >
                <option value="">-- Chọn nhà cung cấp --</option>
                {suppliers.map(supplier => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.ten_nha_cung_cap}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="so_thung_ban_dau">Số thùng *</label>
              <input
                type="number"
                id="so_thung_ban_dau"
                name="so_thung_ban_dau"
                value={formData.so_thung_ban_dau}
                onChange={handleInputChange}
                min="1"
                max="1000"
                className={errors.so_thung_ban_dau ? 'error' : ''}
                required
              />
              {errors.so_thung_ban_dau && <span className="error-message">{errors.so_thung_ban_dau}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="trong_luong_thung">Trọng lượng/thùng (kg)</label>
              <input
                type="number"
                id="trong_luong_thung"
                name="trong_luong_thung"
                value={formData.trong_luong_thung}
                onChange={handleInputChange}
                step="0.1"
                min="0.1"
                max="100"
                className={errors.trong_luong_thung ? 'error' : ''}
              />
              {errors.trong_luong_thung && <span className="error-message">{errors.trong_luong_thung}</span>}
            </div>
          </div>
        </div>

        {/* Date Information */}
        <div className="form-section">
          <h3>
            <i className="icon-calendar"></i>
            Thông tin ngày tháng
          </h3>
          
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="ngay_san_xuat">Ngày sản xuất *</label>
              <input
                type="date"
                id="ngay_san_xuat"
                name="ngay_san_xuat"
                value={formData.ngay_san_xuat}
                onChange={handleInputChange}
                max={new Date().toISOString().split('T')[0]}
                className={errors.ngay_san_xuat ? 'error' : ''}
                required
              />
              {errors.ngay_san_xuat && <span className="error-message">{errors.ngay_san_xuat}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="han_su_dung">Hạn sử dụng *</label>
              <input
                type="date"
                id="han_su_dung"
                name="han_su_dung"
                value={formData.han_su_dung}
                onChange={handleInputChange}
                className={errors.han_su_dung ? 'error' : ''}
                required
              />
              {errors.han_su_dung && <span className="error-message">{errors.han_su_dung}</span>}
              {expiryWarning && (
                <span className={`warning-message ${expiryWarning.type}`}>
                  <i className={`icon-${expiryWarning.type === 'error' ? 'alert-circle' : expiryWarning.type === 'warning' ? 'alert-triangle' : 'info'}`}></i>
                  {expiryWarning.message}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="ngay_kiem_tra_cl">Ngày kiểm tra CL</label>
              <input
                type="date"
                id="ngay_kiem_tra_cl"
                name="ngay_kiem_tra_cl"
                value={formData.ngay_kiem_tra_cl}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        {/* Physical Information */}
        <div className="form-section">
          <h3>
            <i className="icon-box"></i>
            Thông tin vật lý
          </h3>
          
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="chieu_dai">Chiều dài (cm)</label>
              <input
                type="number"
                id="chieu_dai"
                name="chieu_dai"
                value={formData.chieu_dai}
                onChange={handleInputChange}
                step="0.1"
                min="1"
                max="500"
                className={errors.chieu_dai ? 'error' : ''}
              />
              {errors.chieu_dai && <span className="error-message">{errors.chieu_dai}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="chieu_rong">Chiều rộng (cm)</label>
              <input
                type="number"
                id="chieu_rong"
                name="chieu_rong"
                value={formData.chieu_rong}
                onChange={handleInputChange}
                step="0.1"
                min="1"
                max="500"
                className={errors.chieu_rong ? 'error' : ''}
              />
              {errors.chieu_rong && <span className="error-message">{errors.chieu_rong}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="chieu_cao">Chiều cao (cm)</label>
              <input
                type="number"
                id="chieu_cao"
                name="chieu_cao"
                value={formData.chieu_cao}
                onChange={handleInputChange}
                step="0.1"
                min="1"
                max="500"
                className={errors.chieu_cao ? 'error' : ''}
              />
              {errors.chieu_cao && <span className="error-message">{errors.chieu_cao}</span>}
            </div>

            <div className="form-group">
              <label>Tổng trọng lượng</label>
              <div className="calculated-value">
                {calculatedValues.total_weight.toFixed(1)} kg
              </div>
            </div>

            <div className="form-group">
              <label>Thể tích</label>
              <div className="calculated-value">
                {calculatedValues.total_volume.toFixed(3)} m³
              </div>
            </div>
          </div>
        </div>

        {/* Storage Conditions */}
        <div className="form-section">
          <h3>
            <i className="icon-thermometer"></i>
            Điều kiện bảo quản
          </h3>
          
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="nhiet_do_bao_quan">Nhiệt độ (°C)</label>
              <input
                type="number"
                id="nhiet_do_bao_quan"
                name="nhiet_do_bao_quan"
                value={formData.nhiet_do_bao_quan}
                onChange={handleInputChange}
                step="0.1"
                min="-20"
                max="50"
              />
            </div>

            <div className="form-group">
              <label htmlFor="do_am_bao_quan">Độ ẩm (%)</label>
              <input
                type="number"
                id="do_am_bao_quan"
                name="do_am_bao_quan"
                value={formData.do_am_bao_quan}
                onChange={handleInputChange}
                step="0.1"
                min="0"
                max="100"
              />
            </div>
          </div>
        </div>

        {/* Position Selection */}
        <div className="form-section">
          <h3>
            <i className="icon-map-pin"></i>
            Vị trí lưu trữ
          </h3>
          
          <div className="position-selection">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowLocationSelector(true)}
            >
              <i className="icon-map"></i>
              {formData.vi_tri_kho ? `Đã chọn: ${formData.vi_tri_kho.ma_vi_tri}` : 'Chọn vị trí kho'}
            </button>
            
            {formData.vi_tri_kho && (
              <div className="selected-position">
                <div className="position-info">
                  <strong>{formData.vi_tri_kho.ma_vi_tri}</strong>
                  <span>{formData.vi_tri_kho.khu_vuc_ten}</span>
                  <span>Tải trọng tối đa: {formData.vi_tri_kho.tai_trong_max} kg</span>
                </div>
                <button
                  type="button"
                  className="btn btn-sm btn-danger"
                  onClick={() => setFormData(prev => ({ ...prev, vi_tri_kho: null }))}
                >
                  <i className="icon-x"></i>
                  Bỏ chọn
                </button>
              </div>
            )}
            
            {errors.vi_tri_kho && <span className="error-message">{errors.vi_tri_kho}</span>}
          </div>
        </div>

        {/* Additional Information */}
        <div className="form-section">
          <h3>
            <i className="icon-file-text"></i>
            Thông tin bổ sung
          </h3>
          
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="lo_san_xuat">Lô sản xuất</label>
              <input
                type="text"
                id="lo_san_xuat"
                name="lo_san_xuat"
                value={formData.lo_san_xuat}
                onChange={handleInputChange}
                maxLength="50"
                placeholder="Nhập mã lô sản xuất"
              />
            </div>

            <div className="form-group">
              <label htmlFor="so_phieu_nhap">Số phiếu nhập</label>
              <input
                type="text"
                id="so_phieu_nhap"
                name="so_phieu_nhap"
                value={formData.so_phieu_nhap}
                onChange={handleInputChange}
                maxLength="50"
                placeholder="Nhập số phiếu nhập kho"
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="ghi_chu">Ghi chú</label>
              <textarea
                id="ghi_chu"
                name="ghi_chu"
                value={formData.ghi_chu}
                onChange={handleInputChange}
                rows="3"
                maxLength="500"
                placeholder="Nhập ghi chú về pallet (tối đa 500 ký tự)"
              />
              <small>{formData.ghi_chu.length}/500</small>
            </div>
          </div>
        </div>

        {/* Summary */}
        {(calculatedValues.total_weight > 0 || calculatedValues.total_volume > 0) && (
          <div className="form-section summary-section">
            <h3>
              <i className="icon-info"></i>
              Tóm tắt pallet
            </h3>
            
            <div className="summary-grid">
              <div className="summary-item">
                <label>Sản phẩm:</label>
                <span>{selectedProduct?.ten_san_pham || 'Chưa chọn'}</span>
              </div>
              
              <div className="summary-item">
                <label>Số lượng:</label>
                <span>{formData.so_thung_ban_dau} thùng</span>
              </div>
              
              <div className="summary-item">
                <label>Tổng trọng lượng:</label>
                <span>{calculatedValues.total_weight.toFixed(1)} kg</span>
              </div>
              
              <div className="summary-item">
                <label>Thể tích:</label>
                <span>{calculatedValues.total_volume.toFixed(3)} m³</span>
              </div>
              
              <div className="summary-item">
                <label>Vị trí:</label>
                <span>{formData.vi_tri_kho?.ma_vi_tri || 'Chưa chọn'}</span>
              </div>
              
              <div className="summary-item">
                <label>Hạn sử dụng:</label>
                <span>
                  {formData.han_su_dung ? 
                    new Date(formData.han_su_dung).toLocaleDateString('vi-VN') : 
                    'Chưa chọn'
                  }
                  {expiryWarning && (
                    <span className={`status-badge ${expiryWarning.type}`}>
                      {expiryWarning.type === 'error' ? 'Hết hạn' : 
                       expiryWarning.type === 'warning' ? 'Sắp hết hạn' : 'Bình thường'}
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={loading}
          >
            <i className="icon-x"></i>
            Hủy
          </button>
          
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || Object.keys(errors).length > 0}
          >
            {loading ? (
              <>
                <i className="icon-loader spinning"></i>
                Đang tạo...
              </>
            ) : (
              <>
                <i className="icon-check"></i>
                Tạo pallet
              </>
            )}
          </button>
        </div>
      </form>

      {/* Location Selector Modal */}
      {showLocationSelector && (
        <LocationSelector
          areas={warehouseAreas}
          onSelect={handleLocationSelect}
          onClose={() => setShowLocationSelector(false)}
          selectedProduct={selectedProduct}
          palletWeight={calculatedValues.total_weight}
          palletVolume={calculatedValues.total_volume}
        />
      )}
    </div>
  );
};

export default ThemPallet;