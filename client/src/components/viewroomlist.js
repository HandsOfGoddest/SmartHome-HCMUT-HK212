import "../css/viewroomlist.css";
import Popup from 'reactjs-popup';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';
var TotalUser = false;
if (localStorage.getItem("user") != null) {
    TotalUser = JSON.parse(localStorage.getItem("user"));
}
async function getRoomList() {
    try {
        const response = await axios.get('http://127.0.0.1:8000/rooms/');
        return response.data;
    } catch (error) {
        console.error(error);
    }
}
async function addRoomList(data) {
    try {
        const response = await axios.post('http://127.0.0.1:8000/rooms/', data);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}
async function delRoomList(data) {
    try {
        const response = await axios.delete('http://127.0.0.1:8000/rooms/'+ data +'/');
        return response.data;
    } catch (error) {
        console.error(error);
    }
}
async function getUser() {
    try {
        const response = await axios.get('http://127.0.0.1:8000/users/');
        return response.data;
    } catch (error) {
        console.error(error);
    }
}
function ViewRoomList() {
    const [roomList, setRoomList] = useState([]);
    const [user, setUser] = useState([]);
    const [logOut, setLogOut] = useState("")


    if (logOut === "view-room") {
        window.location.replace("/view-room-list")
    }
    if (logOut === "manage-account") {
        window.location.replace("/manage-account")
    }
    if (logOut === "manage-device") {
        window.location.replace("/manage-device/"+TotalUser.room[0])
    }
    if (logOut === "add-device") {
        window.location.replace("/add-device")
    }
    if (logOut === "logout") {
        window.location.replace("/login")
        console.log("logout")
    }
    useEffect(() => {
        getRoomList().then(data => {
            setRoomList(data.reverse());
        });
    }, []);
    useEffect(() => {
        getUser().then(data => {
            setUser(data);
        });
    }, []);
    function getUserName(id) {
        for (let i = 0; i < user.length; i++) {
            if (user[i].userID === id) {
                return user[i].name;
            }
        }
    }

    function getIsAdmin(id) {
        for (let i = 0; i < user.length; i++) {
            if (user[i].userID === id) {
                return user[i].isAdmin;
            }
        }
    }    

    const [addRoomId, setAddRoomId] = useState("");
    const [addRoomOwner, setAddRoomOwner] = useState("");
    function addRoom() {
        if (addRoomId !== "" || addRoomOwner !== "") {
            const d = new Date();
            const data = {
                "Id": addRoomId,
                "owner": addRoomOwner,
                "users": [],
                "devices": [],
                "_date_created": d.toISOString()
            }
            addRoomList(data).then(data1 => {
                // console.log(data1)
                if(data1 == 409){
                    alert("Ph??ng " + data.Id + " ???? t???n t???i")
                }
                else{
                    alert("th??m ph??ng " + data1.Id + " th??nh c??ng")
                    window.location.reload()

                }
            })
        }
        else{
            alert("Vui l??ng nh???p ????? c??c th??ng tin")
        }
    }
    function delRoom(id){
        delRoomList(id).then(data => {
            if(data == 400){
                alert("Kh??ng th??? x??a ph??ng c?? ng?????i")
            }
            else{
                alert("X??a ph??ng " + id + " th??nh c??ng")
                window.location.reload()
            }
        })
    }
    return (
        <div className='view-room-list'>
            <div className="header">
                <div style={{ opacity: '0' }} className='sophong logo-click'>

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
                        <option value="" selected></option>
                        <option value="view-room">View room list</option>
                        <option value="manage-account">Manage account</option>
                        <option value="manage-device">Manage Device</option>
                        <option value="logout">Log Out</option>
                    </select>
                </div>
            </div>
            <div className="list">
                <table cellSpacing='30px'>
                    <thead>
                        <tr>
                            <th>Ph??ng</th>
                            <th>Ch??? s??? h???u</th>
                            <th>Ng?????i thu??</th>
                            <th>Th??ng tin ph??ng</th>
                        </tr>
                    </thead>
                    <tbody>

                        {
                            roomList.map((room, index) => {
                                return (
                                    <tr key={index}>
                                        <td className="room">{room.Id}</td>
                                        <td className="room"><p>{room.owner}</p></td>
                                        <td className="room ten">
                                            {room.users.map(
                                                (us, index) => {
                                                    if(getIsAdmin(us) === false){
                                                    return (
                                                        <p key={index}>{getUserName(us)}</p>
                                                    )
                                                    }
                                                }
                                            )
                                            }
                                        </td>
                                        <td className="room"><Link to={`manage-device/${room.Id}`} className="logo-click"><p className="chitiet">Xem chi ti???t ph??ng</p></Link></td>
                                        {/* <td className="room"><img className="icon1-ls" src='../img/edit.png' alt="img" /></td> */}

                                        <Popup trigger={<td className="room"><img className="icon2-ls" src="../img/x.png" alt="img" /></td>} position="top center" nested>
                                            {close => (
                                                <div className='popup-overlay'>
                                                    <div className='xoa-tb'>
                                                        <h2>X??a ph??ng {room.Id}</h2>
                                                        <div className='cf-btn'>
                                                            <button className='cancel' onClick={close}>No</button>
                                                            <button className='ok' onClick={()=>{delRoom(room.Id)}}>Yes</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </Popup>
                                    </tr>
                                    
                                )
                            })
                        }

                    </tbody>

                </table>
            </div>
            <div className="add">
                <Popup trigger={<img className="add-icon" src="../img/add.png" alt="add" />} position="top center" nested>
                    {close => (
                        <div className='popup-overlay'>
                            <div className='xoa-tb'>
                                <div className="inf">
                                    <p>S??? ph??ng</p>
                                    <input type='text' onChange={(e) => { setAddRoomId(e.target.value) }} />
                                </div>
                                <br />
                                <div className="inf">
                                    <p>Ch??? s??? h???u</p>
                                    <input type='text' onChange={(e) => { setAddRoomOwner(e.target.value) }} />
                                </div>
                                <div className='cf-btn'>
                                    <button className='ok' onClick={()=>{addRoom()}}>X??c nh???n</button>
                                    <button className='cancel' onClick={()=>{setAddRoomId('');setAddRoomOwner('')}}><p onClick={close}>H???y b???</p></button>
                                </div>
                            </div>
                        </div>
                    )}
                </Popup>

            </div>
        </div>
    )
}

export default ViewRoomList;