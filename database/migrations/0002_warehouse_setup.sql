CREATE INDEX idx_tinh_trang_hang_pallet ON tinh_trang_hang(pallet_id);
CREATE INDEX idx_tinh_trang_hang_loai_tinh_trang ON tinh_trang_hang(loai_tinh_trang);
CREATE INDEX idx_tinh_trang_hang_trang_thai ON tinh_trang_hang(trang_thai);
CREATE INDEX idx_tinh_trang_hang_ngay_phat_hien ON tinh_trang_hang(ngay_phat_hien);
CREATE INDEX idx_kiem_ke_ma_kiem_ke ON kiem_ke(ma_kiem_ke);
CREATE INDEX idx_kiem_ke_loai_kiem_ke ON kiem_ke(loai_kiem_ke);
CREATE INDEX idx_kiem_ke_trang_thai ON kiem_ke(trang_thai);
CREATE INDEX idx_kiem_ke_ngay_kiem_ke ON kiem_ke(ngay_kiem_ke);
CREATE INDEX idx_chi_tiet_kiem_ke_kiem_ke ON chi_tiet_kiem_ke(kiem_ke_id);
CREATE INDEX idx_chi_tiet_kiem_ke_pallet ON chi_tiet_kiem_ke(pallet_id);
CREATE INDEX idx_bao_tri_ma_bao_tri ON bao_tri(ma_bao_tri);
CREATE INDEX idx_bao_tri_loai_bao_tri ON bao_tri(loai_bao_tri);
CREATE INDEX idx_bao_tri_trang_thai ON bao_tri(trang_thai);
CREATE INDEX idx_bao_tri_muc_do_uu_tien ON bao_tri(muc_do_uu_tien);
CREATE INDEX idx_bao_tri_doi_tuong ON bao_tri(doi_tuong, doi_tuong_id);
CREATE INDEX idx_lich_su_xuat_nhap_pallet ON lich_su_xuat_nhap(pallet_id);
CREATE INDEX idx_lich_su_xuat_nhap_loai_giao_dich ON lich_su_xuat_nhap(loai_giao_dich);
CREATE INDEX idx_lich_su_xuat_nhap_ngay_thuc_hien ON lich_su_xuat_nhap(ngay_thuc_hien);
CREATE INDEX idx_log_kiem_tra_don_hang_id ON log_kiem_tra(don_hang_id);
CREATE INDEX idx_log_kiem_tra_ngay_kiem_tra ON log_kiem_tra(ngay_kiem_tra);
CREATE INDEX idx_log_kiem_tra_ket_qua ON log_kiem_tra(ket_qua);

-- ==================================
-- 9. INITIAL DATA
-- ==================================

-- Insert default system settings
INSERT INTO cai_dat_he_thong (khoa_cai_dat, gia_tri, mo_ta, nhom_cai_dat, kieu_du_lieu) VALUES
('canh_bao_het_han_truoc', '7', 'Cảnh báo trước bao nhiêu ngày khi hàng hết hạn', 'Cảnh_báo', 'number'),
('canh_bao_ton_kho_thap', '10', 'Cảnh báo khi tồn kho dưới ngưỡng (thùng)', 'Cảnh_báo', 'number'),
('chu_ky_kiem_ke_tu_dong', '30', 'Chu kỳ kiểm kê tự động (ngày)', 'Kiểm_kê', 'number'),
('ty_le_su_dung_kho_toi_da', '85', 'Tỷ lệ sử dụng kho tối đa (%)', 'Kho', 'number'),
('thoi_gian_lam_viec_bat_dau', '07:00', 'Giờ bắt đầu ca làm việc', 'Thời_gian', 'string'),
('thoi_gian_lam_viec_ket_thuc', '18:00', 'Giờ kết thúc ca làm việc', 'Thời_gian', 'string'),
('qr_code_version', '1', 'Phiên bản QR code', 'QR_Code', 'number'),
('qr_code_error_correction', 'M', 'Mức độ sửa lỗi QR code', 'QR_Code', 'string'),
('max_login_attempts', '5', 'Số lần đăng nhập sai tối đa', 'Bảo_mật', 'number'),
('account_lockout_duration', '30', 'Thời gian khóa tài khoản (phút)', 'Bảo_mật', 'number'),
('session_timeout', '480', 'Thời gian timeout session (phút)', 'Bảo_mật', 'number'),
('password_expiry_days', '90', 'Số ngày hết hạn mật khẩu', 'Bảo_mật', 'number'),
('enable_email_notifications', 'true', 'Bật thông báo email', 'Thông_báo', 'boolean'),
('enable_sms_notifications', 'false', 'Bật thông báo SMS', 'Thông_báo', 'boolean'),
('backup_retention_days', '30', 'Số ngày lưu trữ backup', 'Hệ_thống', 'number'),
('log_retention_days', '365', 'Số ngày lưu trữ log', 'Hệ_thống', 'number');

-- Insert default product groups
INSERT INTO nhom_hang (ma_nhom, ten_nhom, mo_ta, icon, mau_sac, yeu_cau_nhiet_do_min, yeu_cau_nhiet_do_max, yeu_cau_do_am_min, yeu_cau_do_am_max, tranh_anh_sang, tranh_rung_dong, hang_de_vo, hang_nguy_hiem, thu_tu_hien_thi, trang_thai) VALUES
('BIA', 'Bia', 'Các loại bia và đồ uống có cồn', '🍺', '#ffc107', 2, 8, 50, 70, false, false, true, false, 1, 'Hoạt_động'),
('NUOC_NGOT', 'Nước ngọt', 'Nước ngọt các loại', '🥤', '#28a745', 5, 25, 40, 80, false, false, false, false, 2, 'Hoạt_động'),
('NUOC_SUOI', 'Nước suối', 'Nước tinh khiết, nước suối', '💧', '#17a2b8', 10, 30, 30, 90, false, false, false, false, 3, 'Hoạt_động'),
('NUOC_HOA_QUA', 'Nước hoa quả', 'Nước ép hoa quả, sinh tố', '🧃', '#fd7e14', 2, 10, 45, 75, true, false, false, false, 4, 'Hoạt_động'),
('THUC_PHAM', 'Thực phẩm', 'Các loại thực phẩm khô', '🥫', '#6f42c1', -5, 25, 30, 70, false, false, false, false, 5, 'Hoạt_động'),
('HOA_CHAT', 'Hóa chất', 'Hóa chất công nghiệp, vệ sinh', '⚗️', '#dc3545', 5, 35, 20, 60, true, true, false, true, 6, 'Hoạt_động');

-- Insert default warehouse areas
INSERT INTO khu_vuc (ma_khu_vuc, ten_khu_vuc, mo_ta, kich_thuoc_hang, kich_thuoc_cot, tai_trong_max, nhiet_do_min, nhiet_do_max, do_am_min, do_am_max, trang_thai) VALUES
('A', 'Khu vực A - Bia & Nước ngọt', 'Khu vực chính dành cho bia và nước ngọt', 5, 10, 2000, 2, 25, 40, 80, 'Hoạt_động'),
('B', 'Khu vực B - Nước suối', 'Khu vực dành cho nước suối và nước tinh khiết', 4, 8, 1500, 10, 30, 30, 90, 'Hoạt_động'),
('C', 'Khu vực C - Hàng đặc biệt', 'Khu vực lạnh cho hàng có yêu cầu nhiệt độ thấp', 3, 6, 1000, -5, 10, 45, 75, 'Hoạt_động'),
('D', 'Khu vực D - Hóa chất', 'Khu vực cách ly cho hóa chất và hàng nguy hiểm', 2, 4, 800, 5, 35, 20, 60, 'Hoạt_động');

-- Insert default roles
INSERT INTO roles (name, code, role_type, description, is_active, is_system_role, priority) VALUES
('System Administrator', 'SYSTEM_ADMIN', 'admin', 'Quản trị viên hệ thống - toàn quyền', true, true, 1000),
('Warehouse Manager', 'WAREHOUSE_MANAGER', 'manager', 'Quản lý kho - quyền quản lý toàn bộ kho', true, true, 900),
('Warehouse Supervisor', 'WAREHOUSE_SUPERVISOR', 'supervisor', 'Giám sát kho - quyền giám sát và kiểm tra', true, true, 800),
('Import Staff', 'IMPORT_STAFF', 'staff', 'Nhân viên nhập hàng - chỉ module nhập hàng', true, true, 700),
('Export Staff', 'EXPORT_STAFF', 'staff', 'Nhân viên xuất hàng - module tạo đơn và xuất hàng', true, true, 700),
('Quality Control', 'QUALITY_CONTROL', 'quality', 'Kiểm tra chất lượng - module kiểm tra và báo cáo', true, true, 600),
('Delivery Staff', 'DELIVERY_STAFF', 'delivery', 'Nhân viên giao hàng - chỉ module kiểm tra giao hàng', true, true, 500),
('Viewer Only', 'VIEWER_ONLY', 'viewer', 'Chỉ xem - quyền xem tất cả module', true, true, 100);

-- Insert default admin user (password: admin123)
INSERT INTO users (username, email, first_name, last_name, user_type, status, is_staff, is_superuser, password, employee_id) VALUES
('admin', 'admin@warehouse.com', 'System', 'Administrator', 'admin', 'active', true, true, 'pbkdf2_sha256$320000$xyz$hashedpassword', 'EMP001');

-- Insert system admin role permissions (full access to all modules)
INSERT INTO module_permissions (role_id, module, action, is_granted) VALUES
((SELECT id FROM roles WHERE code = 'SYSTEM_ADMIN'), 'nhap_hang', 'full_access', true),
((SELECT id FROM roles WHERE code = 'SYSTEM_ADMIN'), 'tao_don', 'full_access', true),
((SELECT id FROM roles WHERE code = 'SYSTEM_ADMIN'), 'xuat_hang', 'full_access', true),
((SELECT id FROM roles WHERE code = 'SYSTEM_ADMIN'), 'quan_ly_kho', 'full_access', true),
((SELECT id FROM roles WHERE code = 'SYSTEM_ADMIN'), 'kiem_tra_giao_hang', 'full_access', true),
((SELECT id FROM roles WHERE code = 'SYSTEM_ADMIN'), 'admin_panel', 'full_access', true),
((SELECT id FROM roles WHERE code = 'SYSTEM_ADMIN'), 'reports', 'full_access', true),
((SELECT id FROM roles WHERE code = 'SYSTEM_ADMIN'), 'settings', 'full_access', true),
((SELECT id FROM roles WHERE code = 'SYSTEM_ADMIN'), 'user_management', 'full_access', true),
((SELECT id FROM roles WHERE code = 'SYSTEM_ADMIN'), 'role_management', 'full_access', true);

