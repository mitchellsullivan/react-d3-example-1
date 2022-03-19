import React, {ChangeEvent, Component} from 'react';
import './App.css';
import {WeatherDay} from "./types/data";
import BarChartHooks from "./visualizations/BarChartHooks";
import LineChartHooks from "./visualizations/LineChartHooks";
import RadialChartHooks from "./visualizations/RadialChartHooks";

const App: React.FC = ({}) => {
  const [temps, setTemps] = React.useState<{
    [key: string]: WeatherDay[]
  }>({});
  const [city, setCity] = React.useState('sf');

  React.useEffect(() => {
    Promise.all([
      fetch(`${process.env.PUBLIC_URL}/sf.json`),
      fetch(`${process.env.PUBLIC_URL}/ny.json`),
    ])
      .then(responses => Promise.all(responses.map(resp => resp.json())))
      .then(([sf, ny]) => {
        sf.forEach(day => day.date = new Date(day.date));
        ny.forEach(day => day.date = new Date(day.date));
        setTemps({
            sf,
            ny
        });
      });
  }, []);

  const handleCityChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const nextValue = e.target?.value;
    setCity(nextValue);
  }

  const data = temps[city];

  return (
    <div className="App">
      <h1>
        2017 Temperatures for
        <select name='city' onChange={handleCityChange}>
          {
            [
              {label: 'San Francisco', value: 'sf'},
              {label: 'New York', value: 'ny'},
            ].map(option => {
              return (
                <option key={option.value} value={option.value}>{option.label}</option>
              );
            })
          }
        </select>
      </h1>
      <p>
        *warning: these are <em>not</em> meant to be good examples of data visualizations,<br/>
        but just to show the possibility of using D3 and React*
      </p>
      <LineChartHooks data={data}/>
      <BarChartHooks data={data}/>
      <RadialChartHooks data={data}/>
      <br/>


      <p>
        (Weather data from <a href='wunderground.com' target='_new'>wunderground.com</a>)
      </p>
    </div>
  )
}

export default App;
