@module_permission_required('nhap_hang')
def nhap_hang_list(request):
    # User can view nhap_hang module
    pass

@permission_required('nhap_hang', 'create')
def create_nhap_hang(request):
    # User can create in nhap_hang module
    pass

@permission_required('xuat_hang', 'approve', context_builder=lambda r, id: {'order_id': id})
def approve_xuat_hang(request, order_id):
    # User can approve with context
    pass

@any_permission_required('quan_ly_kho', ['edit', 'delete'])
def manage_inventory(request):
    # User needs either edit or delete permission
    pass