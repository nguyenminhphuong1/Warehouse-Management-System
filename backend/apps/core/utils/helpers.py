def get_client_ip(request):
    """Lấy địa chỉ IP của client từ request Django."""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0].strip()
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip

def get_user_agent(request):
    """Lấy user agent từ request Django."""
    return request.META.get('HTTP_USER_AGENT', '')