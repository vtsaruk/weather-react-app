import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Chart } from 'react-google-charts';
import './App.css';

const APPID = '399ca5c4a5bfbed8e1832cac31c6ff40';
const OPENWEATHER_URL = 'https://api.openweathermap.org/data/2.5/forecast';

function App() {
    const [data, setData] = useState(null);
    const [cityName, setCityName] = useState('');

    const getCurPosition = () =>
        new Promise((resolve, reject) =>
            navigator.geolocation.getCurrentPosition(data => resolve(data))
        ).then(data => data.coords);

    const fetchData = async () => {
        try {
            let curPosition = await getCurPosition();
            const data = await axios
                .get(
                    `${OPENWEATHER_URL}?lat=${curPosition.latitude}&lon=${
                        curPosition.longitude
                    }&APPID=${APPID}`
                )
                .then(data => data.data);
            setCityName(data.city.name);

            let result = data.list.map(item => [
                item.dt_txt,
                item.main.temp_min - 273,
                item.main.temp_max - 273
            ]);
            const time = new Date(data.list[0].dt_txt).getHours();
            result = result.filter(item => new Date(item[0]).getHours() === time);
            result.unshift(['Year', 'Min temp', 'Max temp']);
            setData(result);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (!data) fetchData();
    }, [data, fetchData]);

    return (
        <div className="App">
            <header className="App-header">
                <h1>Weather</h1>
            </header>
            {data && (
                <Chart
                    width={window.innerWidth}
                    height={'300px'}
                    chartType="AreaChart"
                    loader={<div>Loading Chart</div>}
                    data={data}
                    options={{
                        title: cityName,
                        hAxis: { title: 'Date', titleTextStyle: { color: '#333' } },
                        vAxis: { minValue: 0 },
                        chartArea: { width: '70%', height: '70%' }
                    }}
                />
            )}
        </div>
    );
}

export default App;
