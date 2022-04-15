import { Link } from 'react-router-dom'
import '../css/header.css'
import React, { useState } from 'react'
var TotalUser = false;
if (localStorage.getItem("user") != null) {
    TotalUser = JSON.parse(localStorage.getItem("user"));
}
function Header() {
    const [logOut, setLogOut] = useState("")
    if (logOut === "view-room") {
        window.location.replace("/view-room-list")
    }
    if (logOut === "manage-account") {
        window.location.replace("/manage-account")
    }
    if (logOut === "manage-device") {
        window.location.replace("/manage-device")
    }
    if (logOut === "add-device") {
        window.location.replace("/add-device")
    }
    if (logOut === "logout") {
        window.location.replace("/login")
        console.log("logout")
    }
    return (
        <div className="manage-view">
            <div className="header">
                <div className='sophong logo-click' style={{ opacity: '0' }}>

                </div>
                <Link to='/' className='logo-click'>
                    <div className="logo">
                        <img className='homelogo' src='./img/homelogo.png' alt="logo" />
                        <h2>Smart Home</h2>
                    </div>
                </Link>
                <div className="name">
                    <h1>{TotalUser.name}</h1>
                    <img className="avt" src="../img/avt.jpg" alt="avtatar" />
                    {/* <img className="nav" src="../img/nav.png" alt="nav" /> */}
                    {TotalUser.isAdmin === true ? (<select className='nav' onChange={(e) => setLogOut(e.target.value)}>
                        <option value="" selected></option>
                        <option value="view-room">View room list</option>
                        <option value="manage-account">Manage account</option>
                        <option value="manage-device">Manage Device</option>
                        <option value="add-device">Add Device</option>
                        <option value="logout">Log Out</option>
                    </select>)
                        : (<select className='nav' onChange={(e) => setLogOut(e.target.value)}>
                            <option value="" selected></option>
                            <option value="logout">Log Out</option>
                        </select>)}
                </div>
            </div>

        </div>
    )
}
export default Header;