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

var characters = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTYUVWXYZ';
var result = ""
var chaactersLength = characters.length;
for ( var i = 0; i < 6 ; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * chaactersLength));
}

function ChangePassword() {
    const [user, setUser] = useState([]);
    const [phoneNum, setphoneNum] = useState(0);
    const [id, setId] = useState(0);
    const [pass, setPass] = useState("");
    const [code, setCode] = useState('');

    useEffect(() => {
        getUser().then(data => {
            setUser(data);
        });
    }, []);

    function UserToUpdate(result) {

        for (var x in user) {
            if (result !== code){
                window.alert("Mã xác nhận không đúng");
                window.location.reload();
                return;
            }
            else{
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
                        window.alert("Update mật khẩu thành công");
                        window.location.reload();

                    })
                    return;
                }
            }
            
        }
        window.alert("Số điện thoại hoặc CMND/CCCD không đúng");
        window.location.reload();
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
                            <div className="code">{result}</div>
                            <input className='code-input' type='text'  id='code'onChange={(e)=>setCode(e.target.value)}/>
                        </div>
                    </div>
                    <div className="button">
                        <Link className='btn' to="login"><button>Quay lại</button></Link>
                        <div className='btn'><button onClick={() => UserToUpdate(result)}>Đổi mật khẩu</button></div>
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