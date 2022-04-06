import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

async function getDatagram(dvId) {
    try {
        const response = await axios.get("http://localhost:8000/records/" + dvId + "/");
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

function Datagram({ dvId,dvType }) {
    var dulieu = [];
    const [plotType, setPlotType] = useState("hour");
    const [data, setData] = useState([]);
    useEffect(() => {
        getDatagram(dvId).then(data => {
            setData(data);
        });
    }, []);
    if (data.length !== 0) {
        data.map((dat) => {
            if (dat._date_created) {
                dulieu.push({
                    'data': dat.data,
                    'date': dat._date_created.split("T")[0].split("-")[2],
                    'month': dat._date_created.split("T")[0].split("-")[1],
                    'year': dat._date_created.split("T")[0].split("-")[0],
                    'hour': dat._date_created.split("T")[1].split(":")[0],
                })


            }
        })
    }
    console.log(dulieu)
    return (
        <div>
            <select onChange={(e)=>setPlotType(e.target.value)}>
                <option value="hour" selected>Giờ</option>
                <option value="date">Ngày</option>
                <option value="month">Tháng</option>
                <option value="year">Năm</option>
            </select>
            <div style={{textAlign:'center'}}>Biểu đồ {dvType}</div>
            <LineChart width={600} height={300} data={dulieu} style={{ fontSize: "15px" }} margin={{ top: 5, right: 10, bottom: 5, left: 0 }} >
                <XAxis dataKey={plotType} />
                <YAxis />
                <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                <Line type="monotone" dataKey="data" stroke="#8884d8" />
                <Tooltip />
            </LineChart>
        </div>
    )
}
export default Datagram;