-- Insert warehouse manager permissions
INSERT INTO module_permissions (role_id, module, action, is_granted) VALUES
((SELECT id FROM roles WHERE code = 'WAREHOUSE_MANAGER'), 'nhap_hang', 'full_access', true),
((SELECT id FROM roles WHERE code = 'WAREHOUSE_MANAGER'), 'tao_don', 'full_access', true),
((SELECT id FROM roles WHERE code = 'WAREHOUSE_MANAGER'), 'xuat_hang', 'full_access', true),
((SELECT id FROM roles WHERE code = 'WAREHOUSE_MANAGER'), 'quan_ly_kho', 'full_access', true),
((SELECT id FROM roles WHERE code = 'WAREHOUSE_MANAGER'), 'kiem_tra_giao_hang', 'view', true),
((SELECT id FROM roles WHERE code = 'WAREHOUSE_MANAGER'), 'reports', 'full_access', true),
((SELECT id FROM roles WHERE code = 'WAREHOUSE_MANAGER'), 'user_management', 'view', true),
((SELECT id FROM roles WHERE code = 'WAREHOUSE_MANAGER'), 'user_management', 'create', true),
((SELECT id FROM roles WHERE code = 'WAREHOUSE_MANAGER'), 'user_management', 'edit', true);

-- Insert import staff permissions (Module 1 only)
INSERT INTO module_permissions (role_id, module, action, is_granted) VALUES
((SELECT id FROM roles WHERE code = 'IMPORT_STAFF'), 'nhap_hang', 'view', true),
((SELECT id FROM roles WHERE code = 'IMPORT_STAFF'), 'nhap_hang', 'create', true),
((SELECT id FROM roles WHERE code = 'IMPORT_STAFF'), 'nhap_hang', 'edit', true),
((SELECT id FROM roles WHERE code = 'IMPORT_STAFF'), 'nhap_hang', 'print', true),
((SELECT id FROM roles WHERE code = 'IMPORT_STAFF'), 'quan_ly_kho', 'view', true);

-- Insert export staff permissions (Module 2 & 3)
INSERT INTO module_permissions (role_id, module, action, is_granted) VALUES
((SELECT id FROM roles WHERE code = 'EXPORT_STAFF'), 'tao_don', 'view', true),
((SELECT id FROM roles WHERE code = 'EXPORT_STAFF'), 'tao_don', 'create', true),
((SELECT id FROM roles WHERE code = 'EXPORT_STAFF'), 'tao_don', 'edit', true),
((SELECT id FROM roles WHERE code = 'EXPORT_STAFF'), 'xuat_hang', 'view', true),
((SELECT id FROM roles WHERE code = 'EXPORT_STAFF'), 'xuat_hang', 'create', true),
((SELECT id FROM roles WHERE code = 'EXPORT_STAFF'), 'xuat_hang', 'edit', true),
((SELECT id FROM roles WHERE code = 'EXPORT_STAFF'), 'xuat_hang', 'print', true),
((SELECT id FROM roles WHERE code = 'EXPORT_STAFF'), 'quan_ly_kho', 'view', true);

-- Insert delivery staff permissions (Module 5 only)
INSERT INTO module_permissions (role_id, module, action, is_granted) VALUES
((SELECT id FROM roles WHERE code = 'DELIVERY_STAFF'), 'kiem_tra_giao_hang', 'view', true),
((SELECT id FROM roles WHERE code = 'DELIVERY_STAFF'), 'kiem_tra_giao_hang', 'create', true);

-- Insert quality control permissions (Module 4 subset)
INSERT INTO module_permissions (role_id, module, action, is_granted) VALUES
((SELECT id FROM roles WHERE code = 'QUALITY_CONTROL'), 'quan_ly_kho', 'view', true),
((SELECT id FROM roles WHERE code = 'QUALITY_CONTROL'), 'quan_ly_kho', 'edit', true),
((SELECT id FROM roles WHERE code = 'QUALITY_CONTROL'), 'reports', 'view', true),
((SELECT id FROM roles WHERE code = 'QUALITY_CONTROL'), 'reports', 'export', true);

-- Insert viewer only permissions (view all modules)
INSERT INTO module_permissions (role_id, module, action, is_granted) VALUES
((SELECT id FROM roles WHERE code = 'VIEWER_ONLY'), 'nhap_hang', 'view', true),
((SELECT id FROM roles WHERE code = 'VIEWER_ONLY'), 'tao_don', 'view', true),
((SELECT id FROM roles WHERE code = 'VIEWER_ONLY'), 'xuat_hang', 'view', true),
((SELECT id FROM roles WHERE code = 'VIEWER_ONLY'), 'quan_ly_kho', 'view', true),
((SELECT id FROM roles WHERE code = 'VIEWER_ONLY'), 'kiem_tra_giao_hang', 'view', true),
((SELECT id FROM roles WHERE code = 'VIEWER_ONLY'), 'reports', 'view', true);

-- Assign admin user to system admin role
INSERT INTO user_roles (user_id, role_id, assigned_by_id, reason) VALUES
((SELECT id FROM users WHERE username = 'admin'), (SELECT id FROM roles WHERE code = 'SYSTEM_ADMIN'), (SELECT id FROM users WHERE username = 'admin'), 'Initial system setup');

-- Insert sample stores
INSERT INTO cua_hang (ma_cua_hang, ten_cua_hang, dia_chi, so_dien_thoai, khu_vuc, trang_thai) VALUES
('CH001', 'Cửa hàng Quận 1', '123 Nguyễn Huệ, Quận 1, TP.HCM', '0901234567', 'Quận 1', 'Hoạt_động'),
('CH002', 'Cửa hàng Quận 3', '456 Lê Văn Sỹ, Quận 3, TP.HCM', '0901234568', 'Quận 3', 'Hoạt_động'),
('CH003', 'Cửa hàng Thủ Đức', '789 Võ Văn Ngân, Thủ Đức, TP.HCM', '0901234569', 'Thủ Đức', 'Hoạt_động'),
('CH004', 'Cửa hàng Bình Thạnh', '321 Xô Viết Nghệ Tĩnh, Bình Thạnh, TP.HCM', '0901234570', 'Bình Thạnh', 'Hoạt_động'),
('CH005', 'Cửa hàng Tân Bình', '654 Cộng Hòa, Tân Bình, TP.HCM', '0901234571', 'Tân Bình', 'Hoạt_động');

-- Insert sample suppliers
INSERT INTO nha_cung_cap (ma_nha_cung_cap, ten_nha_cung_cap, dia_chi, so_dien_thoai, email, nguoi_lien_he, so_dien_thoai_lien_he, email_lien_he, ma_so_thue, loai_hang_cung_cap, xep_hang, trang_thai) VALUES
('NCC001', 'Công ty TNHH Heineken Việt Nam', 'KCN Biên Hòa, Đồng Nai', '02513123456', 'info@heineken.vn', 'Nguyễn Văn A', '0901111111', 'sales@heineken.vn', '0123456789', '["Bia"]', 'A', 'Hoạt_động'),
('NCC002', 'Công ty Coca-Cola Việt Nam', 'KCN Tân Thuận, TP.HCM', '02838123456', 'info@coca-cola.vn', 'Trần Thị B', '0902222222', 'sales@coca-cola.vn', '0987654321', '["Nước ngọt"]', 'A', 'Hoạt_động'),
('NCC003', 'Công ty Lavie', 'KCN Long Thành, Đồng Nai', '02513654789', 'info@lavie.vn', 'Lê Văn C', '0903333333', 'sales@lavie.vn', '0456789123', '["Nước suối"]', 'B', 'Hoạt_động'),
('NCC004', 'Công ty TH True Milk', 'Nghệ An', '02383456789', 'info@thmilk.vn', 'Phạm Thị D', '0904444444', 'sales@thmilk.vn', '0789123456', '["Nước hoa quả", "Thực phẩm"]', 'A', 'Hoạt_động');

-- Insert sample products
INSERT INTO san_pham (ma_san_pham, ten_san_pham, nhom_hang_id, thuong_hieu, dung_tich, don_vi_tinh, so_luong_per_thung, ma_vach, nha_cung_cap, han_su_dung_mac_dinh, chu_ky_kiem_tra_cl, mo_ta, trang_thai) VALUES
('SP001', 'Heineken 330ml', (SELECT id FROM nhom_hang WHERE ma_nhom = 'BIA'), 'Heineken', 330, 'thùng', 24, '8934822101234', 'NCC001', 365, 60, 'Bia Heineken lon 330ml, thùng 24 lon', 'Hoạt_động'),
('SP002', 'Tiger Crystal 355ml', (SELECT id FROM nhom_hang WHERE ma_nhom = 'BIA'), 'Tiger', 355, 'thùng', 24, '8934822105678', 'NCC001', 365, 60, 'Bia Tiger Crystal lon 355ml, thùng 24 lon', 'Hoạt_động'),
('SP003', 'Coca Cola 330ml', (SELECT id FROM nhom_hang WHERE ma_nhom = 'NUOC_NGOT'), 'Coca-Cola', 330, 'thùng', 24, '8934567891234', 'NCC002', 270, 45, 'Nước ngọt Coca Cola lon 330ml, thùng 24 lon', 'Hoạt_động'),
('SP004', 'Pepsi 355ml', (SELECT id FROM nhom_hang WHERE ma_nhom = 'NUOC_NGOT'), 'Pepsi', 355, 'thùng', 24, '8934567895678', 'NCC002', 270, 45, 'Nước ngọt Pepsi lon 355ml, thùng 24 lon', 'Hoạt_động'),
('SP005', 'Lavie 500ml', (SELECT id FROM nhom_hang WHERE ma_nhom = 'NUOC_SUOI'), 'Lavie', 500, 'thùng', 24, '8935049012345', 'NCC003', 730, 90, 'Nước suối Lavie chai 500ml, thùng 24 chai', 'Hoạt_động'),
('SP006', 'Aquafina 1.5L', (SELECT id FROM nhom_hang WHERE ma_nhom = 'NUOC_SUOI'), 'Aquafina', 1500, 'thùng', 12, '8935049067890', 'NCC002', 730, 90, 'Nước tinh khiết Aquafina chai 1.5L, thùng 12 chai', 'Hoạt_động'),
('SP007', 'TH True Orange 1L', (SELECT id FROM nhom_hang WHERE ma_nhom = 'NUOC_HOA_QUA'), 'TH', 1000, 'thùng', 12, '8936139012345', 'NCC004', 180, 30, 'Nước cam ép TH True Orange hộp 1L, thùng 12 hộp', 'Hoạt_động');

