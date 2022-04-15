import { Link } from "react-router-dom";
import '../css/wellcomepage.css'
import React, { useState } from 'react';
var TotalUser = false;
if(localStorage.getItem("user") != null){
    TotalUser = JSON.parse(localStorage.getItem("user"));
}
function WellcomePage() {
    const [logOut, setLogOut] = useState("")
    if(logOut === "logout"){
        window.location.replace("/login")
        console.log("logout")
    }
    return (
        <div className="welcome-page">
            <div className="header">
                <div className="logo">
                    <img className='homelogo' src='./img/homelogo.png' alt="logo" />
                    <h2>Smart Home</h2>
                </div>
                <div className="name">
                    <h1>{TotalUser.name}</h1>
                    <img className="avt" src="../img/avt.jpg" alt="avtatar" />
                    <select className='nav' onChange={(e)=>setLogOut(e.target.value)}>
                        <option value="" selected></option>
                        <option value="logout">Log Out</option>
                    </select>

                </div>
            </div>
            <div className="content">
                <img className="avt" src="../img/avt.jpg" alt="avtatar" />
                <div className="name-title">
                <h1>Xin chào </h1><h1>{TotalUser.name}</h1>
                </div>
                <div className="btn">
                    
                    <Link to="/manage-device"><button className='view-btn'>Manage view</button></Link>
                </div>
            </div>
        </div>
    )
}
export default WellcomePage;
