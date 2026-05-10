from django.contrib import admin
from .models import Trip, Stop, StopActivity, PackingItem, TripNote, CommunityPost


@admin.register(Trip)
class TripAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'start_date', 'end_date', 'is_public', 'created_at')
    list_filter = ('is_public',)
    search_fields = ('name', 'user__username')
    readonly_fields = ('share_token',)


@admin.register(Stop)
class StopAdmin(admin.ModelAdmin):
    list_display = ('city', 'trip', 'arrival_date', 'departure_date', 'order_index')


@admin.register(StopActivity)
class StopActivityAdmin(admin.ModelAdmin):
    list_display = ('activity', 'stop', 'scheduled_date', 'scheduled_time')


@admin.register(PackingItem)
class PackingItemAdmin(admin.ModelAdmin):
    list_display = ('name', 'trip', 'category', 'is_packed')
    list_filter = ('category', 'is_packed')


@admin.register(TripNote)
class TripNoteAdmin(admin.ModelAdmin):
    list_display = ('trip', 'stop', 'created_at')


@admin.register(CommunityPost)
class CommunityPostAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'city', 'likes', 'created_at')
    search_fields = ('title', 'user__username')
