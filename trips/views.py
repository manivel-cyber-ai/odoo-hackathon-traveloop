import json
import os
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from cities.models import City
from .models import Trip, Stop, StopActivity, PackingItem, TripNote, CommunityPost
from .forms import TripForm, StopForm, StopActivityForm, PackingItemForm, TripNoteForm, CommunityPostForm


@login_required
def dashboard(request):
    recent_trips = Trip.objects.filter(user=request.user)[:3]
    top_cities = City.objects.all()[:6]
    community_posts = CommunityPost.objects.select_related('user', 'city')[:6]
    total_trips = Trip.objects.filter(user=request.user).count()
    return render(request, 'trips/dashboard.html', {
        'recent_trips': recent_trips, 'top_cities': top_cities,
        'community_posts': community_posts, 'total_trips': total_trips,
    })


@login_required
def trip_list(request):
    trips = Trip.objects.filter(user=request.user)
    return render(request, 'trips/trip_list.html', {'trips': trips})


@login_required
def trip_create(request):
    if request.method == 'POST':
        form = TripForm(request.POST)
        if form.is_valid():
            trip = form.save(commit=False)
            trip.user = request.user
            trip.save()
            messages.success(request, f'Trip "{trip.name}" created!')
            return redirect('trip_detail', trip_id=trip.id)
    else:
        form = TripForm()
    return render(request, 'trips/trip_form.html', {'form': form, 'action': 'Create'})


@login_required
def trip_detail(request, trip_id):
    trip = get_object_or_404(Trip, pk=trip_id, user=request.user)
    stops = trip.stops.prefetch_related('stop_activities__activity', 'city').all()
    cities = City.objects.all()
    return render(request, 'trips/trip_detail.html', {
        'trip': trip, 'stops': stops, 'cities': cities,
    })


@login_required
def trip_edit(request, trip_id):
    trip = get_object_or_404(Trip, pk=trip_id, user=request.user)
    if request.method == 'POST':
        form = TripForm(request.POST, instance=trip)
        if form.is_valid():
            form.save()
            messages.success(request, 'Trip updated!')
            return redirect('trip_detail', trip_id=trip.id)
    else:
        form = TripForm(instance=trip)
    return render(request, 'trips/trip_form.html', {'form': form, 'trip': trip, 'action': 'Edit'})


@login_required
def trip_delete(request, trip_id):
    trip = get_object_or_404(Trip, pk=trip_id, user=request.user)
    if request.method == 'POST':
        trip.delete()
        messages.success(request, 'Trip deleted.')
        return redirect('trip_list')
    return render(request, 'trips/trip_confirm_delete.html', {'trip': trip})


@login_required
def trip_view(request, trip_id):
    trip = get_object_or_404(Trip, pk=trip_id, user=request.user)
    stops = trip.stops.prefetch_related('stop_activities__activity', 'city').all()
    return render(request, 'trips/trip_view.html', {'trip': trip, 'stops': stops})


@login_required
def trip_budget(request, trip_id):
    trip = get_object_or_404(Trip, pk=trip_id, user=request.user)
    stops = trip.stops.prefetch_related('stop_activities__activity').all()
    transport_total = sum(float(s.transport_cost or 0) for s in stops)
    stay_total = sum(float(s.stay_cost or 0) for s in stops)
    activity_total = sum(
        sum(float(sa.activity.cost or 0) for sa in s.stop_activities.all()) for s in stops
    )
    grand_total = transport_total + stay_total + activity_total
    over_budget = trip.budget_limit and grand_total > float(trip.budget_limit)
    return render(request, 'trips/trip_budget.html', {
        'trip': trip, 'stops': stops, 'transport_total': transport_total,
        'stay_total': stay_total, 'activity_total': activity_total,
        'grand_total': grand_total, 'over_budget': over_budget,
    })


