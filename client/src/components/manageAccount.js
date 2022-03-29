import Header from '../components/header';
import "../css/devices.css"
import "../css/adddevice.css"
import "../css/manageaccount.css"
import { Link } from 'react-router-dom';
import axios from 'axios';
import {useEffect,useState} from 'react';

async function getUser() {
    try {
      const response = await axios.get('http://127.0.0.1:8000/users/');
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

function ManageAccount() {
    const [user, setUser] = useState([]);
    useEffect(() => {
        getUser().then(data => {
            setUser(data);
        });
    }, []);
    console.log(user)
    return (
        <div className='manage-account'>
            <Header />
            <div className='manage-account-content'>
                <div className='manage-account-content-left'>
                    <div className='table-content'>
                        <table cellSpacing='0px'>
                            <thead>
                                <tr>
                                    <th>Họ và tên</th>
                                    <th>Số điện thoại</th>
                                    <th>CCCD/CMND</th>
                                </tr>

                            </thead>

                            <tbody>
                                <tr>
                                    <td>Đặng Hùng Cường</td>
                                    <td>0323654981</td>
                                    <td>6253000416987</td>
                                </tr>
                                {
                                    user.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{item.name}</td>
                                                <td>{item.phoneNumber}</td>
                                                <td>{item.userID}</td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className='manage-account-content-right'>
                    <div className='dv-info-table'>
                        <div className='right-header-title'>
                            <h2 className='dv-name'>Account Detail</h2>
                            <img className='edit-mem' src='../img/edit.png' alt='edit' />
                        </div>
                        <hr width="99%" align="center" color='black' />
                        <div className='account-inf'>
                            <span>Họ và tên: </span>
                            <input />
                        </div>
                        <div className='account-inf'>
                            <span>SĐT:</span>
                            <input />
                        </div>
                        <div className='account-inf'>
                            <span>Số phòng:</span>
                            <select>
                                <option>Chọn phòng</option>
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                            </select>
                        </div>
                        <div className='account-inf'>
                            <span>CMND/CCCD:</span>
                            <input />
                        </div>
                        <div className='account-inf'>
                            <span>Quê quán: </span>
                            <input />
                        </div>
                        <div className='account-inf'>
                            <span>Ngày sinh: </span>
                            <input />
                        </div>
                        <div className='account-inf'>
                            <span>Mật khẩu: </span>
                            <input />
                        </div>

                    </div>
                    <div className='trash-border'>
                        <img src='../img/trash.png' alt='trash-img' className='trash-img' />
                    </div>
                </div>
            </div>
            <div className='manage-account-footer'>
                <div className='map-view-part'>
                    <Link to='manage-view' className="map-view logo-click">
                        <img className="nav2" src="../img/nav.png" alt="nav" />
                        <div className='nav-border'>
                            <p>Manage Device</p>
                        </div>
                    </Link>
                </div>
                <div className='manage-account-center-part'>
                    <img className="add-mem" src="../img/add.png" alt="add" />
                    <div className="search">
                        <img src="../img/search.png" alt="search" />
                        <input type="text" placeholder="Search" />
                    </div>
                </div>
                <div className='map-view-part'>
                    <Link to='manage-view' className="manage-account-header logo-click">
                        <div className='nav-border'>
                            <p>Manage Account</p>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    )
}
export default ManageAccount;