import Header from './header';
import Footer from './footer';
import "../css/devices.css"
import { Link } from 'react-router-dom';
import Popup from 'reactjs-popup';
var isAdmin = 1
function ManageIotDevice() {
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
    return (
        <div className='manage-iot-device'>
            <Header />
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
                    <div className='device-info'>
                            <Popup trigger={<img className='close' style={AdminStyle} src='../img/close.png' alt='close' />} position="top center" nested>
                                {close => (
                                    <div className='popup-overlay'>
                                        <div className='xoa-tb'>
                                            <h2>Xóa thiết bị này?</h2>
                                            <div className='cf-btn'>
                                                <button className='cancel' onClick={close}>No</button>
                                                <button className='ok'>Yes</button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </Popup>
                        <img className='device-info-img' src='../img/led.jpg' alt='img' />
                        <p className='device-info-name'>APTX-4869</p>
                    </div>



                    <div className='device-info' style={AdminStyle}>
                        <Link to="add-device"><img className='add-device-img' src='../img/add.png' alt='img' /></Link>
                    </div>

                </div>
                <div className='manage-iot-device-content-right'>
                    <div className='dv-info-table'>
                        <h2 className='dv-name'>APTX-4869</h2>
                        <hr width="99%" align="center" color='black' />
                        <ul>
                            <li>
                                <h2>Information</h2>
                                <ul>
                                    <li>Location</li>
                                    <li>Status: Off</li>
                                </ul>
                            </li>
                            <li>
                                <h2>Control</h2>
                                {/* <img className='stt-icon' src='../img/stt-on.jpg' alt="stt-icon"/> */}
                            </li>
                        </ul>
                        <div className='stt-icon'>
                            <div className='icon-btn'>
                            </div>
                        </div>
                        <div className='data-gram'>Datagram</div>

                    </div>
                    
                </div>
            </div>
            <Footer isAdmin={isAdmin} style={UserStyle}/>
        </div>
    )
}
export default ManageIotDevice;