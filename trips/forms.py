from django import forms
from .models import Trip, Stop, StopActivity, PackingItem, TripNote, CommunityPost


class TripForm(forms.ModelForm):
    class Meta:
        model = Trip
        fields = ('name', 'description', 'start_date', 'end_date', 'cover_photo', 'is_public', 'budget_limit')
        widgets = {
            'start_date': forms.DateInput(attrs={'type': 'date'}),
            'end_date': forms.DateInput(attrs={'type': 'date'}),
            'description': forms.Textarea(attrs={'rows': 3}),
        }


class StopForm(forms.ModelForm):
    class Meta:
        model = Stop
        fields = ('city', 'arrival_date', 'departure_date', 'transport_cost', 'stay_cost', 'notes')
        widgets = {
            'arrival_date': forms.DateInput(attrs={'type': 'date'}),
            'departure_date': forms.DateInput(attrs={'type': 'date'}),
            'notes': forms.Textarea(attrs={'rows': 2}),
        }


class StopActivityForm(forms.ModelForm):
    class Meta:
        model = StopActivity
        fields = ('activity', 'scheduled_date', 'scheduled_time', 'notes')
        widgets = {
            'scheduled_date': forms.DateInput(attrs={'type': 'date'}),
            'scheduled_time': forms.TimeInput(attrs={'type': 'time'}),
        }

    def __init__(self, *args, stop=None, **kwargs):
        super().__init__(*args, **kwargs)
        if stop:
            from cities.models import Activity
            self.fields['activity'].queryset = Activity.objects.filter(city=stop.city)


class PackingItemForm(forms.ModelForm):
    class Meta:
        model = PackingItem
        fields = ('name', 'category')


class TripNoteForm(forms.ModelForm):
    class Meta:
        model = TripNote
        fields = ('content', 'stop')
        widgets = {'content': forms.Textarea(attrs={'rows': 4})}

    def __init__(self, *args, trip=None, **kwargs):
        super().__init__(*args, **kwargs)
        if trip:
            self.fields['stop'].queryset = trip.stops.all()
            self.fields['stop'].required = False


class CommunityPostForm(forms.ModelForm):
    class Meta:
        model = CommunityPost
        fields = ('title', 'content', 'city', 'image_url')
        widgets = {'content': forms.Textarea(attrs={'rows': 5})}
