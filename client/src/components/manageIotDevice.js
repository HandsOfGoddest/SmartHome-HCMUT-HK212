import Header from './header';
import Footer from './footer';
import "../css/devices.css"
import { Link } from 'react-router-dom';
import Popup from 'reactjs-popup';
import axios from 'axios';
import Datagram from './datagram';
import React, { useEffect, useState } from 'react';
var TotalUser = JSON.parse(localStorage.getItem("user"));
var isAdmin = TotalUser.isAdmin == false ? 0 : 1;
let AdminStyle = {}
let UserStyle = {}
if (isAdmin === 0) {
    AdminStyle = {
        display: 'none'
    }
    UserStyle = {
        display: 'block'
    }
}
else {
    AdminStyle = {
        display: 'block'
    }
    UserStyle = {
        display: 'none'
    }
}
async function getRoomDevices(roomId) {
    try {
        const response = await axios.get('http://127.0.0.1:8000/rooms/' + roomId + '/');
        return response.data;
    } catch (error) {
        console.error(error);
    }
}
async function updateDevices(id, data) {
    try {
        const response = await axios.put('http://127.0.0.1:8000/devices/'+id+'/', data);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}
async function getDeviceDetail(dvId) {
    try {
        const response = await axios.get('http://127.0.0.1:8000/devices/' + dvId + '/');
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

function ManageIotDevice() {
    const [logOut, setLogOut] = useState("")
    if (logOut === "logout") {
        window.location.replace("/login")
    }
    // phong hien tai 
    const [curRoom, setCurRoom] = useState(TotalUser.room[0])

    // lay ds thiet bi trong phong 
    const [roomDevices, setRoomDevices] = useState([])
    useEffect(() => {
        getRoomDevices(curRoom).then(data => {
            setRoomDevices(data)
        })
    }, [curRoom])

    const [devices, setDevices] = useState([])
    useEffect(() => {
        if (roomDevices.devices) {
            setDevices([])
            roomDevices.devices.map((dv, index) => {
                getDeviceDetail(dv).then(data => {
                    setDevices(devices => [...devices, data])

                })
            })
        }
    }, [roomDevices.devices])
    const [deviceInfo, setDeviceInfo] = useState([])

    function ChangeDeviceStatus(dvinfo){
        const dataToUpdate={
            "Id": dvinfo.Id,
            "name": dvinfo.name,
            "data": dvinfo.data,
            "status": dvinfo.status?false:true,
            "enabled": dvinfo.enabled,
            "type": dvinfo.type,
            "_date_created": dvinfo._date_created,
        }
        updateDevices(dvinfo.Id,dataToUpdate).then(data=>{
            setDeviceInfo(data)
        })
        devices.fill(dataToUpdate,devices.findIndex(dv=>dv.Id===dvinfo.Id),devices.findIndex(dv=>dv.Id===dvinfo.Id)+1)
    }
    function deleteDevice(dvinfo){
        const dataToUpdate={
            "Id": dvinfo.Id,
            "name": dvinfo.name,
            "data": dvinfo.data,
            "status": dvinfo.status,
            "enabled": dvinfo.enabled?false:true,
            "type": dvinfo.type,
            "_date_created": dvinfo._date_created,
        }
        updateDevices(dvinfo.Id,dataToUpdate).then(data=>{
            setDeviceInfo(data)
        })
        devices.fill(dataToUpdate,devices.findIndex(dv=>dv.Id===dvinfo.Id),devices.findIndex(dv=>dv.Id===dvinfo.Id)+1)
    }
    
    if (roomDevices.devices) {
        if (devices.length === roomDevices.devices.length) {
            return (
                <div className='manage-iot-device'>
                    <div className="manage-view">
                        <div className="header">
                            <div className='sophong logo-click'>
                                
                                <select onChange={(e) => {setCurRoom(e.target.value)}} value={curRoom}>
                                    {
                                        TotalUser.room.map((rm, index) => {
                                            return (
                                                <option key={index} value={rm}>Phòng {rm}   </option>
                                            )
                                        })
                                    }
                                    {/* <option selected></option> */}
                                </select>
                                {/* <img className="nav" src="../img/nav.png" alt="nav" />
                                <span>Phòng </span>
                                <span>217</span> */}
                            </div>
                            <Link to='/' className='logo-click'>
                                <div className="logo">
                                    <img className='homelogo' src='./img/homelogo.png' alt="logo" />
                                    <h2>Smart Home</h2>
                                </div>
                            </Link>
                            <div className="name">
                                <h1>{TotalUser.name}</h1>
                                <img className="avt" src="../img/avt.jpg" alt="avtatar" />
                                {/* <img className="nav" src="../img/nav.png" alt="nav" /> */}
                                <select className='nav' onChange={(e) => setLogOut(e.target.value)}>
                                    <option value="" selected disabled></option>
                                    <option value="logout">Log Out</option>
                                </select>
                            </div>
                        </div>

                    </div>
                    <div className='manage-iot-device-content'>
                        <div className='manage-iot-device-content-left'>
                            <div className='dv-table'>
                                <h2 className='dv-name'>My device</h2>
                                <div className='devices'>
                                    <img className='device-icon' src='../img/light.png' alt="icon" />
                                    <span className='device-name'>Bóng đèn</span>
                                </div>
                                <div className='devices'>
                                    <img className='device-icon' src='../img/fire.png' alt="icon" />
                                    <span className='device-name'>Cảm biến khí gas</span>
                                </div>
                                <div className='devices'>
                                    <img className='device-icon' src='../img/exit.png' alt="icon" />
                                    <span className='device-name'>Cảm biến đột nhập</span>
                                </div>
                            </div>

                        </div>
                        <div className='manage-iot-device-content-center'>
                            {
                                devices.filter(d=>d.enabled == true).map((dv, index) => {
                                    if (dv.type === "LIGHT") {
                                        return (
                                            <div className='device-info' onClick={()=>setDeviceInfo(dv)}>
                                                <Popup trigger={<img className='close' style={AdminStyle} src='../img/close.png' alt='close' />} position="top center" nested>
                                                    {close => (
                                                        <div className='popup-overlay'>
                                                            <div className='xoa-tb'>
                                                                <h2>Xóa thiết bị này?</h2>
                                                                <div className='cf-btn'>
                                                                    <button className='cancel' onClick={close}>No</button>
                                                                    <button onClick={()=>deleteDevice(deviceInfo)}  className='ok'>Yes</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </Popup>
                                                <img className='device-info-img' src='../img/led.jpg' alt='img' />
                                                <p className='device-info-name'>{dv.name}</p>
                                            </div>
                                        )
                                    }
                                    else if (dv.type === "GAS") {
                                        return (
                                            <div className='device-info'  onClick={()=>setDeviceInfo(dv)}>
                                                <Popup trigger={<img className='close' style={AdminStyle} src='../img/close.png' alt='close' />} position="top center" nested>
                                                    {close => (
                                                        <div className='popup-overlay'>
                                                            <div className='xoa-tb'>
                                                                <h2>Xóa thiết bị này?</h2>
                                                                <div className='cf-btn'>
                                                                    <button className='cancel' onClick={close}>No</button>
                                                                    <button onClick={()=>deleteDevice(deviceInfo)}  className='ok'>Yes</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </Popup>
                                                <img className='device-info-img' src='../img/gas.jpg' alt='img' />
                                                <p className='device-info-name'>{dv.name}</p>
                                            </div>
                                        )
                                    }
                                    else if (dv.type === "DOOR") {
                                        return (
                                            <div className='device-info' onClick={()=>setDeviceInfo(dv)}>
                                                <Popup trigger={<img className='close' style={AdminStyle} src='../img/close.png' alt='close' />} position="top center" nested>
                                                    {close => (
                                                        <div className='popup-overlay'>
                                                            <div className='xoa-tb'>
                                                                <h2>Xóa thiết bị này?</h2>
                                                                <div className='cf-btn'>
                                                                    <button className='cancel' onClick={close}>No</button>
                                                                    <button onClick={()=>deleteDevice(deviceInfo)} className='ok'>Yes</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </Popup>
                                                <img className='device-info-img' src='../img/door.jpg' alt='img' />
                                                <p className='device-info-name'>{dv.name}</p>
                                            </div>
                                        )
                                    }
                                    else { }
                                })
                            }



                            <div className='device-info' style={AdminStyle}>
                                <Link to="add-device"><img className='add-device-img' src='../img/add.png' alt='img' /></Link>
                            </div>

                        </div>
                        
                             <div className='manage-iot-device-content-right'>
                                <div className='dv-info-table'>
                                    <h2 className='dv-name'>{deviceInfo.name}</h2>
                                    <hr width="99%" align="center" color='black' />
                                    <ul>
                                        <li>
                                            <h2>Information</h2>
                                            <ul>
                                                                                                                                                  
                                                <li>Status: {deviceInfo.status ? "On": "Off"}</li>
                                            </ul>
                                        </li>
                                        <li>
                                            <h2>Control</h2>
                                            {/* <img className='stt-icon' src='../img/stt-on.jpg' alt="stt-icon"/> */}
                                        </li>
                                    </ul>
                                    <div className='stt-icon' onClick={()=>ChangeDeviceStatus(deviceInfo)} style={deviceInfo.status?{backgroundColor: "rgb(46, 235, 62)"}:{backgroundColor: "rgb(235, 74, 46)"} }>
                                        <div className='icon-btn' style={deviceInfo.status?{left: "98px"}:{left: "2px"}}>
                                        </div>
                                    </div>
                                    
                                    <Popup trigger={<div className='data-gram'>Datagram</div>} position="top center" nested>
                                                    {close => (
                                                        <div className='popup-overlay'>
                                                            <div className='xoa-tb'>
                                                                <Datagram close={close} dvId = {deviceInfo.Id} dvType = {deviceInfo.type} />
                                                            </div>
                                                        </div>
                                                    )}
                                                </Popup>

                                </div>

                            </div>
                               
                    </div>
                    <Footer isAdmin={isAdmin} style={UserStyle} />
                </div>
            )
        }
        else {
            return (
                <div></div>
            )
        }
    }
    else {
        return (
            <div></div>
        )
    }


}
export default ManageIotDevice;