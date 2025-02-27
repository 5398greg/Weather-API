let Main_data = {};
let temperature = document.getElementById("temp");
let temperature2 = document.getElementById("temp2");
let whatday = document.getElementById("what-day");
let description = document.getElementById("description");
let precipitation = document.getElementById("precipitation");
let visibility = document.getElementById("visibility");
let humidity = document.getElementById("humidity");
let locationElement = document.getElementById("location");
let latitude = document.getElementById("latitude");
let longitude = document.getElementById("longitude");
let windElement = document.getElementById("wind");
let gustsElement = document.getElementById("gusts");

async function GetWeather() {
  try {
    const city = document.getElementById("city").value;
    const response = await fetch(
      `https://your-backend.onrender.com/weather?city=${city}`
    );
    const data = await response.json();
    Main_data = data;
    DisplayWeather();
  } catch (error) {
    console.log("Error:", error);
  }
}

function DisplayWeather() {
  if (!Main_data?.currentConditions) {
    console.error("Invalid weather data");
    return;
  }
  console.log(Main_data);
  temperature.innerHTML = Math.round(
    ((Main_data.currentConditions.temp - 32) * 5) / 9
  );
  whatday.innerHTML = Main_data.currentConditions.conditions;
  description.innerHTML = Main_data.description;
  temperature2.innerHTML = Math.round(
    ((Main_data.currentConditions.feelslike - 32) * 5) / 9
  );
  precipitation.innerHTML = Main_data.currentConditions.precip;
  visibility.innerHTML = Main_data.currentConditions.visibility;
  humidity.innerHTML = Main_data.currentConditions.humidity;
  locationElement.innerHTML = Main_data.resolvedAddress;
  latitude.innerHTML = Main_data.latitude;
  longitude.innerHTML = Main_data.longitude;
  windElement.innerHTML = Math.round(Main_data.currentConditions.windspeed);
  gustsElement.innerHTML = Math.round(Main_data.currentConditions.windgust);
  WeekForecats();
  HourlyForecast();
}

function WeekForecats() {
  const weekDivs = document.querySelectorAll("#week-div .week");
  const days = Main_data.days.slice(0, 7); // Get next 7 days

  days.forEach((dayData, index) => {
    const div = weekDivs[index];
    if (!div) return;

    // Get day name (Today for first day)
    const dayName =
      index === 0
        ? "Today"
        : new Date(dayData.datetime).toLocaleDateString("en-US", {
            weekday: "short",
          });

    // Format date as DD/MM
    const [year, month, day] = dayData.datetime.split("-");
    const formattedDate = `${day}/${month}`;

    // Convert temperature to Celsius
    const tempC = Math.round(((dayData.temp - 32) * 5) / 9);

    // Get appropriate weather icon
    const getIcon = () => {
      const condition = dayData.conditions.toLowerCase();
      if (condition.includes("rain")) return "heavy-rain.png";
      if (condition.includes("snow")) return "snowy.png";
      if (condition.includes("clear")) return "sun.png";
      if (condition.includes("cloud")) return "clouds.png";
      if (condition.includes("fog")) return "fog.png";
      if (condition.includes("wind")) return "windy.png";
      return "sun.png";
    };

    // Update DOM elements
    div.querySelector(".day-name").textContent = dayName;
    div.querySelector(".date").textContent = formattedDate;
    div.querySelector("span").textContent = tempC;
    div.querySelector("img").src = `sources/${getIcon()}`;
  });
}

function HourlyForecast() {
  if (!Main_data.days || !Main_data.days[0]?.hours) {
    console.error("No hourly data available");
    return;
  }

  const hourDivs = document.querySelectorAll(".hours-div .hours");
  const timeZone = Main_data.timezone;

  // Get current time in location's timezone
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    timeZone: timeZone,
    hour12: false,
  });
  const currentHour = parseInt(formatter.format(now), 10);

  // Find current hour index in today's hours
  const todayHours = Main_data.days[0].hours;
  let currentHourIndex = todayHours.findIndex((h) => {
    const hour = parseInt(h.datetime.split(":")[0], 10);
    return hour >= currentHour;
  });

  // Get remaining hours (current hour + next 7)
  const remainingTodayHours = todayHours.slice(currentHourIndex);
  const tomorrowHours = Main_data.days[1]?.hours || [];
  const nextHours = [...remainingTodayHours, ...tomorrowHours].slice(0, 8);

  // Update display
  hourDivs.forEach((div, index) => {
    if (!nextHours[index]) {
      div.style.display = "none";
      return;
    }

    const hourData = nextHours[index];
    const isCurrentHour = index === 0 && currentHourIndex !== -1;

    // Time display
    if (isCurrentHour) {
      div.querySelector(".next-hour").textContent = "Now";
    } else {
      const hourDate = new Date(
        `${Main_data.days[0].datetime}T${hourData.datetime}`
      );
      const timeFormatter = new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: timeZone,
      });
      div.querySelector(".next-hour").textContent =
        timeFormatter.format(hourDate);
    }

    // Temperature
    div.querySelector(".temp").textContent = Math.round(
      ((hourData.temp - 32) * 5) / 9
    );

    // Icon
    div.querySelector("img").src = `sources/${getWeatherIcon(
      hourData.conditions
    )}`;
    div.style.display = "flex"; // Ensure visible
  });
}

function getWeatherIcon(conditions) {
  const condition = conditions.toLowerCase();
  if (condition.includes("rain")) return "heavy-rain.png";
  if (condition.includes("snow")) return "snowy.png";
  if (condition.includes("clear")) return "sun.png";
  if (condition.includes("cloud")) return "clouds.png";
  if (condition.includes("fog")) return "fog.png";
  if (condition.includes("wind")) return "windy.png";
  if (condition.includes("sun")) return "sun.png";
  return "clouds.png";
}
