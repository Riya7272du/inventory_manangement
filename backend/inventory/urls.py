from django.urls import path
from . import views

urlpatterns = [
    path('add/', views.add_inventory_item, name='add_inventory_item'),
    path('list/', views.InventoryItemListView.as_view(), name='list_inventory_items'),
    path('<int:id>/', views.get_inventory_item, name='get_inventory_item'),
    path('<int:id>/update/', views.update_inventory_item, name='update_inventory_item'),
    path('<int:id>/delete/', views.delete_inventory_item, name='delete_inventory_item'),
    path('suppliers/add/', views.add_supplier, name='add_supplier'),
    path('suppliers/list/', views.SupplierListView.as_view(), name='list_suppliers'),
    path('suppliers/<int:id>/', views.get_supplier, name='get_supplier'),
    path('suppliers/<int:id>/update/', views.update_supplier, name='update_supplier'),
    path('suppliers/<int:id>/delete/', views.delete_supplier, name='delete_supplier'),
    path('transactions/', views.TransactionListView.as_view(), name='list_transactions'),
    path('reports/', views.get_reports_data, name='reports_data'),
    path('reports/export-csv/', views.export_reports_csv, name='export_reports_csv'),
    path('reports/export-pdf/', views.export_reports_pdf, name='export_reports_pdf'),
]