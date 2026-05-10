from django.urls import path
from . import views

urlpatterns = [
    path('', views.city_list, name='city_list'),
    path('<int:city_id>/', views.city_detail, name='city_detail'),
]