-- ==================================
-- 10. TRIGGERS FOR AUDIT AND AUTOMATION
-- ==================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$ LANGUAGE plpgsql;

-- Apply timestamp triggers to tables that need it
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_roles_updated_at BEFORE UPDATE ON roles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_module_permissions_updated_at BEFORE UPDATE ON module_permissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_khu_vuc_updated_at BEFORE UPDATE ON khu_vuc FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vi_tri_kho_updated_at BEFORE UPDATE ON vi_tri_kho FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_san_pham_updated_at BEFORE UPDATE ON san_pham FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pallets_updated_at BEFORE UPDATE ON pallets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_nha_cung_cap_updated_at BEFORE UPDATE ON nha_cung_cap FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tinh_trang_hang_updated_at BEFORE UPDATE ON tinh_trang_hang FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_kiem_ke_updated_at BEFORE UPDATE ON kiem_ke FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bao_tri_updated_at BEFORE UPDATE ON bao_tri FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cai_dat_he_thong_updated_at BEFORE UPDATE ON cai_dat_he_thong FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically update position status when pallet is assigned/removed
CREATE OR REPLACE FUNCTION sync_position_pallet_status()
RETURNS TRIGGER AS $
BEGIN
    -- When pallet is assigned to position
    IF NEW.pallet_id IS NOT NULL AND (OLD.pallet_id IS NULL OR OLD.pallet_id != NEW.pallet_id) THEN
        NEW.trang_thai = 'Có_hàng';
    END IF;
    
    -- When pallet is removed from position
    IF NEW.pallet_id IS NULL AND OLD.pallet_id IS NOT NULL THEN
        NEW.trang_thai = 'Trống';
    END IF;
    
    RETURN NEW;
END;
$ LANGUAGE plpgsql;

CREATE TRIGGER sync_vi_tri_kho_pallet_status 
    BEFORE UPDATE ON vi_tri_kho 
    FOR EACH ROW 
    EXECUTE FUNCTION sync_position_pallet_status();

-- Function to automatically update pallet status based on quantity
CREATE OR REPLACE FUNCTION update_pallet_status_on_quantity_change()
RETURNS TRIGGER AS $
BEGIN
    -- Auto update status based on remaining quantity
    IF NEW.so_thung_con_lai = 0 THEN
        NEW.trang_thai = 'Trống';
    ELSIF NEW.so_thung_con_lai < NEW.so_thung_ban_dau AND OLD.trang_thai = 'Mới' THEN
        NEW.trang_thai = 'Đã_mở';
    END IF;
    
    RETURN NEW;
END;
$ LANGUAGE plpgsql;

CREATE TRIGGER update_pallet_status_trigger
    BEFORE UPDATE ON pallets
    FOR EACH ROW
    EXECUTE FUNCTION update_pallet_status_on_quantity_change();

-- ==================================
-- 11. VIEWS FOR COMMON QUERIES
-- ==================================

-- View for warehouse utilization
CREATE VIEW view_warehouse_utilization AS
SELECT 
    kv.ma_khu_vuc,
    kv.ten_khu_vuc,
    kv.kich_thuoc_hang * kv.kich_thuoc_cot as tong_vi_tri,
    COUNT(CASE WHEN vt.trang_thai = 'Có_hàng' THEN 1 END) as vi_tri_co_hang,
    COUNT(CASE WHEN vt.trang_thai = 'Trống' THEN 1 END) as vi_tri_trong,
    COUNT(CASE WHEN vt.trang_thai = 'Bảo_trì' THEN 1 END) as vi_tri_bao_tri,
    ROUND(
        (COUNT(CASE WHEN vt.trang_thai = 'Có_hàng' THEN 1 END)::DECIMAL / 
         GREATEST(kv.kich_thuoc_hang * kv.kich_thuoc_cot, 1)) * 100, 2
    ) as ty_le_su_dung
FROM khu_vuc kv
LEFT JOIN vi_tri_kho vt ON kv.id = vt.khu_vuc_id
WHERE kv.trang_thai = 'Hoạt_động'
GROUP BY kv.id, kv.ma_khu_vuc, kv.ten_khu_vuc, kv.kich_thuoc_hang, kv.kich_thuoc_cot;

-- View for expiring products
CREATE VIEW view_expiring_products AS
SELECT 
    p.ma_pallet,
    sp.ten_san_pham,
    p.so_thung_con_lai,
    p.han_su_dung,
    vt.ma_vi_tri,
    kv.ten_khu_vuc,
    (p.han_su_dung - CURRENT_DATE) as ngay_con_lai,
            CASE 
        WHEN p.han_su_dung < CURRENT_DATE THEN 'Đã hết hạn'
        WHEN p.han_su_dung <= CURRENT_DATE + INTERVAL '7 days' THEN 'Sắp hết hạn'
        WHEN p.han_su_dung <= CURRENT_DATE + INTERVAL '30 days' THEN 'Cần theo dõi'
        ELSE 'Bình thường'
    END as trang_thai_han_su_dung
FROM pallets p
JOIN san_pham sp ON p.san_pham_id = sp.id
LEFT JOIN vi_tri_kho vt ON p.vi_tri_kho_id = vt.id
LEFT JOIN khu_vuc kv ON vt.khu_vuc_id = kv.id
WHERE p.so_thung_con_lai > 0 
    AND p.trang_thai NOT IN ('Trống', 'Hỏng')
    AND p.han_su_dung <= CURRENT_DATE + INTERVAL '30 days'
ORDER BY p.han_su_dung ASC;

-- View for quality check schedule
CREATE VIEW view_quality_check_schedule AS
SELECT 
    p.ma_pallet,
    sp.ten_san_pham,
    p.so_thung_con_lai,
    p.ngay_kiem_tra_cl,
    vt.ma_vi_tri,
    kv.ten_khu_vuc,
    (p.ngay_kiem_tra_cl - CURRENT_DATE) as ngay_con_lai_kiem_tra,
    CASE 
        WHEN p.ngay_kiem_tra_cl < CURRENT_DATE THEN 'Quá hạn kiểm tra'
        WHEN p.ngay_kiem_tra_cl = CURRENT_DATE THEN 'Cần kiểm tra hôm nay'
        WHEN p.ngay_kiem_tra_cl <= CURRENT_DATE + INTERVAL '3 days' THEN 'Sắp đến hạn'
        ELSE 'Chưa đến hạn'
    END as trang_thai_kiem_tra
FROM pallets p
JOIN san_pham sp ON p.san_pham_id = sp.id
LEFT JOIN vi_tri_kho vt ON p.vi_tri_kho_id = vt.id
LEFT JOIN khu_vuc kv ON vt.khu_vuc_id = kv.id
WHERE p.so_thung_con_lai > 0 
    AND p.trang_thai NOT IN ('Trống', 'Hỏng')
    AND p.ngay_kiem_tra_cl <= CURRENT_DATE + INTERVAL '7 days'
ORDER BY p.ngay_kiem_tra_cl ASC;

-- View for inventory summary
CREATE VIEW view_inventory_summary AS
SELECT 
    sp.ma_san_pham,
    sp.ten_san_pham,
    nh.ten_nhom,
    COUNT(p.id) as tong_pallet,
    SUM(p.so_thung_ban_dau) as tong_so_thung_nhap,
    SUM(p.so_thung_con_lai) as tong_so_thung_con_lai,
    SUM(p.so_thung_ban_dau - p.so_thung_con_lai) as tong_so_thung_da_xuat,
    COUNT(CASE WHEN p.trang_thai = 'Mới' THEN 1 END) as pallet_moi,
    COUNT(CASE WHEN p.trang_thai = 'Đã_mở' THEN 1 END) as pallet_da_mo,
    COUNT(CASE WHEN p.han_su_dung <= CURRENT_DATE + INTERVAL '7 days' AND p.han_su_dung > CURRENT_DATE THEN 1 END) as pallet_sap_het_han,
    COUNT(CASE WHEN p.han_su_dung <= CURRENT_DATE THEN 1 END) as pallet_het_han,
    ROUND(
        (SUM(p.so_thung_con_lai)::DECIMAL / GREATEST(SUM(p.so_thung_ban_dau), 1)) * 100, 2
    ) as ty_le_ton_kho
FROM san_pham sp
JOIN nhom_hang nh ON sp.nhom_hang_id = nh.id
LEFT JOIN pallets p ON sp.id = p.san_pham_id AND p.so_thung_con_lai > 0
WHERE sp.trang_thai = 'Hoạt_động'
GROUP BY sp.id, sp.ma_san_pham, sp.ten_san_pham, nh.ten_nhom
ORDER BY sp.ten_san_pham;

-- View for order fulfillment details
CREATE VIEW view_order_fulfillment AS
SELECT 
    dx.ma_don,
    ch.ten_cua_hang,
    dx.ngay_tao,
    dx.trang_thai as trang_thai_don,
    COUNT(ctd.id) as tong_san_pham,
    SUM(ctd.so_luong_can) as tong_so_luong_can,
    SUM(ctd.so_luong_da_xuat) as tong_so_luong_da_xuat,
    ROUND(
        (SUM(ctd.so_luong_da_xuat)::DECIMAL / GREATEST(SUM(ctd.so_luong_can), 1)) * 100, 2
    ) as ty_le_hoan_thanh,
    COUNT(CASE WHEN ctd.da_xuat_xong = true THEN 1 END) as san_pham_hoan_thanh,
    (COUNT(ctd.id) - COUNT(CASE WHEN ctd.da_xuat_xong = true THEN 1 END)) as san_pham_con_lai
