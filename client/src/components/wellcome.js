import { Link } from "react-router-dom";
import '../css/wellcomepage.css'
function wellcomePage() {
    return (
        <div className="wellcome-page">
            <div className="header">
                <div className="logo">
                    <img className='homelogo' src='./img/homelogo.png' alt="logo" />
                    <h2>Smart Home</h2>
                </div>
                <div className="name">
                    <h1>Nguyễn Văn A</h1>
                    <img className="avt" src="../img/avt.jpg" alt="avtatar" />
                    <img className="nav" src="../img/nav.png" alt="nav" />

                </div>
            </div>
            <div className="content">
                <img className="avt" src="../img/avt.jpg" alt="avtatar" />
                <div className="name-title">
                <h1>Xin chào </h1><h1>Nguyễn Văn A</h1>
                </div>
                <div className="btn">
                    <Link to="/map-view"><button className='view-btn'>Map view</button></Link>
                    <Link to="/manage-view"><button className='view-btn'>Manage view</button></Link>
                </div>
            </div>
        </div>
    )
}
export default wellcomePage;