from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import InventoryItem,Supplier
from .serializers import InventoryItemSerializer,SupplierSerializer
from .pagination import InventoryItemCursorPagination
from rest_framework.generics import ListAPIView
from django.db.models import Q

def check_admin_permission(user):
    return user.is_superuser

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_inventory_item(request):
    serializer = InventoryItemSerializer(data=request.data)
    if serializer.is_valid():
        try:
            item = serializer.save()
            result = InventoryItemSerializer(item)
            return Response(result.data, status=status.HTTP_201_CREATED)
        
        except Exception as e:
            return Response({
                'error': 'Failed to create inventory item',
                'details': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    return Response({
        'error': 'Validation failed',
        'details': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)

class InventoryItemListView(ListAPIView):
    serializer_class = InventoryItemSerializer
    pagination_class = InventoryItemCursorPagination
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = InventoryItem.objects.all()
        category = self.request.query_params.get('category')
        supplier = self.request.query_params.get('supplier')
        search = self.request.query_params.get('search')
       
        if category:
            queryset = queryset.filter(category__iexact=category)

        if supplier:
            queryset = queryset.filter(supplier__name__iexact=supplier)
       
        if search:
            queryset = queryset.filter(
                Q(item_name__icontains=search) | Q(sku__icontains=search)
            )
        return queryset

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_inventory_item(request, id):
    try:
        item = get_object_or_404(InventoryItem, id=id)
        serializer = InventoryItemSerializer(item)
        
        return Response({
            'success': True,
            'item': serializer.data
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'error': 'Item not found',
            'details': str(e)
        }, status=status.HTTP_404_NOT_FOUND)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_inventory_item(request, id):
    try:
        item = get_object_or_404(InventoryItem, id=id)
        serializer = InventoryItemSerializer(item, data=request.data, partial=True)
        
        if serializer.is_valid():
            updated_item = serializer.save()
            result = InventoryItemSerializer(updated_item)
            
            return Response({
                'success': True,
                'message': 'Item updated successfully',
                'item': result.data
            }, status=status.HTTP_200_OK)
        
        return Response({
            'error': 'Validation failed',
            'details': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
        
    except Exception as e:
        return Response({
            'error': 'Failed to update item',
            'details': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_inventory_item(request, id):
    if not check_admin_permission(request.user):
        return Response({
            'error': 'Permission denied',
            'message': 'Only admins can delete inventory items'
        }, status=status.HTTP_403_FORBIDDEN)
    
    try:
        item = get_object_or_404(InventoryItem, id=id)
        item.delete()
        
        return Response({
            'success': True,
            'message': f'Item deleted successfully'
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'error': 'Failed to delete item',
            'details': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

#supplier
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_supplier(request):
    serializer = SupplierSerializer(data=request.data)
    if serializer.is_valid():
        try:
            supplier = serializer.save()
            result = SupplierSerializer(supplier)
            return Response(result.data, status=status.HTTP_201_CREATED)
        
        except Exception as e:
            return Response({
                'error': 'Failed to create supplier',
                'details': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    return Response({
        'error': 'Validation failed',
        'details': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)


class SupplierListView(ListAPIView):
    serializer_class = SupplierSerializer
    pagination_class = InventoryItemCursorPagination
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = Supplier.objects.all()
        search = self.request.query_params.get('search')
        
        if search:
            queryset = queryset.filter(name__icontains=search)
        
        return queryset.order_by('name')

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_supplier(request, id):
    try:
        supplier = get_object_or_404(Supplier, id=id)
        serializer = SupplierSerializer(supplier)
        
        return Response({
            'success': True,
            'supplier': serializer.data
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'error': 'Supplier not found',
            'details': str(e)
        }, status=status.HTTP_404_NOT_FOUND)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_supplier(request, id):
    try:
        supplier = get_object_or_404(Supplier, id=id)
        serializer = SupplierSerializer(supplier, data=request.data, partial=True)
        
        if serializer.is_valid():
            updated_supplier = serializer.save()
            result = SupplierSerializer(updated_supplier)
            
            return Response({
                'success': True,
                'message': 'Supplier updated successfully',
                'supplier': result.data
            }, status=status.HTTP_200_OK)
        
        return Response({
            'error': 'Validation failed',
            'details': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
        
    except Exception as e:
        return Response({
            'error': 'Failed to update supplier',
            'details': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_supplier(request, id):
    if not request.user.is_superuser:
        return Response({
            'error': 'Permission denied',
            'message': 'Only admins can delete suppliers'
        }, status=status.HTTP_403_FORBIDDEN)
    
    try:
        supplier = get_object_or_404(Supplier, id=id)
        supplier_name = supplier.name
        supplier.delete()
        
        return Response({
            'success': True,
            'message': f'Supplier "{supplier_name}" deleted successfully'
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'error': 'Failed to delete supplier',
            'details': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)