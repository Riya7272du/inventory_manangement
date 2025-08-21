from rest_framework.pagination import CursorPagination

class InventoryItemCursorPagination(CursorPagination):
    page_size = 4
    ordering = 'created_at'
    cursor_query_param = 'cursor'
