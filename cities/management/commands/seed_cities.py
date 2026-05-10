from django.core.management.base import BaseCommand
from cities.models import City, Activity


CITIES_DATA = [
    # Asia
    ("Tokyo", "Japan", "Asia", 8.5, 95),
    ("Kyoto", "Japan", "Asia", 7.0, 88),
    ("Osaka", "Japan", "Asia", 7.2, 82),
    ("Bangkok", "Thailand", "Asia", 4.5, 90),
    ("Chiang Mai", "Thailand", "Asia", 3.0, 75),
    ("Bali", "Indonesia", "Asia", 3.5, 92),
    ("Singapore", "Singapore", "Asia", 9.0, 89),
    ("Kuala Lumpur", "Malaysia", "Asia", 4.0, 78),
    ("Hanoi", "Vietnam", "Asia", 2.5, 72),
    ("Ho Chi Minh City", "Vietnam", "Asia", 3.0, 76),
    ("Hoi An", "Vietnam", "Asia", 2.5, 70),
    ("Seoul", "South Korea", "Asia", 6.5, 87),
    ("Busan", "South Korea", "Asia", 5.5, 68),
    ("Beijing", "China", "Asia", 5.5, 83),
    ("Shanghai", "China", "Asia", 7.0, 84),
    ("Hong Kong", "China", "Asia", 8.5, 86),
    ("Taipei", "Taiwan", "Asia", 5.5, 79),
    ("Kathmandu", "Nepal", "Asia", 2.5, 67),
    ("Delhi", "India", "Asia", 3.0, 78),
    ("Mumbai", "India", "Asia", 4.0, 74),
    ("Jaipur", "India", "Asia", 3.0, 71),
    ("Goa", "India", "Asia", 3.5, 73),
    ("Colombo", "Sri Lanka", "Asia", 3.0, 62),
    ("Dhaka", "Bangladesh", "Asia", 2.0, 50),
    ("Phnom Penh", "Cambodia", "Asia", 2.5, 60),
    ("Siem Reap", "Cambodia", "Asia", 3.0, 74),
    ("Yangon", "Myanmar", "Asia", 2.5, 58),
    ("Ulaanbaatar", "Mongolia", "Asia", 3.5, 48),
    ("Tbilisi", "Georgia", "Asia", 3.5, 65),
    ("Almaty", "Kazakhstan", "Asia", 4.0, 55),
    # Europe
    ("Paris", "France", "Europe", 9.5, 98),
    ("London", "UK", "Europe", 9.5, 97),
    ("Rome", "Italy", "Europe", 8.0, 96),
    ("Barcelona", "Spain", "Europe", 8.0, 94),
    ("Amsterdam", "Netherlands", "Europe", 8.5, 91),
    ("Prague", "Czech Republic", "Europe", 5.5, 90),
    ("Vienna", "Austria", "Europe", 8.0, 88),
    ("Berlin", "Germany", "Europe", 7.0, 87),
    ("Budapest", "Hungary", "Europe", 5.0, 89),
    ("Lisbon", "Portugal", "Europe", 6.5, 86),
    ("Porto", "Portugal", "Europe", 6.0, 82),
    ("Madrid", "Spain", "Europe", 7.5, 85),
    ("Seville", "Spain", "Europe", 6.5, 78),
    ("Florence", "Italy", "Europe", 8.0, 87),
    ("Venice", "Italy", "Europe", 8.5, 85),
    ("Milan", "Italy", "Europe", 8.5, 80),
    ("Athens", "Greece", "Europe", 6.5, 84),
    ("Santorini", "Greece", "Europe", 8.5, 83),
    ("Dublin", "Ireland", "Europe", 8.0, 79),
    ("Edinburgh", "UK", "Europe", 7.5, 80),
    ("Copenhagen", "Denmark", "Europe", 9.0, 82),
    ("Stockholm", "Sweden", "Europe", 9.0, 81),
    ("Oslo", "Norway", "Europe", 9.5, 76),
    ("Helsinki", "Finland", "Europe", 8.5, 74),
    ("Warsaw", "Poland", "Europe", 5.0, 72),
    ("Krakow", "Poland", "Europe", 4.5, 76),
    ("Dubrovnik", "Croatia", "Europe", 7.5, 82),
    ("Split", "Croatia", "Europe", 6.5, 74),
    ("Ljubljana", "Slovenia", "Europe", 6.0, 68),
    ("Riga", "Latvia", "Europe", 5.0, 65),
    ("Tallinn", "Estonia", "Europe", 5.5, 67),
    ("Vilnius", "Lithuania", "Europe", 4.5, 64),
    ("Zurich", "Switzerland", "Europe", 10.0, 78),
    ("Geneva", "Switzerland", "Europe", 10.0, 75),
    ("Brussels", "Belgium", "Europe", 7.5, 73),
    ("Bruges", "Belgium", "Europe", 7.0, 76),
    ("Reykjavik", "Iceland", "Europe", 9.5, 77),
    ("Valletta", "Malta", "Europe", 6.5, 68),
    ("Nicosia", "Cyprus", "Europe", 6.0, 60),
    ("Sarajevo", "Bosnia", "Europe", 4.0, 62),
    ("Skopje", "North Macedonia", "Europe", 3.5, 55),
    ("Tirana", "Albania", "Europe", 3.0, 54),
    # Americas
    ("New York", "USA", "Americas", 9.5, 97),
    ("Los Angeles", "USA", "Americas", 8.5, 91),
    ("Miami", "USA", "Americas", 8.0, 88),
    ("Chicago", "USA", "Americas", 7.5, 84),
    ("San Francisco", "USA", "Americas", 9.0, 87),
    ("New Orleans", "USA", "Americas", 7.0, 80),
    ("Las Vegas", "USA", "Americas", 8.0, 83),
    ("Seattle", "USA", "Americas", 7.5, 78),
    ("Boston", "USA", "Americas", 8.0, 79),
    ("Washington DC", "USA", "Americas", 7.5, 82),
    ("Toronto", "Canada", "Americas", 7.5, 83),
    ("Vancouver", "Canada", "Americas", 8.0, 81),
    ("Montreal", "Canada", "Americas", 7.0, 78),
    ("Mexico City", "Mexico", "Americas", 5.0, 80),
    ("Cancun", "Mexico", "Americas", 6.5, 82),
    ("Havana", "Cuba", "Americas", 4.0, 74),
    ("Rio de Janeiro", "Brazil", "Americas", 5.5, 87),
    ("Sao Paulo", "Brazil", "Americas", 5.5, 76),
    ("Buenos Aires", "Argentina", "Americas", 5.0, 82),
    ("Lima", "Peru", "Americas", 4.5, 73),
    ("Cusco", "Peru", "Americas", 4.0, 79),
    ("Bogota", "Colombia", "Americas", 4.5, 70),
    ("Cartagena", "Colombia", "Americas", 5.0, 75),
    ("Quito", "Ecuador", "Americas", 3.5, 68),
    ("Santiago", "Chile", "Americas", 6.0, 72),
    ("Medellin", "Colombia", "Americas", 4.0, 73),
    ("La Paz", "Bolivia", "Americas", 3.0, 62),
    ("Montevideo", "Uruguay", "Americas", 5.5, 64),
    ("Asuncion", "Paraguay", "Americas", 3.0, 52),
    ("Georgetown", "Guyana", "Americas", 3.5, 48),
    # Africa
    ("Cape Town", "South Africa", "Africa", 6.5, 89),
    ("Marrakech", "Morocco", "Africa", 4.5, 86),
    ("Cairo", "Egypt", "Africa", 4.0, 82),
    ("Nairobi", "Kenya", "Africa", 4.5, 73),
    ("Zanzibar", "Tanzania", "Africa", 4.5, 77),
    ("Accra", "Ghana", "Africa", 4.0, 62),
    ("Lagos", "Nigeria", "Africa", 4.5, 60),
    ("Addis Ababa", "Ethiopia", "Africa", 3.0, 58),
    ("Tunis", "Tunisia", "Africa", 4.0, 66),
    ("Casablanca", "Morocco", "Africa", 5.0, 68),
    ("Dakar", "Senegal", "Africa", 3.5, 60),
    ("Kampala", "Uganda", "Africa", 3.0, 55),
    ("Kigali", "Rwanda", "Africa", 3.5, 60),
    ("Windhoek", "Namibia", "Africa", 5.0, 56),
    ("Lusaka", "Zambia", "Africa", 3.5, 50),
    # Oceania
    ("Sydney", "Australia", "Oceania", 9.0, 92),
    ("Melbourne", "Australia", "Oceania", 8.5, 88),
    ("Brisbane", "Australia", "Oceania", 7.5, 78),
    ("Auckland", "New Zealand", "Oceania", 8.5, 80),
    ("Queenstown", "New Zealand", "Oceania", 8.0, 79),
    ("Fiji", "Fiji", "Oceania", 6.0, 76),
    ("Nadi", "Fiji", "Oceania", 5.5, 68),
    ("Port Vila", "Vanuatu", "Oceania", 5.0, 55),
    ("Suva", "Fiji", "Oceania", 4.5, 52),
    ("Wellington", "New Zealand", "Oceania", 7.5, 72),
    # Middle East
    ("Dubai", "UAE", "Middle East", 9.5, 91),
    ("Abu Dhabi", "UAE", "Middle East", 9.0, 83),
    ("Istanbul", "Turkey", "Middle East", 6.0, 90),
    ("Tel Aviv", "Israel", "Middle East", 8.5, 78),
    ("Jerusalem", "Israel", "Middle East", 6.0, 76),
    ("Amman", "Jordan", "Middle East", 5.5, 68),
    ("Beirut", "Lebanon", "Middle East", 6.0, 65),
    ("Muscat", "Oman", "Middle East", 7.0, 66),
    ("Riyadh", "Saudi Arabia", "Middle East", 8.0, 64),
    ("Doha", "Qatar", "Middle East", 9.0, 72),
]