@login_required
def trip_packing(request, trip_id):
    trip = get_object_or_404(Trip, pk=trip_id, user=request.user)
    category = request.GET.get('category', '')
    items = trip.packing_items.filter(category=category) if category else trip.packing_items.all()
    if request.method == 'POST':
        form = PackingItemForm(request.POST)
        if form.is_valid():
            item = form.save(commit=False)
            item.trip = trip
            item.save()
            messages.success(request, 'Item added!')
            return redirect('trip_packing', trip_id=trip.id)
    else:
        form = PackingItemForm()
    return render(request, 'trips/trip_packing.html', {
        'trip': trip, 'items': items, 'form': form, 'category': category,
        'categories': PackingItem.CATEGORY_CHOICES,
        'packed_count': trip.packing_items.filter(is_packed=True).count(),
        'total_count': trip.packing_items.count(),
    })


@login_required
def trip_notes(request, trip_id):
    trip = get_object_or_404(Trip, pk=trip_id, user=request.user)
    if request.method == 'POST':
        form = TripNoteForm(request.POST, trip=trip)
        if form.is_valid():
            note = form.save(commit=False)
            note.trip = trip
            note.save()
            messages.success(request, 'Note added!')
            return redirect('trip_notes', trip_id=trip.id)
    else:
        form = TripNoteForm(trip=trip)
    return render(request, 'trips/trip_notes.html', {
        'trip': trip, 'notes': trip.notes.select_related('stop').all(), 'form': form,
    })


@login_required
def stop_add(request, trip_id):
    trip = get_object_or_404(Trip, pk=trip_id, user=request.user)
    if request.method == 'POST':
        form = StopForm(request.POST)
        if form.is_valid():
            stop = form.save(commit=False)
            stop.trip = trip
            stop.order_index = trip.stops.count()
            stop.save()
            messages.success(request, f'Stop added: {stop.city.name}')
        else:
            messages.error(request, 'Error adding stop.')
    return redirect('trip_detail', trip_id=trip.id)


@login_required
def stop_delete(request, trip_id, stop_id):
    trip = get_object_or_404(Trip, pk=trip_id, user=request.user)
    stop = get_object_or_404(Stop, pk=stop_id, trip=trip)
    if request.method == 'POST':
        stop.delete()
        messages.success(request, 'Stop removed.')
    return redirect('trip_detail', trip_id=trip.id)


@login_required
def activity_add(request, trip_id, stop_id):
    trip = get_object_or_404(Trip, pk=trip_id, user=request.user)
    stop = get_object_or_404(Stop, pk=stop_id, trip=trip)
    if request.method == 'POST':
        form = StopActivityForm(request.POST, stop=stop)
        if form.is_valid():
            sa = form.save(commit=False)
            sa.stop = stop
            sa.save()
            messages.success(request, 'Activity added!')
    return redirect('trip_detail', trip_id=trip.id)


@login_required
def activity_delete(request, trip_id, stop_id, sa_id):
    trip = get_object_or_404(Trip, pk=trip_id, user=request.user)
    stop = get_object_or_404(Stop, pk=stop_id, trip=trip)
    sa = get_object_or_404(StopActivity, pk=sa_id, stop=stop)
    if request.method == 'POST':
        sa.delete()
    return redirect('trip_detail', trip_id=trip.id)


@login_required
@require_POST
def stop_reorder(request, trip_id):
    trip = get_object_or_404(Trip, pk=trip_id, user=request.user)
    try:
        data = json.loads(request.body)
        for idx, stop_id in enumerate(data.get('order', [])):
            Stop.objects.filter(pk=stop_id, trip=trip).update(order_index=idx)
        return JsonResponse({'success': True})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=400)


@login_required
@require_POST
def packing_toggle(request, trip_id, item_id):
    trip = get_object_or_404(Trip, pk=trip_id, user=request.user)
    item = get_object_or_404(PackingItem, pk=item_id, trip=trip)
    item.is_packed = not item.is_packed
    item.save()
    return JsonResponse({'success': True, 'is_packed': item.is_packed})


