import Header from '../components/header';
import "../css/devices.css"
import "../css/adddevice.css"
import "../css/manageaccount.css"
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Popup from 'reactjs-popup';

async function getUser() {
    try {
        const response = await axios.get('http://127.0.0.1:8000/users/');
        return response.data;
    } catch (error) {
        console.error(error);
    }
}
async function getRooms() {
    try {
        const response = await axios.get('http://127.0.0.1:8000/rooms/');
        return response.data;
    } catch (error) {
        console.error(error);
    }
}
async function searchUser(keyword) {
    try {
        if (keyword == "") {
            const response = await axios.get('http://127.0.0.1:8000/users/');
            return response.data;
        }
        else {
            const response = await axios.get('http://127.0.0.1:8000/users/search/' + keyword + '/');
            console.log(response.data)
            return response.data;
        }
    } catch (error) {
        console.error(error);
    }
}
async function delUser(id) {
    try {
        await axios.delete('http://127.0.0.1:8000/users/' + id + '/');
        window.location.reload();
    } catch (error) {
        console.error(error);
    }
}
var clickStyle = {
    boxShadow: '0px 0px 0px 2px #00ff44'
}
var UnclickStyle = {
    margin: '0px'
}
function ManageAccount() {
    const [user, setUser] = useState([]);
    const [room, setRoom] = useState([]);

    const [addName, setAddName] = useState("");
    const [addPhone, setAddPhone] = useState("");
    const [addID, setAddID] = useState("");
    const [addDate, setAddDate] = useState("");
    const [addPass, setAddPass] = useState("");
    const [addHomeTown, setAddHomeTown] = useState("");
    const [addRoom, setAddRoom] = useState("");
    const [addAdmin, setAddAdmin] = useState("no");
    var isNotAdminStyle = addAdmin == 'no'? {color: '#ff0000',fontWeight: '900'} : {color: '#000000'}
    var isAdminStyle = addAdmin == 'yes'? {color: '#ff0000',fontWeight: '900'} : {color: '#000000'}
    useEffect(() => {
        getUser().then(data => {
            setUser(data);
        });
    }, []);
    useEffect(() => {
        getRooms().then(data => {
            setRoom(data);
        });
    }, []);
    const [userInfo, setUserInfo] = useState("00001");
    function searching(e) {
        var keyword = e.target.value;
        searchUser(keyword).then(data => {
            setUser(data);
            if (data.length != 0) {
                setUserInfo(data[0].userID);
            }
        });
    }
    async function addUser() {
        var userData = {
            "name": addName,
            "phoneNumber": addPhone,
            "userID": addID,
            "dateOfBirth": addDate,
            "password": addPass,
            "homeTown": addHomeTown,
            "room": [addRoom],
            "isAdmin": addAdmin == 'no' ? false : true
        }
        await axios.post('http://127.0.0.1:8000/users/', userData);
        window.location.reload();
    }
    return (
        <div className='manage-account'>
            <Header />
            <div className='manage-account-content'>
                <div className='manage-account-content-left'>
                    <div className='table-content'>
                        <table cellSpacing='0px'>
                            <thead>
                                <tr>
                                    <th>Họ và tên</th>
                                    <th>Số điện thoại</th>
                                    <th>CCCD/CMND</th>
                                    <th>Tài khoản Admin</th>
                                </tr>

                            </thead>

                            <tbody>
                                {
                                    user.length == 0 ? <tr><td colSpan='4'>Không có dữ liệu</td></tr> : user.map((item, index) => {
                                        return (
                                            <tr key={index} className="account" onClick={() => setUserInfo(item.userID)} style={item.userID == userInfo ? clickStyle : UnclickStyle}>
                                                <td>{item.name}</td>
                                                <td>{item.phoneNumber}</td>
                                                <td>{item.userID}</td>
                                                <td>{item.isAdmin == true ? "Admin" : "User"}</td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
                {
                    user.filter(it => it.userID == userInfo).map((item, index) => {
                        return (
                            <div className='manage-account-content-right'>
                                <div className='dv-info-table'>
                                    <div className='right-header-title'>
                                        <h2 className='dv-name'>Account Detail</h2>
                                        <img className='edit-mem' src='../img/edit.png' alt='edit' />
                                    </div>
                                    <hr width="99%" align="center" color='black' />
                                    <div className='account-inf'>
                                        <span>Họ và tên: </span>
                                        <span className='account-inf-value'>{item.name}</span>
                                    </div>
                                    <div className='account-inf'>
                                        <span>SĐT:</span>
                                        <span className='account-inf-value'>{item.phoneNumber}</span>
                                    </div>
                                    <div className='account-inf'>
                                        <span>Số phòng:</span>
                                        <select>
                                            <option>Chọn phòng</option>
                                            {
                                                item.room.map((rm, index) => {
                                                    return (
                                                        <option key={index}>{rm}</option>
                                                    )
                                                })
                                            }
                                        </select>
                                    </div>
                                    <div className='account-inf'>
                                        <span>CMND/CCCD:</span>
                                        <span className='account-inf-value'>{item.userID}</span>
                                    </div>
                                    <div className='account-inf'>
                                        <span>Quê quán: </span>
                                        <span className='account-inf-value'>{item.homeTown}</span>
                                    </div>
                                    <div className='account-inf'>
                                        <span>Ngày sinh: </span>
                                        <span className='account-inf-value'>{item.dateOfBirth}</span>
                                    </div>
                                    <div className='account-inf'>
                                        <span>Mật khẩu: </span>
                                        <span className='account-inf-value'>{item.password}</span>
                                    </div>
                                </div>
                                <div className='trash-border'>
                                    <Popup trigger={<img src='../img/trash.png' alt='trash-img' className='trash-img' />} position="top center" nested>
                                        {close => (
                                            <div className='popup-overlay'>
                                                <div className='xoa-tb'>
                                                    <h2 style={{ fontSize: '40px' }}>Xác nhận xóa tài khoản?</h2>
                                                    <div className='cf-btn'>
                                                        <button className='cancel' onClick={close}>No</button>
                                                        <button onClick={() => delUser(item.userID)} className='ok'>Yes</button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </Popup>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            <div className='manage-account-footer'>
                <div className='map-view-part'>
                    <Link to='manage-view' className="map-view logo-click">
                        <img className="nav2" src="../img/nav.png" alt="nav" />
                        <div className='nav-border'>
                            <p>Manage Device</p>
                        </div>
                    </Link>
                </div>
                <div className='manage-account-center-part'>

                    <Popup trigger={<img className="add-mem" src="../img/add.png" alt="add" />} position="top center" nested>
                        {close => (
                            <div className='manage-account-popup-overlay'>
                                <div className='manage-account-add-content-right'>
                                    <div className='dv-info-table'>
                                        <div className='right-header-title'>
                                            <h2 className='dv-name'>Add account</h2>
                                        </div>
                                        <hr width="99%" align="center" color='black' />
                                        <div className='account-inf'>
                                            <span>Họ và tên: </span>
                                            <input type="text" onChange={e => setAddName(e.target.value)} />
                                        </div>
                                        <div className='account-inf'>
                                            <span>SĐT:</span>
                                            <input type="number" onChange={e => setAddPhone(e.target.value)} />
                                        </div>
                                        <div className='account-inf'>
                                            <span>Số phòng:</span>
                                            <select onChange={e => setAddRoom(e.target.value)}>
                                                <option>Chọn phòng</option>
                                                {
                                                    room.map((rm, index) => {
                                                        return (
                                                            <option key={index}>{rm.Id}</option>
                                                        )
                                                    })
                                                }
                                            </select>
                                        </div>
                                        <div className='account-inf'>
                                            <span>CMND/CCCD:</span>
                                            <input type="text" onChange={e => setAddID(e.target.value)} />
                                        </div>
                                        <div className='account-inf'>
                                            <span>Quê quán: </span>
                                            <input type="text" onChange={e => setAddHomeTown(e.target.value)} />
                                        </div>
                                        <div className='account-inf'>
                                            <span>Ngày sinh: </span>
                                            <input type="date" onChange={e => setAddDate(e.target.value)} />
                                        </div>
                                        <div className='account-inf'>
                                            <span>Mật khẩu: </span>
                                            <input type="text" onChange={e => setAddPass(e.target.value)} />
                                        </div>
                                        <div className='account-inf'>
                                            <span>Quản trị viên: </span>
                                            <div className='isAdmin'>
                                                <div>
                                                    <input type="radio" name="choice" id="b-opt" value="yes" onClick={e => setAddAdmin(e.target.value)} />
                                                    <label htmlFor="b-opt" style={isAdminStyle}>Yes</label>
                                                </div>
                                                <div>
                                                    <input type="radio" name="choice" id="a-opt" value="no" checked onClick={e => setAddAdmin(e.target.value)} />
                                                    <label htmlFor="a-opt" style={isNotAdminStyle}>No</label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='account-inf'>
                                            <button onClick={close}>Hủy bỏ</button>
                                            <button onClick={() => addUser()}>Xác nhận</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </Popup>
                    <div className="search">
                        <img src="../img/search.png" alt="search" />
                        <input type="text" placeholder="Search" onChange={e => searching(e)} />
                    </div>
                </div>
                <div className='map-view-part'>
                    <Link to='manage-account' className="manage-account-header logo-click">
                        <div className='nav-border'>
                            <p>Manage Account</p>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    )
}
export default ManageAccount;