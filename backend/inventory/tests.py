from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from rest_framework import status
from rest_framework.authtoken.models import Token
from .models import InventoryItem


class InventoryItemAPITest(APITestCase):
    
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        self.url = '/api/inventory/add/'

    def test_valid_create_data(self):
        data = {
            'sku': 'L001',
            'item_name': 'Laptop',
            'quantity': 15,
            'price': '99.99',
            'category': 'Electronics',
            'supplier': 'Store'
        }
        response = self.client.post(self.url, data)
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['sku'], 'L001')
        self.assertEqual(response.data['item_name'], 'Laptop')
       
        item = InventoryItem.objects.get(sku='L001')
        self.assertEqual(item.item_name, 'Laptop')
        self.assertEqual(item.quantity, 15)

    def test_missing_fields(self):
        data = {'item_name': 'Test'}
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_invalid_data_types(self):
        data = {
            'sku': 'T001',
            'item_name': 'Test',
            'quantity': 'ten', 
            'price': 'expensive'  
        }
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_negative_values(self):
        data = {
            'sku': 'T002',
            'item_name': 'Item',
            'quantity': -5,
            'price': '-15.00'
        }
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_large_values(self):
        data = {
            'sku': 'L002',
            'item_name': 'Large Values',
            'quantity': 999999999,
            'price': '99999999.99'
        }
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_empty_payload(self):
        data = {}
        
        response = self.client.post(self.url, data)
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('details', response.data)

    def test_extra_fields(self):
        data = {
            'sku': 'L004',
            'item_name': 'Extra Fields Test',
            'quantity': 7,
            'price': '35.00',
            'extra_field': 'should be ignored'
        }
        
        response = self.client.post(self.url, data)
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['sku'], 'L004')