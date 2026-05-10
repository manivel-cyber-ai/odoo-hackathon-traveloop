from django.core.management.base import BaseCommand
from django.contrib.auth.models import User


class Command(BaseCommand):
    help = 'Create admin user'

    def handle(self, *args, **kwargs):
        if User.objects.filter(username='admin').exists():
            self.stdout.write('Admin already exists, skipping.')
            return
        User.objects.create_superuser(
            username='admin',
            email='admin@traveloop.com',
            password='Traveloop@Admin2024',
            first_name='Admin',
            last_name='Traveloop'
        )
        self.stdout.write(self.style.SUCCESS('Admin user created.'))
