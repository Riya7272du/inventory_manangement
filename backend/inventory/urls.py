from django.urls import path
from . import views

urlpatterns = [
    path('add/', views.add_inventory_item, name='add_inventory_item'),
    path('list/', views.InventoryItemListView.as_view(), name='list_inventory_items'),
    path('<int:id>/', views.get_inventory_item, name='get_inventory_item'),
    path('<int:id>/update/', views.update_inventory_item, name='update_inventory_item'),
    path('<int:id>/delete/', views.delete_inventory_item, name='delete_inventory_item'),
]