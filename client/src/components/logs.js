import axios from 'axios';
import React, { useState, useEffect } from 'react';
import '../css/logs.css'
async function getLogs(dvId) {
    try {
        const response = await axios.get("http://localhost:8000/logs/");
        return response.data;
    } catch (error) {
        console.error(error);
    }
}


function formatDate(date) {
    var d = new Date(date)
    var month = '' + (d.getMonth() + 1)
    var year = d.getFullYear()
    var hour,day
    if(d.getHours() - 7 < 0 & d.getDate()>1) 
    {
        hour = '' + (d.getHours() + 24 - 7)
        day = '' + (d.getDate() - 1)

    } 

    else if(d.getHours() - 7 < 0 & d.getDate() == 1){
        hour = '' + (d.getHours() + 24 - 7)
        month = '' + (d.getMonth())
        if(month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12){
            day = '31'
        }
        else if(month == 4 || month == 6 || month == 9 || month == 11){
            day = '30'
        }
        else day = '28'
    }

    else {
        day = '' + d.getDate()
        hour = '' + (d.getHours() - 7)
    }
    var minute = '' + d.getMinutes()
    var second = '' + d.getSeconds()
    if (month.length < 2) month = '0' + month
    if (hour.length < 2) hour = '0' + hour
    if (minute.length < 2) minute = '0' + minute
    if (second.length < 2) second = '0' + second
    return  [hour, minute, second].join(':') + ' ngày ' + [day,month,year].join('/') 
}
function checkDate(date,dateFrom,dateTo) {
    var d = new Date(date.split("T")[0])
    var df = new Date(dateFrom)
    var dt = new Date(dateTo)
    if(dateFrom == '' && dateTo == '') return true
    else if(dateFrom == '' && dateTo != '') return d <= dt
    else if(dateFrom != '' && dateTo == '') return d >= df
    else return d >= df && d <= dt
}
function Logs({ close, deviceID }) {
    const [Logs, setLogs] = useState([]);
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    useEffect(() => {
        getLogs(deviceID).then(data => {
            setLogs(data);
        });
    }, []);
    return (
        <div className='logs'>

            <h2>Nhật ký điều khiển thiết bị</h2>
            <div className="date-input"> 
                <label htmlFor="date-start">From</label>
                <input name='date-start' id='date-start' type="date" onChange={(e)=>setDateFrom(e.target.value)}/>
                <label htmlFor="date-end">to</label>
                <input name='date-end' id='date-end' type="date" onChange={(e)=>setDateTo(e.target.value)} />
            </div>
            <div className="logs-table"> 
                <table cellSpacing='0px' border='1px' >
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Id thiết bị</th>
                            <th>Giá trị thay đổi</th>
                            <th>Người điều khiển</th>
                            <th>Id người điều khiển</th>
                            <th>Ngày điều khiển</th>
                        </tr>

                    </thead>

                    <tbody>

                        {Logs.filter(log => log.deviceId == deviceID && checkDate(log._date_changed,dateFrom,dateTo)).length !== 0 ? (
                            Logs.filter(log => log.deviceId == deviceID && checkDate(log._date_changed,dateFrom,dateTo)).map((log, index) => (
                                <tr key={index} className="account">
                                    <td>{index+1}</td>
                                    <td>{log.deviceId}</td>
                                    <td>{log.changeValue}</td>
                                    <td>{log.byUserName}</td>
                                    <td>{log.userID}</td>
                                    <td>{formatDate(log._date_changed)}</td>
                                </tr>
                            ))
                        ) :
                            <td colSpan='6' style={{ textAlign: 'center', width: '100%' }}>Không có dữ liệu</td>
                        }

                    </tbody>
                </table>
            </div>
            
            <div className="btn-overlay"><img onClick={()=>close()} src='../img/closebtn.png' alt="" style={{alignSelf:'flex-end'}}/></div>
        </div>
    )
}
export default Logs;