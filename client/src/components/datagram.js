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
function AvgArray(arr,type) {
    var sum = arr[0].data;
    for (var i = 0; i < arr.length; i++) {
        sum += arr[i];
    }
    return sum / arr.length;
}

function Datagram({ dvId,dvType,close }) {
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
        <React.Fragment >
            <div style={{width:"100%",display:"flex", justifyContent:"space-between"}}>

            <button onClick={()=>close()} style={{alignSelf:'flex-end'}}>Đóng</button>
            </div>
            <div style={{textAlign:'center'}}>Biểu đồ {dvType}</div>
            <LineChart width={600} height={300} data={dulieu} style={{ fontSize: "15px" }} margin={{ top: 5, right: 10, bottom: 5, left: 0 }} >
                <XAxis dataKey={plotType} />
                <YAxis />
                <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                <Line type="monotone" dataKey="data" stroke="#8884d8" />
                <Tooltip />
            </LineChart>

            <div className="date-input"> 
                <label htmlFor="date-start">From</label>
                <input name='date-start' id='date-start' type="date" />
                <label htmlFor="date-end">to</label>
                <input name='date-end' id='date-end' type="date" />
            </div>
            <div className="dv-input">  
                <p>Đơn vị</p>
                <select onChange={(e)=>setPlotType(e.target.value)} style={{alignSelf:'flex-end'}}>
                    <option value="hour" selected>Giờ</option>
                    <option value="date">Ngày</option>
                    <option value="month">Tháng</option>
                    <option value="year">Năm</option>
                </select> 
            </div>
        </React.Fragment>
    )
}
export default Datagram;