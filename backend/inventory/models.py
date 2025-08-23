from django.db import models
from django.core.validators import MinValueValidator
from django.core.exceptions import ValidationError
from decimal import Decimal


class Supplier(models.Model):
    name = models.CharField(max_length=255, unique=True)  
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, unique=True)  
    address = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name
    
    @property
    def item_count(self):
        return self.inventoryitem_set.count()
      


class InventoryItem(models.Model):
    sku = models.CharField(max_length=50, unique=True)
    item_name = models.CharField(max_length=255)
    quantity = models.PositiveIntegerField()
    category = models.CharField(max_length=100, blank=True, null=True)
    price = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        blank=False, 
        null=False,
        validators=[MinValueValidator(Decimal('0.00'))]
    )
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def clean(self):
        if not self.sku:
            raise ValidationError("SKU is required.")
        if not self.item_name:
            raise ValidationError("Item name is required.")
        if self.quantity is None:
            raise ValidationError("Quantity is required.")

    def __str__(self):
        return f"{self.sku} - {self.item_name}"