@login_required
def packing_delete(request, trip_id, item_id):
    trip = get_object_or_404(Trip, pk=trip_id, user=request.user)
    item = get_object_or_404(PackingItem, pk=item_id, trip=trip)
    if request.method == 'POST':
        item.delete()
    return redirect('trip_packing', trip_id=trip.id)


@login_required
def note_delete(request, trip_id, note_id):
    trip = get_object_or_404(Trip, pk=trip_id, user=request.user)
    note = get_object_or_404(TripNote, pk=note_id, trip=trip)
    if request.method == 'POST':
        note.delete()
    return redirect('trip_notes', trip_id=trip.id)


@login_required
def ai_suggest(request, trip_id, stop_id):
    trip = get_object_or_404(Trip, pk=trip_id, user=request.user)
    stop = get_object_or_404(Stop, pk=stop_id, trip=trip)
    api_key = os.environ.get('ANTHROPIC_API_KEY', '')
    if not api_key:
        return JsonResponse({'error': 'AI feature not configured. Add ANTHROPIC_API_KEY.'}, status=503)
    try:
        import anthropic
        client = anthropic.Anthropic(api_key=api_key)
        prompt = (
            f"Suggest 5 activities for {stop.city.name}, {stop.city.country}. "
            "Return ONLY a JSON array. Each item must have: name (string), "
            "category (one of: food, tour, adventure, culture, nature), "
            "cost_usd (number), duration_hrs (number), description (string, max 100 chars)."
        )
        message = client.messages.create(
            model="claude-sonnet-4-5", max_tokens=1024,
            messages=[{"role": "user", "content": prompt}]
        )
        content = message.content[0].text.strip()
        if content.startswith('```'):
            content = content.split('```')[1]
            if content.startswith('json'):
                content = content[4:]
        suggestions = json.loads(content)
        return JsonResponse({'suggestions': suggestions, 'city': stop.city.name})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@login_required
@require_POST
def ai_add_activity(request, trip_id, stop_id):
    trip = get_object_or_404(Trip, pk=trip_id, user=request.user)
    stop = get_object_or_404(Stop, pk=stop_id, trip=trip)
    try:
        data = json.loads(request.body)
        from cities.models import Activity
        activity = Activity.objects.create(
            city=stop.city,
            name=data.get('name', 'AI Suggested Activity'),
            category=data.get('category', 'tour'),
            cost=float(data.get('cost_usd', 0)),
            duration_hrs=float(data.get('duration_hrs', 1)),
            description=data.get('description', '')
        )
        StopActivity.objects.create(stop=stop, activity=activity)
        return JsonResponse({'success': True, 'activity': activity.name})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=400)


def trip_share(request, share_token):
    trip = get_object_or_404(Trip, share_token=share_token, is_public=True)
    stops = trip.stops.prefetch_related('stop_activities__activity', 'city').all()
    return render(request, 'trips/trip_share.html', {'trip': trip, 'stops': stops})


@login_required
def community_list(request):
    city_filter = request.GET.get('city', '')
    posts = CommunityPost.objects.select_related('user', 'city').all()
    if city_filter:
        posts = posts.filter(city_id=city_filter)
    return render(request, 'trips/community_list.html', {
        'posts': posts, 'cities': City.objects.all()[:20], 'city_filter': city_filter,
    })


@login_required
def community_create(request):
    if request.method == 'POST':
        form = CommunityPostForm(request.POST)
        if form.is_valid():
            post = form.save(commit=False)
            post.user = request.user
            post.save()
            messages.success(request, 'Post created!')
            return redirect('community_list')
    else:
        form = CommunityPostForm()
    return render(request, 'trips/community_form.html', {'form': form})


@login_required
def community_delete(request, post_id):
    post = get_object_or_404(CommunityPost, pk=post_id, user=request.user)
    if request.method == 'POST':
        post.delete()
    return redirect('community_list')


@login_required
@require_POST
def community_like(request, post_id):
    post = get_object_or_404(CommunityPost, pk=post_id)
    post.likes += 1
    post.save()
    return JsonResponse({'likes': post.likes})
