// Weather App JavaScript
class WeatherApp {
    constructor() {
        this.API_KEY = '7274b2e25df9c984301051b81b9d82a7'; // Replace with your actual API key
        this.currentUnit = 'metric'; // 'metric' for Celsius, 'imperial' for Fahrenheit
        this.currentTheme = this.getSystemTheme();
        this.recentSearches = this.getRecentSearches();
        this.currentWeatherData = null;
        this.forecastData = null;
        this.temperatureChart = null;
        this.weatherMap = null;
        this.currentLocation = null;
        
        this.initializeApp();
    }

    initializeApp() {
        this.initializeElements();
        this.setupEventListeners();
        this.initializeTheme();
        this.displayRecentSearches();
        this.initializePWA();
        this.getCurrentLocationWeather();
    }

    initializeElements() {
        // Search elements
        this.cityInput = document.getElementById('cityInput');
        this.searchBtn = document.getElementById('searchBtn');
        this.voiceBtn = document.getElementById('voiceBtn');
        this.locationBtn = document.getElementById('locationBtn');
        this.recentSearchesContainer = document.getElementById('recentSearches');

        // Control elements
        this.themeToggle = document.getElementById('themeToggle');
        this.unitToggle = document.getElementById('unitToggle');

        // Display elements
        this.loadingSkeleton = document.getElementById('loadingSkeleton');
        this.errorContainer = document.getElementById('errorContainer');
        this.mainContent = document.getElementById('mainContent');
        this.errorMessage = document.getElementById('errorMessage');
        this.errorRetryBtn = document.getElementById('errorRetryBtn');

        // Weather display elements
        this.cityName = document.getElementById('cityName');
        this.countryName = document.getElementById('countryName');
        this.dateTime = document.getElementById('dateTime');
        this.weatherIcon = document.getElementById('weatherIcon');
        this.temperature = document.getElementById('temperature');
        this.feelsLike = document.getElementById('feelsLike');
        this.weatherCondition = document.getElementById('weatherCondition');
        this.weatherDescription = document.getElementById('weatherDescription');

        // Detail elements
        this.humidity = document.getElementById('humidity');
        this.windSpeed = document.getElementById('windSpeed');
        this.pressure = document.getElementById('pressure');
        this.visibility = document.getElementById('visibility');
        this.sunrise = document.getElementById('sunrise');
        this.sunset = document.getElementById('sunset');

        // Air quality elements
        this.aqiValue = document.getElementById('aqiValue');
        this.aqiStatus = document.getElementById('aqiStatus');
        this.aqiDescription = document.getElementById('aqiDescription');

        // Forecast elements
        this.forecastContainer = document.getElementById('forecastContainer');

        // PWA elements
        this.installPrompt = document.getElementById('installPrompt');
        this.installBtn = document.getElementById('installBtn');
        this.installClose = document.getElementById('installClose');
    }

