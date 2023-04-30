import './App.css'
import React from "react"
import { Link, useOutletContext } from "react-router-dom"

export default function Home() {
  
  const [currentDate, setCurrentDate] = React.useState()
  const { weather, city, searchParams, unit, setUnit } = useOutletContext()
  const modal = document.querySelector('.modal')
  React.useEffect(() => {
    const repeatedlyUpdate = setInterval(() => determineDate(), 1000)
    return () => clearInterval(repeatedlyUpdate)
  }, [])
  function determineTime() {
    const date = new Date()
    if (date.getHours() >= 6 && date.getHours() < 12) {
      return "Morning"
    }else if (date.getHours() >= 12 && date.getHours() < 19) {
      return "Afternoon"
    }else if (date.getHours() >= 19 || date.getHours() < 6) {
      return "Night"
    }
  }
  function determineDate() {
    const date = new Date()
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const currentDayOfWeek = dayNames[date.getDay()]
    const currentDate = date.getDate()
    const currentHour = date.getHours()
    const currentMinutes = date.getMinutes()
    setCurrentDate(`${currentDayOfWeek} ${currentDate} | ${currentHour > 12 ? currentHour-12 : currentHour} : ${currentMinutes < 10 ? `0${currentMinutes}` : currentMinutes} ${currentHour > 11 ? "pm" : "am"}`)
  }
  
  function determineCurrentWeather() {
    const isDay = weather.current_weather.is_day
    const weatherCode = weather.current_weather.weathercode
    const weatherConditions = [isDay == 1 ? ["sunny", "Sunny"] : ["night", "Clear"], ["cloudy", "Cloudy Skies"], ["cloudy", "Cloudy Skies"], ["cloudy", "Cloudy Skies"], '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ["fog", "Foggy"], '', '', ["fog", "Foggy"], '', '', ['drizzle', "Drizzling"], '', ['drizzle', "Drizzling"], '', ['drizzle', "Drizzling"], ['freezingDrizzle', 'Freezing Drizzle'], ['freezingDrizzle', 'Freezing Drizzle'], '', '', '', ['rainy', 'Raining'], '', ['rainy', 'Raining'], '', ['rainy', 'Raining'], ['freezingRain', 'Freezing Rain'], ['freezingRain', 'Freezing Rain'], '', '', '', ['snow', 'Snowing'], '', ['snow', 'Snowing'], '', ['snow', 'Snowing'], '', ['snow', 'Snowing'], '', '', ['rainy', 'Raining'], ['rainy', 'Raining'], ['rainy', 'Raining'], '', '', ['snow', 'Snowing'], ['snow', 'Snowing'], '', '', '', '', '', '', '', '', ['thunderstorm', 'Thunderstorm'], ['thunderstormHail', 'Thunderstorm and Hail'], '', '', ['thunderstormHail', 'Thunderstorm and Hail']]
    return weatherConditions[weatherCode]
  }
  function determineHourlyWeather(code, isDay) {
    const weatherConditions = [isDay == 1 ? 'sunny' : 'night', 'cloudy', 'cloudy', 'cloudy', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'fog', '', '', 'fog', '', '', 'drizzle', '', 'drizzle', '', 'drizzle', 'freezingDrizzle', 'freezingDrizzle', '', '', '', 'rainy', '','rainy', '', 'rainy', 'freezingRain', 'freezingRain', '', '', '', 'snow', '', 'snow', '', 'snow', '', 'snow', '', '', 'rainy', 'rainy', 'rainy', '', '', 'snow', 'snow', '', '', '', '', '', '', '', '', 'thunderstorm', 'thunderstormHail', '', '', 'thunderstormHail']
    return weatherConditions[code]
  }
  function rows() {
    const images = ['sunny', 'sunset', 'rain', 'wind', 'uv', 'hours']
    const titles = ['Sunrise', 'Sunset', 'Precipitation', 'Wind Speed', 'UV Index', 'Precip. Hours']
    const info = [`${weather.daily.sunrise[0].split("T")[1]}am`, `${weather.daily.sunset[0].split("T")[1].split(":")[0]-12 < 10 ? `0${weather.daily.sunset[0].split("T")[1].split(":")[0]-12}`: weather.daily.sunset[0].split("T")[1].split(":")[0]-12}:${weather.daily.sunset[0].split("T")[1].split(":")[1]}pm`, `${weather.daily.precipitation_probability_mean[0]}%`, `${weather.current_weather.windspeed}km/h`, `${weather.daily.uv_index_max[0]}%`, `${weather.daily.precipitation_hours[0]}h`]
    let newColumns = []
    let newRows = []
    for (let x = 0; x < 6; x++) {
      newColumns.push(
        <div key={x}>
          <img src={`pic/${images[x]}.png`} className={x == 4 ? "uv" : "rainDrops"} />
          <div>
            <p>{titles[x]}</p>
            <h4 className="time">{info[x]}</h4>
          </div>
        </div>
      )
    }
    for (let i = 0; i < 3; i++) {
        newRows.push(
        <div key={i}>
          <div className="row">
            {newColumns[i * 2]}
            {newColumns[i * 2 + 1]}
          </div>
          <hr className="addMargin" />
        </div>
      )
    }
  
    return newRows
  }

  function hourlyTemp() {
    const date = weather.current_weather.time
    const times = weather.hourly.time
    const isDay = weather.hourly.is_day
    const temps = weather.hourly.temperature_2m
    const weatherCodes = weather.hourly.weathercode
    const index = times.indexOf(date)
    const newTimes = times.slice(index, index + 24)
    const newTemps = temps.slice(index, index + 24)
    const newIsDay = isDay.slice(index, index + 24)
    const newWeatherCodes = weatherCodes.slice(index, index + 24)
    const weatherCards = []
    for (let i = 0; i < newTimes.length; i++) {
      weatherCards.push(
        <div key={i} className="weatherCard">
          <img src={`pic/${determineHourlyWeather(newWeatherCodes[i], newIsDay[i])}.png`} height="50px" />
          <p>{newTemps[i]}°</p>
          <p>{newTimes[i].split("T")[1].split(":")[0] > 12 ? `${newTimes[i].split("T")[1].split(":")[0] - 12}:00pm` : `${newTimes[i].split("T")[1]}am`}</p>
        </div>
      )
    }
    return weatherCards
  }

  function open() {
    modal.showModal()
  }

  function close(){
    modal.close()
  }
  
  return (
    <main className={`homeComponent ${weather.current_weather && determineCurrentWeather()[0]}`}>
      {weather.current_weather == undefined && <div className="loading"><div><div className="spinner"></div><p className="pleaseWait">Please Wait...</p></div></div>}
      <div className="topSection">
        <h2 className="cityName">{city}</h2>
        <div className="greetingWrapper"><h1 className="greeting">Good {determineTime()}</h1><img src="pic/threeDots.png" className="threeDots" onClick={open} /></div>
        <dialog className="modal">
          <div className="modalHeader">
            <h3>Preferences</h3>
          </div>
          <div className="preferenceLinks">
            <Link to="?unit=celsius" className="changeCelsius" onClick={() => {
      setUnit('celsius')
      localStorage.setItem("unitType", 'celsius')
    }}>Change to Celsius {localStorage.getItem('unitType') == 'celsius' && <span>✓</span>}</Link>
            <hr />
            <Link to="?unit=fahrenheit" className="changeCelsius" onClick={() => {
      setUnit('fahrenheit')
      localStorage.setItem("unitType", 'fahrenheit')
    }}>Change to Fahrenheit {localStorage.getItem('unitType') == 'fahrenheit' && <span>✓</span>}</Link>
          </div>
          <div className="modalLastSection">
            <button className="closeModal" onClick={close}>close</button>
          </div>
        </dialog>
      </div>
      <div>{
        weather.latitude != undefined && 
        <div className="weatherSection"><img className="weatherIcon" src={`pic/${determineCurrentWeather()[0]}.png`} /><h1 className="currentTemp">{`${weather.current_weather.temperature}${weather.daily_units.temperature_2m_max}`}</h1><h3 className="weatherCondition">{determineCurrentWeather()[1]}</h3><p>{currentDate}</p><Link to="NextDays" className="nextDays" state={{ search: searchParams.get('unit') }}>More Days →</Link></div>
      }</div>
      <div className="lastSection">
        {weather.daily && rows()}
        <div className="white">
          <p className="alignCenter">Today</p>
          <div className="hourlyTemps">{weather.daily && hourlyTemp()}</div>
        </div>
      </div>
    </main>
  )
}
