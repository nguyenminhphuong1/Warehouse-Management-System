import { usePermissions } from './usePermissions';

export const useModuleAccess = (moduleName) => {
  const { checkPermission } = usePermissions();

  const hasAccess = (action = 'view') => {
    return checkPermission(moduleName, action);
  };

  const getAccessLevel = () => {
    const permissions = ['view', 'create', 'edit', 'delete', 'print', 'export'];
    return permissions.filter(permission => checkPermission(moduleName, permission));
  };

  return {
    hasAccess,
    getAccessLevel,
    // Specific checks
    canView: hasAccess('view'),
    canCreate: hasAccess('create'),
    canEdit: hasAccess('edit'),
    canDelete: hasAccess('delete'),
    canPrint: hasAccess('print'),
    canExport: hasAccess('export')
  };
};

export default useModuleAccess;