const input = document.querySelector('input');
const btn = document.querySelector('button');
const resultDiv = document.getElementById("weatherResult");

btn.addEventListener('click', function () {
  const CityName = input.value.trim();
  if (CityName !== "") {
    fetchData(CityName);
    input.value = "";
  }
});

function fetchData(CityName) {
  const apiKey = "5d0df7fb6dba415f8fb03442250706";

  axios
    .get(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${CityName}`)
    .then(function (response) {
      const { location, current } = response.data;
      updateDOM(location, current);
    })
    .catch(function (error) {
      resultDiv.innerHTML = `<p style="color:red;">❌ City not found or network issue.</p>`;
      console.error(error);
    });
}

function calculateDewPoint(tempC, humidity) {
  const a = 17.27;
  const b = 237.7;
  const alpha = ((a * tempC) / (b + tempC)) + Math.log(humidity / 100);
  const dewPoint = (b * alpha) / (a - alpha);
  return dewPoint.toFixed(1);
}

function updateDOM(location, weather) {
  // Top Info
  document.querySelector('.temp').textContent = `${weather.temp_c}°C`;
  document.querySelector('.icon').textContent = weather.is_day ? '☀️' : '🌙';
  document.getElementById('cityName').textContent = location.name;
  document.getElementById('humidity').textContent = `${weather.humidity}%`;
  document.getElementById('condition').textContent = weather.condition.text;

  // Detailed Info
  resultDiv.innerHTML = `
    <div class="weather-row"><span class="bold">📍 Location:</span> ${location.name}, ${location.country}</div>
    <div class="weather-row"><span class="bold">🕓 Local Time:</span> ${location.localtime}</div>
    <div class="weather-row"><span class="bold">🌡 Temperature:</span> ${weather.temp_c}°C</div>
    <div class="weather-row"><span class="bold">🌡 RealFeel:</span> ${weather.feelslike_c}°C</div>
    <div class="weather-row">
      <span class="bold">☀️ Condition:</span> ${weather.condition.text}
      <img src="https:${weather.condition.icon}" alt="${weather.condition.text}" style="vertical-align:middle; margin-left:10px;" width="48" height="48">
    </div>
    <div class="weather-row"><span class="bold">💨 Wind:</span> ${weather.wind_dir} ${weather.wind_kph} km/h</div>
    <div class="weather-row"><span class="bold">💨 Gusts:</span> ${weather.gust_kph} km/h</div>
    <div class="weather-row"><span class="bold">🌫 Pressure:</span> ${weather.pressure_mb} mb</div>
    <div class="weather-row"><span class="bold">☁️ Cloud Cover:</span> ${weather.cloud}%</div>
    <div class="weather-row"><span class="bold">🌫 Visibility:</span> ${weather.vis_km} km</div>
    <div class="weather-row"><span class="bold">💧 Humidity:</span> ${weather.humidity}%</div>
    <div class="weather-row"><span class="bold">💧 Dew Point:</span> ${calculateDewPoint(weather.temp_c, weather.humidity)}°C</div>
    <div class="weather-row"><span class="bold">🔆 UV Index:</span> ${weather.uv}</div>
  `;
}

function updateTime() {
  const now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12 || 12;
  minutes = minutes < 10 ? '0' + minutes : minutes;

  document.getElementById('timeDisplay').textContent = `${hours}:${minutes} ${ampm}`;
}
setInterval(updateTime, 1000);
updateTime();
