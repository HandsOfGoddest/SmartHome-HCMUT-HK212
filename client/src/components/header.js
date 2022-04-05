import { Link } from 'react-router-dom'
import '../css/header.css'
var TotalUser = JSON.parse(localStorage.getItem("user"));
function Header() {
    return (
        <div className="manage-view">
            <div className="header">
                <Link to='view-room-list' className='sophong logo-click'>
                        <img className="nav" src="../img/nav.png" alt="nav" />
                        <span>Phòng </span>
                        <span>217</span>
                </Link>
                <Link to='/' className='logo-click'>
                    <div className="logo">
                        <img className='homelogo' src='./img/homelogo.png' alt="logo" />
                        <h2>Smart Home</h2>
                    </div>
                </Link>
                <div className="name">
                    <h1>{TotalUser.name}</h1>
                    <img className="avt" src="../img/avt.jpg" alt="avtatar" />
                    <img className="nav" src="../img/nav.png" alt="nav" />
                </div>
            </div>

        </div>
    )
}
export default Header;