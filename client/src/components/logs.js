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
    var day = '' + d.getDate()
    var year = d.getFullYear()
    var hour = d.getHours()
    var minute = d.getMinutes()
    var second = d.getSeconds()
    return  [hour, minute, second].join(':') + ' ngày ' + [day,month,year].join('/') 
}
function Logs({ close, roomID, deviceID }) {
    const [Logs, setLogs] = useState([]);
    useEffect(() => {
        getLogs().then(data => {
            setLogs(data);
        });
    }, []);
    return (
        <div className='logs'>

            <h2>Nhật ký điều khiển thiết bị</h2>

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

                    {Logs.filter(log => log.deviceId == deviceID).length !== 0 ? (
                        Logs.filter(log => log.deviceId == deviceID).map((log, index) => (
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
                        <td colSpan='6' style={{ textAlign: 'center', width: '100%' }}>Chưa có dữ liệu</td>
                    }

                </tbody>
            </table>
            <div className="btn-overlay"><button onClick={close}>Đóng</button></div>
        </div>
    )
}
export default Logs;