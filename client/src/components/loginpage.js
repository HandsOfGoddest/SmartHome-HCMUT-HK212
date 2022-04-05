import { Link } from 'react-router-dom'
import '../css/loginpage.css'
import axios from 'axios'
import { useEffect, useState } from 'react'
async function getUser() {
    try {
        const response = await axios.get('http://127.0.0.1:8000/users/');
        return response.data;
    } catch (error) {
        console.error(error);
    }
}
var characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
var result = ""
var chaactersLength = characters.length;

for ( var i = 0; i < 6 ; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * chaactersLength));
}
function LoginPage() {
    const [user, setUser] = useState([]);
    useEffect(() => {
        getUser().then(data => {
            setUser(data);
        });
    }, []);
    const [phone, setPhone] = useState('');
    const [pass, setPass] = useState('');
    const [code, setCode] = useState('');
    console.log(phone)
    console.log(pass)
    console.log(code)
    function ConfirmLogin(result){
        let temp = -1;
        user.map((item, index) => {
            if(item.phoneNumber == phone && item.password == pass && result == code){
                temp = index;
            }
        })
        if(temp !== -1){
            localStorage.setItem('user', JSON.stringify(user[temp]));
            window.location.replace('/wellcome');
        }
        else{
            alert("Sai tài khoản hoặc mã xác nhận");
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
                        <input className='input' type='number' id='phone' onChange={(e)=>setPhone(e.target.value)}/>
                    </div>
                    <div className="sdt">
                        <p>Mật khẩu:</p>
                        <input className='input' type='password' id='pass'onChange={(e)=>setPass(e.target.value)}/>
                    </div>
                    <div className="sdt">
                        <p>Mã xác nhận:</p>
                        <div className='input'>
                            <div className="code">{result}</div>
                            <input className='code-input' type='text'  id='code'onChange={(e)=>setCode(e.target.value)}/>
                        </div>
                    </div>
                    <div className="button">
                        <Link className='btn' to="/"><button>Hủy bỏ</button></Link>
                        <div className='btn' ><button onClick={()=>ConfirmLogin(result)}>Xác nhận</button></div>
                    </div>
                    <div className='text'>
                        <Link to="forgot-password">Quên mật khẩu</Link>
                        <p>Bạn chưa có tài khoản? <a href="mailto:danhauloc@gmail.com">Liên hệ</a> với chúng tôi</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default LoginPage;