import Header from '../components/header';
import "../css/devices.css"
import "../css/adddevice.css"
import { Link } from 'react-router-dom';
import Popup from 'reactjs-popup';
import { useState } from 'react';
function AddDevice() {
    const [clickHander, setClickHander] = useState(false)
    return (
        <div className='add-device'>
            <Header/>
            <div className='add-device-content'>
                <div className='add-device-content-left'>
                    <div className='content-top'>
                        <div className='add-device-title'><p>Add device</p></div>
                        <div className='add-device-names'>
                            <div className='add-device-icon'>
                                <Popup trigger={<img src='../img/add.png' alt='img'/>} position="right top" nested>
                                {close => (
                                    <div className='icon-overlay'>
                                        <img className='icon' src='../img/condition.png'  alt='icon'/>
                                        <img className='icon' src='../img/door.png'  alt='icon'/>
                                        <img className='icon' src='../img/fire.png'  alt='icon'/>
                                        <img className='icon' src='../img/lamp.png'  alt='icon'/>
                                        <img className='icon' src='../img/light.png'  alt='icon'/>
                                        <img className='icon' src='../img/microwave.png'  alt='icon'/>
                                        <img className='icon' src='../img/exit.png'  alt='icon'/>
                                        <img className='icon' src='../img/close.png'  alt='icon'/>
                                        <img className='icon' src='../img/webcam.png'  alt='icon'/>
                                    </div>
                                )}
                            </Popup>
                                <p> add icon </p>
                            </div>
                            <div className='add-device-name'>
                                <p>Device name</p>
                                <input type='text'/>
                            </div>
                        </div>
                    </div>
                    <div className='content-bottom'>

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
                                        <select name="addDvStt" id="addDvStt" style={{fontSize:"22px",border:"0px"}}>
                                            <option value="1">On</option>
                                            <option value="2">Off</option>
                                        </select>
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
                        <div className='data-gram'>Datagram</div>

                    </div>

                </div>
            </div>
            <div className='add-device-footer'>
                <div className='map-view-part'>
                <Link to='manage-view' className="map-view logo-click">
                        <img className="nav2" src="../img/nav.png" alt="nav" />
                        <div className='nav-border'>
                        <p>Manage Device</p>
                        </div>
                    </Link>
                </div>
                <div className='center-part'>
                    <Link to="manage-view" className='logo-click'><button className='huybo'>Hủy bỏ</button></Link>
                    <Link to="manage-view" className='logo-click'><button className='xacnhan'>Xác nhận</button></Link>
                    
                </div>
                <div className='power-part'>
                <img src="../img/power.png" alt="power" className='power' />

                </div>
            </div>
        </div>
    )
}
export default AddDevice;