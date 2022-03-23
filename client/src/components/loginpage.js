import { Link } from 'react-router-dom'
import '../css/loginpage.css'
function LoginPage() {
    var characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    var result = ""
    var chaactersLength = characters.length;

    for ( var i = 0; i < 6 ; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * chaactersLength));
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
                <form className="input-form">
                    <div className="sdt">
                        <p>Số điện thoại:</p>
                        <input className='input' type='number' />
                    </div>
                    <div className="sdt">
                        <p>Mật khẩu:</p>
                        <input className='input' type='password' />
                    </div>
                    <div className="sdt">
                        <p>Mã xác nhận:</p>
                        <div className='input'>
                            <div className="code">{result}</div>
                            <input className='code-input' type='text' />
                        </div>
                    </div>
                    <div className="button">
                        <Link className='btn' to="/"><button>Hủy bỏ</button></Link>
                        <Link className='btn' to="wellcome"><button type='submit'>Xác nhận</button></Link>
                    </div>
                    <div className='text'>
                        <Link to="forgot-password">Quên mật khẩu</Link>
                        <p>Bạn chưa có tài khoản? <a href="mailto:danhauloc@gmail.com">Liên hệ</a> với chúng tôi</p>
                    </div>
                </form>
            </div>
        </div>
    )
}
export default LoginPage;