import uuid
from django.db import models
from django.contrib.auth.models import User
from cities.models import City, Activity


class Trip(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='trips')
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True, default='')
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    cover_photo = models.TextField(blank=True, default='')
    is_public = models.BooleanField(default=False)
    budget_limit = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    share_token = models.UUIDField(unique=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.name

    def total_cost(self):
        total = 0
        for stop in self.stops.all():
            total += float(stop.transport_cost or 0)
            total += float(stop.stay_cost or 0)
            for sa in stop.stop_activities.all():
                total += float(sa.activity.cost or 0)
        return total

    def city_count(self):
        return self.stops.count()

    def duration_days(self):
        if self.start_date and self.end_date:
            return (self.end_date - self.start_date).days
        return 0


class Stop(models.Model):
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='stops')
    city = models.ForeignKey(City, on_delete=models.PROTECT, related_name='stops')
    arrival_date = models.DateField(null=True, blank=True)
    departure_date = models.DateField(null=True, blank=True)
    order_index = models.IntegerField(default=0)
    transport_cost = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    stay_cost = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    notes = models.TextField(blank=True, default='')

    class Meta:
        ordering = ['order_index', 'arrival_date']

    def __str__(self):
        return f"{self.city.name} - {self.trip.name}"

    def stop_total_cost(self):
        activity_cost = sum(float(sa.activity.cost) for sa in self.stop_activities.all())
        return float(self.transport_cost or 0) + float(self.stay_cost or 0) + activity_cost


class StopActivity(models.Model):
    stop = models.ForeignKey(Stop, on_delete=models.CASCADE, related_name='stop_activities')
    activity = models.ForeignKey(Activity, on_delete=models.CASCADE)
    scheduled_date = models.DateField(null=True, blank=True)
    scheduled_time = models.TimeField(null=True, blank=True)
    notes = models.TextField(blank=True, default='')

    class Meta:
        ordering = ['scheduled_date', 'scheduled_time']

    def __str__(self):
        return f"{self.activity.name} at {self.stop.city.name}"


class PackingItem(models.Model):
    CATEGORY_CHOICES = [
        ('clothing', 'Clothing'),
        ('documents', 'Documents'),
        ('electronics', 'Electronics'),
        ('toiletries', 'Toiletries'),
        ('health', 'Health & Medicine'),
        ('other', 'Other'),
    ]

    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='packing_items')
    name = models.CharField(max_length=200)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='other')
    is_packed = models.BooleanField(default=False)

    class Meta:
        ordering = ['category', 'name']

    def __str__(self):
        return self.name


class TripNote(models.Model):
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='notes')
    stop = models.ForeignKey(Stop, on_delete=models.SET_NULL, null=True, blank=True, related_name='trip_notes')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Note for {self.trip.name}"


class CommunityPost(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='community_posts')
    city = models.ForeignKey(City, on_delete=models.SET_NULL, null=True, blank=True, related_name='community_posts')
    title = models.CharField(max_length=200)
    content = models.TextField()
    image_url = models.TextField(blank=True, default='')
    likes = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title