FROM don_xuat dx
JOIN cua_hang ch ON dx.cua_hang_id = ch.id
LEFT JOIN chi_tiet_don ctd ON dx.id = ctd.don_xuat_id
GROUP BY dx.id, dx.ma_don, ch.ten_cua_hang, dx.ngay_tao, dx.trang_thai
ORDER BY dx.ngay_tao DESC;

-- View for maintenance schedule
CREATE VIEW view_maintenance_schedule AS
SELECT 
    bt.ma_bao_tri,
    bt.tieu_de,
    bt.loai_bao_tri,
    bt.doi_tuong,
    CASE 
        WHEN bt.doi_tuong = 'Khu_vực' THEN 
            (SELECT kv.ten_khu_vuc FROM khu_vuc kv WHERE kv.id::text = bt.doi_tuong_id)
        WHEN bt.doi_tuong = 'Vị_trí' THEN 
            (SELECT vt.ma_vi_tri FROM vi_tri_kho vt WHERE vt.id::text = bt.doi_tuong_id)
        ELSE bt.doi_tuong_id
    END as ten_doi_tuong,
    bt.muc_do_uu_tien,
    bt.trang_thai,
    bt.thoi_gian_bat_dau,
    bt.thoi_gian_ket_thuc,
    bt.thoi_gian_uoc_tinh,
    bt.chi_phi_uoc_tinh,
    bt.chi_phi_thuc_te,
    bt.nguoi_tao,
    CASE 
        WHEN bt.trang_thai = 'Kế_hoạch' AND bt.thoi_gian_bat_dau <= NOW() THEN 'Quá hạn bắt đầu'
        WHEN bt.trang_thai = 'Đang_thực_hiện' AND bt.thoi_gian_ket_thuc <= NOW() THEN 'Quá hạn hoàn thành'
        WHEN bt.trang_thai = 'Kế_hoạch' AND bt.thoi_gian_bat_dau <= NOW() + INTERVAL '1 day' THEN 'Sắp đến hạn'
        ELSE 'Bình thường'
    END as canh_bao_tien_do
FROM bao_tri bt
WHERE bt.trang_thai IN ('Kế_hoạch', 'Đang_thực_hiện', 'Tạm_dừng')
ORDER BY 
    CASE bt.muc_do_uu_tien 
        WHEN 'Khẩn_cấp' THEN 1 
        WHEN 'Cao' THEN 2 
        WHEN 'Vừa' THEN 3 
        WHEN 'Thấp' THEN 4 
    END,
    bt.thoi_gian_bat_dau;

-- View for user permissions summary
CREATE VIEW view_user_permissions AS
SELECT 
    u.username,
    u.email,
    u.get_full_name as full_name,
    u.user_type,
    u.status,
    u.last_login,
    ARRAY_AGG(DISTINCT r.name) as roles,
    ARRAY_AGG(DISTINCT mp.module) as accessible_modules,
    COUNT(DISTINCT ur.role_id) as total_roles,
    COUNT(DISTINCT mp.module) as total_modules
FROM users u
LEFT JOIN user_roles ur ON u.id = ur.user_id AND ur.is_active = true
LEFT JOIN roles r ON ur.role_id = r.id AND r.is_active = true
LEFT JOIN module_permissions mp ON r.id = mp.role_id AND mp.is_granted = true
WHERE u.is_active = true
GROUP BY u.id, u.username, u.email, u.get_full_name, u.user_type, u.status, u.last_login
ORDER BY u.username;

-- ==================================
-- 12. STORED PROCEDURES FOR COMMON OPERATIONS
-- ==================================

-- Procedure to auto-assign pallets to orders (FIFO logic)
CREATE OR REPLACE FUNCTION sp_auto_assign_pallets(
    p_don_xuat_id INTEGER,
    p_san_pham_id INTEGER,
    p_so_luong_can INTEGER
)
RETURNS JSON AS $
DECLARE
    pallet_record RECORD;
    remaining_quantity INTEGER := p_so_luong_can;
    assigned_pallets JSON := '[]'::JSON;
    assignment RECORD;
BEGIN
    -- Get available pallets for the product, ordered by FIFO priority
    FOR pallet_record IN 
        SELECT 
            p.id,
            p.ma_pallet,
            p.so_thung_con_lai,
            p.han_su_dung,
            p.ngay_san_xuat,
            vt.ma_vi_tri,
            -- Calculate FIFO priority
            CASE 
                WHEN p.han_su_dung < CURRENT_DATE THEN -1000
                WHEN p.han_su_dung <= CURRENT_DATE + INTERVAL '7 days' THEN -100 - (7 - (p.han_su_dung - CURRENT_DATE))
                ELSE EXTRACT(days FROM (CURRENT_DATE - p.ngay_san_xuat))
            END as fifo_priority
        FROM pallets p
        LEFT JOIN vi_tri_kho vt ON p.vi_tri_kho_id = vt.id
        WHERE p.san_pham_id = p_san_pham_id
            AND p.so_thung_con_lai > 0
            AND p.trang_thai NOT IN ('Trống', 'Hỏng', 'Cách_ly')
        ORDER BY fifo_priority ASC, p.ngay_san_xuat ASC
    LOOP
        EXIT WHEN remaining_quantity <= 0;
        
        -- Calculate quantity to take from this pallet
        assignment.pallet_id := pallet_record.id;
        assignment.ma_pallet := pallet_record.ma_pallet;
        assignment.vi_tri := pallet_record.ma_vi_tri;
        assignment.so_luong_co_san := pallet_record.so_thung_con_lai;
        assignment.so_luong_lay := LEAST(remaining_quantity, pallet_record.so_thung_con_lai);
        assignment.han_su_dung := pallet_record.han_su_dung;
        
        -- Add to assignment list
        assigned_pallets := assigned_pallets || jsonb_build_object(
            'pallet_id', assignment.pallet_id,
            'ma_pallet', assignment.ma_pallet,
            'vi_tri', assignment.vi_tri,
            'so_luong_co_san', assignment.so_luong_co_san,
            'so_luong_lay', assignment.so_luong_lay,
            'han_su_dung', assignment.han_su_dung
        );
        
        remaining_quantity := remaining_quantity - assignment.so_luong_lay;
    END LOOP;
    
    -- Update the order detail with assignments
    UPDATE chi_tiet_don 
    SET pallet_assignments = assigned_pallets
    WHERE don_xuat_id = p_don_xuat_id AND san_pham_id = p_san_pham_id;
    
    RETURN jsonb_build_object(
        'success', remaining_quantity = 0,
        'assigned_quantity', p_so_luong_can - remaining_quantity,
        'remaining_quantity', remaining_quantity,
        'assignments', assigned_pallets
    );
END;
$ LANGUAGE plpgsql;

-- Procedure to execute pallet export
CREATE OR REPLACE FUNCTION sp_execute_pallet_export(
    p_pallet_id INTEGER,
    p_so_luong INTEGER,
    p_don_xuat_id INTEGER DEFAULT NULL,
    p_nguoi_xuat VARCHAR(50) DEFAULT 'System'
)
RETURNS JSON AS $
DECLARE
    pallet_info RECORD;
    result JSON;
BEGIN
    -- Get pallet information
    SELECT * INTO pallet_info FROM pallets WHERE id = p_pallet_id;
    
    -- Check if pallet exists
    IF pallet_info IS NULL THEN
        RETURN jsonb_build_object('success', false, 'message', 'Pallet không tồn tại');
    END IF;
    
    -- Check if enough quantity available
    IF pallet_info.so_thung_con_lai < p_so_luong THEN
        RETURN jsonb_build_object(
            'success', false, 
            'message', 'Không đủ hàng (còn ' || pallet_info.so_thung_con_lai || ' thùng)'
        );
    END IF;
    
    -- Check if pallet is exportable
    IF pallet_info.trang_thai IN ('Trống', 'Hỏng') THEN
        RETURN jsonb_build_object(
            'success', false, 
            'message', 'Pallet đang ở trạng thái ' || pallet_info.trang_thai
        );
    END IF;
    
    -- Check expiry
    IF pallet_info.han_su_dung < CURRENT_DATE THEN
        RETURN jsonb_build_object(
            'success', false, 
            'message', 'Hàng đã hết hạn sử dụng'
        );
    END IF;
    
    -- Execute export
    UPDATE pallets 
    SET 
        so_thung_con_lai = so_thung_con_lai - p_so_luong,
        trang_thai = CASE 
            WHEN (so_thung_con_lai - p_so_luong) = 0 THEN 'Trống'
            WHEN trang_thai = 'Mới' THEN 'Đã_mở'
            ELSE trang_thai
        END,
        updated_at = NOW()
    WHERE id = p_pallet_id;
    
    -- Log the transaction
    INSERT INTO lich_su_xuat_nhap (
        pallet_id, loai_giao_dich, so_luong, don_xuat_id, 
        nguoi_thuc_hien, ngay_thuc_hien, ghi_chu
    ) VALUES (
        p_pallet_id, 'Xuất', p_so_luong, p_don_xuat_id,
        p_nguoi_xuat, NOW(),
        'Xuất ' || p_so_luong || ' thùng - còn ' || (pallet_info.so_thung_con_lai - p_so_luong) || '/' || pallet_info.so_thung_ban_dau
    );
    
    -- If pallet is empty, remove from position
    IF (pallet_info.so_thung_con_lai - p_so_luong) = 0 AND pallet_info.vi_tri_kho_id IS NOT NULL THEN
        UPDATE vi_tri_kho 
        SET pallet_id = NULL, trang_thai = 'Trống' 
        WHERE id = pallet_info.vi_tri_kho_id;
        
        UPDATE pallets 
        SET vi_tri_kho_id = NULL 
        WHERE id = p_pallet_id;
    END IF;
    
    RETURN jsonb_build_object(
        'success', true,
        'message', 'Xuất hàng thành công',
        'exported_quantity', p_so_luong,
        'remaining_quantity', pallet_info.so_thung_con_lai - p_so_luong
    );
