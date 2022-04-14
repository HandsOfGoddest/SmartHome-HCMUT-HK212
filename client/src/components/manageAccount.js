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
            return response.data;
        }
    } catch (error) {
        console.error(error);
    }
}
async function updateUser(id, data) {
    try {
        await axios.put('http://127.0.0.1:8000/users/' + id + '/', data);
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
//return  array without subArray

function subArray(array, subArray) {
    var newArray = [];
    for (var i = 0; i < array.length; i++) {
        var isSub = false;
        for (var j = 0; j < subArray.length; j++) {
            if (array[i].Id == subArray[j]) {
                isSub = true;
            }
        }
        if (!isSub) {
            newArray.push(array[i]);
        }
    }
    return newArray;
}
function ManageAccount() {
    const [userInfo, setUserInfo] = useState({dateOfBirth: "2001-01-15",
    homeTown: "Ninh Bình",
    isAdmin: false,
    name: "Híu",
    password: "HOGS",
    phoneNumber: "08882111999",
    room:[11, 3],
    userID: "00001"});


    const [user, setUser] = useState([]);
    const [room, setRoom] = useState([]);
    const [updateRoom, setUpdateRoom] = useState([]);

    const [editName, setEditName] = useState(userInfo.name);
    const [editPhone,setEditPhone] = useState(userInfo.phoneNumber);
    const [editRoom, setEditRoom] = useState(userInfo.room);
    const [editId, setEditId] = useState(userInfo.userID);
    const [editHomeTown, setEditHomeTown] = useState(userInfo.homeTown);
    const [editDate, setEditDate] = useState(userInfo.dateOfBirth);
    const [editPassword, setEditPassword] = useState(userInfo.password);
    const [editAdmin, setEditAdmin] = useState(userInfo.isAdmin);


    const [editClickHander, setEditClickHander] = useState(false);
    const [addName, setAddName] = useState("");
    const [addPhone, setAddPhone] = useState("");
    const [addID, setAddID] = useState("");
    const [addDate, setAddDate] = useState("");
    const [addPass, setAddPass] = useState("");
    const [addHomeTown, setAddHomeTown] = useState("");
    const [addRoom, setAddRoom] = useState("");
    const [addAdmin, setAddAdmin] = useState("no");
    var isNotAdminStyle = addAdmin == 'no' ? { color: '#ff0000', fontWeight: '900' } : { color: '#000000' }
    var isAdminStyle = addAdmin == 'yes' ? { color: '#ff0000', fontWeight: '900' } : { color: '#000000' }
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
    
    function searching(e) {
        var keyword = e.target.value;
        searchUser(keyword).then(data => {
            setUser(data);
            if (data.length != 0) {
                setUserInfo(data[0]);
            }
        });
    }
    async function addUser() {
        if (addName !== "" && addPhone !== "" && addID !== "" && addDate !== "" && addPass !== "" && addHomeTown !== "" && addRoom !== "") {
            var userData = {
                "name": addName,
                "phoneNumber": addPhone,
                "userID": addID,
                "dateOfBirth": addDate,
                "password": addPass,
                "homeTown": addHomeTown,
                "room": addRoom,
                "isAdmin": addAdmin == 'no' ? false : true
            }
            await axios.post('http://127.0.0.1:8000/users/', userData);
            window.location.reload();
        }
        else {
            let addList = [addName, addPhone, addID, addDate, addPass, addHomeTown, addRoom];
            let addListstr = ['addName', 'addPhone', 'addID', 'addDate', 'addPass', 'addHomeTown', 'addRoom'];
            for (let data in addList) {
                if (addList[data] == "") {
                    document.getElementById(addListstr[data]).click();
                }
            }
            setTimeout(() => {
                for (let data in addList) {
                    document.getElementsByClassName("close")[6 - data].click();
                }
            }, 3000);

        }
    }
    function closeForm() {
        setAddName("");
        setAddPhone("");
        setAddID("");
        setAddDate("");
        setAddPass("");
        setAddHomeTown("");
        setAddRoom("");
        setAddAdmin("no");
    }
    function addUserToUserInfo(user){
        setUserInfo(user)
        setEditName(user.name)
        setEditPhone(user.phoneNumber)
        setEditRoom(user.room)
        setEditId(user.userID)
        setEditHomeTown(user.homeTown)
        setEditDate(user.dateOfBirth)
        setEditPassword(user.password)
        setEditAdmin(user.isAdmin)


    }
    function deleteUserRoom(room){
        let r = userInfo.room.filter(data => data != room)
        var userDataToDelRoom = {
            "name": editName,
            "phoneNumber": editPhone, 
            "userID": editId,
             "dateOfBirth": editDate,
              "password": editPassword, 
              "homeTown": editHomeTown, 
              "room": r,
              "isAdmin": user.isAdmin
        }
        setUserInfo(userDataToDelRoom);
        setEditRoom(r);
    }
    function updateUserRoom(room) {
        userInfo.room.push(Number(room))
        var userDataToUpdateRoom = {
            "name": editName,
            "phoneNumber": editPhone, 
            "userID": editId,
             "dateOfBirth": editDate,
              "password": editPassword, 
              "homeTown": editHomeTown, 
              "room": editRoom,
              "isAdmin": userInfo.isAdmin
        }
        setUserInfo(userDataToUpdateRoom);

    }
    function UserToUpdate() {
        var userDataToUpdateRoom = {
            "name": editName,
            "phoneNumber": editPhone, 
            "userID": editId,
            "dateOfBirth": editDate,
            "password": editPassword, 
            "homeTown": editHomeTown, 
            "room": editRoom,
            "isAdmin": editAdmin
        }
        console.log(userDataToUpdateRoom)
            updateUser(userDataToUpdateRoom.userID,userDataToUpdateRoom).then(data => {
            window.location.reload()
        });
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
                                user.length == 0 ? <tr><td colSpan='4'>Không có dữ liệu</td></tr> : user.map((us, index) => {
                                    return (
                                        <tr key={index} className="account" onClick={() => addUserToUserInfo(us)} style={us.userID == userInfo.userID ? clickStyle : UnclickStyle}>
                                            <td>{us.name}</td>
                                            <td>{us.phoneNumber}</td>
                                            <td>{us.userID}</td>
                                            <td>{us.isAdmin == true ? "Admin" : "User"}</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
            {
                // user.filter(it => it.userID == userInfo.userID).map((item, index) => {
                //     console.log(user.filter(it => it.userID == userInfo.userID))
                //     if (editClickHander) {
                //         return (
                    editClickHander?<div className='manage-account-content-right'>
                                <div className='dv-info-table'>
                                    <div className='right-header-title'>
                                        <h2 className='dv-name'>Edit Account</h2>
                                        <img className='edit-mem' src='../img/edit.png' alt='edit' onClick={() => setEditClickHander(false)} />
                                    </div>
                                    <hr width="99%" align="center" color='black' />
                                    <div className='account-inf'>
                                        <span>Họ và tên: </span>
                                        <input className='account-inf-value' placeholder={userInfo.name} onChange={(e)=>setEditName(e.target.value)} />
                                    </div>
                                    <div className='account-inf'>
                                        <span>SĐT:</span>
                                        <input className='account-inf-value' placeholder={userInfo.phoneNumber}  onChange={(e)=>setEditPhone(e.target.value)} />
                                    </div>
                                    <div className='account-inf'>
                                        <span>Số phòng:</span>

                                        <Popup trigger={<div className="account-inf-value">{userInfo.room[0] ? "Phòng: " + userInfo.room[0] : "Chưa có phòng"}</div>} position="top center" nested>
                                            {
                                                close => (
                                                    <div className="account-inf-value-border">
                                                        <div className="account-inf-value-top">
                                                            <h5>Danh sách  phòng hiện tại</h5>
                                                            <hr width="99%" align="center" color='black' />
                                                            <div className="room-inf-list">
                                                                {userInfo.room.map((rm, index) => {
                                                                    return (
                                                                        <div key={index} className="account-inf-value-ind">
                                                                            <span>Phòng {rm}</span>
                                                                            <button onClick={()=>deleteUserRoom(rm)}>xóa</button>
                                                                        </div>
                                                                    )
                                                                })}
                                                            </div>
                                                        </div>
                                                        <div className="account-inf-value-bottom">
                                                            <hr width="99%" align="center" color='black' />
                                                            <h5>Thêm phòng</h5>
                                                            <select  onChange={(e)=>{updateUserRoom(e.target.value)}} className="account-inf-value-input">
                                                                <option>Chọn phòng</option>
                                                                {
                                                                    subArray(room, userInfo.room).sort().map((rm, index) => {
                                                                        return (
                                                                            <option key={index}>{rm.Id}</option>
                                                                        )
                                                                    })
                                                                }
                                                            </select>
                                                            <button onClick={close} >Xác nhận</button>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        </Popup>

                                    </div>
                                    <div className='account-inf'>
                                        <span>CMND/CCCD:</span>
                                        <input className='account-inf-value' placeholder={userInfo.userID}  onChange={(e)=>setEditId(e.target.value)} />
                                    </div>
                                    <div className='account-inf'>
                                        <span>Quê quán: </span>
                                        <input className='account-inf-value' placeholder={userInfo.homeTown}  onChange={(e)=>setEditHomeTown(e.target.value)} />

                                    </div>
                                    <div className='account-inf'>
                                        <span>Ngày sinh: </span>
                                        <input className='account-inf-value' placeholder={userInfo.dateOfBirth} type="date"  onChange={(e)=>setEditDate(e.target.value)} />

                                    </div>
                                    <div className='account-inf'>
                                        <span>Mật khẩu: </span>
                                        <input className='account-inf-value' placeholder={userInfo.password}  onChange={(e)=>setEditPassword(e.target.value)} />
                                    </div>
                                </div>
                                <div className='trash-border'>
                                    <div className="confirm_edit">
                                        <button className="huybo" onClick={()=>setEditClickHander(false)}>Hủy bỏ</button>
                                        <button className="xacnhan"onClick={()=>UserToUpdate()}>Xác nhận</button>
                                    </div>
                                    <Popup trigger={<img src='../img/trash.png' alt='trash-img' className='trash-img' />} position="top center" nested>
                                        {close => (
                                            <div className='popup-overlay'>
                                                <div className='xoa-tb'>
                                                    <h2 style={{ fontSize: '40px' }}>Xác nhận xóa tài khoản?</h2>
                                                    <div className='cf-btn'>
                                                        <button className='cancel' onClick={close}>No</button>
                                                        <button onClick={() => delUser(userInfo.userID)} className='ok'>Yes</button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </Popup>
                                </div>
                            </div>
                    //     )
                    // }
                    // else {
                    //     return (
                            :<div className='manage-account-content-right'>
                                <div className='dv-info-table'>
                                    <div className='right-header-title'>
                                        <h2 className='dv-name'>Account Detail</h2>
                                        <img className='edit-mem' src='../img/edit.png' alt='edit' onClick={() => setEditClickHander(true)} />
                                    </div>
                                    <hr width="99%" align="center" color='black' />
                                    <div className='account-inf'>
                                        <span>Họ và tên: </span>
                                        <span className='account-inf-value'>{userInfo.name}</span>
                                    </div>
                                    <div className='account-inf'>
                                        <span>SĐT:</span>
                                        <span className='account-inf-value'>{userInfo.phoneNumber}</span>
                                    </div>
                                    <div className='account-inf'>
                                        <span>Số phòng:</span>
                                        <select>
                                            <option>Chọn phòng</option>
                                            {
                                                userInfo.room.map((rm, index) => {
                                                    return (
                                                        <option key={index}>{rm}</option>
                                                    )
                                                })
                                            }
                                        </select>
                                    </div>
                                    <div className='account-inf'>
                                        <span>CMND/CCCD:</span>
                                        <span className='account-inf-value'>{userInfo.userID}</span>
                                    </div>
                                    <div className='account-inf'>
                                        <span>Quê quán: </span>
                                        <span className='account-inf-value'>{userInfo.homeTown}</span>
                                    </div>
                                    <div className='account-inf'>
                                        <span>Ngày sinh: </span>
                                        <span className='account-inf-value'>{userInfo.dateOfBirth}</span>
                                    </div>
                                    <div className='account-inf'>
                                        <span>Mật khẩu: </span>
                                        <span className='account-inf-value'>{userInfo.password}</span>
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
                                                        <button onClick={() => delUser(userInfo.userID)} className='ok'>Yes</button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </Popup>
                                </div>
                            </div>
            //             )
            //         }
            //     })
            }
        </div>
        <div className='manage-account-footer'>
            <div className='map-view-part'>

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
                                        <span className='popup-inf'>Họ và tên: </span>
                                        <input type="text" onChange={e => setAddName(e.target.value)} />
                                        <Popup trigger={<div id='addName' className='popup_trigger'></div>} position="right center" nested>
                                            {close => (
                                                <div className='popup_border'><div className="close" onClick={close}></div><p>Vui lòng nhập họ và tên</p></div>

                                            )}
                                        </Popup>
                                    </div>
                                    <div className='account-inf'>
                                        <span className='popup-inf'>SĐT:</span>
                                        <input type="number" onChange={e => setAddPhone(e.target.value)} />
                                        <Popup trigger={<div id='addPhone' className='popup_trigger'></div>} position="right center" nested>
                                            {close => (
                                                <div className='popup_border'><div className="close" onClick={close}></div><p>Vui lòng nhập số điện thoại</p></div>
                                            )}
                                        </Popup>
                                    </div>
                                    <div className='account-inf'>
                                        <span className='popup-inf'>Số phòng:</span>
                                        <select id="addroom" onChange={e => setAddRoom([e.target.value])} disabled={addAdmin == 'no' ? false : true}>
                                            <option selected value="">Chọn phòng</option>
                                            {
                                                room.map((rm, index) => {
                                                    return (
                                                        <option key={index}>{rm.Id}</option>
                                                    )
                                                })
                                            }
                                        </select>
                                        <Popup trigger={<div id='addRoom' className='popup_trigger'></div>} position="right center" nested>
                                            {close => (
                                                <div className='popup_border'><div className="close" onClick={close}></div><p>Vui lòng chọn số phòng</p></div>
                                            )}
                                        </Popup>
                                    </div>
                                    <div className='account-inf'>
                                        <span className='popup-inf'>CMND/CCCD:</span>
                                        <input type="text" onChange={e => setAddID(e.target.value)} />
                                        <Popup trigger={<div id='addID' className='popup_trigger'></div>} position="right center" nested>
                                            {close => (
                                                <div className='popup_border'><div className="close" onClick={close}></div><p>Vui lòng nhập CMND/CCCD</p></div>
                                            )}
                                        </Popup>
                                    </div>
                                    <div className='account-inf'>
                                        <span className='popup-inf'>Quê quán: </span>
                                        <input type="text" onChange={e => setAddHomeTown(e.target.value)} />
                                        <Popup trigger={<div id='addHomeTown' className='popup_trigger'></div>} position="right center" nested>
                                            {close => (
                                                <div className='popup_border'><div className="close" onClick={close}></div><p>Vui lòng nhập Quê Quán</p></div>
                                            )}
                                        </Popup>
                                    </div>
                                    <div className='account-inf'>
                                        <span className='popup-inf'>Ngày sinh: </span>
                                        <input type="date" onChange={e => setAddDate(e.target.value)} />
                                        <Popup trigger={<div id='addDate' className='popup_trigger'></div>} position="right center" nested>
                                            {close => (
                                                <div className='popup_border'><div className="close" onClick={close}></div><p>Vui lòng nhập ngày tháng năm sinh</p></div>
                                            )}
                                        </Popup>
                                    </div>
                                    <div className='account-inf'>
                                        <span className='popup-inf'>Mật khẩu: </span>
                                        <input type="text" onChange={e => setAddPass(e.target.value)} />
                                        <Popup trigger={<div id='addPass' className='popup_trigger'></div>} position="right center" nested>
                                            {close => (
                                                <div className='popup_border'><div className="close" onClick={close}></div><p>Vui lòng nhập mật khẩu</p></div>
                                            )}
                                        </Popup>
                                    </div>
                                    <div className='account-inf'>
                                        <span className='popup-inf'>Quản trị viên: </span>
                                        <div className='isAdmin'>
                                            <div>
                                                <input type="radio" name="choice" id="b-opt" value="yes" onClick={e => { setAddAdmin(e.target.value); { setAddRoom(room.map(a => a.Id)) } }} />
                                                <label htmlFor="b-opt" style={isAdminStyle}>Yes</label>
                                            </div>
                                            <div>
                                                <input type="radio" name="choice" id="a-opt" value="no" checked onClick={e => { setAddAdmin(e.target.value); setAddRoom([document.getElementById("addroom").value]) }} />
                                                <label htmlFor="a-opt" style={isNotAdminStyle}>No</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='account-inf'>
                                        <div className='btn_border' onClick={close}>
                                            <button onClick={() => closeForm()}>Hủy bỏ</button>
                                        </div>
                                        <div className='btn_border'>
                                            <button onClick={() => addUser()}>Xác nhận</button>
                                        </div>
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