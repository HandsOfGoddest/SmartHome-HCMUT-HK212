import Header from '../components/header';
import "../css/devices.css"
import "../css/adddevice.css"
import { Link } from 'react-router-dom';
import Popup from 'reactjs-popup';
import { useState } from 'react';
import axios from 'axios';

async function addDevice(device){
    const res = await axios.post('http://localhost:8000/devices/', device);
    console.log(res);
}
function AddDevice() {
    const [clickHander, setClickHander] = useState(false)
    const [addId, setAddId] = useState('')
    const [addName, setAddName] = useState('')
    const [addType, setAddType] = useState('GAS')
    function confirmAddDevice(){
        const data ={
            "Id": addId,
            "name": addName,
            "data": 0.0,
            "status": clickHander,
            "enabled": true,
            "type": addType,
        }
        addDevice(data).then(e=>
            {
                alert("Thêm thiết bị thành công")
                window.location.replace("manage-view")
            }
        )
    }
    return (
        <div className='add-device'>
            <Header/>
            <div className='add-device-content'>
                <div className='add-device-content-left'>
                    <div className='content-top'>
                        <div className='add-device-title'><p>Add device</p></div>
                        <div className='add-device-names'>
                            <div className='add-device-name'>
                                <p>Device name</p>
                                <input type='text' onChange={(e)=>setAddName(e.target.value)}/>
                            </div>
                        </div>
                    </div>
                    <div className='content-bottom'>
                            <div className="device-id">
                                <p>Device ID</p>
                                <input type='text' onChange={(e)=>setAddId(e.target.value)}/>
                            </div>
                            <div className="device-type">
                                <p>Device type</p>
                                <select name="device-type" id="device-type" onChange={(e)=>setAddType(e.target.value)}>
                                    <option value="GAS" selected>GAS</option>
                                    <option value="LIGHT">LIGHT</option>
                                    <option value="DOOR">DOOR</option>
                                </select>
                            </div>
                    </div>

                </div>
                <div className='add-device-content-right'>
                    <div className='dv-info-table'>
                        <h2 className='dv-name'>Add Device</h2>
                        <hr width="99%" align="center" color='black' />
                        <ul>
                            <li>
                                <h2>Information</h2>
                                <ul>
                                    <li>Location</li>
                                    <li>Status: 
                                        {clickHander? "On":"Off"}
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <h2>Control</h2>
                                {/* <img className='stt-icon' src='../img/stt-on.jpg' alt="stt-icon"/> */}
                            </li>
                        </ul>
                        <div className='stt-icon' onClick={()=>setClickHander(clickHander?false:true)} style={clickHander?{backgroundColor: "rgb(46, 235, 62)"}:{backgroundColor: "rgb(235, 74, 46)"} }>
                                        <div className='icon-btn' style={clickHander?{left: "98px"}:{left: "2px"}}>
                                        </div>
                                    </div>
                                    <br />

                    </div>

                </div>
            </div>
            <div className='add-device-footer'>
                <div className='map-view-part'>
                
                </div>
                <div className='center-part'>
                    <Link to="manage-view" className='logo-click'><button className='huybo'>Hủy bỏ</button></Link>
                    <Link to="#" className='logo-click'><button className='xacnhan' onClick={()=>confirmAddDevice()}>Xác nhận</button></Link>
                    
                </div>
                <div className='power-part'>
                <img src="../img/power.png" alt="power" className='power' />

                </div>
            </div>
        </div>
    )
}
export default AddDevice;