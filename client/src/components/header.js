import { Link } from 'react-router-dom'
import '../css/header.css'
import React, { useState } from 'react'
var TotalUser = JSON.parse(localStorage.getItem("user"));

function Header() {
    const [logOut, setLogOut] = useState("")
    if(logOut === "view-room"){
        window.location.replace("/view-room-list")
    }
    if(logOut === "logout"){
        window.location.replace("/login")
        console.log("logout")
    }
    return (
        <div className="manage-view">
            <div className="header">
                <div className='sophong logo-click'>
                    <select>
                        {
                            TotalUser.room.map((rm, index) => {
                                return (
                                    <option key={index} value={rm}>Phòng {rm}</option>
                                )
                            })
                        }
                    </select>
                        {/* <img className="nav" src="../img/nav.png" alt="nav" />
                        <span>Phòng </span>
                        <span>217</span> */}
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
                    <select className='nav' onChange={(e)=>setLogOut(e.target.value)}>
                        <option value="" selected></option>
                        <option value="view-room">View room list</option> 
                        <option value="logout">Log Out</option> 
                    </select>
                </div>
            </div>

        </div>
    )
}
export default Header;