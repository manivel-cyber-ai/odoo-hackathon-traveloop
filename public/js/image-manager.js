// Image cache with fallback support
class ImageManager {
  constructor() {
    this.cityImages = {
      'Tokyo': '/uploads/cities/tokyo.jpg',
      'Osaka': '/uploads/cities/osaka.jpg',
      'Kyoto': '/uploads/cities/kyoto.jpg',
      'Seoul': '/uploads/cities/seoul.jpg',
      'Bangkok': '/uploads/cities/bangkok.jpg',
      'Singapore': '/uploads/cities/singapore.jpg',
      'Hong Kong': '/uploads/cities/hong-kong.jpg',
      'Beijing': '/uploads/cities/beijing.jpg',
      'Shanghai': '/uploads/cities/shanghai.jpg',
      'London': '/uploads/cities/london.jpg',
      'Paris': '/uploads/cities/paris.jpg',
      'Barcelona': '/uploads/cities/barcelona.jpg',
      'Rome': '/uploads/cities/rome.jpg',
      'Amsterdam': '/uploads/cities/amsterdam.jpg',
      'Berlin': '/uploads/cities/berlin.jpg',
      'Vienna': '/uploads/cities/vienna.jpg',
      'Prague': '/uploads/cities/prague.jpg',
      'Istanbul': '/uploads/cities/istanbul.jpg',
      'New York': '/uploads/cities/new-york.jpg',
      'Los Angeles': '/uploads/cities/los-angeles.jpg',
      'Chicago': '/uploads/cities/chicago.jpg',
      'Miami': '/uploads/cities/miami.jpg',
      'San Francisco': '/uploads/cities/san-francisco.jpg',
      'Toronto': '/uploads/cities/toronto.jpg',
      'Vancouver': '/uploads/cities/vancouver.jpg',
      'Mexico City': '/uploads/cities/mexico-city.jpg',
      'Rio de Janeiro': '/uploads/cities/rio-de-janeiro.jpg',
      'Buenos Aires': '/uploads/cities/buenos-aires.jpg',
      'Santiago': '/uploads/cities/santiago.jpg',
      'Cairo': '/uploads/cities/cairo.jpg',
      'Nairobi': '/uploads/cities/nairobi.jpg',
      'Cape Town': '/uploads/cities/cape-town.jpg',
      'Sydney': '/uploads/cities/sydney.jpg',
      'Melbourne': '/uploads/cities/melbourne.jpg',
      'Auckland': '/uploads/cities/auckland.jpg',
      'Dubai': '/uploads/cities/dubai.jpg'
    };
    
    // Fallback generic travel image
    this.fallback = '/uploads/cities/travel-fallback.jpg';
  }

  getCityImage(cityName) {
    return this.cityImages[cityName] || this.fallback;
  }

  generatePlaceholder(city, color = '#4267B2') {
    // Generate a color placeholder SVG that displays instantly
    const firstChar = city.charAt(0).toUpperCase();
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Crect fill='${color}' width='800' height='600'/%3E%3Ctext x='50%25' y='50%25' font-size='120' fill='white' text-anchor='middle' dy='.3em' font-family='Arial'%3E${firstChar}%3C/text%3E%3Ctext x='50%25' y='60%25' font-size='40' fill='rgba(255,255,255,0.7)' text-anchor='middle' font-family='Arial'%3E${city}%3C/text%3E%3C/svg%3E`;
  }

  getColoredFallback(city) {
    // Use deterministic colors based on city name
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
      '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B88B', '#82E0AA',
      '#5DADE2', '#F1948A', '#AED6F1', '#F5B7B1', '#D7BDE2'
    ];
    
    let hash = 0;
    for (let i = 0; i < city.length; i++) {
      hash = ((hash << 5) - hash) + city.charCodeAt(i);
      hash = hash & hash;
    }
    
    const color = colors[Math.abs(hash) % colors.length];
    return this.generatePlaceholder(city, color);
  }
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ImageManager;
}
