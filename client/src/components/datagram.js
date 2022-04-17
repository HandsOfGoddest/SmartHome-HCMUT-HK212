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


function Datagram({ dvId,dvType,close }) {
    var dulieu = [];
    const [plotType, setPlotType] = useState(10);
    const [data, setData] = useState([]);
    useEffect(() => {
        getDatagram(dvId).then(data => {
            setData(data);
        });
    }, []);

    if (data.length !== 0) {
        if( data.length >= plotType){
            for (var x = 0; x < plotType; x++) {
                if (data[data.length - 1 -x]._date_created) {
                    dulieu.push({
                        'data': data[data.length - 1 -x].data,
                        'date': data[data.length - 1 -x]._date_created.split("T")[0].split("-")[2],
                        'month': data[data.length - 1 -x]._date_created.split("T")[0].split("-")[1],
                        'year': data[data.length - 1 -x]._date_created.split("T")[0].split("-")[0],
                        'hour': data[data.length - 1 -x]._date_created.split("T")[1].split(":")[0],
                    })
                }
            }
            dulieu.reverse();
        }
        else{
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
    }
    
    return (
        <React.Fragment >
            <div style={{width:"100%",display:"flex", justifyContent:"space-between"}}>
            <img onClick={()=>close()} src='../img/closebtn.png' alt="" style={{alignSelf:'flex-end'}}/>
            </div>
            <div style={{textAlign:'center'}}>Biểu đồ {dvType}</div>
            <LineChart width={600} height={300} data={dulieu} style={{ fontSize: "15px" }} margin={{ top: 5, right: 10, bottom: 5, left: 0 }} >
                <XAxis dataKey={"hour"} />
                <YAxis />
                <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                <Line type="monotone" dataKey="data" stroke="#8884d8" />
                <Tooltip />
            </LineChart>

            <div className="dv-input">  
                <select onChange={(e)=>setPlotType(e.target.value)} style={{alignSelf:'flex-end'}}>
                    <option value = {10} selected>10 record gần đây</option>
                    <option value={20}>20 record gần đây</option>
                    <option value={30}>30 record gần đây</option>
                    <option value={50}>50 record gần đây</option>
                </select> 
            </div>
        </React.Fragment>
    )
}
export default Datagram;