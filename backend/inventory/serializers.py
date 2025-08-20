from rest_framework import serializers
from .models import InventoryItem
from decimal import Decimal


class InventoryItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = InventoryItem
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']

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