ACTIVITIES_TEMPLATE = [
    ("City Walking Tour", "tour", 25, 3.0),
    ("Local Food Market Visit", "food", 15, 2.0),
    ("Museum Entry", "culture", 20, 2.5),
    ("Historical Sites Tour", "tour", 35, 4.0),
    ("Street Food Tour", "food", 30, 3.0),
    ("Sunset Viewpoint", "nature", 5, 1.5),
    ("Local Cooking Class", "food", 60, 3.5),
    ("Bicycle City Tour", "adventure", 20, 3.0),
    ("Night Market Visit", "food", 10, 2.0),
    ("Cultural Dance Show", "culture", 40, 2.0),
    ("Day Hiking Trip", "adventure", 30, 6.0),
    ("Boat/River Cruise", "nature", 45, 2.5),
    ("Art Gallery Visit", "culture", 15, 2.0),
    ("Shopping District Tour", "shopping", 0, 3.0),
    ("Yoga/Wellness Session", "culture", 25, 1.5),
]


class Command(BaseCommand):
    help = 'Seed the database with cities and activities'

    def handle(self, *args, **kwargs):
        if City.objects.count() >= 100:
            self.stdout.write('Cities already seeded, skipping.')
            return

        self.stdout.write('Seeding cities and activities...')
        for name, country, region, cost_index, popularity in CITIES_DATA:
            city, created = City.objects.get_or_create(
                name=name, country=country,
                defaults={
                    'region': region, 'cost_index': cost_index,
                    'popularity': popularity,
                    'description': f"Explore the amazing city of {name} in {country}. A must-visit destination in {region}."
                }
            )
            if created:
                for act_name, category, cost, duration in ACTIVITIES_TEMPLATE:
                    Activity.objects.get_or_create(
                        city=city, name=act_name,
                        defaults={'category': category, 'cost': cost * (cost_index / 5), 'duration_hrs': duration}
                    )

        self.stdout.write(self.style.SUCCESS(f'Seeded {City.objects.count()} cities.'))
