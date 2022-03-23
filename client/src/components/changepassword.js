import { Link } from 'react-router-dom'
import '../css/loginpage.css'
function ChangePassword() {
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
                        <p>CMND/CCCD:</p>
                        <input className='input' type='number' />
                    </div>
                    <div className="sdt">
                        <p>Mật khẩu mới:</p>
                        <input className='input' type='text' />
                    </div>
                    <div className="sdt">
                        <p>Mã xác nhận:</p>
                        <div className='input'>
                            <div className="code">A7CD35</div>
                            <input className='code-input' type='text' />
                        </div>
                    </div>
                    <div className="button">
                        <Link className='btn' to="login"><button>Hủy bỏ</button></Link>
                        <Link className='btn' to="wellcome"><button type='submit'>Đổi mật khẩu</button></Link>
                    </div>
                    <div className='text'>
                        <p>Bạn chưa có tài khoản? <a href="mailto:danhauloc@gmail.com">Liên hệ</a> với chúng tôi</p>
                    </div>
                </form>
            </div>
        </div>
    )
}
export default ChangePassword;