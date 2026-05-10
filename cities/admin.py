from django.contrib import admin
from .models import City, Activity


@admin.register(City)
class CityAdmin(admin.ModelAdmin):
    list_display = ('name', 'country', 'region', 'cost_index', 'popularity')
    list_filter = ('country', 'region')
    search_fields = ('name', 'country')
    ordering = ('-popularity',)


@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ('name', 'city', 'category', 'cost', 'duration_hrs')
    list_filter = ('category', 'city__country')
    search_fields = ('name', 'city__name')