END;
$ LANGUAGE plpgsql;

-- Procedure to generate warehouse statistics
CREATE OR REPLACE FUNCTION sp_generate_warehouse_stats(
    p_from_date DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
    p_to_date DATE DEFAULT CURRENT_DATE
)
RETURNS JSON AS $
DECLARE
    stats JSON;
BEGIN
    SELECT jsonb_build_object(
        'period', jsonb_build_object(
            'from_date', p_from_date,
            'to_date', p_to_date
        ),
        'warehouse_utilization', (
            SELECT jsonb_agg(
                jsonb_build_object(
                    'khu_vuc', ma_khu_vuc,
                    'ten_khu_vuc', ten_khu_vuc,
                    'tong_vi_tri', tong_vi_tri,
                    'vi_tri_co_hang', vi_tri_co_hang,
                    'vi_tri_trong', vi_tri_trong,
                    'ty_le_su_dung', ty_le_su_dung
                )
            )
            FROM view_warehouse_utilization
        ),
        'inventory_summary', (
            SELECT jsonb_build_object(
                'total_products', COUNT(*),
                'total_pallets', SUM(tong_pallet),
                'total_boxes_in_stock', SUM(tong_so_thung_con_lai),
                'products_with_stock', COUNT(CASE WHEN tong_so_thung_con_lai > 0 THEN 1 END),
                'products_out_of_stock', COUNT(CASE WHEN tong_so_thung_con_lai = 0 THEN 1 END)
            )
            FROM view_inventory_summary
        ),
        'expiry_alerts', (
            SELECT jsonb_build_object(
                'expired_pallets', COUNT(CASE WHEN trang_thai_han_su_dung = 'Đã hết hạn' THEN 1 END),
                'expiring_soon', COUNT(CASE WHEN trang_thai_han_su_dung = 'Sắp hết hạn' THEN 1 END),
                'need_monitoring', COUNT(CASE WHEN trang_thai_han_su_dung = 'Cần theo dõi' THEN 1 END)
            )
            FROM view_expiring_products
        ),
        'quality_check_alerts', (
            SELECT jsonb_build_object(
                'overdue_checks', COUNT(CASE WHEN trang_thai_kiem_tra = 'Quá hạn kiểm tra' THEN 1 END),
                'due_today', COUNT(CASE WHEN trang_thai_kiem_tra = 'Cần kiểm tra hôm nay' THEN 1 END),
                'due_soon', COUNT(CASE WHEN trang_thai_kiem_tra = 'Sắp đến hạn' THEN 1 END)
            )
            FROM view_quality_check_schedule
        ),
        'recent_activities', (
            SELECT jsonb_agg(
                jsonb_build_object(
                    'ngay_thuc_hien', ngay_thuc_hien,
                    'loai_giao_dich', loai_giao_dich,
                    'so_luong', so_luong,
                    'nguoi_thuc_hien', nguoi_thuc_hien,
                    'ghi_chu', ghi_chu
                )
            )
            FROM (
                SELECT * FROM lich_su_xuat_nhap 
                WHERE ngay_thuc_hien::date BETWEEN p_from_date AND p_to_date
                ORDER BY ngay_thuc_hien DESC 
                LIMIT 50
            ) recent
        )
    ) INTO stats;
    
    RETURN stats;
END;
$ LANGUAGE plpgsql;

-- ==================================
-- 13. COMPLETION MESSAGE
-- ==================================

-- Insert completion log
INSERT INTO permission_audit_logs (
    action_type, user_id, success, notes, timestamp
) VALUES (
    'system_setup', 
    (SELECT id FROM users WHERE username = 'admin'), 
    true, 
    'Database schema initialized successfully with all tables, indexes, triggers, views, and sample data', 
    NOW()
);

-- Final message
DO $
BEGIN
    RAISE NOTICE '==================================================';
    RAISE NOTICE 'WAREHOUSE MANAGEMENT SYSTEM DATABASE INITIALIZED';
    RAISE NOTICE '==================================================';
    RAISE NOTICE 'Tables created: % tables', (
        SELECT COUNT(*) FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    );
    RAISE NOTICE 'Views created: % views', (
        SELECT COUNT(*) FROM information_schema.views 
        WHERE table_schema = 'public'
    );
    RAISE NOTICE 'Indexes created: % indexes', (
        SELECT COUNT(*) FROM pg_indexes 
        WHERE schemaname = 'public'
    );
    RAISE NOTICE 'Sample data inserted: Ready for testing';
    RAISE NOTICE '';
    RAISE NOTICE 'DEFAULT ADMIN ACCOUNT:';
    RAISE NOTICE 'Username: admin';
    RAISE NOTICE 'Password: admin123 (CHANGE IMMEDIATELY)';
    RAISE NOTICE 'Email: admin@warehouse.com';
    RAISE NOTICE '';
    RAISE NOTICE 'NEXT STEPS:';
    RAISE NOTICE '1. Change admin password';
    RAISE NOTICE '2. Create warehouse positions using sp_create_warehouse_positions()';
    RAISE NOTICE '3. Configure system settings as needed';
    RAISE NOTICE '4. Create additional users and assign roles';
    RAISE NOTICE '5. Import your product catalog';
    RAISE NOTICE '==================================================';
END $;    success BOOLEAN NOT NULL DEFAULT TRUE,
    error_message TEXT NOT NULL DEFAULT '',
    ip_address INET,
    user_agent TEXT NOT NULL DEFAULT '',
    request_data JSONB NOT NULL DEFAULT '{}',
    response_data JSONB NOT NULL DEFAULT '{}',
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    notes TEXT NOT NULL DEFAULT '',
    
    CONSTRAINT permission_audit_logs_action_type_check CHECK (action_type IN ('grant_permission', 'revoke_permission', 'assign_role', 'remove_role', 'create_role', 'update_role', 'delete_role', 'login_attempt', 'access_denied', 'module_access', 'action_performed'))
);

-- ==================================
-- 2. WAREHOUSE STRUCTURE
-- ==================================

-- Warehouse areas table
CREATE TABLE khu_vuc (
    id SERIAL PRIMARY KEY,
    ma_khu_vuc VARCHAR(10) UNIQUE NOT NULL,
    ten_khu_vuc VARCHAR(100) NOT NULL,
    mo_ta TEXT NOT NULL DEFAULT '',
    kich_thuoc_hang INTEGER NOT NULL CHECK (kich_thuoc_hang > 0 AND kich_thuoc_hang <= 50),
    kich_thuoc_cot INTEGER NOT NULL CHECK (kich_thuoc_cot > 0 AND kich_thuoc_cot <= 50),
    tai_trong_max DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (tai_trong_max >= 0),
    nhiet_do_min DECIMAL(5,2) NOT NULL DEFAULT 0,
    nhiet_do_max DECIMAL(5,2) NOT NULL DEFAULT 40,
    do_am_min DECIMAL(5,2) NOT NULL DEFAULT 0 CHECK (do_am_min >= 0 AND do_am_min <= 100),
    do_am_max DECIMAL(5,2) NOT NULL DEFAULT 100 CHECK (do_am_max >= 0 AND do_am_max <= 100),
    trang_thai VARCHAR(20) NOT NULL DEFAULT 'Hoạt_động',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    CONSTRAINT khu_vuc_trang_thai_check CHECK (trang_thai IN ('Hoạt_động', 'Bảo_trì', 'Ngừng')),
    CONSTRAINT khu_vuc_nhiet_do_check CHECK (nhiet_do_min < nhiet_do_max),
    CONSTRAINT khu_vuc_do_am_check CHECK (do_am_min < do_am_max)
);

-- Product groups table
CREATE TABLE nhom_hang (
    id SERIAL PRIMARY KEY,
    ma_nhom VARCHAR(20) UNIQUE NOT NULL,
    ten_nhom VARCHAR(100) NOT NULL,
    mo_ta TEXT NOT NULL DEFAULT '',
    icon VARCHAR(50) NOT NULL DEFAULT '',
    mau_sac VARCHAR(7) NOT NULL DEFAULT '#007bff',
    yeu_cau_nhiet_do_min DECIMAL(5,2),
    yeu_cau_nhiet_do_max DECIMAL(5,2),
    yeu_cau_do_am_min DECIMAL(5,2),
    yeu_cau_do_am_max DECIMAL(5,2),
    tranh_anh_sang BOOLEAN NOT NULL DEFAULT FALSE,
    tranh_rung_dong BOOLEAN NOT NULL DEFAULT FALSE,
    hang_de_vo BOOLEAN NOT NULL DEFAULT FALSE,
    hang_nguy_hiem BOOLEAN NOT NULL DEFAULT FALSE,
    thu_tu_hien_thi INTEGER NOT NULL DEFAULT 0,
    trang_thai VARCHAR(20) NOT NULL DEFAULT 'Hoạt_động',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    CONSTRAINT nhom_hang_trang_thai_check CHECK (trang_thai IN ('Hoạt_động', 'Ngừng'))
);

-- Suppliers table
CREATE TABLE nha_cung_cap (
    id SERIAL PRIMARY KEY,
    ma_nha_cung_cap VARCHAR(20) UNIQUE NOT NULL,
    ten_nha_cung_cap VARCHAR(200) NOT NULL,
    dia_chi TEXT NOT NULL DEFAULT '',
    so_dien_thoai VARCHAR(20) NOT NULL DEFAULT '',
    email VARCHAR(100) NOT NULL DEFAULT '',
    nguoi_lien_he VARCHAR(100) NOT NULL DEFAULT '',
    so_dien_thoai_lien_he VARCHAR(20) NOT NULL DEFAULT '',
    email_lien_he VARCHAR(100) NOT NULL DEFAULT '',
    ma_so_thue VARCHAR(50) NOT NULL DEFAULT '',
    loai_hang_cung_cap JSONB NOT NULL DEFAULT '[]',
    xep_hang VARCHAR(1) NOT NULL DEFAULT 'B',
    trang_thai VARCHAR(20) NOT NULL DEFAULT 'Hoạt_động',
    ghi_chu TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    CONSTRAINT nha_cung_cap_xep_hang_check CHECK (xep_hang IN ('A', 'B', 'C', 'D')),
    CONSTRAINT nha_cung_cap_trang_thai_check CHECK (trang_thai IN ('Hoạt_động', 'Tạm_dừng', 'Ngừng'))
);

