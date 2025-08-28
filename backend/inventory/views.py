from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import InventoryItem,Supplier,Transaction
from .serializers import InventoryItemSerializer,SupplierSerializer,TransactionSerializer
from .pagination import InventoryItemCursorPagination
from rest_framework.generics import ListAPIView
from django.db.models import Q,Sum, F, Count
from django.http import HttpResponse
import csv
from xhtml2pdf import pisa
import io

def check_admin_permission(user):
    return user.is_superuser

def log_transaction(transaction_type, item_name, user, details=""):
    user_name = user.first_name if user.first_name else user.username
    Transaction.objects.create(
        transaction_type=transaction_type,
        item_name=item_name,
        user_name=user_name,
        details=details
    )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_inventory_item(request):
    serializer = InventoryItemSerializer(data=request.data)
    if serializer.is_valid():
        try:
            item = serializer.save()
            log_transaction('add', item.item_name, request.user, f"+{item.quantity} units")
            # result = InventoryItemSerializer(item)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
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
            log_transaction('update', updated_item.item_name, request.user, "Updated")
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
        log_transaction('delete', item.item_name, request.user, f"Removed SKU {item.sku}")
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
    

class TransactionListView(ListAPIView):
    serializer_class = TransactionSerializer
    pagination_class = InventoryItemCursorPagination 
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = Transaction.objects.all()
        transaction_type = self.request.query_params.get('type')
        search = self.request.query_params.get('search')
       
        if transaction_type:
            queryset = queryset.filter(transaction_type=transaction_type)
       
        if search:
            queryset = queryset.filter(
                Q(item_name__icontains=search) | Q(details__icontains=search)
            )
            
        return queryset
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_reports_data(request):
    total_value = InventoryItem.objects.aggregate(
        total=Sum(F('price') * F('quantity'))
    )['total'] or 0

    category_data = (
        InventoryItem.objects.values('category')
        .annotate(
            value=Sum(F('price') * F('quantity')),  
            count=Count('id')                      
        )
    )
    total_items = InventoryItem.objects.count()
    breakdown = []
    category_values = {}

    for cat in category_data:
        name = cat['category']
        if name is None:
            name = 'Uncategorized'
        value = float(cat['value'] or 0)
        count = cat['count']
        category_key = name.lower() if name != 'Uncategorized' else 'uncategorized'
        category_values[category_key] = round(value, 2)

        breakdown.append({
            'name': name,
            'count': count,
            'percentage': round((count / total_items) * 100) if total_items else 0
        })

    return Response({
        'total_value': round(float(total_value), 2),
        'category_values': category_values,
        'category_breakdown': breakdown
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def export_reports_csv(request):
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="inventory_report.csv"'
    
    writer = csv.writer(response)
    writer.writerow(['Report Type', 'Category', 'Items Count', 'Total Value'])
    items = InventoryItem.objects.all()
    totals = items.aggregate(
        total_items=Count('id'),
        total_value=Sum(F('price') * F('quantity'))
    )
    writer.writerow([
        'Summary',
        'All Items',
        totals['total_items'] or 0,
        f"${totals['total_value'] or 0:.2f}"
    ])
    writer.writerow([])
    writer.writerow(['Individual Items', '', '', ''])
    writer.writerow(['Item Name', 'SKU', 'Category', 'Quantity', 'Price', 'Total Value'])
    
    for item in items:
        writer.writerow([
            item.item_name,
            item.sku,
            item.category or 'Uncategorized',
            item.quantity,
            f"${item.price}",
            f"${float(item.price) * item.quantity:.2f}"
        ])
    
    return response



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def export_reports_pdf(request):
    items = InventoryItem.objects.all()
    total_items = items.count()
    total_value = InventoryItem.objects.aggregate(
        total=Sum(F('price') * F('quantity'))
    )['total'] or 0

    html = f"""
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; }}
            h1 {{ text-align: center; }}
            table {{ width: 100%; border-collapse: collapse; margin-top: 20px; }}
            th, td {{ border: 1px solid #333; padding: 8px; text-align: left; }}
        </style>
    </head>
    <body>
        <h1>Inventory Report</h1>
        <p><b>Total Items:</b> {total_items}</p>
        <p><b>Total Value:</b> ${total_value:.2f}</p>
        <br/>
        <table>
            <tr>
                <th>Item Name</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total Value</th>
            </tr>
            {''.join([
                f"<tr><td>{i.item_name}</td><td>{i.sku}</td><td>{i.category or 'Uncategorized'}</td><td>{i.quantity}</td><td>${i.price}</td><td>${float(i.price) * i.quantity:.2f}</td></tr>"
                for i in items
            ])}
        </table>
    </body>
    </html>
    """

    response = HttpResponse(content_type="application/pdf")
    response["Content-Disposition"] = 'attachment; filename="inventory_report.pdf"'
    
    pisa_status = pisa.CreatePDF(io.StringIO(html), dest=response)

    if pisa_status.err:
        return HttpResponse("Error generating PDF", status=500)
    
    return response

