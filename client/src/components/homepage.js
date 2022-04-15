import '../css/homepage.css'
import { Link } from 'react-router-dom'
function HomePage(){
    return(
        <div className="homepage">
            <img className='homelogo' src='./img/homelogo.png' alt="logo"/>
            <h1>Smart Home</h1>
            <Link to="login"><button className='login-btn'>Đăng nhập</button></Link>
            
            <p>Bạn chưa có tài khoản? <a href="tel:0395114189">Liên hệ</a> với chúng tôi</p>
        </div>
    )
}
export default HomePage;
