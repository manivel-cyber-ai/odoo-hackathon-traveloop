from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.db.models import Q
from .models import City, Activity


@login_required
def city_list(request):
    cities = City.objects.all()
    query = request.GET.get('q', '')
    country = request.GET.get('country', '')
    region = request.GET.get('region', '')

    if query:
        cities = cities.filter(Q(name__icontains=query) | Q(country__icontains=query))
    if country:
        cities = cities.filter(country__icontains=country)
    if region:
        cities = cities.filter(region__icontains=region)

    countries = City.objects.values_list('country', flat=True).distinct().order_by('country')
    regions = City.objects.values_list('region', flat=True).distinct().order_by('region')

    return render(request, 'cities/city_list.html', {
        'cities': cities, 'query': query, 'country': country,
        'region': region, 'countries': countries, 'regions': regions,
    })


@login_required
def city_detail(request, city_id):
    city = get_object_or_404(City, pk=city_id)
    activities = city.activities.all()
    category = request.GET.get('category', '')
    if category:
        activities = activities.filter(category=category)

    from trips.models import Trip
    user_trips = Trip.objects.filter(user=request.user)

    return render(request, 'cities/city_detail.html', {
        'city': city, 'activities': activities, 'category': category,
        'categories': Activity.CATEGORY_CHOICES, 'user_trips': user_trips,
    })