-- Products table
CREATE TABLE san_pham (
    id SERIAL PRIMARY KEY,
    ma_san_pham VARCHAR(50) UNIQUE NOT NULL,
    ten_san_pham VARCHAR(100) NOT NULL,
    nhom_hang_id INTEGER NOT NULL,
    thuong_hieu VARCHAR(100) NOT NULL DEFAULT '',
    dung_tich DECIMAL(10,2),
    don_vi_tinh VARCHAR(20) NOT NULL DEFAULT 'thùng',
    so_luong_per_thung INTEGER NOT NULL DEFAULT 1,
    ma_vach VARCHAR(100) NOT NULL DEFAULT '',
    nha_cung_cap VARCHAR(100) NOT NULL DEFAULT '',
    han_su_dung_mac_dinh INTEGER NOT NULL DEFAULT 365,
    chu_ky_kiem_tra_cl INTEGER NOT NULL DEFAULT 30,
    hinh_anh VARCHAR(255) NOT NULL DEFAULT '',
    mo_ta TEXT NOT NULL DEFAULT '',
    trang_thai VARCHAR(20) NOT NULL DEFAULT 'Hoạt_động',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    CONSTRAINT san_pham_trang_thai_check CHECK (trang_thai IN ('Hoạt_động', 'Ngừng'))
);

-- Warehouse positions table
CREATE TABLE vi_tri_kho (
    id SERIAL PRIMARY KEY,
    ma_vi_tri VARCHAR(10) UNIQUE NOT NULL,
    khu_vuc_id INTEGER NOT NULL,
    hang CHAR(1) NOT NULL,
    cot INTEGER NOT NULL CHECK (cot > 0),
    loai_vi_tri VARCHAR(10) NOT NULL DEFAULT 'Pallet',
    tai_trong_max DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (tai_trong_max >= 0),
    chieu_cao_max DECIMAL(8,2) NOT NULL DEFAULT 0 CHECK (chieu_cao_max >= 0),
    trang_thai VARCHAR(20) NOT NULL DEFAULT 'Trống',
    pallet_id INTEGER,
    uu_tien_fifo BOOLEAN NOT NULL DEFAULT TRUE,
    gan_cua_ra BOOLEAN NOT NULL DEFAULT FALSE,
    vi_tri_cach_ly BOOLEAN NOT NULL DEFAULT FALSE,
    ghi_chu TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    CONSTRAINT vi_tri_kho_loai_vi_tri_check CHECK (loai_vi_tri IN ('Pallet', 'Carton', 'Bulk')),
    CONSTRAINT vi_tri_kho_trang_thai_check CHECK (trang_thai IN ('Trống', 'Có_hàng', 'Bảo_trì', 'Hỏng')),
    UNIQUE(khu_vuc_id, hang, cot)
);

-- Pallets table
CREATE TABLE pallets (
    id SERIAL PRIMARY KEY,
    ma_pallet VARCHAR(20) UNIQUE NOT NULL,
    san_pham_id INTEGER NOT NULL,
    nha_cung_cap_id INTEGER,
    so_thung_ban_dau INTEGER NOT NULL CHECK (so_thung_ban_dau > 0),
    so_thung_con_lai INTEGER NOT NULL CHECK (so_thung_con_lai >= 0),
    vi_tri_kho_id INTEGER,
    ngay_san_xuat DATE NOT NULL,
    han_su_dung DATE NOT NULL,
    ngay_nhap_kho TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    ngay_kiem_tra_cl DATE NOT NULL,
    trong_luong_thung DECIMAL(8,2) NOT NULL DEFAULT 0 CHECK (trong_luong_thung >= 0),
    chieu_cao DECIMAL(8,2) NOT NULL DEFAULT 0 CHECK (chieu_cao >= 0),
    chieu_dai DECIMAL(8,2) NOT NULL DEFAULT 120 CHECK (chieu_dai >= 0),
    chieu_rong DECIMAL(8,2) NOT NULL DEFAULT 80 CHECK (chieu_rong >= 0),
    trang_thai VARCHAR(20) NOT NULL DEFAULT 'Mới',
    lo_san_xuat VARCHAR(50) NOT NULL DEFAULT '',
    so_phieu_nhap VARCHAR(50) NOT NULL DEFAULT '',
    nhiet_do_bao_quan DECIMAL(5,2),
    do_am_bao_quan DECIMAL(5,2),
    qr_code VARCHAR(100),
    nguoi_tao VARCHAR(50) NOT NULL,
    ghi_chu TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    CONSTRAINT pallets_trang_thai_check CHECK (trang_thai IN ('Mới', 'Đã_mở', 'Trống', 'Hỏng', 'Cách_ly', 'Chờ_xuất')),
    CONSTRAINT pallets_so_thung_check CHECK (so_thung_con_lai <= so_thung_ban_dau),
    CONSTRAINT pallets_han_su_dung_check CHECK (han_su_dung > ngay_san_xuat)
);

-- ==================================
-- 3. ORDERS & STORES
-- ==================================

-- Stores table
CREATE TABLE cua_hang (
    id SERIAL PRIMARY KEY,
    ma_cua_hang VARCHAR(20) UNIQUE NOT NULL,
    ten_cua_hang VARCHAR(100) NOT NULL,
    dia_chi TEXT NOT NULL,
    so_dien_thoai VARCHAR(15) NOT NULL DEFAULT '',
    khu_vuc VARCHAR(50) NOT NULL DEFAULT '',
    trang_thai VARCHAR(20) NOT NULL DEFAULT 'Hoạt_động',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    CONSTRAINT cua_hang_trang_thai_check CHECK (trang_thai IN ('Hoạt_động', 'Tạm_dừng'))
);

-- Export orders table
CREATE TABLE don_xuat (
    id SERIAL PRIMARY KEY,
    ma_don VARCHAR(20) UNIQUE NOT NULL,
    cua_hang_id INTEGER NOT NULL,
    ngay_tao DATE NOT NULL DEFAULT CURRENT_DATE,
    ngay_giao DATE,
    trang_thai VARCHAR(20) NOT NULL DEFAULT 'Chờ_xuất',
    qr_code_data TEXT NOT NULL DEFAULT '',
    da_in_qr BOOLEAN NOT NULL DEFAULT FALSE,
    nguoi_tao VARCHAR(50) NOT NULL DEFAULT '',
    ghi_chu TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    CONSTRAINT don_xuat_trang_thai_check CHECK (trang_thai IN ('Chờ_xuất', 'Đang_xuất', 'Hoàn_thành', 'Hủy'))
);

-- Order details table
CREATE TABLE chi_tiet_don (
    id SERIAL PRIMARY KEY,
    don_xuat_id INTEGER NOT NULL,
    san_pham_id INTEGER NOT NULL,
    so_luong_can INTEGER NOT NULL CHECK (so_luong_can > 0),
    so_luong_da_xuat INTEGER NOT NULL DEFAULT 0 CHECK (so_luong_da_xuat >= 0),
    pallet_assignments JSONB NOT NULL DEFAULT '[]',
    da_xuat_xong BOOLEAN NOT NULL DEFAULT FALSE,
    ghi_chu TEXT NOT NULL DEFAULT '',
    
    CONSTRAINT chi_tiet_don_so_luong_check CHECK (so_luong_da_xuat <= so_luong_can)
);

