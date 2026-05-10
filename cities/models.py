from django.db import models


class City(models.Model):
    name = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    region = models.CharField(max_length=100, default='')
    cost_index = models.DecimalField(max_digits=4, decimal_places=1, default=5.0)
    popularity = models.IntegerField(default=50)
    description = models.TextField(blank=True, default='')
    image_url = models.TextField(blank=True, default='')

    class Meta:
        verbose_name_plural = 'cities'
        ordering = ['-popularity']

    def __str__(self):
        return f"{self.name}, {self.country}"


class Activity(models.Model):
    CATEGORY_CHOICES = [
        ('food', 'Food & Dining'),
        ('tour', 'Tours & Sightseeing'),
        ('adventure', 'Adventure'),
        ('culture', 'Culture & Arts'),
        ('nature', 'Nature & Parks'),
        ('shopping', 'Shopping'),
        ('nightlife', 'Nightlife'),
    ]

    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name='activities')
    name = models.CharField(max_length=200)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='tour')
    cost = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    duration_hrs = models.DecimalField(max_digits=4, decimal_places=1, default=2.0)
    description = models.TextField(blank=True, default='')
    image_url = models.TextField(blank=True, default='')

    class Meta:
        verbose_name_plural = 'activities'
        ordering = ['category', 'name']

    def __str__(self):
        return f"{self.name} ({self.city.name})"
