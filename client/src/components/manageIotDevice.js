import Header from './header';
import Footer from './footer';
import "../css/devices.css"
import { Link } from 'react-router-dom';
import Popup from 'reactjs-popup';
import axios from 'axios';
import Datagram from './datagram';
import React, { useEffect, useState } from 'react';

var TotalUser = false;
if (localStorage.getItem("user") != null) {
    TotalUser = JSON.parse(localStorage.getItem("user"));
}

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

async function getDeviceAvailable() {
    try {
        const response = await axios.get('http://127.0.0.1:8000/addDeviceToRoom/');
        return response.data;
    } catch (error) {
        console.error(error);
    }
}
async function addDeviceToRoom(roomId, data) {
    try {
        const response = await axios.put('http://127.0.0.1:8000/rooms/' + roomId + '/', data);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

async function updateDevices(deviceId, userID, roomId, data) {
    try {
        const response = await axios.put('http://127.0.0.1:8000/devices/' + deviceId + '+' + userID + '+' + roomId + '/', data);
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
var clickStyle = {
    boxShadow: '0px 0px 0px 2px #00ff44',
    fontSize: '15px',
    border: '1px solid #adadad',
    fontWeight: '600',
    padding: '2px 2px',
    margin: '3px 10px',
    display: 'flex',
    justifyContent: 'space-between',
}
var UnclickStyle = {
    fontSize: '15px',
    border: '1px solid #adadad',
    fontWeight: '600',
    padding: '2px 2px',
    margin: '3px 10px',
    display: 'flex',
    justifyContent: 'space-between',
}
function ManageIotDevice() {
    const [logOut, setLogOut] = useState("")
    if (logOut === "view-room") {
        window.location.replace("/view-room-list")
    }
    if (logOut === "manage-account") {
        window.location.replace("/manage-account")
    }
    if (logOut === "manage-device") {
        window.location.replace("/manage-device")
    }
    if (logOut === "add-device") {
        window.location.replace("/add-device")
    }
    if (logOut === "logout") {
        window.location.replace("/login")
        console.log("logout")
    }
    // phong hien tai 
    const [curRoom, setCurRoom] = useState(TotalUser.room[0])
    const [deviceType, setDeviceType] = useState('GAS');
    // lay ds thiet bi trong phong 
    const [roomDevices, setRoomDevices] = useState([])
    const [device, setDevice] = useState([]);
    useEffect(() => {
        getRoomDevices(curRoom).then(data => {
            setRoomDevices(data)
        })
    }, [curRoom])

    useEffect(() => {
        getDeviceAvailable().then(data => {
            setDevice(data);
        });
    }, []);
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
    const [deviceIdToAdd, setDeviceIdToAdd] = useState('')
    function updateRoom() {
        const data = {
            "Id": roomDevices.Id,
            "owner": roomDevices.owner,
            "users": roomDevices.users,
            "devices": roomDevices.devices.concat([deviceIdToAdd]),
            "_date_created": roomDevices._date_created,
        }
        addDeviceToRoom(curRoom, data).then(data => {
            window.location.reload().then(() => {
                console.log(curRoom)
            })
        })
    }
    function ChangeDeviceStatus(dvinfo) {
        if (dvinfo.length == 0) {
            console.log("Cho Hiu ngoas")
            window.alert("Please choose device to change status")
        }
        else {
            const dataToUpdate = {
                "Id": dvinfo.Id,
                "name": dvinfo.name,
                "data": dvinfo.data,
                "status": dvinfo.status ? false : true,
                "enabled": dvinfo.enabled,
                "type": dvinfo.type,
                "_date_created": dvinfo._date_created,
            }
            updateDevices(dvinfo.Id, TotalUser.userID, curRoom, dataToUpdate).then(data => {
                setDeviceInfo(data)
            })
            devices.fill(dataToUpdate, devices.findIndex(dv => dv.Id === dvinfo.Id), devices.findIndex(dv => dv.Id === dvinfo.Id) + 1)
        }
    }
    function deleteDevice(dvinfo) {
        const dataToUpdate = {
            "Id": dvinfo.Id,
            "name": dvinfo.name,
            "data": dvinfo.data,
            "status": dvinfo.status,
            "enabled": dvinfo.enabled ? false : true,
            "type": dvinfo.type,
            "_date_created": dvinfo._date_created,
        }
        updateDevices(dvinfo.Id, TotalUser.userID, curRoom, dataToUpdate).then(data => {
            setDeviceInfo(data)
        })
        devices.fill(dataToUpdate, devices.findIndex(dv => dv.Id === dvinfo.Id), devices.findIndex(dv => dv.Id === dvinfo.Id) + 1)
    }
    if (roomDevices.devices) {
        if (devices.length === roomDevices.devices.length) {
            return (
                <div className='manage-iot-device'>
                    <div className="manage-view">
                        <div className="header">
                            <div className='sophong logo-click'>

                                <select onChange={(e) => { setCurRoom(e.target.value); }} value={curRoom}>
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
                                {TotalUser.isAdmin === true ? (
                                    <select className='nav' onChange={(e) => setLogOut(e.target.value)}>
                                        <option value="" selected></option>
                                        <option value="view-room">View room list</option>
                                        <option value="manage-account">Manage account</option>
                                        <option value="manage-device">Manage Device</option>
                                        <option value="add-device">Add Device</option>
                                        <option value="logout">Log Out</option>
                                    </select>
                                ) : (
                                    <select className='nav' onChange={(e) => setLogOut(e.target.value)}>
                                        <option value="" selected></option>
                                        <option value="logout">Log Out</option>
                                    </select>
                                )}


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
                                devices.filter(d => d.enabled == true).map((dv, index) => {
                                    if (dv.type === "LIGHT") {
                                        return (
                                            <div className='device-info' onClick={() => setDeviceInfo(dv)}>
                                                <Popup trigger={<img className='close' style={AdminStyle} src='../img/close.png' alt='close' />} position="top center" nested>
                                                    {close => (
                                                        <div className='popup-overlay'>
                                                            <div className='xoa-tb'>
                                                                <h2>Xóa thiết bị này?</h2>
                                                                <div className='cf-btn'>
                                                                    <button className='cancel' onClick={close}>No</button>
                                                                    <button onClick={() => deleteDevice(deviceInfo)} className='ok'>Yes</button>
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
                                            <div className='device-info' onClick={() => setDeviceInfo(dv)}>
                                                <Popup trigger={<img className='close' style={AdminStyle} src='../img/close.png' alt='close' />} position="top center" nested>
                                                    {close => (
                                                        <div className='popup-overlay'>
                                                            <div className='xoa-tb'>
                                                                <h2>Xóa thiết bị này?</h2>
                                                                <div className='cf-btn'>
                                                                    <button className='cancel' onClick={close}>No</button>
                                                                    <button onClick={() => deleteDevice(deviceInfo)} className='ok'>Yes</button>
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
                                            <div className='device-info' onClick={() => setDeviceInfo(dv)}>
                                                <Popup trigger={<img className='close' style={AdminStyle} src='../img/close.png' alt='close' />} position="top center" nested>
                                                    {close => (
                                                        <div className='popup-overlay'>
                                                            <div className='xoa-tb'>
                                                                <h2>Xóa thiết bị này?</h2>
                                                                <div className='cf-btn'>
                                                                    <button className='cancel' onClick={close}>No</button>
                                                                    <button onClick={() => deleteDevice(deviceInfo)} className='ok'>Yes</button>
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
                                <Popup trigger={<img className='add-device-img' src='../img/add.png' alt='img' />} position="bottom center" nested>
                                    {
                                        close => (
                                            <div className="account-inf-value-border">
                                                <div className="account-inf-value-top">
                                                    <h5>Danh sách thiết bị hiện tại</h5>
                                                    <hr width="99%" align="center" color='black' />
                                                    <div className="room-inf-list">
                                                        {/* {device.map((rm, index) => {
                                                            return (
                                                                <div key={index} className="account-inf-value-ind">
                                                                    <span>{rm.type}</span>
                                                                </div>
                                                            )
                                                        })} */}
                                                        <div className="account-inf-value-ind" style={deviceType === 'GAS' ? clickStyle : UnclickStyle} onClick={() => setDeviceType('GAS')}>
                                                            <span>GAS</span>
                                                        </div>
                                                        <div className="account-inf-value-ind" style={deviceType === 'LIGHT' ? clickStyle : UnclickStyle} onClick={() => setDeviceType('LIGHT')}>
                                                            <span>LIGHT</span>
                                                        </div>
                                                        <div className="account-inf-value-ind" style={deviceType === 'DOOR' ? clickStyle : UnclickStyle} onClick={() => setDeviceType('DOOR')}>
                                                            <span>DOOR</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="account-inf-value-bottom">
                                                    <hr width="99%" align="center" color='black' />
                                                    <h5>Thêm thiết bị</h5>
                                                    <select className="account-inf-value-input" onChange={(e) => setDeviceIdToAdd(e.target.value)}>
                                                        <option>Chọn thiết bị</option>
                                                        {
                                                            device.filter(dv => dv.type == deviceType).map((rm, index) => {
                                                                return (
                                                                    <option key={index} value={rm.Id}>{rm.name}</option>
                                                                )
                                                            })
                                                        }
                                                    </select>
                                                    <div onClick={() => updateRoom()}><button onClick={close} >Xác nhận</button></div>

                                                </div>
                                            </div>
                                        )
                                    }
                                </Popup>
                            </div>

                        </div>

                        {deviceInfo.length != 0 ? (<div className='manage-iot-device-content-right'>
                            <div className='dv-info-table'>
                                <h2 className='dv-name'>{deviceInfo.name}</h2>
                                <hr width="99%" align="center" color='black' />
                                <ul>
                                    <li>
                                        <h2>Information</h2>
                                        <ul>

                                            <li>Status: {deviceInfo.status ? "On" : "Off"}</li>
                                        </ul>
                                    </li>
                                    <li>
                                        <h2>Control</h2>
                                        {/* <img className='stt-icon' src='../img/stt-on.jpg' alt="stt-icon"/> */}
                                    </li>
                                </ul>
                                <div className='stt-icon' onClick={() => ChangeDeviceStatus(deviceInfo)} style={deviceInfo.status ? { backgroundColor: "rgb(46, 235, 62)" } : { backgroundColor: "rgb(235, 74, 46)" }}>
                                    <div className='icon-btn' style={deviceInfo.status ? { left: "98px" } : { left: "2px" }}>
                                    </div>
                                </div>


                                <Popup trigger={<div className='data-gram'>Datagram</div>} position="top center" nested>
                                    {close => (
                                        <div className='popup-overlay'>
                                            <div className='xoa-tb'>
                                                <Datagram close={close} dvId={deviceInfo.Id} dvType={deviceInfo.type} />
                                            </div>
                                        </div>
                                    )}
                                </Popup>
                            </div>
                        </div>) : (
                            <div className='manage-iot-device-content-right'>
                                <div className='dv-info-table'>
                                    <h2 className='dv-name'>Device</h2>
                                    <hr width="99%" align="center" color='black' />
                                    <ul>
                                        <li>
                                            <h2>Information</h2>
                                            <ul>
                                                <li>No devices selected yet</li>
                                            </ul>
                                        </li>
                                        <li>
                                            <h2>Control</h2>
                                            {/* <img className='stt-icon' src='../img/stt-on.jpg' alt="stt-icon"/> */}
                                        </li>
                                    </ul>
                                    <div className='stt-icon' onClick={() => ChangeDeviceStatus(deviceInfo)} style={deviceInfo.status ? { backgroundColor: "rgb(46, 235, 62)" } : { backgroundColor: "rgb(235, 74, 46)" }}>
                                        <div className='icon-btn' style={deviceInfo.status ? { left: "98px" } : { left: "2px" }}>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
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