/* Global Variables */
const weatherIconMap = {
    '2xx': '⛈', // Thunderstorm
    '3xx': '🌦', // Drizzle
    '5xx': '🌧', // Rain
    '6xx': '❄️', // Snow
    '7xx': '🌫', // Atmosphere (Mist, Smoke, Haze, Dust, Fog, Sand, Ash, Squall, Tornado)
    '800': '☀️', // Clear
    '80x': '☁️', // Clouds
};

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + '.' + d.getDate() + '.' + d.getFullYear();

const getWeatherData = async (city, zip, apiKey) => {
    let url = `https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}`;

    // Check if both city and zip are provided and append them accordingly to the url
    if (city) url += `&q=${city}`;
    if (zip) url += `&zip=${zip}`;

    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            throw new Error('Failed to fetch weather data');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

const postDataToServer = async (url = '', data = {}) => {
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    try {
        const newData = await response.json();
        console.log(newData.message);
        return newData;
    } catch (error) {
        console.log('error', error);
    }
};


const performAction = async (apiKey) => {
    const city = document.getElementById('city').value;
    const zip = document.getElementById('zip').value;
    const feelings = document.getElementById('feelings').value;
    const weatherData = await getWeatherData(city, zip, apiKey);

    if (weatherData) {
        updateUI(weatherData);
        postDataToServer('/data', { ...weatherData, feelings });
    }
}

const getWeatherIcon = (id) => {
    const group = id.toString().charAt(0);
    if (group === '8' && id !== 800) {
        return weatherIconMap['80x'];
    } else {
        return weatherIconMap[group + 'xx'] || '🌡';
    }
};

const updateUI = (response) => {
    // Convert Unix timestamp to a readable date format
    const date = new Date(response.dt * 1000);
    const dateString = date.toLocaleString(); // Adjust format as needed

    // Convert temperature from Kelvin to Celsius
    const kelvinTemp = response.main.temp;
    const celsiusTemp = kelvinTemp - 273.15;

    // Get weather description
    const weatherDescription = response.weather[0].description;

    // Update the UI elements with the new data
    document.getElementById('date').innerText = dateString;
    document.getElementById('temp').innerText = `${celsiusTemp.toFixed(1)} °C`;
    document.getElementById('content').innerText = weatherDescription;

    // Update the weather icon, using a similar approach as before
    // Get the weather icon based on the weather condition id
    const weatherId = response.weather[0].id;
    const weatherIcon = getWeatherIcon(weatherId);
    document.querySelector('.weather-icon').textContent = weatherIcon;
};

const getDataFromServer = async () => {
    try {
        const response = await fetch('/getApiKey');
        if (!response.ok) {
            throw new Error('Failed to fetch apiKey');
        }
        const data = await response.json();
        const { apiKey } = data;
        performAction(apiKey);
    } catch (error) {
        console.error('Error:', error);
    }
};

document.getElementById('generate').addEventListener('click', () => {
    getDataFromServer();
});
