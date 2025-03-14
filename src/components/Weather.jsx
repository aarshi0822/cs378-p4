import React, { useState, useEffect, useRef } from "react";
import './Weather.css';
import search_icon from '../assets/search.png';
import sunny from '../assets/clear.png';
import cloud from '../assets/cloud.png';
import drizzle from '../assets/drizzle.png';
import rain from '../assets/rain.png';
import snow from '../assets/snow.png';
import wind from '../assets/wind.png';
import humid from '../assets/humidity.png';

const Weather = () => {
    const inputRef = useRef();
    const [weatherData, setWeatherData] = useState(false);
    const [unit, setUnit] = useState("imperial");
    const [moodMessage, setMoodMessage] = useState("");
    const [movieRecommendation, setMovieRecommendation] = useState("");
    const [showPopup, setShowPopup] = useState(false); // Controls popup visibility

    const moodMessages = {
        clear: "☀️ It's a bright day! Go outside and shine!",
        clouds: "🌥 Stay cozy, maybe grab a book!",
        drizzle: "🌦 A little rain never hurt. Maybe a cup of tea?",
        rain: "🌧 Perfect weather to stay in and binge-watch!",
        snow: "❄️ Time for hot cocoa and warm blankets!",
        wind: "💨 Hold onto your hats, it's breezy out there!"
    };

    const allIcons = {
        "01d": sunny, "01n": sunny,
        "02d": cloud, "02n": cloud,
        "03d": cloud, "03n": cloud,
        "04d": drizzle, "04n": drizzle,
        "09d": rain, "09n": rain,
        "10d": rain, "10n": rain,
        "13d": snow, "13n": snow
    };

    const search = async (city) => {
        if (city === "") {
            alert("Enter City Name");
            return;
        }
        try {
            const apiKey = "1e169d908289c769b8e1de9d89a7b2d6";
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${apiKey}`;
            const response = await fetch(url);
            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
                return;
            }

            console.log(data);

            const icon = allIcons[data.weather[0].icon] || sunny;
            setWeatherData({
                Humidity: data.main.humidity,
                windSpeed: data.wind.speed,
                temperature: Math.round(data.main.temp),
                location: data.name,
                country: data.sys.country,
                icon: icon,
                description: data.weather[0].description,
                feelslike : Math.round(data.main.feels_like),
                sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
                sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
                condition: data.weather[0].main.toLowerCase()
            });
            setMoodMessage("");
            setMovieRecommendation("");
            setShowPopup(false);
        } catch (error) {
            setWeatherData(false);
            console.error("Error in fetching weather data");
        }
    };

    const recommendMovie = async () => {
        if (!weatherData || !weatherData.condition) return;

        const weatherToGenre = {
            clear: 12, // Adventure
            clouds: 35, // Comedy
            drizzle: 10749, // Romance
            rain: 18, // Drama
            snow: 16, // Animation
            wind: 28 // Action
        };

        const genreId = weatherToGenre[weatherData.condition] || 10751; // Default: Family

        try {
            const movieAPI = "96f8c7aa54d4b776e061f54240d6946a"; // Replace with your API key
            const url = `https://api.themoviedb.org/3/discover/movie?api_key=${movieAPI}&with_genres=${genreId}&sort_by=popularity.desc`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.results && data.results.length > 0) {
                const randomMovie = data.results[Math.floor(Math.random() * data.results.length)];
                setMovieRecommendation(`🎥 How about watching *${randomMovie.title}*? ${randomMovie.overview}`);
                setShowPopup(true); // Show popup
            } else {
                setMovieRecommendation("🎬 Couldn't find a movie for this weather, but any movie is a good movie!");
                setShowPopup(true);
            }
        } catch (error) {
            console.error("Error fetching movie data:", error);
            setMovieRecommendation("🎥 Oops! Something went wrong while getting movie recommendations.");
            setShowPopup(true);
        }
    };

    const toggleTemperatureUnit = async () => {
      const newUnit = unit === "imperial" ? "metric" : "imperial";
      await setUnit(newUnit); // Ensure the unit updates
      if (weatherData && weatherData.location) {
          setTimeout(() => search(weatherData.location), 100); // Delay to ensure state updates
      }
  };
  
    const showWeatherMood = () => {
        if (!weatherData || !weatherData.condition) return;
        const mood = moodMessages[weatherData.condition] || "🌎 Weather is unpredictable, just enjoy the day!";
        setMoodMessage(mood);
    };

    useEffect(() => {
        search("Austin");
    }, []);

        return (
            <div className="Weather">
                <div className="search-bar">
                    <input ref={inputRef} placeholder="Search" />
                    <img src={search_icon} alt="" onClick={() => search(inputRef.current.value)} />
                </div>

                {weatherData ? (
        <>
            <div className="button-container">
                <button className="button" onClick={recommendMovie}>Movie Rec🍿</button>
                <button className="button" onClick={toggleTemperatureUnit}>
                    Change: {unit === "imperial" ? "°C" : "°F"}
                </button>
                <button className="button" onClick={showWeatherMood}>Mood Quotes🎭</button>
                
            </div>

            <img src={weatherData.icon} alt="" className="weather-icon" />
            <p className="temperature">
                {weatherData.temperature} {unit === "imperial" ? "°F" : "°C"}
            </p>
            <p className="location">{weatherData.location},{weatherData.country}</p>
            <p>{weatherData.description}</p>


            <div className="weather-data">
                <div className="col">
                    <img src={humid} alt="" />
                    <div>
                        <p>{weatherData.Humidity}%</p>
                        <span>Humidity</span>
                    </div>
                </div>
                <div className="col">
                    <img src={wind} alt="" />
                    <div>
                        <p>{weatherData.windSpeed} {unit === "imperial" ? "mph" : "km/h"}</p>
                        <span>Wind</span>
                    </div>
                </div>
                </div>

            <div className="mood-mess">
                {moodMessage && <p className="mood-message">{moodMessage}</p>}
            </div>

            <div className="extra-data">
                  <div className = "header">
                      <p>Sunrise: </p>
                      </div>
                      <p>{weatherData.sunrise}</p>
                  <div className = "header">
                    <p>Sunset: </p>
                    </div>
                    <p>{weatherData.sunset}</p>
                  <div className = "header">
                      <p>Feels Like: </p>
                    </div>
                      <p>{weatherData.feelslike}{unit === "imperial" ? "°F" : "°C"}</p>
              </div>

            {showPopup && (
                <div className="popup-overlay" onClick={() => setShowPopup(false)}>
                    <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                        <span className="close-button" onClick={() => setShowPopup(false)}>&times;</span>
                        <p className="movie-message">{movieRecommendation}</p>
                    </div>
                </div>

              
            )}
        </>
    ) : null}

        </div>
    );
};

export default Weather;
