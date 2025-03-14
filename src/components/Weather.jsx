import React, { useEffect } from 'react'
import './Weather.css'
import search_icon from '../assets/search.png'

const Weather = () =>{

//     const search = async(city)=>{
//         try{
//             const url = `https://api.openweathermap.org/data/2.5/weather?
//             q=${city}&appid=${import.meta.env.VITE_APP_ID}`;
//             const response = await fetch(url);
//             const data = await response.json();
//             console.log(data);
//         }catch(error){

//         }
//     }

//    useEffect(()=>{
//     search("London");
//    },[])

  return (
    <div className="Weather">
      <div className="search-bar">
        Weather
      <input type = "text" placeholder = 'Search'/>
      <div className='icon_image'>
        <img src = {search_icon} alt="" />
      </div>
      </div>
    </div>
  )
}

export default Weather