from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from trips.models import CommunityPost
from cities.models import City


POSTS = [
    ("Hidden Gems of Tokyo", "Tokyo changed my life. The blend of ancient temples and futuristic tech left me speechless. Must visit Yanaka district!"),
    ("Backpacking Southeast Asia on a Budget", "Traveled through Vietnam, Cambodia, and Thailand for 3 months with just $40/day. Here's how I did it."),
    ("The Magic of Santorini at Sunset", "There's nothing quite like watching the sun dip into the Aegean from Oia. Pure magic every single evening."),
    ("Why Medellín Surprised Me", "I came with low expectations and left completely enchanted. The people, the food, the transformation of this city is incredible."),
    ("A Week in Marrakech - What to Expect", "The souks, the riad architecture, and the mint tea. Marrakech is a sensory overload in the best possible way."),
    ("First Solo Trip: Cape Town", "As a solo traveler, Cape Town offered everything — adventure, culture, and safety. Table Mountain is just the beginning."),
]


class Command(BaseCommand):
    help = 'Seed community posts'

    def handle(self, *args, **kwargs):
        if CommunityPost.objects.count() >= 6:
            self.stdout.write('Community posts already seeded, skipping.')
            return

        admin = User.objects.filter(is_superuser=True).first()
        if not admin:
            self.stdout.write('No admin user found, skipping community seed.')
            return

        cities = list(City.objects.all())
        for i, (title, content) in enumerate(POSTS):
            city = cities[i * 15 % len(cities)] if cities else None
            CommunityPost.objects.get_or_create(
                title=title,
                defaults={'user': admin, 'city': city, 'content': content, 'likes': (i + 1) * 7}
            )

        self.stdout.write(self.style.SUCCESS(f'Seeded {CommunityPost.objects.count()} community posts.'))
