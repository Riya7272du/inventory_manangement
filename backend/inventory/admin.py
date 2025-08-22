from django.contrib import admin
from .models import InventoryItem, Supplier

admin.site.register(Supplier)
admin.site.register(InventoryItem)