    setupEventListeners() {
        // Search functionality
        this.searchBtn.addEventListener('click', () => this.handleSearch());
        this.cityInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSearch();
        });
        this.cityInput.addEventListener('input', () => this.handleInputChange());

        // Voice search
        this.voiceBtn.addEventListener('click', () => this.handleVoiceSearch());

        // Location search
        this.locationBtn.addEventListener('click', () => this.getCurrentLocationWeather());

        // Theme toggle
        this.themeToggle.addEventListener('click', () => this.toggleTheme());

        // Unit toggle
        this.unitToggle.addEventListener('click', () => this.toggleUnit());

        // Error retry
        this.errorRetryBtn.addEventListener('click', () => this.handleSearch());

        // PWA install
        this.installBtn.addEventListener('click', () => this.installPWA());
        this.installClose.addEventListener('click', () => this.hideInstallPrompt());

        // Update time every minute
        setInterval(() => this.updateDateTime(), 60000);
    }

    // Theme Management
    getSystemTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return localStorage.getItem('theme') || 'light';
    }

    initializeTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        this.updateThemeIcon();
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
        this.updateThemeIcon();
    }

    updateThemeIcon() {
        const icon = this.themeToggle.querySelector('.theme-icon');
        icon.textContent = this.currentTheme === 'light' ? '🌙' : '☀️';
    }

    // Unit Management
    toggleUnit() {
        this.currentUnit = this.currentUnit === 'metric' ? 'imperial' : 'metric';
        this.updateUnitDisplay();
        if (this.currentWeatherData) {
            this.displayWeatherData(this.currentWeatherData);
        }
        if (this.forecastData) {
            this.displayForecast(this.forecastData);
        }
        if (this.temperatureChart) {
            this.updateTemperatureChart();
        }
    }

    updateUnitDisplay() {
        const unitText = this.unitToggle.querySelector('.unit-text');
        unitText.textContent = this.currentUnit === 'metric' ? '°F' : '°C';
    }

    // Search Functionality
    async handleSearch() {
        const city = this.cityInput.value.trim();
        if (!city) return;

        this.showLoading();
        try {
            await this.getWeatherByCity(city);
            this.addToRecentSearches(city);
        } catch (error) {
            this.showError(error.message);
        }
    }

    handleInputChange() {
        // Clear error state when user starts typing
        this.hideError();
    }

    async getWeatherByCity(city) {
        if (!this.API_KEY || this.API_KEY === 'YOUR_OPENWEATHERMAP_API_KEY') {
            throw new Error('Please add your OpenWeatherMap API key to the script.js file');
        }

        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${this.API_KEY}&units=${this.currentUnit}`;
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${this.API_KEY}&units=${this.currentUnit}`;

        try {
            const [weatherResponse, forecastResponse] = await Promise.all([
                fetch(weatherUrl),
                fetch(forecastUrl)
            ]);

            if (!weatherResponse.ok) {
                if (weatherResponse.status === 404) {
                    throw new Error('City not found. Please check the spelling and try again.');
                }
                throw new Error('Failed to fetch weather data. Please try again.');
            }

            const weatherData = await weatherResponse.json();
            const forecastData = await forecastResponse.json();

            this.currentWeatherData = weatherData;
            this.forecastData = forecastData;
            this.currentLocation = { lat: weatherData.coord.lat, lon: weatherData.coord.lon };

            this.displayWeatherData(weatherData);
            this.displayForecast(forecastData);
            this.getAirQuality(weatherData.coord.lat, weatherData.coord.lon);
            this.initializeMap(weatherData.coord.lat, weatherData.coord.lon, weatherData.name);
            this.createTemperatureChart(forecastData);
            this.hideLoading();
            this.showMainContent();

        } catch (error) {
            throw error;
        }
    }

    // Geolocation
    getCurrentLocationWeather() {
        if (!navigator.geolocation) {
            this.showError('Geolocation is not supported by this browser.');
            return;
        }

        this.showLoading();
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    await this.getWeatherByCoords(position.coords.latitude, position.coords.longitude);
                } catch (error) {
                    this.showError(error.message);
                }
            },
            (error) => {
                let message = 'Unable to get your location. ';
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        message += 'Please allow location access and try again.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        message += 'Location information is unavailable.';
                        break;
                    case error.TIMEOUT:
                        message += 'Location request timed out.';
                        break;
                    default:
                        message += 'An unknown error occurred.';
                        break;
                }
                this.showError(message);
            },
            { timeout: 10000, enableHighAccuracy: true }
        );
    }

    async getWeatherByCoords(lat, lon) {
        if (!this.API_KEY || this.API_KEY === 'YOUR_OPENWEATHERMAP_API_KEY') {
            throw new Error('Please add your OpenWeatherMap API key to the script.js file');
        }

        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${this.API_KEY}&units=${this.currentUnit}`;
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${this.API_KEY}&units=${this.currentUnit}`;

        try {
            const [weatherResponse, forecastResponse] = await Promise.all([
                fetch(weatherUrl),
                fetch(forecastUrl)
            ]);

            if (!weatherResponse.ok) {
                throw new Error('Failed to fetch weather data for your location.');
            }

            const weatherData = await weatherResponse.json();
            const forecastData = await forecastResponse.json();

            this.currentWeatherData = weatherData;
            this.forecastData = forecastData;
            this.currentLocation = { lat, lon };

            this.displayWeatherData(weatherData);
            this.displayForecast(forecastData);
            this.getAirQuality(lat, lon);
            this.initializeMap(lat, lon, weatherData.name);
            this.createTemperatureChart(forecastData);
            this.hideLoading();
            this.showMainContent();

        } catch (error) {
            throw error;
        }
    }

    // Voice Search
    handleVoiceSearch() {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            this.showError('Voice search is not supported in this browser.');
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        this.voiceBtn.classList.add('listening');
        this.voiceBtn.querySelector('.voice-icon').textContent = '🔴';

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            this.cityInput.value = transcript;
            this.handleSearch();
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            this.showError('Voice search failed. Please try again.');
        };

        recognition.onend = () => {
            this.voiceBtn.classList.remove('listening');
            this.voiceBtn.querySelector('.voice-icon').textContent = '🎤';
        };

        recognition.start();
    }

    // Display Functions
    displayWeatherData(data) {
        // Location and time
        this.cityName.textContent = data.name;
        this.countryName.textContent = data.sys.country;
        this.updateDateTime();

        // Weather icon
        const iconCode = data.weather[0].icon;
        this.weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        this.weatherIcon.alt = data.weather[0].description;

        // Temperature
        const temp = Math.round(data.main.temp);
        const feelsLike = Math.round(data.main.feels_like);
        const unit = this.currentUnit === 'metric' ? '°C' : '°F';
        
        this.temperature.textContent = `${temp}${unit}`;
        this.feelsLike.textContent = `${feelsLike}${unit}`;

        // Weather condition
        this.weatherCondition.textContent = data.weather[0].main;
        this.weatherDescription.textContent = data.weather[0].description;

        // Weather details
        this.humidity.textContent = `${data.main.humidity}%`;
        this.pressure.textContent = `${data.main.pressure} hPa`;
        this.visibility.textContent = `${(data.visibility / 1000).toFixed(1)} km`;

        // Wind speed
        const windSpeed = this.currentUnit === 'metric' 
            ? `${data.wind.speed} m/s` 
            : `${data.wind.speed} mph`;
        this.windSpeed.textContent = windSpeed;

        // Sunrise and sunset
        this.sunrise.textContent = this.formatTime(data.sys.sunrise);
        this.sunset.textContent = this.formatTime(data.sys.sunset);

        // Update background based on weather
        this.updateWeatherBackground(data.weather[0].main.toLowerCase());
    }

    displayForecast(data) {
        this.forecastContainer.innerHTML = '';
        
        // Group forecast data by day (take one forecast per day)
        const dailyForecasts = {};
        data.list.forEach(item => {
            const date = new Date(item.dt * 1000);
            const dateKey = date.toDateString();
            
            if (!dailyForecasts[dateKey]) {
                dailyForecasts[dateKey] = item;
            }
        });

        // Display up to 5 days
        const forecasts = Object.values(dailyForecasts).slice(0, 5);
        
        forecasts.forEach(forecast => {
            const forecastCard = this.createForecastCard(forecast);
            this.forecastContainer.appendChild(forecastCard);
        });
    }

    createForecastCard(forecast) {
        const date = new Date(forecast.dt * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const temp = Math.round(forecast.main.temp);
        const tempMin = Math.round(forecast.main.temp_min);
        const tempMax = Math.round(forecast.main.temp_max);
        const unit = this.currentUnit === 'metric' ? '°C' : '°F';
        const iconCode = forecast.weather[0].icon;

        const card = document.createElement('div');
        card.className = 'forecast-card';
        card.innerHTML = `
            <div class="forecast-day">${dayName}</div>
            <div class="forecast-icon">
                <img src="https://openweathermap.org/img/wn/${iconCode}.png" alt="${forecast.weather[0].description}">
            </div>
            <div class="forecast-temps">
                <span class="forecast-high">${tempMax}${unit}</span>
                <span class="forecast-low">${tempMin}${unit}</span>
            </div>
            <div class="forecast-desc">${forecast.weather[0].description}</div>
        `;

        return card;
    }

    // Air Quality
    async getAirQuality(lat, lon) {
        if (!this.API_KEY || this.API_KEY === 'YOUR_OPENWEATHERMAP_API_KEY') return;

        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${this.API_KEY}`);
            if (response.ok) {
                const data = await response.json();
                this.displayAirQuality(data.list[0]);
            }
        } catch (error) {
            console.error('Failed to fetch air quality data:', error);
        }
    }

    displayAirQuality(data) {
        const aqi = data.main.aqi;
        const aqiLabels = ['', 'Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'];
        const aqiClasses = ['', 'aqi-good', 'aqi-fair', 'aqi-moderate', 'aqi-poor', 'aqi-very-poor'];
        const aqiDescriptions = [
            '',
            'Air quality is satisfactory',
            'Air quality is acceptable',
            'May cause health concerns for sensitive individuals',
            'Health warnings of emergency conditions',
            'Health alert: everyone may experience serious health effects'
        ];

        this.aqiValue.textContent = aqi;
        this.aqiValue.className = `aqi-value ${aqiClasses[aqi]}`;
        this.aqiStatus.textContent = aqiLabels[aqi];
        this.aqiDescription.textContent = aqiDescriptions[aqi];
    }

    // Temperature Chart
    createTemperatureChart(forecastData) {
        const ctx = document.getElementById('temperatureChart').getContext('2d');
        
        if (this.temperatureChart) {
            this.temperatureChart.destroy();
        }

        const labels = [];
        const temperatures = [];
        
        // Take every 8th item (24 hours apart) for the next 5 days
        for (let i = 0; i < Math.min(40, forecastData.list.length); i += 8) {
            const item = forecastData.list[i];
            const date = new Date(item.dt * 1000);
            labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
            temperatures.push(Math.round(item.main.temp));
        }

        this.temperatureChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: `Temperature (${this.currentUnit === 'metric' ? '°C' : '°F'})`,
                    data: temperatures,
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#667eea',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    }
                }
            }
        });
    }

    updateTemperatureChart() {
        if (this.temperatureChart && this.forecastData) {
            this.createTemperatureChart(this.forecastData);
        }
    }

    // Map Integration
    initializeMap(lat, lon, cityName) {
        if (this.weatherMap) {
            this.weatherMap.remove();
        }

        this.weatherMap = L.map('weatherMap').setView([lat, lon], 10);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(this.weatherMap);

        // Add marker for the city
        L.marker([lat, lon])
            .addTo(this.weatherMap)
            .bindPopup(`<b>${cityName}</b><br>Current weather location`)
            .openPopup();

        // Add weather layer if API key is available
        if (this.API_KEY && this.API_KEY !== 'YOUR_OPENWEATHERMAP_API_KEY') {
            L.tileLayer(`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${this.API_KEY}`, {
                attribution: 'Weather data © OpenWeatherMap',
                opacity: 0.6
            }).addTo(this.weatherMap);
        }
    }

    // Recent Searches
    getRecentSearches() {
        return JSON.parse(localStorage.getItem('recentSearches') || '[]');
    }

    addToRecentSearches(city) {
        let searches = this.getRecentSearches();
        searches = searches.filter(search => search.toLowerCase() !== city.toLowerCase());
        searches.unshift(city);
        searches = searches.slice(0, 5); // Keep only 5 recent searches
        localStorage.setItem('recentSearches', JSON.stringify(searches));
        this.recentSearches = searches;
        this.displayRecentSearches();
    }

    displayRecentSearches() {
        this.recentSearchesContainer.innerHTML = '';
        this.recentSearches.forEach(city => {
            const searchItem = document.createElement('span');
            searchItem.className = 'recent-search-item';
            searchItem.textContent = city;
            searchItem.addEventListener('click', () => {
                this.cityInput.value = city;
                this.handleSearch();
            });
            this.recentSearchesContainer.appendChild(searchItem);
        });
    }

    // Utility Functions
    formatTime(timestamp) {
        const date = new Date(timestamp * 1000);
        return date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        });
    }

    updateDateTime() {
        const now = new Date();
        this.dateTime.textContent = now.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    updateWeatherBackground(condition) {
        const body = document.body;
        body.className = body.className.replace(/weather-\w+/g, '');
        body.classList.add(`weather-${condition}`);
    }

    // UI State Management
    showLoading() {
        this.loadingSkeleton.classList.add('active');
        this.errorContainer.classList.remove('active');
        this.mainContent.classList.remove('active');
    }

    hideLoading() {
        this.loadingSkeleton.classList.remove('active');
    }

    showError(message) {
        this.errorMessage.textContent = message;
        this.errorContainer.classList.add('active');
        this.loadingSkeleton.classList.remove('active');
        this.mainContent.classList.remove('active');
    }

    hideError() {
        this.errorContainer.classList.remove('active');
    }

    showMainContent() {
        this.mainContent.classList.add('active');
        this.errorContainer.classList.remove('active');
        this.loadingSkeleton.classList.remove('active');
    }

    // PWA Support
    initializePWA() {
        // Register service worker
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('./sw.js')
                .then(registration => console.log('SW registered:', registration))
                .catch(error => console.log('SW registration failed:', error));
        }

        // Handle install prompt
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallPrompt();
        });
    }

    showInstallPrompt() {
        this.installPrompt.classList.add('active');
    }

    hideInstallPrompt() {
        this.installPrompt.classList.remove('active');
    }

    async installPWA() {
        if (this.deferredPrompt) {
            this.deferredPrompt.prompt();
            const { outcome } = await this.deferredPrompt.userChoice;
            console.log(`User response to the install prompt: ${outcome}`);
            this.deferredPrompt = null;
            this.hideInstallPrompt();
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WeatherApp();
});

// Add weather-specific background styles
const weatherStyles = `
    .weather-clear { background: linear-gradient(135deg, #74b9ff, #0984e3); }
    .weather-clouds { background: linear-gradient(135deg, #636e72, #2d3436); }
    .weather-rain { background: linear-gradient(135deg, #74b9ff, #0984e3); }
    .weather-drizzle { background: linear-gradient(135deg, #81ecec, #00b894); }
    .weather-thunderstorm { background: linear-gradient(135deg, #2d3436, #636e72); }
    .weather-snow { background: linear-gradient(135deg, #ddd, #fff); }
    .weather-mist { background: linear-gradient(135deg, #636e72, #b2bec3); }
    .weather-fog { background: linear-gradient(135deg, #636e72, #b2bec3); }
`;

// Inject weather styles
const styleSheet = document.createElement('style');
styleSheet.textContent = weatherStyles;
document.head.appendChild(styleSheet);
