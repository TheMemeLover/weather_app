import '/src/App.css'
import React from "react"
import { Link, Outlet, useSearchParams } from "react-router-dom"


export default function ScreenLayout() {
  
  const [searchParams, setSearchParams] = useSearchParams()
  const [coords, setCoords] = React.useState({})
  const [city, setCity] = React.useState()
  const [weather, setWeather] = React.useState({})
  const [unit, setUnit] = React.useState(localStorage.getItem("unitType") || 'fahrenheit')

  React.useEffect(() => {
    navigator.geolocation.getCurrentPosition(pos => {
      setCoords({lat: pos.coords.latitude, lon: pos.coords.longitude})
    })
  }, [])
  
  React.useEffect(() => {
    if (coords.lat){
      fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${coords.lat}&longitude=${coords.lon}&localityLanguage=en`)
        .then(res => res.json())
        .then(data => {
          setCity(data.city)
          return fetch(`https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&daily=temperature_2m_max&daily=temperature_2m_min&temperature_unit=${searchParams.get('unit') ? searchParams.get('unit') : unit}&timezone=auto&current_weather=true&daily=sunrise&daily=sunset&daily=precipitation_probability_mean&daily=windspeed_10m_max&daily=uv_index_max&daily=precipitation_hours&daily=weathercode&hourly=temperature_2m&hourly=weathercode&hourly=is_day`)
        })
      .then(res => res.json())
      .then(data => setWeather(data))
      .catch(err => console.error(err)) 
    }
  }, [coords, unit])
  return (
    <>
      <Outlet context={ { coords, city, weather, searchParams, unit, setUnit } } />
    </>
  )
}