-- Order sequence table for custom ordering
CREATE TABLE thu_tu_xuat_hang (
    id SERIAL PRIMARY KEY,
    don_xuat_id INTEGER NOT NULL,
    san_pham_id INTEGER NOT NULL,
    thu_tu_mac_dinh INTEGER NOT NULL,
    thu_tu_tuy_chinh INTEGER,
    thoi_gian_uoc_tinh INTEGER NOT NULL DEFAULT 0,
    khoang_cach_uoc_tinh INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- ==================================
-- 4. INVENTORY MANAGEMENT
-- ==================================

-- Inventory status tracking
CREATE TABLE tinh_trang_hang (
    id SERIAL PRIMARY KEY,
    pallet_id INTEGER NOT NULL,
    loai_tinh_trang VARCHAR(30) NOT NULL,
    muc_do VARCHAR(20) NOT NULL DEFAULT 'Vừa',
    mo_ta TEXT NOT NULL DEFAULT '',
    ngay_phat_hien DATE NOT NULL,
    ngay_xu_ly DATE,
    nguoi_phat_hien VARCHAR(50) NOT NULL DEFAULT '',
    nguoi_xu_ly VARCHAR(50) NOT NULL DEFAULT '',
    trang_thai VARCHAR(20) NOT NULL DEFAULT 'Mới',
    ghi_chu TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    CONSTRAINT tinh_trang_hang_loai_check CHECK (loai_tinh_trang IN ('Bình_thường', 'Sắp_hết_hạn', 'Cần_kiểm_tra_CL', 'Có_vấn_đề', 'Ưu_tiên_xuất')),
    CONSTRAINT tinh_trang_hang_muc_do_check CHECK (muc_do IN ('Thấp', 'Vừa', 'Cao', 'Khẩn_cấp')),
    CONSTRAINT tinh_trang_hang_trang_thai_check CHECK (trang_thai IN ('Mới', 'Đang_xử_lý', 'Hoàn_thành', 'Hủy'))
);

-- Inventory audits
CREATE TABLE kiem_ke (
    id SERIAL PRIMARY KEY,
    ma_kiem_ke VARCHAR(20) UNIQUE NOT NULL,
    ten_kiem_ke VARCHAR(100) NOT NULL,
    loai_kiem_ke VARCHAR(30) NOT NULL,
    pham_vi_kiem_ke JSONB NOT NULL DEFAULT '{}',
    ngay_kiem_ke DATE NOT NULL,
    nguoi_tao VARCHAR(50) NOT NULL,
    danh_sach_nguoi_kiem_ke JSONB NOT NULL DEFAULT '[]',
    trang_thai VARCHAR(20) NOT NULL DEFAULT 'Chuẩn_bị',
    ghi_chu TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    CONSTRAINT kiem_ke_loai_check CHECK (loai_kiem_ke IN ('Toàn_kho', 'Theo_khu_vuc', 'Theo_nhom_hang', 'Theo_han_su_dung')),
    CONSTRAINT kiem_ke_trang_thai_check CHECK (trang_thai IN ('Chuẩn_bị', 'Đang_kiểm_kê', 'Hoàn_thành', 'Hủy'))
);

-- Inventory audit details
CREATE TABLE chi_tiet_kiem_ke (
    id SERIAL PRIMARY KEY,
    kiem_ke_id INTEGER NOT NULL,
    pallet_id INTEGER NOT NULL,
    so_luong_he_thong INTEGER NOT NULL,
    so_luong_thuc_te INTEGER,
    chenh_lech INTEGER GENERATED ALWAYS AS (so_luong_thuc_te - so_luong_he_thong) STORED,
    trang_thai_hang VARCHAR(100) NOT NULL DEFAULT '',
    nguoi_kiem_ke VARCHAR(50) NOT NULL DEFAULT '',
    thoi_gian_kiem_ke TIMESTAMP WITH TIME ZONE,
    ghi_chu TEXT NOT NULL DEFAULT '',
    hinh_anh JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Maintenance tasks
CREATE TABLE bao_tri (
    id SERIAL PRIMARY KEY,
    ma_bao_tri VARCHAR(20) UNIQUE NOT NULL,
    tieu_de VARCHAR(200) NOT NULL,
    loai_bao_tri VARCHAR(20) NOT NULL,
    doi_tuong VARCHAR(20) NOT NULL,
    doi_tuong_id VARCHAR(50) NOT NULL DEFAULT '',
    mo_ta TEXT NOT NULL,
    muc_do_uu_tien VARCHAR(20) NOT NULL DEFAULT 'Vừa',
    nguoi_tao VARCHAR(50) NOT NULL,
    nguoi_thuc_hien JSONB NOT NULL DEFAULT '[]',
    thoi_gian_bat_dau TIMESTAMP WITH TIME ZONE,
    thoi_gian_ket_thuc TIMESTAMP WITH TIME ZONE,
    thoi_gian_uoc_tinh INTEGER NOT NULL DEFAULT 0,
    chi_phi_uoc_tinh DECIMAL(15,2) NOT NULL DEFAULT 0,
    chi_phi_thuc_te DECIMAL(15,2) NOT NULL DEFAULT 0,
    trang_thai VARCHAR(20) NOT NULL DEFAULT 'Kế_hoạch',
    ket_qua TEXT NOT NULL DEFAULT '',
    hinh_anh_truoc JSONB NOT NULL DEFAULT '[]',
    hinh_anh_sau JSONB NOT NULL DEFAULT '[]',
    ghi_chu TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    CONSTRAINT bao_tri_loai_check CHECK (loai_bao_tri IN ('Vệ_sinh', 'Sửa_chữa', 'Kiểm_tra', 'Thay_thế', 'Bảo_dưỡng')),
    CONSTRAINT bao_tri_doi_tuong_check CHECK (doi_tuong IN ('Khu_vực', 'Vị_trí', 'Thiết_bị', 'Hệ_thống')),
    CONSTRAINT bao_tri_muc_do_check CHECK (muc_do_uu_tien IN ('Thấp', 'Vừa', 'Cao', 'Khẩn_cấp')),
    CONSTRAINT bao_tri_trang_thai_check CHECK (trang_thai IN ('Kế_hoạch', 'Đang_thực_hiện', 'Hoàn_thành', 'Tạm_dừng', 'Hủy'))
);

-- ==================================
-- 5. TRANSACTION HISTORY
-- ==================================

-- Import/Export history
CREATE TABLE lich_su_xuat_nhap (
    id SERIAL PRIMARY KEY,
    pallet_id INTEGER NOT NULL,
    loai_giao_dich VARCHAR(20) NOT NULL,
    so_luong INTEGER NOT NULL,
    don_xuat_id INTEGER,
    nguoi_thuc_hien VARCHAR(50) NOT NULL DEFAULT '',
    ngay_thuc_hien TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    ghi_chu TEXT NOT NULL DEFAULT '',
    
    CONSTRAINT lich_su_loai_check CHECK (loai_giao_dich IN ('Nhập', 'Xuất', 'Di_chuyển', 'Điều_chỉnh'))
);

-- Delivery verification logs
CREATE TABLE log_kiem_tra (
    id SERIAL PRIMARY KEY,
    don_hang_id VARCHAR(20) NOT NULL,
    cua_hang_dich VARCHAR(100) NOT NULL DEFAULT '',
    cua_hang_thuc VARCHAR(100) NOT NULL DEFAULT '',
    ket_qua VARCHAR(10) NOT NULL,
    ngay_kiem_tra TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    nguoi_kiem_tra VARCHAR(50) NOT NULL DEFAULT '',
    vi_tri_gps VARCHAR(100) NOT NULL DEFAULT '',
    ghi_chu TEXT NOT NULL DEFAULT '',
    
    CONSTRAINT log_kiem_tra_ket_qua_check CHECK (ket_qua IN ('DUNG', 'SAI', 'LOI'))
);

-- ==================================
-- 6. SYSTEM CONFIGURATION
-- ==================================

-- System settings
CREATE TABLE cai_dat_he_thong (
    id SERIAL PRIMARY KEY,
    khoa_cai_dat VARCHAR(100) UNIQUE NOT NULL,
    gia_tri TEXT NOT NULL,
    mo_ta TEXT NOT NULL DEFAULT '',
    nhom_cai_dat VARCHAR(50) NOT NULL DEFAULT 'Chung',
    kieu_du_lieu VARCHAR(20) NOT NULL DEFAULT 'string',
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    CONSTRAINT cai_dat_kieu_check CHECK (kieu_du_lieu IN ('string', 'number', 'boolean', 'json'))
);

-- ==================================
-- 7. FOREIGN KEY CONSTRAINTS
-- ==================================

-- User management constraints
ALTER TABLE users ADD CONSTRAINT fk_users_created_by FOREIGN KEY (created_by_id) REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE users ADD CONSTRAINT fk_users_approved_by FOREIGN KEY (approved_by_id) REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE roles ADD CONSTRAINT fk_roles_created_by FOREIGN KEY (created_by_id) REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE roles ADD CONSTRAINT fk_roles_updated_by FOREIGN KEY (updated_by_id) REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE module_permissions ADD CONSTRAINT fk_module_permissions_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE;
ALTER TABLE module_permissions ADD CONSTRAINT fk_module_permissions_granted_by FOREIGN KEY (granted_by_id) REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE user_roles ADD CONSTRAINT fk_user_roles_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE user_roles ADD CONSTRAINT fk_user_roles_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE;
ALTER TABLE user_roles ADD CONSTRAINT fk_user_roles_assigned_by FOREIGN KEY (assigned_by_id) REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE user_roles ADD CONSTRAINT fk_user_roles_revoked_by FOREIGN KEY (revoked_by_id) REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE permission_audit_logs ADD CONSTRAINT fk_permission_audit_logs_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE permission_audit_logs ADD CONSTRAINT fk_permission_audit_logs_target_user FOREIGN KEY (target_user_id) REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE permission_audit_logs ADD CONSTRAINT fk_permission_audit_logs_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL;

-- Warehouse constraints
ALTER TABLE san_pham ADD CONSTRAINT fk_san_pham_nhom_hang FOREIGN KEY (nhom_hang_id) REFERENCES nhom_hang(id) ON DELETE PROTECT;
ALTER TABLE vi_tri_kho ADD CONSTRAINT fk_vi_tri_kho_khu_vuc FOREIGN KEY (khu_vuc_id) REFERENCES khu_vuc(id) ON DELETE CASCADE;
ALTER TABLE vi_tri_kho ADD CONSTRAINT fk_vi_tri_kho_pallet FOREIGN KEY (pallet_id) REFERENCES pallets(id) ON DELETE SET NULL;
ALTER TABLE pallets ADD CONSTRAINT fk_pallets_san_pham FOREIGN KEY (san_pham_id) REFERENCES san_pham(id) ON DELETE PROTECT;
ALTER TABLE pallets ADD CONSTRAINT fk_pallets_nha_cung_cap FOREIGN KEY (nha_cung_cap_id) REFERENCES nha_cung_cap(id) ON DELETE SET NULL;
ALTER TABLE pallets ADD CONSTRAINT fk_pallets_vi_tri_kho FOREIGN KEY (vi_tri_kho_id) REFERENCES vi_tri_kho(id) ON DELETE SET NULL;

-- Orders constraints
ALTER TABLE don_xuat ADD CONSTRAINT fk_don_xuat_cua_hang FOREIGN KEY (cua_hang_id) REFERENCES cua_hang(id) ON DELETE PROTECT;
ALTER TABLE chi_tiet_don ADD CONSTRAINT fk_chi_tiet_don_don_xuat FOREIGN KEY (don_xuat_id) REFERENCES don_xuat(id) ON DELETE CASCADE;
ALTER TABLE chi_tiet_don ADD CONSTRAINT fk_chi_tiet_don_san_pham FOREIGN KEY (san_pham_id) REFERENCES san_pham(id) ON DELETE PROTECT;
ALTER TABLE thu_tu_xuat_hang ADD CONSTRAINT fk_thu_tu_xuat_hang_don_xuat FOREIGN KEY (don_xuat_id) REFERENCES don_xuat(id) ON DELETE CASCADE;
ALTER TABLE thu_tu_xuat_hang ADD CONSTRAINT fk_thu_tu_xuat_hang_san_pham FOREIGN KEY (san_pham_id) REFERENCES san_pham(id) ON DELETE CASCADE;

-- Inventory constraints
ALTER TABLE tinh_trang_hang ADD CONSTRAINT fk_tinh_trang_hang_pallet FOREIGN KEY (pallet_id) REFERENCES pallets(id) ON DELETE CASCADE;
ALTER TABLE chi_tiet_kiem_ke ADD CONSTRAINT fk_chi_tiet_kiem_ke_kiem_ke FOREIGN KEY (kiem_ke_id) REFERENCES kiem_ke(id) ON DELETE CASCADE;
ALTER TABLE chi_tiet_kiem_ke ADD CONSTRAINT fk_chi_tiet_kiem_ke_pallet FOREIGN KEY (pallet_id) REFERENCES pallets(id) ON DELETE CASCADE;
ALTER TABLE lich_su_xuat_nhap ADD CONSTRAINT fk_lich_su_xuat_nhap_pallet FOREIGN KEY (pallet_id) REFERENCES pallets(id) ON DELETE CASCADE;
ALTER TABLE lich_su_xuat_nhap ADD CONSTRAINT fk_lich_su_xuat_nhap_don_xuat FOREIGN KEY (don_xuat_id) REFERENCES don_xuat(id) ON DELETE SET NULL;

-- ==================================
-- 8. INDEXES FOR PERFORMANCE
-- ==================================

-- User management indexes
CREATE INDEX idx_users_user_type_status ON users(user_type, status);
CREATE INDEX idx_users_employee_id ON users(employee_id);
CREATE INDEX idx_users_is_active_status ON users(is_active, status);
CREATE INDEX idx_users_created_by ON users(created_by_id);
CREATE INDEX idx_roles_role_type_is_active ON roles(role_type, is_active);
CREATE INDEX idx_roles_code ON roles(code);
CREATE INDEX idx_roles_status ON roles(status);
CREATE INDEX idx_module_permissions_role_module ON module_permissions(role_id, module);
CREATE INDEX idx_module_permissions_module_action ON module_permissions(module, action);
CREATE INDEX idx_module_permissions_is_granted ON module_permissions(is_granted);
CREATE INDEX idx_module_permissions_expires_at ON module_permissions(expires_at);
CREATE INDEX idx_user_roles_user_is_active ON user_roles(user_id, is_active);
CREATE INDEX idx_user_roles_role_is_active ON user_roles(role_id, is_active);
CREATE INDEX idx_user_roles_assigned_at ON user_roles(assigned_at);
CREATE INDEX idx_user_roles_expires_at ON user_roles(expires_at);
CREATE INDEX idx_permission_audit_logs_user_timestamp ON permission_audit_logs(user_id, timestamp);
CREATE INDEX idx_permission_audit_logs_action_type_timestamp ON permission_audit_logs(action_type, timestamp);
CREATE INDEX idx_permission_audit_logs_target_user_timestamp ON permission_audit_logs(target_user_id, timestamp);
CREATE INDEX idx_permission_audit_logs_module_action ON permission_audit_logs(module, action);
CREATE INDEX idx_permission_audit_logs_success ON permission_audit_logs(success);

-- Warehouse indexes
CREATE INDEX idx_khu_vuc_ma_khu_vuc ON khu_vuc(ma_khu_vuc);
CREATE INDEX idx_khu_vuc_trang_thai ON khu_vuc(trang_thai);
CREATE INDEX idx_vi_tri_kho_ma_vi_tri ON vi_tri_kho(ma_vi_tri);
CREATE INDEX idx_vi_tri_kho_khu_vuc_trang_thai ON vi_tri_kho(khu_vuc_id, trang_thai);
CREATE INDEX idx_vi_tri_kho_hang_cot ON vi_tri_kho(hang, cot);
CREATE INDEX idx_vi_tri_kho_trang_thai ON vi_tri_kho(trang_thai);
CREATE INDEX idx_vi_tri_kho_uu_tien_fifo ON vi_tri_kho(uu_tien_fifo);
CREATE INDEX idx_pallets_ma_pallet ON pallets(ma_pallet);
CREATE INDEX idx_pallets_san_pham_trang_thai ON pallets(san_pham_id, trang_thai);
CREATE INDEX idx_pallets_han_su_dung ON pallets(han_su_dung);
CREATE INDEX idx_pallets_ngay_kiem_tra_cl ON pallets(ngay_kiem_tra_cl);
CREATE INDEX idx_pallets_trang_thai ON pallets(trang_thai);
CREATE INDEX idx_pallets_vi_tri_kho ON pallets(vi_tri_kho_id);
CREATE INDEX idx_san_pham_ma_san_pham ON san_pham(ma_san_pham);
CREATE INDEX idx_san_pham_nhom_hang ON san_pham(nhom_hang_id);
CREATE INDEX idx_san_pham_trang_thai ON san_pham(trang_thai);

-- Orders indexes
CREATE INDEX idx_don_xuat_ma_don ON don_xuat(ma_don);
CREATE INDEX idx_don_xuat_cua_hang_trang_thai ON don_xuat(cua_hang_id, trang_thai);
CREATE INDEX idx_don_xuat_ngay_tao ON don_xuat(ngay_tao);
CREATE INDEX idx_don_xuat_trang_thai ON don_xuat(trang_thai);
CREATE INDEX idx_chi_tiet_don_don_xuat ON chi_tiet_don(don_xuat_id);
CREATE INDEX idx_chi_tiet_don_san_pham ON chi_tiet_don(san_pham_id);

-- Inventory indexes
CREATE INDEX idx_tinh_trang_hang_p-- backend/database/migrations/0001_initial_warehouse.sql
-- Warehouse Management System - Initial Database Schema

-- ==================================
-- 1. USER MANAGEMENT & PERMISSIONS
-- ==================================

-- Users table (extending Django's auth)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    password VARCHAR(128) NOT NULL,
    last_login TIMESTAMP WITH TIME ZONE,
    is_superuser BOOLEAN NOT NULL DEFAULT FALSE,
    username VARCHAR(150) UNIQUE NOT NULL,
    first_name VARCHAR(150) NOT NULL DEFAULT '',
    last_name VARCHAR(150) NOT NULL DEFAULT '',
    email VARCHAR(254) UNIQUE NOT NULL,
    is_staff BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    date_joined TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    -- Custom fields
    user_type VARCHAR(20) NOT NULL DEFAULT 'staff',
    employee_id VARCHAR(20) UNIQUE,
    phone VARCHAR(17) NOT NULL DEFAULT '',
    address TEXT NOT NULL DEFAULT '',
    avatar VARCHAR(100),
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    is_active_session BOOLEAN NOT NULL DEFAULT FALSE,
    last_activity TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_by_id INTEGER,
    approved_by_id INTEGER,
    approved_at TIMESTAMP WITH TIME ZONE,
    notification_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    email_notification BOOLEAN NOT NULL DEFAULT TRUE,
    language VARCHAR(10) NOT NULL DEFAULT 'vi',
    timezone_user VARCHAR(50) NOT NULL DEFAULT 'Asia/Ho_Chi_Minh',
    failed_login_attempts INTEGER NOT NULL DEFAULT 0,
    locked_until TIMESTAMP WITH TIME ZONE,
    password_changed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    must_change_password BOOLEAN NOT NULL DEFAULT FALSE,
    total_login_count INTEGER NOT NULL DEFAULT 0,
    last_password_change TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    CONSTRAINT users_user_type_check CHECK (user_type IN ('admin', 'manager', 'supervisor', 'staff', 'viewer', 'delivery', 'quality')),
    CONSTRAINT users_status_check CHECK (status IN ('active', 'inactive', 'suspended', 'pending'))
);

-- Roles table
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    role_type VARCHAR(20) NOT NULL DEFAULT 'custom',
    description TEXT NOT NULL DEFAULT '',
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_system_role BOOLEAN NOT NULL DEFAULT FALSE,
    priority INTEGER NOT NULL DEFAULT 0,
    max_users INTEGER,
    auto_assign BOOLEAN NOT NULL DEFAULT FALSE,
    created_by_id INTEGER,
    updated_by_id INTEGER,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    metadata JSONB NOT NULL DEFAULT '{}',
    
    CONSTRAINT roles_role_type_check CHECK (role_type IN ('admin', 'manager', 'supervisor', 'staff', 'viewer', 'delivery', 'quality', 'custom')),
    CONSTRAINT roles_status_check CHECK (status IN ('active', 'inactive', 'deprecated'))
);

-- Module permissions table
CREATE TABLE module_permissions (
    id SERIAL PRIMARY KEY,
    role_id INTEGER NOT NULL,
    module VARCHAR(30) NOT NULL,
    action VARCHAR(20) NOT NULL,
    is_granted BOOLEAN NOT NULL DEFAULT TRUE,
    conditions JSONB NOT NULL DEFAULT '{}',
    expires_at TIMESTAMP WITH TIME ZONE,
    granted_by_id INTEGER,
    granted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    reason TEXT NOT NULL DEFAULT '',
    notes TEXT NOT NULL DEFAULT '',
    
    CONSTRAINT module_permissions_module_check CHECK (module IN ('nhap_hang', 'tao_don', 'xuat_hang', 'quan_ly_kho', 'kiem_tra_giao_hang', 'admin_panel', 'reports', 'settings', 'user_management', 'role_management', 'warehouse_config', 'system_logs')),
    CONSTRAINT module_permissions_action_check CHECK (action IN ('view', 'create', 'edit', 'delete', 'export', 'import', 'print', 'approve', 'reject', 'assign', 'transfer', 'manage_users', 'manage_roles', 'system_config', 'full_access')),
    UNIQUE(role_id, module, action)
);

-- User roles assignment table
CREATE TABLE user_roles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    role_id INTEGER NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    assigned_by_id INTEGER,
    revoked_by_id INTEGER,
    revoked_at TIMESTAMP WITH TIME ZONE,
    reason TEXT NOT NULL DEFAULT '',
    notes TEXT NOT NULL DEFAULT '',
    
    UNIQUE(user_id, role_id) DEFERRABLE INITIALLY DEFERRED
);

-- Permission audit logs table
CREATE TABLE permission_audit_logs (
    id SERIAL PRIMARY KEY,
    action_type VARCHAR(30) NOT NULL,
    user_id INTEGER NOT NULL,
    target_user_id INTEGER,
    role_id INTEGER,
    module VARCHAR(30) NOT NULL DEFAULT '',
    action VARCHAR(20) NOT NULL DEFAULT '',
    success BOOLEAN NOT