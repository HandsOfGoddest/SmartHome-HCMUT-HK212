import Header from './header';
import Footer from './footer';
import "../css/devices.css"
import { Link } from 'react-router-dom';
import Popup from 'reactjs-popup';
import axios from 'axios';
import Datagram from './datagram';
import Logs from './logs';
import Records from './recordTable';

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
async function addDevice(device) {
    try {
        const response = await axios.post('http://localhost:8000/devices/', device);
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
async function getCurRecord(id) {
    try {
        const response = await axios.get('http://127.0.0.1:8000/records/' + id + '/');
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


var clicked_type = {
    backgroundColor: '#428af7',
    color: 'white',
    cursor: 'pointer',
}
var Unclick_type = {
    backgroundColor: '#fff',
    color: 'black',
    cursor: 'pointer',
}

var clicked_devices = {
    border: '4px solid rgb(0, 54, 148)',
}
var Unclick_devices = {
    border: '1px solid rgb(0, 0, 0)',
}


function ManageIotDevice({ match }) {

    const [logOut, setLogOut] = useState("")
    if (logOut === "view-room") {
        window.location.replace("/view-room-list")
    }
    if (logOut === "manage-account") {
        window.location.replace("/manage-account")
    }
    if (logOut === "manage-device") {
        window.location.replace("/manage-device/" + TotalUser.room[0])
    }
    if (logOut === "logout") {
        localStorage.removeItem("user");
        window.location.replace("/login")

    }
    // phong hien tai 
    const [curRoom, setCurRoom] = useState(match.params.id)
    const [curValue, setCurValue] = useState({ 'data': 0 })
    const [deviceType, setDeviceType] = useState('GAS')
    const [selectMyDevice, setSelectMyDevice] = useState('')

    const [deviceInfo, setDeviceInfo] = useState([])
    const [deviceIdToAdd, setDeviceIdToAdd] = useState('')
    const [devices, setDevices] = useState([])
    const [addId, setAddId] = useState('')
    const [addName, setAddName] = useState('')
    const [addType, setAddType] = useState('GAS')
    // lay ds thiet bi trong phong 
    const [roomDevices, setRoomDevices] = useState([])
    const [device, setDevice] = useState([]);
    useEffect(() => {
        getRoomDevices(curRoom).then(data => {
            setRoomDevices(data)
        })
    }, [curRoom])
    const [count, setCount] = useState(0)
    useEffect(() => {
        if (deviceInfo.Id) {
            getCurRecord(deviceInfo.Id).then(data => {
                if (data.length !== 0) {
                    setCurValue(data[data.length - 1])
                }
                else {
                    setCurValue({ 'data': 0 })
                }
                setTimeout(() => {
                    setCount(count == 0 ? 1 : 0)
                }, 100)
            })
        }
        else {
            getCurRecord(2).then(data => {
                if (data.length !== 0) {
                    setCurValue(data[data.length - 1])
                }
                else {
                    setCurValue({ 'data': 0 })
                }
                setTimeout(() => {
                    setCount(count == 0 ? 1 : 0)
                }, 100)
            })
        }

    }, [count])


    console.log(curValue)
    console.log(deviceInfo)

    // setInterval(() => {
    //     axios.get('http://127.0.0.1:8000/records/' + deviceInfo.Id + '/').then(res => {
    //         if (res.data.length > 0) {
    //             setCurValue(res.data[res.data.length - 1])
    //         }
    //     })
    // }, 500)

    useEffect(() => {
        getDeviceAvailable().then(data => {
            setDevice(data);
        });
    }, []);

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
    function confirmAddDevice() {
        const newDv = {
            "Id": addId,
            "name": addName,
            "data": 0.0,
            "status": false,
            "enabled": true,
            "type": addType,
        }
        if (addId !== '' && addName !== '' && addType !== '') {
            addDevice(newDv).then((res) => {
                if (res === 409) {
                    alert("Thi???t b??? ???? t???n t???i")
                }
                else {
                    alert("Th??m thi???t b??? th??nh c??ng")
                }
            })
        }
        else {
            alert("Vui l??ng nh???p ?????y ????? th??ng tin")
        }
    }
    function ClearAddDvInfo() {
        setAddId('')
        setAddName('')
        setAddType('GAS')
    }
    if (roomDevices.devices) {
        if (devices.length === roomDevices.devices.length) {
            return (
                <div className='manage-iot-device'>
                    <div className="manage-view">
                        <div className="header">

                            <Popup trigger={<div className='sophong logo-click'><p>Ph??ng {curRoom}</p></div>} position="bottom center" nested>
                                {close => (
                                    <div className="account-inf-value-border1">
                                        <div className="account-inf-value-top">
                                            <h5>Danh s??ch ph??ng hi???n t???i</h5>
                                            <hr width="100%" align="center" color='black' />
                                            <div className="room-inf-list">
                                                {
                                                    TotalUser.room.map((rm, index) => {
                                                        return (
                                                            <div onClick={close}>
                                                                <Link to={`/manage-device/${rm}`} onClick={() => { setCurRoom(rm); setDeviceInfo([]) }} className="logo-click account-inf-value-ind" >
                                                                    <span>Ph??ng {rm}</span>
                                                                </Link>
                                                            </div>
                                                        )
                                                    })

                                                }
                                            </div>
                                        </div>

                                    </div>
                                )}
                            </Popup>

                            <Link to='/' className='logo-click'>
                                <div className="logo">
                                    <img className='homelogo' src='../img/homelogo.png' alt="logo" />
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
                                <div className='devices' onClick={() => setSelectMyDevice('')} style={selectMyDevice === '' ? clicked_type : Unclick_type}>
                                    <img className='device-icon' src='../img/alldv.png' alt="icon" />
                                    <span className='device-name' >T???t c??? thi???t b???</span>
                                </div>
                                <div className='devices' onClick={() => setSelectMyDevice('LIGHT')} style={selectMyDevice === 'LIGHT' ? clicked_type : Unclick_type}>
                                    <img className='device-icon' src='../img/light.png' alt="icon" />
                                    <span className='device-name'>B??ng ????n</span>
                                </div>
                                <div className='devices' onClick={() => setSelectMyDevice('GAS')} style={selectMyDevice === 'GAS' ? clicked_type : Unclick_type}>
                                    <img className='device-icon' src='../img/fire.png' alt="icon" />
                                    <span className='device-name' style={{ whiteSpace: 'nowrap' }}>C???m bi???n kh?? gas</span>
                                </div>
                                <div className='devices' onClick={() => setSelectMyDevice('DOOR')} style={selectMyDevice === 'DOOR' ? clicked_type : Unclick_type}>
                                    <img className='device-icon' src='../img/exit.png' alt="icon" />
                                    <span className='device-name' >C???m bi???n ?????t nh???p</span>
                                </div>
                                <Popup trigger={
                                    TotalUser.isAdmin === true && (
                                        <div className='devices' onClick={() => setSelectMyDevice('ADD')} style={selectMyDevice === 'ADD' ? clicked_type : Unclick_type}>
                                            <img className='device-icon' src='../img/add.png' alt="icon" />
                                            <span className='device-name' >Th??m thi???t b??? m???i</span>
                                        </div>
                                    )
                                } position='right bottom' onClose={ClearAddDvInfo} nested>
                                    {close => (
                                        <div className="account-inf-value-border2">
                                            <h4>Th??m thi???t b??? m???i</h4>
                                            <hr width="100%" align="center" color='black' />
                                            <div className='add-dv'>
                                                <p>Device name</p>
                                                <input type='text' onChange={(e) => setAddName(e.target.value)} />
                                            </div>
                                            <div className="add-dv">
                                                <p>Device ID</p>
                                                <input type='text' onChange={(e) => setAddId(e.target.value)} />
                                            </div>
                                            <div className="add-dv">
                                                <p>Device type</p>
                                                <select name="device-type" id="device-type" onChange={(e) => setAddType(e.target.value)}>
                                                    <option value="GAS" selected>GAS</option>
                                                    <option value="LIGHT">LIGHT</option>
                                                    <option value="DOOR">DOOR</option>
                                                </select>
                                            </div>
                                            <div className='add-dv-cf'>
                                                <button className='add-dv-huy' onClick={close}>H???y b???</button>
                                                <button className='add-dv-ok' onClick={() => confirmAddDevice()}>X??c nh???n</button>
                                            </div>
                                        </div>
                                    )}
                                </Popup>
                            </div>

                        </div>
                        <div className='manage-iot-device-content-center'>
                            {
                                selectMyDevice === '' ? (
                                    devices.filter(d => d.enabled == true).map((dv, index) => {
                                        if (dv.type === "LIGHT") {
                                            return (
                                                <div className='device-info' onClick={() => setDeviceInfo(dv)} style={deviceInfo === dv ? clicked_devices : Unclick_devices}>
                                                    <Popup trigger={<img className='close' style={AdminStyle} src='../img/close.png' alt='close' />} position="top center" nested>
                                                        {close => (
                                                            <div className='popup-overlay'>
                                                                <div className='xoa-tb'>
                                                                    <h2>X??a thi???t b??? n??y?</h2>
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
                                                <div className='device-info' onClick={() => setDeviceInfo(dv)} style={deviceInfo === dv ? clicked_devices : Unclick_devices}>
                                                    <Popup trigger={<img className='close' style={AdminStyle} src='../img/close.png' alt='close' />} position="top center" nested>
                                                        {close => (
                                                            <div className='popup-overlay'>
                                                                <div className='xoa-tb'>
                                                                    <h2>X??a thi???t b??? n??y?</h2>
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
                                                <div className='device-info' onClick={() => setDeviceInfo(dv)} style={deviceInfo === dv ? clicked_devices : Unclick_devices}>
                                                    <Popup trigger={<img className='close' style={AdminStyle} src='../img/close.png' alt='close' />} position="top center" nested>
                                                        {close => (
                                                            <div className='popup-overlay'>
                                                                <div className='xoa-tb'>
                                                                    <h2>X??a thi???t b??? n??y?</h2>
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
                                ) : (
                                    devices.filter(d => d.enabled == true).filter(d => d.type == selectMyDevice).map((dv, index) => {
                                        if (dv.type === "LIGHT") {
                                            return (
                                                <div className='device-info' onClick={() => setDeviceInfo(dv)} style={deviceInfo === dv ? clicked_devices : Unclick_devices}>
                                                    <Popup trigger={<img className='close' style={AdminStyle} src='../img/close.png' alt='close' />} position="top center" nested>
                                                        {close => (
                                                            <div className='popup-overlay'>
                                                                <div className='xoa-tb'>
                                                                    <h2>X??a thi???t b??? n??y?</h2>
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
                                                <div className='device-info' onClick={() => setDeviceInfo(dv)} style={deviceInfo === dv ? clicked_devices : Unclick_devices}>
                                                    <Popup trigger={<img className='close' style={AdminStyle} src='../img/close.png' alt='close' />} position="top center" nested>
                                                        {close => (
                                                            <div className='popup-overlay'>
                                                                <div className='xoa-tb'>
                                                                    <h2>X??a thi???t b??? n??y?</h2>
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
                                                <div className='device-info' onClick={() => setDeviceInfo(dv)} style={deviceInfo === dv ? clicked_devices : Unclick_devices}>
                                                    <Popup trigger={<img className='close' style={AdminStyle} src='../img/close.png' alt='close' />} position="top center" nested>
                                                        {close => (
                                                            <div className='popup-overlay'>
                                                                <div className='xoa-tb'>
                                                                    <h2>X??a thi???t b??? n??y?</h2>
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
                                )
                            }



                            <div className='device-info' style={AdminStyle}>
                                <Popup trigger={<img className='add-device-img' src='../img/add.png' alt='img' />} position="bottom center" nested>
                                    {
                                        close => (
                                            <div className="account-inf-value-border2">
                                                <div className="account-inf-value-top">
                                                    <h5>Danh s??ch thi???t b??? hi???n t???i</h5>
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
                                                    <h5>Th??m thi???t b???</h5>
                                                    <select className="account-inf-value-input" onChange={(e) => setDeviceIdToAdd(e.target.value)}>
                                                        <option>Ch???n thi???t b???</option>
                                                        {
                                                            device.filter(dv => dv.type == deviceType).map((rm, index) => {
                                                                return (
                                                                    <option key={index} value={rm.Id}>{rm.name}</option>
                                                                )
                                                            })
                                                        }
                                                    </select>
                                                    <div style={{ display: 'inline' }} onClick={() => updateRoom()}><button onClick={close} >X??c nh???n</button></div>

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
                                            <li>Gi?? tr??? hi???n t???i: {curValue.data}</li>
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
                                            <div className='datagram-tb'>
                                                <Datagram close={close} dvId={deviceInfo.Id} dvType={deviceInfo.type} />
                                            </div>
                                        </div>
                                    )}
                                </Popup>

                                <Popup trigger={<div className='data-gram'>Record table</div>} position="top center" nested>
                                    {close => (
                                        <div className='popup-overlay'>
                                            <div className='log-tb'>
                                                <Records close={close} deviceID={deviceInfo.Id} roomID={curRoom.Id} />
                                            </div>
                                        </div>
                                    )}
                                </Popup>

                                <Popup trigger={<div className='data-gram'>Logs</div>} position="top center" nested>
                                    {close => (
                                        <div className='popup-overlay'>
                                            <div className='log-tb'>
                                                <Logs close={close} deviceID={deviceInfo.Id} />
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