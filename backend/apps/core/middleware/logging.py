# apps/core/middleware/logging.py

class RequestLoggingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Ví dụ log đơn giản
        print(f"[LOG] {request.method} {request.path}")
        response = self.get_response(request)
        return response