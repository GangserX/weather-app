# 🌤️ Weather Forecast Web App

A modern, responsive weather forecast application built with HTML, CSS, and Vanilla JavaScript. Features real-time weather data, 5-day forecasts, interactive charts, maps, and PWA support.

![Weather App Preview](https://img.shields.io/badge/Status-Ready-brightgreen)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

## ✨ Features

### 🌍 Core Weather Features
- **City Search**: Search weather by city name with autocomplete suggestions
- **Current Location**: Automatic weather detection using Geolocation API
- **Real-time Data**: Current temperature, humidity, pressure, wind speed
- **Sunrise/Sunset**: Accurate sunrise and sunset times
- **Weather Icons**: Dynamic weather icons and backgrounds

### 🎛️ Advanced Features
- **Unit Toggle**: Switch between Celsius and Fahrenheit
- **Theme Toggle**: Dark/Light mode with system preference detection
- **Voice Search**: Search cities using Web Speech API
- **5-Day Forecast**: Detailed daily weather predictions
- **Temperature Chart**: Interactive trend visualization using Chart.js
- **Air Quality Index**: Real-time AQI with color-coded status

### 🗺️ Location & Maps
- **Interactive Map**: Leaflet.js integration with weather layers
- **Location Markers**: Visual markers for searched cities
- **Recent Searches**: Quick access to previously searched cities

### 📱 Progressive Web App (PWA)
- **Installable**: Add to home screen on mobile devices
- **Offline Support**: Cached data for offline viewing
- **Service Worker**: Background sync and caching
- **Responsive Design**: Mobile-first, responsive layout

## 🚀 Quick Start

### Prerequisites
- Modern web browser with JavaScript enabled
- OpenWeatherMap API key (free registration required)

### Setup Instructions

1. **Clone or Download** the project files to your local machine

2. **Get OpenWeatherMap API Key**:
   - Visit [OpenWeatherMap](https://openweathermap.org/api)
   - Sign up for a free account
   - Navigate to API Keys section
   - Copy your API key

3. **Configure API Key**:
   - Open `script.js` file
   - Find line 4: `this.API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY';`
   - Replace `'YOUR_OPENWEATHERMAP_API_KEY'` with your actual API key
   ```javascript
   this.API_KEY = 'your_actual_api_key_here';
   ```

4. **Launch the Application**:
   - Open `index.html` in your web browser
   - Or serve using a local web server (recommended for full functionality)

### Using a Local Server (Recommended)

For full functionality including PWA features, serve the app using a local server:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (if you have http-server installed)
npx http-server

# Using PHP
php -S localhost:8000
```

Then visit `http://localhost:8000` in your browser.

## 📖 Usage Guide

### Basic Weather Search
1. **Search by City**: Type a city name in the search box and press Enter or click the search button
2. **Voice Search**: Click the microphone button and speak the city name
3. **Current Location**: Click the location button to get weather for your current location

### Advanced Features
- **Theme Toggle**: Click the moon/sun icon to switch between dark and light themes
- **Unit Toggle**: Click the °F/°C button to switch temperature units
- **Recent Searches**: Click on any recent search tag to quickly search again
- **Install App**: Click "Install" when prompted to add the app to your home screen

### Understanding the Interface
- **Main Weather Card**: Current temperature, condition, and location
- **Details Grid**: Humidity, wind speed, pressure, visibility, sunrise/sunset
- **Air Quality**: AQI value with color-coded status
- **Temperature Chart**: 5-day temperature trend visualization
- **Forecast Cards**: Daily weather predictions with highs/lows
- **Interactive Map**: Location marker with weather overlay

## 🛠️ Technical Details

### File Structure
```
weather-app/
├── index.html          # Main HTML structure
├── style.css           # Responsive CSS styles
├── script.js           # JavaScript functionality
├── manifest.json       # PWA manifest
├── sw.js              # Service worker for offline support
└── README.md          # This documentation
```

### Dependencies
- **Chart.js**: Temperature trend visualization
- **Leaflet.js**: Interactive maps
- **OpenWeatherMap API**: Weather data source

### Browser Compatibility
- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

### APIs Used
- **OpenWeatherMap Current Weather API**: Real-time weather data
- **OpenWeatherMap 5-Day Forecast API**: Weather predictions
- **OpenWeatherMap Air Pollution API**: Air quality data
- **Geolocation API**: User location detection
- **Web Speech API**: Voice search functionality

## 🎨 Customization

### Themes
The app supports both light and dark themes with CSS custom properties. Modify the `:root` and `[data-theme="dark"]` sections in `style.css` to customize colors.

### Weather Backgrounds
Dynamic backgrounds change based on weather conditions. Add new weather types in the `weatherStyles` section of `script.js`.

### Chart Styling
Customize the temperature chart appearance by modifying the Chart.js configuration in the `createTemperatureChart()` method.

## 🔧 Troubleshooting

### Common Issues

**"Please add your OpenWeatherMap API key"**
- Ensure you've replaced `YOUR_OPENWEATHERMAP_API_KEY` with your actual API key in `script.js`

**"City not found"**
- Check spelling of the city name
- Try including country code (e.g., "London, UK")

**Voice search not working**
- Ensure you're using a supported browser (Chrome, Edge)
- Check microphone permissions

**Location not detected**
- Allow location permissions in your browser
- Ensure you're using HTTPS or localhost

**PWA install not showing**
- Use a local server instead of opening the file directly
- Ensure your browser supports PWA installation

### Performance Tips
- The app caches weather data for offline use
- Recent searches are stored locally for quick access
- Service worker enables background updates

## 🌟 Features Breakdown

### Responsive Design
- Mobile-first approach with flexible grid layouts
- Touch-friendly interface elements
- Optimized for screens from 320px to 1200px+

### Accessibility
- ARIA labels for screen readers
- Keyboard navigation support
- High contrast mode compatibility
- Reduced motion preferences respected

### Performance
- Lazy loading of map components
- Efficient API request batching
- Local storage for user preferences
- Service worker caching strategy

## 📱 PWA Features

### Installation
- Add to home screen on mobile devices
- Desktop installation support
- Custom app icon and splash screen

### Offline Functionality
- Cached weather data for last searched location
- Offline-first approach with service worker
- Background sync when connection restored

## 🤝 Contributing

Feel free to contribute to this project by:
- Reporting bugs
- Suggesting new features
- Improving documentation
- Submitting pull requests

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **OpenWeatherMap** for providing comprehensive weather data
- **Chart.js** for beautiful chart visualizations
- **Leaflet** for interactive mapping capabilities
- **Material Design** for UI/UX inspiration

---

**Enjoy using your Weather Forecast App! 🌤️**

For support or questions, please check the troubleshooting section above or create an issue in the project repository.
