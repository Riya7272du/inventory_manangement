from rest_framework import serializers
from .models import InventoryItem, Supplier,Transaction
from decimal import Decimal
import pytz

class SupplierSerializer(serializers.ModelSerializer):
    linked_items = serializers.SerializerMethodField()
    
    class Meta:
        model = Supplier
        fields = ['id', 'name', 'email', 'phone', 'address', 'linked_items', 'created_at', 'updated_at']

    def get_linked_items(self, obj):
        return obj.inventoryitem_set.count()
    
    def validate_name(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Name cannot be empty.")
        return value.strip()
    
    def validate_email(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Email is required.")
        return value.strip().lower()
    
    def validate_phone(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Phone is required.")
        return value.strip()


class InventoryItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = InventoryItem
        fields = "__all__"
        read_only_fields = ['id', 'created_at', 'updated_at']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        try:
            if instance.supplier:
                data['supplier'] = instance.supplier.name
            else:
                data['supplier'] = None
        except:
            pass
        return data

    def validate_sku(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("SKU cannot be empty.")
        return value.strip()

    def validate_item_name(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Item name cannot be empty.")
        return value.strip()

    def validate_quantity(self, value):
        if value < 0:
            raise serializers.ValidationError("Quantity must be greater than or equal to 0.")
        return value

    def validate_price(self, value):
        if value is None:
            raise serializers.ValidationError("Price is required.")
        if value < Decimal('0.00'):
            raise serializers.ValidationError("Price must be greater than or equal to 0.")
        return value

class TransactionSerializer(serializers.ModelSerializer):
    transaction_type_display = serializers.CharField(source='get_transaction_type_display', read_only=True)
    formatted_date = serializers.SerializerMethodField()
    
    class Meta:
        model = Transaction
        fields = "__all__"

    def get_formatted_date(self, obj):
        ist_timezone = pytz.timezone('Asia/Kolkata')
        local_time = obj.created_at.astimezone(ist_timezone)
        return local_time.strftime('%Y-%m-%d %H:%M')