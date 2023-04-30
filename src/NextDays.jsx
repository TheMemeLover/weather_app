import './App.css'
import React from "react"
import { Link, useOutletContext, useLocation } from "react-router-dom"

export default function NextDays() {
  
  const { weather } = useOutletContext()
  const location = useLocation()
  const [daysState, setDaysState] = React.useState([
    {
      id: '0',
      on: false
    },
    {
      id: '1',
      on: false
    },
    {
      id: '2',
      on: false
    },
    {
      id: '3',
      on: false
    },
    {
      id: '4',
      on: false
    },
    {
      id: '5',
      on: false
    },
    {
      id: '6',
      on: false
    }
  ])
  
  function determineWeekWeather(condition) {
    const weatherConditions = [["sunny", "Sunny"], ["cloudy", "Cloudy Skies"], ["cloudy", "Cloudy Skies"], ["cloudy", "Cloudy Skies"], '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ["fog", "Foggy"], '', '', ["fog", "Foggy"], '', '', ['drizzle', "Drizzling"], '', ['drizzle', "Drizzling"], '', ['drizzle', "Drizzling"], ['freezingDrizzle', 'Freezing Drizzle'], ['freezingDrizzle', 'Freezing Drizzle'], '', '', '', ['rainy', 'Raining'], '', ['rainy', 'Raining'], '', ['rainy', 'Raining'], ['freezingRain', 'Freezing Rain'], ['freezingRain', 'Freezing Rain'], '', '', '', ['snow', 'Snowing'], '', ['snow', 'Snowing'], '', ['snow', 'Snowing'], '', ['snow', 'Snowing'], '', '', ['rainy', 'Raining'], ['rainy', 'Raining'], ['rainy', 'Raining'], '', '', ['snow', 'Snowing'], ['snow', 'Snowing'], '', '', '', '', '', '', '', '', ['thunderstorm', 'Thunderstorm'], ['thunderstormHail', 'Thunderstorm and Hail'], '', '', ['thunderstormHail', 'Thunderstorm and Hail']]
    return weatherConditions[condition]
  }
  function hideShow(id) {
      setDaysState(prevDaysState => {
        let newArrayState = []
        for (let i = 0; i < prevDaysState.length; i++) {
          let currentDay = prevDaysState[i]
          if (currentDay.id == id) {
            let newDaysObject = {
              ...currentDay,
              on: !currentDay.on
            }
            newArrayState.push(newDaysObject)
          }
          else {
            newArrayState.push(currentDay)
          }
        }
        return newArrayState
      })
  }
  function determineHourlyWeather(code, isDay) {
    const weatherConditions = [isDay == 1 ? 'sunny' : 'night', 'cloudy', 'cloudy', 'cloudy', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'fog', '', '', 'fog', '', '', 'drizzle', '', 'drizzle', '', 'drizzle', 'freezingDrizzle', 'freezingDrizzle', '', '', '', 'rainy', '','rainy', '', 'rainy', 'freezingRain', 'freezingRain', '', '', '', 'snow', '', 'snow', '', 'snow', '', 'snow', '', '', 'rainy', 'rainy', 'rainy', '', '', 'snow', 'snow', '', '', '', '', '', '', '', '', 'thunderstorm', 'thunderstormHail', '', '', 'thunderstormHail']
    return weatherConditions[code]
  }
  function hourlyTemp(num) {
    const date = `${weather.daily.time[num]}T00:00`
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
  function days() {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const dayOfWeekIndex = new Date().getDay()
    let currentWeek = []
    for (let x = 0; x < 7; x++) {
      currentWeek.push(daysOfWeek[dayOfWeekIndex+x])
    }
    const dayConditions = []
    for (let i = 0; i < currentWeek.length; i++) {
      const styles = {
        maxHeight: daysState[i].on ? "210px" : "0px"
      }
      
      dayConditions.push(
        <div key={currentWeek[i]} >
          
          <div className='day' onClick={() => hideShow(i)}>
            <p>{`${currentWeek[i][0]}${currentWeek[i][1]}${currentWeek[i][2]}`}</p>
            <div><img src={`pic/${determineWeekWeather(weather.daily.weathercode[i])[0]}.png`} height="30px" /><p>{determineWeekWeather(weather.daily.weathercode[i])[1]}</p></div>
            <div className="nextDaysTemp">
              <p className="high">{weather.daily.temperature_2m_max[i]}°</p>
              <p className="low">{weather.daily.temperature_2m_min[i]}°</p>
              
            </div>
          </div>
          <div className="panel" style={styles}>
            <div className="row rowDetails">
              <p>Sunrise:</p>
              <p>{weather.daily.sunrise[i].split("T")[1]}am</p>
            </div>
            <div className="row rowDetails">
              <p>Sunset:</p>
              <p> {`${weather.daily.sunset[i].split("T")[1].split(":")[0]-12 < 10 ? `0${weather.daily.sunset[i].split("T")[1].split(":")[0]-12}`: weather.daily.sunset[i].split("T")[1].split(":")[0]-12}:${weather.daily.sunset[i].split("T")[1].split(":")[1]}pm`}</p>
            </div>
            <div className="row rowDetails">
              <p>Precip. Hours:</p>
              <p>{weather.daily.precipitation_hours[i]}h</p>
            </div>
            <div className="row rowDetails">
              <p>Precipitation:</p>
              <p>{weather.daily.precipitation_probability_mean[i]}%</p>
            </div>
            <div className="hourlyTemps">{weather.daily && hourlyTemp(i)}</div>
          </div>
          
          
          <hr className="daysHr" />
        </div>
      )
    }
    return dayConditions
  }
  
  return (
    <main className="nextDaysComponent">
      <div className="nextDaysHeader">
        <Link to=".." className="back">← Back</Link>
        <img src="pic/cloudRainSun.png" className="cloudRainSun" />
      </div>
      <div className="thisWeek">
        <img src="pic/calendar.png" height="30px" />
        <h3>This Week</h3>
      </div>
      <div className="listOfDays">
        {weather.daily && days()}
      </div>
    </main>
  )
}
