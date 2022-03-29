import "../css/viewroomlist.css";
import Popup from 'reactjs-popup';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';

async function getRoomList() {
    try {
        const response = await axios.get('http://127.0.0.1:8000/rooms/');
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
    useEffect(() => {
        getRoomList().then(data => {
            setRoomList(data);
        });
    }, []);
    useEffect(() => {
        getUser().then(data => {
            setUser(data);
        });
    }, []);
    function getUserName(id){
        for(let i = 0; i < user.length; i++){
            if(user[i].userID === id){
                return user[i].name;
            }
        }
    }

    return (
        <div className='view-room-list'>
            <div className="header">
                <Link to='manage-account' className='sophong logo-click'>
                    <img className="nav" src="../img/nav.png" alt="nav" />
                    <span>Manage Account </span>
                </Link>
                <Link to='/' className='logo-click'>
                    <div className="logo">
                        <img className='homelogo' src='./img/homelogo.png' alt="logo" />
                        <h2>Smart Home</h2>
                    </div>
                </Link>
                <div className="name">
                    <h1>Nguyễn Văn A</h1>
                    <img className="avt" src="../img/avt.jpg" alt="avtatar" />
                    <img className="nav" src="../img/nav.png" alt="nav" />
                </div>
            </div>
            <div className="list">
                <table cellSpacing='30px'>
                    <thead>
                        <tr>
                            <th>Phòng</th>
                            <th>Chủ sở hữu</th>
                            <th>Người thuê</th>
                            <th>Thông tin phòng</th>
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
                                                    return (
                                                        <p key={index}>{getUserName(us)}</p>
                                                    )
                                                }
                                            )
                                            }
                                        </td>
                                        <td className="room"><p className="chitiet">Xem chi tiết phòng</p></td>
                                        <td className="room"><img className="icon1-ls" src='../img/copy.png' alt="img" /></td>

                                        <Popup trigger={<td className="room"><img className="icon2-ls" src="../img/x.png" alt="img" /></td>} position="top center" nested>
                                            {close => (
                                                <div className='popup-overlay'>
                                                    <div className='xoa-tb'>
                                                        <h2>Xóa phòng {room.Id}</h2>
                                                        <div className='cf-btn'>
                                                            <button className='cancel' onClick={close}>No</button>
                                                            <button className='ok'>Yes</button>
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
                                    <p>Số phòng</p>
                                    <input type='text' />
                                </div>
                                <br />
                                <div className="inf">
                                    <p>Chủ sở hữu</p>
                                    <input type='text' />
                                </div>
                                <div className='cf-btn'>
                                    <button className='ok'>Xác nhận</button>
                                    <button className='cancel' onClick={close}>Hủy bỏ</button>
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