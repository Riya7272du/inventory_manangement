from django.contrib import admin
from .models import InventoryItem, Supplier,Transaction

admin.site.register(Supplier)
admin.site.register(InventoryItem)
admin.site.register(Transaction)