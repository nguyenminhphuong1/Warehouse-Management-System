import { useState } from 'react';

export const usePermissions = () => {
  // Mock permissions - trả về tất cả quyền = true cho development
  const permissions = {
    nhap_hang: {
      view: true,
      create: true,
      edit: true,
      delete: true,
      print: true,
      export: true
    },
    tao_don: {
      view: true,
      create: true,
      edit: true,
      delete: true
    },
    xuat_hang: {
      view: true,
      create: true,
      edit: true,
      delete: true
    },
    quan_ly_kho: {
      view: true,
      create: true,
      edit: true,
      delete: true
    },
    kiem_tra_giao_hang: {
      view: true,
      create: true,
      edit: true,
      delete: true
    }
  };

  const checkPermission = (module, action) => {
    return permissions[module]?.[action] || false;
  };

  // Alias for canPerformAction
  const canPerformAction = (module, action) => {
    return checkPermission(module, action);
  };

  const hasAnyPermission = (module, actions = []) => {
    return actions.some(action => checkPermission(module, action));
  };

  const hasAllPermissions = (module, actions = []) => {
    return actions.every(action => checkPermission(module, action));
  };

  return {
    permissions,
    checkPermission,
    canPerformAction, // Add this function name
    hasAnyPermission,
    hasAllPermissions,
    // Shortcuts for common checks
    canView: (module) => checkPermission(module, 'view'),
    canCreate: (module) => checkPermission(module, 'create'),
    canEdit: (module) => checkPermission(module, 'edit'),
    canDelete: (module) => checkPermission(module, 'delete'),
    canPrint: (module) => checkPermission(module, 'print'),
    canExport: (module) => checkPermission(module, 'export')
  };
};

export default usePermissions;