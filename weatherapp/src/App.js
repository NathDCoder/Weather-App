import React, {useState} from "react"
import axios from "axios"


function App() {

  const [data, setData] = useState ({})
  const [location, setLocation] =useState('')

const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=imperial&appid=c31022cc13458b2b205f3f52369f4ecc`

const searchLocation = (event) => {
  if (event.key === 'Enter') {  
  axios.get (url).then((response) => {
    setData(response.data)
    console.log(response.data)
  }) 
  setLocation('')
 }
}


  return (
   
    <div className="app">
      <div className="search">
        <input 
          value={location}
          onChange={event => setLocation(event.target.value)}
          onKeyDown={searchLocation}
          placeholder="Search Destination"
          type={"text"}/>
      </div>
      <div className="container">
        <div className="top">
          <div className="location">
            <p>{data.name}</p>
          </div>
          <div className="temp">
           {data.main ? <h1>{data.main.temp.toFixed()}°F</h1> : null}
          </div>
          <div className="description">
           
            {data.weather ? <p> 
            <img src={`https://openweathermap.org/img/wn/${data.weather[0].icon}.png`} alt="icon" /> 
            {data.weather[0].description}</p> : null}
          </div>
          </div>


          {data.name !== undefined && 
          <div className="bottom">
          <div className="feels">
            {data.main ? <p className='bold'>{data.main.feels_like.toFixed()}°F </p> : null}
            <p>Feels Like</p>
          </div>
          <div className="humidity">
          {data.main ? <p className='bold'>{data.main.humidity}%</p> : null}
            <p>Humidity</p>
          </div>
          <div className="wind">
          {data.wind ? <p className='bold'>{data.wind.speed.toFixed()}MPH</p> : null}
            <p>Wind</p>
          </div>
        </div>
        }
      </div> 
    </div>
);
}

export default App;
