import axios from 'axios';
import React, {useState, useEffect} from 'react';
import {ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';

async function getDatagram(dvId) {
    try {
        const response = await axios.get("http://localhost:8000/records/" + dvId + "/");
        return response.data;
    } catch (error) {
        console.error(error);
    }
}


function Datagram({dvId}){
    const [data, setData] = useState([]);
    useEffect(() => {
        getDatagram(dvId).then(data => {
            setData(data);
        });
    }, []);
    
    if(data.length !== 0)
    {
        data.map((dat)=>{
            if(dat._date_created){
                var date = new Date(dat._date_created);
                var day = date.getDate();
                var month = date.getMonth() + 1;
                var year = date.getFullYear();
                var hour = date.getHours();
                var minute = date.getMinutes();
                var second = date.getSeconds();
                console.log("asdsdfhgsffgsfsdfsd")
                console.log(day)
                console.log(month)
                console.log(year)
                console.log(hour)
                console.log(minute)
                console.log(second)
                console.log("asdsdfhgsffgsfsdfsd")

                dat._date_created = day != 1? day:""
            }
        })
    }
    console.log(data)
    return(
        <LineChart width={500} height={300} data={data} style={{fontSize:"15px"}} margin={{ top: 5, right: 20, bottom: 5, left: 0 }} >
        <XAxis dataKey="_date_created"/>
        <YAxis/>
        <CartesianGrid stroke="#eee" strokeDasharray="5 5"/>
        <Line type="monotone" dataKey="data" stroke="#8884d8" />
        <Tooltip />
      </LineChart>
    )
}
export default Datagram;