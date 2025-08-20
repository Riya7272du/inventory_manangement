from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import InventoryItem
from .serializers import InventoryItemSerializer


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_inventory_item(request):
    serializer = InventoryItemSerializer(data=request.data)
    if serializer.is_valid():
        try:
            item = serializer.save()
            return Response({
                'id': item.id,
                'sku': item.sku,
                'item_name': item.item_name,
                'category': item.category,
                'quantity': item.quantity,
                'price': str(item.price),
                'supplier': item.supplier,
                'created_at': item.created_at.isoformat()
            }, status=status.HTTP_201_CREATED)
        
        except Exception as e:
            return Response({
                'error': 'Failed to create inventory item',
                'details': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    return Response({
        'error': 'Validation failed',
        'details': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)