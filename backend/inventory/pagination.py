from rest_framework.pagination import CursorPagination

class InventoryItemCursorPagination(CursorPagination):
    page_size = 2
    ordering = 'created_at'
    cursor_query_param = 'cursor'
    page_size_query_param = None  