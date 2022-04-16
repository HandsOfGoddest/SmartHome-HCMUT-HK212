import { Link } from 'react-router-dom'
import '../css/loginpage.css'
import axios from 'axios';
import {useEffect, useState } from 'react';

async function getUser() {
    try {
        const response = await axios.get('http://127.0.0.1:8000/users/');
        return response.data;
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

function ChangePassword() {
    const [user, setUser] = useState([]);
    const [phoneNum, setphoneNum] = useState(0);
    const [id, setId] = useState(0);
    const [pass, setPass] = useState("");
    useEffect(() => {
        getUser().then(data => {
            setUser(data);
        });
    }, []);

    function UserToUpdate() {

        for (var x in user) {
            if (user[x].phoneNumber == phoneNum && user[x].userID == id){
                var userDataToUpdateRoom = {
                    "name": user[x].name,
                    "phoneNumber": user[x].phoneNumber,
                    "userID": user[x].userID,
                    "dateOfBirth": user[x].dateOfBirth,
                    "password": pass,
                    "homeTown": user[x].homeTown,
                    "room": user[x].room,
                    "isAdmin": user[x].isAdmin
                }
                updateUser(userDataToUpdateRoom.userID, userDataToUpdateRoom).then(data =>{
                    console.log(data);
                })
            }

        }
    }

    return (
        <div className="login-page">
            <div className="logo">
                <img className='homelogo' src='./img/homelogo.png' alt="logo" />
                <h2>Smart Home</h2>
            </div>
            <div className="dangnhap">
                <div className="title">
                    <h1>Đăng nhập</h1>
                </div>
                <div className="input-form">
                    <div className="sdt">
                        <p>Số điện thoại:</p>
                        <input className='input' type='text' onChange={(e) => setphoneNum(e.target.value)}/>
                    </div>
                    <div className="sdt">
                        <p>CMND/CCCD:</p>
                        <input className='input' type='text' onChange={(e) => setId(e.target.value)}/>
                    </div>
                    <div className="sdt">
                        <p>Mật khẩu mới:</p>
                        <input className='input' type='text' onChange={(e) => setPass(e.target.value)}/>
                    </div>
                    <div className="sdt">
                        <p>Mã xác nhận:</p>
                        <div className='input'>
                            <div className="code">A7CD35</div>
                            <input className='code-input' type='text' />
                        </div>
                    </div>
                    <div className="button">
                        <Link className='btn' to="#"><button>Hủy bỏ</button></Link>
                        <div className='btn'><button onClick={() => UserToUpdate()}>Đổi mật khẩu</button></div>
                    </div>
                    <div className='text'>
                        <p>Bạn chưa có tài khoản? <a href="mailto:danhauloc@gmail.com">Liên hệ</a> với chúng tôi</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default ChangePassword;